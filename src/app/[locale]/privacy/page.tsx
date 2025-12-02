import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | QRLoom',
    description: 'Privacy Policy for QRLoom.',
};

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container py-12 md:py-20">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-muted-foreground">Last updated: December 2025</p>

                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to QRLoom. We respect your privacy and are committed to protecting your personal data.
                        </p>

                        <h2>2. Data We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support. This may include your name, email address, and payment information.
                        </p>

                        <h2>3. How We Use Your Data</h2>
                        <p>
                            We use your data to provide, maintain, and improve our services, process transactions, and communicate with you.
                        </p>

                        <h2>4. Data Security</h2>
                        <p>
                            We implement appropriate security measures to protect your personal information.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
