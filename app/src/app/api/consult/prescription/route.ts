import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const { problem, answers, childArchetype, parentArchetype } = await request.json();

        if (!problem || !answers) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const fallbackChild = "기질 데이터 없음 (보편적 아이)";
        const fallbackParent = "기질 데이터 없음 (보편적 양육자)";

        const systemPrompt = `당신은 기질(TCI) 기반의 족집게 마음 통역사입니다.
아이의 기질, 양육자의 기질, 그리고 구체적인 상황 문진 결과를 분석하여 왜 이 상황이 발생했는지 설명하고 최적의 솔루션을 제공하세요.

**[분석 재료]**
- 아이 기질: ${childArchetype || fallbackChild}
- 양육자 기질: ${parentArchetype || fallbackParent}
- 고민 상황: ${problem}
- 상황별 상세 문진 결과: ${JSON.stringify(answers)}

**[Output Format (JSON Only)]**
{
  "interpretation": "[아이의 속마음 통역] 아이의 기질적 특성과 문진에서 나타난 상황 맥락을 바탕으로 행동의 이면을 3~4줄로 심층 설명.",
  "chemistry": "[우리의 케미스트리] 부모의 기질과 아이의 기질이 이 상황에서 어떻게 마찰했는지, 부모의 반응이 아이에게 어떤 영향을 미쳤는지 분석.",
  "magicWord": "[마법의 한마디] 아이의 기질적 방어 기제를 해제하고 협조를 이끌어낼 구체적인 대화 스크립트.",
  "actionItem": "[데일리 액션 아이템] 이 갈등이 재발하지 않도록 부모가 오늘 바로 환경을 바꾸거나 실천할 수 있는 과제."
}

주의: JSON 형식만 출력하세요. markdown 기호 없이 순수 JSON 문자열만 반환해야 합니다.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt }
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
