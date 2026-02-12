'use client';

import { Icon } from '@/components/ui/Icon';
import Image from 'next/image';

export function HomeHeader() {
    return (
        <header className="sticky top-0 z-50 flex items-center bg-garden-cream/60 backdrop-blur-md px-6 py-4 justify-between">
            <div className="flex items-center gap-2">
                <Icon name="local_florist" className="text-garden-green" />
                <h1 className="font-display text-lg font-bold tracking-tight text-[var(--navy)]">아이나 정원</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="text-garden-brown/70">
                    <Icon name="notifications" />
                </button>
                <div className="w-8 h-8 rounded-full border border-garden-accent bg-gray-200 overflow-hidden">
                    {/* Placeholder for user profile image */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                        <Icon name="person" size="sm" />
                    </div>
                </div>
            </div>
        </header>
    );
}
