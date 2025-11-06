import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

// Create or retrieve a Stripe customer
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  // Check if user already has a Stripe customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  // Save customer ID to database
  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  return customer.id;
}

// Create a checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });
}

// Create a billing portal session
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

// Handle subscription created
export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<void> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const priceId = subscription.items.data[0].price.id;

  // Get user ID from customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    throw new Error('Profile not found for customer');
  }

  // Insert subscription
  await supabase.from('subscriptions').insert({
    user_id: profile.id,
    stripe_subscription_id: subscriptionId,
    stripe_price_id: priceId,
    status: subscription.status,
    current_period_start: new Date(
      subscription.current_period_start * 1000
    ).toISOString(),
    current_period_end: new Date(
      subscription.current_period_end * 1000
    ).toISOString(),
  });

  // Update user plan
  await supabase
    .from('profiles')
    .update({ plan: 'pro' })
    .eq('id', profile.id);
}

// Handle subscription updated
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('stripe_subscription_id', subscription.id);
}

// Handle subscription deleted
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: subscriptionData } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (subscriptionData) {
    // Update user plan to free
    await supabase
      .from('profiles')
      .update({ plan: 'free' })
      .eq('id', subscriptionData.user_id);

    // Delete subscription record
    await supabase
      .from('subscriptions')
      .delete()
      .eq('stripe_subscription_id', subscription.id);
  }
}
