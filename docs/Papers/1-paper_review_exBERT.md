---
layout: minimal
title: "[논문리뷰] exBERT: Extending Pre-trained Models with Domain-specific Vocabulary Under Constrained Training Resources"
nav_order: 1
published_date: 2022-05-17
last_modified_date: 2023-06-09
has_children: false
parent: Papers
grand_parent: Main
mathjax: true
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

```latex
@inproceedings{tai2020exbert,
  title={exBERT: Extending pre-trained models with domain-specific vocabulary under constrained training resources},
  author={Tai, Wen and Kung, HT and Dong, Xin Luna and Comiter, Marcus and Kuo, Chang-Fu},
  booktitle={Findings of the Association for Computational Linguistics: EMNLP 2020},
  pages={1433--1439},
  year={2020}
}
```

- **GitHub**:  https://github.com/cgmhaicenter/exBERT


## Abstract

- <a title="exBERT uses a small extension module to learn to adapt an augmenting embedding for the new domain in the context of the original BERT’s embedding of a general vocabulary." >🪶</a> exBERT는 원래 BERT의 일반 어휘 임베딩 문맥에서 새로운 도메인을 위한 증강 임베딩을 적응하는 작은 확장 모듈을 사용한다.

- <a title="The exBERT training method is novel in learning the new vocabulary and the extension module while keeping the weights of the original BERT model fixed, resulting in a substantial reduction in required training resources." >🪶</a> exBERT 훈련 방법은 새로운 어휘와 확장 모듈을 학습하는 동안 원래 BERT 모델의 가중치를 고정하여 필요한 훈련 자원을 크게 줄인다.

- <a title="We pre-train exBERT with biomedical articles from ClinicalKey and PubMed Central, and study its performance on biomedical downstream benchmark tasks using the MTL-Bioinformatics-2016 dataset." >🪶</a> ClinicalKey와 PubMed Central의 생의학 기사로 exBERT를 사전 학습하고, MTL-Bioinformatics-2016 데이터셋을 사용하여 생의학 다운스트림 벤치마크 작업에서의 성능을 확인한다.

- <a title="We demonstrate that exBERT consistently outperforms prior approaches when using limited corpus and pre-training computation resources." >🪶</a> 제한된 말뭉치와 사전 학습 계산 자원을 사용할 때 exBERT가 이전 접근 방식을 일관되게 능가함을 입증합니다.


## 1. Introduction

- <a title="Pre-trained language representation models have led to breakthrough performance improvements in downstream natural language processing (NLP) tasks including named entity recognition (Sang and De Meulder, 2003), question answering (Rajpurkar et al., 2016), and sentence classification (Socher et al., 2013)." >🪶</a> 사전 학습된 언어 표현 모델은 NER(Sang and De Meulder, 2003), 질문 응답(Rajpurkar et al., 2016), 문장 분류(Socher et al., 2013)를 포함한 다운스트림 자연어 처리 작업에서 획기적인 성능 향상을 이끌어냈다.
- <a title="However, pre-trained language models face two challenges as their applications expand:" >🪶</a> 그러나 사전 학습된 언어 모델은 그 적용이 확대됨에 따라 <mark style="background: #eeeeee; color:#3b454e;">두 가지 어려움</mark>에 직면한다:
  - <a title="1) Large Training Resources: Training requires substantial computation and data, see, e.g., BERT-large (Devlin et al., 2018), RoBERTa (Liu et al., 2019)." >🪶</a> 1) **<mark style="background: #eeeeee; color:#3b454e;">대규모 학습 자원</mark>**: 훈련에는 막대한 계산과 데이터가 필요 (BERT-large(Devlin et al., 2018), RoBERTa(Liu et al., 2019))

  - <a title="2) Embedding of Domain-specific Vocabulary: A specialized domain, such as the biomedical domain on which this work focuses, has its own vocabulary, and sentences in the domain may have words from both the original language model’s vocabulary and new domain-specific vocabulary." >🪶</a> 2) **<mark style="background: #eeeeee; color:#3b454e;">도메인 특화 어휘의 임베딩</mark>**: 여기서 초점을 맞추고 있는 생의학 도메인과 같은 특수 도메인은 고유의 어휘를 가지며, 도메인의 문장에는 원래 언어 모델의 어휘와 새로운 도메인 특화 어휘가 모두 포함될 수 있음.

- <a title="Being able to operate on this mixture of vocabulary is essential in achieving high performance on downstream tasks in the new domain (Garneau et al., 2019)." >🪶</a> 이 혼합된 어휘를 처리할 수 있는 능력은 새로운 도메인에서의 다운스트림 작업에서 높은 성능을 달성하는 데 필수적이다(Garneau et al., 2019).
- <a title="These challenges are particularly pronounced in biomedical domains, where there are many domain-specific words." >🪶</a> 이 어려움은 많은 도메인 특화 단어가 있는 생의학 도메인에서 특히 두드러진다.
- <a title="Prior approaches have addressed these issues by either constructing the pre-trained model from scratch with a new vocabulary (e.g., SciBERT (Beltagy et al., 2019)) or adapting the existing pre-trained model by using it as the initial model in learning vocabulary embeddings for the new domain (e.g., BioBERT (Lee et al., 2019))." >🪶</a> 이전 접근 방식은 새로운 어휘로 <mark style="background: #eeeeee; color:#3b454e;">사전 학습된 모델을 처음부터 구성</mark>하거나(SciBERT(Beltagy et al., 2019)), <mark style="background: #eeeeee; color:#3b454e;">기존 사전 학습된 모델을 새로운 도메인의 어휘 임베딩을 학습하는 초기 모델로 사용</mark>하여 적응시키는 방식(BioBERT(Lee et al., 2019))으로 이러한 문제를 해결해 왔다.
- <a title="However, constructing the model with a new vocabulary from scratch requires substantial computational resources and training data." >🪶</a> 그러나 새로운 어휘로 처음부터 모델을 구성하는 것은 막대한 계산 자원과 훈련 데이터를 필요로 한다.
- <a title="Adapting the existing pre-trained model leads to sub-optimal performance on downstream tasks because the original vocabulary may not be proper for biomedical domains (Garneau et al., 2019; Hu et al., 2019)." >🪶</a> 기존 사전 학습된 모델을 적응시키는 것은 원래의 어휘가 생의학 도메인에 적합하지 않을 수 있기 때문에 다운스트림 작업에서 최적 성능보다 낮은 성능을 초래한다(Garneau et al., 2019; Hu et al., 2019).
- <a title="We propose exBERT, a novel approach that addresses these challenges by explicitly incorporating the new domain’s vocabulary, while being able to reuse the original pre-trained model’s weights as is to reduce required computation and training data." >🪶</a> 우리는 이러한 문제를 해결하기 위해 새로운 도메인의 어휘를 명시적으로 통합하면서 <mark style="background: #eeeeee; color:#3b454e;">원래의 사전 학습된 모델의 가중치를 그대로 재사용</mark>하여 <mark style="background: #eeeeee; color:#3b454e;">필요한 계산과 학습 데이터를 줄이는</mark> 혁신적인 접근 방식인 exBERT를 제안한다.
- <a title="Specifically, exBERT extends BERT by augmenting its embeddings for the original vocabulary with new embeddings for the domain-specific vocabulary via a learned small 'extension' module." >🪶</a> 구체적으로, exBERT는 학습된 작은 "확장" 모듈을 통해 원래 어휘에 대한 임베딩을 도메인 특화 어휘에 대한 새로운 임베딩으로 증강하여 BERT를 확장한다.
- <a title="The output of the original and extension modules are combined via a trainable weighted sum operation." >🪶</a> 원래 모듈과 확장 모듈의 출력은 학습 가능한 가중 합 연산을 통해 결합된다.
- <a title="exBERT after pre-training achieves higher performance than the BioBERT adaption method under constrained training resources when evaluated on two biomedical downstream benchmark NLP tasks: name entity recognition (NER) (Do˘gan et al., 2014; Li et al., 2016) and relation extraction (RE) (Bhasuran and Natarajan, 2018)." >🪶</a> 사전 학습 후 exBERT는 제한된 학습 자원 하에서 두 가지 생의학 다운스트림 벤치마크 NLP 작업, 즉 NER(Doğan et al., 2014; Li et al., 2016) 및 관계 추출(Bhasuran and Natarajan, 2018) 평가에서 BioBERT 적응 방법보다 높은 성능을 달성한다.
- <a title="The primary contribution of this paper is a pre-training method allowing low-cost embedding of domain-specific vocabulary in the context of an existing large pre-trained model such as BERT." >🪶</a> 이 논문의 주요 기여는 BERT와 같은 기존의 대규모 사전 학습된 모델의 문맥에서 도메인 특화 어휘를 저비용으로 임베딩할 수 있는 사전 학습 방법을 제공하는 것이다.


## 2. Related Work

- <a title="Learning representations of natural languages is useful for a variety of NLP tasks (McCann et al., 2017; Liu et al., 2019)." >🪶</a> 자연어의 표현을 학습하는 것은 다양한 NLP 작업에 유용합니다(McCann et al., 2017; Liu et al., 2019).

- <a title="It has been demonstrated that larger model size and corpus size benefit performance (Radford et al., 2019)." >🪶</a> 모델 크기와 말뭉치 크기가 클수록 성능이 향상된다는 것이 입증되었습니다(Radford et al., 2019).

- <a title="A widely used pre-training model, BERT (Devlin et al., 2018), is a transformer-based model (Vaswani et al., 2017) pre-trained with a masked language model and next sentence prediction task." >🪶</a> 널리 사용되는 사전 학습 모델인 BERT(Devlin et al., 2018)는 마스킹 언어 모델과 다음 문장 예측 작업으로 사전 학습된 트랜스포머 기반 모델입니다(Vaswani et al., 2017).

- <a title="The vocabulary used by BERT contains words and subwords extracted from a general language corpus (English Wikipedia and BooksCorpus) by WordPiece (Wu et al., 2016)." >🪶</a> BERT에서 사용되는 어휘는 WordPiece(Wu et al., 2016)에 의해 일반 언어 말뭉치(영어 위키피디아 및 BooksCorpus)에서 추출된 단어와 서브워드로 구성되어 있습니다.

- <a title="To get a biomedical domain-specific pre-training language model, BioBERT (Lee et al., 2019) continues training the original BERT model with a biomedical corpus without changing the BERT’s architecture or the vocabulary, and achieves improved performance in several biomedical downstream tasks." >🪶</a> 생의학 도메인 특화 사전 학습 언어 모델을 얻기 위해 BioBERT(Lee et al., 2019)는 BERT의 아키텍처나 어휘를 변경하지 않고 생의학 말뭉치로 원래 BERT 모델을 계속 학습하여 여러 생의학 다운스트림 작업에서 성능을 향상시켰습니다.

- <a title="However, the use of original BERT’s general vocabulary often splits a domain-specific word into several sub-words, making the training much more challenging." >🪶</a> 그러나 원래 BERT의 일반 어휘를 사용하면 도메인 특화 단어가 여러 개의 서브워드로 분할되어 학습이 훨씬 더 어려워집니다.

- <a title="SciBERT (Beltagy et al., 2019) compares the vocabulary extracted from general and scientific articles, and finds 58% of the scientific vocabulary is not included in the original BERT’s vocabulary." >🪶</a> SciBERT(Beltagy et al., 2019)는 일반 기사와 과학 기사에서 추출된 어휘를 비교한 결과, 과학 어휘의 58%가 원래 BERT의 어휘에 포함되지 않는다는 것을 발견했습니다.

- <a title="To address this problem, SciBERT uses a new vocabulary, including high-frequency words and sub-words in scientific articles." >🪶</a> 이 문제를 해결하기 위해 SciBERT는 과학 기사에서 자주 등장하는 단어와 서브워드를 포함한 새로운 어휘를 사용합니다.

- <a title="Results show that the new vocabulary helps the performance of downstream tasks." >🪶</a> 결과는 새로운 어휘가 다운스트림 작업의 성능 향상에 도움이 된다는 것을 보여줍니다.

- <a title="However, the new vocabulary is not recognized by the pre-trained model; therefore, the model needs to be trained from scratch, requiring substantial computing resources and training data." >🪶</a> 그러나 새로운 어휘는 사전 학습된 모델에 의해 인식되지 않으므로, 모델은 처음부터 학습되어야 하며 이는 막대한 컴퓨팅 자원과 훈련 데이터를 필요로 합니다.

- <a title="In a recent study, PubMedBERT (Gu et al., 2020) pre-trained the model from scratch with PubMed articles and a customized vocabulary (constructed from the PubMed articles)." >🪶</a> 최근 연구에서 PubMedBERT(Gu et al., 2020)는 PubMed 기사와 맞춤형 어휘(PubMed 기사에서 구성됨)를 사용하여 처음부터 모델을 사전 학습했습니다.

- <a title="This study indicates that a proper vocabulary helps the performance of downstream tasks in specific domains." >🪶</a> 이 연구는 적절한 어휘가 특정 도메인에서 다운스트림 작업의 성능 향상에 도움이 된다는 것을 나타냅니다.

- <a title="However, training the model from scratch is extremely expensive in terms of data and computation." >🪶</a> 그러나 모델을 처음부터 학습하는 것은 데이터와 계산 측면에서 매우 비용이 많이 듭니다.

- <a title="In multilingual language modeling, the out of vocabulary (OOV) problem harms the performance due to the limited vocabulary that cannot cover all the words in each language." >🪶</a> 다국어 언어 모델링에서 어휘 외(OOV) 문제는 각 언어의 모든 단어를 포괄할 수 없는 제한된 어휘 때문에 성능에 해를 끼칩니다.

- <a title="The mixture mapping method of (Wang et al., 2019) represents each OOV word as a mixture of English subwords where the English subwords are already in the original vocabulary." >🪶</a> Wang et al.(2019)의 혼합 매핑 방법은 각 OOV 단어를 원래 어휘에 이미 포함된 영어 서브워드의 혼합으로 나타냅니다.

- <a title="However, our preliminary experiments have shown that directly initializing the embedding of the domain-specific words with the mixture of the subword embeddings does not benefit the performance." >🪶</a> 그러나 우리의 예비 실험은 서브워드 임베딩의 혼합으로 도메인 특화 단어의 임베딩을 직접 초기화하는 것이 성능에 도움이 되지 않는다는 것을 보여주었습니다.

- <a title="Transfer learning with extra adaptors (Houlsby et al., 2019) applied to the pre-trained model shows competitive performance compared with fine-tuning the pre-trained model." >🪶</a> 사전 학습된 모델에 적용된 추가 어댑터를 사용한 전이 학습(Houlsby et al., 2019)은 사전 학습된 모델의 미세 조정과 비교하여 경쟁력 있는 성능을 보여줍니다.

- <a title="Training only a relatively small adaptor module is parameter efficient and the origin model is kept the same." >🪶</a> 상대적으로 작은 어댑터 모듈만 학습하는 것은 파라미터 효율적이며 원래 모델은 동일하게 유지됩니다.

- <a title="Similar to this concept but not in a fine-tuning paradigm, we pre-train only the size-free extension module and the embedding layer of the extension vocabulary." >🪶</a> 이 개념과 유사하지만 미세 조정 패러다임이 아닌, 우리는 크기 자유 확장 모듈과 확장 어휘의 임베딩 레이어만 사전 학습합니다.


## 3. exBERT Approach

- <a title="For exBERT, we augment the original BERT’s embedding layer with an extension embedding layer and corresponding domain-specific extension vocabulary, and add an extension module to each transformer layer." >🪶</a> exBERT에서는 원래 BERT의 임베딩 레이어를 확장 임베딩 레이어와 해당 도메인 특화 확장 어휘로 보강하고, 각 트랜스포머 레이어에 확장 모듈을 추가한다.

### 3.1. Extension Vocabulary and Embedding Layer

- <a title="First, we derive an extension vocabulary from the target domain (biomedical for this paper) corpus via WordPiece (Wu et al., 2016), while keeping the original general vocabulary used by BERT unchanged." >🪶</a> 먼저, WordPiece(Wu et al., 2016)를 통해 대상 도메인(이 논문에서는 생의학)의 말뭉치에서 확장 어휘를 도출하고, <mark style='background: #fff5b1; color:#3b454e;'>BERT에서 사용된 원래의 일반 어휘는 그대로 유지</mark>한다.

- <a title="Any token in the extension vocabulary already present in the original general vocabulary is deleted to ensure the extension vocabulary is an absolute complement to the original vocabulary." >🪶</a> 확장 어휘에 있는 토큰 중 <mark style='background: #fff5b1; color:#3b454e;'>원래의 일반 어휘에 이미 존재하는 토큰은 삭제</mark>하여 확장 어휘가 원래 어휘를 완전히 보완하도록 한다.

- <a title="We then add a corresponding embedding layer for the extension vocabulary, which is randomly initialized at the beginning and can be optimized during pre-training." >🪶</a> 그 다음, 확장 어휘에 해당하는 임베딩 레이어를 추가하는데, 이 레이어는 <mark style='background: #fff5b1; color:#3b454e;'>처음에 무작위로 초기화</mark>되고 사전 학습 중에 최적화될 수 있다.

- <a title="The overall vocabulary, containing 30,522 (original) and 17,748 (extension) tokens, is used for tokenizing input text." >🪶</a> 원래 30,522개의 토큰과 <mark style="background: #eaffb3; color:#3b454e;">확장된 17,748개의 토큰</mark>을 포함한 전체 어휘는 입력 텍스트를 토큰화하는 데 사용된다.

- <a title="This approach contrasts from SciBERT (Beltagy et al., 2019), which replaces the entire vocabulary and then pre-trains the model from scratch." >🪶</a> 이 접근 방식은 전체 어휘를 교체한 후 처음부터 모델을 사전 학습하는 SciBERT(Beltagy et al., 2019)와는 대조적이다.

- <a title="We tried different extension vocabulary sizes and found that increasing the vocabulary size has a small impact on performance (e.g., increasing the extension vocabulary size by an additional 12K words only improve performance by 0.0041 F1 score)." >🪶</a> 서로 다른 확장 어휘 크기를 시도해 보았고, 어휘 크기를 증가시키는 것이 성능에 미미한 영향을 미친다는 것을 발견했다(예: 확장 어휘 크기를 추가로 12K 단어 증가시켜도 성능이 0.0041 F1 점만 향상된다).

- <a title="This is due to the fact that there is no clear drop off in vocabulary frequency of occurrence." >🪶</a> 이는 어휘 발생 빈도가 뚜렷하게 감소하지 않기 때문이다.

- <a title="Further, increasing vocabulary size increases time-to-convergence, so in order to bound the convergence time we choose a relatively small extension vocabulary size." >🪶</a> 또한 어휘 크기를 증가시키면 수렴 시간이 증가하므로, 수렴 시간을 제한하기 위해 상대적으로 작은 확장 어휘 크기를 선택한다.

| Figure 1. Sentence embedding and the exBERT architecture<br />(a) <a title="Derivation of the sentence embedding based on both the original and extension vocabulary." >🪶</a> 기존 어휘와 확장 어휘를 기반으로 하는 문장 임베딩 유도 과정 |
| :----------------------------------------------------------: |
|   ![figure1-a](_attachements/image-20240608215457810.png)    |



- <a title="As illustrated in Figure 1(a), the output embedding of a given sentence consists of embedding vectors from both the original and extension embedding layer." >🪶</a> 그림 1(a)에 설명된 대로, 주어진 문장의 출력 임베딩은 원래 임베딩 레이어와 확장 임베딩 레이어의 임베딩 벡터로 구성된다.
- <a title="Taking the sentence ‘Thalamus is a part of brain' as an example, our overall vocabulary will tokenize it into eight tokens (‘tha’, ‘##lam’, ‘##us’, ‘is’, ‘a’, ‘part’, ‘of’, ‘brain’), with the embedding vector of ‘thalamus' coming from the extension embedding layer and all other tokens' embedding vectors from the original pre-trained embedding layer." >🪶</a> 예를 들어, 'Thalamus is a part of brain'라는 문장을 살펴보면, 우리의 전체 어휘는 이를 여덟 개의 토큰('tha', '##lam', '##us', 'is', 'a', 'part', 'of', 'brain')으로 토큰화하며, 'thalamus'의 임베딩 벡터는 확장 임베딩 레이어에서 오고, 다른 모든 토큰의 임베딩 벡터는 원래 사전 학습된 임베딩 레이어에서 온다.
- <a title="Without the extension vocabulary, the original BERT might have tokenized ‘thalamus' into three tokens, (‘tha’, ‘##lam’, ‘##us’), compared to ‘thalamus' tokenized as a single word under our method." >🪶</a> 확장 어휘가 없으면, 원래 BERT는 'thalamus'를 세 개의 토큰('tha', '##lam', '##us')으로 토큰화할 수 있습니다. 그에 비해, 우리의 방법으로는 'thalamus'가 단일 단어로 토큰화된다.
- <a title="Therefore by adding the extension vocabulary and corresponding embedding layer, exBERT enables more meaningful tokenization of input text." >🪶</a> 따라서 확장 어휘와 해당 임베딩 레이어를 추가함으로써 exBERT는 입력 텍스트의 보다 의미 있는 토큰화를 가능하게 한다.
- <a title="However, there are still two issues: (1) Embedding vectors of the extension vocabulary are unknown to the pre-trained BERT model, (2) Distribution of token representation in the original vocabulary may experience a shift from the general domain to the target domain due to the use of different sentence styles, formality, intent, and so on." >🪶</a> 그러나 여전히 두 가지 문제가 있다: (1) <mark style="background: #eeeeee; color:#3b454e;">확장 어휘 임베딩 벡터에 대한 정보를 사전학습된 BERT 모델은 알지 못한다.</mark> (2) 원래 어휘에서의 <mark style="background: #eeeeee; color:#3b454e;">토큰 표현 분포는 서로 다른 문장 스타일, 형식, 의도 등의 사용으로 인해 일반 도메인에서 대상 도메인으로 이동할 수 있다.</mark>
  - (2) = 다른 도메인의 컨텍스트에서 동일한 단어는 다른 표현을 가질 수 있는데, 일반 도메인에서나 전문 도메인에서나 의미가 같은 단어는 같은 표현을 가져야 한다.
- <a title="We address these issues by applying a weighted combination mechanism that allows the original BERT model and extension module to cooperate." >🪶</a> 우리는 이러한 문제를 해결하기 위해 원래 BERT 모델과 확장 모듈이 협력할 수 있도록, <mark style="background: #eeeeee; color:#3b454e;">가중 결합 메커니즘(Weighted combination mechanism)</mark>을 적용한다.

### 3.2. Extension Module

| Figure 1. Sentence embedding and the exBERT architecture<br />(b) <a title="Each input sentence consists of n 768-dimensional embedding vectors where n is 128 in our experiments. The output embedding is a component-wise weighted (computed by the weighting block) sum of outputs from the two modules." >🪶</a> 각 입력 문장은 우리 실험에서 n이 128개인 n개의 768차원 임베딩 벡터로 구성된다. 출력 임베딩을 두 모듈의 출력에 대한 구성 요소별 가중치(가중치 블록에 의해 계산됨)의 합계이다. |
| :----------------------------------------------------------: |
| ![image-20240609001752731](./_attachements/image-20240609001752731.png) |
| /![image-20240609002108774](./_attachements/image-20240609002108774.png) |



- <a title="exBERT augments each layer of the original BERT (referred to as the 'off-the-shelf' module) by adding an extension module to its side as depicted in Figure 1(b)." >🪶</a> exBERT는 <mark style='background: #eeeeee; color:#3b454e;'>원래 BERT의 각 레이어(“off-the-shelf” 모듈</mark>이라고 함)을 그림 1(b)에 나와 있는 대로 측면에 확장 모듈을 추가하여 보완한다.

- <a title="To combine the output from the off-the-shelf module Tofs(·) and the extension module Text(·), we use a weighted sum mechanism as below:" >🪶</a> off-the-shelf 모듈 $$T_{ofs}(\cdot)$$와 확장 모듈 $$T_{ext}(\cdot)$$의 출력을 결합하기 위해 아래와 같이 가중합 메커니즘을 사용한다:

$$
H^{l+1} = T_{ofs}(H^l) \cdot \sigma(w(H^l))+T_{ext}(H^l)\cdot(1-\sigma(w(H^l)))
$$

- <a title="where Hl is the output of l-th layer and w is the weighting block, a fully-connected layer with size 768 × 1 that outputs the weight used to do a weighted summation of embedding vectors from the two modules." >🪶</a> 여기서 $$H^l$$은 $$l$$번째 레이어의 출력이며, $$w$$는 가중 블록으로, 두 모듈에서 임베딩 벡터의 가중 합을 수행하는 데 사용되는 가중치를 출력하는 크기가 768 × 1인 완전히 연결된 레이어이다.

- <a title="To make the output magnitude of the weighting block consistent, a sigmoid function σ(·) is used to constrain the output." >🪶</a> 가중 블록의 출력 크기를 일관되게 만들기 위해 시그모이드 함수 $$\sigma(\cdot)$$를 사용하여 출력을 제한한다.
  - Pointer Generator Networks의 pgn gate와 동일한 연산

- <a title="The size of the extension module is flexible as long as its output shape matches that of the off-the-shelf module." >🪶</a> 확장 모듈의 크기는 출력 형태가 off-the-shelf 모듈의 것과 일치하는 한 유연하다.

## 4. Performance Evaluation of ExBERT

### 4.1. Experiment setup

|                | Pre-training                                        | Fine-tuning                             |
| -------------- | --------------------------------------------------- | --------------------------------------- |
| Data           | 17G-Bio<br/>(ClinicalKey(2GB)+PubMed Central(15GB)) | MTL-Bioinformatics-2016                 |
| Backbone Model | bert-base-uncased                                   | bert-base-uncased                       |
| Input Length   | 128                                                 | 128                                     |
| Epoch          | -                                                   | 3                                       |
| Batch          | 256                                                 | 20                                      |
| Optimizer      | Adam                                                | Adam                                    |
| lr             | 1E-04                                               | (top-3 layer) 1E-05,<br/>(others) 1E-04 |

#### exBERT Adaptive Pre-training

- <a title="All instances of BERT in this section refer to Bert-base-uncased (BERT)." >🪶</a> 이 섹션의 모든 BERT 인스턴스는 Bert-base-uncased를 가리킨다.

- <a title="For exBERT, the ‘extension module' uses the same transformer-based architecture as BERT (Devlin et al., 2018) with smaller sizes." >🪶</a> exBERT의 ‘확장 모듈’은 BERT와 동일한 트랜스포머 기반 아키텍처를 사용하며(Devlin et al., 2018), 크기가 작다.

- <a title="The ‘off-the-shelf' part of exBERT is a copy of the BERT model." >🪶</a> exBERT의 ‘off-the-shelf’ 부분은 BERT 모델의 사본이다.

- <a title="During pre-training, this part remains completely fixed, and only the extension module and the weighting block are updated (except for a special experiment related to Figure 3(b))." >🪶</a> 사전 학습 중에 이 부분은 완전히 고정되어 있으며, 확장 모듈과 가중 블록만 업데이트된다(그림 3(b)와 관련된 특수 실험을 제외).

- <a title="Training uses the Adam optimizer (learning rate =1e−04, β1 =0.9, and β2 =0.999) on 4 V100 NVIDIA GPUs. The batch size and input length are set to 256 and 128, respectively." >🪶</a> 학습에는 4개의 V100 NVIDIA GPU에서 Adam 옵티마이저(lr = 1e−04, $$\beta_1$$ = 0.9 및 $$\beta_2$$ = 0.999)를 사용합니다. 배치 크기와 입력 길이는 각각 256과 128로 설정된다.

- <a title="We construct a biomedical corpus (which we call 17G-Bio in this paper) consisting of 17 GB articles from ClinicalKey (Clinicalkey) (2GB) and PubMed Central (PMC) (15GB)." >🪶</a> ClinicalKey (Clinicalkey) (2GB) 및 PubMed Central (PMC) (15GB)에서 가져온 17GB 논문으로 구성된 생의학 말뭉치를 구축한다(이 논문에서는 17G-Bio라고 한다).

- <a title="All or part of this corpus is used for the adaptive pre-training discussed in the next two sections." >🪶</a> 이 말뭉치의 전체 또는 일부는 다음 두 섹션에서 논의되는 적응형 사전 학습에 사용된다.

#### Fine-tuning

- <a title="We compare different pre-trained models' performance after fine-tuning them on two downstream tasks: named entity recognition (NER) and relation extraction (RE)." >🪶</a> 우리는 미세 조정된 여러 사전 학습 모델의 성능을 비교한다. 이 모델들은 NER 및 관계 추출과 같은 두 가지 다운스트림 작업에서 미세 조정된다.

- <a title="In other words, all scores in this paper are models' performance on the downstream tasks." >🪶</a> 다시 말해, 이 논문의 모든 점수는 다운스트림 작업에서의 모델 성능이다.

- <a title="Specifically, all pre-trained models are fine-tuned with the same setting: only the top three layers are fine-tuned with a learning rate of 10−5 and batch size of 20 for 3 epochs on the MTL-Bioinformatics-2016 dataset (MTL)." >🪶</a> 구체적으로, 모든 사전 학습된 모델은 동일한 설정으로 미세 조정된다: 상위 세 개의 레이어만 미세 조정되며, lr은 MTL-Bioinformatics-2016 데이터셋(MTL)에서 배치 크기 20으로 3 에폭 동안 $$10^{-5}$$입니다.

- <a title="We first examine exBERT pre-trained under a limited corpus (sample randomly 5% data from the 17G-Bio) and computation resources (update model on the sampled corpus for three epochs), as a function of the extension module size." >🪶</a> 먼저 확장 모듈 크기의 함수로 <mark style="background: #eeeeee; color:#3b454e;">제한된 말뭉치(17G-Bio에서 무작위로 5% 데이터 샘플링)</mark>와 계산 리소스(샘플링된 말뭉치에서 모델을 3 에폭에 걸쳐 업데이트)에서 사전 학습된 exBERT를 검토한다.

- <a title="We test five different extension module sizes, 16.3%, 23.4%, 33.2%, 66.3% and 100%, of the off-the-shelf module size (with hidden sizes of 120, 180, 252, 504, 768 and feed-forward layer sizes of 512, 720, 1024, 2048, 3072, respectively)." >🪶</a> 우리는 off-the-shelf 모듈 크기의 16.3%, 23.4%, 33.2%, 66.3% 및 100%에 해당하는 다섯 가지 다른 확장 모듈 크기를 테스트한다(각각 120, 180, 252, 504, 768의 숨겨진 크기 및 512, 720, 1024, 2048, 3072의 feed-forward 레이어 크기).

- <a title="The performance of exBERT is compared against the original BERT and an our own trained version of BioBERT, rrBioBERT (reduced-resource BioBERT) pre-trained with the aforementioned limited resources but in the same way of BioBERT (Lee et al., 2019)." >🪶</a> exBERT의 성능은 원래 BERT, 직접 학습한 BioBERT, 제한된 리소스로 BioBERT(Lee et al., 2019)와 동일한 방식으로 사전학습된 rrBioBERT(reduced-resource BioBERT)와 비교된다.


### 4.2. Impact of the Extension Module Size

| Figure 2. <a title="Performance (macro F1-score on the NER task) of exBERT model pre-trained on 5% of the 17G-Bio corpus as a function of extension module sizes, compared against BERT and rrBioBERT. The blue and black curves represent the exBERT model with and without vocabulary extension respectively." >🪶</a> 확장 모듈 크기의 함수로 17G-Bio 말뭉치의 5%에서 사전학습된 exBERT 모델의 성능(NER에 대한 macro f1-score)을 BERT 및 rrBioBERT와 비교했다. 파란색과 검은색 곡선은 각각 어휘 확장이 있거나 없는 exBERT 모델을 나타낸다. |
| :----------------------------------------------------------: |
| ![image-20240609003037794](./_attachements/image-20240609003037794.png) |
| ![image-20240609003202436](./_attachements/image-20240609003202436.png) |

- <a title="As shown in Figure 2, exBERT outperforms the rrBioBERT model, even with a quite small extension module size (16.3%)." >🪶</a> 그림 2에서 보듯이, exBERT는 확장 모듈 크기가 매우 작은 경우에도(rrBioBERT 모델을) 능가한다(16.3%).

- <a title="This demonstrates that exBERT’s pre-training using the extension module is effective and efficient, and the performance is stable when there is a sufficient number of parameters in the extension model." >🪶</a> 이는 exBERT의 확장 모듈을 사용한 사전 학습이 효과적이고 효율적임을 보여주며, 확장 모델에 충분한 매개 변수가 있는 경우 성능이 안정적임을 보여준다.

- <a title="In the rest of this paper, we set the size of extension modules at 33.2%." >🪶</a> 이 논문의 나머지 부분에서는 확장 모듈의 크기를 33.2%(최고 성능)로 설정한다.

- <a title="Further, under a separate experiment, we have studied a scenario where we include the extension vocabulary and the corresponding embedding layer but do not include the extension module (0% in Figure 2)." >🪶</a> 또한 별도의 실험에서는 확장 어휘와 해당 임베딩 레이어를 포함하지만 확장 모듈을 포함하지 않는 시나리오를 연구했다(그림 2의 0%).

- <a title="We then update the whole model with the aforementioned limited resources. We find that this setting yields poor performance, showing that the extension module is crucial to make the original and extension vocabularies work together." >🪶</a> 그런 다음 언급된 제한된 리소스로 전체 모델을 업데이트했다. 이 설정은 성능이 낮은 것으로 나타났으며, 이는 확장 모듈이 원래와 확장 어휘를 함께 작동시키는 데 중요함을 보여준다.

- <a title="Furthermore, we have experimented with the paradigm that pre-trains only the extension module without the extension vocabulary (black curve in Figure 2)." >🪶</a> 또한 그림 2의 검은색 곡선처럼 확장 어휘 없이 확장 모듈만 사전 학습하는 패러다임을 실험했다.

- <a title="The result shows the exBERT’s improvement in performance comes not only from the extension module, but also from the additional domain-specific vocabulary." >🪶</a> 결과는 exBERT의 성능 향상이 확장 모듈뿐만 아니라 추가 도메인별 어휘에서도 나온다는 것을 보여준다.

### 4.3. Impact of Training Time on Performance

|             Table 2. Numerical data of Figure 3              |
| :----------------------------------------------------------: |
| ![image-20240609004514111](./_attachements/image-20240609004514111.png) |



- <a title="We next examine exBERT’s performance as a function of training time." >🪶</a> 다음으로, 학습 시간의 기능으로써 exBERT의 성능을 조사한다.

- <a title="We conduct adaptive pre-training of exBERT for 24 hours on the whole 17G-Bio corpus." >🪶</a> 전체 17G-Bio 말뭉치에 대해 exBERT를 24시간 동안 적응형 사전학습한다.

- <a title="For comparison, we also pre-train oiBioBERT (our-implemented BioBERT) with the same hardware and corpus but in the same manner as the way of BioBERT (Lee et al., 2019)." >🪶</a> 비교를 위해 동일한 하드웨어와 말뭉치로 oiBioBERT(직접 구현한 BioBERT)도 BioBERT (Lee et al., 2019)의 방식과 동일하게 사전 학습한다.

- <a title="For every 4 hours of pre-training, we compare the performance of exBERT and oiBioBERT." >🪶</a> 매 4시간마다 exBERT와 oiBioBERT의 성능을 비교한다.

- <a title="Because the addition of the extension module incurs additional computation, given this 24-hour pre-training, the oiBioBERT model proceeds through a larger portion (34%) of the corpus than exBERT (24%)." >🪶</a> 확장 모듈을 추가하면 추가 연산이 발생하기 때문에 이 24시간 사전학습을 감안할 때 oiBioBERT 모델(34%)은 exBERT(24%)보다 더 많은 코퍼스를 진행한다.
  -  <mark style='background: #eeeeee; color:#3b454e;'>exBERT는 oiBioBERT보다 연산이 느려 같은 시간 내 학습할 수 있는 데이터 양이 적다.</mark>


| Figure 3. The NER performance for exBERT and oiBioBERT pre-trained on the whole 17G-Bio corpus.<br/>(a) <a title="Models pre-trained with varying amounts of training time" >🪶</a> 다양한 학습 시간으로 사전학습된 모델 |
| :----------------------------------------------------------: |
| ![image-20240609004308931](./_attachements/image-20240609004308931.png) |

- <a title="Nevertheless, as Figure 3(a) shows, for all amounts of pre-training time, exBERT outperforms oiBioBERT." >🪶</a> 그럼에도 불구하고, 그림 3(a)에서 볼 수 있듯이, 모든 사전 학습 시간에 대해 exBERT가 oiBioBERT보다 우수한 성능을 보인다.

- <a title="This may be surprising given that exBERT takes less data due to increased computation (1.4x)." >🪶</a> 이는 증가된 계산으로 인해 exBERT가 더 적은 데이터를 사용함에도 불구하고 놀랄만한 일일 수 있다(1.4배).

- <a title="We believe that the superior performance of exBERT reflects a significant benefit accrued by having the new domain’s vocabulary explicitly represented in the exBERT model." >🪶</a> exBERT의 우수한 성능은 새로운 도메인의 어휘가 명시적으로 exBERT 모델에 표현되어 있어서 상당한 이점이 누적되었다는 것을 나타낸다.

- <a title="We also pre-train the models for a longer time on the whole 17G-Bio corpus." >🪶</a> 우리는 또한 전체 17G-Bio 말뭉치에 대해 모델을 더 오랜 시간 사전 학습한다.

- <a title="After pre-training the exBERT model for 24 hours (only updating the extension embedding layer and modules), we continually pre-train the whole exBERT model, consisting of both the off-the-shelf and extension modules, recognizing that the larger corpus may be able to support the training of the whole model." >🪶</a> exBERT 모델을 24시간 동안 사전 학습한 후(확장 임베딩 레이어와 모듈만 업데이트), 전체 exBERT 모델을 계속해서 사전 학습한다. 이것은 더 큰 말뭉치가 전체 모델의 학습을 지원할 수 있을 것이라는 것을 인식한 것이다.

| Figure 3. The NER performance for exBERT and oiBioBERT pre-trained on the whole 17G-Bio corpus.<br/>(b) <a title="Performance comparison against additional models, where for exBERT both the off-the-shelf and extension modules are updated. The size of a disc corresponds to the model size, and the axis is in a log scale. The discs with a black dot inside indicate models pre-trained by the authors of this paper." >🪶</a> exBERT의 경우 기성모듈 및 확장 모듈이 모두 업데이트되는 추가 모델과의 성능 비교. 디스크의 크기는 모델의 크기에 해당하며 축은 로그 눈금이다. 내부에 검은 점이 있는 디스크는 이 논문의 저자가 사전학습한  나타낸다. |
| :----------------------------------------------------------: |
| ![image-20240609004923228](./_attachements/image-20240609004923228.png) |

- <a title="We compare the results with three baselines, BERT (gray), BioBERT (green), and SciBERT (pink) (all of them are directly downloaded from their open-source implementations) as shown in Figure 3(b)." >🪶</a> 우리는 그림 3(b)에 나타난 것처럼 세 가지 베이스라인인 BERT(회색), BioBERT(녹색), SciBERT(분홍색)의 결과를 비교한다(모두 오픈 소스 구현에서 직접 다운로드되었다).

- <a title="For comparison, we convert the training time of these models to the time it may take with the same computing platform of this work (4 V100 GPUs), and assume that a TPU core has the same computing power as 2 V100 GPUs." >🪶</a> 비교를 위해 이러한 모델의 학습 시간을 이 작업의 동일한 컴퓨팅 플랫폼에서 걸릴 시간으로 변환하고, TPU 코어가 2개의 V100 GPU와 동일한 컴퓨팅 파워를 가지고 있다고 가정한다.

- <a title="As shown in Figure 3(b), for a given training time, exBERT always outperforms oiBioBERT." >🪶</a> 그림 3(b)에 나타난 바와 같이, 주어진 학습 시간에 대해 exBERT는 항상 oiBioBERT보다 우수한 성능을 보인다.
- <a title="We also find the exBERT pre-trained with lower resources (4 V100 GPUs, 64 hrs) outperforms the original BioBERT (8 V100 GPUs, 240 hrs, or 4 V100 GPUs 480 hrs in Figure 3(b))." >🪶</a> 또한 낮은 리소스로 사전 학습된 exBERT(4 V100 GPUs, 64 시간)가 원래의 BioBERT(8 V100 GPUs, 240 시간 또는 4 V100 GPUs, 480 시간 그림 3(b) 참조)보다 우수한 성능을 보인다.

- <a title="We additionally compare the size of the different models, represented as the disc size in Figure 3(b)." >🪶</a> 우리는 또한 그림 3(b)에서 디스크 크기로 표시된 다른 모델의 크기를 비교한다.

- <a title="The size of exBERT model (138 million parameters, with the extension modules' size being 33.2% of the off-the-shelf modules' size) is generally larger than the original BERT (110 million parameters) due to the added extension embedding layer and modules." >🪶</a> 확장 모듈의 크기가 기성 모듈의 크기의 33.2%인 exBERT 모델의 크기는 일반적으로 추가된 확장 임베딩 레이어 및 모듈 때문에 원래의 BERT보다 크다.
  - exBERT 모델의 크기 = 1억 3천 8백만 개 매개변수

  - BERT 모델의 크기 = 1억 개 매개변수

- <a title="Although we provide model sizing information here, this paper focuses on maximizing performance under constrained computation and data rather than minimizing model size." >🪶</a> 여기서 모델 크기 정보를 제공하지만,  <mark style='background: #eeeeee; color:#3b454e;'>이 논문은 모델 크기를 최소화하는 대신 제한된 계산 및 데이터 하에서 성능을 극대화하는 데 중점을 둔다.</mark>

- <a title="As future work, the model size could be reduced by, e.g., model compression methods (Gordon et al., 2020) or using a smaller distilled version of BERT (Sanh et al., 2019) as the off-the-shelf module." >🪶</a> 향후 작업으로, 모델 크기를 줄일 수 있다. 예를 들어, 모델 압축 방법(Gordon et al., 2020)을 사용하거나, 기성 모듈로 더 작은 압축된 버전의 BERT(Sanh et al., 2019)를 사용할 수 있다.

## 5. Conclusion

- <a title="exBERT is proposed to maximize the use of an elaborately pre-trained model for a general domain by empowering the model’s continual learning ability to adapt and shift the learned representation for a new domain with a low training cost." >🪶</a> exBERT는 모델의 지속적인 학습 능력을 강화하여 새로운 도메인에 대한  <mark style='background: #eeeeee; color:#3b454e;'>학습 비용을 낮추고 학습된 표현을 적응 및 이동시키는 것을 통해</mark> 정교하게 사전 학습된 모델을 최대한 활용하기 위해 제안되었습니다.

- <a title="exBERT adds a new domain-specific vocabulary and the corresponding embedding layer, as well as a small extension module to the original unmodified model." >🪶</a> exBERT는 원본 수정되지 않은 모델에  <mark style='background: #eeeeee; color:#3b454e;'>새로운 도메인별 어휘 및 해당 임베딩 레이어와 작은 확장 모듈을 추가</mark>합니다.

- <a title="The exBERT approach greatly improves the efficiency of adapting a pre-training model for a new target domain." >🪶</a> exBERT 접근 방식은 사전 학습 모델을  <mark style='background: #eeeeee; color:#3b454e;'>새로운 대상 도메인에 적응시키는 효율성을 크게 향상</mark>시킵니다.

- <a title="With exBERT we can reuse pre-trained language models for new domains under limited training resources." >🪶</a> exBERT를 사용하면  <mark style='background: #eeeeee; color:#3b454e;'>제한된 학습 리소스 하에서 새로운 도메인을 위해 사전 학습된 언어 모델을 재사용할 수 있습니다.</mark>

- <a title="The approach could be particularly attractive to ad-hoc and special-purpose domains with unique vocabularies, such as some fields in law, medicine, and engineering, which have very limited training data for model pre-training and demand fast turnaround training." >🪶</a> 이 접근 방식은 법률, 의학 및 공학 분야와 같이 고유한 어휘를 갖는 무작위 및 특수 목적 도메인에 특히 매력적일 수 있습니다. 이러한 분야는 모델 사전 학습을 위한 매우 제한적인 학습 데이터를 갖고 있으며 빠른 턴어라운드 학습을 요구합니다.


## A. Appendix

- <a title="We provide our results on the RE task mentioned in Section 4 in the same formats as Figure 2 and 3." >🪶</a> 저희는 Section 4에서 언급된 RE 작업에 대한 결과를 Figure 2와 3과 같은 형식으로 제공합니다.

- <a title="We find the performance of the models on the RE task follows a similar trend to the NER task." >🪶</a> 저희는 모델의 성능이 NER 작업과 유사한 추세를 따른다는 것을 발견했습니다.

- <a title="In particular, exBERT outperforms the rrBioBERT and oiBioBERT under the same pre-training conditions." >🪶</a> 특히, exBERT는 동일한 사전 학습 조건에서 rrBioBERT와 oiBioBERT보다 성능이 우수합니다.

- <a title="Note that following previous work (Beltagy et al., 2019; Lee et al., 2019), we use the micro F1 score here." >🪶</a> 이곳에서는 이전 연구 (Beltagy et al., 2019; Lee et al., 2019)를 따라 micro F1 점수를 사용합니다.
