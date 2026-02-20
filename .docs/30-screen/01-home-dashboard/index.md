# 홈 화면 (Home Screen)

## 1. 개요 (Overview)
- **경로**: `/`
- **역할**: 부모님(Gardener)을 위한 메인 대시보드.
- **주요 기능**: 데일리 양육 미션 수행, 아이와 정서적 성장 확인, 코칭 프로그램 관리.

## 2. 포함된 기능 (Involved Features)
- **Gardening Solution**: `docs/20-usecase/03-gardening` (New)
- **Child Management**: `docs/30-screen/03-child-management`
- **Parent Profile**: `docs/30-screen/05-parent-profile`

## 3. Model: UI 상태 (UI State)
| 상태명 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `profile` | `UserProfile` | `null` | 로그인된 부모 정보 |
| `children` | `ChildProfile[]` | `[]` | 등록된 자녀 목록 |
| `garden` | `GardenState` | `null` | **[Module C]** 아이 성장/안정도 시각화 데이터 (레벨, 테마, 식물/비주얼) |
| `mission` | `DailyMission` | `null` | **[Module B]** 오늘의 미션 (문장, 가이드, 완료여부) |
| `cycle` | `ProgramCycle` | `null` | 현재 진행 중인 코칭 프로그램 정보 (3/7/14/21일) |
| `loading` | `boolean` | `true` | 로딩 상태 |

## 4. Intent: 사용자 액션 (Actions)

### A. 초기 데이터 로드 (Init)
- **Trigger**: 화면 진입.
- **Action**:
    1. **Call Use Case**: `UC-PROFILE-03. GetFamilyGardenDataUseCase` (프로필/자녀).
    2. **Call Use Case**: `UC-GARDEN-03. GetGardenStatusUseCase` (정원 상태).
    3. **Call Use Case**: `UC-GARDEN-01. GetDailyMissionUseCase` (미션).
- **Update**: `garden`, `mission`, `cycle` 상태 업데이트.

### B. 데일리 미션 수행 (Check Mission)
- **Trigger**: 미션 카드 체크박스 클릭.
- **Action**:
    1. **Call Use Case**: `UC-GARDEN-02. CompleteDailyMissionUseCase`.
    2. 아이 성장 애니메이션 재생 (안정도 상승).
    3. 토스트 메시지 노출 ("오늘의 미션 완료!").
- **Optimistic UI**: 즉시 체크 표시 후 백그라운드 동기화.

### C. 코칭 프로그램 시작/변경 (Manage Cycle)
- **Trigger**: 프로그램 추천 카드 클릭.
- **Action**: `NewCycleModal` 오픈.
- **Flow**: 고민 선택 -> **Call Use Case** `UC-GARDEN-04` (기간 추천) -> 확정.

## 5. View: 주요 컴포넌트 구조

### 5.1 상단 헤더 (Header)
- **Logo**: 기질아이 로고.
- **Profile**: 부모 프로필 이미지 (클릭 시 `MyPage` 이동).
- **Streak**: 연속 수행일 수 (불꽃 아이콘).

### 5.2 우리 아이 (Child Photo Gallery)
- **위치**: 상단 메인 영역 (Hero Section).
- **구성**:
    - 아이 사진 슬라이드쇼 (자동/수동 넘김).
    - 은은한 그라데이션 오버레이로 텍스트 가독성 확보.
    - **Interaction**: 사진 터치 시 전체화면 보기 (추후 구현).

### 5.3 데일리 미션 카드 (Daily Mission)
- **위치**: 메인 비주얼 하단.
- **구성**:
    - **오늘의 한 문장**: 감성적인 코칭 문구.
    - **Check Box**: 수행 여부 체크.
    - **Guide**: 구체적인 실행 가이드 (Accordion).
- **Empty State**: 프로그램이 없을 경우 "새로운 코칭 시작하기" 버튼 노출.

### 5.4 퀵 메뉴 (Quick Access)
- **Report**: 최근 분석 리포트 보기.
- **Child**: 아이 정보 수정/추가.
