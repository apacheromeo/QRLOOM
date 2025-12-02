import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | QRLoom',
    description: 'Learn more about QRLoom and our mission to make QR codes beautiful and accessible.',
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container py-12 md:py-20">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold tracking-tight">About QRLoom</h1>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            QRLoom is a professional QR code generator designed to bridge the gap between physical and digital experiences.
                        </p>
                        <p>
                            We believe that QR codes shouldn't just be functional—they should be beautiful. Our platform allows businesses and individuals to create custom, branded QR codes that stand out.
                        </p>
                        <h2>Our Mission</h2>
                        <p>
                            To empower everyone with simple, powerful tools to connect their audience to their digital content instantly.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
