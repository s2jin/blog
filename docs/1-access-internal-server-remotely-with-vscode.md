---
layout: minima
title: "vscode를 활용해 외부에서 내부망 서버 접속"
nav_order: 1
published_date: 2024-06-19
last_modified_date:2024-06-19
has_children: false
parent: Main
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

## 설정

1. code 설치 (vscode 제공)

```
snap install code --classic
```
  
2. tunnel 열기
```
code tunnel
```
↓

```
*
* Visual Studio Code Server
*
* By using the software, you agree to
* the Visual Studio Code Server License Terms (https://aka.ms/vscode-server-license) and
* the Microsoft Privacy Statement (https://privacy.microsoft.com/en-US/privacystatement).
*
[2023-11-25 19:38:47] info Using Github for authentication, run `code tunnel user login --provider <provider>` option to change this.
To grant access to the server, please log into https://github.com/login/device and use code 21A9-83D9
```

[https://github.com/login/device](https://github.com/login/device)에 접속해서 주어진 코드 입력

## 연결 계정 바꾸기

```
code tunnel user login --provider github
```
↓
```
To grant access to the server, please log into https://github.com/login/device and use code 0000-0000
```

→ 깃허브 로그인