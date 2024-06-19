---
layout: minimal
title: "iTerm2에서 한글이 깨질 때"
nav_order: 7
published_date: 2024-06-19 
last_modified_date:2024-06-19
has_children: false
parent: Linux
grand_parent: Main
mathjax: false
---

<br/>
<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-gamma }
- TOC
{:toc}
</details>
<br/>

## 문제 상황

- terminal에서 한글이 제대로 문자로 입력되지 않고 엉뚱하게 동작함

## 해결

### 1) 터미널 자체에서 한글이 안될 때

`~/.bashrc` 또는 `~/.bash_profile`에 다음 코드를 추가하고 bash shell을 재시작

```bash
export LC_CTYPE="ko_KR.UTF-8"
```

### 2) vim에서만 한글이 안될 때

`~/.vimrc`에 다음 코드 추가

```bash
set encoding=utf-8
```

### 3) macOS에서 쉘에 한글을 쓰는건 되지만 파일, 폴더명의 한글이 ???으로 나오고 python 실행 시 한글 입력이 안되는 현상

`~/.bashrc` 또는 `~/.bash_profile`에 다음 코드를 추가하고 bash shell을 재시작

```
export LC_LANG='kr_KR.UTF-8'
```