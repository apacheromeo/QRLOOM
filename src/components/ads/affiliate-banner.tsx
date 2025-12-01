'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAds } from '@/hooks/use-ads';
import { cn } from '@/lib/utils';

interface AffiliateBannerProps {
    platform: 'shopee' | 'lazada';
    link: string;
    imageSrc: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
}

export function AffiliateBanner({
    platform,
    link,
    imageSrc,
    alt,
    className,
    width = 728,
    height = 90,
}: AffiliateBannerProps) {
    const { showAds } = useAds();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !showAds) {
        return null;
    }

    return (
        <div className={cn('flex justify-center my-4', className)}>
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-opacity hover:opacity-90"
                aria-label={`Shop on ${platform}`}
            >
                <Image
                    src={imageSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    className="rounded-lg shadow-sm border"
                    unoptimized // Allow external images without config changes for now
                />
                <div className="text-[10px] text-center text-muted-foreground mt-1 uppercase tracking-wider">
                    Sponsored by {platform}
                </div>
            </a>
        </div>
    );
}
