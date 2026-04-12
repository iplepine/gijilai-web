'use client';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

function isAnalyticsReady() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function' && !!measurementId;
}

function normalizeParams(params: AnalyticsParams = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );
}

export function isAnalyticsEnabled() {
  return !!measurementId;
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (!isAnalyticsReady()) return;

  window.gtag!('event', eventName, normalizeParams(params));
}

export function trackPageView(path: string) {
  if (!isAnalyticsReady()) return;

  window.gtag!('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function setAnalyticsUser(userId: string | null) {
  if (!isAnalyticsReady()) return;

  window.gtag!('config', measurementId!, {
    user_id: userId ?? undefined,
  });
}
