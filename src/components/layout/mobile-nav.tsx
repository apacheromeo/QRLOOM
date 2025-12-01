'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, QrCode, BarChart3, Palette, BookOpen, HelpCircle, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function MobileNav() {
    const [open, setOpen] = useState(false);
    // const t = useTranslations('nav');

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-6">
                    <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                            <QrCode className="h-5 w-5 text-background" />
                        </div>
                        <span className="text-lg font-semibold">QRLoom</span>
                    </Link>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Solutions</h4>
                            <MobileLink href="/#features" onClick={() => setOpen(false)} icon={QrCode}>
                                Dynamic QR Codes
                            </MobileLink>
                            <MobileLink href="/#features" onClick={() => setOpen(false)} icon={BarChart3}>
                                Analytics
                            </MobileLink>
                            <MobileLink href="/#features" onClick={() => setOpen(false)} icon={Palette}>
                                Custom Design
                            </MobileLink>
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Resources</h4>
                            <MobileLink href="/learn/guide" onClick={() => setOpen(false)} icon={BookOpen}>
                                QR Code Guide
                            </MobileLink>
                            <MobileLink href="/learn/blog" onClick={() => setOpen(false)} icon={FileText}>
                                Blog
                            </MobileLink>
                            <MobileLink href="/learn/help" onClick={() => setOpen(false)} icon={HelpCircle}>
                                Help Center
                            </MobileLink>
                        </div>

                        <Separator />

                        <MobileLink href="/pricing" onClick={() => setOpen(false)}>
                            Pricing
                        </MobileLink>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

interface MobileLinkProps extends React.ComponentProps<typeof Link> {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ElementType;
}

function MobileLink({ children, onClick, icon: Icon, className, ...props }: MobileLinkProps) {
    return (
        <Link
            onClick={onClick}
            className="flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            {...props}
        >
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            {children}
        </Link>
    );
}
