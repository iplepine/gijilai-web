'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Icon } from '@/components/ui/Icon';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/components/auth/AuthProvider';
import { db, ReportData, ChildProfile } from '@/lib/db';
import { TemperamentScorer } from '@/lib/TemperamentScorer';
import { TemperamentClassifier } from '@/lib/TemperamentClassifier';
import { CHILD_QUESTIONS } from '@/data/questions';
import { toPng } from 'html-to-image';
import saveAs from 'file-saver';
import { Suspense } from 'react';

function SharePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { intake, cbqResponses, atqResponses } = useAppStore();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  // DB-loaded data
  const [report, setReport] = useState<ReportData | null>(null);
  const [child, setChild] = useState<ChildProfile | null>(null);

  const reportId = searchParams.get('id');

  // Load report from DB if reportId is provided
  useEffect(() => {
    async function loadReport() {
      if (!reportId || !user) return;
      try {
        const reports = await db.getReports(user.id);
        const found = reports.find(r => r.id === reportId);
        if (found) {
          setReport(found);
          if (found.child_id) {
            const children = await db.getChildren(user.id);
            const foundChild = children.find(c => c.id === found.child_id);
            if (foundChild) setChild(foundChild);
          }
        }
      } catch (e) {
        console.error('Failed to load report:', e);
      }
    }
    loadReport();
  }, [reportId, user]);

  const childName = child?.name || intake.childName || '우리 아이';

  const referralCode = 'GIJILAI-' + (user?.id?.substring(0, 8) || 'FRIEND');

  // Initialize Kakao
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '86e2d8a4369a47468132e08e67f08c5c';
        window.Kakao.init(key);
      }
    }
  }, []);

  // Calculate Temperament from DB report or local store
  const temperamentInfo = (() => {
    if (report?.analysis_json) {
      const analysis = report.analysis_json as any;
      if (analysis.label && analysis.desc) {
        if (analysis.scores) {
          const classified = TemperamentClassifier.analyzeChild(analysis.scores);
          return { label: analysis.label, desc: analysis.desc, image: classified.image };
        }
        return { label: analysis.label, desc: analysis.desc, image: '' };
      }
    }

    if (!cbqResponses || Object.keys(cbqResponses).length === 0) return null;
    const scores = TemperamentScorer.calculate(CHILD_QUESTIONS, cbqResponses as any);
    const classified = TemperamentClassifier.analyzeChild(scores);
    return { label: classified.label, desc: classified.desc, image: classified.image };
  })();

  const handleCopyCode = async () => {
    const shareUrl = window.location.origin + '?ref=' + referralCode;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) return;

    const shareUrl = window.location.origin + '?ref=' + referralCode;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${childName}는 "${temperamentInfo?.label || '열정 탐험가'}"예요!`,
        description: '과학적인 기질 분석으로 우리 아이의 타고난 빛을 발견해보세요.',
        imageUrl: `${window.location.origin}${temperamentInfo?.image || '/child_type/type_lhl.jpg'}`,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '나도 검사해보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  };

  const handleDownloadImage = async () => {
    if (cardRef.current === null) return;
    setIsSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      saveAs(dataUrl, `기질아이-${childName}.png`);
    } catch (err) {
      console.error('Image download failed:', err);
      alert('이미지 저장에 실패했습니다.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      handleCopyCode();
      return;
    }

    try {
      const shareUrl = window.location.origin + '?ref=' + referralCode;
      await navigator.share({
        title: `${childName}의 기질 분석 결과`,
        text: `${childName}는 "${temperamentInfo?.label || '열정 탐험가'}" 기질이에요! 과학적 기질 분석으로 우리 아이를 이해해보세요.`,
        url: shareUrl,
      });
    } catch (err) {
      // User cancelled share - ignore
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center font-body">
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen flex flex-col shadow-2xl relative">
        <Navbar title="결과 공유하기" showBack onBackClick={() => router.back()} />

        <main className="flex-1 px-6 py-8 space-y-8 pb-24">
          {/* 결과 카드 */}
          <div ref={cardRef} className="rounded-2xl overflow-hidden bg-white dark:bg-surface-dark shadow-card border border-primary/5 dark:border-white/5">
            <div
              className="w-full aspect-[4/5] bg-cover bg-center relative"
              style={{
                backgroundImage: `url("${temperamentInfo?.image || '/child_type/type_lhl.jpg'}")`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-7">
                <h3 className="text-2xl font-bold text-white mb-2 break-keep leading-snug">
                  {childName}는<br />
                  <span className="text-primary-light">"{temperamentInfo?.label || '열정 탐험가'}"</span>예요!
                </h3>
                <p className="text-sm text-white/80 leading-relaxed font-medium break-keep">
                  {temperamentInfo?.desc || '호기심이 많고 에너지가 넘치는 탐험가 기질을 가지고 있어요.'}
                </p>
                <div className="mt-5 pt-4 border-t border-white/20 flex items-center gap-2">
                  <img src="/gijilai_icon.png" alt="" className="w-5 h-5 brightness-0 invert opacity-50" />
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Gijilai</span>
                </div>
              </div>
            </div>
          </div>

          {/* 공유 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={handleKakaoShare}
              className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-[15px] font-bold bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] active:scale-[0.98] transition-all"
            >
              <span className="text-xl">💬</span> 카카오톡으로 공유
            </button>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleCopyCode}
                className={`h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[12px] font-bold border transition-all active:scale-95 ${copied ? 'bg-primary/5 text-primary border-primary/20' : 'bg-white dark:bg-surface-dark text-text-sub border-gray-100 dark:border-gray-800'}`}
              >
                <Icon name={copied ? "check" : "link"} size="sm" />
                {copied ? '복사됨' : '링크 복사'}
              </button>
              <button
                onClick={handleDownloadImage}
                disabled={isSharing}
                className="h-14 rounded-2xl bg-white dark:bg-surface-dark text-text-sub border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-1 text-[12px] font-bold transition-all active:scale-95 disabled:opacity-50"
              >
                {isSharing ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Icon name="image" size="sm" />
                )}
                {isSharing ? '저장 중' : '이미지 저장'}
              </button>
              <button
                onClick={handleNativeShare}
                className="h-14 rounded-2xl bg-white dark:bg-surface-dark text-text-sub border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-1 text-[12px] font-bold transition-all active:scale-95"
              >
                <Icon name="share" size="sm" />
                다른 앱
              </button>
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 border border-primary/10">
            <p className="text-[13px] text-text-sub dark:text-gray-400 leading-relaxed break-keep text-center">
              아이의 기질 분석 결과를 친구에게 공유하고,<br />
              <strong className="text-text-main dark:text-white">함께 아이의 기질에 대해 이야기</strong>해보세요.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <SharePageContent />
    </Suspense>
  );
}
