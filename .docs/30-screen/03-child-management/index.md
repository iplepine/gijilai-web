# 아이 관리 (Child Management)

## 1. 개요 (Overview)
- **Feature**: 자녀 정보 관리 (등록, 수정, 조회, 삭제)
- **Roles**:
  - **등록 (Registration)**: `/settings/child/new`
  - **수정 (Edit)**: `/settings/child/[id]`

---

## 2. 화면별 명세 (Screen Specifications)

### 2-1. 아이 등록 화면 (Child Registration)
- **경로**: `/settings/child/new`

#### A. Model: UI 상태 (UI State)
| 상태명 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `avatarFile` | `File \| null` | `null` | 선택된 사진 파일 |
| ... | ... | ... | ... |
| `isSubmitting` | `boolean` | `false` | 로딩 상태 |

#### B. Intent: 사용자 액션 처리 (Actions)
1. **등록 완료 (Submit)**
   - **Flow**:
     1. Validations.
     2. `isSubmitting` = true.
     3. **Call Use Case**: `UC-CHILD-01. UploadChildAvatarUseCase` (if file exists).
     4. **Call Use Case**: `UC-CHILD-02. RegisterChildUseCase`.
     5. 성공 시 홈(`/`) 이동.

---

### 2-2. 아이 정보 수정 화면 (Child Edit)
- **경로**: `/settings/child/[id]`

#### A. Model: UI 상태
| 상태명 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `childId` | `string` | URL Param | 수정할 아이 ID |
| ... | ... | ... | ... |

#### B. Intent: 사용자 액션 처리
1. **초기 데이터 로드**
   - **Call Use Case**: `UC-CHILD-03. FetchChildDetailsUseCase` -> State 업데이트.
2. **수정 저장 (Update)**
   - **Call Use Case**: `UC-CHILD-01` (사진 변경 시).
   - **Call Use Case**: `UC-CHILD-04. UpdateChildDetailsUseCase`.
   - 성공 시 홈(`/`) 이동.
3. **삭제 (Delete)**
   - 사용자 Confirm.
   - **Call Use Case**: `UC-CHILD-05. DeleteChildUseCase`.

---

## 3. Reference
- **Use Cases Defined in**: `docs/20-usecase/01-child.md`
