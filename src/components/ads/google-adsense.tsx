'use client';

import Script from 'next/script';
import { useAds } from '@/hooks/use-ads';

interface GoogleAdSenseProps {
    pId: string;
}

export function GoogleAdSense({ pId }: GoogleAdSenseProps) {
    const { showAds } = useAds();

    if (!showAds || !pId) {
        return null;
    }

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}
