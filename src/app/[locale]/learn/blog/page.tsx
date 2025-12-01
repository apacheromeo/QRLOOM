import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Blog | QRLoom',
    description: 'Latest news, trends, and insights about QR code technology and marketing.',
};

const articles = [
    {
        id: 1,
        title: 'Top QR Code Trends to Watch in 2025',
        excerpt: 'From augmented reality to blockchain integration, discover how QR codes are evolving beyond simple links.',
        category: 'Trends',
        author: 'Sarah Johnson',
        date: 'Nov 24, 2025',
        readTime: '5 min read',
        image: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    },
    {
        id: 2,
        title: 'How to Use QR Codes for Event Marketing',
        excerpt: 'Learn how to boost attendee engagement and streamline check-ins with creative QR code strategies.',
        category: 'Marketing',
        author: 'Mike Chen',
        date: 'Nov 20, 2025',
        readTime: '8 min read',
        image: 'bg-gradient-to-br from-pink-500 to-rose-600',
    },
    {
        id: 3,
        title: 'The Security of QR Codes: Myths vs. Reality',
        excerpt: 'Debunking common misconceptions about QR code security and how to keep your users safe.',
        category: 'Security',
        author: 'Alex Rivera',
        date: 'Nov 15, 2025',
        readTime: '6 min read',
        image: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
];

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-muted/30 py-20 border-b">
                    <div className="container max-w-4xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                            Insights & Updates
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Stay ahead of the curve with our latest articles on QR technology.
                        </p>
                    </div>
                </section>

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Blog',
                            name: 'QRLoom Blog',
                            description: 'Latest news, trends, and insights about QR code technology and marketing.',
                            blogPost: articles.map((article) => ({
                                '@type': 'BlogPosting',
                                headline: article.title,
                                description: article.excerpt,
                                author: {
                                    '@type': 'Person',
                                    name: article.author,
                                },
                                datePublished: new Date(article.date).toISOString(),
                                articleSection: article.category,
                            })),
                        }),
                    }}
                />

                {/* Blog Grid */}
                <section className="py-20 container">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <Card key={article.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Mock Image Placeholder */}
                                <div className={`h-48 w-full ${article.image}`} />

                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="secondary">{article.category}</Badge>
                                        <span className="text-xs text-muted-foreground">{article.readTime}</span>
                                    </div>
                                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                                        {article.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <CardDescription className="line-clamp-3">
                                        {article.excerpt}
                                    </CardDescription>
                                </CardContent>

                                <CardFooter className="border-t pt-6">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            {article.author}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {article.date}
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg">
                            Load More Articles
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
