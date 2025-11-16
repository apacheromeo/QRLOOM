import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateStripeCustomer, createCheckoutSession, isStripeConfigured } from '@/lib/stripe';
import { getPlanByTier } from '@/config/subscription-plans';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, billingCycle = 'monthly' } = await request.json();

    // Validate plan
    if (!['pro', 'enterprise'].includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const plan = getPlanByTier(planId as 'pro' | 'enterprise');
    const priceId =
      billingCycle === 'yearly'
        ? plan.stripePriceIds.yearly
        : plan.stripePriceIds.monthly;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured' },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      user.email!,
      user.id
    );

    // Update subscription with customer ID
    await supabase
      .from('user_subscriptions')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', user.id);

    // Create checkout session
    const session = await createCheckoutSession({
      customerId,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      userId: user.id,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
