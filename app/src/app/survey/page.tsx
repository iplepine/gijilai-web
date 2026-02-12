'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { CHILD_QUESTIONS, PARENT_QUESTIONS, PARENTING_STYLE_QUESTIONS } from '@/data/questions';

type SurveyModule = 'child' | 'parent' | 'parenting';

export default function SurveyPage() {
  const router = useRouter();
  const {
    intake,
    cbqResponses,
    atqResponses,
    parentingResponses,
    setCbqResponse,
    setAtqResponse,
    setParentingResponse
  } = useAppStore();

  const [currentModule, setCurrentModule] = useState<SurveyModule>('child');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [transitionType, setTransitionType] = useState<'toParent' | 'toParenting' | 'finish' | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  // 현재 모듈에 따른 질문 목록과 응답 상태 가져오기
  const getModuleData = useCallback(() => {
    switch (currentModule) {
      case 'child':
        return {
          questions: CHILD_QUESTIONS,
          responses: cbqResponses,
          setResponse: setCbqResponse,
          title: '아이 기질',
          color: 'var(--primary)',
          nextModule: 'parent' as SurveyModule
        };
      case 'parent':
        return {
          questions: PARENT_QUESTIONS,
          responses: atqResponses,
          setResponse: setAtqResponse,
          title: '부모 기질',
          color: '#FFB5A7', // Soft Coral/Earth tone
          nextModule: 'parenting' as SurveyModule
        };
      case 'parenting':
        return {
          questions: PARENTING_STYLE_QUESTIONS,
          responses: parentingResponses,
          setResponse: setParentingResponse,
          title: '양육 태도',
          color: '#A8D5BA', // Soft Green
          nextModule: null
        };
    }
  }, [currentModule, cbqResponses, atqResponses, parentingResponses, setCbqResponse, setAtqResponse, setParentingResponse]);

  const { questions, responses, setResponse, title, color } = getModuleData();
  const currentQuestion = questions[currentIndex];
  const currentAnswer = responses[String(currentQuestion?.id)];

  // 진행률 계산
  const totalQuestions = CHILD_QUESTIONS.length + PARENT_QUESTIONS.length + PARENTING_STYLE_QUESTIONS.length;
  const answeredCount =
    Object.keys(cbqResponses).length +
    Object.keys(atqResponses).length +
    Object.keys(parentingResponses).length;
  const progress = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));

  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // 모듈 완료
      if (currentModule === 'child') {
        setTransitionType('finish');
        setShowTransitionModal(true);
      } else {
        // 원래 로직 유지 (확장 대비 - 현재는 사용 안 함)
        if (currentModule === 'parent') {
          setTransitionType('toParenting');
          setShowTransitionModal(true);
        } else {
          setTransitionType('finish');
          setShowTransitionModal(true);
        }
      }
    }
  }, [currentIndex, questions.length, currentModule]);

  const handleSelect = useCallback((idx: number) => {
    // idx is 0-4 (array index), convert to 1-5 score
    const score = idx + 1;
    setResponse(String(currentQuestion.id), score);

    // Auto advance with delay
    setTimeout(() => {
      goToNext();
    }, 300);
  }, [setResponse, currentQuestion?.id, goToNext]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      // 모듈 간 뒤로가기
      if (currentModule === 'parent') {
        setCurrentModule('child');
        setCurrentIndex(CHILD_QUESTIONS.length - 1);
      } else if (currentModule === 'parenting') {
        setCurrentModule('parent');
        setCurrentIndex(PARENT_QUESTIONS.length - 1);
      } else {
        setShowExitModal(true);
      }
    }
  }, [currentIndex, currentModule]);

  const handleTransitionConfirm = () => {
    setShowTransitionModal(false);
    if (transitionType === 'toParent') {
      setCurrentModule('parent');
      setCurrentIndex(0);
      window.scrollTo(0, 0);
    } else if (transitionType === 'toParenting') {
      setCurrentModule('parenting');
      setCurrentIndex(0);
      window.scrollTo(0, 0);
    } else if (transitionType === 'finish') {
      router.push('/payment'); // or /result
    }
    setTransitionType(null);
  };

  const handleExit = () => {
    router.push('/');
  };

  // Prevent accidental close
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

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900">
      <Navbar title={title} showBack onBackClick={handlePrev} />

      {/* Progress Bar & Module Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-[56px] z-10">
        <div className="px-4 py-3">
          {/* Module Indicators (Hidden for single module mode) */}
          {/* 
          <div className="flex gap-2 mb-3">
             {['child', 'parent', 'parenting'].map((mod, idx) => {
               const isActive = currentModule === mod;
               const isCompleted = 
                 (mod === 'child' && currentModule !== 'child') ||
                 (mod === 'parent' && currentModule === 'parenting');
               
               let label = '';
               if (mod === 'child') label = '1. 아이';
               if (mod === 'parent') label = '2. 부모';
               if (mod === 'parenting') label = '3. 양육';

               return (
                 <div 
                   key={mod}
                   className={`flex-1 text-center py-1.5 rounded-full text-[11px] font-bold transition-all ${
                     isActive 
                       ? 'bg-primary text-white shadow-md' 
                       : isCompleted
                         ? 'bg-green-100 text-green-700'
                         : 'bg-slate-100 text-slate-400'
                   }`}
                 >
                   {isCompleted && <span className="mr-1">✓</span>}
                   {label}
                 </div>
               );
             })}
          </div>
          */}

          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-semibold text-slate-500">
              문항 {currentIndex + 1} <span className="text-slate-300">/</span> {questions.length}
            </span>
            <span className="text-xs font-bold text-primary">{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 px-5 py-6 max-w-2xl mx-auto w-full pb-24">
        {/* Context Card */}
        <div className="mb-6 animate-fade-in-up">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold mb-3">
            {currentModule === 'child' ? `${intake.childName || '아이'}의 행동` :
              currentModule === 'parent' ? '나(부모)의 성향' : '양육 상황'}
          </div>

          <h2 className="text-[17px] font-bold text-slate-800 dark:text-white leading-relaxed whitespace-pre-line">
            <span className="text-primary mr-1">Q.</span>
            {currentQuestion.context}
          </h2>
        </div>

        {/* Choices (BARS) */}
        <div className="space-y-3">
          {currentQuestion.choices?.map((choice, idx) => {
            const score = idx + 1; // 1-based score
            const isSelected = currentAnswer === score;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden group ${isSelected
                  ? 'border-primary bg-primary/5 shadow-md scale-[1.01]'
                  : 'border-white dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors
                    ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary'}
                  `}>
                    {idx + 1}
                  </div>
                  <span className={`text-[15px] leading-snug ${isSelected ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                    {choice}
                  </span>
                </div>

                {/* Selection Ripple/Fill Effect could go here */}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation (Safe Area) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 pb-8 z-20">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={handlePrev} className="text-slate-400 hover:text-slate-600">
            <Icon name="arrow_back" size="sm" className="mr-1" /> 이전
          </Button>

          {/* Skip / Next could go here if needed, but we auto-advance */}
          <div className="text-[10px] text-slate-300">
            Aina Garden Temperament Test
          </div>
        </div>
      </div>

      {/* Transition Modal */}
      {showTransitionModal && transitionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
                <span className="text-4xl">
                  {transitionType === 'toParent' ? '🌱' :
                    transitionType === 'toParenting' ? '🏡' : '🎉'}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {transitionType === 'toParent' ? '아이 기질 검사 완료!' :
                  transitionType === 'toParenting' ? '부모 기질 검사 완료!' : '모든 검사가 끝났어요!'}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                {transitionType === 'toParent' ? (
                  <>이제 <strong>부모님(본인)</strong>의 기질을 알아볼까요?<br />아이와 얼마나 잘 맞는지 분석해드려요.</>
                ) : transitionType === 'toParenting' ? (
                  <>마지막으로 <strong>평소 양육 스타일</strong>을 체크할게요.<br />구체적인 육아 솔루션이 제공됩니다.</>
                ) : (
                  <>수고하셨습니다!<br />이제 우리 가족만의 <strong>특별한 정원</strong>을 보러 가볼까요?</>
                )}
              </p>

              <Button size="lg" fullWidth onClick={handleTransitionConfirm} className="rounded-2xl py-4 text-lg shadow-lg shadow-primary/30">
                {transitionType === 'finish' ? '결과 보러 가기' : '다음 단계로'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-xs w-full shadow-xl">
            <h3 className="text-lg font-bold text-center mb-2">잠깐! 나가시겠어요?</h3>
            <p className="text-sm text-center text-slate-500 mb-6">진행 중인 내용은 저장되지만,<br />완료하지 않으면 결과를 볼 수 없어요.</p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowExitModal(false)}>계속 하기</Button>
              <Button variant="ghost" fullWidth onClick={handleExit} className="text-red-500 bg-red-50 hover:bg-red-100">그만두기</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
