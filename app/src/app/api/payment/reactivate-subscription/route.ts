import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabaseServer';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: subscription, error: findError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .in('status', ['ACTIVE', 'PAST_DUE'])
      .gte('current_period_end', new Date().toISOString())
      .not('cancelled_at', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError) throw findError;

    if (!subscription) {
      return NextResponse.json({ error: 'NO_CANCELLED_SUBSCRIPTION' }, { status: 400 });
    }

    if (subscription.source !== 'PORTONE') {
      return NextResponse.json({ error: 'UNSUPPORTED_SUBSCRIPTION_SOURCE' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { data: updated, error: updateError } = await getSupabaseAdmin()
      .from('subscriptions')
      .update({
        cancelled_at: null,
        updated_at: now,
      })
      .eq('id', subscription.id)
      .eq('user_id', session.user.id)
      .select('*')
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      subscription: updated,
    });
  } catch (error: unknown) {
    console.error('Reactivate subscription error:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
