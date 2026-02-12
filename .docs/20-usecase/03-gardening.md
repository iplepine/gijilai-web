# Gardening Domain Use Cases

## 1. 개요 (Overview)
- **Domain**: Gardening (양육 코칭 및 정원 가꾸기)
- **Actors**: 부모(Gardener)
- **Description**: 데일리 미션 수행, 정원 성장 시각화, 코칭 프로그램 관리 로직.

---

## 2. Use Cases

### UC-GARDEN-01. GetDailyMissionUseCase
- **Description**: 오늘 수행해야 할 양육 미션과 가이드를 조회합니다.
- **Input**: `gardenerId: string`, `date: Date`
- **Output**: `DailyMission` (오늘의 문장, 반응 가이드, 완료 여부)
- **Logic**:
  1. 현재 진행 중인 프로그램(Cycle) 확인.
  2. 해당 일차의 미션 데이터 조회.
  3. 완료 여부 반환.

### UC-GARDEN-02. CompleteDailyMissionUseCase
- **Description**: 오늘의 미션을 수행 완료(체크) 처리하고 정원을 성장시킵니다.
- **Input**: `missionId: string`
- **Output**: `updatedGardenState: GardenState`
- **Logic**:
  1. 미션 상태를 'Completed'로 업데이트.
  2. 정원 경험치(Growth Point) 증가.
  3. 성장이 임계치에 도달하면 정원 레벨업(식물 단계 변화).
  4. 업데이트된 정원 상태 반환.

### UC-GARDEN-03. GetGardenStatusUseCase
- **Description**: 현재 정원의 시각적 상태와 성장 데이터를 조회합니다.
- **Input**: `gardenerId: string`
- **Output**: `GardenState` (레벨, 식물 종류, 현재 모습 URL)
- **Logic**:
  1. 사용자의 누적 수행 데이터(Streak, Total Missions) 조회.
  2. 현재 정원 레벨 및 테마 계산.
  3. 렌더링할 에셋 정보 반환.

### UC-GARDEN-04. RecommendProgramCycleUseCase (Module B2)
- **Description**: 기질 분석 결과와 고민을 바탕으로 최적의 코칭 기간을 추천합니다.
- **Input**: `childId: string`, `concerns: string[]`
- **Output**: `recommendedCycle: 3 | 7 | 14 | 21`
- **Logic**:
  1. 아이 기질의 '지속성(P)'과 부모의 '효능감' 분석.
  2. 고민의 심각도(Intensity) 평가.
  3. 부담스럽지 않은 최적의 수행 기간 산출 (e.g., 효능감 낮으면 3일 추천).
