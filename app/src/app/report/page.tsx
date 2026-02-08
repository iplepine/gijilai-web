'use client';

import React, { useMemo } from 'react';
import { useSurveyStore } from '../../store/surveyStore';
import { CHILD_QUESTIONS, PARENT_QUESTIONS, PARENTING_STYLE_QUESTIONS } from '../../data/questions';
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

import { TemperamentScorer } from '../../lib/TemperamentScorer';

export default function ReportPage() {
  const answers = useSurveyStore((state) => state.answers);

  const childScores = useMemo(() => TemperamentScorer.calculate(CHILD_QUESTIONS, answers), [answers]);
  const parentScores = useMemo(() => TemperamentScorer.calculate(PARENT_QUESTIONS, answers), [answers]);

  // Parenting Style Scores
  const styleScores = useMemo(() => {
    const scores = { Efficacy: 0, Autonomy: 0, Responsiveness: 0 };
    const counts = { Efficacy: 0, Autonomy: 0, Responsiveness: 0 };

    PARENTING_STYLE_QUESTIONS.forEach(q => {
      if (answers[q.id]) {
        const cat = q.category as keyof typeof scores;
        if (cat in scores) {
          scores[cat] += answers[q.id];
          counts[cat]++;
        }
      }
    });
    return {
      Efficacy: scores.Efficacy > 0 ? Math.round((scores.Efficacy / (counts.Efficacy * 5)) * 100) : 0,
      Autonomy: scores.Autonomy > 0 ? Math.round((scores.Autonomy / (counts.Autonomy * 5)) * 100) : 0,
      Responsiveness: scores.Responsiveness > 0 ? Math.round((scores.Responsiveness / (counts.Responsiveness * 5)) * 100) : 0,
    }
  }, [answers]);


  const radarData = {
    labels: ['자극 추구 (NS)', '위험 회피 (HA)', '사회적 민감성 (RD)', '지속성 (P)'],
    datasets: [
      {
        label: '아이 기질',
        data: [childScores.NS, childScores.HA, childScores.RD, childScores.P],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 159, 64, 1)',
      },
      {
        label: '부모 기질',
        data: [parentScores.NS, parentScores.HA, parentScores.RD, parentScores.P],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        borderDash: [5, 5],
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  const barData = {
    labels: ['양육 효능감', '자율성 지지', '정서적 반응성'],
    datasets: [
      {
        label: '나의 점수',
        data: [styleScores.Efficacy, styleScores.Autonomy, styleScores.Responsiveness],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Simple Logic for BCI (Average difference)
  const bciScore = useMemo(() => {
    if (!answers[1]) return 0;
    const diff =
      Math.abs(childScores.NS - parentScores.NS) +
      Math.abs(childScores.HA - parentScores.HA) +
      Math.abs(childScores.RD - parentScores.RD) +
      Math.abs(childScores.P - parentScores.P);

    // Average difference. 
    // Spec says BCI = |C - P|. Since we normalized to 100, a diff of 100 is max.
    // If we use raw scores (1-5), max diff is 4.
    // Let's use the normalized scores (0-100) for resolution. Max diff is 100 per dimension.
    // Average Diff = Total Diff / 4.
    return diff / 4;
  }, [childScores, parentScores, answers]);

  // 3D Dynamic Matching Logic
  const analysisResult = useMemo(() => {
    let type = 'NORMAL'; // NORMAL, MITIGATED, CRISIS
    let message = '서로 다른 기질이지만, 부모님의 노력으로 균형을 맞춰가고 있습니다.';

    // Thresholds (assuming normalized 0-100 scale)
    // BCI >= 3.0 on 5-point scale => 60 on 100-point scale.
    const isHighBCI = bciScore >= 40; // 2 points diff = 40. Strict: 60. Let's use 40 as "Noticeable".

    // Specific Conflict: Child NS High vs Parent HA High
    const isConflictPattern = childScores.NS >= 80 && parentScores.HA >= 80;

    if (isHighBCI || isConflictPattern) {
      // Check Mitigation (Autonomy >= 4 -> 80)
      if (styleScores.Autonomy >= 80) {
        type = 'MITIGATED';
        message = '기질적인 차이가 크지만, 부모님의 높은 [자율성 지지] 덕분에 아이가 이를 건강하게 극복하고 있습니다. 훌륭한 양육 태도입니다!';
      }
      // Check Crisis (Responsiveness <= 2 -> 40)
      else if (styleScores.Responsiveness <= 40) {
        type = 'CRISIS';
        message = '현재 기질적 갈등이 심화되고 있습니다. 부모님의 [정서적 반응성]을 높여 아이의 마음을 먼저 읽어주는 노력이 시급합니다.';
      }
      else {
        message = '기질 차이로 인한 갈등 가능성이 있습니다. 서로의 다름을 인정하는 대화가 필요합니다.';
      }
    }
    return { type, message };
  }, [bciScore, childScores, parentScores, styleScores]);

  // BCI color logic
  const bciColor = bciScore < 20 ? 'text-green-600' : (bciScore < 50 ? 'text-blue-600' : 'text-red-500');
  const bciBg = bciScore < 20 ? 'bg-green-500' : (bciScore < 50 ? 'bg-blue-500' : 'bg-red-500');
  const bciLabel = bciScore < 20 ? '최상의 궁합' : (bciScore < 50 ? '안정적 조화' : '갈등 주의');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-6 pb-24 rounded-b-[40px] shadow-lg relative" style={{ backgroundColor: '#6C5CE7' }}>
        <h1 className="text-2xl font-bold text-center mb-2">분석 결과</h1>
        <p className="text-center opacity-90">마인드 가드너가 분석한 우리 가족 리포트</p>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-16 space-y-6">

        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            "에너지 넘치는 <span className="text-orange-500">열정 탐험가</span>"
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            호기심이 많고 새로운 것을 두려워하지 않는 유형입니다.
          </p>
          <div className="w-24 h-24 mx-auto bg-orange-100 rounded-full flex items-center justify-center text-4xl mb-4">
            🦁
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">#호기심대장</span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">#활동적</span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">#충동적</span>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            📊 기질 프로파일 비교
          </h3>
          <div className="h-64">
            <Radar data={radarData} options={radarOptions} />
          </div>
          <p className="text-xs text-gray-500 text-center mt-4 bg-gray-50 p-3 rounded-lg">
            * 점선(부모)과 실선(아이)의 차이가 클수록 갈등 가능성이 높습니다.
          </p>
        </div>

        {/* BCI Score with Dynamic Analysis */}
        <div className={`bg-white rounded-2xl p-6 shadow-md border-2 ${analysisResult.type === 'CRISIS' ? 'border-red-400' : (analysisResult.type === 'MITIGATED' ? 'border-green-400' : 'border-transparent')}`}>
          <h3 className="font-bold text-gray-800 mb-4 flex justify-between">
            <span>🤝 부모-자녀 적합도 (BCI)</span>
            {analysisResult.type === 'MITIGATED' && <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Great!</span>}
            {analysisResult.type === 'CRISIS' && <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">Warning</span>}
          </h3>
          <div className="relative pt-4 pb-2">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${bciScore < 50 ? 'bg-blue-200' : 'bg-red-200'} ${bciColor}`}>
                  {bciLabel}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold inline-block ${bciColor}`}>
                  충돌지수 {Math.round(bciScore)}점
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div style={{ width: `${Math.min(100, bciScore)}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${bciBg}`}></div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed font-medium">
              {analysisResult.message}
            </div>
          </div>
        </div>

        {/* Parenting Style Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-green-800 mb-4 flex items-center">
            🌱 나의 양육 스타일 점검
          </h3>
          <div className="h-48">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Solutions */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-800 ml-1">💡 맞춤 솔루션</h3>

          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">[놀이법] 에너지 발산 미션</h4>
                <p className="text-xs text-gray-500">15분간의 장애물 달리기 후 차분한 마무리</p>
              </div>
              <span className="text-xl">🏃</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 cursor-pointer hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">[대화법] 감정 수용하기</h4>
                <p className="text-xs text-gray-500">"그만해!" 대신 "더 놀고 싶었구나"라고 말하기</p>
              </div>
              <span className="text-xl">💬</span>
            </div>
          </div>
        </div>

        <div className="pt-8 pb-4 text-center">
          <Link href="/survey/intro" className="text-gray-400 text-sm underline">
            검사 다시하기
          </Link>
        </div>

      </div>
    </div>
  );
}
