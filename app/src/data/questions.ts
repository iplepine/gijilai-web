import { Question } from '../types/survey';

export const CHILD_QUESTIONS: Question[] = [
    {
        id: 1, type: 'CHILD', category: 'NS', facet: '새로운 자극 접근성',
        context: "처음 본 장난감을 줬을 때",
        lowScoreDescription: "무서워하거나 아예 만지려 하지 않는다.",
        midScoreDescription: "부모가 노는 법을 보여주면 그때 만진다.",
        highScoreDescription: "보자마자 달려들어 이리저리 만져본다."
    },
    {
        id: 2, type: 'CHILD', category: 'NS', facet: '지루함 민감성',
        context: "한 가지 놀이를 할 때",
        lowScoreDescription: "한 가지 장난감을 가지고 오랫동안 진득하게 논다.",
        midScoreDescription: "적당히 놀다가 다른 것에 관심을 보인다.",
        highScoreDescription: "금방 실증을 내고 계속 새로운 것을 찾는다."
    },
    {
        id: 3, type: 'CHILD', category: 'NS', facet: '활동 수준',
        context: "놀이터에서의 움직임",
        lowScoreDescription: "한곳에 가만히 앉아 조용히 노는 편이다.",
        midScoreDescription: "적당히 걷거나 가끔 기구에 올라간다.",
        highScoreDescription: "쉬지 않고 뛰어다니며 에너지가 넘친다."
    },
    {
        id: 4, type: 'CHILD', category: 'NS', facet: '충동성',
        context: "간식을 기다려야 할 때",
        lowScoreDescription: "\"이따 줄게\"라고 하면 차분히 기다린다.",
        midScoreDescription: "조금 칭얼대지만 금방 참아낸다.",
        highScoreDescription: "당장 달라고 울며불며 떼를 쓴다."
    },
    {
        id: 5, type: 'CHILD', category: 'NS', facet: '자유분방함',
        context: "규칙적인 생활 패턴",
        lowScoreDescription: "먹고 자는 시간이 매일 자로 잰 듯 일정하다.",
        midScoreDescription: "어느 정도 예측은 가능하나 조금씩 변한다.",
        highScoreDescription: "매일 규칙이 바뀌고 종잡을 수 없다."
    },
    // HA (Harm Avoidance)
    {
        id: 6, type: 'CHILD', category: 'HA', facet: '수줍음 및 불안',

        context: "낯선 어른이 말을 걸 때",
        lowScoreDescription: "부모 뒤로 숨어 한참 동안 얼굴도 안 본다.",
        midScoreDescription: "부모 곁에 붙어서 관찰하며 탐색한다.",
        highScoreDescription: "처음 본 사람에게도 웃으며 다가간다.",
        reverse: true // Because 5 here means Low Anxiety
    },
    {
        id: 7, type: 'CHILD', category: 'HA', facet: '감각 역치',
        context: "갑자기 큰 소리가 났을 때",
        lowScoreDescription: "깜짝 놀라며 울음을 터뜨리거나 얼어붙는다.",
        midScoreDescription: "잠시 멈칫하지만 금방 상황을 살핀다.",
        highScoreDescription: "소리 나는 곳을 궁금해하며 쳐다본다.",
        reverse: true
    },
    {
        id: 8, type: 'CHILD', category: 'HA', facet: '변화 적응성',
        context: "새 옷을 입혔을 때",
        lowScoreDescription: "까칠하거나 꽉 끼는 느낌에 매우 예민하다.",
        midScoreDescription: "처음엔 어색해하지만 금방 적응한다.",
        highScoreDescription: "어떤 옷이든 크게 신경 쓰지 않고 입는다.",
        reverse: true
    },
    {
        id: 9, type: 'CHILD', category: 'HA', facet: '위험 감지',
        context: "높은 곳에 올라갈 때",
        lowScoreDescription: "다칠까 봐 무서워하며 시도조차 안 한다.",
        midScoreDescription: "부모가 잡아주면 조심스럽게 올라간다.",
        highScoreDescription: "겁 없이 올라가서 부모를 당황하게 한다.",
        reverse: true
    },
    {
        id: 10, type: 'CHILD', category: 'HA', facet: '피로 용이성',
        context: "활동 후의 체력 상태",
        lowScoreDescription: "조금만 움직여도 금방 지쳐서 안아달라고 한다.",
        midScoreDescription: "적당히 놀고 나면 쉬고 싶어 한다.",
        highScoreDescription: "잠들기 직전까지 에너지가 넘쳐흐른다.",
        reverse: true
    },
    // RD (Reward Dependence) - High Score = High RD (Socially sensitive)
    {
        id: 11, type: 'CHILD', category: 'RD', facet: '사회적 보상 민감성',
        context: "부모가 칭찬해 줄 때",
        lowScoreDescription: "칭찬해도 무덤덤하게 자기 할 일을 한다.",
        midScoreDescription: "기분 좋아 보이지만 금방 놀이에 집중한다.",
        highScoreDescription: "세상을 다 얻은 듯 기뻐하며 더 잘하려 한다."
    },
    {
        id: 12, type: 'CHILD', category: 'RD', facet: '정서적 감수성',
        context: "옆의 친구가 울고 있을 때",
        lowScoreDescription: "신경 쓰지 않고 혼자 계속 논다.",
        midScoreDescription: "왜 우는지 한 번 쳐다보고 가만히 있는다.",
        highScoreDescription: "다가가서 등을 토닥이거나 자기 것을 나눠준다."
    },
    {
        id: 13, type: 'CHILD', category: 'RD', facet: '관계 지향성',
        context: "부모와 떨어져 놀 때",
        lowScoreDescription: "혼자서도 아주 오랫동안 몰입해서 잘 논다.",
        midScoreDescription: "가끔 부모가 있는지 확인하며 근처에서 논다.",
        highScoreDescription: "잠시도 떨어지려 하지 않고 계속 말을 건다."
    },
    {
        id: 14, type: 'CHILD', category: 'RD', facet: '따뜻한 의사소통',
        context: "친구가 장난감을 뺏을 때",
        lowScoreDescription: "그냥 주고 말거나 다른 것을 찾아 떠난다.", // Low attachment/fighting
        midScoreDescription: "당황해하며 부모에게 도움을 요청한다.",
        highScoreDescription: "같이 놀고 싶어 하며 서운한 기색을 내비친다."
    },
    {
        id: 15, type: 'CHILD', category: 'RD', facet: '타인 의존성',
        context: "부모가 엄한 표정을 지을 때",
        lowScoreDescription: "표정이 무서워도 눈 하나 깜짝 안 한다.",
        midScoreDescription: "잘못했다는 걸 눈치채고 행동을 멈춘다.",
        highScoreDescription: "금방 위축되어 울먹이거나 눈치를 많이 본다."
    },
    // P (Persistence) - High Score = High Persistence
    {
        id: 16, type: 'CHILD', category: 'P', facet: '과제 지속성',
        context: "어려운 퍼즐을 맞출 때",
        lowScoreDescription: "조금만 안 맞춰져도 짜증 내며 던져버린다.",
        midScoreDescription: "몇 번 해보다가 안 되면 부모에게 해달라 한다.",
        highScoreDescription: "끝까지 맞출 때까지 밥도 안 먹고 매달린다."
    },
    {
        id: 17, type: 'CHILD', category: 'P', facet: '주의 집중력',
        context: "주변이 소란스러운 곳에서",
        lowScoreDescription: "작은 소음에도 금방 고개를 돌려 쳐다본다.",
        midScoreDescription: "잠시 쳐다보지만 다시 하던 일로 돌아온다.",
        highScoreDescription: "누가 옆에서 불러도 모를 만큼 집중한다."
    },
    {
        id: 18, type: 'CHILD', category: 'P', facet: '근면성',
        context: "심부름이나 약속 이행",
        lowScoreDescription: "금방 잊어버리고 딴짓을 하러 간다.",
        midScoreDescription: "한두 번 더 말해줘야 끝까지 해낸다.",
        highScoreDescription: "시킨 일을 끝낼 때까지 멈추지 않는다."
    },
    {
        id: 19, type: 'CHILD', category: 'P', facet: '좌절 내성',
        context: "실패했을 때의 태도",
        lowScoreDescription: "한 번 실패하면 다시는 안 하려고 한다.",
        midScoreDescription: "아쉬워하지만 다음에 하겠다고 미룬다.",
        highScoreDescription: "\"다시 할 거야!\"라며 계속해서 도전한다."
    },
    {
        id: 20, type: 'CHILD', category: 'P', facet: '완벽주의 경향',
        context: "취침 전 루틴(책 읽기 등)",
        lowScoreDescription: "하다가 중간에 졸리면 그냥 잔다.",
        midScoreDescription: "정해진 양보다 적게 해도 크게 상관 안 한다.",
        highScoreDescription: "정해진 권수를 다 읽어야만 만족하고 잠든다."
    },
];

export const PARENT_QUESTIONS: Question[] = [
    {
        id: 21, type: 'PARENT', category: 'NS', facet: '탐색적 흥분',
        context: "새로운 취미나 일을 시작할 때",
        lowScoreDescription: "익숙한 것에서 편안함을 느낀다.",
        midScoreDescription: "흥미가 생기면 이것저것 알아본다.",
        highScoreDescription: "호기심이 생기면 앞뒤 안 가리고 시작한다."
    },
    {
        id: 22, type: 'PARENT', category: 'NS', facet: '충동성',
        context: "쇼핑을 하거나 결정을 내릴 때",
        lowScoreDescription: "꼼꼼하게 비교하고 신중하게 결정한다.",
        midScoreDescription: "가끔 충동적일 때도 있지만 대체로 조절한다.",
        highScoreDescription: "마음에 들면 즉시 사고, 직관적으로 결정한다."
    },
    {
        id: 23, type: 'PARENT', category: 'NS', facet: '자유분방함',
        context: "여행 계획을 세울 때",
        lowScoreDescription: "시간 단위로 철저하게 계획을 세운다.",
        midScoreDescription: "큰 틀을 짜고 상황에 맞춰 움직인다.",
        highScoreDescription: "계획 없이 발길 닿는 대로 다니는 것을 즐긴다."
    },
    {
        id: 24, type: 'PARENT', category: 'HA', facet: '예기 불안',
        context: "미래의 불확실한 계획에 대해",
        lowScoreDescription: "\"어떻게든 되겠지\"라고 낙관한다.",
        midScoreDescription: "약간의 걱정은 있지만 준비하면 된다고 생각한다.",
        highScoreDescription: "발생할 수 있는 모든 나쁜 상황을 걱정한다."
    },
    {
        id: 25, type: 'PARENT', category: 'HA', facet: '비관적 전망',
        context: "새로운 도전을 앞두고",
        lowScoreDescription: "성공할 것이라는 기대감에 부푼다.",
        midScoreDescription: "반반의 가능성을 생각한다.",
        highScoreDescription: "실패할 것 같은 불길한 예감이 먼저 든다."
    },
    {
        id: 26, type: 'PARENT', category: 'RD', facet: '사회적 부착',
        context: "주변 사람과의 감정 교류",
        lowScoreDescription: "남들의 시선보다 나의 실용적 이득이 중요하다.",
        midScoreDescription: "가까운 사람들과의 관계를 소중히 여긴다.",
        highScoreDescription: "타인에게 인정받고 연결되는 것이 매우 소중하다."
    },
    {
        id: 27, type: 'PARENT', category: 'RD', facet: '정서적 개방성',
        context: "슬픈 영화를 볼 때",
        lowScoreDescription: "별다른 감흥이 없거나 연출을 분석한다.",
        midScoreDescription: "가끔 눈물이 날 때도 있다.",
        highScoreDescription: "주인공에 이입되어 펑펑 운다."
    },
    {
        id: 28, type: 'PARENT', category: 'P', facet: '과제 지속성',
        context: "지루하고 반복적인 업무 시",
        lowScoreDescription: "금방 흥미를 잃고 다른 효율적인 일을 찾는다.",
        midScoreDescription: "필요하다면 참고 해낸다.",
        highScoreDescription: "아무리 힘들어도 끝을 봐야 직성이 풀린다."
    },
    {
        id: 29, type: 'PARENT', category: 'P', facet: '완벽주의',
        context: "집안일이나 업무 마감",
        lowScoreDescription: "적당히 눈에 보이는 정도만 정리한다.",
        midScoreDescription: "기본적인 것은 깔끔하게 해둔다.",
        highScoreDescription: "보이지 않는 곳까지 완벽해야 마음이 놓인다."
    },
    // Adding context placeholders for the rest or repeating for brevity in this task context. 
    // Since I must implement 20, I will extrapolate or reuse similar BARS structures for the remaining to fulfill the count without inventing purely random text.
    // For the sake of this task, I'll map the remaining original questions to BARS format largely by using the original text as the 'High' or 'Low' description and inventing the opposite.

    // ... Filling up to 20 for PARENT using synthesized BARS from previous text ...
    {
        id: 30, type: 'PARENT', category: 'NS', facet: '지루함 민감성',
        context: "반복적인 일상을 보낼 때",
        lowScoreDescription: "안정적인 일상에서 편안함을 느낀다.",
        midScoreDescription: "가끔은 변화가 필요하다.",
        highScoreDescription: "단조로움이 견디기 힘들고 답답하다."
    },
    {
        id: 31, type: 'PARENT', category: 'HA', facet: '피로 용이성',
        context: "하루 일과를 마쳤을 때",
        lowScoreDescription: "아직 할 일을 더 찾을 만큼 에너지가남는다.",
        midScoreDescription: "적당히 피곤하지만 쉴 정도는 아니다.",
        highScoreDescription: "녹초가 되어 아무것도 할 수 없다."
    },
    {
        id: 32, type: 'PARENT', category: 'RD', facet: '승인 의존성',
        context: "누군가 나를 칭찬할 때",
        lowScoreDescription: "칭찬은 칭찬일 뿐, 내 기준이 중요하다.",
        midScoreDescription: "기분이 좋고 고맙다.",
        highScoreDescription: "인정받는 것이 내 존재 가치처럼 느껴진다."
    },
    {
        id: 33, type: 'PARENT', category: 'P', facet: '좌절 내성',
        context: "일이 계획대로 안 풀릴 때",
        lowScoreDescription: "빠르게 포기하고 다른 대안을 찾는다.",
        midScoreDescription: "속상하지만 다시 시도해본다.",
        highScoreDescription: "오기가 생겨 될 때까지 붙잡고 있는다."
    },
    { // Contextualizing remaining
        id: 34, type: 'PARENT', category: 'NS', facet: '재정적 태도',
        context: "돈을 쓸 때",
        lowScoreDescription: "미래를 위해 아끼고 저축하는 것이 우선이다.",
        midScoreDescription: "필요한 곳에는 쓴다.",
        highScoreDescription: "지금 당장의 즐거움과 만족을 위해 쓴다."
    },
    {
        id: 35, type: 'PARENT', category: 'HA', facet: '사회적 불안',
        context: "많은 사람들 앞에 설 때",
        lowScoreDescription: "주목받는 것을 즐기고 당당하다.",
        midScoreDescription: "약간 떨리지만 준비한 대로 한다.",
        highScoreDescription: "심장이 터질 것 같고 도망치고 싶다."
    },
    {
        id: 36, type: 'PARENT', category: 'RD', facet: '공감 능력',
        context: "친구가 힘든 이야기를 할 때",
        lowScoreDescription: "해결책을 먼저 제시하려 한다.",
        midScoreDescription: "적절히 호응하며 들어준다.",
        highScoreDescription: "내 일처럼 느껴져 같이 마음 아파한다."
    },
    {
        id: 37, type: 'PARENT', category: 'P', facet: '야심',
        context: "새로운 목표를 세울 때",
        lowScoreDescription: "실현 가능한 안전한 목표를 선호한다.",
        midScoreDescription: "조금 노력하면 될 목표를 잡는다.",
        highScoreDescription: "남들이 불가능하다는 목표에 도전하고 싶다."
    },
    {
        id: 38, type: 'PARENT', category: 'NS', facet: '규칙 준수',
        context: "엄격한 규칙이 있는 곳에서",
        lowScoreDescription: "규칙을 지키는 것이 마음 편하다.",
        midScoreDescription: "필요한 규칙은 지킨다.",
        highScoreDescription: "답답함을 느끼고 벗어나고 싶어 한다."
    },
    {
        id: 39, type: 'PARENT', category: 'HA', facet: '걱정의 빈도',
        context: "평소 생각의 패턴",
        lowScoreDescription: "걱정보다는 기대나 계획을 많이 한다.",
        midScoreDescription: "가끔 걱정이 들 때가 있다.",
        highScoreDescription: "꼬리에 꼬리를 무는 걱정 때문에 잠들기 힘들다."
    },
    {
        id: 40, type: 'PARENT', category: 'RD', facet: '표현력',
        context: "애정 표현을 할 때",
        lowScoreDescription: "말보다는 행동으로 보여주거나 무뚝뚝하다.",
        midScoreDescription: "가끔 쑥스럽지만 표현하려고 한다.",
        highScoreDescription: "사랑한다는 말과 스킨십을 아끼지 않는다."
    },
];

export const PARENTING_STYLE_QUESTIONS: Question[] = [
    {
        id: 41, type: 'PARENTING_STYLE', category: 'Efficacy', facet: '상황 관리 유능감',
        context: "아이가 공공장소에서 떼쓸 때",
        lowScoreDescription: "당황해서 어찌할 줄 모르고 식은땀이 난다.",
        midScoreDescription: "난감하지만 달래려고 노력한다.",
        highScoreDescription: "당황하지 않고 아이를 통제할 방법이 있다."
    },
    {
        id: 42, type: 'PARENTING_STYLE', category: 'Autonomy', facet: '주도성 존중',
        context: "아이의 옷을 고를 때",
        lowScoreDescription: "부모가 골라준 대로 입으라고 강요한다.",
        midScoreDescription: "두어 가지 중 고르게 한다.",
        highScoreDescription: "아이가 이상하게 입어도 스스로 고르게 한다."
    },
    {
        id: 43, type: 'PARENTING_STYLE', category: 'Responsiveness', facet: '신호 민감성',
        context: "아이가 우는 이유를 파악할 때",
        lowScoreDescription: "왜 우는지 몰라 답답하고 화부터 난다.",
        midScoreDescription: "몇 가지 이유를 짐작해본다.",
        highScoreDescription: "소리만 들어도 배고픈지 졸린지 바로 안다."
    },
    {
        id: 44, type: 'PARENTING_STYLE', category: 'Efficacy', facet: '본능적 확신',
        context: "육아 정보를 접할 때",
        lowScoreDescription: "정보가 너무 많아 무엇이 맞는지 불안하다.",
        midScoreDescription: "참고는 하되 내 방식대로 한다.",
        highScoreDescription: "내 아이에게 맞는 방법인지 아닌지 금방 안다."
    },
    {
        id: 45, type: 'PARENTING_STYLE', category: 'Autonomy', facet: '실수 허용',
        context: "아이가 혼자 하다가 실수했을 때",
        lowScoreDescription: "\"그것 봐, 엄마가 해준댔잖아\"라며 핀잔준다.",
        midScoreDescription: "도와주면서 다음엔 조심하라고 한다.",
        highScoreDescription: "\"괜찮아, 다시 해보자\"라며 격려하고 기다린다."
    },
    {
        id: 46, type: 'PARENTING_STYLE', category: 'Responsiveness', facet: '감정 읽기',
        context: "아이가 학교/원에서 돌아왔을 때",
        lowScoreDescription: "밥 먹었는지, 숙제 했는지부터 묻는다.",
        midScoreDescription: "오늘 뭐 했는지 물어본다.",
        highScoreDescription: "표정만 보고도 오늘 무슨 일 있었는지 알아챈다."
    },
    {
        id: 47, type: 'PARENTING_STYLE', category: 'Efficacy', facet: '훈육 자신감',
        context: "아이를 훈육해야 할 때",
        lowScoreDescription: "화만 내고 흐지부지 끝나거나 아이에게 끌려다닌다.",
        midScoreDescription: "어느 정도 원칙대로 하려고 애쓴다.",
        highScoreDescription: "단호하지만 부드럽게 메시지를 전달한다."
    },
    {
        id: 48, type: 'PARENTING_STYLE', category: 'Autonomy', facet: '의견 존중',
        context: "주말 계획을 짤 때",
        lowScoreDescription: "부모가 정한 일정에 아이를 따르게 한다.",
        midScoreDescription: "아이의 의견을 부분적으로 반영한다.",
        highScoreDescription: "어디 가고 싶은지 아이에게 먼저 묻고 결정한다."
    },
    {
        id: 49, type: 'PARENTING_STYLE', category: 'Responsiveness', facet: '즉각적 반응',
        context: "아이가 부를 때",
        lowScoreDescription: "하던 일이 바쁘면 대꾸하지 않거나 늦게 반응한다.",
        midScoreDescription: "\"잠깐만\" 하고 하던 일을 마무리한다.",
        highScoreDescription: "하던 일을 즉시 멈추고 눈을 맞춘다."
    },
    {
        id: 50, type: 'PARENTING_STYLE', category: 'Efficacy', facet: '부모 역할 만족도',
        context: "잠들기 전 하루를 돌아볼 때",
        lowScoreDescription: "오늘도 아이에게 화낸 것이 후회스럽고 힘들다.",
        midScoreDescription: "무난하게 하루를 보냈다고 생각한다.",
        highScoreDescription: "오늘도 우리 아이가 참 예쁘고 나도 잘했다고 느낀다."
    },
];
