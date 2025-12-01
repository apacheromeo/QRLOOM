import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next';
import { CheckCircle, AlertTriangle, Lightbulb, Printer, Smartphone, Zap } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Ultimate Guide to QR Codes | QRLoom',
    description: 'Everything you need to know about creating, printing, and using QR codes for your business. Best practices, tips, and strategies.',
};

export default function GuidePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-muted/30 py-20 border-b">
                    <div className="container max-w-4xl text-center">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-6">
                            QRLoom Academy
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                            The Ultimate Guide to QR Codes
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Master the art of connecting the physical and digital worlds. Learn how to create, customize, and deploy QR codes effectively.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 container max-w-3xl">

                    {/* Chapter 1: Basics */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Lightbulb className="h-8 w-8 text-yellow-500" />
                            1. The Basics
                        </h2>
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                                QR (Quick Response) codes are two-dimensional barcodes that can store much more data than standard barcodes. They were invented in 1994 by Denso Wave and have since become the standard for mobile connectivity.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 my-8">
                                <div className="p-6 rounded-xl border bg-card shadow-sm">
                                    <h3 className="font-semibold text-lg mb-2">Static QR Codes</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Data is encoded directly into the pattern. Once printed, it cannot be changed. Good for permanent links like Wi-Fi credentials or vCards.
                                    </p>
                                </div>
                                <div className="p-6 rounded-xl border bg-primary/5 border-primary/20 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-2 text-primary">Dynamic QR Codes</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Encodes a short redirect URL. You can change the destination anytime and track scan analytics. Essential for marketing and business.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chapter 2: Best Practices */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                            2. Design Best Practices
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex gap-4 p-4 rounded-lg bg-muted/50">
                                <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0 border">
                                    <span className="font-bold">01</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Maintain Contrast</h3>
                                    <p className="text-muted-foreground text-sm">Always ensure high contrast between the foreground (code) and background. Dark code on light background is the safest choice.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 p-4 rounded-lg bg-muted/50">
                                <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0 border">
                                    <span className="font-bold">02</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Don't Over-Customize</h3>
                                    <p className="text-muted-foreground text-sm">While logos and colors are great, modifying the "eyes" (corner markers) too much can make the code unreadable.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 p-4 rounded-lg bg-muted/50">
                                <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0 border">
                                    <span className="font-bold">03</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Size Matters</h3>
                                    <p className="text-muted-foreground text-sm">Minimum size should be 2x2 cm (0.8x0.8 inches). For scanning from a distance, the ratio is 10:1 (distance:size).</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Chapter 3: Printing Tips */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Printer className="h-8 w-8 text-blue-500" />
                            3. Printing & Deployment
                        </h2>
                        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-900/50 dark:bg-yellow-900/20 mb-6">
                            <div className="flex gap-3">
                                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">Always Test Before Printing!</h3>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-500">
                                        Print a single sample and test it with multiple devices (iOS and Android) and in different lighting conditions before ordering a bulk print run.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            When exporting for print, always use vector formats like <strong>SVG</strong> or <strong>EPS</strong> (if available). This ensures your QR code remains crisp at any size, from a business card to a billboard.
                        </p>
                    </div>

                    {/* Chapter 4: Use Cases */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Zap className="h-8 w-8 text-purple-500" />
                            4. Creative Use Cases
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                "Restaurant Menus",
                                "Wi-Fi Access",
                                "App Downloads",
                                "Business Cards (vCard)",
                                "Product Packaging",
                                "Event Tickets",
                                "Feedback Forms",
                                "Social Media Links"
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-2 p-3 rounded-md border bg-card">
                                    <Smartphone className="h-4 w-4 text-primary" />
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>
            </main>
            <Footer />
        </div>
    );
}
