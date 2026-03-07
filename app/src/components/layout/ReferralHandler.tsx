'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ReferralHandlerContent() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            sessionStorage.setItem('referral_code', ref);
            console.log('Referral code saved:', ref);
        }
    }, [searchParams]);

    return null;
}

export function ReferralHandler() {
    return (
        <Suspense fallback={null}>
            <ReferralHandlerContent />
        </Suspense>
    );
}
