'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { Concern, CONCERN_LABELS } from '@/types';

export default function IntakePage() {
  const router = useRouter();
  const { intake, setIntake } = useAppStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const concerns: Concern[] = ['sleep', 'eating', 'tantrum', 'social', 'learning'];

  const toggleConcern = (concern: Concern) => {
    const current = intake.concerns;
    if (current.includes(concern)) {
      setIntake({ concerns: current.filter((c) => c !== concern) });
    } else if (current.length < 3) {
      setIntake({ concerns: [...current, concern] });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!intake.privacyAgreed) newErrors.privacy = '개인정보 처리 방침에 동의해주세요';
    if (!intake.disclaimerAgreed) newErrors.disclaimer = '면책 고지에 동의해주세요';
    if (!intake.childName.trim()) newErrors.childName = '이름을 입력해주세요';
    if (!intake.gender) newErrors.gender = '성별을 선택해주세요';
    if (!intake.birthDate) newErrors.birthDate = '생년월일을 입력해주세요';
    if (!intake.birthTime) newErrors.birthTime = '태어난 시간을 입력해주세요';
    if (!intake.birthPlace.trim()) newErrors.birthPlace = '태어난 지역을 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      router.push('/survey');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-24">
      <Navbar title="기본 정보 입력" showBack />

      <div className="flex-1 px-5 py-6 space-y-6">
        {/* 약관 동의 섹션 */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--navy)] dark:text-white flex items-center gap-2">
            <Icon name="verified_user" size="sm" className="text-[var(--primary)]" />
            약관 동의
          </h3>

          <label className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={intake.privacyAgreed}
              onChange={(e) => setIntake({ privacyAgreed: e.target.checked })}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <div>
              <p className="text-sm font-medium">[필수] 개인정보 처리 방침 동의</p>
              <p className="text-xs text-gray-500 mt-1">수집된 정보는 분석 목적으로만 사용됩니다.</p>
            </div>
          </label>
          {errors.privacy && <p className="text-xs text-red-500 px-1">{errors.privacy}</p>}

          <label className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={intake.disclaimerAgreed}
              onChange={(e) => setIntake({ disclaimerAgreed: e.target.checked })}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <div>
              <p className="text-sm font-medium">[필수] 면책 고지 확인</p>
              <p className="text-xs text-gray-500 mt-1">
                본 분석은 의학적 진단이 아니며, 육아 참고용입니다.
              </p>
            </div>
          </label>
          {errors.disclaimer && <p className="text-xs text-red-500 px-1">{errors.disclaimer}</p>}
        </section>

        {/* 아이 정보 섹션 */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--navy)] dark:text-white flex items-center gap-2">
            <Icon name="child_care" size="sm" className="text-[var(--primary)]" />
            아이 정보
          </h3>

          {/* 이름 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">이름 또는 닉네임</label>
            <input
              type="text"
              value={intake.childName}
              onChange={(e) => setIntake({ childName: e.target.value })}
              placeholder="예: 하율이"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            {errors.childName && <p className="text-xs text-red-500 mt-1">{errors.childName}</p>}
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">성별</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIntake({ gender: 'male' })}
                className={`flex-1 h-12 rounded-xl border text-sm font-medium transition-all ${
                  intake.gender === 'male'
                    ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--navy)]'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                남아
              </button>
              <button
                type="button"
                onClick={() => setIntake({ gender: 'female' })}
                className={`flex-1 h-12 rounded-xl border text-sm font-medium transition-all ${
                  intake.gender === 'female'
                    ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--navy)]'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                여아
              </button>
            </div>
            {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">생년월일</label>
            <input
              type="date"
              value={intake.birthDate}
              onChange={(e) => setIntake({ birthDate: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>}
          </div>

          {/* 태어난 시간 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">태어난 시간</label>
            <input
              type="time"
              value={intake.birthTime}
              onChange={(e) => setIntake({ birthTime: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <p className="text-xs text-gray-400 mt-1">사주 분석에 필요합니다 (모르면 대략적인 시간)</p>
            {errors.birthTime && <p className="text-xs text-red-500 mt-1">{errors.birthTime}</p>}
          </div>

          {/* 태어난 지역 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">태어난 지역</label>
            <input
              type="text"
              value={intake.birthPlace}
              onChange={(e) => setIntake({ birthPlace: e.target.value })}
              placeholder="예: 서울, 부산, 해외(미국)"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <p className="text-xs text-gray-400 mt-1">서머타임 보정에 사용됩니다</p>
            {errors.birthPlace && <p className="text-xs text-red-500 mt-1">{errors.birthPlace}</p>}
          </div>
        </section>

        {/* 양육 고민 섹션 */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--navy)] dark:text-white flex items-center gap-2">
            <Icon name="help_outline" size="sm" className="text-[var(--primary)]" />
            양육 고민 (최대 3개)
          </h3>
          <p className="text-xs text-gray-500">선택하신 고민에 맞는 솔루션을 우선 제공해드려요.</p>

          <div className="flex flex-wrap gap-2">
            {concerns.map((concern) => (
              <button
                key={concern}
                type="button"
                onClick={() => toggleConcern(concern)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  intake.concerns.includes(concern)
                    ? 'bg-[var(--primary)] text-[var(--navy)]'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600'
                }`}
              >
                {CONCERN_LABELS[concern]}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--background-light)] dark:bg-[var(--background-dark)] border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto">
          <Button variant="primary" size="md" fullWidth onClick={handleSubmit}>
            다음: 기질 설문 시작
          </Button>
        </div>
      </div>
    </div>
  );
}
