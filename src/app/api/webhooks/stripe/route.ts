import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Supabase Admin client to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        return new NextResponse(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown Error'}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse('User id is required', { status: 400 });
        }

        await supabaseAdmin
            .from('subscriptions')
            .insert({
                user_id: session.metadata.userId,
                stripe_subscription_id: subscription.id,
                stripe_price_id: subscription.items.data[0].price.id,
                status: subscription.status,
                current_period_start: new Date(
                    subscription.current_period_start * 1000
                ).toISOString(),
                current_period_end: new Date(
                    subscription.current_period_end * 1000
                ).toISOString(),
            });

        await supabaseAdmin
            .from('profiles')
            .update({ plan: 'pro' })
            .eq('id', session.metadata.userId);
    }

    if (event.type === 'invoice.payment_succeeded') {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        await supabaseAdmin
            .from('subscriptions')
            .update({
                status: subscription.status,
                current_period_start: new Date(
                    subscription.current_period_start * 1000
                ).toISOString(),
                current_period_end: new Date(
                    subscription.current_period_end * 1000
                ).toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);
    }

    return new NextResponse(null, { status: 200 });
}
