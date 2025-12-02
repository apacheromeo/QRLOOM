import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next';
import { Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us | QRLoom',
    description: 'Get in touch with the QRLoom team.',
};

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container py-12 md:py-20">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
                    <p className="text-xl text-muted-foreground">
                        Have questions or feedback? We'd love to hear from you.
                    </p>

                    <div className="grid gap-6 md:grid-cols-2 mt-8">
                        <div className="p-6 rounded-lg border bg-card">
                            <div className="flex items-center gap-3 mb-4">
                                <Mail className="h-6 w-6 text-primary" />
                                <h3 className="font-semibold text-lg">Email Support</h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                For general inquiries and support requests.
                            </p>
                            <a href="mailto:support@qrloom.app" className="text-primary hover:underline">
                                support@qrloom.app
                            </a>
                        </div>

                        <div className="p-6 rounded-lg border bg-card">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="h-6 w-6 text-primary" />
                                <h3 className="font-semibold text-lg">Location</h3>
                            </div>
                            <p className="text-muted-foreground">
                                Bangkok, Thailand
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
