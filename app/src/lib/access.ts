export const TRIAL_DAYS = 7;
export const FREE_PRACTICE_VISIBLE_COUNT = 1;

type SubscriptionLookupFilter = {
  eq: (...args: unknown[]) => SubscriptionLookupQuery;
  in: (...args: unknown[]) => SubscriptionLookupQuery;
  gte: (...args: unknown[]) => SubscriptionLookupQuery;
  order: (...args: unknown[]) => SubscriptionLookupQuery;
  limit: (...args: unknown[]) => SubscriptionLookupQuery;
  maybeSingle: () => Promise<{ data: { id: string } | null }>;
};

type SubscriptionLookupQuery = SubscriptionLookupFilter & {
  select: (...args: unknown[]) => SubscriptionLookupFilter;
};

export function getTrialStatus(userCreatedAt: string) {
  const created = new Date(userCreatedAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const isActive = diffDays < TRIAL_DAYS;
  const daysRemaining = isActive ? Math.ceil(TRIAL_DAYS - diffDays) : 0;

  return { isActive, daysRemaining, diffDays };
}

export function getFeatureAccess(params: { userCreatedAt?: string | null; hasSubscription: boolean }) {
  const trial = params.userCreatedAt ? getTrialStatus(params.userCreatedAt) : null;
  const hasFullAccess = params.hasSubscription || !!trial?.isActive;

  return {
    trial,
    hasSubscription: params.hasSubscription,
    hasFullAccess,
    canUseConsult: hasFullAccess,
    canViewAllPractices: hasFullAccess,
    visiblePracticeCount: hasFullAccess ? null : FREE_PRACTICE_VISIBLE_COUNT,
  };
}

export async function getServerFeatureAccess(
  supabase: { from: (table: string) => unknown },
  params: { userId: string; userCreatedAt?: string | null }
) {
  const subscriptionQuery = supabase
    .from('subscriptions') as SubscriptionLookupQuery;

  const { data: subscription } = await subscriptionQuery
    .select('id')
    .eq('user_id', params.userId)
    .in('status', ['ACTIVE', 'PAST_DUE'])
    .gte('current_period_end', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return getFeatureAccess({
    userCreatedAt: params.userCreatedAt,
    hasSubscription: !!subscription,
  });
}
