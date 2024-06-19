---
layout: minimal
title: "우분투 터미널에서 서버 정보 바로 확인하기"
nav_order: 3
published_date: 2023-08-25
last_modified_date: 2024-06-19
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

## OS 버전 확인
```bash
cat /etc/issue
```

##  리눅스 버전 확인
```bash
cat /proc/version
```

### 리눅스 서버 시리얼넘버 확인
```bash
[root@zetawiki ~]# dmidecode | grep 'Serial Number' | head -1
        Serial Number: SGH135ACE7

[root@zetawiki ~]# dmidecode -s system-serial-number
SGH135ACE7

[root@zetawiki ~]# dmidecode -s system-serial-number
# SMBIOS implementations newer than version 2.7 are not
# fully supported by this version of dmidecode.
SGH357NPRT

[root@zetawiki ~]# dmidecode -s system-serial-number | tail -1
SGH357NPRT

[root@zetawiki ~]# dmidecode -s system-serial-number
VMware-57 9d 13 6d f8 a0 24 7f-91 be ad 35 8b a0 2e a4

root@zetawiki:~# dmidecode -s system-serial-number
d24f6be8-a035-7c91-4fbd-68a025c79136
```

---

## GPU 확인
```bash
lspci -v | grep VGA
```

## CUDA 버전 확인
```bash
nvcc --version
```

## NVIDIA 드라이버 버전 확인
```bash
cat /proc/driver/nvidia/version
```
or
```bash
nvidia-smi
```

---

## 전체 CPU 정보 확인
```bash
cat /proc/cpuinfo
```

#### 논리 코어 수 확인
```bash
grep -c processor /proc/cpuinfo
```

#### 물리 CPU 개수 확인
```bash
grep “physical id” /proc/cpuinfo | sort -u | wc -l
```

#### CPU당 물리 코어 수 확인
```bash
grep “cpu cores” /proc/cpuinfo | tail -1
```

#### CPU 비트 확인(x86, x64, etc.)
```bash
 arch
```

## 램 확인
```bash
sudo dmidecode -t 17 | egrep 'Memory|Size' | grep B | sort | uniq -c
```

---

## 맥 주소(MAC address) 확인

|     | 윈도우               | 맥, 리눅스        |
| --- | -------------------- | ----------------- |
| ⓵   | `cmd`를 열고         | `terminal`을 열고 |
| ⓶   | `ifconfig /all` 입력 | `ifconfig` 입력   |
| ⓷   | "물리적 주소" 확인   | "ether" 확인      |

- MacOS의 경우 다음 방법으로도 확인 가능하다.
    - 12 "Monterey" 이하: `모니터 왼쪽 위 애플 로고 > 이 맥에 관하여 > 시스템 리포트 > 네트워크 > 위치 > 이더넷: 하드웨어(MAC) 주소`
    - 13 "Ventura" 이상: `시스템 환경설정 > 일반 > 정보 > 시스템 리포트 > 네트워크 > 위치 > 이더넷: 하드웨어(MAC) 주소`
- 랜카드가 여러개이면 여러 개의 ether가 나타날 수 있으며, 랜선이 꽂혀있는 랜카드의 맥 주소를 사용해야 인터넷이 제대로 동작한다.
- 리눅스의 경우 보통 `flags=4163<UP,BRODCAST, RUNNING, MULTICAST>`인 맥 주소에 대해 IP를 할당받음

## 하드디스크 정보 확인

#### 방법 1. 설치 불필요
```bash
# 확인하려는 디스크 이름 확인
df -h .

# 하드디스크 모델명 확인
$ cat /proc/scsi/scsi
Attached devices:
Host: scsi2 Channel: 00 Id: 00 Lun: 00
  Vendor: ATA      Model: INTEL SSDSC2KB48 Rev: 0110
  Type:   Direct-Access                    ANSI  SCSI revision: 05
Host: scsi3 Channel: 00 Id: 00 Lun: 00
  Vendor: ATA      Model: Micron_5300_MTFD Rev: U001
  Type:   Direct-Access                    ANSI  SCSI revision: 05


# 시리얼넘버 확인
$ sudo hdparm -I /dev/sdb1 | grep Serial
    Serial Number:      2020283EF6E1
    Transport:          Serial, ATA8-AST, SATA 1.0a, SATA II Extensions, SATA Rev 2.5, SATA Rev 2.6, SATA Rev 3.0
```

#### 방법 2. 설치 필요
```bash
# 툴 설치
sudo apt-get install smartmontools


# 디스크 정보 확인
$ sudo smartctl -i /dev/sdd1
[sudo] password for sujin:
smartctl 6.6 2016-05-31 r4324 [x86_64-linux-4.15.0-112-generic] (local build)
Copyright (C) 2002-16, Bruce Allen, Christian Franke, www.smartmontools.org


=== START OF INFORMATION SECTION ===
Device Model:     ST1000LM048-2E7172
Serial Number:    WQ911016
LU WWN Device Id: 5 000c50 0c09a98d3
Firmware Version: 0001
User Capacity:    1,000,204,886,016 bytes [1.00 TB]
Sector Sizes:     512 bytes logical, 4096 bytes physical
Rotation Rate:    5400 rpm
Form Factor:      2.5 inches
Device is:        Not in smartctl database [for details use: -P showall]
ATA Version is:   ACS-3 T13/2161-D revision 3b
SATA Version is:  SATA 3.1, 6.0 Gb/s (current: 6.0 Gb/s)
Local Time is:    Thu Aug 27 10:04:10 2020 KST
SMART support is: Available - device has SMART capability.
SMART support is: Enabled
```

#### (+) 하드디스크 장치명 해석
```bash
 <참고>
 하드디스크의 장치명으로 타입 알아내기
 /dev/hda : 첫번째 Master 장치
 /dev/hdb : 첫번째 Slave 장치
 /dev/hdc : 두번째 Master 장치
 /dev/hdd : 두번째 Slave 장치
 /dev/sda : 첫번째 SCSI 또는 S-ATA
 /dev/sdb : 두번째 SCSI 또는 S-ATA
 /dev/sdc : 세번째 SCSI 또는 S-ATA
```

