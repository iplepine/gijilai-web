'use client';

import React, { useMemo } from 'react';
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

  const radarData = {
    labels: ['자극 추구', '위험 회피', '사회적 민감성', '지속성'],
    datasets: [
      {
        label: '아이의 씨앗 (Seed)',
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

      <div className="max-w-md mx-auto px-6 -mt-20 space-y-8 relative z-20">

        {/* Tier 2: Heart Prescription (Only if Paid) */}
        {isPaid && (
          <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-primary/10 border border-primary/20 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-[10px] font-bold bg-primary text-white px-2 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">Paid Content</span>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold">
                <span className="animate-pulse">✨</span> 오늘의 마음 처방전
              </div>

              {/* 1. Seed's Language */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em]">아이의 신호 통역</h4>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border-l-4 border-primary italic text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed break-keep">
                  "{prescription.interpretation}"
                </div>
              </div>

              {/* 2. Magic Word */}
              <div className="space-y-3">
                <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em]">마법의 한마디</h4>
                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-3">
                  <p className="text-[14px] font-bold text-primary flex items-center gap-2">
                    <Icon name="chat" size="sm" /> 오늘 바로 이렇게 말해보세요
                  </p>
                  <p className="text-[16px] font-black text-slate-800 dark:text-white leading-relaxed break-keep">
                    {prescription.magicWord}
                  </p>
                </div>
              </div>

              {/* 3. Illustration Preview (Visual) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em]">나의 정원 카드</h4>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-[2px]"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">{childType.emoji}</span>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{prescription.gardenTheme.soil}</p>
                    <p className="text-lg font-black text-slate-800 dark:text-white">{prescription.gardenTheme.plant}</p>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <button className="text-[10px] font-bold text-primary underline">전체 이미지 다운로드</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Child Temperament Card (Free Contents Start) - Ecosystem Hierarchy: Soil -> Seed -> Plant */}
        {!isPaid && (
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-6 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-6">
            <div className="w-full aspect-square relative rounded-[2.5rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-yellow-400/5 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center text-9xl drop-shadow-2xl">
                {childType.emoji}
              </div>
            </div>

            <div className="space-y-6 px-4 pb-4">
              {/* Hierarchy 1: Soil (Parent) */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">보호자가 일군 토양</span>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">"{childType.soil.label}"</h3>
                  <p className="text-[11px] text-slate-400">{childType.soil.desc}</p>
                </div>
              </div>

              <div className="w-12 h-[1px] bg-slate-100 dark:bg-slate-800 mx-auto"></div>

              {/* Hierarchy 2: Seed (Child Nature) */}
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">아이의 타고난 씨앗</span>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">"{childType.seed.label}"</h3>
                  <p className="text-[11px] text-slate-400">{childType.seed.desc}</p>
                </div>
              </div>

              <div className="w-12 h-[1px] bg-slate-100 dark:bg-slate-800 mx-auto"></div>

              {/* Hierarchy 3: Plant (Current Expression) */}
              <div className="space-y-2">
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">발견된 씨앗의 종류</span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {childType.label}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed break-keep">
                  {childType.desc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Analysis Section (Paid or Scrollable) */}
        <div className="space-y-8">
          {/* Radar Chart Section */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl space-y-8">
            <h3 className="font-black text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <Icon name="analytics" className="text-primary" /> 씨앗 프로파일 지표
            </h3>
            <div className="h-64 relative">
              <Radar data={radarData} options={radarOptions} />
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl text-[11px] text-slate-400 leading-relaxed text-center italic text-balance">
              * 보호자가 일군 **토양** 위에서 아이라는 **씨앗**이 장차 어떤 **꽃**으로 피어날지 그 조화를 분석합니다.
            </div>
          </div>

          {/* GHI Section */}
          <div className={`bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border-2 transition-all ${analysisResult.type === 'CRISIS' ? 'border-rose-400' : (analysisResult.type === 'MITIGATED' ? 'border-teal-400' : 'border-transparent')}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-800 dark:text-white text-lg">정원 조화 지수 (GHI)</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${ghiScore < 40 ? 'bg-teal-100 text-teal-600' : 'bg-rose-100 text-rose-600'}`}>
                {ghiLabel}
              </span>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harmony Index</span>
                  <span className={`text-2xl font-black ${ghiColor}`}>{Math.round(ghiScore)}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, ghiScore)}%` }}
                    className={`h-full transition-all duration-1000 ease-out ${ghiBg}`}
                  />
                </div>
              </div>
              <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed break-keep font-medium">
                {analysisResult.message}
              </p>
            </div>
          </div>

          {/* Parenting Style Section */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl space-y-6">
            <h3 className="font-black text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <Icon name="eco" className="text-green-500" /> 양육의 햇살과 영양 점검
            </h3>
            <div className="h-56">
              <Bar data={barData} options={{ ...barOptions, plugins: { legend: { display: false } } } as any} />
            </div>
          </div>

          {/* Locked Content Preview (If not paid) */}
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
        <div className="flex flex-col gap-4 pt-10 pb-10">
          <Button variant="secondary" onClick={() => router.push('/share')} fullWidth className="h-14 rounded-2xl border-none bg-white shadow-lg">
            결과 공유하고 할인권 받기
          </Button>
          <Link href="/" className="text-slate-400 text-sm text-center font-bold hover:text-primary transition-colors">
            홈 정원으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
