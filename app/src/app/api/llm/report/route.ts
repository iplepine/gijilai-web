import { NextResponse } from 'next/server';
import { generateReport, ReportType } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userName, scores, type, systemPrompt, model, answers } = body;

        // Basic validation
        if (!userName || !scores || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: userName, scores, or type' },
                { status: 400 }
            );
        }

        if (type !== 'PARENT' && type !== 'CHILD') {
            return NextResponse.json(
                { error: 'Invalid type. Must be PARENT or CHILD.' },
                { status: 400 }
            );
        }

        if (
            typeof scores.NS !== 'number' ||
            typeof scores.HA !== 'number' ||
            typeof scores.RD !== 'number' ||
            typeof scores.P !== 'number'
        ) {
            return NextResponse.json(
                { error: 'Invalid scores format. All scores must be numbers.' },
                { status: 400 }
            );
        }

        const report = await generateReport(
            userName,
            scores,
            type as ReportType,
            systemPrompt,
            model,
            answers
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
