# 아이 관리 유즈케이스 (Child Domain Use Cases)

## 1. 개요
자녀 정보 관리와 관련된 비즈니스 로직을 정의합니다.

## 2. Use Cases

### UC-CHILD-01. UploadChildAvatarUseCase
- **Description**: 아이의 프로필 사진을 클라우드 스토리지에 업로드합니다.
- **Input**: `file: File`
- **Output**: `publicUrl: string`
- **Logic**:
  1. 파일 확장자 검증.
  2. Storage `avatars` 버킷에 고유 파일명으로 업로드.
  3. 업로드된 파일의 Public URL 반환.

### UC-CHILD-02. RegisterChildUseCase
- **Description**: 새로운 아이 정보를 등록합니다.
- **Input**: `childProfile: Omit<ChildProfile, 'id'>`
- **Output**: `createdChild: ChildProfile`
- **Logic**:
  1. 필수 데이터(이름, 생년월일) 검증.
  2. DB `children` 테이블에 INSERT.
  3. 생성된 레코드 반환.

### UC-CHILD-03. FetchChildDetailsUseCase
- **Description**: 특정 아이의 상세 정보를 조회합니다.
- **Input**: `childId: string`
- **Output**: `ChildProfile`
- **Logic**:
  1. DB `children` 테이블에서 ID로 조회.
  2. 데이터 존재 여부 확인 (없으면 에러).

### UC-CHILD-04. UpdateChildDetailsUseCase
- **Description**: 아이 정보를 수정합니다.
- **Input**: `childId: string`, `updates: Partial<ChildProfile>`
- **Output**: `updatedChild: ChildProfile`
- **Logic**:
  1. 수정 권한 확인 (RLS).
  2. DB `children` 테이블 UPDATE.

### UC-CHILD-05. DeleteChildUseCase
- **Description**: 아이 정보를 삭제합니다.
- **Input**: `childId: string`
- **Output**: `void`
- **Logic**:
  1. 관련된 리포트 등 하위 데이터 처리 확인 (Cascade or Restrict).
  2. DB `children` 테이블 DELETE.
