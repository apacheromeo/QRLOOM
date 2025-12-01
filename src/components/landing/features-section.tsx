'use client';

import { motion } from 'framer-motion';
import {
    QrCode,
    BarChart3,
    Palette,
    Zap,
    Shield,
    Smartphone
} from 'lucide-react';

const features = [
    {
        icon: QrCode,
        title: 'Custom QR Codes',
        description: 'Create unique QR codes with your logo, colors, and custom frames to match your brand identity.',
    },
    {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'Track scans in real-time. Know where, when, and what device your users are scanning from.',
    },
    {
        icon: Palette,
        title: 'Beautiful Templates',
        description: 'Choose from dozens of professionally designed templates or create your own from scratch.',
    },
    {
        icon: Zap,
        title: 'Dynamic QR Codes',
        description: 'Edit the destination URL anytime without re-printing your QR code. Perfect for marketing campaigns.',
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'Your data is safe with us. We use industry-standard encryption and security practices.',
    },
    {
        icon: Smartphone,
        title: 'Mobile Optimized',
        description: 'Manage your QR codes on the go with our fully responsive dashboard and mobile-friendly interface.',
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-muted/50">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Everything you need to manage your QR codes
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Powerful features to help you create, track, and manage your QR codes effectively.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-background rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
