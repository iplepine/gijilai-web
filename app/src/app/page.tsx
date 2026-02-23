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

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { intake, cbqResponses, atqResponses, parentingResponses, isPaid, resetSurveyOnly } = useAppStore(); // Added useAppStore destructuring
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
          <section className="flex flex-col items-center justify-center py-6 px-4">
            <div className="relative w-full flex flex-col items-center p-2">
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

              <div className="text-center w-full">
                <p className="text-text-sub dark:text-gray-400 text-sm px-4 font-light">
                  오늘도 아이의 기질에 맞는 대화를 시도해보세요.
                </p>
              </div>
            </div>
          </section>
          <div className="px-6 flex flex-col gap-5 mt-2">
            {!mainChild ? (
              <div className="bg-white dark:bg-surface-dark/50 rounded-2xl p-6 shadow-soft border border-primary/20 dark:border-primary/50 relative overflow-hidden mb-4">
                {/* [카드 A] 아이 정보 등록 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">face_add</span>
                    </div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white">아이 프로필 생성</h3>
                  </div>
                  <p className="text-sm text-text-sub dark:text-gray-300 mb-6">
                    아이 정보를 등록하고 맞춤형 코칭 분석을 시작하세요.
                  </p>
                  <Link href="/settings/child/new">
                    <button className="w-full bg-primary dark:bg-primary-dark py-4 rounded-xl text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center justify-center gap-1 active:scale-[0.98]">
                      <span>아이 프로필 등록하기</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </Link>
                </div>
              </div>
            ) : !temperamentInfo?.child ? (
              <div className="bg-primary dark:bg-surface-dark rounded-2xl p-6 shadow-card relative overflow-hidden mb-4">
                {/* [카드 B] 아이 기질 검사 유도 */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-white/80 text-xs font-medium bg-white/10 px-2 py-1 rounded inline-block w-fit">필수 진행 단계</span>
                      <h3 className="text-xl font-bold text-white leading-snug tracking-tight">우리아이 기질 검사</h3>
                    </div>
                  </div>
                  <p className="text-sm text-white/90 mb-6">
                    아이의 타고난 기질을 완벽하게 파악할 시간이에요.
                  </p>
                  <Link href="/survey/intro">
                    <button className="w-full py-4 rounded-xl bg-white text-primary font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/5 active:scale-[0.98]">
                      <span>아이 기질 검사 시작</span>
                      <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    </button>
                  </Link>
                </div>
              </div>
            ) : (!parentSurvey && Object.keys(atqResponses).length < PARENT_QUESTIONS.length) ? (
              <div className="bg-secondary dark:bg-surface-dark rounded-2xl p-6 shadow-card relative overflow-hidden mb-4">
                {/* [카드 C] 양육자 성향 검사 유도 */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-white/80 text-xs font-medium bg-black/10 px-2 py-1 rounded inline-block w-fit">필수 진행 단계</span>
                      <h3 className="text-xl font-bold text-white leading-snug tracking-tight">나의 양육 성향 검사</h3>
                    </div>
                  </div>
                  <p className="text-sm text-white/90 mb-6">
                    완벽한 분석을 위해 부모님의 양육 성향도 알려주세요.
                  </p>
                  <Link href="/survey?type=PARENT">
                    <button className="w-full py-4 rounded-xl bg-white text-secondary font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/5 active:scale-[0.98]">
                      <span>{Object.keys(atqResponses).length > 0 ? '양육 검사 이어하기' : '양육 검사 시작'}</span>
                      <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-surface-dark/50 rounded-2xl p-6 shadow-soft border border-primary/20 dark:border-primary/50 relative overflow-hidden mb-4">
                  {/* [카드 E] 마음 통역소 제안 */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-[14px] bg-secondary flex items-center justify-center text-white shadow-md shadow-secondary/30">
                        <span className="material-symbols-outlined">chat_bubble</span>
                      </div>
                      <h3 className="text-lg font-bold text-text-main dark:text-white">아이의 마음이 궁금한가요?</h3>
                    </div>
                    <p className="text-sm text-text-sub dark:text-gray-300 mb-6 leading-relaxed">
                      아이의 기질을 통역하면 육아가 훨씬 쉬워져요.<br />
                      <span className="font-bold text-secondary">오늘의 고민</span>에 대한 맞춤 처방을 확인하세요.
                    </p>
                    <Link href="/consult">
                      <button className="w-full bg-secondary dark:bg-secondary py-4 rounded-xl text-white font-bold text-sm shadow-lg shadow-secondary/20 hover:brightness-110 transition-all flex items-center justify-center gap-1 active:scale-[0.98]">
                        <span>마음 통역소에서 상담하기</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* [카드 D] 기질 분석 리포트 확인 (서브 카드로 배치) */}
                <div className="bg-white dark:bg-surface-dark/50 rounded-2xl p-5 shadow-soft border border-primary/10 dark:border-primary/50 relative overflow-hidden mb-4 mt-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="relative z-10 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[20px]">description</span>
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-text-main dark:text-white">기질 분석 리포트</h3>
                        <p className="text-[11px] text-text-sub dark:text-gray-400">
                          우리아이와 부모님 분석 결과
                        </p>
                      </div>
                    </div>
                    <Link href="/report" className="shrink-0">
                      <button className="px-4 py-2.5 rounded-xl bg-primary/5 text-primary dark:text-primary-light font-bold text-[12px] hover:bg-primary/10 transition-colors border border-primary/10">
                        결과 보기
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Realtime Coaching Card */}
                <div className="bg-primary dark:bg-surface-dark rounded-2xl p-6 shadow-card relative overflow-hidden mb-4">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                          <span className="text-white/80 text-xs font-medium">실시간 코칭 분석</span>
                        </div>
                        <h3 className="text-xl font-bold text-white leading-snug">떼쓰기 상황<br />데이터 기반 대응법</h3>
                      </div>
                      <div className="text-right bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                        <span className="block text-xs text-white/70">진행도</span>
                        <span className="text-xl font-bold text-white">35%</span>
                      </div>
                    </div>

                    <div className="w-full bg-black/20 rounded-full h-1.5 mb-6 overflow-hidden">
                      <div className="bg-white h-full rounded-full w-[35%]"></div>
                    </div>

                    <button
                      className="w-full py-3.5 rounded-xl bg-white text-primary font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/5 active:scale-[0.98]"
                    >
                      <span>이어하기</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Daily Mission Card */}
                <div className="bg-white dark:bg-surface-dark/50 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-800 relative overflow-hidden mb-4">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">task_alt</span>
                        오늘의 미션
                      </span>
                      <span className="px-2.5 py-1 bg-beige-light text-primary text-[11px] font-bold rounded-md">약 10분 소요</span>
                    </div>

                    <div className="flex gap-4 mb-5 items-start">
                      <div className="w-12 h-12 rounded-xl bg-beige-light flex items-center justify-center flex-shrink-0 text-primary mt-1">
                        <span className="material-symbols-outlined text-[24px]">psychology</span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-text-main dark:text-white mb-1">오늘의 마법 문장</h4>
                        <p className="text-xs text-text-sub dark:text-gray-400">데이터 분석 결과, '공감' 키워드가 부족합니다.</p>
                      </div>
                    </div>

                    <div className="bg-background-light dark:bg-black/20 p-5 rounded-xl mb-6 border border-beige-main/30">
                      <p className="text-sm text-text-main dark:text-gray-300 leading-relaxed">
                        민준이가 좋아하는 인형 놀이를 통해 <span className="font-bold text-primary">"부탁해"</span>와 <span className="font-bold text-primary">"고마워"</span>라는 문장을 함께 연습해 보세요.
                      </p>
                    </div>

                    <button className="w-full bg-primary dark:bg-primary-dark py-4 rounded-xl text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center justify-center gap-1 active:scale-[0.98]">
                      <span>미션 시작하기</span>
                      <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    </button>
                  </div>
                </div>

              </>
            )}

            {/* Debug: Reset Data Button */}
            <div className="flex justify-center mt-8 mb-4 opacity-30 hover:opacity-100 transition-opacity">
              <button
                onClick={async () => {
                  if (!user || !window.confirm("정말 모든 데이터를 초기화하시겠습니까? (복구 불가)")) return;
                  try {
                    await db.resetUserData(user.id);
                    alert("모든 데이터가 초기화되었습니다.");
                    window.location.reload();
                  } catch (e) {
                    console.error(e);
                    alert("초기화 실패");
                  }
                }}
                className="text-xs text-red-500 underline"
              >
                [Debug] 모든 데이터 초기화
              </button>
            </div>
          </div>
        </main>

        <BottomNav />

        {/* Onboarding Modal - Show if no children registered */}
        {
          showOnboarding && (
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
                      <span className="material-icons-round text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
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
          )
        }

        {/* Survey Intro Modal */}
        {
          showSurveyIntro && (
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
                      <span className="material-icons-round text-sm">arrow_forward</span>
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
          )
        }
      </div >
    </div >
  );
}
