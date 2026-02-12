# 인증/프로필 유즈케이스 (Auth & Profile Domain)

## 1. 개요
사용자 인증 및 부모 프로필 관리 로직을 정의합니다.

## 2. Use Cases

### UC-AUTH-01. SignInWithOAuthUseCase
- **Description**: 소셜 로그인 인증을 요청합니다.
- **Input**: `provider: 'kakao' | 'google'`
- **Output**: `void` (Redirect)
- **Logic**:
  1. Supabase Auth `signInWithOAuth` 호출.
  2. Redirect URL 설정.

### UC-PROFILE-01. FetchUserProfileUseCase
- **Description**: 부모 사용자의 프로필 정보를 조회합니다.
- **Input**: `userId: string`
- **Output**: `UserProfile`
- **Logic**:
  1. DB `profiles` 테이블 조회.

### UC-PROFILE-02. UpdateUserProfileUseCase
- **Description**: 부모 프로필 정보를 수정합니다.
- **Input**: `userId: string`, `updates: Partial<UserProfile>`
- **Output**: `UserProfile`
- **Logic**:
  1. DB `profiles` 테이블 UPDATE.

### UC-PROFILE-03. GetFamilyGardenDataUseCase
- **Description**: 홈 대시보드 구성을 위한 종합 데이터를 조회합니다.
- **Input**: `userId: string`
- **Output**: `{ profile, children, reports }`
- **Logic**:
  1. `FetchUserProfileUseCase` (부모)
  2. `FetchChildrenUseCase` (자녀 목록 - Child Domain)
  3. `FetchRecentReportsUseCase` (리포트 목록 - Report Domain)
  4. 병렬 조회 및 집계 반환.
