import OpenAI from 'openai';
import { PARENT_REPORT_PROMPT, CHILD_REPORT_PROMPT } from '@/lib/prompts';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn('OPENAI_API_KEY is not set in environment variables.');
}

export const openai = new OpenAI({
    apiKey: apiKey,
});

export type ReportType = 'PARENT' | 'CHILD';

import { CBQ_QUESTIONS, ATQ_QUESTIONS, LIKERT_OPTIONS, NA_OPTION } from '@/lib/surveyQuestions';

export const generateReport = async (
    userName: string,
    scores: { NS: number; HA: number; RD: number; P: number },
    type: ReportType,
    systemPrompt?: string,
    model: string = 'gpt-4o',
    answers?: { questionId: string; score: number }[]
) => {
    const defaultPrompt = type === 'CHILD' ? CHILD_REPORT_PROMPT : PARENT_REPORT_PROMPT;
    const promptToUse = systemPrompt || defaultPrompt;

    // Scan and Format Q&A if answers provided
    let formattedQnA = '';
    if (answers && answers.length > 0) {
        const questions = type === 'CHILD' ? CBQ_QUESTIONS : ATQ_QUESTIONS;

        formattedQnA = answers.map(ans => {
            const question = questions.find(q => q.id === ans.questionId);
            if (!question) return null;

            const option = LIKERT_OPTIONS.find(opt => opt.value === ans.score) || (ans.score === 0 ? NA_OPTION : null);
            const answerText = option ? `${ans.score}점 (${option.label})` : `${ans.score}점`;

            return `Q. ${question.text}\n   A. ${answerText}`;
        }).filter(Boolean).join('\n\n');
    }

    const userMessage = JSON.stringify({
        userName,
        scores,
        type,
        // Note: traits and preferences would typically be calculated before passing to LLM
        // or the LLM can infer them from scores if instructed.
        // For now we just pass scores as per the prompt instructions.
        surveyDetails: formattedQnA // Add the detailed Q&A to the prompt
    });

    const response = await openai.chat.completions.create({
        model: model,
        messages: [
            { role: 'system', content: promptToUse },
            { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
    });

    return response.choices[0].message.content;
};
