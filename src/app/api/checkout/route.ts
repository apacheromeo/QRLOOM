import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { priceId } = body;

        // MOCK CHECKOUT SESSION
        // In a real app, this would create a Stripe Checkout Session
        console.log('Creating mock checkout session for price:', priceId);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return a mock success URL
        return NextResponse.json({
            url: `${new URL(req.url).origin}/checkout/success?session_id=mock_session_123`,
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
