'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from '@/hooks/use-toast';
import { createCheckoutSession } from '@/actions/stripe-actions';

export default function PricingPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);

    const handleCheckout = async (planName: string, priceId: string) => {
        if (planName === 'Free') {
            router.push('/signup');
            return;
        }

        try {
            setLoading(planName);
            await createCheckoutSession(priceId);
        } catch (error) {
            console.error('Checkout error:', error);
            toast({
                title: 'Checkout Failed',
                description: 'Please log in to upgrade your plan.',
                variant: 'destructive',
            });
            if (error instanceof Error && error.message.includes('authenticated')) {
                router.push('/signin');
            }
            setLoading(null);
        }
    };

    const plans = [
        {
            name: 'Free',
            price: '$0',
            description: 'Perfect for getting started',
            features: [
                '10 Active QR Codes',
                '1,000 Scans / Month',
                'Basic Analytics',
                'Static QR Codes',
                'Standard Support',
            ],
            notIncluded: [
                'Dynamic QR Codes',
                'Custom Logos',
                'Remove Branding',
                'Advanced Analytics',
            ],
            buttonText: 'Get Started',
            buttonVariant: 'outline' as const,
            priceId: 'free_plan',
        },
        {
            name: 'Pro',
            price: '$12',
            period: '/month',
            description: 'For professionals and businesses',
            features: [
                'Unlimited Active QR Codes',
                'Unlimited Scans',
                'Advanced Analytics',
                'Dynamic QR Codes',
                'Custom Logos',
                'Remove Branding',
                'Priority Support',
                'Bulk Creation',
            ],
            notIncluded: [],
            buttonText: 'Upgrade to Pro',
            buttonVariant: 'default' as const,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY || 'price_pro_monthly',
            popular: true,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 py-20">
                <div className="container px-4 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                            Simple, transparent pricing
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Choose the plan that's right for you. No hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-2xl border p-8 shadow-sm flex flex-col ${plan.popular
                                    ? 'border-primary shadow-lg scale-105 bg-primary/5'
                                    : 'bg-card'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                                    <p className="text-muted-foreground mt-2">{plan.description}</p>
                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        {plan.period && (
                                            <span className="text-muted-foreground ml-1">
                                                {plan.period}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    {plan.notIncluded.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-center gap-3 text-muted-foreground/50"
                                        >
                                            <X className="h-5 w-5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={plan.buttonVariant}
                                    size="lg"
                                    className="w-full"
                                    onClick={() => handleCheckout(plan.name, plan.priceId)}
                                    disabled={loading === plan.name}
                                >
                                    {loading === plan.name ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        plan.buttonText
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

