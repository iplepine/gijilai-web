# 디자인 가이드

> 디자인 예시: `./design_example/` 폴더 참조

---

## 1. 컬러 시스템

### Primary Palette

| 이름 | 값 | 용도 |
|------|-----|------|
| **Primary** | `#11d4d4` | CTA 버튼, 강조, 아이콘 |
| **Navy** | `#0d1b1b` | 본문 텍스트, 다크모드 배경 |
| **Deep Green** | `#1a4d4d` | 보조 텍스트, 카드 배경 |
| **Green Custom** | `#4c9a9a` | 서브 텍스트, 라벨 |

### Background

| 모드 | 값 |
|------|-----|
| Light | `#f6f8f8` 또는 `#fdfdfb` |
| Dark | `#102222` 또는 `#0d1b1b` |

### Semantic Colors

| 용도 | 색상 |
|------|------|
| 성공/체크 | `green-500` |
| 경고/대화 | `orange-400` |
| 부모 멘탈케어 | `purple-500` |
| 카카오톡 | `#FEE500` |

---

## 2. 타이포그래피

### 폰트 패밀리

```css
font-family: 'Public Sans', 'Plus Jakarta Sans', 'Spline Sans', 'Noto Sans KR', sans-serif;
```

- **영문**: Public Sans / Plus Jakarta Sans / Spline Sans
- **한글**: Noto Sans KR
- **아이콘**: Material Symbols Outlined

### 크기 체계

| 용도 | 클래스 | 스타일 |
|------|--------|--------|
| 대제목 | `text-[28px]` | font-black, leading-tight |
| 섹션 제목 | `text-xl` ~ `text-2xl` | font-bold |
| 카드 제목 | `text-lg` | font-bold |
| 본문 | `text-sm` ~ `text-base` | font-medium |
| 캡션/라벨 | `text-xs` ~ `text-[11px]` | font-bold, uppercase |

---

## 3. 컴포넌트 패턴

### 3.1 네비게이션 바 (Sticky)

```html
<nav class="sticky top-0 z-50 flex items-center
            bg-background-light/90 dark:bg-background-dark/90
            backdrop-blur-xl p-4 justify-between
            border-b border-gray-100 dark:border-gray-800">
  <!-- 뒤로가기 -->
  <div class="size-10 flex items-center justify-center">
    <span class="material-symbols-outlined">arrow_back_ios</span>
  </div>
  <!-- 타이틀 -->
  <h2 class="text-lg font-bold flex-1 text-center">페이지 제목</h2>
  <!-- 우측 액션 -->
  <div class="size-10 flex items-center justify-center">
    <span class="material-symbols-outlined">share</span>
  </div>
</nav>
```

### 3.2 CTA 버튼 (Primary)

```html
<!-- 메인 CTA -->
<button class="w-full h-14 bg-primary text-navy font-black text-base
               rounded-2xl shadow-xl shadow-primary/20
               active:scale-[0.98] transition-all">
  지금 접수하고 리포트 받기 – $1
</button>

<!-- 가격 태그 포함 -->
<button class="... flex items-center justify-center gap-2">
  <span>분석 시작하기</span>
  <span class="bg-navy/10 px-2 py-0.5 rounded-md text-xs font-bold">$1</span>
  <span class="material-symbols-outlined">arrow_forward</span>
</button>
```

### 3.3 보조 버튼 (Secondary)

```html
<button class="w-full h-14 bg-white dark:bg-gray-800
               text-navy dark:text-white font-bold
               rounded-2xl border border-gray-200 dark:border-gray-700
               active:scale-[0.98] transition-all">
  샘플 리포트 미리보기
</button>
```

### 3.4 Feature Card (아이콘 + 설명)

```html
<div class="flex items-center gap-4 p-4 rounded-xl
            bg-white dark:bg-gray-900
            border border-gray-100 dark:border-gray-800 ios-shadow">
  <!-- 아이콘 -->
  <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10
              flex items-center justify-center text-primary">
    <span class="material-symbols-outlined">psychology</span>
  </div>
  <!-- 텍스트 -->
  <div class="text-left">
    <p class="text-sm font-bold text-navy dark:text-white">과학적 기질 진단</p>
    <p class="text-xs text-gray-500">CBQ 기반 정교한 심리 분석</p>
  </div>
</div>
```

### 3.5 솔루션 카드

```html
<div class="bg-white dark:bg-navy-custom/40 rounded-2xl p-5
            shadow-sm border border-green-custom/10">
  <!-- 헤더 -->
  <div class="flex items-center gap-3 mb-4">
    <div class="size-9 bg-primary/10 rounded-lg
                flex items-center justify-center text-primary">
      <span class="material-symbols-outlined">rocket_launch</span>
    </div>
    <h3 class="text-navy dark:text-white font-bold">에너지 맞춤 놀이 제안</h3>
  </div>
  <!-- 리스트 -->
  <ul class="space-y-3">
    <li class="flex items-start gap-2 text-sm">
      <span class="text-primary font-bold">01.</span>
      <p class="text-green-custom dark:text-white/80">
        <strong class="text-navy dark:text-white">다이나믹 장애물 코스:</strong>
        설명 텍스트...
      </p>
    </li>
  </ul>
</div>
```

### 3.6 대화 스크립트 블록

```html
<div class="bg-background-light dark:bg-navy-custom/60 p-3 rounded-lg
            border-l-4 border-orange-400">
  <p class="text-[11px] text-green-custom mb-1 font-bold">감정 읽어주기</p>
  <p class="text-sm italic dark:text-white/90">
    "와, 정말 멋진 계획인걸! 네 눈이 반짝거리는 걸 보니..."
  </p>
</div>
```

### 3.7 로딩 애니메이션

```html
<div class="flex flex-col items-center justify-center text-center space-y-4">
  <!-- 스피너 -->
  <div class="relative">
    <div class="w-16 h-16 border-4 border-primary/20 border-t-primary
                rounded-full animate-spin"></div>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="material-symbols-outlined text-primary">analytics</span>
    </div>
  </div>
  <!-- 상태 텍스트 -->
  <p class="text-primary font-bold text-lg animate-pulse">
    기질 데이터 분석 중<span class="loading-dots"></span>
  </p>
</div>
```

```css
/* loading-dots 애니메이션 */
.loading-dots:after {
  content: '.';
  animation: dots 1.5s steps(5, end) infinite;
}
@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60% { content: '...'; }
  80%, 100% { content: ''; }
}
```

### 3.8 통합 성향 카드 (Hero)

```html
<div class="bg-gradient-to-br from-white to-primary/5
            dark:from-navy-custom/60 dark:to-primary/10
            rounded-2xl p-6 shadow-sm border border-primary/20
            relative overflow-hidden">
  <!-- 배경 블러 효과 -->
  <div class="absolute -right-4 -top-4 size-24 bg-primary/10 rounded-full blur-2xl"></div>

  <!-- 프로필 + 타입 -->
  <div class="flex items-center gap-4 mb-4">
    <div class="relative">
      <div class="size-20 rounded-full border-4 border-white shadow-md bg-cover"
           style="background-image: url('...')"></div>
      <div class="absolute -bottom-1 -right-1 bg-primary text-navy
                  text-[10px] font-bold px-2 py-0.5 rounded-full">FIRE</div>
    </div>
    <div>
      <h3 class="text-xs font-bold text-primary tracking-widest uppercase">Main Archetype</h3>
      <p class="text-2xl font-bold leading-tight">열정 탐험가형</p>
    </div>
  </div>

  <!-- 궁합 요약 -->
  <div class="bg-white/50 dark:bg-navy-custom/40 rounded-xl p-4">
    <p class="text-sm font-bold text-primary">환상의 찰떡궁합</p>
    <p class="text-sm text-green-custom">부모님의 토(土) 기운이 아이의 화(火) 기운을...</p>
  </div>
</div>
```

### 3.9 Floating CTA (하단 고정)

```html
<div class="fixed bottom-0 left-0 right-0 z-[100] p-4
            bg-gradient-to-t from-background-light via-background-light/95 to-transparent
            dark:from-background-dark dark:via-background-dark/95"
     style="padding-bottom: env(safe-area-inset-bottom);">
  <div class="max-w-md mx-auto">
    <button class="w-full h-14 bg-primary text-navy font-black
                   rounded-2xl shadow-2xl active:scale-95 transition-all">
      분석 시작하기
    </button>
  </div>
</div>
```

---

## 4. 레이아웃

### 4.1 모바일 컨테이너

```html
<div class="relative flex min-h-screen w-full max-w-md mx-auto
            flex-col overflow-x-hidden pb-32">
  <!-- 콘텐츠 -->
</div>
```

### 4.2 섹션 간격

- 섹션 패딩: `py-10` ~ `py-12`
- 내부 패딩: `px-4` ~ `px-6`
- 카드 간격: `gap-4` ~ `gap-6`

### 4.3 탭 네비게이션 (Sticky)

```html
<div class="bg-background-light dark:bg-background-dark
            sticky top-[60px] z-40 border-b border-green-custom/10">
  <div class="flex px-4 justify-between max-w-md mx-auto">
    <button class="flex flex-col items-center py-4 flex-1
                   border-b-[3px] border-transparent text-green-custom/60">
      <p class="text-sm font-bold">📊 기질 분석</p>
    </button>
    <button class="... border-b-[3px] border-primary text-navy">
      <p class="text-sm font-bold">⭐ 통합 솔루션</p>
    </button>
  </div>
</div>
```

---

## 5. 그림자 & 효과

### iOS 스타일 그림자

```css
.ios-shadow {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}
```

### 버튼 그림자

```html
<!-- Primary CTA -->
shadow-xl shadow-primary/20

<!-- Elevated -->
shadow-lg shadow-primary/30

<!-- Floating -->
shadow-2xl
```

### 백드롭 블러

```html
backdrop-blur-xl   /* 강한 블러 (네비게이션) */
backdrop-blur-md   /* 중간 블러 */
```

---

## 6. 인터랙션

### 버튼 피드백

```html
active:scale-[0.98]  /* 살짝 축소 */
active:scale-95      /* 더 강한 축소 */
transition-all       /* 부드러운 전환 */
hover:brightness-105 /* 호버 시 밝아짐 */
```

### 애니메이션

```html
animate-spin   /* 로딩 스피너 */
animate-pulse  /* 깜빡임 효과 */
```

---

## 7. 다크모드

### 토글 방식

```javascript
// Tailwind config
darkMode: "class"

// HTML
<html class="dark">
```

### 색상 전환 패턴

```html
text-navy dark:text-white
bg-white dark:bg-gray-900
border-gray-100 dark:border-gray-800
```

---

## 8. 아이콘 (Material Symbols)

### 설정

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" rel="stylesheet">
```

### 사용

```html
<span class="material-symbols-outlined">psychology</span>
<span class="material-symbols-outlined">favorite</span>
<span class="material-symbols-outlined">auto_awesome</span>
<span class="material-symbols-outlined">rocket_launch</span>
<span class="material-symbols-outlined">chat_bubble</span>
<span class="material-symbols-outlined">check_circle</span>
<span class="material-symbols-outlined">arrow_forward</span>
```

---

## 9. Safe Area (iOS)

```css
.floating-cta {
  padding-bottom: env(safe-area-inset-bottom);
}

.ios-bottom-padding {
  padding-bottom: env(safe-area-inset-bottom, 24px);
}
```

---

## 10. 반응형

- **기본**: 모바일 퍼스트 (max-width: 480px)
- **컨테이너**: `max-w-md mx-auto`
- **Container Queries**: `@container`, `@xl:flex-row`
