'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Icon } from '@/components/ui/Icon';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-32">
      <Navbar title="기질×사주 분석" />

      {/* Hero Section */}
      <header className="px-5 pt-8 pb-6 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--deep-green)] dark:text-[var(--primary)] text-[11px] font-bold mb-4">
          <Icon name="verified" size="sm" className="font-bold" />
          SCIENTIFIC & TRADITIONAL
        </div>

        {/* Title */}
        <h1 className="text-[var(--navy)] dark:text-white text-[28px] font-black leading-tight tracking-tight mb-4">
          아이 기질 × 사주 통합 분석
          <br />
          <span className="text-[var(--primary)]">우리 가족을 위한 맞춤 양육 가이드</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-400 text-base font-medium leading-relaxed mb-8">
          10분 설문으로 전문 상담센터 수준의
          <br />
          리포트를 받아보세요.
        </p>

        {/* Hero Image */}
        <div className="w-full relative rounded-2xl overflow-hidden aspect-[4/3] mb-8 ios-shadow">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&auto=format&fit=crop&q=80")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-4 w-full mb-8">
          <FeatureCard
            icon="psychology"
            title="과학적 기질 진단"
            description="CBQ 기반 정교한 심리 분석"
          />
          <FeatureCard
            icon="auto_awesome"
            title="전통 명리 솔루션"
            description="타고난 기운과 성향의 조화"
          />
          <FeatureCard
            icon="auto_graph"
            title="맞춤 훈육 가이드"
            description="상담센터 수준의 상세 솔루션"
          />
        </div>

        {/* CTA Buttons */}
        <div className="w-full space-y-3">
          <Link href="/intake" className="block">
            <Button variant="primary" size="lg" fullWidth badge="$1">
              지금 접수하고 리포트 받기
            </Button>
          </Link>
          <Button variant="secondary" size="md" fullWidth>
            샘플 리포트 미리보기
          </Button>

          {/* Social Proof */}
          <div className="pt-2">
            <p className="text-[13px] text-gray-600 dark:text-gray-400 font-medium flex items-center justify-center gap-1.5">
              <Icon name="group" size="sm" className="text-[var(--primary)]" />
              이미 12,430명의 부모님이 리포트를 확인했습니다
            </p>
            <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-tight">
              CBQ, Goodness of Fit 이론 기반
            </p>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-900/40 py-10 px-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3">
            <p className="text-2xl font-black text-[var(--navy)] dark:text-white">12K+</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold">누적 분석</p>
          </div>
          <div className="text-center p-3 border-x border-gray-200 dark:border-gray-800">
            <p className="text-2xl font-black text-[var(--navy)] dark:text-white">98%</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold">만족도</p>
          </div>
          <div className="text-center p-3">
            <p className="text-2xl font-black text-[var(--navy)] dark:text-white">4.9</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold">평균 평점</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 px-5">
        <h2 className="text-xl font-black mb-6 text-center">부모님들의 실제 후기</h2>
        <div className="flex flex-col gap-4">
          <ReviewCard
            content="아이의 고집이 왜 센지 몰랐는데, 사주와 기질을 동시에 분석해보니 비로소 이해가 갔어요. 알려주신 훈육법대로 하니 아이와의 마찰이 확 줄었습니다."
            author="김지현 님 (5세 여아)"
          />
          <ReviewCard
            content="남편과 아이의 궁합이 왜 안 맞는지 늘 궁금했는데, 에너지 레벨 차이라는 걸 알고 나니 중재가 수월해졌어요."
            author="박서연 님 (4세 남아)"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5 text-center bg-gray-50 dark:bg-transparent">
        <div className="flex justify-center gap-8 mb-6 opacity-40">
          <Icon name="verified_user" size="lg" />
          <Icon name="lock" size="lg" />
          <Icon name="credit_card" size="lg" />
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          © 2024 기질과 사주 육아 코칭. All rights reserved.
          <br />
          본 분석 결과는 육아 참고용이며 의학적 진단을 대체할 수 없습니다.
        </p>
      </footer>

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-gradient-to-t from-[var(--background-light)] via-[var(--background-light)]/95 to-transparent dark:from-[var(--background-dark)] dark:via-[var(--background-dark)]/95 floating-cta">
        <div className="max-w-md mx-auto">
          <Link href="/intake">
            <Button
              variant="primary"
              size="md"
              fullWidth
              badge="$1"
              iconRight={<Icon name="arrow_forward" size="sm" />}
            >
              분석 시작하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ content, author }: { content: string; author: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ios-shadow">
      <div className="flex gap-0.5 text-[var(--primary)] mb-3">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} name="star" size="sm" />
        ))}
      </div>
      <p className="text-[14px] leading-relaxed text-gray-700 dark:text-gray-300 mb-4 font-medium">
        "{content}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
          <Icon name="person" size="sm" className="text-[var(--primary)]" />
        </div>
        <span className="text-xs font-bold">{author}</span>
      </div>
    </div>
  );
}
