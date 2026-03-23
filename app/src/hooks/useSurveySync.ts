'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/store/useAppStore';
import { db } from '@/lib/db';

/**
 * 설문 응답을 Supabase에 자동 동기화하는 훅.
 * - 응답 변경 시 2초 debounce로 서버에 저장
 * - 비로그인 시 건너뜀 (localStorage만 사용)
 */
export function useSurveySync() {
    const { user } = useAuth();
    const cbqResponses = useAppStore((s) => s.cbqResponses);
    const atqResponses = useAppStore((s) => s.atqResponses);
    const parentingResponses = useAppStore((s) => s.parentingResponses);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevRef = useRef<string>('');

    const syncToServer = useCallback(async () => {
        if (!user) return;

        const saves: Promise<void>[] = [];

        if (Object.keys(cbqResponses).length > 0) {
            saves.push(
                db.saveSurveyResponses(user.id, 'CHILD', cbqResponses,
                    Object.keys(cbqResponses).length >= 20 ? 'COMPLETED' : 'IN_PROGRESS')
            );
        }
        if (Object.keys(atqResponses).length > 0) {
            saves.push(
                db.saveSurveyResponses(user.id, 'PARENT', atqResponses,
                    Object.keys(atqResponses).length >= 20 ? 'COMPLETED' : 'IN_PROGRESS')
            );
        }
        if (Object.keys(parentingResponses).length > 0) {
            saves.push(
                db.saveSurveyResponses(user.id, 'PARENTING_STYLE', parentingResponses,
                    Object.keys(parentingResponses).length >= 10 ? 'COMPLETED' : 'IN_PROGRESS')
            );
        }

        try {
            await Promise.all(saves);
        } catch (e) {
            console.warn('Survey sync failed (will retry on next change):', e);
        }
    }, [user, cbqResponses, atqResponses, parentingResponses]);

    useEffect(() => {
        if (!user) return;

        const fingerprint = JSON.stringify({
            c: Object.keys(cbqResponses).length,
            a: Object.keys(atqResponses).length,
            p: Object.keys(parentingResponses).length,
        });

        if (fingerprint === prevRef.current) return;
        prevRef.current = fingerprint;

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(syncToServer, 2000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [user, cbqResponses, atqResponses, parentingResponses, syncToServer]);
}
