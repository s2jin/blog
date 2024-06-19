---
layout: minimal
title: Linux 서버 사용자 추가 + SAMBA 설정
nav_order: 1
published_date: 2023-05-18
last_modified_date: 2023-05-18
has_children: false
parent: Linux
grand_parent: Main
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

## 01. 리눅스 서버 사용자 추가

1. 사용자를 추가한다. (adduser 명령어의 경우 홈 디렉토리도 함께 생성한다.)

```bash
sudo adduser [USERNAME]
```

2. 사용자의 권한을 할당한다.

```bash
sudo vi /etc/group

## in /etc/group
sudo:x:user1,user2, ... # <- 사용자 아이디 추가
```


## 02. SAMBA 설정

다른 컴퓨터에서 파일 탐색기를 통해 해당 서버의 디렉토리에 접근하고자 할 때 필요한 설정이다.

1. samba 사용자를 추가한다.

```bash
sudo smbpasswd -a [USERNAME]
```

2. samba 설정 파일에 유저 정보를 추가한다.
    1. `[NAME]`: samba 접속 시 사용할 경로, path의 별칭
    2. `path`: 해당 이름으로 접속했을 때 연결할 디렉토리
    3. `valid users`: 해당 경로에 접근할 수 있는 사용자 아이디

```python
## in /etc/samba/smb.conf

#======================= Share Definitions =======================
...

[sujin_home]
   path = /home/sujin
   valid users = sujin
   read only = no
   writable = yes
   public = no
   browseable = yes
   printable = no
   create mask = 0750

[sujin_data1]
   path = /mnt/data1/sujin
   valid users = sujin
   read only = no
   writable = yes
   public = no
   browseable = yes
   printable = no
   create mask = 0750

[specific_dir_shared]
   path = /mnt/data1/sujin/project_A
   read only = no
   writable = yes
   public = yes
   browseable = yes
   printable = no
   create mask = 0750
   
...
```


### 1) samba 접속

#### MacOS

1. Finder에서 `이동 > 서버에 연결` 또는 `command + k`로 네트워크 서버 연결 창에 접속한다.
2. `smb://[SERVER_IP or DNS]/[NAME]/[DIR_PATH]`와 같은 형식을 입력한다.
	1. (예) `smb://10.100.00.000/sujin_home/project_B/documents`  
	   → `10.100.00.000` 서버의 `sujin_home(=/home/sujin)` 디렉토리 아래 `project_B/documents` 디렉토리를 연결  


## 03. 방문자 계정으로 접근하기

접근하고자 하는 서버의 디렉토리에 특정 사용자가 아닌 방문자 권한으로 접근하고자 할 때,  
1. samba 설정 파일 `/etc/samba/smb.conf`의 `hosts allow`에 본인 기기의 ip를 추가해야 한다.


#### 🅐 연구실 공유 디렉토리 접근을 위한 설정 예시

<input type="text" placeholder="password" id="inputString" onkeyup="if(window.event.keyCode==13){callApi('share_dir_server_example.md')}" style="margin:0px auto; display:block;text-align:center;"/>
<div id="resultContainer"></div>
