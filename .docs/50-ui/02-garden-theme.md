# 가든 테마 디자인 시스템 (Garden Theme Design System)

## 1. 디자인 컨셉
**"자연의 색으로 물든 수채화 정원"**
- 부드러운 파스텔 톤과 자연스러운 그라데이션을 사용하여 편안하고 따뜻한 감성 전달.
- 정형화된 UI보다는 손으로 그린 듯한 느낌과 유기적인 형태(Rounded Shape) 추구.

## 2. 컬러 팔레트 (Color Palette)

tailwind.config.ts 및 globals.css에 정의된 변수입니다.

| 변수명 | 색상코드 | 역할 |
|---|---|---|
| **garden-green** | `#7A9D54` | **Primary Color**. 생명력, 성장, 강조, 활성 상태. |
| **garden-brown** | `#8D7B68` | **Text Color**. 흙의 색, 안정감, 본문 텍스트. |
| **garden-soft-green** | `#A1C398` | **Secondary**. 부드러운 배경, 보조 요소. |
| **garden-cream** | `#F9F7F0` | **Background**. 따뜻한 미색 배경, 종이 질감 느낌. |
| **garden-petal** | `#F3D7CA` | **Accent**. 꽃잎 색, 포인트 강조, 아이(Child) 상징. |
| **garden-accent** | `#D0B0A7` | **Border/Sub**. 차분한 경계선, 비활성 요소. |
| **navy** | `#0d1b1b` | **Heading**. 강한 대비가 필요한 제목. |

## 3. 타이포그래피 (Typography)

| 종류 | 폰트 패밀리 | 적용 클래스 | 용도 |
|---|---|---|---|
| **Display** | `'Noto Serif KR', serif` | `font-display` | 감성적인 헤드라인, 브랜드 타이틀. |
| **Body** | `'Noto Sans KR', sans-serif` | `font-sans` | 본문, UI 요소, 가독성 중심. |

## 4. UI 패턴

### 4.1 글래스모피즘 (Glassmorphism)
- 배경이 투명하게 비치는 블러 효과를 사용하여 공간감 부여.
- `bg-white/50`, `backdrop-blur-sm`, `border-white/60` 조합 사용.

### 4.2 수채화 배경 (Watercolor Background)
- 전역 배경(`layout.tsx`)에 적용된 블러 그라데이션.
- `radial-gradient`와 `filter: blur(60px)`를 사용하여 몽환적인 분위기 연출.

### 4.3 둥근 카드 (Rounded Cards)
- `rounded-2xl` (16px) ~ `rounded-3xl` (24px) 사용.
- 부드러운 그림자(`shadow-sm`)와 얇은 테두리(`border`)로 깊이감 표현.

## 5. 아이콘 (Icons)
- **Material Symbols Outlined** 사용.
- 굵기(Weight) 300으로 얇고 세련된 느낌 유지.
- 필요한 경우 `FILL` 속성을 1로 변경하여 강조(Active) 상태 표현.
