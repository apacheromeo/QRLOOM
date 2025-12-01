'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { QrCode, BarChart3, Palette, Shield, BookOpen, HelpCircle, FileText } from 'lucide-react';

export function MainNav() {
    const t = useTranslations('nav');

    return (
        <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
                {/* Solutions Dropdown */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <Link
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <QrCode className="h-6 w-6" />
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            QRLoom
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            The professional QR code generator for modern businesses.
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/#features" title="Dynamic QR Codes" icon={QrCode}>
                                Edit content anytime without reprinting.
                            </ListItem>
                            <ListItem href="/#features" title="Analytics" icon={BarChart3}>
                                Track scans, locations, and devices.
                            </ListItem>
                            <ListItem href="/#features" title="Custom Design" icon={Palette}>
                                Match your brand identity perfectly.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Dropdown */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            <ListItem href="/learn/guide" title="QR Code Guide" icon={BookOpen}>
                                Best practices and tips for success.
                            </ListItem>
                            <ListItem href="/learn/blog" title="Blog" icon={FileText}>
                                Latest news and updates.
                            </ListItem>
                            <ListItem href="/learn/help" title="Help Center" icon={HelpCircle}>
                                Guides and troubleshooting.
                            </ListItem>
                            <ListItem href="/learn/security" title="Security" icon={Shield}>
                                How we keep your data safe.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Direct Links */}
                <NavigationMenuItem>
                    <Link href="/pricing" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Pricing
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'> & { icon?: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref as any}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                    href={props.href || '/'}
                    {...props}
                >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';
