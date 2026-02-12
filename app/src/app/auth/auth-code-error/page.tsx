'use client';

import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F8F4] p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
                <Icon name="error_outline" size="lg" className="text-4xl" />
            </div>

            <h1 className="text-xl font-bold text-[var(--navy)] mb-2">
                로그인 중 문제가 발생했습니다
            </h1>

            <p className="text-gray-500 mb-8 max-w-xs">
                인증 코드를 확인하는 과정에서 오류가 발생했습니다.<br />
                잠시 후 다시 시도해주세요.
            </p>

            <Link href="/login" className="w-full max-w-xs">
                <button className="w-full bg-[var(--deep-green)] text-white py-3.5 rounded-xl font-bold">
                    로그인 페이지로 돌아가기
                </button>
            </Link>
        </div>
    );
}
