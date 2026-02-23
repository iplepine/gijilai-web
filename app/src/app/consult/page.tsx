'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/store/useAppStore';

type Step = 'INPUT' | 'DIAGNOSTIC' | 'RESULT';

interface Question {
    id: string;
    text: string;
    type: 'CHOICE' | 'TEXT';
    options?: { id: string; text: string }[];
}

interface Prescription {
    interpretation: string;
    chemistry: string;
    magicWord: string;
    actionItem: string;
}

const CATEGORIES = [
    '외출 전 떼쓰기', '식사 거부', '수면 거부/지연',
    '장난감/동생 갈등', '공공장소 통제 불능', '분리 불안'
];

export default function ConsultPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { cbqResponses, atqResponses } = useAppStore();

    const [step, setStep] = useState<Step>('INPUT');
    const [isLoading, setIsLoading] = useState(false);

    // INPUT STATE
    const [category, setCategory] = useState('');
    const [problemDesc, setProblemDesc] = useState('');

    // DIAGNOSTIC STATE
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isFollowUpDone, setIsFollowUpDone] = useState(false);

    // RESULT STATE
    const [prescription, setPrescription] = useState<Prescription | null>(null);

    const handleStartDiagnostic = async () => {
        if (!category && !problemDesc) {
            alert('고민 카테고리나 내용을 적어주세요.');
            return;
        }

        const fullProblem = `[${category}] ${problemDesc}`;

        setIsLoading(true);
        try {
            const res = await fetch('/api/consult/questions/initial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ problem: fullProblem }),
            });

            if (!res.ok) throw new Error('Failed to fetch initial questions');

            const data = await res.json();
            setQuestions(data.questions);
            setStep('DIAGNOSTIC');
            setCurrentQuestionIndex(0);
        } catch (error) {
            console.error(error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = async (questionId: string, answer: string) => {
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Check if we need follow-up
            if (!isFollowUpDone) {
                await handleCheckFollowUp(newAnswers);
            } else {
                await handleGeneratePrescription(newAnswers);
            }
        }
    };

    const handleCheckFollowUp = async (currentAnswers: Record<string, string>) => {
        setIsLoading(true);
        try {
            const fullProblem = `[${category}] ${problemDesc}`;
            const res = await fetch('/api/consult/questions/followup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem: fullProblem,
                    firstRoundAnswers: currentAnswers
                }),
            });

            const data = await res.json();
            if (data.needsFollowUp && data.followUpQuestions && data.followUpQuestions.length > 0) {
                setQuestions(prev => [...prev, ...data.followUpQuestions]);
                setIsFollowUpDone(true);
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                await handleGeneratePrescription(currentAnswers);
            }
        } catch (error) {
            console.error(error);
            await handleGeneratePrescription(currentAnswers); // Fallback to results
        } finally {
            setIsLoading(false);
        }
    };

    const handleGeneratePrescription = async (allAnswers: Record<string, string>) => {
        setIsLoading(true);
        try {
            // Calculate archetypes
            let childArchetype = "알 수 없음 (기질 데이터 부족)";
            let parentArchetype = "알 수 없음 (기질 데이터 부족)";

            if (Object.keys(cbqResponses).length > 0) {
                const { TemperamentScorer } = await import('@/lib/TemperamentScorer');
                const { TemperamentClassifier } = await import('@/lib/TemperamentClassifier');
                const { CHILD_QUESTIONS } = await import('@/data/questions');

                const scores = TemperamentScorer.calculate(CHILD_QUESTIONS, cbqResponses as any);
                const result = TemperamentClassifier.analyze(scores, { NS: 50, HA: 50, RD: 50, P: 50 });
                childArchetype = `${result.label} (${result.seed.label})`;
            }

            if (Object.keys(atqResponses).length > 0) {
                const { TemperamentScorer } = await import('@/lib/TemperamentScorer');
                const { ParentClassifier } = await import('@/lib/ParentClassifier');
                const { PARENT_QUESTIONS } = await import('@/data/questions');

                const scores = TemperamentScorer.calculate(PARENT_QUESTIONS, atqResponses as any);
                const result = ParentClassifier.analyze(scores);
                parentArchetype = result.soilName;
            }

            const fullProblem = `[${category}] ${problemDesc}`;
            const res = await fetch('/api/consult/prescription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem: fullProblem,
                    answers: allAnswers,
                    childArchetype,
                    parentArchetype
                }),
            });

            if (!res.ok) throw new Error('Failed to generate prescription');

            const data = await res.json();
            setPrescription(data);
            setStep('RESULT');

            // Save history
            if (user) {
                const { data: children } = await supabase.from('children').select('id').eq('parent_id', user.id).limit(1);
                const childId = children?.[0]?.id || null;

                await supabase.from('consultations').insert({
                    user_id: user.id,
                    child_id: childId,
                    category,
                    problem_description: problemDesc,
                    ai_options: questions,
                    user_response: allAnswers,
                    selected_reaction_id: 'DYNAMIC_FLOW',
                    ai_prescription: data,
                    status: 'COMPLETED'
                });
            }
        } catch (error) {
            console.error(error);
            alert('처방전을 생성하는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveActionItem = async () => {
        if (!user || !prescription) return;
        try {
            const { data: children } = await supabase.from('children').select('id').eq('parent_id', user.id).limit(1);
            const childId = children?.[0]?.id || null;

            await supabase.from('action_items').insert({
                user_id: user.id,
                child_id: childId,
                title: prescription.actionItem,
                type: 'DAILY_MISSION'
            });

            alert('홈 미션으로 등록되었습니다!');
            router.push('/');
        } catch (error) {
            console.error(error);
            alert('미션 등록에 실패했습니다.');
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center">
            {/* Nav Header */}
            <div className="w-full max-w-md px-4 py-5 flex items-center bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md sticky top-0 z-20 border-b border-primary/5">
                <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
                </button>
                <div className="flex-1 text-center flex items-center justify-center gap-2">
                    <img src="/gijilai_icon.png" alt="" className="w-6 h-6 object-contain" />
                    <span className="font-logo text-lg text-primary dark:text-white">마음 통역소</span>
                </div>
                <div className="w-10"></div>
            </div>

            <main className="w-full max-w-md flex flex-col flex-1 p-6 pb-24">
                {step === 'INPUT' && (
                    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-text-main dark:text-white leading-tight">
                                양육자님,<br />오늘 어떤 일이 가장 힘드셨나요?
                            </h2>
                            <p className="text-sm text-text-sub dark:text-gray-400">아이의 기질에 딱 맞는 솔루션을 찾아드릴게요.</p>
                        </div>

                        <div>
                            <div className="text-sm font-bold text-primary dark:text-primary-light mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                고민 카테고리
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-4 py-3 rounded-2xl text-[13px] font-bold transition-all border ${category === cat
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                                            : 'bg-white dark:bg-surface-dark text-text-sub border-primary/10 hover:border-primary/30'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-bold text-primary dark:text-primary-light mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                상황 설명 (선택)
                            </div>
                            <textarea
                                value={problemDesc}
                                onChange={(e) => setProblemDesc(e.target.value)}
                                placeholder="예: 아침에 유치원 갈 시간이 다 됐는데 옷을 안 입겠다고 숨어버렸어요."
                                className="w-full h-40 p-5 text-[15px] rounded-3xl border border-primary/10 focus:outline-none focus:ring-4 focus:ring-primary/5 resize-none bg-white dark:bg-surface-dark dark:text-white transition-all shadow-inner"
                            />
                        </div>

                        <button
                            onClick={handleStartDiagnostic}
                            disabled={(!category && !problemDesc) || isLoading}
                            className={`w-full py-5 rounded-2xl text-white font-bold text-lg mt-4 transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${(!category && !problemDesc) || isLoading
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    <span>상황 분석 중...</span>
                                </>
                            ) : (
                                <>
                                    <span>상담 시작하기</span>
                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {step === 'DIAGNOSTIC' && currentQuestion && (
                    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-primary uppercase tracking-widest">Question {currentQuestionIndex + 1} / {questions.length}</span>
                                <div className="flex gap-1">
                                    {questions.map((_, i) => (
                                        <div key={i} className={`w-4 h-1 rounded-full transition-all ${i <= currentQuestionIndex ? 'bg-primary' : 'bg-primary/10'}`}></div>
                                    ))}
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-text-main dark:text-white leading-snug">
                                {currentQuestion.text}
                            </h2>
                        </div>

                        {currentQuestion.type === 'CHOICE' ? (
                            <div className="flex flex-col gap-3">
                                {currentQuestion.options?.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleAnswer(currentQuestion.id, opt.text)}
                                        className="w-full text-left p-6 rounded-[2rem] border-2 border-primary/5 bg-white dark:bg-surface-dark hover:border-secondary hover:bg-secondary/5 transition-all active:scale-[0.98] group"
                                    >
                                        <div className="font-bold leading-relaxed text-[15px] text-text-main dark:text-white group-hover:text-secondary">
                                            {opt.text}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <textarea
                                    className="w-full h-40 p-5 text-[15px] rounded-3xl border border-primary/10 focus:outline-none focus:ring-4 focus:ring-primary/5 resize-none bg-white dark:bg-surface-dark dark:text-white transition-all shadow-inner"
                                    placeholder="자유롭게 적어주세요."
                                    onBlur={(e) => {
                                        if (e.target.value) handleAnswer(currentQuestion.id, e.target.value);
                                    }}
                                />
                                <button
                                    onClick={(e) => {
                                        const textarea = (e.currentTarget.previousSibling as HTMLTextAreaElement);
                                        if (textarea.value) handleAnswer(currentQuestion.id, textarea.value);
                                    }}
                                    className="w-full py-4 rounded-2xl bg-primary text-white font-bold"
                                >
                                    다음으로
                                </button>
                            </div>
                        )}

                        {isLoading && (
                            <div className="fixed inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="font-bold text-primary">AI가 답변을 분석 중입니다...</p>
                            </div>
                        )}
                    </div>
                )}

                {step === 'RESULT' && prescription && (
                    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="flex flex-col items-center text-center py-4">
                            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-secondary text-3xl fill-1">verified_user</span>
                            </div>
                            <h2 className="text-2xl font-bold text-text-main dark:text-white">오늘의 마음 처방전</h2>
                            <p className="text-sm text-text-sub mt-2">아이의 기질과 상황을 종합한 최선의 솔루션입니다.</p>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] p-8 shadow-card border border-primary/5 dark:border-white/5 flex flex-col gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-secondary">
                                    <span className="material-symbols-outlined text-xl">psychology</span>
                                    <span className="font-bold text-sm tracking-tight">아이의 속마음 통역</span>
                                </div>
                                <div className="text-[15px] text-text-main dark:text-gray-200 leading-relaxed bg-secondary/5 p-5 rounded-2xl border border-secondary/10">
                                    {prescription.interpretation}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-primary dark:text-primary-light">
                                    <span className="material-symbols-outlined text-xl">diversity_2</span>
                                    <span className="font-bold text-sm tracking-tight">우리의 케미스트리</span>
                                </div>
                                <div className="text-[15px] text-text-main dark:text-gray-200 leading-relaxed bg-primary/5 p-5 rounded-2xl border border-primary/10">
                                    {prescription.chemistry}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-teal-600">
                                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                    <span className="font-bold text-sm tracking-tight">마법의 한마디</span>
                                </div>
                                <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-2xl shadow-lg shadow-teal-500/20">
                                    <span className="font-bold text-white leading-relaxed text-[16px]">
                                        "{prescription.magicWord}"
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary dark:bg-primary-dark rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden mt-4">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4 opacity-90">
                                    <span className="material-symbols-outlined text-xl">task_alt</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">Daily Mission</span>
                                </div>
                                <div className="font-bold text-xl leading-snug mb-8">
                                    {prescription.actionItem}
                                </div>
                                <button
                                    onClick={handleSaveActionItem}
                                    className="w-full bg-white text-primary font-bold py-4 rounded-2xl hover:bg-beige-light transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <span>미션으로 등록하고 실천하기</span>
                                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
