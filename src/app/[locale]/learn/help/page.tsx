import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, CreditCard, Wrench, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/help/contact-form';

export const metadata: Metadata = {
    title: 'Help Center | QRLoom',
    description: 'Frequently asked questions and support for QRLoom users.',
};

export default function HelpPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary/5 py-20">
                    <div className="container max-w-4xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                            How can we help you?
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Find answers to common questions or get in touch with our support team.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg">Contact Support</Button>
                            <Button variant="outline" size="lg">View Documentation</Button>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 container max-w-3xl">

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Wrench className="h-6 w-6 text-primary" />
                            General & Technical
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>What is the difference between Static and Dynamic QR codes?</AccordionTrigger>
                                <AccordionContent>
                                    Static QR codes encode data directly into the pattern and cannot be changed once created. Dynamic QR codes use a short URL redirect, allowing you to change the destination anytime and track scan analytics.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Do your QR codes expire?</AccordionTrigger>
                                <AccordionContent>
                                    Static QR codes never expire because the data is embedded in the code itself. Dynamic QR codes work as long as your account is active.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Can I customize the design of my QR code?</AccordionTrigger>
                                <AccordionContent>
                                    Yes! You can change the colors, add your logo, and even change the shape of the "eyes" (corner markers) to match your brand identity.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <CreditCard className="h-6 w-6 text-primary" />
                            Billing & Subscription
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-4">
                                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                                <AccordionContent>
                                    We accept all major credit cards (Visa, Mastercard, American Express) via our secure payment processor, Stripe.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                                <AccordionContent>
                                    Yes, you can cancel your subscription at any time from your dashboard. You will retain access to Pro features until the end of your current billing period.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
                                <AccordionContent>
                                    We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied, contact support within 14 days for a full refund.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <MessageCircle className="h-6 w-6 text-primary" />
                            Still need help?
                        </h2>


                        <div className="rounded-xl border bg-muted/30 p-8 text-center">
                            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">Contact our Support Team</h3>
                            <p className="text-muted-foreground mb-6">
                                We're available 24/7 to help you with any issues.
                            </p>
                            <div className="max-w-md mx-auto">
                                <ContactForm />
                            </div>
                        </div>
                    </div>

                </section>
            </main>
            <Footer />
        </div>
    );
}
