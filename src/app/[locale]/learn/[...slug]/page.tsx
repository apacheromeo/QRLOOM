import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function LearnPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    This resource is currently under development.
                </p>
                <Link href="/">
                    <Button>Return Home</Button>
                </Link>
            </main>
            <Footer />
        </div>
    );
}
