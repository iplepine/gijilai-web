'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 px-6 flex flex-col items-center text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl -z-10"></div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-primary/10 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[11px] font-black text-primary tracking-widest uppercase">990원으로 시작하는 맞춤 육아</span>
                </div>

                <h1 className="text-[40px] md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    아이의 신호를<br />
                    <span className="text-primary">올바르게 통역</span>하세요
                </h1>

                <p className="max-w-md text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-10 break-keep animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    과학적 기질 분석과 AI 전문가의 통찰을 결합하여<br />
                    우리 아이만을 위한 맞춤형 대화 처방을 제공합니다.
                </p>

                <div className="w-full max-w-sm flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <Link href="/login">
                        <Button size="lg" fullWidth className="h-16 rounded-2xl text-lg font-black shadow-2xl shadow-primary/30">
                            우리 아이 맞춤 가이드 받기 (990원)
                        </Button>
                    </Link>
                    <p className="text-[12px] text-slate-400">이미 12,482명의 부모님이 확인했습니다</p>
                </div>

                <div className="mt-16 relative w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-1000 delay-400">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur-xl"></div>
                    <img
                        src="/landing_hero.png"
                        alt="Gijilai Sample Report"
                        className="relative w-full rounded-[2.2rem] shadow-2xl border border-white/20"
                    />
                </div>
            </section>

            {/* Social Proof & Features */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-md mx-auto px-6 space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">왜 기질아이인가요?</h2>
                        <p className="text-slate-500 text-[15px] break-keep">부모의 94%가 아이의 행동 원인을 이해하면서 육아 스트레스가 줄었다고 응답했습니다.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <div className="flex gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center shrink-0">
                                <Icon name="psychology" className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">과학적 검증 데이터</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">CBQ/ATQ 기반의 신뢰도 높은 기질 테스트로 아이를 분석합니다.</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center shrink-0">
                                <Icon name="forum" className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">맞춤형 대화 처방</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">"안 돼" 대신 아이의 마음을 움직이는 [마법의 한마디]를 알려드려요.</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center shrink-0">
                                <Icon name="task_alt" className="text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">실천 가능한 액션 리스트</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">이론으로 끝나지 않고 매일 실천할 수 있는 작은 미션을 드립니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial / Community Section */}
            <section className="py-20 px-6 max-w-md mx-auto relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">우리는 같은 고민을 했어요</h2>
                        <div className="flex justify-center -space-x-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-primary/10 italic">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 break-keep">
                            "아이의 떼쓰기가 고집인 줄로만 알았는데, 기질 분석을 통해 감각적으로 예민하다는 걸 알게 됐어요. 솔루션대로 반응했더니 아이의 눈빛이 달라지더라고요."
                        </p>
                        <span className="text-[13px] font-bold text-primary">— 5세 수아 엄마</span>
                    </div>

                    <img src="/social_proof.png" alt="Happy Families" className="w-full rounded-[2.5rem] shadow-lg opacity-80" />
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 bg-slate-900 text-center space-y-8 relative overflow-hidden mt-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white leading-tight mb-4">
                        늦기 전에 우리 아이의<br />
                        <span className="text-primary">진짜 마음</span>을 확인하세요
                    </h2>
                    <p className="text-slate-400 mb-10 text-sm">990원 단 한 번의 결제로 시작하는 육아의 혁명</p>
                    <Link href="/login" className="w-full max-w-xs mx-auto block">
                        <Button size="lg" fullWidth className="h-16 rounded-2xl bg-white text-slate-900 font-black hover:bg-slate-100 transition-colors">
                            지금 바로 분석 시작하기
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 text-center border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale">
                    <img src="/gijilai_icon.png" alt="기질아이" className="w-6 h-6 object-contain" />
                    <span className="text-lg font-logo tracking-widest text-primary dark:text-white">기질아이</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tighter">
                    © 2026 GIJILAI. ALL RIGHTS RESERVED.<br />
                    본 서비스는 의학적 진단을 대체할 수 없습니다.
                </p>
            </footer>
        </div>
    );
}
