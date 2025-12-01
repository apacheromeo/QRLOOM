import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next';
import { Shield, Lock, Server, Eye, FileCheck, Globe } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Security & Privacy | QRLoom',
    description: 'Learn how QRLoom protects your data with enterprise-grade security, encryption, and compliance standards.',
};

export default function SecurityPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-slate-950 text-white py-24">
                    <div className="container max-w-4xl text-center">
                        <Shield className="h-16 w-16 text-emerald-400 mx-auto mb-6" />
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                            Security First, Always.
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            We treat your data with the highest level of security. From encryption at rest to strict access controls, your information is safe with us.
                        </p>
                    </div>
                </section>

                {/* Security Pillars */}
                <section className="py-20 container">
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <div className="p-8 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                            <Lock className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-3">Data Encryption</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                All sensitive data is encrypted at rest using AES-256 standards. Data in transit is protected via TLS 1.3, ensuring no one can intercept your information.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                            <Server className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-3">Secure Infrastructure</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Hosted on enterprise-grade cloud providers with 24/7 monitoring, automated backups, and redundant systems to ensure 99.9% uptime.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                            <Eye className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-3">Privacy Focused</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We never sell your data. Our business model is based on providing a premium service, not monetizing your personal information.
                            </p>
                        </div>
                    </div>

                    {/* Compliance Section */}
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-10 text-center">Compliance & Standards</h2>

                        <div className="space-y-6">
                            <div className="flex gap-6 items-start p-6 rounded-xl border bg-muted/30">
                                <Globe className="h-8 w-8 text-blue-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold mb-2">GDPR & CCPA Ready</h3>
                                    <p className="text-muted-foreground">
                                        We are fully committed to complying with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). You have full control over your data, including the right to export or delete it at any time.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start p-6 rounded-xl border bg-muted/30">
                                <FileCheck className="h-8 w-8 text-green-500 shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Regular Audits</h3>
                                    <p className="text-muted-foreground">
                                        Our security team performs regular vulnerability assessments and penetration testing to identify and patch potential risks before they can affect our users.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </main>
            <Footer />
        </div>
    );
}
