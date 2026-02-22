# 기질 분석 엔진 설계서

> 과학적 기질 분석(CBQ/ATQ) 기반 분석 로직

---

## 1. 이론적 배경

### 1.1 기질(Temperament)의 정의

- **Rothbart 모델**: 반응성(Reactivity) + 자기조절(Self-regulation)
- 생애 초기부터 관찰되는 정서적/운동적/주의집중적 반응 양식
- 유전적 기초 + 환경 상호작용 → 성격으로 발달

### 1.2 조화의 적합성 (Goodness of Fit)

### 1.3 기질아이 맞춤 양육 모델 (Temperament Chemistry Paradigm)
- **양육자의 기질 (The Caregiver)**: 부모의 TCI. 아이를 지지하고 품어주는 정서적 환경.
- **아이의 기질 (The Child)**: 체스 & 토마스 기질 유형. 아이가 가진 고유의 성질.
- **아이의 현재 모습 (The Current State)**: 아이의 TCI 차원. 환경과 기질이 상호작용하여 발현된 아이의 구체적인 모습.
- **기질 맞춤 양육 (Parenting Chemistry)**: 부모의 양육 행위. 양육 환경의 상태를 아이의 고유한 기질에 맞게 최적화해가는 과정.

---

## 2. 기질 설문 도구

### 2.1 아동용: CBQ-VSF (Children's Behavior Questionnaire - Very Short Form)

- **대상**: 3~7세 아동
- **응답자**: 부모 (지난 6개월간 관찰 기반)
- **문항 수**: 36문항 (표준형 195문항의 축약판)

#### 3가지 상위 요인 구조

| 상위 요인 | 하위 차원 | 핵심 행동 지표 |
|-----------|-----------|----------------|
| **외향성/활성 (Surgency)** | 활동 수준, 충동성, 수줍음(역), 고강도 즐거움 | 높은 에너지, 자극 추구, 사회적 접근성, 긍정 정서 |
| **부정적 정서 (Negative Affectivity)** | 좌절/분노, 두려움, 불편함, 슬픔, 달래기 어려움(역) | 위협 반응성, 불안, 낮은 정서 조절, 감각 예민성 |
| **의도적 통제 (Effortful Control)** | 주의 집중, 억제 통제, 저강도 즐거움, 지각 예민성 | 자발적 주의 조절, 행동 억제, 미세 자극 인지 |

#### 문항 예시

```
외향성:
- "항상 급하게 이동한다"
- "거친 놀이를 즐긴다"

부정적 정서:
- "원하는 것을 못하게 할 때 화를 낸다"
- "사소한 상처에도 크게 속상해한다"

의도적 통제:
- "지시 사항을 잘 따른다"
- "책을 볼 때 강한 집중력을 보인다"
```

### 2.2 성인용: ATQ (Adult Temperament Questionnaire)

- **대상**: 부모 (16세 이상)
- **형식**: 자기보고식
- **문항 수**: 77문항 (단축형)

#### 4가지 주요 요인

| 요인 | 측정 내용 | 성격 5요인 상관 |
|------|-----------|-----------------|
| **부정적 감정** | 두려움, 슬픔, 좌절, 감각적 불편함 | 신경증(Neuroticism) |
| **의도적 통제** | 주의/억제/활성 제어 | 성실성(Conscientiousness) |
| **외향성** | 사교성, 긍정적 감정, 고강도 즐거움 | 외향성(Extraversion) |
| **지각 민감성** | 중립적/감정적/연합적 자극 민감성 | - |

> **핵심**: 부모의 의도적 통제 능력↑ → 아동의 까다로운 기질 수용력↑

---

## 3. 응답 척도 및 점수 처리

### 3.1 리커트 척도

```
1 = 전혀 그렇지 않다
2 = 그렇지 않다
3 = 약간 그렇지 않다
4 = 보통이다
5 = 약간 그렇다
6 = 그렇다
7 = 매우 그렇다
0 = 해당 없음 (N/A) - 아동용만
```

### 3.2 역채점 처리

```typescript
// 역채점 문항 (예: "조용한 활동을 선호한다" → 활동성 역측정)
const reverseScore = (score: number): number => {
  if (score === 0) return 0; // N/A는 그대로
  return 8 - score;
};

// 역채점 문항 목록 (예시)
const REVERSE_ITEMS = {
  surgency: [13, 24, 35],      // 수줍음 관련
  negativeAffect: [8, 19],     // 달래기 쉬움 관련
  effortfulControl: [3, 14]    // 저통제 관련
};
```

### 3.3 결측치 처리

```typescript
// "해당 없음(0)" 응답은 평균 계산에서 제외
const calculateFactorScore = (scores: number[]): number => {
  const validScores = scores.filter(s => s !== 0);
  if (validScores.length === 0) return null;
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
};
```

---

## 4. T-점수 표준화 알고리즘

### 4.1 공식

$$T = 50 + 10 \times \frac{X - \mu}{\sigma}$$

- `X`: 원점수 평균
- `μ`: 해당 연령/성별 모집단 평균
- `σ`: 해당 연령/성별 모집단 표준편차

### 4.2 규준 데이터 (Putnam & Rothbart 2006 기반)

| 성별 | 요인 | 평균(μ) | 표준편차(σ) |
|------|------|---------|-------------|
| 남아 | 외향성 | 4.70 | 0.91 |
| 여아 | 외향성 | 4.40 | 0.99 |
| 남아 | 부정적 정서 | 4.28 | 0.82 |
| 여아 | 부정적 정서 | 4.28 | 0.81 |
| 남아 | 의도적 통제 | 5.24 | 0.78 |
| 여아 | 의도적 통제 | 5.60 | 0.69 |

> **참고**: 여아가 남아보다 의도적 통제 점수가 유의미하게 높음

### 4.3 T-점수 해석 기준

| T-점수 범위 | 수준 | 백분위 |
|-------------|------|--------|
| T ≥ 65 | 매우 높음 | 상위 7% |
| 55 ≤ T < 65 | 높음 | 상위 7~31% |
| 45 ≤ T < 55 | 보통 | 중간 38% |
| 35 ≤ T < 45 | 낮음 | 하위 7~31% |
| T < 35 | 매우 낮음 | 하위 7% |

### 4.4 구현 코드

```typescript
interface NormData {
  mean: number;
  std: number;
}

interface NormTable {
  [gender: string]: {
    [factor: string]: NormData;
  };
}

const NORMS: NormTable = {
  male: {
    surgency: { mean: 4.70, std: 0.91 },
    negativeAffect: { mean: 4.28, std: 0.82 },
    effortfulControl: { mean: 5.24, std: 0.78 }
  },
  female: {
    surgency: { mean: 4.40, std: 0.99 },
    negativeAffect: { mean: 4.28, std: 0.81 },
    effortfulControl: { mean: 5.60, std: 0.69 }
  }
};

const calculateTScore = (
  rawScore: number,
  gender: 'male' | 'female',
  factor: string
): number => {
  const norm = NORMS[gender][factor];
  const zScore = (rawScore - norm.mean) / norm.std;
  const tScore = 50 + (10 * zScore);
  return Math.round(tScore);
};

const getTScoreLevel = (tScore: number): string => {
  if (tScore >= 65) return '매우 높음';
  if (tScore >= 55) return '높음';
  if (tScore >= 45) return '보통';
  if (tScore >= 35) return '낮음';
  return '매우 낮음';
};
```

---

## 5. 부모-자녀 적합도(GoF) 산출 엔진

### 5.1 적합도의 다차원적 정의

1. **기질적 불일치도** (Discrepancy)
2. **부모의 조절 역량 가중치** (Regulatory Weighting)
3. **환경적 요구 부합도** (Contextual Fit)

### 5.2 불일치 점수 계산

```typescript
// 각 요인별 불일치도
const calculateDiscrepancy = (
  childTScore: number,
  parentTScore: number
): number => {
  return Math.abs(childTScore - parentTScore);
};
```

### 5.3 적합도 점수 공식

$$FitScore = 100 - \sum (w_i \times D_i) + Bonus_{EffCon}$$

#### 가중치 설정

| 요인 | 가중치 | 근거 |
|------|--------|------|
| 부정적 정서 차이 | 1.5 | 갈등 유발에 더 큰 영향 |
| 외향성 차이 | 1.0 | 에너지 레벨 충돌 |
| 의도적 통제 차이 | 0.8 | 상대적으로 보완 가능 |

#### 보너스 점수

- 부모의 의도적 통제 T-점수 ≥ 60 → **+5~10점**
- 부모의 조절 역량이 기질 차이를 보완

### 5.4 구현 코드

```typescript
interface TemperamentScores {
  surgency: number;
  negativeAffect: number;
  effortfulControl: number;
}

const WEIGHTS = {
  surgency: 1.0,
  negativeAffect: 1.5,
  effortfulControl: 0.8
};

const calculateFitScore = (
  childScores: TemperamentScores,
  parentScores: TemperamentScores
): number => {
  // 불일치도 계산
  const discrepancies = {
    surgency: Math.abs(childScores.surgency - parentScores.surgency),
    negativeAffect: Math.abs(childScores.negativeAffect - parentScores.negativeAffect),
    effortfulControl: Math.abs(childScores.effortfulControl - parentScores.effortfulControl)
  };

  // 가중 합산
  const weightedSum =
    (discrepancies.surgency * WEIGHTS.surgency) +
    (discrepancies.negativeAffect * WEIGHTS.negativeAffect) +
    (discrepancies.effortfulControl * WEIGHTS.effortfulControl);

  // 보너스 점수 (부모의 의도적 통제 역량)
  const bonus = parentScores.effortfulControl >= 60 ?
    Math.min(10, (parentScores.effortfulControl - 55) * 0.5) : 0;

  // 최종 점수 (0-100 범위로 클램핑)
  return Math.max(0, Math.min(100, 100 - weightedSum + bonus));
};
```

### 5.5 적합도 유형 분류

| 유형 | 조건 | 관계 특성 |
|------|------|-----------|
| **안정적 조화형** (Easy Match) | 기질 유사 + 부정적 정서 모두 낮음 | 예측 쉬움, 양육 효능감 높음 |
| **역동적 보완형** (Synergy Match) | 기질 차이 있으나 부모 의도적 통제 높음 | 부모가 자녀 결핍 보완, 자기조절 학습 |
| **에너지 평행선형** (Energy Mismatch) | 활동성(Surgency) 차이 극심 | 생활 리듬 충돌, 양육 번아웃 위험 |
| **정서적 민감형** (Emotional Strain) | 자녀 부정적 정서↑ + 부모 수용력 한계 | 고위험군, 전문가 코칭 권장 |

```typescript
type FitType = 'easy_match' | 'synergy_match' | 'energy_mismatch' | 'emotional_strain';

const classifyFitType = (
  childScores: TemperamentScores,
  parentScores: TemperamentScores
): FitType => {
  const surgencyDiff = Math.abs(childScores.surgency - parentScores.surgency);
  const negAffectDiff = Math.abs(childScores.negativeAffect - parentScores.negativeAffect);

  // 에너지 불일치 (활동성 차이 30점 이상)
  if (surgencyDiff >= 30) {
    return 'energy_mismatch';
  }

  // 정서적 민감형 (자녀 부정적 정서 높고 부모 의도적 통제 낮음)
  if (childScores.negativeAffect >= 60 && parentScores.effortfulControl < 50) {
    return 'emotional_strain';
  }

  // 역동적 보완형 (차이 있지만 부모 조절력 높음)
  if ((surgencyDiff >= 15 || negAffectDiff >= 15) && parentScores.effortfulControl >= 60) {
    return 'synergy_match';
  }

  // 안정적 조화형
  return 'easy_match';
};
```

---

## 6. 메타포 기반 결과 매핑 (Metaphor Mapping)

분석 엔진의 최종 출력값은 사용자에게 전달될 때 다음과 같이 '마음 기질'의 언어로 변환된다.

### 6.1 양육자의 마음 기질 (Parent)
| 부모 특성 | 기질 명칭 | 기질의 상태 |
| :--- | :--- | :--- |
| **안정적/수용적** | **잔잔하고 품이 넓은 바다** | 어떤 감정도 부드럽게 감싸줄 수 있는 안정감 |
| **신중함/보호적** | **섬세하고 단단한 방패** | 외부의 자극으로부터 안전하게 울타리가 되어주는 신중함 |
| **에너지 넘침/활동적** | **따뜻하고 열정적인 장작불** | 강력한 에너지를 주지만 세밀한 조절과 완급 조절이 필요함 |

### 6.2 아이의 타고난 결 (Nature)
| 체스 & Thomas | 기질 명칭 | 특성의 이해 |
| :--- | :--- | :--- |
| **순한 기질 (Easy)** | **유연하고 조화로운 아이** | 어디서든 쉽게 적응하고 긍정적인 사회성을 가진 부드러운 본성 |
| **까다로운 기질 (Difficult)** | **입체적이고 선명한 아이** | 자기만의 기준과 호불호가 뚜렷하여 세심한 조율을 통해 빛나는 개성 |
| **느린 기질 (Slow)** | **신중하고 예민한 아이** | 스스로 준비가 될 때까지 긴 호흡과 기다림이 필요한 내일의 잠재력 |

### 6.3 발견된 아이의 기질 (Child TCI)
| TCI 조합 | 아키타입 | 기질의 특징 |
| :--- | :--- | :--- |
| **NS High** | **호기심 많고 주도적인 탐험가형** | 끊임없이 새로운 자극을 좇으며 역동적으로 세상을 배우는 기질 |
| **HA High** | **신중하고 세심한 관찰자형** | 한발 물러서 상황을 치밀하게 분석하고 자기만의 내면세계를 구축하는 기질 |
| **RD High** | **사회적이고 따뜻한 교감가형** | 타인의 마음을 누구보다 빠르고 예리하게 알아채 교감하는 관계 지향적 기질 |
| **P High** | **단단하고 끈기있는 몰입가형** | 실패를 두려워하지 않고 스스로 세운 목표에 온전히 파고드는 단단한 기질 |

### 6.4 기질 맞춤 양육 분석 (Parenting Chemistry)
부모와 아이의 TCI 점수 차이(Delta)가 가장 큰 항목을 추출하여 상호작용의 역동성(케미)을 분석한다.

| 차이 항목 | 분석 명칭 | 관계의 역동성 메시지 (예시) |
| :--- | :--- | :--- |
| **NS 차이** | **에너지의 속도 차이** | 아이의 질주하려는 호기심과 양육자의 신중한 제동이 만나는 지점 |
| **HA 차이** | **안전 거리 감각** | 양육자의 보호 본능과 아이의 과감한 도전 사이의 심리적 거리를 조율하는 과정 |
| **RD 차이** | **정서적 주파수** | 감정 표현의 방식과 정서적 연결을 제안하고 공감받는 온도의 문법 차이 |
| **P 차이** | **성취의 호흡** | 한 가지에 몰입하는 아이의 호흡과 이를 기다려주는 양육자님의 리듬 차이 |

---

## 7. 리포트 스토리텔링 전략 (UX Strategy)

### 7.1 무료 버전: "발견과 공감" (Discovery & Empathy)
관계를 정의하고 현상을 짚어주어 서비스에 대한 신뢰를 확보한다.
1.  **기질의 발견**: "내 아이는 이런 마음 기질을 가졌구나"라는 정체성 부여 (감성적 임팩트).
2.  **관계의 정의**: "나의 양육과 아이의 기질이 만나 이런 상호작용 시너지를 내고 있구나"라는 객관적 설명.
3.  **조화의 지점**: 육아의 고단함, 갈등의 원인을 '기질적 차이'로 객관화하여 양육자의 심리적 부채감 해소.

### 7.2 유료 버전: "처방과 변화" (Action & Transformation)
구체적인 행동 지침(Actionable Insight)을 제공하여 실제 변화를 이끌어낸다.
1.  **마음 통역사**: 아이가 보내는 문제 행동 뒤에 숨겨진 진짜 기질적 욕구를 통역.
2.  **마법의 한 마디**: 양육자의 스트레스를 낮추고 상황을 반전시킬 수 있는 마법같은 스크립트.
3.  **마음 영양제**: 양육자 스스로를 위한 셀프 케어 방안 제시 (부모 에너지 충전소).

---





## 8. 솔루션 엔진

### 8.1 연령 세그먼트

| 세그먼트 | 연령 | 핵심 과제 |
|----------|------|-----------|
| 영아기 | 0~18개월 | 애착 형성, 수면/수유 리듬 |
| 걸음마기 | 19~36개월 | 자율성, 떼쓰기 대처 |
| 유아기 | 3~7세 | 사회성, 또래 관계 |
| 아동기 | 8~12세 | 학습 동기, 자존감, 진로 |

### 8.2 솔루션 카테고리

```typescript
interface Solution {
  category: 'play' | 'script' | 'environment';
  title: string;
  description: string;
  targetTemperament: string[];  // 해당 기질 조건

  ageRange: [number, number];   // 개월 수 범위
  priority: number;             // 우선순위 (1-10)
}

// 예시 솔루션
const sampleSolutions: Solution[] = [
  {
    category: 'play',
    title: '에너지 발산 놀이',
    description: '15분간의 장애물 달리기 후 5분간의 스트레칭으로 에너지를 갈무리해주세요.',
    targetTemperament: ['surgency_high'],

    ageRange: [36, 84],
    priority: 9
  },
  {
    category: 'script',
    title: '감정 수용 대화법',
    description: '"뚝 그쳐!" 대신 "마음이 이만큼이나 아팠구나, 엄마가 네 옆에 있어"라고 5초간 말없이 안아주세요.',
    targetTemperament: ['negativeAffect_high'],

    ageRange: [24, 84],
    priority: 10
  },
  {
    category: 'environment',
    title: '집중력 향상 환경',
    description: '시각적 자극을 줄이기 위해 장난감장을 불투명한 문으로 가리고, 작업 영역에는 한 번에 하나의 물건만 올려두세요.',
    targetTemperament: ['effortfulControl_low'],

    ageRange: [36, 144],
    priority: 8
  }
];
```

### 8.3 솔루션 우선순위 로직

```typescript
const prioritizeSolutions = (
  solutions: Solution[],
  temperament: TemperamentScores,

  parentConcerns: string[]  // 부모가 선택한 양육 고민
): Solution[] => {
  return solutions
    .filter(s => childAgeMonths >= s.ageRange[0] && childAgeMonths <= s.ageRange[1])
    .map(s => {
      let score = s.priority;

      // 부모 고민과 매칭되면 가산점
      if (parentConcerns.some(c => s.title.includes(c))) {
        score += 3;
      }

      // 기질 조건 매칭 가산점
      // ... (매칭 로직)

      return { ...s, calculatedScore: score };
    })
    .sort((a, b) => b.calculatedScore - a.calculatedScore);
};
```

---

## 9. 데이터 프라이버시

### 9.1 설계 원칙

- **비회원 기반**: 이메일 + 결제 정보만 최소 수집
- **데이터 휘발**: 생시 데이터는 결과 산출 후 즉시 삭제 또는 단방향 해시 처리
- **공유 보안**: UUID URL 자동 만료, OG 미리보기에서 이름/점수 마스킹

### 9.2 면책 고지

- "의학적 진단이 아님" 명시적 동의 필수
- 전문가 상담 권유 문구 포함

---

## 10. 기술 스택 제안

| 레이어 | 기술 |
|--------|------|
| Frontend | React/Next.js + PWA + Chart.js |
| Backend | Python FastAPI 또는 Node.js |

| 결제 | Stripe / 카카오페이 |
| 저장소 | PostgreSQL + Redis (캐시) |
