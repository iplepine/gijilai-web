import { NextResponse } from 'next/server';
import { generateReport, ReportType } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userName, scores, type, systemPrompt, model, answers, parentScores } = body;

        // Basic validation
        if (!userName || !scores || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: userName, scores, or type' },
                { status: 400 }
            );
        }

        if (type !== 'PARENT' && type !== 'CHILD' && type !== 'HARMONY') {
            return NextResponse.json(
                { error: 'Invalid type. Must be PARENT, CHILD, or HARMONY.' },
                { status: 400 }
            );
        }

        const report = await generateReport(
            userName,
            scores,
            type as any,
            systemPrompt,
            model,
            answers,
            parentScores
        );

        return NextResponse.json({ report });
    } catch (error) {
        console.error('Error generating report:', error);
        return NextResponse.json(
            { error: 'Failed to generate report' },
            { status: 500 }
        );
    }
}
