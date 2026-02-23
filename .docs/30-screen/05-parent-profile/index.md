# 내 정보 (My Page)

## 1. 개요 (Overview)
- **경로**: `/settings/profile`
- **역할**: 사용자의 계정 정보 확인 및 앱 내 주요 설정/관리 메뉴 제공.
- **연결**: 하단 네비게이션의 '내 정보' 탭.

## 2. 화면 구성 (UI Components)

### A. 헤더 (Header)
- **타이틀**: "내 정보"
- **스타일**: Sticky header, 투명도 있는 백드롭 블러 적용.

### B. 프로필 섹션 (Profile Section)
- **사용자 정보**: 이름, 이메일 주소 표시.
- **프로필 이미지**: 기본 아바타 또는 사용자 설정 이미지.
- **수정 버튼**: 내 정보 수정을 위한 진입점.

### C. 자녀 관리 섹션 (Child Management)
- **리스트**: 등록된 자녀 목록 표시.
- **기능**: 자녀 정보 수정 및 추가 등록 진입점.

### D. 앱 설정 및 정보 (App Settings)
- **메뉴 리스트**:
  - 알림 설정
  - 서비스 이용약관
  - 개인정보 처리방침
  - 고객센터

### E. 계정 관리 (Account Management)
- **로그아웃**: 세션 종료 및 로그인 화면으로 이동.
- **회원 탈퇴**: 계정 및 데이터 삭제 (확인 팝업 포함).

## 3. Model: UI 상태
| 상태명 | 타입 | 초기값 | 설명 |
|---|---|---|---|
| `profile` | `UserProfile \| null` | `null` | 부모 정보 |
| `children` | `ChildProfile[]` | `[]` | 등록된 자녀 목록 |
| `isLoading` | `boolean` | `true` | 데이터 로딩 상태 |

## 4. Intent: 사용자 액션
### A. 초기 로드
- **Action**: `db.getDashboardData`를 호출하여 프로필 및 자녀 정보 획득.

### B. 설정 메뉴 클릭
- **Action**: 각 설정 화면(`/settings/...`)으로 경로 이동.

### C. 로그아웃
- **Action**: `supabase.auth.signOut()` 호출 후 `/login` 이동.

---

## 5. Reference
- **Use Cases**: `docs/20-usecase/02-auth-profile.md`
- **Design System**: `docs/50-ui/01-design-system.md`

