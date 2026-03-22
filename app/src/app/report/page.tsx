'use client';

import React, { useMemo, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { CHILD_QUESTIONS, PARENT_QUESTIONS, PARENTING_STYLE_QUESTIONS } from '@/data/questions';
import BottomNav from '@/components/layout/BottomNav';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { TemperamentScorer } from '@/lib/TemperamentScorer';
import { TemperamentClassifier } from '@/lib/TemperamentClassifier';
import { ParentClassifier } from '@/lib/ParentClassifier';
import { PRESCRIPTION_DATA } from '@/lib/PrescriptionData';
import { TCI_TERMINOLOGY } from '@/constants/terminology';
import { useAuth } from '@/components/auth/AuthProvider';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const isChildOnly = searchParams.get('child_only') === 'true';

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'child' | 'parent' | 'parenting'>('child');
  const { intake, cbqResponses, atqResponses, parentingResponses, isPaid, setIsPaid } = useAppStore();
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  const [childAiReport, setChildAiReport] = useState<any>(null);
  const [parentAiReport, setParentAiReport] = useState<any>(null);
  const [harmonyAiReport, setHarmonyAiReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // DB에서 로드된 점수 데이터 (상세 보기용)
  const [savedChildScores, setSavedChildScores] = useState<any>(null);
  const [savedParentScores, setSavedParentScores] = useState<any>(null);
  const [savedStyleScores, setSavedStyleScores] = useState<any>(null);

  // DB Sync States
  const [dbChildId, setDbChildId] = useState<string | null>(null);
  const [dbSurveyIds, setDbSurveyIds] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tabParam === 'parent') {
      setActiveTab('parent');
    } else if (tabParam === 'child') {
      setActiveTab('child');
    } else if (tabParam === 'parenting') {
      setActiveTab('parenting');
    } else if (!tabParam) {
      // 기본 탭: 양육태도 설문까지 완료 시 기질맞춤양육, 아니면 아이진단
      const styleComplete = PARENTING_STYLE_QUESTIONS.every(q => !!parentingResponses[q.id.toString()]);
      setActiveTab('child');
    }
  }, [tabParam, parentingResponses]);

  const reportId = searchParams.get('id');

  // URL ID가 있을 경우 DB에서 리포트 로드
  useEffect(() => {
    if (reportId && user) {
      loadSavedReport(reportId);
    }
  }, [reportId, user]);

  const loadSavedReport = async (id: string) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*, surveys(*), children(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        const analysis = data.analysis_json;
        const surveyData = data.surveys;
        const childData = data.children;

        if (childData) {
          useAppStore.getState().setIntake({
            childName: childData.name,
            gender: childData.gender,
            birthDate: childData.birth_date,
          });
        }

        if (data.type === 'CHILD') {
          setChildAiReport(analysis);
          setSavedChildScores(surveyData?.scores);
          setDbChildId(data.child_id);
          setDbSurveyIds(prev => ({ ...prev, CHILD: data.survey_id }));
          if (data.is_paid) useAppStore.getState().setIsPaid(true);
          setActiveTab('child');
        } else if (data.type === 'PARENT') {
          setParentAiReport(analysis);
          setSavedParentScores(surveyData?.scores);
          setDbChildId(data.child_id);
          setDbSurveyIds(prev => ({ ...prev, PARENT: data.survey_id }));
          if (data.is_paid) useAppStore.getState().setIsPaid(true);
          setActiveTab('parent');
        } else if (data.type === 'HARMONY') {
          setHarmonyAiReport(analysis);
          setDbChildId(data.child_id);
          setDbSurveyIds(prev => ({ ...prev, PARENTING_STYLE: data.survey_id }));
          // 조화 분석 시에는 아이/양육자 점수가 모두 필요할 수 있으므로 저장된 데이터가 있다면 복원
          if (data.is_paid) useAppStore.getState().setIsPaid(true);
          setActiveTab('parenting');
        }
      }
    } catch (e) {
      console.error('Failed to load report:', e);
      alert('리포트를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 안A: 아이 리포트 선공 - 아동 설문 완료 직후 자동으로 AI 리포트 생성
  useEffect(() => {
    if (isChildOnly && !childAiReport && !isGenerating && !reportId && Object.keys(cbqResponses).length > 0) {
      generateChildAIReport();
    }
  }, [isChildOnly, reportId]);

  // 결제 완료 시 프리미엄 리포트 재생성
  // 아이 진단 탭 진입 시 리포트가 없으면 자동 생성
  useEffect(() => {
    const hasCbq = Object.keys(cbqResponses).length > 0 || !!savedChildScores;
    if (!isGenerating && !reportId && hasCbq && !childAiReport) {
      generateChildAIReport();
    }
  }, [cbqResponses, savedChildScores, childAiReport]);

  const handleTabChange = (tab: 'child' | 'parent' | 'parenting') => {
    setActiveTab(tab);
  };

  // DB 저장 헬퍼
  const ensureChildAndSurvey = async (type: 'CHILD' | 'PARENT' | 'PARENTING_STYLE') => {
    if (!user) return { childId: null, surveyId: null };

    try {
      let childId = dbChildId;
      // 1. 아이 프로필 생성/확인
      if (!childId) {
        const child = await db.createChild({
          parent_id: user.id,
          name: intake.childName || '아이',
          gender: (intake.gender as 'male' | 'female') || 'male',
          birth_date: intake.birthDate || new Date().toISOString().split('T')[0],
          birth_time: intake.birthTime,
          image_url: null,
        });
        childId = child.id;
        setDbChildId(childId);
      }

      // 2. 설문 응답 저장
      let surveyId = dbSurveyIds[type];
      if (!surveyId) {
        const responses = type === 'CHILD' ? cbqResponses : (type === 'PARENT' ? atqResponses : parentingResponses);
        const scores = type === 'CHILD' ? childScores : (type === 'PARENT' ? parentScores : styleScores);

        const survey = await db.saveSurvey({
          user_id: user.id,
          child_id: childId,
          type,
          answers: responses as any,
          scores: scores as any,
          status: 'COMPLETED'
        });
        surveyId = survey.id;
        setDbSurveyIds(prev => ({ ...prev, [type]: surveyId }));
      }

      return { childId, surveyId };
    } catch (e) {
      console.error('DB Sync Error:', e);
      return { childId: null, surveyId: null };
    }
  };

  const generateChildAIReport = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const scores = childScores;
      const answers = Object.entries(cbqResponses).map(([id, score]) => ({
        questionId: id,
        score: score as number
      }));
      const res = await fetch('/api/llm/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: intake.childName || '아이',
          scores,
          type: 'CHILD',
          answers,
          isPreview: !isPaid,
          childType: { label: childType.label, keywords: childType.keywords, desc: childType.desc }
        })
      });
      if (!res.ok) throw new Error('Report generation failed');
      const data = await res.json();
      setChildAiReport(data.report);

      // DB 저장
      const { childId, surveyId } = await ensureChildAndSurvey('CHILD');
      if (user && childId && surveyId) {
        await db.saveReport({
          user_id: user.id,
          child_id: childId,
          survey_id: surveyId,
          type: 'CHILD',
          analysis_json: data.report as any,
          model_used: 'gpt-4o',
          is_paid: isPaid
        });
      }
    } catch (error) {
      console.error(error);
      alert('리포트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateParentAIReport = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const scores = parentScores;
      const answers = Object.entries(atqResponses).map(([id, score]) => ({
        questionId: id,
        score: score as number
      }));
      const res = await fetch('/api/llm/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userName: '양육자', 
          scores, 
          type: 'PARENT', 
          answers,
          isPreview: !isPaid
        })
      });
      if (!res.ok) throw new Error('Report generation failed');
      const data = await res.json();
      setParentAiReport(data.report);

      // DB 저장
      const { childId, surveyId } = await ensureChildAndSurvey('PARENT');
      if (user && childId && surveyId) {
        await db.saveReport({
          user_id: user.id,
          child_id: childId, // Parent reports are also linked to a child
          survey_id: surveyId,
          type: 'PARENT',
          analysis_json: data.report as any,
          model_used: 'gpt-4o',
          is_paid: isPaid
        });
      }
    } catch (error) {
      console.error(error);
      alert('리포트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHarmonyAIReport = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      // 모든 응답 통합 (양육 태도 포함)
      const answers = [
        ...Object.entries(cbqResponses),
        ...Object.entries(atqResponses),
        ...Object.entries(parentingResponses)
      ].map(([id, score]) => ({
        questionId: id,
        score: score as number
      }));

      const res = await fetch('/api/llm/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: intake.childName || '아이',
          scores: childScores,
          parentScores: parentScores,
          type: 'HARMONY',
          answers,
          isPreview: false,
          childType: { label: childType.label, keywords: childType.keywords },
          parentType: { label: parentType.label, keywords: parentType.keywords }
        })
      });
      if (!res.ok) throw new Error('Harmony report generation failed');
      const data = await res.json();
      setHarmonyAiReport(data.report);

      // DB 저장 (Harmony는 우선 설문 데이터와 연결하여 'CHILD' 타입 리포트로 확장 저장)
      const { childId, surveyId } = await ensureChildAndSurvey('PARENTING_STYLE');
      if (user && childId && surveyId) {
        await db.saveReport({
          user_id: user.id,
          child_id: childId,
          survey_id: surveyId,
          type: 'HARMONY', // Changed to HARMONY type
          analysis_json: data.report as any,
          model_used: 'gpt-4o',
          is_paid: isPaid
        });
      }
    } catch (error) {
      console.error(error);
      alert('조화 분석 리포트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIReport = async () => {
    if (activeTab === 'child') await generateChildAIReport();
    else if (activeTab === 'parent') await generateParentAIReport();
    else if (activeTab === 'parenting') await generateHarmonyAIReport();
  };

  const childScores = useMemo(() => {
    if (savedChildScores) return savedChildScores;
    return TemperamentScorer.calculate(CHILD_QUESTIONS, cbqResponses as any);
  }, [cbqResponses, savedChildScores]);

  const parentScores = useMemo(() => {
    if (savedParentScores) return savedParentScores;
    return TemperamentScorer.calculate(PARENT_QUESTIONS, atqResponses as any);
  }, [atqResponses, savedParentScores]);

  // Parenting Style Scores
  const styleScores = useMemo(() => {
    if (savedStyleScores) return savedStyleScores;
    const scores = { Efficacy: 0, Autonomy: 0, Responsiveness: 0 };
    const counts = { Efficacy: 0, Autonomy: 0, Responsiveness: 0 };

    PARENTING_STYLE_QUESTIONS.forEach(q => {
      const answer = parentingResponses[q.id.toString()];
      if (answer) {
        const cat = q.category as keyof typeof scores;
        if (cat in scores) {
          scores[cat] += answer;
          counts[cat]++;
        }
      }
    });
    return {
      Efficacy: counts.Efficacy > 0 ? Math.round((scores.Efficacy / (counts.Efficacy * 5)) * 100) : 0,
      Autonomy: counts.Autonomy > 0 ? Math.round((scores.Autonomy / (counts.Autonomy * 5)) * 100) : 0,
      Responsiveness: counts.Responsiveness > 0 ? Math.round((scores.Responsiveness / (counts.Responsiveness * 5)) * 100) : 0,
    }
  }, [parentingResponses]);

  // Temperament Classification
  const childType = useMemo(() => TemperamentClassifier.analyzeChild(childScores), [childScores]);
  const harmony = useMemo(() => TemperamentClassifier.analyzeHarmony(childScores, parentScores), [childScores, parentScores]);
  const prescription = useMemo(() => PRESCRIPTION_DATA[childType.label] || PRESCRIPTION_DATA["무한한 잠재력의 아이"], [childType]);

  const isStyleSurveyComplete = useMemo(() => {
    return PARENTING_STYLE_QUESTIONS.every(q => !!parentingResponses[q.id.toString()]);
  }, [parentingResponses]);

  const parentReport = useMemo(() => ParentClassifier.analyze(parentScores), [parentScores]);
  const parentType = useMemo(() => TemperamentClassifier.analyzeParent(parentScores), [parentScores]);
  const isParentSurveyComplete = useMemo(() => Object.keys(atqResponses).length >= PARENT_QUESTIONS.length, [atqResponses]);

  const isChildSurveyComplete = useMemo(() => {
    return Object.keys(cbqResponses).length > 0 || !!savedChildScores;
  }, [cbqResponses, savedChildScores]);

  const radarData = {
    labels: [
      TCI_TERMINOLOGY.DIMENSIONS.NS.name,
      TCI_TERMINOLOGY.DIMENSIONS.HA.name,
      TCI_TERMINOLOGY.DIMENSIONS.RD.name,
      TCI_TERMINOLOGY.DIMENSIONS.P.name
    ],
    datasets: [
      {
        label: TCI_TERMINOLOGY.REPORT.CHILD_NAME,
        data: [childScores.NS, childScores.HA, childScores.RD, childScores.P],
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderColor: '#3B82F6',
        borderWidth: 2.5,
        pointBackgroundColor: '#3B82F6',
        pointRadius: 4,
      },
      {
        label: TCI_TERMINOLOGY.REPORT.PARENT_NAME,
        data: [parentScores.NS, parentScores.HA, parentScores.RD, parentScores.P],
        backgroundColor: 'rgba(249, 115, 22, 0.12)',
        borderColor: '#F97316',
        borderWidth: 2,
        pointBackgroundColor: '#F97316',
        pointRadius: 4,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { display: true, color: 'rgba(0,0,0,0.05)' },
        grid: { color: 'rgba(0,0,0,0.05)' },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false, stepSize: 20 },
        pointLabels: {
          font: { size: 11, weight: 'bold' as const },
          color: '#64748b'
        }
      },
    },
    plugins: {
      legend: { display: false }
    }
  };

  const barData = {
    labels: ['양육 효능감', '자율성 지지', '정서적 반응성'],
    datasets: [
      {
        data: [styleScores.Efficacy, styleScores.Autonomy, styleScores.Responsiveness],
        backgroundColor: ['#FFD93D', '#6C5CE7', '#FF6B6B'],
        borderRadius: 8,
        barThickness: 32,
      }
    ]
  };

  // Temperament Harmony Index (THI) Logic
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { display: false },
        ticks: { font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: 'bold' as const } }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  const ghiScore = useMemo(() => {
    const diff =
      Math.abs(childScores.NS - parentScores.NS) +
      Math.abs(childScores.HA - parentScores.HA) +
      Math.abs(childScores.RD - parentScores.RD) +
      Math.abs(childScores.P - parentScores.P);
    return diff / 4;
  }, [childScores, parentScores]);

  const analysisResult = useMemo(() => {
    let type = 'NORMAL';
    let message = '서로 다른 기질이지만, 양육자의 노력으로 균형을 맞춰가고 있습니다.';
    const isHighGHI = ghiScore >= 40;
    const isConflictPattern = childScores.NS >= 70 && parentScores.HA >= 70;

    if (isHighGHI || isConflictPattern) {
      if (styleScores.Autonomy >= 70) {
        type = 'MITIGATED';
        message = '기질적인 차이가 크지만, 양육자의 높은 [자율성 지지] 덕분을 통해 아이가 이를 건강하게 극복하고 있습니다.';
      } else if (styleScores.Responsiveness <= 50) {
        type = 'CRISIS';
        message = '현재 기질적 갈등이 심화되고 있습니다. 아이의 마음을 먼저 읽어주는 [정서적 반응성]을 높이는 노력이 필요합니다.';
      } else {
        message = '기질 차이로 인한 갈등 가능성이 있습니다. 서로의 다름을 인정하는 대화가 필요합니다.';
      }
    }
    return { type, message };
  }, [ghiScore, childScores, parentScores, styleScores]);

  const ghiColor = ghiScore < 25 ? 'text-teal-600' : (ghiScore < 55 ? 'text-indigo-600' : 'text-rose-500');
  const ghiBg = ghiScore < 25 ? 'bg-teal-500' : (ghiScore < 55 ? 'bg-indigo-500' : 'bg-rose-500');
  const ghiLabel = ghiScore < 25 ? '안정적 조화' : (ghiScore < 55 ? '균형 잡힌 관계' : '주의 깊은 관찰 필요');

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 min-h-screen flex flex-col items-center font-body">
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark h-full min-h-screen flex flex-col shadow-2xl overflow-x-hidden relative">
        <main className={`flex-1 overflow-y-auto no-scrollbar ${isChildOnly ? 'pb-40' : 'pb-24'}`}>
          {/* Header Overlay */}
          <div className="relative z-10">
            {/* 히어로 이미지 */}
            <div className="relative">
              {/* Top Navigation Bar */}
              <div className="absolute top-0 left-0 right-0 pt-12 px-6 z-20 flex items-center justify-between">
                <button
                  onClick={() => router.back()}
                  className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-text-main backdrop-blur-sm border border-white/40 hover:bg-white/80 transition-colors"
                  aria-label="뒤로 가기"
                >
                  <Icon name="arrow_back" size="sm" />
                </button>
                {isLocalhost && (
                  <button
                    onClick={() => setIsPaid(!isPaid)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black backdrop-blur-sm border transition-colors ${isPaid ? 'bg-green-500/80 text-white border-green-400' : 'bg-red-500/80 text-white border-red-400'}`}
                  >
                    {isPaid ? 'PAID' : 'FREE'}
                  </button>
                )}
              </div>

              <div key={activeTab} className="animate-in fade-in duration-500">
                {activeTab === 'child' ? (
                  isChildSurveyComplete ? (
                    <img src={childType.image} alt={childType.label} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-gradient-to-b from-[#FFF8F0] to-[#FFF3E4]" />
                  )
                ) : activeTab === 'parent' ? (
                  isParentSurveyComplete ? (
                    <img src={parentType.image} alt={parentType.label} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9]" />
                  )
                ) : (
                  <div className="w-full aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#F5EDE4] to-[#E8DDD3] flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-[57%] h-[90%] rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-[-3deg] z-10 -mt-8">
                        <img src={childType.image} alt={childType.label} className="w-full h-full object-cover" />
                      </div>
                      <div className="w-[50%] h-[82%] rounded-2xl overflow-hidden border-4 border-white shadow-lg rotate-[5deg] -ml-[9%] -mt-4 z-0">
                        <img src={parentType.image} alt={parentType.label} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Switcher - 아이 리포트 선공 모드에서는 숨김 */}
            {!isChildOnly && (
              <div className="dark:bg-surface-dark px-6 pt-6 pb-2 -mt-6 rounded-t-3xl relative z-10" style={{ backgroundColor: 'var(--background-light)' }}>
                <div className="p-1 rounded-2xl flex gap-1 border border-beige-main/20 shadow-sm" style={{ backgroundColor: 'var(--background-light)' }}>
                  <button
                    onClick={() => handleTabChange('child')}
                    className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all ${activeTab === 'child' ? 'bg-primary text-white shadow-md' : 'text-text-sub hover:text-text-main hover:bg-beige-light/50'}`}
                  >
                    아이 진단
                  </button>
                  <button
                    onClick={() => {
                      if (isParentSurveyComplete) handleTabChange('parent');
                      else if (confirm('양육자 기질 검사를 먼저 완료해야 확인할 수 있어요. 지금 시작할까요?')) {
                        router.replace('/survey?type=PARENT');
                      }
                    }}
                    className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all ${activeTab === 'parent' ? 'bg-primary text-white shadow-md' : 'text-text-sub hover:text-text-main hover:bg-beige-light/50'}`}
                  >
                    양육자 분석
                  </button>
                  <button
                    onClick={() => {
                      if (isStyleSurveyComplete) handleTabChange('parenting');
                      else if (confirm('양육 태도 검사를 먼저 완료해야 확인할 수 있어요. 지금 시작할까요?')) {
                        router.replace('/survey?type=STYLE');
                      }
                    }}
                    className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all ${activeTab === 'parenting' ? 'bg-primary text-white shadow-md' : 'text-text-sub hover:text-text-main hover:bg-beige-light/50'}`}
                  >
                    기질 맞춤 양육
                  </button>
                </div>
              </div>
            )}

            {/* 유형 정보 */}
            <div key={`info-${activeTab}`} className={`dark:bg-surface-dark text-center px-6 ${!isChildOnly ? 'pt-4' : 'pt-8 -mt-6 rounded-t-3xl'} pb-4 space-y-3 relative z-10 animate-in fade-in duration-500`} style={{ backgroundColor: 'var(--background-light)' }}>
              {activeTab === 'child' ? (
                <>
                  <p className="text-text-sub text-sm font-medium">{intake.childName || '아이'}의 기질 유형</p>
                  <h1 className="text-3xl font-black text-text-main dark:text-white tracking-tight">
                    {childType.label}
                  </h1>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {childType.keywords.map((kw: string) => (
                      <span key={kw} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-bold">#{kw}</span>
                    ))}
                  </div>
                  <p className="text-text-sub text-[13px] break-keep">{childType.desc}</p>
                </>
              ) : activeTab === 'parent' ? (
                <>
                  <p className="text-text-sub text-sm font-medium">양육자의 기질 유형</p>
                  <h1 className="text-3xl font-black text-text-main dark:text-white tracking-tight">
                    {parentType.label}
                  </h1>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {parentType.keywords.map((kw: string) => (
                      <span key={kw} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-bold">#{kw}</span>
                    ))}
                  </div>
                  <p className="text-text-sub text-[13px] break-keep">{parentType.desc}</p>
                </>
              ) : (
                <>
                  <p className="text-text-sub text-sm font-medium">기질 맞춤 양육 리포트</p>
                  <h1 className="text-3xl font-black text-text-main dark:text-white tracking-tight">
                    {intake.childName || '아이'}와 양육자
                  </h1>
                  <p className="text-text-sub text-[13px] break-keep">두 사람의 기질 궁합과 맞춤 양육 가이드</p>
                </>
              )}
            </div>
            {/* child_only 모드: 헤더와 컨텐츠 사이 간격 */}
            {isChildOnly && <div className="h-8" />}
          </div>

          <div className="max-w-2xl mx-auto px-6 space-y-8 relative z-20">
            {activeTab === 'child' ? (
              !isChildSurveyComplete ? (
                /* Child Survey Onboarding */
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-10 shadow-card border border-beige-main/20 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="w-40 h-40 bg-primary/5 rounded-full flex items-center justify-center text-7xl relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20"></div>
                    🎁
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-black text-text-main dark:text-white leading-tight">
                      {intake.childName || '아이'}의 기질을<br />알아볼 시간이에요!
                    </h2>
                    <p className="text-text-sub dark:text-slate-400 text-[15px] leading-relaxed break-keep px-4">
                      아이의 타고난 빛을 발견하기 위한<br />
                      첫 번째 단계, 기질 검사를 먼저 시작해볼까요?<br />
                      <span className="text-[12px] opacity-70 mt-2 block">(약 3-5분 정도 소요됩니다)</span>
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    className="h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
                    onClick={() => router.replace('/survey')}
                  >
                    기질 검사 시작하기
                  </Button>
                </div>
              ) : (
                <>
                  {childAiReport ? (
                    <div className="space-y-5 animate-fade-in">
                      {/* 1. 아이나의 한마디 */}
                      <section className="bg-white dark:bg-surface-dark rounded-2xl px-6 py-5 shadow-card border border-beige-main/10">
                        <p className="text-[12px] font-black text-primary mb-2.5 flex items-center gap-1.5">
                          <Icon name="chat_bubble" size="sm" /> 아이나의 한마디
                        </p>
                        <p className="text-[15px] text-text-main dark:text-slate-300 leading-[1.85] break-keep">
                          {childAiReport.intro}
                        </p>
                      </section>

                      {/* 2. 기질 점수 카드 */}
                      <section className="bg-white dark:bg-surface-dark rounded-2xl px-6 py-6 shadow-card border border-beige-main/10 space-y-5">
                        <p className="text-[12px] font-black text-text-main dark:text-white flex items-center gap-1.5">
                          <Icon name="bar_chart" size="sm" /> {intake.childName || '아이'}의 기질 점수
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {([
                            { key: 'NS', label: '자극 추구', color: '#E5A150', desc: '새로운 것에 끌리는 정도' },
                            { key: 'HA', label: '위험 회피', color: '#6B9E8A', desc: '조심하고 경계하는 정도' },
                            { key: 'RD', label: '사회적 민감성', color: '#7B8EC4', desc: '타인 반응에 민감한 정도' },
                            { key: 'P', label: '인내력', color: '#D4805E', desc: '꾸준히 해내는 정도' },
                          ] as const).map(dim => {
                            const score = childScores[dim.key as keyof typeof childScores];
                            return (
                              <div key={dim.key} className="bg-background-light dark:bg-background-dark rounded-xl p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-text-sub">{dim.label}</span>
                                  <span className="text-[16px] font-black" style={{ color: dim.color }}>{score}</span>
                                </div>
                                <div className="w-full h-2 bg-white dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: dim.color }} />
                                </div>
                                <p className="text-[10px] text-text-sub leading-tight">{dim.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </section>

                      {/* 3. 기질 요소별 해석 */}
                      {childAiReport.analysis?.dimensions && (
                        <section className="bg-white dark:bg-surface-dark rounded-2xl px-6 py-5 shadow-card border border-beige-main/10 space-y-4">
                          <p className="text-[12px] font-black text-text-main dark:text-white flex items-center gap-1.5">
                            <Icon name="psychology" size="sm" /> 기질 요소별 해석
                          </p>
                          {([
                            { key: 'NS', label: '자극 추구', color: '#E5A150', icon: '🔥' },
                            { key: 'HA', label: '위험 회피', color: '#6B9E8A', icon: '🛡️' },
                            { key: 'RD', label: '사회적 민감성', color: '#7B8EC4', icon: '💙' },
                            { key: 'P', label: '인내력', color: '#D4805E', icon: '⏳' },
                          ] as const).map(dim => {
                            const text = (childAiReport.analysis?.dimensions as any)?.[dim.key];
                            if (!text) return null;
                            return (
                              <div key={dim.key} className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{dim.icon}</span>
                                  <span className="text-[12px] font-bold" style={{ color: dim.color }}>{dim.label}</span>
                                  <span className="text-[12px] font-black" style={{ color: dim.color }}>{childScores[dim.key as keyof typeof childScores]}점</span>
                                </div>
                                <p className="text-[14px] text-text-sub dark:text-slate-400 leading-[1.8] break-keep pl-6">
                                  {text}
                                </p>
                              </div>
                            );
                          })}
                        </section>
                      )}

                      {/* 4. 아이의 숨겨진 속마음 */}
                      {childAiReport.analysis?.insight && (
                        <section className="space-y-3">
                          <p className="text-[12px] font-black text-primary flex items-center gap-1.5 px-1">
                            <Icon name="favorite" size="sm" /> 아이의 숨겨진 속마음
                          </p>
                          {Array.isArray(childAiReport.analysis.insight) ? (
                            childAiReport.analysis.insight.map((item: any, idx: number) => (
                              <div key={idx} className="bg-white dark:bg-surface-dark rounded-2xl px-6 py-5 shadow-card border border-beige-main/10 space-y-2">
                                <p className="text-[11px] font-black text-primary/70">{item.scene}</p>
                                <p className="text-[14px] text-text-sub dark:text-slate-400 leading-[1.85] break-keep">
                                  {item.content}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="bg-white dark:bg-surface-dark rounded-2xl px-6 py-5 shadow-card border border-beige-main/10">
                              <p className="text-[14px] text-text-sub dark:text-slate-400 leading-[1.85] break-keep whitespace-pre-wrap">
                                {childAiReport.analysis.insight}
                              </p>
                            </div>
                          )}
                        </section>
                      )}

                      {/* 6. 강점 + 성장 가능성 */}
                      {childAiReport.analysis?.strengths && (
                        <section className="bg-white dark:bg-surface-dark rounded-2xl px-6 py-5 shadow-card border border-beige-main/10 space-y-2.5">
                          <p className="text-[12px] font-black text-text-main dark:text-white flex items-center gap-1.5">
                            <Icon name="emoji_events" size="sm" /> 강점과 성장 가능성
                          </p>
                          <p className="text-[14px] text-text-main dark:text-slate-300 leading-[1.85] break-keep whitespace-pre-wrap">
                            {childAiReport.analysis.strengths}
                          </p>
                        </section>
                      )}

                      {/* 7. 양육 가이드 */}
                      {childAiReport.parentingTips && childAiReport.parentingTips.length > 0 && (
                        <section className="space-y-3">
                          <p className="text-[12px] font-black text-text-main dark:text-white flex items-center gap-1.5 px-1">
                            <Icon name="lightbulb" size="sm" /> 양육 가이드
                          </p>
                          {childAiReport.parentingTips.map((tip: any, idx: number) => (
                            <div key={idx} className="bg-white dark:bg-surface-dark rounded-2xl px-6 py-5 shadow-card border border-beige-main/10">
                              <h6 className="font-bold text-text-main dark:text-white mb-3 text-[14px]">
                                {tip.situation}
                              </h6>
                              <ul className="space-y-2.5">
                                {tip.tips?.map((t: string, i: number) => (
                                  <li key={i} className="text-[14px] text-text-sub dark:text-slate-400 flex gap-2">
                                    <span className="text-primary mt-0.5 shrink-0">•</span>
                                    <span className="leading-relaxed break-keep">{t}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </section>
                      )}

                      {/* 7. 마법의 한마디 */}
                      {childAiReport.scripts && childAiReport.scripts.length > 0 && (
                        <section className="space-y-3">
                          <p className="text-[12px] font-black text-text-main dark:text-white flex items-center gap-1.5 px-1">
                            <Icon name="record_voice_over" size="sm" /> 마법의 한마디
                          </p>
                          {childAiReport.scripts.map((s: any, idx: number) => (
                            <div key={idx} className="bg-white dark:bg-surface-dark rounded-2xl px-6 py-5 shadow-card border border-beige-main/10 space-y-2">
                              <p className="text-[12px] font-bold text-text-sub">{s.situation}</p>
                              <p className="text-[16px] font-black text-primary leading-snug break-keep">&ldquo;{s.script}&rdquo;</p>
                              <p className="text-[13px] text-text-sub leading-relaxed break-keep">{s.guide}</p>
                            </div>
                          ))}
                        </section>
                      )}
                    </div>
                  ) : (
                    <div className="py-16 flex flex-col items-center gap-4 animate-fade-in">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-text-sub text-sm font-bold">아이의 기질을 분석하고 있어요...</p>
                      <p className="text-text-sub/60 text-[12px]">잠시만 기다려주세요</p>
                    </div>
                  )}

                  {/* Footer Actions */}
                  {!isChildOnly && childAiReport && (
                    <div className="flex flex-col gap-4 pt-10 pb-10 text-center">
                      <Button variant="secondary" onClick={() => router.replace('/share')} fullWidth className="h-14 rounded-2xl border-none bg-white shadow-lg">
                        결과 공유하고 할인권 받기
                      </Button>
                      <Link href="/" className="text-slate-400 text-sm font-bold hover:text-primary transition-colors">
                        홈으로 돌아가기
                      </Link>
                    </div>
                  )}
                </>
              )
            ) : activeTab === 'parent' ? (
              <div className="animate-fade-in space-y-12">
                {/* Parent Report Header */}
                <header className="text-center space-y-4 py-6">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Parent Self-Report</div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-snug break-keep">
                    양육자 <span className="text-primary">나</span>의<br />중심을 잡는 마음 기질
                  </h2>
                  <p className="text-slate-500 text-[13px] font-medium leading-relaxed break-keep">
                    당신은 누군가의 양육자이기 이전에,<br />그 자체로 고유한 결을 가진 소중한 사람입니다.
                  </p>
                </header>

                {/* Parent Section 1-3: 규칙 기반 요약 (AI 리포트 없을 때만 표시) */}
                {!parentAiReport && (
                  <>
                    <section className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                      <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">01. 나의 기질 분석</span>
                          <h3 className="text-xl font-black text-slate-800 dark:text-white">{parentReport.soilName}</h3>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                          <p className="text-slate-600 dark:text-slate-300 text-[14px] leading-relaxed break-keep font-medium italic">
                            {parentReport.analysis}
                          </p>
                        </div>
                      </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <section className="bg-[#fff9f0] rounded-[2.5rem] p-8 shadow-sm border border-orange-100 relative overflow-hidden">
                        <div className="absolute top-4 right-6 text-2xl">✨</div>
                        <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-1">02. 나의 마법의 계절</span>
                        <h4 className="text-md font-bold text-slate-800 mb-2">내가 가장 빛나는 순간</h4>
                        <p className="text-[12px] text-slate-600 leading-relaxed break-keep">
                          {parentReport.magicSeason}
                        </p>
                      </section>
                      <section className="bg-[#f0f9ff] rounded-[2.5rem] p-8 shadow-sm border border-blue-100 relative overflow-hidden">
                        <div className="absolute top-4 right-6 text-2xl">☁️</div>
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">03. 마음의 가뭄</span>
                        <h4 className="text-md font-bold text-slate-800 mb-2">에너지가 고갈되는 신호</h4>
                        <p className="text-[12px] text-slate-600 leading-relaxed break-keep">
                          {parentReport.drought}
                        </p>
                      </section>
                    </div>
                  </>
                )}

                {/* 양육자 AI 심층 분석 리포트 (JSON 기반) */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="font-black text-slate-800 dark:text-white text-xl flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">👤</span>
                      양육자 기질 심층 분석
                    </h3>
                  </div>

                  {parentAiReport ? (
                    <div className="relative group">
                      <div className="space-y-8 animate-fade-in-up">
                        {/* 타이틀 카드 - 무료 공개 */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-xl border-l-[12px] border-indigo-500 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-black italic">YOU</div>
                          <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-4 leading-tight">
                            {parentAiReport.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed break-keep font-medium">
                            {parentAiReport.intro}
                          </p>
                        </div>

                        {/* 심층 분석 섹션 - 결제 시에만 공개 (블러 처리) */}
                        <div className={`space-y-8 transition-all duration-1000 ${!isPaid ? 'blur-xl grayscale opacity-40 pointer-events-none select-none' : ''}`}>
                          {/* 양육자 기질 섹션들 */}
                          <div className="space-y-6">
                            {parentAiReport.sections?.map((section: any) => (
                              <div key={section.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-lg border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                  <h5 className="font-black text-slate-800 dark:text-white text-lg">{section.heading}</h5>
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-500">{section.badge}</span>
                                </div>
                                <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed break-keep whitespace-pre-wrap">
                                  {section.content}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* 퍼스널 솔루션 */}
                          {parentAiReport.solutions && parentAiReport.solutions.length > 0 && (
                            <div className="bg-indigo-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32"></div>
                              <h5 className="text-white font-black text-lg mb-8 flex items-center gap-2">
                                <span className="text-2xl">💊</span> 나를 위한 마음 영양제
                              </h5>
                              <div className="space-y-6">
                                {parentAiReport.solutions?.map((sol: any, idx: number) => (
                                  <div key={idx} className="bg-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                                    <h6 className="text-primary font-bold mb-2">{sol.name}</h6>
                                    <p className="text-white text-[14px] leading-relaxed mb-3">{sol.action}</p>
                                    <div className="text-[11px] text-white/40 flex items-center gap-2">
                                      <span className="shrink-0">💡 근거:</span>
                                      <span>{sol.reason}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 다정한 편지 */}
                          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-[2.5rem] p-10 text-center relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-md px-4 py-1 rounded-full text-xs font-bold text-rose-500">
                              From. 아이나
                            </div>
                            <p className="text-rose-700 dark:text-rose-300 italic leading-loose break-keep font-serif text-lg py-4">
                              "{parentAiReport.letter}"
                            </p>
                          </div>
                        </div>
                      </div>

                      {!isPaid && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4">
                          <div className="w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-indigo-200 text-center animate-in zoom-in-95 duration-500 space-y-6">
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-4xl mb-2">🧘</div>
                            <div className="space-y-2">
                              <h4 className="text-2xl font-black text-slate-800 dark:text-white break-keep">나를 위한 쉼표가 필요하신가요?</h4>
                              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed break-keep px-4">
                                양육자로서의 나를 깊이 이해하고<br />
                                지치지 않는 양육 에너지를 채워주는 전문 리포트입니다.
                              </p>
                            </div>
                            <div className="pt-4 space-y-4">
                              <Button onClick={() => router.replace('/payment')} variant="primary" fullWidth className="h-16 rounded-2xl font-black text-lg bg-indigo-600 shadow-xl shadow-indigo-200 hover:bg-indigo-700">
                                990원에 양육자 정밀 분석 열기
                              </Button>
                              <p className="text-[10px] text-slate-400 font-medium">나를 먼저 돌보는 인지가 조화로운 육아의 시작입니다</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 text-center space-y-6 shadow-xl">
                      <div className="w-20 h-20 mx-auto bg-indigo-50 rounded-full flex items-center justify-center text-3xl">
                        🧘
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 dark:text-white">나의 기질 분석이 준비되었습니다</h4>
                        <p className="text-sm text-slate-500 leading-relaxed break-keep">
                          나의 타고난 성향을 깊이 있게 이해하고<br />
                          지치지 않는 양육을 위한 에너지를 얻으세요.
                        </p>
                      </div>
                      <Button
                        onClick={generateAIReport}
                        variant="primary"
                        fullWidth
                        className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700"
                        disabled={isGenerating}
                      >
                        {isGenerating ? '분석 중...' : '양육자 전문 리포트 생성하기'}
                      </Button>
                    </div>
                  )}
                </section>

                {/* Footer Actions */}
                <div className="flex flex-col gap-4 pt-10 pb-10 text-center">
                  <Button variant="secondary" onClick={() => router.replace('/share')} fullWidth className="h-14 rounded-2xl border-none bg-white shadow-lg">
                    나의 결과 공유하기
                  </Button>
                  <Link href="/" className="text-slate-400 text-sm font-bold hover:text-primary transition-colors">
                    홈으로 돌아가기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in space-y-6">
                {/* 1. 레이더 차트 - 무료 */}
                <section className="bg-white dark:bg-surface-dark rounded-2xl px-4 pt-4 pb-2 shadow-card border border-beige-main/20 mt-2">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-black text-text-main dark:text-white text-sm flex items-center gap-2">
                      <Icon name="analytics" size="sm" /> 기질 비교
                    </h3>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-[2px] bg-[#3B82F6]" />
                        <span className="text-[10px] font-bold text-text-sub w-[52px] text-right">아이기질</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-[2px] bg-[#F97316]" />
                        <span className="text-[10px] font-bold text-text-sub w-[52px] text-right">양육자기질</span>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-[280px] mx-auto">
                    <Radar data={radarData} options={radarOptions} />
                  </div>
                </section>

                {harmonyAiReport ? (
                  <>
                    {/* 레거시 구조 감지: dynamics 필드가 있으면 기존 UI */}
                    {harmonyAiReport.dynamics ? (
                      <section className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-card border border-beige-main/20 text-center space-y-4">
                          <h4 className="text-2xl font-black text-text-main dark:text-white">{harmonyAiReport.harmonyTitle}</h4>
                          <span className="text-4xl font-black text-primary">{harmonyAiReport.compatibilityScore}%</span>
                          <p className="text-text-sub text-[13px] leading-relaxed break-keep">{harmonyAiReport.dynamics?.description}</p>
                          <Button
                            onClick={() => { setHarmonyAiReport(null); }}
                            variant="secondary"
                            fullWidth
                            className="h-12 rounded-2xl mt-4"
                          >
                            새로운 양육 가이드로 업그레이드
                          </Button>
                        </div>
                      </section>
                    ) : (
                      <>
                        {/* 2. 관계 카드 - 무료 */}
                        <section className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-card border border-beige-main/20 text-center space-y-3">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Our Harmony</p>
                          <h4 className="text-2xl font-black text-text-main dark:text-white leading-tight">{harmonyAiReport.harmonyTitle}</h4>
                          <span className="inline-block text-4xl font-black text-primary">{harmonyAiReport.compatibilityScore}<span className="text-lg">%</span></span>
                          <p className="text-text-sub text-[14px] break-keep">{harmonyAiReport.oneLiner}</p>
                        </section>

                        {/* 3. 상세 영역 */}
                        <div>
                          <div className="space-y-10">

                            {/* 4. 핵심 기질 차이 */}
                            {harmonyAiReport.coreGap && (
                              <section className="bg-white dark:bg-surface-dark rounded-2xl p-7 shadow-card border border-beige-main/20 space-y-5">
                                <h3 className="font-black text-text-main dark:text-white text-base flex items-center gap-2">
                                  <Icon name="compare_arrows" size="sm" /> 핵심 기질 차이
                                </h3>
                                <div className="flex items-center justify-between bg-beige-light/50 dark:bg-slate-800 rounded-xl p-4">
                                  <div className="text-center flex-1">
                                    <p className="text-[10px] font-bold text-teal-500 mb-1">아이</p>
                                    <span className="text-2xl font-black text-text-main dark:text-white">{harmonyAiReport.coreGap.childScore}</span>
                                  </div>
                                  <div className="text-center px-4">
                                    <span className="text-[11px] font-black text-text-sub px-3 py-1 rounded-full bg-white dark:bg-slate-700 shadow-sm">{harmonyAiReport.coreGap.label}</span>
                                  </div>
                                  <div className="text-center flex-1">
                                    <p className="text-[10px] font-bold text-orange-400 mb-1">양육자</p>
                                    <span className="text-2xl font-black text-text-main dark:text-white">{harmonyAiReport.coreGap.parentScore}</span>
                                  </div>
                                </div>
                                <p className="text-text-sub text-[13px] leading-relaxed break-keep">{harmonyAiReport.coreGap.insight}</p>
                                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                  <p className="text-primary text-[13px] font-bold break-keep">{harmonyAiReport.coreGap.reframe}</p>
                                </div>
                              </section>
                            )}

                            {/* 5. 양육 원칙 */}
                            {harmonyAiReport.parentingPrinciples && (
                              <section className="space-y-4">
                                <h3 className="font-black text-text-main dark:text-white text-base flex items-center gap-2 px-1">
                                  <Icon name="school" size="sm" /> 양육 원칙
                                </h3>
                                {harmonyAiReport.parentingPrinciples.map((p: any, idx: number) => (
                                  <div key={idx} className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card border border-beige-main/20 space-y-3">
                                    <h4 className="font-black text-text-main dark:text-white text-[15px]">{idx + 1}. {p.title}</h4>
                                    <p className="text-text-sub text-[13px] leading-relaxed break-keep">{p.why}</p>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-3 border border-green-100">
                                        <p className="text-[10px] font-black text-green-600 mb-1">DO</p>
                                        <p className="text-[12px] text-green-800 dark:text-green-300 break-keep">{p.do}</p>
                                      </div>
                                      <div className="bg-rose-50 dark:bg-rose-900/10 rounded-xl p-3 border border-rose-100">
                                        <p className="text-[10px] font-black text-rose-600 mb-1">DON&apos;T</p>
                                        <p className="text-[12px] text-rose-800 dark:text-rose-300 break-keep">{p.dont}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </section>
                            )}

                            {/* 6. 이럴 때 이렇게 */}
                            {harmonyAiReport.situationalTips && (
                              <section className="space-y-4">
                                <h3 className="font-black text-text-main dark:text-white text-base flex items-center gap-2 px-1">
                                  <Icon name="lightbulb" size="sm" /> 이럴 때 이렇게
                                </h3>
                                {harmonyAiReport.situationalTips.map((tip: any, idx: number) => (
                                  <div key={idx} className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-card border border-beige-main/20 space-y-4">
                                    <h4 className="font-black text-text-main dark:text-white text-[14px]">{tip.situation}</h4>
                                    <div className="bg-teal-50 dark:bg-teal-900/10 rounded-xl p-3 border border-teal-100">
                                      <p className="text-[10px] font-black text-teal-600 mb-1">아이의 속마음</p>
                                      <p className="text-[12px] text-teal-800 dark:text-teal-300 break-keep">{tip.childFeeling}</p>
                                    </div>
                                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-3 border border-amber-100">
                                      <p className="text-[10px] font-black text-amber-600 mb-1">빠지기 쉬운 반응</p>
                                      <p className="text-[12px] text-amber-800 dark:text-amber-300 break-keep">{tip.parentTrap}</p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-3 border border-green-100">
                                      <p className="text-[10px] font-black text-green-600 mb-1">이렇게 해보세요</p>
                                      <p className="text-[12px] text-green-800 dark:text-green-300 break-keep">{tip.betterResponse}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                      <p className="text-[13px] text-text-main dark:text-white font-bold italic break-keep">&ldquo;{tip.script}&rdquo;</p>
                                    </div>
                                  </div>
                                ))}
                              </section>
                            )}

                            {/* 7. 양육 스타일 진단 */}
                            {harmonyAiReport.parentingAudit && (
                              <section className="bg-slate-900 rounded-2xl p-8 shadow-xl space-y-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16"></div>
                                <div className="relative z-10">
                                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Parenting Style</p>
                                  <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[12px] font-black">{harmonyAiReport.parentingAudit.currentStyle}</span>
                                  </div>
                                  <p className="text-slate-300 text-[13px] leading-relaxed break-keep mb-4">{harmonyAiReport.parentingAudit.evaluation}</p>
                                  <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                                    <p className="text-[10px] font-black text-primary mb-2">조절 포인트</p>
                                    <p className="text-white/80 text-[13px] leading-relaxed break-keep">{harmonyAiReport.parentingAudit.adjustment}</p>
                                  </div>
                                </div>
                              </section>
                            )}

                            {/* 8. 오늘의 한 마디 */}
                            {harmonyAiReport.dailyReminder && (
                              <section className="text-center py-8 px-6">
                                <div className="text-4xl mb-4">📌</div>
                                <p className="text-text-main dark:text-white text-xl font-black leading-snug break-keep max-w-[300px] mx-auto">
                                  &ldquo;{harmonyAiReport.dailyReminder}&rdquo;
                                </p>
                                <p className="text-text-sub text-[11px] mt-3">냉장고에 붙여두세요</p>
                              </section>
                            )}
                          </div>

                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <section className="bg-white dark:bg-surface-dark rounded-2xl p-10 text-center space-y-6 shadow-card border border-beige-main/20">
                    <div className="w-20 h-20 mx-auto bg-primary/5 rounded-full flex items-center justify-center text-3xl">
                      🤝
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-text-main dark:text-white">기질 맞춤 양육 가이드</h4>
                      <p className="text-sm text-text-sub leading-relaxed break-keep">
                        아이와 양육자의 기질 조합에 맞는<br />
                        양육 원칙과 구체적인 팁을 제공합니다.
                      </p>
                    </div>
                    <Button
                      onClick={generateHarmonyAIReport}
                      variant="primary"
                      fullWidth
                      className="h-14 rounded-2xl"
                      disabled={isGenerating}
                    >
                      {isGenerating ? '맞춤 양육 가이드 생성 중...' : '맞춤 양육 가이드 생성하기'}
                    </Button>
                  </section>
                )}

                {/* Footer Actions & App Nudge */}
                <div className="space-y-8 pt-10 pb-16">
                  {/* App Download Nudge - 프리미엄 경험 강조 */}
                  <div className="px-2">
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[3rem] p-8 text-center relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl -mr-32 -mt-32"></div>
                      <div className="relative z-10 space-y-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md border border-white/20">
                          <span className="text-3xl animate-bounce-subtle">✨</span>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-white leading-tight">
                            21일 맞춤형<br />실천 플랜이 생성되었습니다
                          </h3>
                          <p className="text-slate-300 text-[13px] leading-relaxed px-4 break-keep">
                            {intake.childName || '아이'}의 기질에 딱 맞는 매일의 대화 처방과<br />발달 변화 기록까지, 이제 앱에서 시작하세요.
                          </p>
                        </div>
                        <div className="pt-2 space-y-3">
                          <Button
                            variant="primary"
                            fullWidth
                            className="h-14 rounded-2xl bg-white !text-slate-900 font-black text-base shadow-xl"
                            onClick={() => window.open('https://aina.garden/app', '_blank')}
                          >
                            <span className="text-slate-900">앱 설치하고 실천 아이템 받기</span>
                          </Button>
                          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                            Available on iOS & Android
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 text-center px-4">
                    <Button variant="secondary" onClick={() => router.replace('/share')} fullWidth className="h-14 rounded-2xl border-none bg-white shadow-lg text-slate-800 font-bold">
                      결과 공유하고 할인권 받기
                    </Button>
                    <Link href="/" className="text-slate-400 text-sm font-bold hover:text-primary transition-colors">
                      홈으로 돌아가기
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <BottomNav />
      </div>

      {isChildOnly && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-md mx-auto">
            <div className="m-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-slate-50 px-5 py-3 border-b border-slate-100">
                <p className="text-[11px] font-bold text-primary text-center">
                  🔬 양육자 기질까지 추가하면 더 정밀해져요
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="text-[12px] text-slate-500 text-center mb-3 leading-relaxed">
                  두 기질의 <strong className="text-slate-700">조화 지수(GHI)</strong>와 <strong className="text-slate-700">맞춤 양육 솔루션</strong>을<br />지금 바로 확인해 보세요.
                </p>
                <button
                  onClick={() => router.replace('/survey?type=PARENT')}
                  className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <span>양육자 기질 검사 이어하기</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center font-body pb-0">
        <div className="w-full max-w-md bg-background-light dark:bg-background-dark h-full min-h-screen flex flex-col shadow-2xl items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
