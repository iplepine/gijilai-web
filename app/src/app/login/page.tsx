'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Icon } from '@/components/ui/Icon';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const { user, signInWithGoogle, signInWithKakao, isLoadingGoogle, isLoadingKakao } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace('/');
        }
    }, [user, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
            <div className="w-full max-w-sm text-center">
                <div className="mb-8 flex justify-center">
                    <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white">
                        <Icon name="child_care" size="lg" className="text-4xl" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">
                    기질아이
                </h1>
                <p className="text-gray-500 mb-10">
                    아이의 신호를 올바르게 통역하는<br />우리 아이 맞춤 양육 가이드
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => alert('카카오 로그인은 현재 준비 중입니다. 구글 로그인을 이용해 주세요.')}
                        className="w-full bg-[#FEE500]/50 text-[#000000]/40 py-4 rounded-xl font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                        <Icon name="chat_bubble" size="sm" />
                        카카오 로그인은 현재 지원하지 않습니다
                    </button>

                    <button
                        onClick={signInWithGoogle}
                        disabled={isLoadingGoogle}
                        className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]"
                    >
                        {isLoadingGoogle ? (
                            <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
                        ) : (
                            <Icon name="g_translate" size="sm" />
                        )}
                        {isLoadingGoogle ? '로그인 중...' : '구글로 계속하기'}
                    </button>
                </div>

                <p className="mt-8 text-xs text-gray-400">
                    로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                </p>
            </div>
        </div>
    );
}
