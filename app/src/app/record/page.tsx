'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import BottomNav from '@/components/layout/BottomNav';

type TabType = 'CONSULT' | 'MISSION';

interface Consultation {
    id: string;
    created_at: string;
    category: string;
    problem_description: string;
    ai_options?: any[];
    user_response?: Record<string, string>;
    ai_prescription: {
        interpretation: string;
        chemistry: string;
        magicWord: string;
        actionItem: string;
    };
}

interface ActionItem {
    id: string;
    created_at: string;
    title: string;
    is_completed: boolean;
}

export default function RecordPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('CONSULT');
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [missions, setMissions] = useState<ActionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                fetchData();
            } else {
                setIsLoading(false);
            }
        }
    }, [user, authLoading]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Consultations
            const { data: consultData, error: consultError } = await supabase
                .from('consultations')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (consultError) throw consultError;
            setConsultations(consultData || []);

            // Fetch Action Items (Missions)
            const { data: missionData, error: missionError } = await supabase
                .from('action_items')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (missionError) throw missionError;
            setMissions(missionData || []);

        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMission = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('action_items')
                .update({ is_completed: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            setMissions(prev => prev.map(m =>
                m.id === id ? { ...m, is_completed: !currentStatus } : m
            ));
        } catch (error) {
            console.error('Error updating mission:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center">
            {/* Header */}
            <header className="w-full max-w-md px-6 py-8 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-text-main dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary fill-1">history_edu</span>
                        기록
                    </h1>
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1.5 bg-beige-main/30 dark:bg-black/20 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('CONSULT')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'CONSULT'
                            ? 'bg-white dark:bg-surface-dark text-primary shadow-sm'
                            : 'text-text-sub'
                            }`}
                    >
                        마음 상담기록
                    </button>
                    <button
                        onClick={() => setActiveTab('MISSION')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'MISSION'
                            ? 'bg-white dark:bg-surface-dark text-primary shadow-sm'
                            : 'text-text-sub'
                            }`}
                    >
                        실천 미션함
                    </button>
                </div>
            </header>

            <main className="w-full max-w-md p-6 pb-32">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                        <span className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></span>
                        <p className="text-sm font-medium text-text-sub">기록을 불러오고 있어요</p>
                    </div>
                ) : activeTab === 'CONSULT' ? (
                    /* Consultation List */
                    <div className="space-y-4">
                        {consultations.length > 0 ? (
                            consultations.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedConsult(item)}
                                    className="bg-white dark:bg-surface-dark rounded-[2rem] p-6 shadow-soft border border-primary/5 relative overflow-hidden group active:scale-[0.99] transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg uppercase tracking-wider mb-2 inline-block">
                                                {formatDate(item.created_at)}
                                            </span>
                                            <h3 className="text-lg font-bold text-text-main dark:text-white leading-tight">
                                                {item.category}
                                            </h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                            <span className="material-symbols-outlined text-[20px] fill-1">chat_bubble</span>
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-text-sub dark:text-gray-400 mb-5 line-clamp-2 leading-relaxed">
                                        {item.problem_description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 p-3 rounded-xl border border-primary/10">
                                        <span className="material-symbols-outlined text-[16px]">magic_button</span>
                                        <span className="truncate">마법 문장: {item.ai_prescription?.magicWord}</span>
                                    </div>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="text-5xl opacity-20">📜</div>
                                <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed">
                                    아직 상담 기록이 없어요.<br />
                                    마음 통역소에서 아이의 신호를 기록해보세요.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Mission List */
                    <div className="space-y-3">
                        {missions.length > 0 ? (
                            missions.map(mission => (
                                <div
                                    key={mission.id}
                                    onClick={() => toggleMission(mission.id, mission.is_completed)}
                                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer active:scale-[0.98] ${mission.is_completed
                                        ? 'bg-primary/5 border-primary/20 opacity-80'
                                        : 'bg-white dark:bg-surface-dark border-primary/5 shadow-soft hover:border-primary/20'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${mission.is_completed
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-beige-light dark:bg-black/20 text-primary'
                                        }`}>
                                        <span className="material-symbols-outlined text-[28px]">
                                            {mission.is_completed ? 'check_circle' : 'task_alt'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-[15px] font-bold leading-snug transition-all ${mission.is_completed ? 'text-text-sub line-through opacity-70' : 'text-text-main dark:text-white'
                                            }`}>
                                            {mission.title}
                                        </h4>
                                        <span className="text-[10px] text-text-sub font-medium opacity-60">
                                            {formatDate(mission.created_at)} 처방
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="text-5xl opacity-20">🎯</div>
                                <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed">
                                    실천 중인 미션이 없어요.<br />
                                    처방전의 미션을 등록해 실천해보세요!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Consultation Detail Modal */}
            {selectedConsult && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div
                        className="w-full max-w-md bg-background-light dark:bg-background-dark rounded-t-[3rem] max-h-[90vh] overflow-y-auto flex flex-col p-8 animate-in slide-in-from-bottom-10 duration-500 shadow-2xl relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedConsult(null)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="mb-8">
                            <span className="text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg uppercase tracking-wider mb-2 inline-block">
                                {formatDate(selectedConsult.created_at)} 상담
                            </span>
                            <h2 className="text-2xl font-bold text-text-main dark:text-white">{selectedConsult.category}</h2>
                        </div>

                        {/* Problem Context */}
                        <div className="bg-white dark:bg-surface-dark border border-primary/10 rounded-3xl p-6 mb-8 flex flex-col gap-2">
                            <div className="text-[11px] font-bold text-text-sub flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">psychology_alt</span>
                                접수된 고민 상황
                            </div>
                            <p className="text-[14px] leading-relaxed text-text-main dark:text-white italic">
                                "{selectedConsult.problem_description}"
                            </p>
                        </div>

                        {/* Dynamic Questions & Answers */}
                        {selectedConsult.ai_options && selectedConsult.ai_options.length > 0 && (
                            <div className="flex flex-col gap-6 mb-10">
                                <div className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    심층 문진 과정
                                </div>
                                {selectedConsult.ai_options.map((q: any) => (
                                    <div key={q.id} className="flex flex-col gap-3">
                                        <div className="flex gap-3 items-start pr-8">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <img src="/gijilai_icon.png" alt="" className="w-5 h-5 opacity-70" />
                                            </div>
                                            <div className="bg-primary/5 border border-primary/10 rounded-2xl rounded-tl-none p-4 text-[13px] text-text-main dark:text-white leading-relaxed">
                                                {q.text}
                                            </div>
                                        </div>
                                        {selectedConsult.user_response?.[q.id] && (
                                            <div className="flex gap-3 items-start pl-8 justify-end">
                                                <div className="bg-secondary text-white rounded-2xl rounded-tr-none p-4 text-[13px] font-bold shadow-soft">
                                                    {selectedConsult.user_response[q.id]}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Prescription Result */}
                        <div className="flex flex-col gap-6 mb-20">
                            <div className="text-sm font-bold text-primary flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                최종 마음 처방
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border-l-4 border-secondary shadow-soft space-y-4">
                                <div>
                                    <div className="text-[11px] font-bold text-secondary mb-1">아이의 속마음</div>
                                    <p className="text-[14px] leading-relaxed dark:text-gray-200">{selectedConsult.ai_prescription.interpretation}</p>
                                </div>
                                <div className="h-px bg-primary/5"></div>
                                <div>
                                    <div className="text-[11px] font-bold text-primary mb-1">우리의 케미스트리</div>
                                    <p className="text-[14px] leading-relaxed dark:text-gray-200">{selectedConsult.ai_prescription.chemistry}</p>
                                </div>
                                <div className="h-px bg-primary/5"></div>
                                <div className="bg-teal-500/5 p-4 rounded-xl border border-teal-500/20">
                                    <div className="text-[11px] font-bold text-teal-600 mb-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                        마법의 한마디
                                    </div>
                                    <p className="text-[15px] font-bold text-teal-700">"{selectedConsult.ai_prescription.magicWord}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Nav Spacer */}
            <div className="h-32"></div>
            <BottomNav />
        </div>
    );
}
