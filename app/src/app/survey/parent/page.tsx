'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSurveyStore } from '../../../store/surveyStore';
import { PARENT_QUESTIONS } from '../../../data/questions';
import { SurveyLayout } from '../../../components/survey/SurveyLayout';
import { QuestionCard } from '../../../components/survey/QuestionCard';

export default function ParentSurveyPage() {
    const router = useRouter();
    const {
        currentStep,
        answers,
        setAnswer,
        nextStep,
        prevStep,
        setSurveyType,
        getProgress,
        setStep
    } = useSurveyStore();

    const [showBridge, setShowBridge] = useState(true);

    const questions = PARENT_QUESTIONS;
    const currentQuestion = questions[currentStep - 1];
    const totalQuestions = questions.length;
    // Progress needs to be calculated relative to THIS survey or global? 
    // UX spec says bridge page separates them, so relative progress is fine.
    const progress = Math.round((currentStep / totalQuestions) * 100);

    useEffect(() => {
        // Only set type if strictly needed, but bridge logic might need careful handling of state
        if (showBridge) {
            // Initial state for this route
        }
    }, [showBridge]);

    const startParentSurvey = () => {
        setSurveyType('PARENT'); // Resets step to 1
        setShowBridge(false);
    };

    const handleAnswer = (score: number) => {
        if (!currentQuestion) return;
        setAnswer(currentQuestion.id, score);

        if (currentStep < totalQuestions) {
            setTimeout(() => nextStep(), 200);
        } else {
            setTimeout(() => router.push('/survey/parenting-style'), 200);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            prevStep();
        } else {
            // Go back to bridge if at step 1? Or back to child survey?
            // Simplifying: Go back to child survey end
            router.push('/survey/child');
        }
    }

    if (showBridge) {
        return (
            <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
                    <div className="text-5xl mb-6">🧬</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        아이 성향 파악 완료!
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        수고하셨습니다.<br />
                        이제 <strong>부모님 본인의 기질</strong>을 알아볼 차례입니다.<br />
                        <span className="text-sm text-gray-500 mt-2 block">(총 20문항)</span>
                    </p>
                    <button
                        onClick={startParentSurvey}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                    >
                        나의 기질 알아보기
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <SurveyLayout
            title="부모 기질 검사"
            progress={progress}
            onBack={handleBack}
        >
            <div className="w-full max-w-md py-6">
                <div className="mb-4 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                        Part 2. 나(부모) 편
                    </span>
                </div>
                <QuestionCard
                    question={currentQuestion}
                    currentAnswer={answers[currentQuestion.id]}
                    onAnswer={handleAnswer}
                />
            </div>
        </SurveyLayout>
    );
}
