---
layout: minimal
title: "RTX A6000에서 cuda 및 pytorch 설정"
nav_order: 6
published_date: 2023-03-07
last_modified_date: 2024-06-19
has_children: false
parent: Linux
grand_parent: Main
---

RTX A6000은 cuda capability가 8.6으로 높기 때문에 cuda와 pytorch 버전 아래와 같은 오류가 발생할 수 있다.

```
/home/sujin/venv/venv_paper_kisti/lib/python3.6/site-packages/torch/cuda/__init__.py:106: UserWarning:
NVIDIA RTX A6000 with CUDA capability sm_86 is not compatible with the current PyTorch installation.
The current PyTorch install supports CUDA capabilities sm_37 sm_50 sm_60 sm_70.
If you want to use the NVIDIA RTX A6000 GPU with PyTorch, please check the instructions at https://pytorch.org/get-started/locally/

...

RuntimeError: CUDA error: no kernel image is available for execution on the device
CUDA kernel errors might be asynchronously reported at some other API call,so the stacktrace below might be incorrect.
For debugging consider passing CUDA_LAUNCH_BLOCKING=1.
```

(2022.08.04.)  
동작이 확인된 설정은 다음과 같다.  

- CUDA 11.3
- Nvidia-Driver 515.65.01
- pip3 install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu113

```
pytorch-crf==0.7.2
torch==1.10.1+cu113
torchaudio==0.10.1+cu113
torchvision==0.11.2
transformers==4.18.0
```

서버의 라이브러리 환경변수 설정을 위해 alias를 `.bashrc`에 추가하였다.

```bash
alias cuda113='export LD_LIBRARY_PATH="" && export LD_LIBRARY_PATH=/usr/local/cuda-11.3/lib64:$LD_LIBRARY_PATH && export PATH=/usr/local/cuda-11.3/bin:$PATH'
```