# 내 프로필 설정 (My Profile)

## 1. 개요 (Overview)
- **경로**: `/settings/profile`
- **역할**: 부모(사용자) 데이터 관리.

## 2. Model: UI 상태
| 상태명 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `profile` | `UserProfile \| null` | `null` | 부모 정보 |
| `isEditing` | `boolean` | `false` | 수정 모드 |

## 3. Intent: 사용자 액션
### A. 초기 로드
- **Call Use Case**: `UC-PROFILE-01. FetchUserProfileUseCase`.

### B. 정보 수정
- **Call Use Case**: `UC-PROFILE-02. UpdateUserProfileUseCase`.

---

## 4. Reference
- **Use Cases Defined in**: `docs/20-usecase/02-auth-profile.md`
