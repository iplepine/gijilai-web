'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { TemperamentScorer } from '@/lib/TemperamentScorer';
import { TemperamentClassifier } from '@/lib/TemperamentClassifier';
import { CHILD_QUESTIONS } from '@/data/questions';

export default function SharePage() {
  const router = useRouter();
  const { intake, cbqResponses, atqResponses } = useAppStore();
  const [copied, setCopied] = useState(false);
  const referralCode = 'AINA-GARDEN-' + (intake.childName ? intake.childName.toUpperCase() : 'FRIEND');

  // Calculate Temperament (Parent = Soil, Child = Seed + Plant)
  const temperamentInfo = (() => {
    if (!cbqResponses || Object.keys(cbqResponses).length === 0) return null;
    const scores = TemperamentScorer.calculate(CHILD_QUESTIONS, cbqResponses as any);

    // Parent scores for soil context
    let parentScores = { NS: 50, HA: 50, RD: 50, P: 50 };
    if (atqResponses && Object.keys(atqResponses).length > 0) {
      parentScores = TemperamentScorer.calculate(CHILD_QUESTIONS, atqResponses as any);
    }

    return TemperamentClassifier.analyze(scores, parentScores);
  })();

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(window.location.origin + '?ref=' + referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 pb-20">
      <Navbar title="결과 공유하기" showBack />

      <div className="flex-1 px-6 py-10 max-w-md mx-auto w-full space-y-10">
        {/* Headline */}
        <section className="text-center space-y-2">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold mb-2">
            SHARE YOUR GARDEN
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white break-keep">
            우리 아이만의 특별한 씨앗을<br />가족과 함께 나눠보세요
          </h2>
        </section>

        {/* Temperament Card (Share Preview) */}
        <section className="relative">
          <div className="rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-800 shadow-2xl shadow-primary/10 border border-slate-100 dark:border-slate-700">
            <div
              className="w-full aspect-[4/5] bg-cover bg-center relative"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80")`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <div className="mb-4">
                  <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    Aina Garden Report
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {intake.childName || '우리 아이'}는<br />
                  <span className="text-primary-light">"{temperamentInfo?.label || '열정 탐험가'}"</span>예요!
                </h3>
                <p className="text-sm opacity-80 leading-relaxed font-medium">
                  {temperamentInfo?.desc || '호기심이 많고 에너지가 넘치는 탐험가 기질을 가지고 있어요.'}
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Badge */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center p-2 rotate-12 border-2 border-primary/20">
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold text-center leading-tight">
              기질<br />분석 완료
            </div>
          </div>
        </section>

        {/* Sharing Options */}
        <section className="space-y-4">
          <Button variant="kakao" size="lg" fullWidth className="h-16 rounded-2xl flex items-center justify-center gap-3 text-lg">
            <span className="text-2xl">💬</span> 카카오톡으로 결과 보내기
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleCopyCode}
              className={`h-16 rounded-2xl flex items-center justify-center gap-2 text-[14px] ${copied ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
            >
              <Icon name={copied ? "check" : "link"} size="sm" />
              {copied ? '링크 복사됨' : '결과 링크 복사'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              className="h-16 rounded-2xl flex items-center justify-center gap-2 text-[14px]"
            >
              <Icon name="download" size="sm" />
              이미지로 저장
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-slate-100 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200/50">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-lg">🎁</span> 친구와 함께 정원을 가꿔요
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed break-keep">
            공유된 링크를 통해 친구가 테스트를 완료하면,<br />
            <strong>회원님과 친구 모두에게 990원 할인권</strong>을 드립니다.
          </p>
        </section>
      </div>

      {/* Referral Code Footer */}
      <div className="px-6 py-8 text-center text-[11px] text-slate-400 font-medium uppercase tracking-[0.2em]">
        designed by aina garden
      </div>
    </div>
  );
}

function ShareOption({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center border border-gray-200 dark:border-gray-700">
        <Icon name={icon} className="text-[var(--navy)] dark:text-white" />
      </div>
      <span className="text-[10px] text-[var(--green-custom)]">{label}</span>
    </div>
  );
}
