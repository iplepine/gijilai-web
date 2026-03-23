'use client';

import { useSurveyRestore } from '@/hooks/useSurveyRestore';

export function SurveyRestoreProvider() {
    useSurveyRestore();
    return null;
}
