'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';

type TabType = 'temperament' | 'saju' | 'solution';

// Mock data - 실제로는 API에서 받아옴
const MOCK_RESULT = {
  integratedType: '열정 탐험가형',
  element: 'FIRE',
  fitScore: 85,
  fitLabel: '환상의 찰떡궁합',
  coreInsight:
    '부모님의 포용력 있는 "토(土)" 기운이 아이의 넘치는 "화(火)" 기운을 따뜻하게 안아주는 85%의 최우수 궁합입니다.',
  typeDescription:
    '높은 활동성과 화(Fire)의 추진력을 가진 아이입니다. 세상에 대한 호기심이 무궁무진하며, 스스로 목표를 정했을 때 엄청난 몰입도를 보여주는 미래의 리더 타입입니다.',
  solutions: {
    play: [
      {
        title: '다이나믹 장애물 코스',
        description: '거실이나 야외에 매트, 상자를 활용해 아이만의 루트를 만들고 기록에 도전하게 하세요.',
      },
      {
        title: '감정 컬러 페인팅',
        description: '넘치는 화 에너지를 전지에 자유롭게 색으로 표현하며 정서적 이완을 돕습니다.',
      },
    ],
    script: [
      {
        label: '감정 읽어주기',
        text: '"와, 정말 멋진 계획인걸! 네 눈이 반짝거리는 걸 보니 정말 신나 보여."',
      },
      {
        label: '행동 조절 돕기',
        text: '"열정이 넘치는구나! 우리 딱 10초만 숨을 크게 들이마시고 다시 시작해볼까?"',
      },
    ],
    environment: [
      '잠들기 전 30분, 정적인 "쿨다운(Cool-down)" 루틴을 반드시 포함해주세요.',
      '아이 스스로 교구의 위치를 정하게 하여 자기 주도성을 키워주는 환경이 좋습니다.',
    ],
    parentCare:
      '"아이가 넘치는 에너지를 보여주는 것은 당신이 아이를 건강하고 안전하게 키워내고 있다는 증거입니다. 오늘도 충분히 잘하고 계세요."',
  },
};

export default function ReportPage() {
  const { intake } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('solution');

  const tabs: { key: TabType; icon: string; label: string }[] = [
    { key: 'temperament', icon: '📊', label: '기질 분석' },
    { key: 'saju', icon: '🔮', label: '사주 분석' },
    { key: 'solution', icon: '⭐', label: '통합 솔루션' },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-32">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-[var(--background-light)]/95 dark:bg-[var(--background-dark)]/95 backdrop-blur-md border-b border-[var(--green-custom)]/10">
        <div className="flex items-center p-4 justify-between">
          <div className="size-10" />
          <h2 className="text-lg font-bold flex-1 text-center">통합 양육 보고서</h2>
          <Link href="/share">
            <Icon name="share" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[60px] z-40 bg-[var(--background-light)] dark:bg-[var(--background-dark)] border-b border-[var(--green-custom)]/10">
        <div className="flex px-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-4 text-sm font-bold border-b-[3px] transition-all ${
                activeTab === tab.key
                  ? 'border-[var(--primary)] text-[var(--navy)] dark:text-white'
                  : 'border-transparent text-[var(--green-custom)]/60'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-6 space-y-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-white to-[var(--primary)]/5 dark:from-[var(--navy)]/60 dark:to-[var(--primary)]/10 rounded-2xl p-6 ios-shadow border border-[var(--primary)]/20 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--primary)]/10 rounded-full blur-2xl" />

          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white dark:border-[var(--navy)] shadow-md bg-[var(--primary)]/20 flex items-center justify-center">
                <Icon name="child_care" size="lg" className="text-[var(--primary)]" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[var(--primary)] text-[var(--navy)] text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                {MOCK_RESULT.element}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--primary)] tracking-widest uppercase mb-1">
                Main Archetype
              </h3>
              <p className="text-2xl font-bold text-[var(--navy)] dark:text-white leading-tight">
                {MOCK_RESULT.integratedType}
              </p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-[var(--navy)]/40 rounded-xl p-4 border border-white dark:border-[var(--green-custom)]/10">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="favorite" size="sm" className="text-[var(--primary)]" />
              <p className="text-sm font-bold text-[var(--navy)] dark:text-[var(--primary)]">
                {MOCK_RESULT.fitLabel}
              </p>
            </div>
            <p className="text-sm text-[var(--green-custom)] dark:text-white/70 leading-relaxed">
              {MOCK_RESULT.coreInsight}
            </p>
          </div>
        </div>

        {/* Type Description */}
        <div className="py-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-1 bg-[var(--primary)] rounded-full" />
            <h4 className="text-base font-bold text-[var(--navy)] dark:text-white">
              &apos;{MOCK_RESULT.integratedType}&apos;이란?
            </h4>
          </div>
          <p className="text-sm text-[var(--green-custom)] dark:text-white/70 leading-relaxed bg-[var(--primary)]/5 p-4 rounded-xl border-l-4 border-[var(--primary)]">
            {MOCK_RESULT.typeDescription}
          </p>
        </div>

        {/* Solutions */}
        <div className="space-y-4">
          {/* Play Solutions */}
          <SolutionCard
            icon="rocket_launch"
            iconColor="text-[var(--primary)]"
            iconBg="bg-[var(--primary)]/10"
            title="에너지 맞춤 놀이 제안"
          >
            <ul className="space-y-3">
              {MOCK_RESULT.solutions.play.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-[var(--primary)] font-bold">{String(i + 1).padStart(2, '0')}.</span>
                  <p className="text-[var(--green-custom)] dark:text-white/80">
                    <strong className="text-[var(--navy)] dark:text-white">{item.title}:</strong> {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </SolutionCard>

          {/* Script Solutions */}
          <SolutionCard
            icon="chat_bubble"
            iconColor="text-orange-400"
            iconBg="bg-orange-400/10"
            title="필수 대화 스크립트"
          >
            <div className="space-y-3">
              {MOCK_RESULT.solutions.script.map((item, i) => (
                <div
                  key={i}
                  className="bg-[var(--background-light)] dark:bg-[var(--navy)]/60 p-3 rounded-lg border-l-4 border-orange-400"
                >
                  <p className="text-[11px] text-[var(--green-custom)] mb-1 font-bold">{item.label}</p>
                  <p className="text-sm italic dark:text-white/90">{item.text}</p>
                </div>
              ))}
            </div>
          </SolutionCard>

          {/* Environment Guide */}
          <SolutionCard
            icon="home_work"
            iconColor="text-green-500"
            iconBg="bg-green-500/10"
            title="환경 · 루틴 가이드"
          >
            <ul className="space-y-3">
              {MOCK_RESULT.solutions.environment.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon name="check_circle" size="sm" className="text-green-500 mt-0.5" />
                  <p className="text-sm text-[var(--green-custom)] dark:text-white/80">{item}</p>
                </li>
              ))}
            </ul>
          </SolutionCard>

          {/* Parent Care */}
          <SolutionCard
            icon="self_care"
            iconColor="text-purple-500"
            iconBg="bg-purple-500/10"
            title="부모 멘탈 케어"
          >
            <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">
              <p className="text-sm text-[var(--navy)] dark:text-white leading-relaxed text-center font-medium italic">
                {MOCK_RESULT.solutions.parentCare}
              </p>
            </div>
          </SolutionCard>
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--background-light)] dark:bg-[var(--background-dark)] border-t border-gray-100 dark:border-gray-800 ios-bottom-padding">
        <div className="max-w-md mx-auto space-y-3">
          <Button variant="primary" size="md" fullWidth icon={<Icon name="file_download" size="sm" />}>
            보고서 PDF 다운로드
          </Button>
          <Link href="/share" className="block">
            <Button variant="secondary" size="md" fullWidth icon={<Icon name="mail" size="sm" />}>
              이메일로 발송하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SolutionCard({
  icon,
  iconColor,
  iconBg,
  title,
  children,
}: {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[var(--navy)]/40 rounded-2xl p-5 ios-shadow border border-[var(--green-custom)]/10">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
          <Icon name={icon} size="sm" />
        </div>
        <h3 className="text-[var(--navy)] dark:text-white font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
