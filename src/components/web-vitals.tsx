'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
    useReportWebVitals((metric) => {
        // In a real app, send this to an analytics endpoint
        console.log('[Web Vitals]', metric);
    });

    return null;
}
