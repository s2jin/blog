const { SitemapStream, streamToPromise } = require("sitemap")

/** SECRET POST API **/
function callApi(filename) {
    var inputString = document.getElementById('inputString').value;  // 입력된 문자열 가져오기
    $.get({ // API 호출
        url: 'https://air.changwon.ac.kr/~airdemo/blog_api/api',
        data: { filename: filename, password: inputString },
        success: function(response) { displayResult(response.result); },  // API 호출이 성공하면 결과를 출력
        error: function(error) { displayResult('API 호출 오류: ' + error.statusText); }   // API 호출이 실패하면 오류 메시지 출력
    });
}
function displayResult(result) {
    var resultContainer = document.getElementById('resultContainer');  // 결과를 출력할 요소 가져오기
    resultContainer.innerHTML = '<div>' +result + '</div>'; // 결과를 요소에 추가
}


/** SITEMAP **/
function generateSitemap(links) {
  const stream = new SitemapStream({
    hostname: "https://s2jin.github.io/blog/",
    lastmodDateOnly: true,
  })
  streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
      fs.writeFile("sitemap.xml", data.toString(), (err) => {
        if (err) {
          console.log(err)
        }
      })
    },
  )
}

function escapeCodeBlock(body) {
  const regex = /```([\s\S]*?)```/g
  return body.replace(regex, function(match, htmlBlock) {
    return "{% raw %}\n```" + htmlBlock + "```\n{% endraw %}"
  })
}

function convertLazyImage(body) {
  const regex = /!\[([\s\S]*?)\]\(https:\/\/devshjeon-blog-images([\s\S]*?)\)/g
  return body.replace(regex, function(match) {
    return `{% include lazyload.html image_src="${match.split("(")[1].slice(0, -1)}" %}`
  })
}

(async () => {
  // ensure directory exists
  const root = `docs`
  const imageRoot = "_images"

  const databaseId = process.env.DATABASE_ID
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      "and": [
        {
          property: "공개",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
  })

  const links = []

  for (const r of response.results) {
    const id = r.id
    let pk = r.properties?.["ID"]?.["unique_id"]?.["number"]

    // 배포
    let isPublished = r.properties?.["배포"]?.["checkbox"] || false
    let modifiedDate = moment(r.last_edited_time).tz("Asia/Seoul").format("YYYY-MM-DD")

    // 사이트맵
    links.push(
      {
        url: `/${pk}`,
      },
    )

    // 배포인 경우에만 파일 생성
    if (isPublished) {
      // 최상위폴더
      let upUpFolder = ""
      let pUpUpFolder = r.properties?.["최상위폴더"]?.["rich_text"]
      if (pUpUpFolder) {
        upUpFolder = pUpUpFolder[0]?.["plain_text"]
      }

      // 상위폴더
      let upFolder = ""
      let pUpFolder = r.properties?.["상위폴더"]?.["rich_text"]
      if (pUpFolder) {
        upFolder = pUpFolder[0]?.["plain_text"]
      }

      // 순번
      let navOrder = r.properties?.["순번"]?.["number"] || ""

      // 제목
      let title = id
      let pTitle = r.properties?.["제목"]?.["title"]
      if (pTitle?.length > 0) {
        title = pTitle[0]?.["plain_text"]
      }

      // 메인
      let hasChild = r.properties?.["메인"]?.["checkbox"] || false

      // 작성일
      let publishedDate = moment(r.created_time).tz("Asia/Seoul").format("YYYY-MM-DD")

      let header = `---
layout: default
title: ${title}
has_children: ${hasChild}
published_date: ${publishedDate}
last_modified_date: ${modifiedDate}`
      if (navOrder) {
        header += `
nav_order: ${navOrder}`
      }

      if (hasChild) {
        if (upFolder) {
          header += `
parent: ${upUpFolder}`
        }
      } else {
        header += `
grand_parent: ${upUpFolder}`
        if (upFolder) {
          header += `
parent: ${upFolder}`
        }
      }
      header += `
permalink: '${pk}'`
      header += `
---`

      const folderPath = upFolder ? `${root}/${upUpFolder}/${upFolder}` : `${root}/${upUpFolder}`
      const imagePath = upFolder ? `${imageRoot}/${upUpFolder}/${upFolder}/${title}` : `${imageRoot}/${upUpFolder}/${title}`
      fs.mkdirSync(folderPath, { recursive: true })

      const mdBlocks = await n2m.pageToMarkdown(id)
      let body = n2m.toMarkdownString(mdBlocks)["parent"]

      // code block escape
      body = escapeCodeBlock(body)

      // download image
      const imageUrls = findImageUrl(body)
      if (imageUrls.length > 0) {
        fs.mkdirSync(imagePath, { recursive: true })
        const s3Urls = await downloadImages(imagePath, imageUrls)
        body = replaceUrl(body, imageUrls, s3Urls)
      }

      body = convertLazyImage(body)

      //writing to file
      const fTitle = `${pk}.md`
      fs.writeFile(path.join(folderPath, fTitle), header + body, (err) => {
        if (err) {
          console.log(err)
        }
      })
    }
  }

  generateSitemap(links)
})()
