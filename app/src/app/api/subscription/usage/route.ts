import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { recordSubscriptionUsageEvent } from '@/lib/subscription-usage';

type UsageRequest = {
  eventName?: string;
  resourceType?: string;
  resourceId?: string;
};

const ALLOWED_CLIENT_EVENTS = new Set(['PRACTICE_HISTORY_VIEW']);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as UsageRequest;
    if (!body.eventName || !ALLOWED_CLIENT_EVENTS.has(body.eventName)) {
      return NextResponse.json({ error: 'Unsupported usage event' }, { status: 400 });
    }

    await recordSubscriptionUsageEvent({
      userId: session.user.id,
      feature: 'PRACTICE_HISTORY',
      eventName: 'PRACTICE_HISTORY_VIEW',
      resourceType: body.resourceType,
      resourceId: body.resourceId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Subscription Usage API] Error:', error);
    return NextResponse.json({ error: 'Failed to record usage event' }, { status: 500 });
  }
}
