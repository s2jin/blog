---
layout: minimal
title: Ubuntu에서 자소가 분리된 파일 복구하기
nav_order: 2
published_date: 2023-03-06
last_modified_date: 2023-03-06
has_children: false
parent: Linux
grand_parent: Main
---

- MacOS에서 저장된 한글 파일들의 자모가 리눅스에서 따로 떨어져나오는 현상이 발생한다.
- 원인은 유니코드 포맷(NFD와 NFC의 차이)이 달라서 생기는 문제이다.

```bash
convmv -r --nfc --nosmart -f UTF-8 -t UTF-8 --notest [DIRECTORY]
```

- `DIRECTORY` 부분을 파일명을 복구하고 싶은 디렉토리 경로로 지정해준다.
