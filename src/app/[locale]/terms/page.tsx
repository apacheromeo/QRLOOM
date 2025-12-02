import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | QRLoom',
    description: 'Terms of Service for QRLoom.',
};

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container py-12 md:py-20">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-muted-foreground">Last updated: December 2025</p>

                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using QRLoom, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>

                        <h2>2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on QRLoom's website for personal, non-commercial transitory viewing only.
                        </p>

                        <h2>3. Disclaimer</h2>
                        <p>
                            The materials on QRLoom's website are provided "as is". QRLoom makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
                        </p>

                        <h2>4. Limitations</h2>
                        <p>
                            In no event shall QRLoom or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on QRLoom's Internet site.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
