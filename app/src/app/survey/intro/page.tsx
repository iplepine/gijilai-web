'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function IntroPage() {
    const router = useRouter();
    const resetAll = useAppStore((state) => state.resetAll);

    const startSurvey = () => {
        resetAll();
        router.push('/survey');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full space-y-8 animate-fadeIn">
                <div className="relative w-48 h-48 mx-auto mb-8">
                    {/* Placeholder for Illustration */}
                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-50 animate-pulse"></div>
                    <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <span className="text-4xl">👨‍👩‍👧‍👦</span>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    우리 아이,<br />
                    <span className="text-primary">도대체 왜 그럴까요?</span>
                </h1>

                <p className="text-lg text-gray-600">
                    기질을 알면 육아가 쉬워집니다.<br />
                    3분 만에 아이의 기질과<br />
                    나의 양육 태도를 점검해보세요.
                </p>

                <div className="pt-8">
                    <button
                        onClick={startSurvey}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 text-lg"
                        style={{ backgroundColor: '#6C5CE7' }}
                    >
                        지금 바로 시작하기
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-400">
                    <p>Aina Garden</p>
                </div>
            </div>
        </div>
    );
}
