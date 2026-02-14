'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { CHILD_QUESTIONS, PARENT_QUESTIONS, PARENTING_STYLE_QUESTIONS } from '@/data/questions';
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

export default function ReportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'child' | 'parent'>('child');
  const { intake, cbqResponses, atqResponses, parentingResponses, isPaid } = useAppStore();

  const childScores = useMemo(() => TemperamentScorer.calculate(CHILD_QUESTIONS, cbqResponses as any), [cbqResponses]);
  const parentScores = useMemo(() => TemperamentScorer.calculate(PARENT_QUESTIONS, atqResponses as any), [atqResponses]);

  // Parenting Style Scores
  const styleScores = useMemo(() => {
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

  // Temperament Classification (Parent = Soil, Child = Seed + Plant)
  const childType = useMemo(() => TemperamentClassifier.analyze(childScores, parentScores), [childScores, parentScores]);
  const prescription = useMemo(() => PRESCRIPTION_DATA[childType.label] || PRESCRIPTION_DATA["무한한 잠재력의 새싹"], [childType]);

  const isStyleSurveyComplete = useMemo(() => {
    return PARENTING_STYLE_QUESTIONS.every(q => !!parentingResponses[q.id.toString()]);
  }, [parentingResponses]);

  const parentReport = useMemo(() => ParentClassifier.analyze(parentScores), [parentScores]);
  const isParentSurveyComplete = useMemo(() => Object.keys(atqResponses).length >= PARENT_QUESTIONS.length, [atqResponses]);

  const radarData = {
    labels: ['자극 추구', '위험 회피', '사회적 민감성', '지속성'],
    datasets: [
      {
        label: '아이의 새싹 (Sprout)',
        data: [childScores.NS, childScores.HA, childScores.RD, childScores.P],
        backgroundColor: 'rgba(78, 205, 196, 0.2)',
        borderColor: '#4ECDC4',
        borderWidth: 3,
        pointBackgroundColor: '#4ECDC4',
        pointRadius: 4,
      },
      {
        label: '보호자의 토양 (Soil)',
        data: [parentScores.NS, parentScores.HA, parentScores.RD, parentScores.P],
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderColor: '#FF6B6B',
        borderWidth: 2,
        pointBackgroundColor: '#FF6B6B',
        pointRadius: 0,
        borderDash: [5, 5],
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
      legend: {
        position: 'bottom' as const,
        labels: { boxWidth: 12, font: { size: 12, weight: 'bold' as const } }
      }
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

  // Garden Harmony Index (GHI) Logic
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
    let message = '서로 다른 기질이지만, 부모님의 노력으로 균형을 맞춰가고 있습니다.';
    const isHighGHI = ghiScore >= 40;
    const isConflictPattern = childScores.NS >= 70 && parentScores.HA >= 70;

    if (isHighGHI || isConflictPattern) {
      if (styleScores.Autonomy >= 70) {
        type = 'MITIGATED';
        message = '기질적인 차이가 크지만, 부모님의 높은 [자율성 지지] 덕분을 통해 아이가 이를 건강하게 극복하고 있습니다.';
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 font-sans">
      {/* Header Overlay */}
      <div className="bg-primary pt-12 pb-32 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 text-center space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight">분석 리포트</h1>
          <p className="text-white/70 text-sm font-medium">Aina Garden이 발견한 {intake.childName || '아이'}의 세상</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="max-w-md mx-auto px-6 -mt-24 mb-12 relative z-30">
        <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl flex gap-1 border border-white/20">
          <button
            onClick={() => setActiveTab('child')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'child' ? 'bg-white text-primary shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            아이와 정원
          </button>
          <button
            onClick={() => {
              if (isParentSurveyComplete) setActiveTab('parent');
              else if (confirm('부모 기질 검사를 먼저 완료해야 확인할 수 있어요. 지금 시작할까요?')) {
                router.push('/survey?type=PARENT');
              }
            }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'parent' ? 'bg-white text-primary shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            나의 마음 토양
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 space-y-12 relative z-20">
        {activeTab === 'child' ? (
          <>
            {/* Phase 1: Archetype Discovery (The Sprout) */}
            <div className="bg-white dark:bg-slate-800 rounded-[3.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>

              <div className="w-48 h-48 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse opacity-30"></div>
                <div className="relative text-8xl drop-shadow-2xl z-10">
                  {childType.emoji}
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 font-black text-[10px] text-slate-500 uppercase tracking-widest">
                  Current Manifestation
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                    {childType.label}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed break-keep px-4 font-medium">
                    {childType.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Phase 2: Relationship Foundation (Soil VS Seed) */}
            <div className="space-y-4">
              <h3 className="px-4 text-[13px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Icon name="diversity_3" size="sm" /> 정원의 탄생: 토양과 씨앗
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Soil Card */}
                <section className="bg-gradient-to-br from-white to-orange-50/30 dark:from-slate-800 dark:to-orange-900/10 rounded-[2.5rem] p-6 shadow-xl border border-orange-100/50 dark:border-orange-900/20 relative group">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                    <Icon name="eco" size="sm" />
                  </div>
                  <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-1">Protector's Soil</span>
                  <h4 className="text-md font-black text-slate-800 dark:text-white mb-2">{childType.soil.label}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug break-keep opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 p-6 bg-white/95 dark:bg-slate-800/95 flex items-center rounded-[2.5rem]">
                    {childType.soil.desc}
                  </p>
                </section>

                {/* Seed Card */}
                <section className="bg-gradient-to-br from-white to-teal-50/30 dark:from-slate-800 dark:to-teal-900/10 rounded-[2.5rem] p-6 shadow-xl border border-teal-100/50 dark:border-teal-900/20 relative group">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
                    <Icon name="star" size="sm" />
                  </div>
                  <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest block mb-1">Child's Seed</span>
                  <h4 className="text-md font-black text-slate-800 dark:text-white mb-2">{childType.seed.label}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug break-keep opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 p-6 bg-white/95 dark:bg-slate-800/95 flex items-center rounded-[2.5rem]">
                    {childType.seed.desc}
                  </p>
                </section>
              </div>
            </div>

            {/* Phase 3: Harmony Dynamics (The "Why") */}
            <section className="bg-slate-900 dark:bg-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Garden Dynamics</span>
                    <h3 className="text-2xl font-black text-white dark:text-slate-900">"{childType.harmony.title}"</h3>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white/10 dark:bg-slate-100 flex items-center justify-center border border-white/20 dark:border-slate-200">
                    <Icon name="psychology" className="text-primary" />
                  </div>
                </div>
                <p className="text-slate-300 dark:text-slate-600 text-[14px] leading-relaxed break-keep font-medium">
                  {childType.harmony.desc}
                </p>
                <div className="pt-4 flex items-center gap-4 text-[11px] font-bold text-slate-500 italic">
                  <div className="flex-1 h-[1px] bg-slate-800 dark:bg-slate-200"></div>
                  <span>Relationship Insights</span>
                  <div className="flex-1 h-[1px] bg-slate-800 dark:bg-slate-200"></div>
                </div>
              </div>
            </section>

            {/* Scientific Indicators */}
            <div className="space-y-8">
              {/* Radar Chart Section */}
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl space-y-8">
                <h3 className="font-black text-slate-800 dark:text-white text-lg flex items-center gap-2">
                  <Icon name="analytics" className="text-primary" /> 기질 분석 데이터
                </h3>
                <div className="h-64 relative">
                  <Radar data={radarData} options={radarOptions} />
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl text-[11px] text-slate-400 leading-relaxed text-center italic text-balance">
                  * 보호자가 일군 **토양** 위에서 아이라는 **씨앗**이 만나 <br />어떤 **새싹**을 틔웠는지 그 데이터 지표를 보여줍니다.
                </div>
              </div>

              {/* GHI Section */}
              <div className={`bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border-2 transition-all ${analysisResult.type === 'CRISIS' ? 'border-rose-400' : (analysisResult.type === 'MITIGATED' ? 'border-teal-400' : 'border-transparent')}`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-slate-800 dark:text-white text-lg">조화 지수 (GHI)</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${ghiScore < 40 ? 'bg-teal-100 text-teal-600' : 'bg-rose-100 text-rose-600'}`}>
                    {ghiLabel}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Similarity Gap</span>
                      <span className={`text-2xl font-black ${ghiColor}`}>{Math.round(ghiScore)}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, ghiScore)}%` }}
                        className={`h-full transition-all duration-1000 ease-out ${ghiBg}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Parenting Style Section */}
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <h3 className="font-black text-slate-800 dark:text-white text-lg flex items-center gap-2">
                    <Icon name="tune" className="text-green-500" /> 양육의 햇살과 영양
                  </h3>
                  {isStyleSurveyComplete && <span className="text-[10px] font-bold text-slate-400">Current Support Level</span>}
                </div>

                <div className="relative z-10">
                  {isStyleSurveyComplete ? (
                    <div className="h-48">
                      <Bar data={barData} options={{ ...barOptions, plugins: { legend: { display: false } } } as any} />
                    </div>
                  ) : (
                    <div className="py-6 px-4 bg-green-50/50 dark:bg-slate-900/50 rounded-3xl border border-green-100 dark:border-slate-700 text-center space-y-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <span className="text-2xl">☀️</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">나의 양육 스타일은 어떤가요?</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed break-keep">
                          기질에 딱 맞는 [양육 처방전]을 완성하기 위해<br />
                          평소 부모님의 양육 태도를 확인해 보세요.
                        </p>
                      </div>
                      <Button
                        onClick={() => router.push('/survey?type=STYLE')}
                        size="sm"
                        variant="primary"
                        className="rounded-xl px-6 bg-green-500 hover:bg-green-600 border-none shadow-lg shadow-green-200"
                      >
                        양육 태도 확인하기
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Locked Content Preview (Only for Child-focused premium results) */}
              {!isPaid && (
                <div className="bg-slate-800 rounded-[2.5rem] p-10 text-center space-y-6">
                  <div className="text-4xl mb-2">🔒</div>
                  <h4 className="text-xl font-bold text-white">더 깊은 처방이 필요한가요?</h4>
                  <p className="text-slate-400 text-sm leading-relaxed px-4">
                    아이의 행동을 통역해주는 [마음 처방전]과<br />
                    오늘 밤 바로 써먹는 [마법의 한마디]를 확인하세요.
                  </p>
                  <Button onClick={() => router.push('/payment')} variant="primary" fullWidth className="h-14 rounded-2xl">
                    990원에 처방전 구매하기
                  </Button>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col gap-4 pt-10 pb-10 text-center">
              <Button variant="secondary" onClick={() => router.push('/share')} fullWidth className="h-14 rounded-2xl border-none bg-white shadow-lg">
                결과 공유하고 할인권 받기
              </Button>
              <Link href="/" className="text-slate-400 text-sm font-bold hover:text-primary transition-colors">
                홈 정원으로 돌아가기
              </Link>
            </div>
          </>
        ) : (
          <div className="animate-fade-in space-y-12">
            {/* Parent Report Header */}
            <header className="text-center space-y-4 py-6">
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Parent Self-Report</div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-snug break-keep">
                보호자 <span className="text-primary">나</span>의<br />중심을 잡는 마음 토양
              </h2>
              <p className="text-slate-500 text-[13px] font-medium leading-relaxed break-keep">
                당신은 누군가의 부모이기 이전에,<br />그 자체로 고유한 결을 가진 소중한 사람입니다.
              </p>
            </header>

            {/* Parent Section 1: Soil Analysis (Individual) */}
            <section className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">01. 나의 토양 분석</span>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">{parentReport.soilName}</h3>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-600 dark:text-slate-300 text-[14px] leading-relaxed break-keep font-medium italic">
                    {parentReport.analysis}
                  </p>
                </div>
              </div>
            </section>

            {/* Parent Section 2: Magic Season & Drought */}
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

            {/* Parent Section 3: Nutrients */}
            <section className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xl">🧪</span>
                </div>
                <h3 className="text-lg font-black text-white">나를 위한 마음 영양제</h3>
              </div>
              <ul className="space-y-3">
                {parentReport.nutrients.map((n, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm font-medium text-slate-200">{n}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Parent Section 4: Letter */}
            <section className="bg-primary/5 rounded-[3rem] p-10 border-2 border-dashed border-primary/20 text-center space-y-6">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto -mt-14">
                <span className="text-3xl">💌</span>
              </div>
              <h3 className="text-lg font-black text-slate-800">나에게 보내는 다정한 편지</h3>
              <p className="text-slate-600 text-[14px] leading-relaxed italic break-keep px-4">
                "{parentReport.letter}"
              </p>
            </section>

            {/* Footer Actions */}
            <div className="flex flex-col gap-4 pt-10 pb-10 text-center">
              <Button variant="secondary" onClick={() => router.push('/share')} fullWidth className="h-14 rounded-2xl border-none bg-white shadow-lg">
                나의 결과 공유하기
              </Button>
              <Link href="/" className="text-slate-400 text-sm font-bold hover:text-primary transition-colors">
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
