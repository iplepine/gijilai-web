'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { isAnalyticsEnabled, setAnalyticsUser, trackPageView } from '@/lib/analytics';

export function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!isAnalyticsEnabled()) return;

    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    trackPageView(path);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isAnalyticsEnabled()) return;
    setAnalyticsUser(user?.id ?? null);
  }, [user?.id]);

  return null;
}
