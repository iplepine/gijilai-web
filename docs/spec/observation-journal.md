# 육아 관찰 일지 Specification

Status: Draft v1
Date: 2026-03-22

## 1. Problem Statement

현재 서비스의 핵심 루프(상담 → 처방전 → 실천 → 변화 관찰 → 다음 상담)에서 "실천 → 변화 관찰" 구간이 완전히 빠져 있다. 처방전의 actionItem을 받은 뒤 추적/기록 수단이 없어 사용자는 매번 처음부터 상담을 시작하며, AI도 과거 맥락 없이 범용 처방을 반복한다. 근거 기반 양육 프로그램(Triple P, PCIT)에서 입증된 "관찰 기록(ABC Recording)" 방식을 도입하여, 양육자가 구체적 상호작용 에피소드를 기록하고 축적된 데이터가 다음 상담 시 LLM 컨텍스트로 자동 주입되는 피드백 루프를 완성한다.

## 2. Goals and Non-Goals

### 2.1 Goals
- 관찰 일지 기록 기능: 상황 → 내 행동 → 아이 반응 3단계 구조화 기록
- 상담 처방전과의 선택적 연결 (연결 없이 독립 기록도 가능)
- 기록 탭을 "관찰일지" 전용 탭으로 리뉴얼 (매일 사용하는 핵심 공간)
- 상담기록(과거 상담 열람)을 상담 탭으로 이동
- 다음 상담 시 최근 관찰 기록을 LLM 프롬프트에 자동 주입
- 아이별 필터링 지원

### 2.2 Non-Goals
- 패턴 분석/요약 대시보드 — v2에서 관찰 데이터가 충분히 쌓인 후 구현
- 푸시 알림 / 리마인더 — 별도 기능으로 분리
- 사진/미디어 첨부 — 텍스트 기록으로 시작, 추후 확장 가능
- 관찰 기록의 AI 자동 분석/코멘트 — v2 범위
- 분석 탭 변경 — 이 spec 범위 밖

## 3. Change Scope

### 3.1 New Components
- **`observations` Supabase 테이블**: 관찰 기록 저장
- **`app/src/app/record/page.tsx`**: 전면 재작성 — 관찰일지 메인 페이지
- **`app/src/app/api/observations/route.ts`**: 관찰 기록 CRUD API 라우트

### 3.2 Modified Components
- **`app/src/types/supabase.ts`**: `observations` 테이블 타입 추가
- **`app/src/lib/db.ts`**: 관찰 기록 CRUD 함수 추가 (`createObservation`, `getObservations`, `deleteObservation`)
- **`app/src/components/layout/BottomNav.tsx`**: 기록 탭 라벨을 "관찰일지"로 변경, 아이콘을 `edit_note`로 변경
- **`app/src/app/consult/page.tsx`**: 상담 INPUT 단계에 "지난 상담 보기" 링크 추가, 상담 시작 시 최근 관찰 기록을 API에 전달
- **`app/src/app/api/consult/prescription/route.ts`**: 요청에 포함된 관찰 기록을 LLM 프롬프트에 주입
- **`app/src/app/api/consult/questions/initial/route.ts`**: 요청에 포함된 관찰 기록을 LLM 프롬프트에 주입

### 3.3 Unchanged (Explicit Preservation)
- `app/src/app/report/page.tsx`: 분석 탭 전체 — 수정 없음
- `app/src/lib/TemperamentScorer.ts`: 점수 산출 로직 — 수정 없음
- `app/src/lib/TemperamentClassifier.ts`: 분류기 — 수정 없음
- `app/src/lib/prompts.ts`: 리포트 생성 프롬프트 — 수정 없음 (상담 프롬프트와 별개)
- `app/src/lib/openai.ts`: OpenAI 클라이언트 — 수정 없음
- `app/src/store/useAppStore.ts`: 앱 스토어 — 수정 없음
- `app/src/store/surveyStore.ts`: 설문 스토어 — 수정 없음
- `app/src/app/settings/`: 설정 페이지 전체 — 수정 없음
- `app/src/components/auth/AuthProvider.tsx`: 인증 — 수정 없음
- 결제 관련 코드 전체 — 수정 없음
- `consultations` 테이블 스키마 — 수정 없음

## 4. Data Model

### 4.1 New: `observations` 테이블

```sql
CREATE TABLE observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE SET NULL,
    consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
    situation TEXT NOT NULL,
    my_action TEXT NOT NULL,
    child_reaction TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_observations_user_id ON observations(user_id);
CREATE INDEX idx_observations_child_id ON observations(child_id);
CREATE INDEX idx_observations_created_at ON observations(created_at DESC);

ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own observations"
    ON observations FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK, auto | 기록 ID |
| user_id | UUID | NOT NULL, FK | 작성자 |
| child_id | UUID | nullable, FK | 대상 아이 (다자녀 지원) |
| consultation_id | UUID | nullable, FK | 연결된 상담 (없으면 독립 기록) |
| situation | TEXT | NOT NULL | 어떤 상황이었나 |
| my_action | TEXT | NOT NULL | 나는 어떻게 했나 |
| child_reaction | TEXT | NOT NULL | 아이는 어떻게 반응했나 |
| note | TEXT | nullable | 느낀 점/메모 (선택) |
| created_at | TIMESTAMPTZ | NOT NULL, auto | 작성 시각 |

### 4.2 TypeScript 타입 (`supabase.ts`에 추가)

```typescript
observations: {
    Row: {
        id: string
        user_id: string
        child_id: string | null
        consultation_id: string | null
        situation: string
        my_action: string
        child_reaction: string
        note: string | null
        created_at: string
    }
    Insert: {
        id?: string
        user_id: string
        child_id?: string | null
        consultation_id?: string | null
        situation: string
        my_action: string
        child_reaction: string
        note?: string | null
        created_at?: string
    }
    Update: {
        id?: string
        user_id?: string
        child_id?: string | null
        consultation_id?: string | null
        situation?: string
        my_action?: string
        child_reaction?: string
        note?: string | null
        created_at?: string
    }
}
```

### 4.3 DB 헬퍼 (`db.ts`에 추가)

```typescript
export type ObservationData = Database['public']['Tables']['observations']['Row'];

// 관찰 기록 생성
createObservation: async (observation: Omit<ObservationData, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
        .from('observations')
        .insert(observation)
        .select()
        .single();
    if (error) throw error;
    return data as ObservationData;
},

// 관찰 기록 목록 (아이별 필터 지원)
getObservations: async (userId: string, childId?: string) => {
    let query = supabase
        .from('observations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (childId) {
        query = query.eq('child_id', childId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as ObservationData[];
},

// 관찰 기록 삭제
deleteObservation: async (observationId: string) => {
    const { error } = await supabase
        .from('observations')
        .delete()
        .eq('id', observationId);
    if (error) throw error;
},

// 최근 관찰 기록 (상담 컨텍스트 주입용)
getRecentObservations: async (userId: string, limit: number = 5) => {
    const { data, error } = await supabase
        .from('observations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw error;
    return data as ObservationData[];
},
```

## 5. Core Behavior

### 5.1 관찰일지 페이지 (`/record`)

#### 5.1.1 페이지 구조

```
[Navbar: "관찰일지"]
[아이별 필터 칩: 전체 | 아이1 | 아이2 ...]
[새 관찰 기록 작성 버튼 (FAB 또는 상단 CTA)]
[관찰 기록 리스트 (최신순)]
[BottomNav]
```

#### 5.1.2 상태 분기

```pseudocode
IF authLoading THEN
    show spinner "기록을 불러오고 있어요"
ELSE IF !user THEN
    redirect to /login
ELSE IF children.length === 0 THEN
    show empty state: "첫 아이 등록하고 시작하기" → /intake
ELSE IF observations.length === 0 THEN
    show empty state: 관찰일지 소개 + "첫 관찰 기록 남기기" CTA
ELSE
    show observation list (filtered by selectedChildId)
END
```

#### 5.1.3 관찰 기록 카드 UI

각 관찰 기록은 카드로 표시:

```
┌─────────────────────────────────────┐
│ 2026.03.22  ·  유진                  │
│                                     │
│ 📍 상황                             │
│ "저녁 밥 안 먹겠다고 숟가락 던짐"      │
│                                     │
│ 💬 내 행동                           │
│ "선택지를 줘봤다: 3숟갈만 먹을래,      │
│  아니면 과일로 바꿀래?"               │
│                                     │
│ 👶 아이 반응                          │
│ "고민하더니 과일 골랐다"               │
│                                     │
│ 🔗 연결된 처방전 (있을 경우만 표시)     │
│ "선택지를 주면 자율성 욕구가..."       │
│                                     │
│                          [삭제]      │
└─────────────────────────────────────┘
```

- 연결된 consultation이 있으면 해당 처방전의 actionItem을 축약 표시 (1줄, line-clamp-1)
- 연결된 consultation이 없으면 해당 영역 미표시
- 삭제 버튼: 탭 시 confirm 다이얼로그 "이 관찰 기록을 삭제할까요?" → 확인 시 삭제

#### 5.1.4 새 관찰 기록 작성

작성 UI는 **바텀시트 모달**로 구현 (페이지 이동 없음, 기록 허들을 낮추기 위함):

```
┌─────────────────────────────────────┐
│                [X 닫기]              │
│                                     │
│  오늘의 관찰 기록                     │
│                                     │
│  아이 선택 (칩: 유진 | 민준)          │
│  → 아이가 1명이면 자동 선택, 칩 미표시  │
│                                     │
│  어떤 상황이었나요? *                  │
│  [textarea, placeholder:             │
│   "밥 안 먹겠다고 떼씀"]              │
│                                     │
│  어떻게 대응하셨나요? *                │
│  [textarea, placeholder:             │
│   "처방전대로 선택지를 줘봤다"]         │
│                                     │
│  아이가 어떻게 반응했나요? *            │
│  [textarea, placeholder:             │
│   "고민하더니 하나 골랐다"]            │
│                                     │
│  느낀 점 (선택)                       │
│  [textarea, placeholder:             │
│   "의외로 잘 통했다"]                 │
│                                     │
│  연결할 상담 처방전 (선택)             │
│  [최근 상담 3건 드롭다운 | 연결 안 함]  │
│                                     │
│  [기록 저장하기] (primary button)      │
│                                     │
└─────────────────────────────────────┘
```

**필드 유효성 검사:**
- situation: 필수, 1자 이상 200자 이하
- my_action: 필수, 1자 이상 200자 이하
- child_reaction: 필수, 1자 이상 200자 이하
- note: 선택, 0~300자
- child_id: 아이가 1명이면 자동, 2명 이상이면 필수 선택
- consultation_id: 선택

**저장 흐름:**

```pseudocode
ON save button click:
    IF situation.trim() === '' OR my_action.trim() === '' OR child_reaction.trim() === '' THEN
        show inline error on empty fields
        RETURN
    END

    SET isSubmitting = true
    TRY
        CALL db.createObservation({
            user_id: user.id,
            child_id: selectedChildId,
            consultation_id: selectedConsultationId or null,
            situation: situation.trim(),
            my_action: myAction.trim(),
            child_reaction: childReaction.trim(),
            note: note.trim() or null
        })
        CLOSE modal
        PREPEND new record to observations list (optimistic)
        SHOW toast "기록이 저장되었어요"
    CATCH error
        SHOW toast "저장에 실패했어요. 다시 시도해주세요."
        console.error(error)
    FINALLY
        SET isSubmitting = false
    END
```

**연결할 상담 드롭다운:**
- 해당 아이의 최근 상담 3건을 `consultations` 테이블에서 조회
- 각 항목: `"{formatDate(created_at)} - {problem_description 앞 20자}..."`
- 첫 번째 옵션: "연결 안 함" (기본값)

### 5.2 상담 탭 변경 (`/consult`)

#### 5.2.1 INPUT 단계에 "지난 상담" 접근점 추가

상담 INPUT 단계의 상단에 텍스트 링크 추가:

```pseudocode
// 기존 INPUT UI 위에 추가
IF user has past consultations THEN
    show link: "지난 상담 보기 →"
    ON click: open past consultations bottom sheet modal
END
```

**지난 상담 바텀시트**: 현재 `/record` 페이지의 상담 목록 UI를 그대로 재사용 (리스트 + 상세 모달). 기존 `record/page.tsx`의 상담 리스트 렌더링 코드와 상세 모달 코드를 별도 컴포넌트로 추출하지 않고, 바텀시트 내에서 동일 구조로 구현한다.

#### 5.2.2 상담 시작 시 관찰 기록 전달

```pseudocode
// consult/page.tsx의 handleStartDiagnostic 수정
ON handleStartDiagnostic:
    recentObservations = AWAIT db.getRecentObservations(user.id, 5)

    // 기존 API 호출에 observations 추가
    fetch('/api/consult/questions/initial', {
        body: JSON.stringify({
            problem: fullProblem,
            childName: intake.childName,
            recentObservations: recentObservations  // 새로 추가
        })
    })
```

```pseudocode
// consult/page.tsx의 handleGeneratePrescription 수정
ON handleGeneratePrescription:
    recentObservations = AWAIT db.getRecentObservations(user.id, 5)

    fetch('/api/consult/prescription', {
        body: JSON.stringify({
            problem: fullProblem,
            answers: allAnswers,
            childArchetype,
            parentArchetype,
            recentObservations: recentObservations  // 새로 추가
        })
    })
```

### 5.3 LLM 프롬프트 컨텍스트 주입

#### 5.3.1 `/api/consult/questions/initial/route.ts` 수정

요청 바디에서 `recentObservations`를 추출하여 시스템 프롬프트에 추가:

```pseudocode
// recentObservations가 있고 length > 0이면 프롬프트에 섹션 추가
IF recentObservations AND recentObservations.length > 0 THEN
    observationContext = formatObservationsForPrompt(recentObservations)
    // systemPrompt의 "[응답 원칙]" 앞에 삽입:
    append to systemPrompt:
    """
    **[최근 양육 관찰 기록]**
    양육자가 최근 기록한 아이와의 상호작용입니다. 이 맥락을 참고하여 질문을 생성하세요.
    {observationContext}
    """
END
```

#### 5.3.2 `/api/consult/prescription/route.ts` 수정

동일 패턴으로 `recentObservations`를 프롬프트에 주입:

```pseudocode
IF recentObservations AND recentObservations.length > 0 THEN
    observationContext = formatObservationsForPrompt(recentObservations)
    // systemPrompt의 "[분석 재료]" 섹션에 추가:
    append to "[분석 재료]":
    """
    - 최근 양육 관찰 기록:
    {observationContext}
    """

    // "[응답 가이드]" 섹션에 추가:
    append:
    """
    5. **관찰 기록 연계**: 양육자의 최근 관찰 기록을 참고하여, 이전에 시도한 방법 중 효과적이었던 것은 강화하고 효과가 없었던 것은 다른 접근을 제안하세요. 관찰 기록이 있으면 "지난번에 ~를 시도하셨는데"와 같이 자연스럽게 언급하세요.
    """
END
```

#### 5.3.3 관찰 기록 포맷 함수

두 API 라우트에서 공통 사용하는 포맷 함수. 각 라우트 파일 내에 인라인으로 구현한다 (별도 유틸 파일 불필요):

```typescript
function formatObservationsForPrompt(observations: any[]): string {
    return observations.map((obs, i) => {
        const date = new Date(obs.created_at).toLocaleDateString('ko-KR');
        let entry = `[${date}] 상황: ${obs.situation} → 양육자 행동: ${obs.my_action} → 아이 반응: ${obs.child_reaction}`;
        if (obs.note) {
            entry += ` (메모: ${obs.note})`;
        }
        return entry;
    }).join('\n');
}
```

### 5.4 BottomNav 변경

```typescript
// 변경 전
{ href: '/record', label: '기록', icon: 'chat_bubble_outline' }

// 변경 후
{ href: '/record', label: '관찰일지', icon: 'edit_note' }
```

## 6. Failure Model and Recovery

| 실패 상황 | 복구 방식 |
|-----------|-----------|
| 관찰 기록 저장 실패 (네트워크) | toast "저장에 실패했어요. 다시 시도해주세요." + 모달 유지 (입력 내용 보존) |
| 관찰 기록 목록 로딩 실패 | "기록을 불러오지 못했어요" 메시지 + "다시 시도" 버튼 |
| 관찰 기록 삭제 실패 | toast "삭제에 실패했어요" + 카드 원복 (optimistic UI 롤백) |
| 상담 시 관찰 기록 조회 실패 | 관찰 기록 없이 상담 진행 (기존 동작과 동일, 에러를 사용자에게 노출하지 않음) |
| `recentObservations`가 빈 배열 | 프롬프트에 관찰 기록 섹션 미포함 (기존 프롬프트와 동일) |

## 7. Security

- `observations` 테이블에 RLS 적용: `auth.uid() = user_id` (4.1절 SQL 참조)
- 클라이언트에서 직접 Supabase를 호출하므로 RLS가 유일한 접근 제어
- API 라우트(`/api/observations/`)는 구현하지 않음 — 클라이언트 직접 호출 패턴을 기존 코드와 동일하게 유지 (db.ts 헬퍼 사용)

## 8. Observability

- 관찰 기록 저장 실패 시 `console.error`로 에러 로깅 (기존 패턴과 동일)
- 별도 모니터링/메트릭 추가 없음 (기존 프로젝트에 관측 인프라 없음)

## 9. Policy Changes

### 9.1 New Policies
- **관찰일지 탭 역할**: 기록 탭(`/record`)은 육아 관찰 일지 전용 공간이다. 상담 기록 열람은 상담 탭(`/consult`)에서 제공한다.
- **상담 컨텍스트 주입**: 상담 시작 시 해당 사용자의 최근 관찰 기록 5건을 LLM 프롬프트에 포함한다. 조회 실패 시 관찰 기록 없이 진행한다.
- **관찰 기록 독립성**: 관찰 기록은 상담 처방전 연결 없이도 독립적으로 작성 가능하다.

### 9.2 Modified Policies
- **하단 네비게이션**: 기록 탭의 라벨을 "관찰일지"로, 아이콘을 `edit_note`로 변경한다.
