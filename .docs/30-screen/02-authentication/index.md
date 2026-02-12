# 로그인 화면 (Login Screen)

## 1. 개요 (Overview)
- **경로**: `/login`
- **역할**: 소셜 로그인 인증 진입점.

## 2. Model: UI 상태
- Stateless (소셜 로그인 페이지로 리디렉션).

## 3. Intent: 사용자 액션
### A. 소셜 로그인 요청
- **Trigger**: 버튼 클릭.
- **Call Use Case**: `UC-AUTH-01. SignInWithOAuthUseCase`.

---

## 4. Reference
- **Use Cases Defined in**: `docs/20-usecase/02-auth-profile.md`
