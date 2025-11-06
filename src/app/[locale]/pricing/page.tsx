import { getTranslations } from 'next-intl/server';
import { Check } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SUBSCRIPTION_PLANS } from '@/config/subscription-plans';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pricing - QRLoom',
  description: 'Choose the perfect plan for your QR code needs',
};

export default async function PricingPage() {
  const t = await getTranslations('pricing');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-4 -mt-16">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8">
              {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col ${
                    plan.popular
                      ? 'border-primary shadow-xl scale-105'
                      : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-10">
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold">
                          ${plan.price.monthly}
                        </span>
                        {plan.price.monthly > 0 && (
                          <span className="text-muted-foreground">/month</span>
                        )}
                      </div>
                      {plan.price.yearly > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          or ${plan.price.yearly}/year (save{' '}
                          {Math.round(
                            ((plan.price.monthly * 12 - plan.price.yearly) /
                              (plan.price.monthly * 12)) *
                              100
                          )}
                          %)
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6">
                    {plan.id === 'free' ? (
                      <Link href="/auth/signup" className="w-full">
                        <Button className="w-full" variant="outline" size="lg">
                          Get Started Free
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/checkout?plan=${plan.id}`} className="w-full">
                        <Button
                          className="w-full"
                          size="lg"
                          variant={plan.popular ? 'default' : 'outline'}
                        >
                          Upgrade to {plan.name}
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Can I change plans later?
                </h3>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes
                  take effect immediately, and we'll prorate the charges.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  What happens if I exceed my limits?
                </h3>
                <p className="text-muted-foreground">
                  If you reach your plan's limits, you'll be prompted to upgrade.
                  Your existing QR codes will continue to work, but you won't be
                  able to create new ones until you upgrade or wait for the next
                  billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-muted-foreground">
                  We offer a 14-day money-back guarantee on all paid plans. If
                  you're not satisfied, contact us for a full refund.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards (Visa, Mastercard, American
                  Express) through our secure payment processor, Stripe.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Can I cancel my subscription?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time from your
                  account settings. You'll continue to have access until the end
                  of your current billing period.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start with our free plan and upgrade when you need more features.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
