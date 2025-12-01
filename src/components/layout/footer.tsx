import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { QrCode } from 'lucide-react';

export function Footer() {
    const t = useTranslations('footer');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background">
            <div className="container py-12 md:py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                                <QrCode className="h-5 w-5 text-background" />
                            </div>
                            <span className="text-lg font-semibold">QRLoom</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            {t('tagline')}
                        </p>
                    </div>

                    {/* Product */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">{t('product')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                                    {t('features')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                                    {t('pricing')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                                    {t('docs')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">{t('company')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                    {t('about')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                                    {t('blog')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                                    {t('contact')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">{t('legal')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                                    {t('privacy')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                                    {t('terms')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8">
                    <p className="text-center text-sm text-muted-foreground">
                        {t('copyright', { year: currentYear })}
                    </p>
                </div>
            </div>
        </footer>
    );
}
