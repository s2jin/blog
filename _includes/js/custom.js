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

