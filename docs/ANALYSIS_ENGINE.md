# 기질×사주 통합 분석 엔진 설계서

> 과학적 기질 분석(CBQ/ATQ)과 전통 사주 명리학의 융합 로직

---

## 1. 이론적 배경

### 1.1 기질(Temperament)의 정의

- **Rothbart 모델**: 반응성(Reactivity) + 자기조절(Self-regulation)
- 생애 초기부터 관찰되는 정서적/운동적/주의집중적 반응 양식
- 유전적 기초 + 환경 상호작용 → 성격으로 발달

### 1.2 조화의 적합성 (Goodness of Fit)

- **Thomas & Chess 모델**
- 아동의 기질 자체가 문제가 아님
- **환경의 요구 × 아동의 기질** 조화 여부가 발달 결과 결정
- 부모 양육 방식과 기질이 조화 → 최적 발달, 높은 자존감
- 기질과 환경 충돌 → 부적응, 행동 문제 위험 증가

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

## 6. 사주 명리학 분석 엔진

### 6.1 만세력 변환

- 입력: 생년월일시 + 출생지역 (서머타임 보정)
- 출력: 사주팔자 (년주, 월주, 일주, 시주 = 8글자)
- 연동: 만세력 API

### 6.2 오행(五行) 분석

| 오행 | 상징 | 과다 시 |
|------|------|---------|
| **목(木)** | 성장, 창의성, 호기심 | 분노, 고집 |
| **화(火)** | 열정, 표현력, 활달함 | 감정 기복, 충동성 |
| **토(土)** | 중재, 성실, 포용력 | 게으름, 생각 과부하 |
| **금(金)** | 절제, 원칙, 결단력 | 냉정함, 위축 |
| **수(水)** | 유연성, 지혜, 침착함 | 두려움, 우울감 |

### 6.3 십신(十神) 분석

| 십신 | 의미 | 기질 연관성 |
|------|------|-------------|
| **비겁** (비견/겁재) | 자아의 힘, 독립성 | 또래 경쟁심 |
| **식상** (식신/상관) | 표현 에너지, 창의성 | Surgency ↑ |
| **재성** (편재/정재) | 현실적 목표 지향 | Effortful Control (목표 지속) |
| **관성** (편관/정관) | 규율, 명예 | Inhibitory Control ↑ |
| **인성** (편인/정인) | 수용, 학습, 사색 | Perceptual Sensitivity ↑ |

### 6.4 데이터 구조

```typescript
interface SajuAnalysis {
  // 사주팔자
  fourPillars: {
    year: { stem: string; branch: string };
    month: { stem: string; branch: string };
    day: { stem: string; branch: string };
    hour: { stem: string; branch: string };
  };

  // 오행 분포 (가중치 적용)
  elements: {
    wood: number;   // 목
    fire: number;   // 화
    earth: number;  // 토
    metal: number;  // 금
    water: number;  // 수
  };

  // 십신 분포
  tenGods: {
    bigyup: number;    // 비겁
    siksang: number;   // 식상
    jaesung: number;   // 재성
    gwansung: number;  // 관성
    insung: number;    // 인성
  };

  // 용신 (보완이 필요한 오행)
  yongsin: 'wood' | 'fire' | 'earth' | 'metal' | 'water';

  // 일간 (본질)
  dayStem: string;
}
```

---

## 7. 기질 × 사주 통합 분석 로직

### 7.1 통합 엔진 (Hybrid Logic)

두 데이터의 일관성/상충을 분석하여 입체적 해석 제공

#### 3단계 프로세스

1. **일관성 검증** (Consistency Check)
   - 기질 + 사주 모두 같은 방향 → 핵심 성향으로 확정
   - 솔루션 비중 90%

2. **잠재력 발견** (Latent Talent Discovery)
   - 현재 기질은 낮으나 사주상 잠재력 → 발달 가능성 제시

3. **위험 구간 경고** (Risk Mitigation)
   - 양쪽 모두 부정적 신호 → 강력한 주의 가이드

### 7.2 매핑 테이블

| 기질 차원 | 사주 오행/십신 | 통합 성향 키워드 |
|-----------|----------------|------------------|
| 높은 Surgency | 화(火)↑, 식상 강함 | **[열정 탐험가]**: 발산 필수 |
| 낮은 Effortful Control | 토(土)↓, 금(金)↓ | **[자유로운 영혼]**: 구조화된 환경 필요 |
| 높은 Negative Affect | 수(水) 과다, 편관 강함 | **[세심한 사색가]**: 강압적 훈육 금지 |
| 높은 Perceptual Sensitivity | 인성↑, 목(木) 적절 | **[예술적 영재형]**: 심미적 환경 중요 |

### 7.3 통합 분석 구현

```typescript
interface IntegratedAnalysis {
  // 통합 성향 타입
  integratedType: string;  // "열정 탐험가", "세심한 사색가" 등

  // 일관성 수준
  consistency: 'high' | 'medium' | 'low';

  // 핵심 메시지
  coreInsight: string;

  // 잠재력
  latentTalents: string[];

  // 위험 구간
  riskAreas: string[];

  // 솔루션 방향성
  solutionDirection: 'expression' | 'structure' | 'support' | 'balance';
}

const integrateAnalysis = (
  temperament: TemperamentScores,
  saju: SajuAnalysis
): IntegratedAnalysis => {
  const analysis: IntegratedAnalysis = {
    integratedType: '',
    consistency: 'medium',
    coreInsight: '',
    latentTalents: [],
    riskAreas: [],
    solutionDirection: 'balance'
  };

  // 외향성 + 화(火) + 식상 조합
  if (temperament.surgency >= 60 && saju.elements.fire > 25 && saju.tenGods.siksang > 20) {
    analysis.integratedType = '열정 탐험가';
    analysis.consistency = 'high';
    analysis.coreInsight = '에너지를 발산해야 직성이 풀리는 타입. 억제보다 발산이 성장의 핵심입니다.';
    analysis.solutionDirection = 'expression';
  }

  // 높은 부정적 정서 + 수(水) 과다 + 편관
  if (temperament.negativeAffect >= 60 && saju.elements.water > 30 && saju.tenGods.gwansung > 25) {
    analysis.integratedType = '세심한 사색가';
    analysis.consistency = 'high';
    analysis.coreInsight = '정서적 압박에 매우 민감합니다. 강압적 훈육 시 심리적 타격이 극심합니다.';
    analysis.solutionDirection = 'support';
    analysis.riskAreas.push('자존감 급격히 낮아질 우려 - 칭찬 위주 양육 필수');
  }

  // 잠재력 발견: 현재 의도적 통제 낮으나 사주상 정인+금 있음
  if (temperament.effortfulControl < 45 && saju.tenGods.insung > 20 && saju.elements.metal > 20) {
    analysis.latentTalents.push(
      '현재는 산만해 보일 수 있으나 본래 정적인 학습 잠재력이 큽니다. 기다려주는 양육이 효과적입니다.'
    );
  }

  return analysis;
};
```

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
  targetSaju: string[];         // 해당 사주 조건
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
    targetSaju: ['fire_high', 'siksang_high'],
    ageRange: [36, 84],
    priority: 9
  },
  {
    category: 'script',
    title: '감정 수용 대화법',
    description: '"뚝 그쳐!" 대신 "마음이 이만큼이나 아팠구나, 엄마가 네 옆에 있어"라고 5초간 말없이 안아주세요.',
    targetTemperament: ['negativeAffect_high'],
    targetSaju: ['water_high'],
    ageRange: [24, 84],
    priority: 10
  },
  {
    category: 'environment',
    title: '집중력 향상 환경',
    description: '시각적 자극을 줄이기 위해 장난감장을 불투명한 문으로 가리고, 작업 영역에는 한 번에 하나의 물건만 올려두세요.',
    targetTemperament: ['effortfulControl_low'],
    targetSaju: ['earth_low', 'metal_low'],
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
  saju: SajuAnalysis,
  childAgeMonths: number,
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
| 사주 분석 | 만세력 API 연동 |
| 결제 | Stripe / 카카오페이 |
| 저장소 | PostgreSQL + Redis (캐시) |
