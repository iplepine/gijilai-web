import { db } from '@/lib/db';

const PREMIUM_MODEL_MONTHLY_LIMIT = 30;

/**
 * 월 상담 횟수에 따라 모델 선택: 30건까지 gpt-4o, 초과 시 gpt-4o-mini
 */
export async function getConsultModel(userId: string): Promise<'gpt-4o' | 'gpt-4o-mini'> {
    const monthlyCount = await db.getMonthlyConsultCount(userId);
    return monthlyCount < PREMIUM_MODEL_MONTHLY_LIMIT ? 'gpt-4o' : 'gpt-4o-mini';
}
