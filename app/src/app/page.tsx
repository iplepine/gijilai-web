'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/store/useAppStore'; // Add this line
import { db, UserProfile, ChildProfile, ReportData, SurveyData } from '@/lib/db';
import { GardenState } from '@/types/gardening';
import { TemperamentScorer } from '@/lib/TemperamentScorer';
import { TemperamentClassifier } from '@/lib/TemperamentClassifier';
import { CHILD_QUESTIONS } from '@/data/questions';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
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

  // Derived Temperament
  const temperamentInfo = (() => {
    if (!latestSurvey || !latestSurvey.answers) return null;
    const answers = latestSurvey.answers as Record<number, number>;
    const scores = TemperamentScorer.calculate(CHILD_QUESTIONS, answers);
    return TemperamentClassifier.analyze(scores);
  })();

  useEffect(() => {
    async function fetchData() {
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
  }, [user]);

  useEffect(() => {
    if (!loading && user && children.length === 0) {
      setShowOnboarding(true);
    }
  }, [loading, user, children]);

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-primary text-xl font-bold animate-pulse">Aina Garden...</div>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light p-6 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-icons-round text-primary text-4xl">local_florist</span>
        </div>
        <h1 className="text-2xl font-bold mb-3 text-slate-800 font-display">아이나 가든</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          아이의 타고난 기질(씨앗)을 이해하고<br />
          부모의 사랑(토양)으로 꽃피우는 정원
        </p>
        <Link href="/login" className="w-full max-w-xs">
          <button className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
            시작하기
          </button>
        </Link>
      </div>
    );
  }

  const mainChild = children[0] || null;
  const childName = mainChild?.name || "우리 아이";

  // Calculate age string
  const ageString = mainChild?.birth_date ? (() => {
    const birth = new Date(mainChild.birth_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    // const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    return `${mainChild.birth_date.replaceAll('-', '.')} (${months}개월)`;
  })() : "생일 정보 없음";

  return (
    <div className="min-h-screen bg-background-light text-slate-800 font-sans pb-32">
      <main className="w-full max-w-md mx-auto flex flex-col">
        {/* Header */}
        <header className="w-full px-6 pt-10 pb-4 flex justify-between items-center bg-transparent">
          <h1 className="text-xl font-bold tracking-tight text-primary font-display">아이나 가든</h1>
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-primary/5 active:scale-95 transition-transform">
            <span className="material-icons-round text-primary text-xl">notifications</span>
          </button>
        </header>

        {/* Double Circle Profile Section */}
        <section className="w-full px-4 mb-10 mt-4">
          <div className="relative w-full flex flex-col items-center">
            <div className="relative w-[340px] h-[340px] flex items-center justify-center">
              {/* Outer Soil Blob */}
              <div className="outer-soil-blob absolute inset-0 bg-soil-beige/50 border border-earth-brown/10"></div>

              {/* Inner Profile Circle / Empty State */}
              <div className="inner-profile-circle w-56 h-56 bg-white shadow-xl shadow-primary/5 border border-primary/5 flex flex-col items-center justify-center relative z-10 overflow-hidden p-5 transition-colors group">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                {mainChild ? (
                  <>
                    <div
                      className="w-20 h-20 rounded-full border-2 border-soft-leaf shadow-inner overflow-hidden mb-3 bg-gray-100 flex items-center justify-center relative cursor-pointer"
                      onClick={handleProfileClick}
                    >
                      {uploading ? (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : null}
                      {mainChild?.image_url ? (
                        <img src={mainChild.image_url} alt={childName} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                      ) : (
                        <span className="material-icons-round text-gray-300 text-4xl group-hover:text-gray-400 transition-colors">face</span>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                        <span className="material-icons-round text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm">edit</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <h2 className="text-lg font-bold text-slate-800 leading-tight">
                        {childName}
                      </h2>
                      <div className="flex flex-col items-center mt-1">
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-[16px] font-bold">
                            {temperamentInfo ? 'visibility' : 'help_outline'}
                          </span>
                          <span className="text-[13px] font-bold relative z-20">
                            {temperamentInfo ? temperamentInfo.label : <span className="text-gray-400 font-medium">어떤 씨앗일까요?</span>}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium tracking-tighter mt-0.5">{ageString}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                      <span className="material-icons-round text-slate-300 text-3xl">add</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-400">아직 등록된<br />아이가 없어요</p>
                    </div>
                    <button
                      onClick={() => setShowOnboarding(true)}
                      className="text-[11px] font-bold bg-primary text-white px-4 py-1.5 rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                      아이 등록하기
                    </button>
                  </div>
                )}
              </div>

              <div className="absolute bottom-6 z-20 flex flex-col items-center gap-1">
                <div className="bg-[#fff9f0]/90 backdrop-blur-sm px-5 py-2 pebble-shape border border-earth-brown/10 flex items-center gap-1.5 shadow-sm floating-label">
                  <span className="material-symbols-outlined text-earth-brown text-base">layers</span>
                  <span className="text-[11px] font-bold text-earth-brown">
                    양육자 기질: {parentSurvey ? (
                      <span>따뜻한 토양</span>
                    ) : (
                      mainChild ? (
                        temperamentInfo ? (
                          <Link href="/survey?type=PARENT" className="underline hover:text-earth-brown/80 cursor-pointer">어떤 흙일까요?</Link>
                        ) : (
                          <span className="text-earth-brown/30">테스트 대기 중</span>
                        )
                      ) : (
                        <span className="text-earth-brown/30" onClick={() => setShowOnboarding(true)}>아이 먼저 등록</span>
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Insight Message */}
            <div className="text-[13px] text-slate-500 text-center px-10 leading-relaxed mt-8 break-keep">
              {mainChild ? (
                <>
                  {temperamentInfo ? (
                    <p>
                      {childName}의 {temperamentInfo.label} 기질은 부모님의 따뜻한 지지 속에서<br />
                      <span className="text-primary font-bold">멋진 강점으로 피어납니다.</span>
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <p>아직 {childName}의 기질을 잘 모르시나요?</p>
                      <button
                        onClick={() => setShowSurveyIntro(true)}
                        className="w-full bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse-subtle"
                      >
                        <span className="material-icons-round text-lg">psychology</span>
                        <span>기질 테스트 시작하기</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-400 italic">아이를 등록하고 맞춤형 정원을 가꿔보세요!</p>
                  <button
                    onClick={() => setShowOnboarding(true)}
                    className="w-full bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-icons-round text-lg">child_care</span>
                    <span>첫 아이 등록하기</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>



        {/* Premium Promo Card (Replaces Daily Mission) */}

        <section className="w-full px-4 mb-8">
          <div className="bg-gradient-to-br from-primary to-[#1A4D4D] text-white rounded-[2rem] p-6 relative overflow-hidden shadow-lg shadow-primary/20">
            {/* Background Decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8 blur-lg"></div>

            <div className="relative z-10">
              <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold mb-3 backdrop-blur-sm">
                PREMIUM
              </div>
              <h3 className="text-xl font-bold leading-tight font-display mb-2">
                우리 아이 맞춤<br />양육 솔루션 받기
              </h3>
              <p className="text-xs opacity-90 mb-6 leading-relaxed">
                기질 분석을 통해 매일 제공되는<br />
                전문 코칭과 미션을 받아보세요.
              </p>
              <button
                onClick={() => alert("프리미엄 구독 페이지로 이동합니다.")}
                className="w-full bg-white text-primary font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>지금 시작하기</span>
                <span className="material-icons-round text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>


        {/* Guide Section (Static for now, could be dynamic) */}
        {temperamentInfo && (
          <section className="w-full px-4 mb-8">
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">lightbulb</span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 font-display">기질 맞춤 가이드</h3>
            </div>
            <div className="bg-warm-beige/30 border-l-4 border-primary rounded-[1.25rem] p-5 relative w-full">
              <p className="text-[13px] font-bold text-slate-800 mb-2 italic break-keep">
                "{childName}는 '{temperamentInfo.label}' 기질을 가지고 있어 새로운 변화에 익숙해질 시간이 필요해요."
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed break-keep">
                처음에는 엄마 아빠가 먼저 시범을 보여주세요. 아이가 흥미를 느낄 때까지 충분히 기다려 주는 것이 가장 효과적입니다.
              </p>
            </div>
          </section>
        )}

        {/* Daily Actions Checklist (Replacement for Stats) */}
        <section className="w-full px-4 mb-24">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-accent text-sm">check_circle</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 font-display">오늘의 실천</h3>
          </div>

          <div className="space-y-3">
            {/* Eye Contact */}
            <div
              className={`flex items-center justify-between p-4 rounded-[1.25rem] border transition-all cursor-pointer ${dailyActions.eyeContact ? 'bg-soft-leaf/30 border-accent/20' : 'bg-white border-slate-50 shadow-sm'}`}
              onClick={() => toggleAction('eyeContact')}
            >
              <div className="flex items-center gap-3">
                <span className={`material-icons-round text-xl ${dailyActions.eyeContact ? 'text-accent' : 'text-slate-300'}`}>visibility</span>
                <span className={`font-bold text-sm ${dailyActions.eyeContact ? 'text-slate-800' : 'text-slate-600'}`}>아이 눈 바라보기</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${dailyActions.eyeContact ? 'bg-accent border-accent' : 'border-slate-200'}`}>
                {dailyActions.eyeContact && <span className="material-icons-round text-white text-sm">check</span>}
              </div>
            </div>

            {/* Praise */}
            <div
              className={`flex items-center justify-between p-4 rounded-[1.25rem] border transition-all cursor-pointer ${dailyActions.praise ? 'bg-soft-leaf/30 border-accent/20' : 'bg-white border-slate-50 shadow-sm'}`}
              onClick={() => toggleAction('praise')}
            >
              <div className="flex items-center gap-3">
                <span className={`material-icons-round text-xl ${dailyActions.praise ? 'text-accent' : 'text-slate-300'}`}>thumb_up</span>
                <span className={`font-bold text-sm ${dailyActions.praise ? 'text-slate-800' : 'text-slate-600'}`}>구체적으로 칭찬하기</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${dailyActions.praise ? 'bg-accent border-accent' : 'border-slate-200'}`}>
                {dailyActions.praise && <span className="material-icons-round text-white text-sm">check</span>}
              </div>
            </div>

            {/* Skinship */}
            <div
              className={`flex items-center justify-between p-4 rounded-[1.25rem] border transition-all cursor-pointer ${dailyActions.skinship ? 'bg-soft-leaf/30 border-accent/20' : 'bg-white border-slate-50 shadow-sm'}`}
              onClick={() => toggleAction('skinship')}
            >
              <div className="flex items-center gap-3">
                <span className={`material-icons-round text-xl ${dailyActions.skinship ? 'text-accent' : 'text-slate-300'}`}>favorite</span>
                <span className={`font-bold text-sm ${dailyActions.skinship ? 'text-slate-800' : 'text-slate-600'}`}>따뜻하게 안아주기</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${dailyActions.skinship ? 'bg-accent border-accent' : 'border-slate-200'}`}>
                {dailyActions.skinship && <span className="material-icons-round text-white text-sm">check</span>}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Debug: Reset Data Button */}
      <div className="flex justify-center mt-8 mb-20 opacity-30 hover:opacity-100 transition-opacity">
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

      {/* Onboarding Modal - Show if no children registered */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

            <div className="relative z-10 p-8 flex flex-col items-center">
              {/* Logo / Mascot Area */}
              <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3 shadow-inner">
                <span className="text-5xl animate-bounce-subtle">🌱</span>
              </div>

              <div className="text-center space-y-3 mb-10">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white font-display break-keep">
                  반가워요!<br />이제 정원을 가꿔볼까요?
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed break-keep px-4">
                  아이의 <strong>타고난 기질(씨앗)</strong>을 이해하고,<br />
                  부모님의 <strong>사랑(토양)</strong>으로 아름답게<br />
                  피어나는 과정을 함께 도와드릴게요.
                </p>
              </div>

              {/* Value Props */}
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

              {/* Action Button */}
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
      )}

      {/* Survey Intro Modal */}
      {showSurveyIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSurveyIntro(false)}></div>
          <div className="relative bg-[#FAFCFA] dark:bg-[#1A2E1A] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-5 animate-bounce-subtle">
                <span className="material-icons-round text-4xl text-[#2E7D32]">psychology</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 font-display">
                어떤 씨앗일까요?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8 break-keep">
                아이의 타고난 기질을 알면<br />
                더 지혜롭게 사랑할 수 있습니다.<br />
                <br />
                약 3분 정도 소요되는 간단한 테스트로<br />
                우리 아이만의 특별한 씨앗을 발견해보세요.
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
      )}

      {/* Inline Bottom Navigation (As per new design request) */}
      <nav className="fixed bottom-6 left-0 right-0 z-50 px-6 pointer-events-none">
        <div className={`bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-primary/5 px-4 py-3 flex justify-around items-center max-w-sm mx-auto pointer-events-auto transition-opacity ${showOnboarding ? 'opacity-20' : 'opacity-100'}`}>
          <Link href="/" className="flex flex-col items-center justify-center text-primary min-w-[64px]">
            <span className="material-icons-round text-2xl">home</span>
            <span className="text-[9px] font-bold mt-0.5">홈</span>
          </Link>
          <Link href="/garden" className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-colors min-w-[64px]">
            <span className="material-icons-round text-2xl">local_florist</span>
            <span className="text-[9px] font-bold mt-0.5">나의 정원</span>
          </Link>
          <Link href="/coaching" className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-colors min-w-[64px]">
            <span className="material-icons-round text-2xl">auto_stories</span>
            <span className="text-[9px] font-bold mt-0.5">코칭</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center justify-center text-slate-400 hover:text-primary transition-colors min-w-[64px]">
            <span className="material-icons-round text-2xl">person</span>
            <span className="text-[9px] font-bold mt-0.5">프로필</span>
          </Link>
        </div>
      </nav>

      {/* Decorative Background Elements */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-soft-leaf/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed top-1/2 -right-20 w-64 h-64 bg-warm-beige/20 rounded-full blur-[80px] pointer-events-none z-0"></div>
    </div>
  );
}
