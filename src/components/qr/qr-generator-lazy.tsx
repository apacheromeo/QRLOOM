'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const QRGenerator = dynamic(
    () => import('./qr-generator').then((mod) => mod.QRGenerator),
    {
        loading: () => (
            <div className="w-full h-[600px] bg-card rounded-xl border shadow-sm p-8 flex flex-col gap-8">
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid md:grid-cols-2 gap-8 h-full">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-full w-full rounded-lg" />
                </div>
            </div>
        ),
        ssr: false
    }
);

export function QRGeneratorLazy() {
    return <QRGenerator />;
}
