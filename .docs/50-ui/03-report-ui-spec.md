# 분석 리포트 화면 UI 스펙 (Analysis Report UI Spec)

## 1. 개요 (Overview)
- **화면명**: 통합 양육 보고서 (Analysis Report)
- **목적**: 기질 분석 결과를 기반으로 아이와 보호자의 기질 매칭 결과와 맞춤형 양육 솔루션을 제공.
- **주요 테마**: 빛(Glow)/그라데이션을 활용한 프리미엄 감성, 글래스모피즘(Glassmorphism) 기반의 깊이감 있는 UI 구성.

## 2. 디자인 시스템 (Design System Tokens)

### 2.1 Color Palette
- **Primary**: `#11d4d4` (Teal/Cyan 계열 - 활력과 솔루션을 상징)
- **Background Light**: `#f6f8f8`
- **Background Dark**: `#102222`
- **Navy Custom**: `#0d1b1b` (텍스트 및 다크모드 메인 바탕)
- **Green Custom**: `#4c9a9a` (보조 텍스트 및 은은한 테두리)

### 2.2 Typography
- **디스플레이 폰트**: `"Public Sans"`, `"Noto Sans KR"`, `"sans-serif"`
- 전체적으로 둥글고 친근하면서도 신뢰감 있는 폰트 렌더링을 위해 `antialiased` 속성을 활용합니다.

---

## 3. 화면별 UI 컴포넌트 스펙

### 3.1 GNB (Global Navigation Bar) & 상단 탭
- **스타일**: Sticky 적용, 배경에 블러(Blur) 효과 추가.
- **클래스 (GNB)**: 
  - `sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md`
  - `border-b border-green-custom/10`
- **타이틀 텍스트**: `text-lg font-bold text-navy-custom dark:text-white leading-tight`
- **상위 탭바 (Tab Bar)**:
  - 3개 항목: ['기질 분석', '사주(기운) 분석', '통합 솔루션']
  - **활성화 상태**: `border-b-[3px] border-primary text-navy-custom dark:text-white`
  - **비활성화 상태**: `border-b-[3px] border-transparent text-green-custom/60`

### 3.2 Main Archetype Card (핵심 기질 카드)
- **레이아웃**: 화면 상단에 위치하며 아이의 메인 기질 타입(예: 열정 탐험가형)을 한눈에 보여주는 큰 카드.
- **배경 / 테두리**:
  - Light 모드: `bg-gradient-to-br from-white to-primary/5 rounded-2xl shadow-sm border border-primary/20`
  - Dark 모드: `dark:from-navy-custom/60 dark:to-primary/10`
- **시각 효과**: 
  - `overflow-hidden` 적용 후, 우측 상단에 번짐 효과가 있는 글로우 원장치 배치 (`absolute -right-4 -top-4 size-24 bg-primary/10 rounded-full blur-2xl`).
- **아바타 & 뱃지**:
  - 아이 얼굴/기질 일러스트 썸네일 테두리 (`border-4 border-white dark:border-navy-custom shadow-md`).
  - 우측 하단 뱃지 (`bg-primary text-navy-custom border-2 border-white font-bold`).
- **궁합 표시 영역 (환상의 찰떡궁합)**:
  - 카드 내부에 살짝 투명한 배경을 가진 박스 삽입 (`bg-white/50 dark:bg-navy-custom/40 border border-white dark:border-green-custom/10`).

### 3.3 정보/솔루션 섹션 아이템 (Action Cards)
- 각각의 맞춤 솔루션을 담고 있는 정보 박스 그룹.
- **컨테이너 스타일**: `bg-white dark:bg-navy-custom/40 rounded-2xl p-5 shadow-sm border border-green-custom/10`
- **구분 및 아이콘 컬러 포인트**:
  1. **에너지 맞춤 놀이 제안**: Primary (`#11d4d4`) 아이콘 배경 (`bg-primary/10 text-primary`).
  2. **필수 대화 스크립트**: Orange (`bg-orange-400/10 text-orange-400`). 스크립트 말풍선 형태의 박스 활용 (`border-l-4 border-orange-400`).
  3. **환경 · 루틴 가이드**: Green (`bg-green-500/10 text-green-500`). `check_circle` 형태로 리스트업.
  4. **부모 멘탈 케어**: Purple (`bg-purple-500/10 text-purple-500`). 인용구(Quote) 형태로 구성 (`italic font-medium`).

### 3.4 하단 CTA 버튼 영역 (Footer Actions)
- 모바일 브라우저/기기의 안전 영역(Safe Area)을 고려한 Bottom 패딩(`ios-bottom-padding`) 적용.
- **보고서 다운로드 (Main CTA)**:
  - `bg-primary text-navy-custom font-bold text-lg rounded-2xl`
  - 추가 이펙트: `shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98]`
- **이메일 발송 (Secondary CTA)**:
  - `bg-white dark:bg-navy-custom/60 border border-green-custom/20 text-navy-custom dark:text-white font-bold text-lg rounded-2xl`

---

## 4. 모바일 반응형 및 다크모드 대응
- **Min Height**: `min-height: max(884px, 100dvh)` 등을 적용하여, 브라우저 주소창 스크롤 시 튕기는 현상 최소화.
- **다크모드 원칙**: `text-navy-custom` 요소들은 다크모드에서 `text-white` 또는 `text-white/80`으로 전환되며, 배경은 `bg-navy-custom/40` 등으로 반투명 처리하여 어두운 환경에서도 글로우(Glow) 효과가 아름답게 돋보이도록 구현합니다.
