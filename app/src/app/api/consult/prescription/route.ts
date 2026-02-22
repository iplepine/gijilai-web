import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const { problem, selectedReaction, childArchetype, parentArchetype } = await request.json();

        if (!problem || !selectedReaction) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const fallbackChild = "기질 데이터 없음 (보편적 아이)";
        const fallbackParent = "기질 데이터 없음 (보편적 양육자)";

        const systemPrompt = `당신은 기질(TCI) 기반의 족집게 마음 통역사입니다.
아이의 마음 기질과 양육자의 마음 기질, 그리고 양육자의 대처 방식을 분석하여 왜 둘 사이에 마찰이 생겼는지 설명하고 실천 가능한 솔루션을 제공하세요.

**[Output Format (JSON Only)]**
{
  "interpretation": "[아이의 속마음 통역] 아이의 기질적 특성을 바탕으로 이 행동이 왜 나왔는지 2~3줄로 설명.",
  "chemistry": "[우리의 케미스트리] 아이 기질과 양육자의 대처 방식이 왜 충돌했는지 설명 (부모 탓이 아닌 기질 간 마찰로 설명).",
  "magicWord": "[마법의 한마디] 갈등 상황에서 즉시 사용할 수 있는 대화 스크립트 1개 (쌍따옴표 포함).",
  "actionItem": "[데일리 액션 아이템] 이 문제를 해결하기 위해 양육자가 오늘 당장 실천할 수 있는 작고 구체적인 행동 1개 제시 (예: 아이에게 선택지 2개 주기)."
}

주의: JSON 형식만 출력하세요. markdown이나 코드 블록 기호(\`\`\`) 없이 순수 JSON 문자열만 반환해야 합니다.`;

        const userMessage = `
- 아이 기질: ${childArchetype || fallbackChild}
- 양육자 기질: ${parentArchetype || fallbackParent}
- 고민 상황: ${problem}
- 양육자 대처: ${selectedReaction}
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        return NextResponse.json(JSON.parse(content || '{}'));
    } catch (error) {
        console.error('Error generating prescription:', error);
        return NextResponse.json(
            { error: 'Failed to generate prescription' },
            { status: 500 }
        );
    }
}
