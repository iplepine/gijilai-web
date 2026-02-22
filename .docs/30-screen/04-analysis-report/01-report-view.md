# 통합 양육 보고서 화면 (Integrated Analysis Report)

## 1. 개요 (Overview)
- **경로**: `/report`
- **역할**: 아이와 보호자의 기질 분석 결과를 바탕으로, 맞춤형 양육 가이드와 솔루션을 제공하는 최종 리포트 화면.
- **Feature**: `Analysis and Coaching`

## 2. Model: UI 상태 (UI State)
| 상태명 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `activeTab` | `'child' \| 'parent'` | `'child'` | 현재 선택된 탭 ('아이 기질 보고서' 또는 '부모 기질 보고서'). |
| `childScores` | `TemperamentScores` | 계산값 | 아이 기질(CBQ) 검사 결과 |
| `parentScores` | `TemperamentScores` | 계산값 | 부모 기질(ATQ) 검사 결과 |
| `styleScores` | `ParentingStyleScores` | 계산값 | 부모 양육 태도 검사 결과 |
| `childType` | `Archetype` | 계산값 | 아이 기질 종합 결과 (열정 탐험가형 등) 및 부모 아이 기질 궁합 정보 |
| `isPaid` | `boolean` | `useAppStore()` 상태 | 깊은 처방(마법의 한마디 등) 접근 권한 유무 |

## 3. Intent: 사용자 액션 (Actions)

### A. 탭 전환 (Tab Switching)
- **Trigger**: 상단 탭 버튼 클릭
- **Condition**: 부모용 탭 진입 시 부모 검사 완료 여부 확인
- **Actions**:
  1. 완료 시 `activeTab` 상태 업데이트
  2. 미완료 시 "부모 기질 검사를 먼저 완료해야 합니다." 알림창 노출 후 `/survey?type=PARENT` 로 이동 제안

### B. 처방전 구매 (Unlock Premium Content)
- **Trigger**: '990원에 처방전 구매하기' 버튼 클릭
- **Condition**: `isPaid === false` 일 때 노출
- **Actions**:
  1. **Navigate**: `/payment` 경로로 이동

### C. 솔루션 공유 (Share Report)
- **Trigger**: '결과 공유하고 할인권 받기' (또는 최상단 공유 아이콘) 클릭
- **Actions**:
  1. **Navigate**: `/share` 로 이동 (이후 기본 공유 기능(Web Share API) 호출)

### D. 홈 이동 (Back to Home)
- **Trigger**: 커스텀 백엔드 화살표 `<` 또는 하단 홈 돌아가기 텍스트
- **Actions**:
  1. **Navigate**: `/` 이동

## 4. View: 주요 렌더링 로직 (Rendering)
- **Header**:
  - `bg-primary` 배경의 헤더로 텍스트/이름 렌더 시, 블리딩(Blurs) 이펙트 적용.
- **TabBar**: 
  - `activeTab`에 따라 하이라이트/텍스트 컬러 트랜지션 적용.
- **Main Content (`activeTab === 'child'`)**:
  - **Child Archetype Section**: 아바타 및 메인 기질 이름 표시.
  - **Temperament Match Section**: 카드 분할 렌더링(부모 기질 요약, 아이 기질 요약).
  - **Radar Chart**: 기질 분석 데이터 `Chart.js` 렌더.
  - **조화 지수 (Harmony Index)**: 두 기질 비교 계산 기반 바 및 텍스트 상태(갈등 가능성/완화 등) 렌더링.
  - **Premium Solutions (Optional)**: `isPaid` 상태에 따라 잠금 혹은 상세 솔루션 (놀이 제안, 대화 스크립트 등) 해제 노출.
- **Main Content (`activeTab === 'parent'`)**:
  - 부모 기질에 따른 멘탈 케어 가이드 묘사 (에너지 고갈 상태, 회복 루틴 제안 등) 렌더.

## 5. Reference (Use Cases)
*이 화면에서 사용하는 비즈니스 로직(Use Case) 목록입니다.*
- **Defined in**: `docs/10-domain/05-analysis-logic.md`
  - `TemperamentScorer.calculate`
  - `TemperamentClassifier.analyze`
  - `ParentClassifier.analyze`

## 6. 검증 기준 (Acceptance Criteria)
- [ ] 아이 기질 검사 기반 올바른 점수가 계산되어 렌더링되는가?
- [ ] 조화 지수 점수 차이에 따른 UI 컬러 지표 반영이 즉각적으로 이뤄지는가?
- [ ] 유료 진입 상태(`isPaid=true`) 시 잠긴 처방전이 정확히 풀리는가?
- [ ] 다크모드/라이트모드 진입 시 디자인 시스템 및 테마 토큰(Tailwind Custom colors)이 깨짐 없이 동작하는가?
