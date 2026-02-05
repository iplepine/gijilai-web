'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export default function SharePage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'PARENT-2024-X9Z2';

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-10">
      <Navbar title="공유하기" showBack />

      <div className="h-4" />

      {/* Headline */}
      <div className="px-4 text-center">
        <h3 className="text-2xl font-bold text-[var(--navy)] dark:text-white pb-2 pt-5">
          발견의 기쁨을 나누세요
        </h3>
        <p className="text-[var(--green-custom)] text-base pb-6 pt-1">
          아이의 잠재력을 배우자와 함께 확인해보세요.
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-4">
        <div className="rounded-xl overflow-hidden ios-shadow bg-white dark:bg-gray-800">
          <div
            className="w-full aspect-video bg-cover bg-center relative"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80")`,
            }}
          >
            <div className="w-full h-full bg-[var(--primary)]/20 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-white/90 px-4 py-2 rounded-full shadow-sm">
                <span className="text-[var(--primary)] font-bold text-sm">기질 분석 완료</span>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-xl font-bold text-[var(--navy)] dark:text-white">
              우리 아이는 "열정 탐험가형"이래요!
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-[var(--primary)]" />
                <p className="text-[var(--green-custom)] text-sm font-medium">
                  사주와 기질로 보는 맞춤형 육아 가이드
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="lock" size="sm" className="text-[var(--primary)]" />
                <p className="text-[var(--green-custom)] text-sm">
                  아이의 개인정보는 안전하게 보호됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="px-4 py-4">
        <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
              추천인 코드
            </span>
            <span className="text-xs text-[var(--green-custom)]">
              {copied ? '복사됨!' : '클릭하여 복사'}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
          >
            <code className="text-[var(--navy)] dark:text-white font-bold">{referralCode}</code>
            <Icon name="content_copy" size="sm" className="text-[var(--primary)]" />
          </button>
        </div>
      </div>

      <div className="h-4" />

      {/* Sharing Buttons */}
      <div className="px-4 space-y-3">
        <Button variant="kakao" size="md" fullWidth icon={<Icon name="chat_bubble" size="sm" />}>
          카카오톡으로 공유하기
        </Button>
        <Button variant="primary" size="md" fullWidth icon={<Icon name="favorite" size="sm" />}>
          배우자와도 궁합을 확인해보세요
        </Button>
      </div>

      {/* Other Share Options */}
      <div className="px-4 mt-8">
        <p className="text-center text-[var(--green-custom)] text-xs font-medium mb-4 uppercase tracking-widest">
          더 많은 공유 옵션
        </p>
        <div className="flex justify-center gap-6">
          <ShareOption icon="link" label="링크 복사" />
          <ShareOption icon="image" label="이미지 저장" />
          <ShareOption icon="more_horiz" label="더보기" />
        </div>
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
