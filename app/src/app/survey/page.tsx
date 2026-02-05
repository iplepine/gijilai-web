'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { CBQ_QUESTIONS, ATQ_QUESTIONS, LIKERT_OPTIONS, NA_OPTION } from '@/lib/surveyQuestions';

type SurveyType = 'cbq' | 'atq';

export default function SurveyPage() {
  const router = useRouter();
  const { intake, cbqResponses, atqResponses, setCbqResponse, setAtqResponse } = useAppStore();

  const [surveyType, setSurveyType] = useState<SurveyType>('cbq');
  const [currentIndex, setCurrentIndex] = useState(0);

  const questions = surveyType === 'cbq' ? CBQ_QUESTIONS : ATQ_QUESTIONS;
  const responses = surveyType === 'cbq' ? cbqResponses : atqResponses;
  const setResponse = surveyType === 'cbq' ? setCbqResponse : setAtqResponse;

  const currentQuestion = questions[currentIndex];
  const currentAnswer = responses[currentQuestion?.id];

  const totalQuestions = CBQ_QUESTIONS.length + ATQ_QUESTIONS.length;
  const answeredCount = Object.keys(cbqResponses).length + Object.keys(atqResponses).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const canGoNext = currentAnswer !== undefined;
  const isLastCbq = surveyType === 'cbq' && currentIndex === CBQ_QUESTIONS.length - 1;
  const isLastAtq = surveyType === 'atq' && currentIndex === ATQ_QUESTIONS.length - 1;

  const handleSelect = (value: number) => {
    setResponse(currentQuestion.id, value);
  };

  const handleNext = () => {
    if (isLastCbq) {
      // CBQ 끝나면 ATQ로 전환
      setSurveyType('atq');
      setCurrentIndex(0);
    } else if (isLastAtq) {
      // 모든 설문 완료
      router.push('/payment');
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0 && surveyType === 'atq') {
      // ATQ 첫 문항에서 뒤로 가면 CBQ 마지막으로
      setSurveyType('cbq');
      setCurrentIndex(CBQ_QUESTIONS.length - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const sectionLabel = surveyType === 'cbq' ? `아이 기질 (${currentIndex + 1}/${CBQ_QUESTIONS.length})` : `부모 기질 (${currentIndex + 1}/${ATQ_QUESTIONS.length})`;

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Navbar title="기질 설문" showBack />

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[var(--primary)]">{sectionLabel}</span>
          <span className="text-xs text-gray-500">{Math.round(progress)}% 완료</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-5 py-8">
        <div className="mb-8">
          {surveyType === 'cbq' && (
            <p className="text-xs text-[var(--green-custom)] mb-2">
              {intake.childName || '아이'}의 지난 6개월 행동을 떠올려 주세요
            </p>
          )}
          {surveyType === 'atq' && (
            <p className="text-xs text-[var(--green-custom)] mb-2">본인(부모)의 평소 모습을 떠올려 주세요</p>
          )}
          <h2 className="text-xl font-bold text-[var(--navy)] dark:text-white leading-relaxed">
            {currentQuestion?.text}
          </h2>
        </div>

        {/* Likert Scale */}
        <div className="space-y-3">
          {LIKERT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                currentAnswer === option.value
                  ? 'bg-[var(--primary)] text-[var(--navy)] font-bold'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[var(--primary)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option.value
                      ? 'border-[var(--navy)] bg-[var(--navy)]'
                      : 'border-gray-300'
                  }`}
                >
                  {currentAnswer === option.value && (
                    <Icon name="check" size="sm" className="text-white" />
                  )}
                </div>
                <span className="text-sm">{option.label}</span>
              </div>
            </button>
          ))}

          {/* N/A Option (CBQ only) */}
          {surveyType === 'cbq' && (
            <button
              onClick={() => handleSelect(NA_OPTION.value)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                currentAnswer === NA_OPTION.value
                  ? 'bg-gray-500 text-white font-bold'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === NA_OPTION.value
                      ? 'border-white bg-white'
                      : 'border-gray-400'
                  }`}
                >
                  {currentAnswer === NA_OPTION.value && (
                    <Icon name="check" size="sm" className="text-gray-500" />
                  )}
                </div>
                <span className="text-sm">{NA_OPTION.label}</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="p-4 bg-[var(--background-light)] dark:bg-[var(--background-dark)] border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrev}
            disabled={currentIndex === 0 && surveyType === 'cbq'}
            className="w-24"
          >
            이전
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleNext}
            disabled={!canGoNext}
          >
            {isLastAtq ? '설문 완료' : '다음'}
          </Button>
        </div>
      </div>
    </div>
  );
}
