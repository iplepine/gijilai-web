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

    if (!intake.childName.trim()) newErrors.childName = '이름을 입력해주세요';
    if (!intake.gender) newErrors.gender = '성별을 선택해주세요';
    if (!intake.birthDate) newErrors.birthDate = '생년월일을 입력해주세요';
    if (!intake.birthTime) newErrors.birthTime = '태어난 시간을 선택해주세요';
    if (!intake.birthPlace.trim()) newErrors.birthPlace = '태어난 지역을 입력해주세요';
    if (!intake.privacyAgreed) newErrors.privacy = '개인정보 처리 방침에 동의해주세요';
    if (!intake.disclaimerAgreed) newErrors.disclaimer = '면책 고지에 동의해주세요';

    setErrors(newErrors);

    // 첫 번째 에러 필드로 스크롤
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const fieldMap: Record<string, string> = {
        childName: 'input-childName',
        gender: 'input-gender',
        birthDate: 'input-birthDate',
        birthTime: 'input-birthTime',
        birthPlace: 'input-birthPlace',
        privacy: 'input-privacy',
        disclaimer: 'input-disclaimer',
      };
      const elementId = fieldMap[firstErrorKey];
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus?.();
      }
    }

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
        {/* 아이 정보 섹션 */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--navy)] dark:text-white flex items-center gap-2">
            <Icon name="child_care" size="sm" className="text-[var(--primary)]" />
            아이 정보
          </h3>

          {/* 이름 */}
          <div id="input-childName">
            <label className="block text-xs font-medium text-gray-600 mb-2">이름 또는 닉네임</label>
            <input
              type="text"
              value={intake.childName}
              onChange={(e) => setIntake({ childName: e.target.value })}
              placeholder="예: 하율이"
              className={`w-full h-12 px-4 rounded-xl border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.childName ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
            />
            {errors.childName && <p className="text-xs text-red-500 mt-1">{errors.childName}</p>}
          </div>

          {/* 성별 */}
          <div id="input-gender">
            <label className="block text-xs font-medium text-gray-600 mb-2">성별</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIntake({ gender: 'male' })}
                className={`flex-1 h-12 rounded-xl border text-sm font-medium transition-all ${
                  intake.gender === 'male'
                    ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--navy)]'
                    : `bg-white dark:bg-gray-800 ${errors.gender ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`
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
                    : `bg-white dark:bg-gray-800 ${errors.gender ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`
                }`}
              >
                여아
              </button>
            </div>
            {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
          </div>

          {/* 생년월일 */}
          <div id="input-birthDate">
            <label className="block text-xs font-medium text-gray-600 mb-2">생년월일</label>
            <input
              type="date"
              value={intake.birthDate}
              onChange={(e) => setIntake({ birthDate: e.target.value })}
              className={`w-full h-12 px-4 rounded-xl border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.birthDate ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
            />
            {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>}
          </div>

          {/* 태어난 시간 */}
          <div id="input-birthTime">
            <label className="block text-xs font-medium text-gray-600 mb-2">태어난 시간 (시)</label>
            <select
              value={intake.birthTime}
              onChange={(e) => setIntake({ birthTime: e.target.value })}
              className={`w-full h-12 px-4 rounded-xl border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] appearance-none ${errors.birthTime ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
            >
              <option value="">시간을 선택하세요</option>
              <option value="unknown">정확히 모름</option>
              <option value="23:30">자시 (23:30~01:29)</option>
              <option value="01:30">축시 (01:30~03:29)</option>
              <option value="03:30">인시 (03:30~05:29)</option>
              <option value="05:30">묘시 (05:30~07:29)</option>
              <option value="07:30">진시 (07:30~09:29)</option>
              <option value="09:30">사시 (09:30~11:29)</option>
              <option value="11:30">오시 (11:30~13:29)</option>
              <option value="13:30">미시 (13:30~15:29)</option>
              <option value="15:30">신시 (15:30~17:29)</option>
              <option value="17:30">유시 (17:30~19:29)</option>
              <option value="19:30">술시 (19:30~21:29)</option>
              <option value="21:30">해시 (21:30~23:29)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">사주 분석에 필요합니다 (2시간 단위로 선택)</p>
            {errors.birthTime && <p className="text-xs text-red-500 mt-1">{errors.birthTime}</p>}
          </div>

          {/* 태어난 지역 */}
          <div id="input-birthPlace">
            <label className="block text-xs font-medium text-gray-600 mb-2">태어난 지역</label>
            <input
              type="text"
              value={intake.birthPlace}
              onChange={(e) => setIntake({ birthPlace: e.target.value })}
              placeholder="예: 서울, 부산, 해외(미국)"
              className={`w-full h-12 px-4 rounded-xl border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${errors.birthPlace ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
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

        {/* 약관 동의 섹션 - 마지막에 배치 */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[var(--navy)] dark:text-white flex items-center gap-2">
            <Icon name="verified_user" size="sm" className="text-[var(--primary)]" />
            약관 동의
          </h3>

          <label id="input-privacy" className={`flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border cursor-pointer ${errors.privacy ? 'border-red-400' : 'border-gray-100 dark:border-gray-700'}`}>
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

          <label id="input-disclaimer" className={`flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border cursor-pointer ${errors.disclaimer ? 'border-red-400' : 'border-gray-100 dark:border-gray-700'}`}>
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
