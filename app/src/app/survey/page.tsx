'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // 먼저 필요한 값들 계산
  const questions = surveyType === 'cbq' ? CBQ_QUESTIONS : ATQ_QUESTIONS;
  const responses = surveyType === 'cbq' ? cbqResponses : atqResponses;
  const setResponse = surveyType === 'cbq' ? setCbqResponse : setAtqResponse;

  const currentQuestion = questions[currentIndex];
  const currentAnswer = responses[currentQuestion?.id];

  const totalQuestions = CBQ_QUESTIONS.length + ATQ_QUESTIONS.length;
  const answeredCount = Object.keys(cbqResponses).length + Object.keys(atqResponses).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const isLastCbq = surveyType === 'cbq' && currentIndex === CBQ_QUESTIONS.length - 1;
  const isLastAtq = surveyType === 'atq' && currentIndex === ATQ_QUESTIONS.length - 1;

  const goToNext = useCallback(() => {
    if (isLastCbq) {
      setShowTransitionModal(true);
    } else if (isLastAtq) {
      router.push('/payment');
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLastCbq, isLastAtq, router]);

  const handleSelect = useCallback((value: number) => {
    setResponse(currentQuestion?.id, value);
    if (value !== 0) {
      setTimeout(() => goToNext(), 250);
    }
  }, [setResponse, currentQuestion?.id, goToNext]);

  const handleNA = useCallback(() => {
    setResponse(currentQuestion?.id, 0);
    setTimeout(() => goToNext(), 250);
  }, [setResponse, currentQuestion?.id, goToNext]);

  const handlePrev = useCallback(() => {
    if (currentIndex === 0 && surveyType === 'atq') {
      setSurveyType('cbq');
      setCurrentIndex(CBQ_QUESTIONS.length - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (currentIndex === 0 && surveyType === 'cbq') {
      setShowExitModal(true);
    }
  }, [currentIndex, surveyType]);

  // 페이지 이탈 시 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (answeredCount > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answeredCount]);

  // 키보드 숫자키 입력 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showTransitionModal || showExitModal) return;

      const key = e.key;
      if (key >= '1' && key <= '7') {
        handleSelect(parseInt(key));
      }
      if ((key === '0' || key === 'n' || key === 'N') && surveyType === 'cbq') {
        handleNA();
      }
      if (key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTransitionModal, showExitModal, surveyType, handleSelect, handleNA, handlePrev]);

  const handleTransitionConfirm = () => {
    setShowTransitionModal(false);
    setSurveyType('atq');
    setCurrentIndex(0);
  };

  const handleExit = () => {
    router.push('/intake');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Navbar title="기질 설문" showBack />

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        {/* 섹션 탭 */}
        <div className="flex gap-2 mb-3">
          <div className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
            surveyType === 'cbq'
              ? 'bg-[var(--primary)] text-[var(--navy)]'
              : Object.keys(cbqResponses).length === CBQ_QUESTIONS.length
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-400'
          }`}>
            {Object.keys(cbqResponses).length === CBQ_QUESTIONS.length && surveyType === 'atq' ? '✓ ' : ''}
            1. 아이 기질
          </div>
          <div className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
            surveyType === 'atq'
              ? 'bg-[var(--primary)] text-[var(--navy)]'
              : 'bg-gray-100 text-gray-400'
          }`}>
            2. 부모 기질
          </div>
        </div>

        {/* 상세 진행률 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">
            {surveyType === 'cbq' ? '아이' : '부모'} 문항 {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-xs text-[var(--primary)] font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-5 py-8">
        <div className="mb-8">
          {/* 이미 답변한 문항 표시 */}
          {currentAnswer !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-600 text-[11px] font-bold mb-3">
              <Icon name="check_circle" size="sm" />
              답변 완료 (수정 가능)
            </div>
          )}
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

        {/* Likert Scale - 숫자 버튼 한 줄 */}
        <div className="space-y-4">
          {/* 점수 버튼 */}
          <div className="flex gap-2 justify-between">
            {LIKERT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`flex-1 aspect-square max-w-12 rounded-xl text-lg font-bold transition-all ${
                  currentAnswer === option.value
                    ? 'bg-[var(--primary)] text-[var(--navy)] scale-110 shadow-lg shadow-[var(--primary)]/30'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 hover:border-[var(--primary)] hover:text-[var(--primary)]'
                }`}
              >
                {option.value}
              </button>
            ))}
          </div>

          {/* 라벨 */}
          <div className="flex justify-between text-xs text-gray-500 px-1">
            <span>전혀 아님</span>
            <span>보통</span>
            <span>매우 그럼</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 bg-[var(--background-light)] dark:bg-[var(--background-dark)] border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrev}
            className="w-24"
          >
            {currentIndex === 0 && surveyType === 'cbq' ? '나가기' : '이전'}
          </Button>
          {/* CBQ에서는 "해당 없음", ATQ에서는 빈 공간 */}
          {surveyType === 'cbq' ? (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleNA}
              className={currentAnswer === 0 ? 'ring-2 ring-gray-400' : ''}
            >
              해당 없음
            </Button>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>

      {/* 이탈 확인 모달 */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full ios-shadow space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon name="warning" size="lg" className="text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-[var(--navy)] dark:text-white mb-2">
                설문을 중단하시겠어요?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                지금까지 입력한 내용은 저장되어 있어요.
                <br />
                나중에 이어서 진행할 수 있습니다.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="md" fullWidth onClick={() => setShowExitModal(false)}>
                계속하기
              </Button>
              <Button variant="primary" size="md" fullWidth onClick={handleExit}>
                나가기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CBQ → ATQ 전환 모달 */}
      {showTransitionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full ios-shadow space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                <Icon name="family_restroom" size="lg" className="text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--navy)] dark:text-white mb-2">
                아이 설문 완료! 🎉
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                이제 <strong>부모님(본인)</strong>의 기질을 확인할 차례예요.
                <br />
                부모-자녀 궁합 분석에 사용됩니다.
              </p>
            </div>
            <Button variant="primary" size="md" fullWidth onClick={handleTransitionConfirm}>
              부모 설문 시작하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
