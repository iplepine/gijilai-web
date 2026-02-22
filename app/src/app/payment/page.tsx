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
  { icon: 'auto_awesome', text: '기질아이 유형 세부 대응 중' },
  { icon: 'favorite', text: '부모-자녀 궁합 계산 중' },
  { icon: 'lightbulb', text: '맞춤 양육 솔루션 생성 중' },
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
    // 990원 결제 시뮬레이션
    setIsPaid(true);
    setStatus('analyzing');
    // 로딩 메시지 시뮬레이션 후 결과 페이지로 이동 (이미 useEffect에서 처리 중)
  };

  if (status === 'analyzing') {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-slate-900">
        <Navbar title="분석 중" />

        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
          {/* Animated Garden Scene */}
          <div className="relative w-48 h-48 mb-12">
            <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping duration-[3000ms]"></div>
            <div className="absolute inset-4 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Icon name={LOADING_MESSAGES[loadingIndex].icon} className="text-primary text-6xl animate-bounce-subtle" size="lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center animate-spin duration-[4000ms]">
                  <span className="text-[10px]">✨</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-4 max-w-xs">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {LOADING_MESSAGES[loadingIndex].text}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed break-keep">
              {loadingIndex === 0 && "아이의 데이터를 꼼꼼하게 읽어보고 있어요."}
              {loadingIndex === 1 && "아이의 기질 조합을 상세하게 분석합니다."}
              {loadingIndex === 2 && "부모님과의 조화로운 교감을 위한 공식을 계산해요."}
              {loadingIndex === 3 && "오늘 바로 실천할 수 있는 솔루션을 준비 중입니다."}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-[200px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-10 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((loadingIndex + 1) / LOADING_MESSAGES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 pb-32">
      <Navbar title="분석 및 결제" showBack />

      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-10 space-y-10 max-w-md mx-auto w-full">
        {/* Header Section */}
        <section className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest">
            Limited Offer
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white break-keep">
            우리 아이를 위한<br />단 한 방울의 이해
          </h2>
          <p className="text-slate-500 text-sm">
            990원으로 발견하는 육아의 마법
          </p>
        </section>

        {/* Benefits Preview Card */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 border border-slate-100 dark:border-slate-700">
          <div className="p-8 space-y-6">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-800 dark:text-white">아이 신호 통역하기</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">아이 행동의 진짜 원인을 기질 관점에서 명쾌하게 풀어드려요.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <span className="text-xl">✨</span>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-800 dark:text-white">마법의 한마디</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">당장 오늘 저녁부터 써먹을 수 있는 맞춤형 대화 가이드.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                  <span className="text-xl">🖼️</span>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-800 dark:text-white">맞춤형 기질 일러스트</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">내 기질과 아이 기질이 어우러진 배경화면용 카드 증정.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 dark:text-white italic">"오늘의 마음 처방 포함"</span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">Tier 2 Entry</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="space-y-4">
          <div className="bg-slate-800 dark:bg-slate-950 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>

            <div className="relative z-10 flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 line-through">정가 4,900원</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">990</span>
                  <span className="text-lg font-bold">원</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase mb-1">
                  80% Discount
                </span>
                <p className="text-[10px] text-slate-400">커피 한 잔보다 가벼운 응원</p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 px-4 break-keep">
            <Icon name="verified" size="sm" className="text-slate-300" />
            결제 즉시 분석 리포트와 마음 처방전이 생성됩니다. 분석된 데이터는 전문가가 검증한 로직을 따릅니다.
          </p>
        </section>
      </div>

      {/* Payment Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-30">
        <div className="max-w-md mx-auto">
          <Button variant="primary" size="lg" fullWidth onClick={handlePayment} className="h-16 rounded-[24px] text-lg font-bold shadow-2xl shadow-primary/20">
            990원 결제하고 처방전 받기
          </Button>
        </div>
      </div>
    </div>
  );
}
