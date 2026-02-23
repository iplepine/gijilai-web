'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/layout/BottomNav';
import { db, UserProfile, ChildProfile, ReportData, SurveyData } from '@/lib/db';
import { GardenState } from '@/types/gardening';
import { TemperamentScorer } from '@/lib/TemperamentScorer';
import { TemperamentClassifier } from '@/lib/TemperamentClassifier';
import { ParentClassifier } from '@/lib/ParentClassifier';
import { CHILD_QUESTIONS, PARENT_QUESTIONS, PARENTING_STYLE_QUESTIONS } from '@/data/questions';
import { useSurveyStore } from '@/store/surveyStore';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { intake, cbqResponses, atqResponses, parentingResponses, isPaid, resetSurveyOnly, resetAll } = useAppStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [latestSurvey, setLatestSurvey] = useState<SurveyData | null>(null);
  const [parentSurvey, setParentSurvey] = useState<SurveyData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showSurveyIntro, setShowSurveyIntro] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gardening State
  // Gardening State
  const [garden, setGarden] = useState<GardenState>({
    level: 1,
    exp: 0,
    maxExp: 100,
    streak: 0,
    theme: '' as any, // Placeholder until real data
    plantType: '' as any, // Placeholder until real data
    stage: '' as any // Placeholder until real data
  });
  // Daily Action Checklist State
  const [dailyActions, setDailyActions] = useState({
    eyeContact: false,
    praise: false,
    skinship: false
  });
  const [loading, setLoading] = useState(true);

  // Derived Child Profile (DB first, then local intake store)
  const mainChild = useMemo(() => {
    if (children[0]) return children[0];
    if (intake.childName) {
      return {
        id: 'temporary-intake-id',
        name: intake.childName,
        birth_date: intake.birthDate,
        gender: (intake.gender || 'MALE').toUpperCase(),
        image_url: null,
      } as any as ChildProfile;
    }
    return null;
  }, [children, intake]);

  const childName = mainChild?.name || "우리 아이";

  // Derived Temperament (Parent = Soil, Child = Seed + Plant)
  const temperamentInfo = useMemo(() => {
    // Check local store responses first for immediate feedback
    const childAnswers = Object.keys(cbqResponses).length > 0
      ? cbqResponses
      : (latestSurvey?.answers as Record<string, number>);

    if (!childAnswers) return null;
    const scores = TemperamentScorer.calculate(CHILD_QUESTIONS, childAnswers as any);

    // Parent scores for soil context (defaults if not surveyed yet)
    let parentScores = { NS: 50, HA: 50, RD: 50, P: 50 };
    const parentAnswers = Object.keys(atqResponses).length > 0
      ? atqResponses
      : (parentSurvey?.answers as Record<string, number>);

    if (parentAnswers) {
      parentScores = TemperamentScorer.calculate(PARENT_QUESTIONS, parentAnswers as any);
    }

    const childResult = TemperamentClassifier.analyze(scores, parentScores);
    const parentResult = ParentClassifier.analyze(parentScores);

    return {
      child: childResult,
      parent: parentResult
    };
  }, [cbqResponses, atqResponses, latestSurvey, parentSurvey]);

  useEffect(() => {
    async function fetchData() {
      if (authLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await db.getDashboardData(user.id);
        setProfile(data.profile);
        setChildren(data.children);
        setReports(data.reports);
        setLatestSurvey(data.latestSurvey);
        setParentSurvey(data.parentSurvey);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, authLoading]);

  useEffect(() => {
    // Only show onboarding if no child is registered in DB AND no intake info in local store
    if (!loading && user && children.length === 0 && !intake.childName) {
      setShowOnboarding(true);
    }
  }, [loading, user, children, intake.childName]);

  const toggleAction = (key: keyof typeof dailyActions) => {
    setDailyActions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !mainChild) return;

    try {
      setUploading(true);
      const imageUrl = await db.uploadChildAvatar(file);
      await db.updateChildProfile(mainChild.id, { image_url: imageUrl });

      // Update local state immediately
      setChildren(prev => prev.map(child =>
        child.id === mainChild.id ? { ...child, image_url: imageUrl } : child
      ));
    } catch (error) {
      console.error('Failed to update profile image:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // Loading state (Enhanced Splash Screen)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse scale-150"></div>
          <img
            src="/gijilai_icon.png"
            alt="기질아이"
            className="w-24 h-24 relative z-10 animate-bounce-subtle object-contain drop-shadow-xl"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-logo text-primary dark:text-white tracking-widest">기질아이</h1>
          <div className="flex gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light p-6 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-icons-round text-primary text-4xl">child_care</span>
        </div>
        <h1 className="text-2xl font-bold mb-3 text-slate-800 font-display">기질아이</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          아이의 신호를 올바르게 통역하고<br />
          서로를 더 깊이 이해하는 맞춤형 솔루션
        </p>
        <Link href="/login" className="w-full max-w-xs">
          <button className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
            시작하기
          </button>
        </Link>
      </div>
    );
  }

  // Calculate age string
  const ageString = mainChild?.birth_date ? (() => {
    const birth = new Date(mainChild.birth_date);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (months <= 36) return `${months}개월`;
    const years = Math.floor(months / 12);
    return `${years}세`;
  })() : "생일 정보 없음";

  // TODO: Implement actual db-backed isReportViewed and hasActiveCoaching
  const hasReport = reports.length > 0;
  const hasActiveCoaching = false; // DB Schema does not have it yet

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 min-h-screen flex flex-col items-center justify-center font-body pb-0">
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark h-full min-h-screen flex flex-col shadow-2xl overflow-hidden relative">
        <header className="flex items-center justify-between px-6 pt-12 pb-4 bg-background-light dark:bg-background-dark sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="material-symbols-outlined text-primary dark:text-white text-[28px]">menu</button>
          </div>
          <div className="flex items-center gap-2">
            <img src="/gijilai_icon.png" alt="기질아이" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-xl font-logo tracking-wide text-primary dark:text-white pt-0.5">기질아이</span>
          </div>
          <button className="relative p-2 rounded-full hover:bg-beige-main dark:hover:bg-surface-dark transition-colors">
            <span className="material-symbols-outlined text-primary dark:text-white">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {mainChild ? (
            /* [기존 사용자] 아이가 등록된 상태 */
            <div className="animate-in fade-in duration-700">
              {/* 상단 프로필 섹션 */}
              <div className="relative w-full flex flex-col items-center p-2 pt-8">
                <div className="flex flex-col items-center justify-center w-full mb-4">
                  <div
                    className="relative w-32 h-32 mb-4 cursor-pointer group"
                    onClick={handleProfileClick}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 relative z-10 border-[3px] border-white dark:border-surface-dark shadow-md ring-1 ring-black/5 group-hover:scale-105 transition-transform">
                      {mainChild?.image_url ? (
                        <img alt={childName} className="w-full h-full object-cover" src={mainChild.image_url} />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                          <span className="material-icons-round text-5xl">face</span>
                          <span className="text-[10px] font-bold mt-1">사진 등록</span>
                        </div>
                      )}
                    </div>

                    {uploading && (
                      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 rounded-full">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}

                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-20 whitespace-nowrap">
                      <div className="bg-white dark:bg-surface-dark text-primary dark:text-white px-3 py-1 rounded-full text-[12px] font-bold shadow-sm inline-flex items-center gap-1 border border-primary/10">
                        <span className="material-symbols-outlined text-[14px] text-child">child_care</span>
                        {temperamentInfo ? temperamentInfo.child.label : '기질 등록 필요'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center mt-6">
                    <h1 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">
                      {childName} ({ageString})
                    </h1>
                    <div className="mt-2 bg-white/60 dark:bg-surface-dark/60 backdrop-blur-sm text-text-main dark:text-gray-200 px-3.5 py-1.5 rounded-full text-[12px] font-medium shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] inline-flex items-center gap-1.5 ring-1 ring-black/5 dark:ring-white/10">
                      <span className="material-symbols-outlined text-[16px] text-caregiver">volunteer_activism</span>
                      양육자 기질 <span className="mx-0.5 text-gray-300 dark:text-gray-600">|</span> <span className="font-bold text-caregiver">{temperamentInfo ? temperamentInfo.parent.soilName : '등록 필요'}</span>
                    </div>
                  </div>
                </div>
                <p className="text-text-sub dark:text-gray-400 text-sm font-light mt-2 break-keep text-center px-8">
                  오늘도 아이의 기질에 맞는 대화를 시도해보세요.
                </p>
              </div>

              {/* 기능 카드 리스트 */}
              <div className="px-6 flex flex-col gap-5 mt-8">
                {!temperamentInfo?.child ? (
                  <div className="bg-primary dark:bg-surface-dark rounded-2xl p-6 shadow-card relative overflow-hidden mb-2">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-white/80 text-xs font-medium bg-white/10 px-2 py-1 rounded inline-block w-fit">필수 진행 단계</span>
                          <h3 className="text-xl font-bold text-white leading-snug tracking-tight">우리아이 기질 검사</h3>
                        </div>
                      </div>
                      <p className="text-sm text-white/90 mb-6">아이트러스트의 과학적인 기질 검사를 시작해보세요.</p>
                      <Link href="/survey/intro">
                        <button className="w-full py-4 rounded-xl bg-white text-primary font-bold text-sm shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                          <span>검사 시작하기</span>
                          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (!parentSurvey && Object.keys(atqResponses).length < PARENT_QUESTIONS.length) ? (
                  <div className="bg-secondary dark:bg-surface-dark rounded-2xl p-6 shadow-card relative overflow-hidden mb-2">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-white/80 text-xs font-medium bg-black/10 px-2 py-1 rounded inline-block w-fit">필수 진행 단계</span>
                          <h3 className="text-xl font-bold text-white leading-snug tracking-tight">나의 양육 성향 검사</h3>
                        </div>
                      </div>
                      <p className="text-sm text-white/90 mb-6">부모님의 기질을 알면 양육이 훨씬 쉬워집니다.</p>
                      <Link href="/survey?type=PARENT">
                        <button className="w-full py-4 rounded-xl bg-white text-secondary font-bold text-sm shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                          <span>{Object.keys(atqResponses).length > 0 ? '검사 이어하기' : '검사 시작하기'}</span>
                          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white dark:bg-surface-dark/50 rounded-2xl p-6 shadow-soft border border-primary/10 dark:border-primary/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-[14px] bg-secondary flex items-center justify-center text-white shadow-md shadow-secondary/30">
                            <span className="material-symbols-outlined">chat_bubble</span>
                          </div>
                          <h3 className="text-lg font-bold text-text-main dark:text-white">마음 통역소 상담</h3>
                        </div>
                        <p className="text-sm text-text-sub dark:text-gray-300 mb-6 leading-relaxed">
                          아이의 행동 뒤에 숨겨진 마음을 통역해드릴게요.
                        </p>
                        <Link href="/consult">
                          <button className="w-full bg-secondary py-4 rounded-xl text-white font-bold text-sm shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            <span>상담 시작하기</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
                        </Link>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark/50 rounded-2xl p-5 shadow-soft border border-primary/10 dark:border-primary/50 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">description</span>
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-text-main dark:text-white">기질 분석 리포트</h3>
                          <p className="text-[11px] text-text-sub dark:text-gray-400">우리아이&부모님 상세 결과</p>
                        </div>
                      </div>
                      <Link href="/report">
                        <button className="px-4 py-2.5 rounded-xl bg-primary/5 text-primary font-bold text-[12px] border border-primary/10">결과 보기</button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* [신규 사용자] 아이가 등록되지 않은 상테 - 히어로 전용 UI */
            <div className="px-6 pb-12 animate-in slide-in-from-bottom-8 duration-1000">
              {/* 통합 환영 하이라이트 카드 */}
              <div className="bg-gradient-to-br from-white to-primary/5 dark:from-surface-dark/80 dark:to-primary/20 rounded-[2.5rem] p-8 mt-12 mb-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-primary/10 dark:border-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-primary/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-[60px] -ml-24 -mb-24 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-primary mb-8 rotate-3 group-hover:rotate-0 transition-transform duration-500 ring-4 ring-primary/5">
                    <div className="relative">
                      <span className="material-symbols-outlined text-[42px] fill-1">child_care</span>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg ring-2 ring-white dark:ring-slate-800 scale-110">
                        <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-[28px] font-black text-text-main dark:text-white leading-tight break-keep mb-4">
                    반가워요, {profile?.full_name || '양육자'}님!<br />
                    <span className="text-primary">아이와 함께</span> 시작할까요?
                  </h2>
                  <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed break-keep mb-10">
                    우리 아이의 타고난 기질을 이해하고<br />
                    맞춤형 대화 처방을 받는 첫걸음입니다.
                  </p>

                  <Link href="/settings/child/new" className="w-full">
                    <button className="w-full bg-primary hover:bg-primary-dark py-5 rounded-[1.5rem] text-white font-bold text-[17px] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                      <span>아이 프로필 등록하기</span>
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Browse/Preview Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">explore</span>
                    미리 경험하기
                  </h3>
                </div>

                {/* Preview Items */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/50 dark:bg-surface-dark/30 rounded-3xl p-6 border border-primary/5 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[28px]">category</span>
                      </div>
                      <h4 className="text-[15px] font-bold text-text-main dark:text-white">우리아이 기질 유형들</h4>
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      {['순한 아이', '신중한 아이', '열정적인 아이'].map((t) => (
                        <span key={t} className="shrink-0 px-4 py-2.5 bg-white dark:bg-surface-dark rounded-xl text-[12px] font-medium border border-primary/5 shadow-sm">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/50 dark:bg-surface-dark/30 rounded-3xl p-6 border border-primary/5 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
                      </div>
                      <h4 className="text-[15px] font-bold text-text-main dark:text-white">상황별 맞춤 대화법</h4>
                    </div>
                    <div className="bg-primary/5 rounded-2xl p-4 text-[13px] leading-relaxed italic text-text-sub">
                      "안돼" 대신 "지금은 기다릴 시간이야"라고 말해보세요.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Debug Reset Button */}
          {user && (
            <div className="flex justify-center mt-12 mb-8 opacity-20 hover:opacity-100 transition-opacity">
              <button
                onClick={async () => {
                  if (!window.confirm("데이터를 초기화하시겠습니까?")) return;
                  await db.resetUserData(user.id);
                  resetAll();
                  window.location.reload();
                }}
                className="text-xs text-red-500 underline"
              >
                [Debug] 데이터 초기화
              </button>
            </div>
          )}
        </main>

        <BottomNav />

        {/* Modal Sections */}
        {showOnboarding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"></div>
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

              <div className="relative z-10 p-8 flex flex-col items-center">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3 shadow-xl">
                  <img src="/gijilai_icon.png" alt="기질아이" className="w-16 h-16 object-contain" />
                </div>

                <div className="text-center space-y-3 mb-10">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white font-display break-keep">
                    반가워요!<br />이제 아이를 알아가볼까요?
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed break-keep px-4">
                    아이의 <strong>타고난 기질</strong>을 이해하고,<br />
                    부모님의 <strong>따뜻한 시선</strong>으로 아름답게<br />
                    성장하는 과정을 함께 도와드릴게요.
                  </p>
                </div>

                <div className="w-full space-y-4 mb-10">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                      <span className="text-lg">🧬</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">과학적 기질 분석</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">타고난 성향을 정확히 파악합니다.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                      <span className="text-lg">💬</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">맞춤형 대화 처방</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">아이의 신호를 올바르게 통역해드려요.</p>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <button
                    onClick={() => {
                      setShowOnboarding(false);
                      router.push('/settings/child/new');
                    }}
                    className="w-full bg-primary text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                  >
                    <span className="text-lg">아이 정보 등록하기</span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => setShowOnboarding(false)}
                    className="w-full py-4 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors mt-2"
                  >
                    나중에 둘러볼게요
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSurveyIntro && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSurveyIntro(false)}></div>
            <div className="relative bg-[#FAFCFA] dark:bg-[#1A2E1A] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-5 shadow-lg animate-bounce-subtle">
                  <img src="/gijilai_icon.png" alt="기질아이" className="w-12 h-12 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 font-display">
                  어떤 기질일까요?
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8 break-keep">
                  아이의 타고난 기질을 알면<br />
                  더 지혜롭게 사랑할 수 있습니다.<br />
                  <br />
                  약 3분 정도 소요되는 간단한 테스트로<br />
                  우리 아이만의 특별한 빛을 발견해보세요.
                </p>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => {
                      resetSurveyOnly();
                      router.push('/survey');
                    }}
                    className="w-full bg-[#2E7D32] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#2E7D32]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <span>테스트 시작하기</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => setShowSurveyIntro(false)}
                    className="w-full py-3 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
                  >
                    나중에 하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
