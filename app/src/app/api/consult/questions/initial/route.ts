import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const { problem } = await request.json();

        if (!problem) {
            return NextResponse.json(
                { error: 'Missing required field: problem' },
                { status: 400 }
            );
        }

        const systemPrompt = `당신은 아동 심리 및 기질 전문가입니다. 
사용자의 육아 고민 상황을 깊이 있게 분석하기 위해 확인해야 할 '기초 질문' 3~5개를 생성하세요.

**[질문 생성 가이드]**
1. 상황의 맥락(장소, 시간), 아이의 상태(피로도, 배고픔), 부모의 반응, 갈등의 빈도 등을 골고루 파악하세요.
2. 답변하기 쉽도록 객관식(options) 위주로 구성하되, 설명이 필요한 경우 주관식(type: "TEXT")을 포함할 수 있습니다.
3. 질문은 다정하고 공감 어린 톤으로 작성하세요.

**[Output Format (JSON Only)]**
{
  "questions": [
    {
      "id": "q1",
      "text": "질문 내용",
      "type": "CHOICE", // "CHOICE" 또는 "TEXT"
      "options": [
        { "id": "opt1", "text": "선택지 1" },
        { "id": "opt2", "text": "선택지 2" }
      ]
    }
  ]
}

주의: JSON 형식만 출력하세요. markdown 기호 없이 순수 JSON 문자열만 반환해야 합니다.`;

        const userMessage = `고민 상황: ${problem}`;

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
        return NextResponse.json(JSON.parse(content || '{"questions": []}'));
    } catch (error) {
        console.error('Error generating initial questions:', error);
        return NextResponse.json(
            { error: 'Failed to generate questions' },
            { status: 500 }
        );
    }
}
