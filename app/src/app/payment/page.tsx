'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';

type LoadingStatus = 'idle' | 'analyzing' | 'complete';

const LOADING_MESSAGES = [
  { icon: 'analytics', text: '기질 데이터 분석 중' },
  { icon: 'auto_awesome', text: '사주 명식 대조 중' },
  { icon: 'favorite', text: '부모-자녀 궁합 계산 중' },
  { icon: 'lightbulb', text: '맞춤 솔루션 생성 중' },
];

export default function PaymentPage() {
  const router = useRouter();
  const { intake, setIsPaid } = useAppStore();
  const [status, setStatus] = useState<LoadingStatus>('idle');
  const [loadingIndex, setLoadingIndex] = useState(0);

  // Simulate loading messages
  useEffect(() => {
    if (status === 'analyzing') {
      const interval = setInterval(() => {
        setLoadingIndex((prev) => {
          if (prev >= LOADING_MESSAGES.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setStatus('complete');
              router.push('/report');
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [status, router]);

  const handlePayment = async () => {
    // TODO: Stripe 결제 연동
    // 지금은 바로 분석 시작
    setIsPaid(true);
    setStatus('analyzing');
  };

  if (status === 'analyzing') {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Navbar title="분석 중" />

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Spinner */}
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name={LOADING_MESSAGES[loadingIndex].icon} className="text-[var(--primary)]" size="lg" />
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <p className="text-[var(--primary)] font-bold text-lg animate-pulse">
              {LOADING_MESSAGES[loadingIndex].text}
              <span className="loading-dots" />
            </p>
            <p className="text-xs text-gray-500">거의 다 준비되었습니다!</p>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2 mt-8">
            {LOADING_MESSAGES.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i <= loadingIndex ? 'bg-[var(--primary)]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Navbar title="분석 및 결제" showBack />

      <div className="flex-1 overflow-y-auto">
        {/* Summary Card */}
        <div className="p-4">
          <div className="rounded-xl overflow-hidden ios-shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div
              className="w-full aspect-video bg-cover bg-center"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80")`,
              }}
            />
            <div className="p-5 space-y-4">
              <h3 className="text-xl font-bold text-[var(--navy)] dark:text-white">
                입력하신 정보로 이런 분석을 제공합니다
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--primary)]/20 p-2 rounded-full">
                    <Icon name="psychology" size="sm" className="text-[var(--primary)]" />
                  </div>
                  <p className="text-[var(--green-custom)] text-sm font-medium">
                    {intake.childName || '아이'}의 과학적 기질 분석
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--primary)]/20 p-2 rounded-full">
                    <Icon name="favorite" size="sm" className="text-[var(--primary)]" />
                  </div>
                  <p className="text-[var(--green-custom)] text-sm font-medium">부모 기질 궁합 리포트</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--primary)]/20 p-2 rounded-full">
                    <Icon name="auto_awesome" size="sm" className="text-[var(--primary)]" />
                  </div>
                  <p className="text-[var(--green-custom)] text-sm font-medium">사주 명식 풀이 및 맞춤 솔루션</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="px-4">
          <h3 className="text-lg font-bold text-[var(--navy)] dark:text-white mb-3">결제 상세</h3>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="font-bold text-[var(--navy)] dark:text-white">리포트 평생 소장권</p>
                <p className="text-xs text-[var(--green-custom)]">한정 기간 할인가 적용</p>
              </div>
              <p className="text-lg font-bold text-[var(--navy)] dark:text-white">$1</p>
            </div>
            <div className="flex justify-between items-center p-4">
              <p className="text-sm text-[var(--green-custom)]">총 결제 금액</p>
              <p className="text-xl font-black text-[var(--primary)]">$1.00</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-400 p-4">
            <Icon name="info" size="sm" className="mt-0.5 flex-shrink-0" />
            <p>결제 즉시 분석 리포트가 생성되며, 마이페이지에서 언제든지 다시 확인하실 수 있습니다.</p>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="p-4 bg-[var(--background-light)] dark:bg-[var(--background-dark)] border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto">
          <Button variant="primary" size="lg" fullWidth onClick={handlePayment}>
            결제하고 리포트 받기
          </Button>
        </div>
      </div>
    </div>
  );
}
