# [화면 이름] ([Screen Name])

## 1. 개요 (Overview)
- **경로**: `[Route Path]`
- **역할**: [이 화면의 핵심 역할 한 줄 요약]
- **Feature**: `[Related Feature Name]`

## 2. Model: UI 상태 (UI State)
| 상태명 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `[stateName]` | `[Type]` | `[Initial Value]` | [설명] |
| `isLoading` | `boolean` | `true` | 로딩 상태 |

## 3. Intent: 사용자 액션 (Actions)

### A. [액션 이름] ([Action Name])
- **Trigger**: [버튼 클릭 / 화면 진입 / 입력 변경 등]
- **Condition**: [실행 조건 (Optional)]
- **Actions**:
  1. **Call Use Case**: `[Use Case Name]` (See Reference)
  2. **State Update**: [상태 변경 내용]
  3. **Navigate**: [이동할 경로 (Optional)]

### B. [또 다른 액션]
- ...

## 4. View: 주요 렌더링 로직 (Rendering)
- **[Component Name]**:
  - [Condition]: [Display Logic]
- **Error State**:
  - [Condition]: [Error Message]

## 5. Reference (Use Cases)
*이 화면에서 사용하는 비즈니스 로직(Use Case) 목록입니다.*
- **Defined in**: `docs/20-usecase/[filename].md`
  - `[Use Case Name 1]`
  - `[Use Case Name 2]`

## 6. 검증 기준 (Acceptance Criteria)
- [ ] [기준 1]
- [ ] [기준 2]
