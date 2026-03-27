import { db, SubscriptionData } from '@/lib/db';

export async function getActiveSubscription(userId: string): Promise<SubscriptionData | null> {
  return db.getActiveSubscription(userId);
}

export function computePeriodEnd(plan: 'MONTHLY' | 'YEARLY', from: Date = new Date()): Date {
  const end = new Date(from);
  if (plan === 'MONTHLY') {
    end.setDate(end.getDate() + 30);
  } else {
    end.setDate(end.getDate() + 365);
  }
  return end;
}
