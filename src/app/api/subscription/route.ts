import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPlanByTier } from '@/config/subscription-plans';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError) {
      console.error('Error fetching subscription:', subError);
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }

    // Get current period usage
    const periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const { data: usage, error: usageError } = await supabase
      .from('usage_records')
      .select('*')
      .eq('user_id', user.id)
      .gte('period_start', periodStart.toISOString())
      .single();

    if (usageError && usageError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is ok
      console.error('Error fetching usage:', usageError);
    }

    // Get plan details
    const plan = getPlanByTier(subscription.tier);

    return NextResponse.json({
      subscription: {
        tier: subscription.tier,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      plan,
      usage: usage || {
        qr_codes_generated: 0,
        qr_codes_created: 0,
        scans_tracked: 0,
      },
    });
  } catch (error) {
    console.error('Subscription route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
