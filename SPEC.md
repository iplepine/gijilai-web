# 기질×사주 융합 분석 서비스 - 개발 스펙 문서

> **서비스 컨셉**: 과학적 기질 분석(CBQ/ATQ)과 전통 사주를 결합한 맞춤형 육아 가이드 서비스
> **타겟**: 3~7세 자녀를 둔 부모
> **수익 모델**: $1.00 결제 후 리포트 제공

---

## 📱 화면 구성 (8개 스크린)

```
[1] 홈 → [2] 접수 → [3] 설문 → [4] 결제/로딩 → [5] 리포트 메인 → [6] 리포트 상세 → [7] 솔루션 → [8] 공유
```

---

## 1. 홈/랜딩 화면 (Home)

### 목적
서비스 가치 제안 및 결제 퍼널 진입 유도

### 컴포넌트
| 영역 | 내용 |
|------|------|
| Hero Section | 핵심 카피 + 샘플 리포트 이미지 |
| CTA 버튼 | `[우리 아이 맞춤 가이드 받기 ($1.00)]` → 접수 화면 이동 |
| Social Proof | "이미 {count}명의 부모님이 확인했습니다" (실시간 카운터) |

### 디자인
- 컬러: 딥그린/네이비 (신뢰감)
- 레이아웃: 모바일 최적화 원페이지 스크롤

---

## 2. 접수/기본정보 화면 (Intake)

### 목적
사주 및 연령 세그먼트용 기초 데이터 수집

### 입력 필드
```typescript
interface IntakeForm {
  // 약관
  privacyAgreed: boolean;        // 개인정보 처리 방침 동의
  disclaimerAgreed: boolean;     // "의학적 진단 아님" 면책 동의

  // 아이 정보
  childName: string;             // 이름 또는 닉네임
  gender: 'male' | 'female';
  birthDateTime: Date;           // 생년월일시 (사주 API 필수)
  birthPlace: string;            // 태어난 지역 (서머타임 보정)

  // 양육 고민 (최대 3개)
  concerns: ('sleep' | 'eating' | 'tantrum' | 'social' | 'learning')[];
}
```

### 백엔드 로직
- `child_age_months` 자동 계산 → 설문 문항 로딩 & 솔루션 가중치에 활용

---

## 3. 기질 설문 화면 (Survey)

### 목적
CBQ-VSF(아동) 및 ATQ-SV(성인) 데이터 수집

### 기능 요구사항

| 기능 | 설명 |
|------|------|
| 동적 문항 로딩 | 아이 개월 수 기반 CBQ 문항 로드 (3~7세: 36문항) |
| 7점 리커트 척도 | 1(전혀 그렇지 않다) ~ 7(매우 그렇다) + 0(해당 없음) |
| Progress Bar | 상단 진행률 표시 (이탈 방지) |
| 임시 저장 | LocalStorage 활용, 브라우저 종료 시에도 유지 |

### 점수 처리 로직
```typescript
// 역채점 문항 처리
const reverseScore = (score: number): number => 8 - score;

// 결측치 처리: '해당 없음(0)' 선택 시 평균 산출 분모에서 제외
const calculateAverage = (scores: number[]): number => {
  const validScores = scores.filter(s => s !== 0);
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
};
```

---

## 4. 결제 및 로딩 화면 (Payment & Processing)

### 목적
수익화 + 데이터 분석 수행

### 결제
- 금액: **$1.00**
- 연동: Stripe / PayPal / 카카오페이

### 로딩 애니메이션 (UX)
```
"기질 점수 산출 중..."
"사주 명식 대조 중..."
"맞춤 솔루션 생성 중..."
```

### 백엔드 처리 파이프라인
```
1. 기질 T-점수 산출
2. 만세력 API 호출 → 오행/십신 데이터 매핑
3. 부모-자녀 적합도(GoF) 점수 계산
4. 통합 유형 확정
```

---

## 5. 리포트 메인: 통합 분석 (Integrated Report)

### 목적
핵심 가치 '융합 데이터' 제공 (공유 최적화)

### 컴포넌트

| 영역 | 예시 |
|------|------|
| 통합 성향 카드 | `[열정 탐험가]`, `[세심한 사색가]` 등 |
| 핵심 요약 | "아이는 화(火)의 에너지와 높은 활동성을 타고났습니다. 억제보다 발산이 성장의 핵심입니다." |
| 관계 온도계 | 부모-자녀 적합도 게이지 차트 |

### 디자인
- 가장 화려하고 직관적인 디자인
- SNS 공유에 최적화된 레이아웃

---

## 6. 리포트 상세: 기질 및 사주 (Detail Analysis)

### 목적
과학적/전통적 근거 데이터 상세 확인

### 탭 구성

#### 기질 탭
- 3축 레이더 차트 (Chart.js)
  - 외향성 (Extraversion/Surgency)
  - 부정적 정서 (Negative Affectivity)
  - 의도적 통제 (Effortful Control)
- 또래 대비 백분위 그래프

#### 사주 탭
- 오행(목화토금수) 분포 파이 차트
- 용신(타고난 강점) 설명
- 올해의 운세 팁

#### 적합도 분석
- 부모-자녀 기질 차이 구간 설명
- Energy Mismatch 등 구체적 해설

---

## 7. 맞춤 솔루션 화면 (Actionable Solutions)

### 목적
실질적인 양육 행동 가이드 제공

### 솔루션 카테고리

| 카테고리 | 예시 |
|----------|------|
| 맞춤 놀이 처방 | 정적인 '금' 기운 보완 → 블록 쌓기 추천 |
| 대화 템플릿 | 고민별 훈육/공감 스크립트 |
| 환경 구성 | 아이 방 색상, 조명, 가구 배치 제안 |

### 로직
```
솔루션 우선순위 = f(양육 고민 선택, 통합 성향)
```
- 접수 시 선택한 `concerns`와 분석된 성향을 교차하여 정렬

---

## 8. 공유 및 확장 화면 (Share & Referral)

### 목적
바이럴 마케팅 + 가족 데이터 연결

### 기능

| 기능 | 설명 |
|------|------|
| PDF 다운로드 | 리포트 저장 및 이메일 전송 |
| 배우자 초대 | "아빠와 아이의 궁합도 확인해보세요" |
| 추천 링크 | UUID 포함 카카오톡 공유 링크 생성 |
| 쿠폰 발급 | 추천인 결제 시 '온 가족 리포트' 해금 쿠폰 자동 지급 |

---

## 🗄️ 데이터 모델 (Draft)

```typescript
// 아이 정보
interface Child {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDateTime: Date;
  birthPlace: string;
  ageMonths: number;  // 자동 계산
  concerns: string[];
}

// 설문 응답
interface SurveyResponse {
  childId: string;
  parentId: string;
  cbqScores: Record<string, number>;  // 아동 기질
  atqScores: Record<string, number>;  // 부모 기질
  completedAt: Date;
}

// 분석 결과
interface AnalysisResult {
  childId: string;

  // 기질 분석
  temperament: {
    extraversion: number;      // T-점수
    negativeAffect: number;
    effortfulControl: number;
    percentiles: Record<string, number>;
  };

  // 사주 분석
  saju: {
    elements: Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', number>;
    yongsin: string;  // 용신
    yearlyFortune: string;
  };

  // 통합 결과
  integratedType: string;  // "열정 탐험가" 등
  parentChildFit: number;  // 적합도 점수 (0-100)

  // 솔루션
  solutions: Solution[];
}

interface Solution {
  category: 'play' | 'script' | 'environment';
  title: string;
  description: string;
  priority: number;
}
```

---

## 📊 핵심 알고리즘 요약

> 상세 내용: [docs/ANALYSIS_ENGINE.md](docs/ANALYSIS_ENGINE.md)

### 기질 T-점수 변환
```
T = 50 + 10 × (원점수 - 규준평균) / 규준표준편차
```

### 적합도 점수 공식
```
FitScore = 100 - Σ(가중치 × 불일치도) + 부모조절력보너스
```

### 적합도 유형 (4가지)
| 유형 | 핵심 |
|------|------|
| 안정적 조화형 | 기질 유사, 부정적 정서 낮음 |
| 역동적 보완형 | 차이 있지만 부모 조절력 높음 |
| 에너지 평행선형 | 활동성 차이 극심 |
| 정서적 민감형 | 자녀 예민 + 부모 수용력 한계 |

### 기질×사주 매핑 예시
| 기질 | 사주 | 통합 성향 |
|------|------|-----------|
| 외향성↑ | 화(火), 식상 | 열정 탐험가 |
| 부정적 정서↑ | 수(水), 편관 | 세심한 사색가 |
| 의도적 통제↓ | 토/금 부족 | 자유로운 영혼 |

---

## 🔌 외부 연동

| 서비스 | 용도 |
|--------|------|
| 만세력 API | 사주 명식 조회, 오행/십신 데이터 |
| Stripe/PayPal/카카오페이 | $1.00 결제 |
| Chart.js | 레이더 차트, 파이 차트, 게이지 |
| 카카오 SDK | 공유 링크 생성 |

---

## 🎨 디자인 가이드라인

- **Primary Color**: 딥그린/네이비 (신뢰감)
- **Accent**: 따뜻한 골드/코랄 (리포트 강조)
- **Font**: 가독성 높은 산세리프
- **Layout**: 모바일 퍼스트, 원페이지 스크롤 기반

---

## ✅ 개발 체크리스트

- [ ] 홈 화면 + CTA
- [ ] 접수 폼 + 약관 동의
- [ ] 설문 UI (동적 로딩 + 임시저장)
- [ ] 결제 연동
- [ ] 기질 T-점수 알고리즘
- [ ] 만세력 API 연동
- [ ] 적합도(GoF) 계산 로직
- [ ] 리포트 메인 화면
- [ ] 리포트 상세 (차트)
- [ ] 솔루션 큐레이션 로직
- [ ] PDF 생성 + 공유 기능
- [ ] 추천 시스템 (쿠폰 발급)
