'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SubscriptionPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Mock subscription data
    const subscription = {
        status: 'active',
        plan: 'Pro Plan',
        amount: '$12.00',
        interval: 'month',
        nextBillingDate: '2025-12-26',
        paymentMethod: 'Visa ending in 4242',
    };

    const handleManageSubscription = async () => {
        setIsLoading(true);
        // Simulate API call to get Stripe Customer Portal URL
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast({
            title: 'Redirecting to Customer Portal',
            description: 'You would be redirected to Stripe to manage your billing.',
        });
        setIsLoading(false);
    };

    return (
        <div className="container py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Subscription</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your billing and plan details
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Current Plan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Current Plan
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                {subscription.status.toUpperCase()}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            You are currently subscribed to the {subscription.plan}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Price</p>
                                <p className="text-2xl font-bold">
                                    {subscription.amount}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        /{subscription.interval}
                                    </span>
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-sm font-medium">Next Billing</p>
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {subscription.nextBillingDate}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border p-4 bg-muted/50">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Pro Features Active</p>
                                    <p className="text-xs text-muted-foreground">
                                        You have access to all premium features.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>
                            Manage your payment details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{subscription.paymentMethod}</p>
                                <p className="text-xs text-muted-foreground">Default payment method</p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                                        Need to update billing?
                                    </p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-500">
                                        Use the customer portal to update your payment method or download invoices.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleManageSubscription}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Manage Billing on Stripe'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
