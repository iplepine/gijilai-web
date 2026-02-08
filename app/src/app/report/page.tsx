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

export default function ReportPage() {
  const answers = useSurveyStore((state) => state.answers);

  // Helper to calculate scores
  const calculateScores = (questions: typeof CHILD_QUESTIONS) => {
    const scores = { NS: 0, HA: 0, RD: 0, P: 0 };
    const counts = { NS: 0, HA: 0, RD: 0, P: 0 };

    questions.forEach(q => {
      if (answers[q.id]) {
        const cat = q.category as keyof typeof scores;
        if (cat in scores) {
          scores[cat] += answers[q.id];
          counts[cat]++;
        }
      }
    });

    // Normalize to 0-100
    const normalized = {
      NS: scores.NS > 0 ? Math.round((scores.NS / (counts.NS * 5)) * 100) : 0,
      HA: scores.HA > 0 ? Math.round((scores.HA / (counts.HA * 5)) * 100) : 0,
      RD: scores.RD > 0 ? Math.round((scores.RD / (counts.RD * 5)) * 100) : 0,
      P: scores.P > 0 ? Math.round((scores.P / (counts.P * 5)) * 100) : 0,
    }
    return normalized;
  };

  const childScores = useMemo(() => calculateScores(CHILD_QUESTIONS), [answers]);
  const parentScores = useMemo(() => calculateScores(PARENT_QUESTIONS), [answers]);

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

  // Simple Logic for BCI (Just average difference for demo)
  const bciScore = useMemo(() => {
    if (!answers[1]) return 0; // Return 0 if no answers
    const diff =
      Math.abs(childScores.NS - parentScores.NS) +
      Math.abs(childScores.HA - parentScores.HA) +
      Math.abs(childScores.RD - parentScores.RD) +
      Math.abs(childScores.P - parentScores.P);

    // Higher diff = lower fit score in this simple logic (100 - avg diff)
    const avgDiff = diff / 4;
    return Math.max(0, 100 - avgDiff);
  }, [childScores, parentScores, answers]);

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

        {/* BCI Score */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4">
            🤝 부모-자녀 적합도 (BCI)
          </h3>
          <div className="relative pt-4 pb-2">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  안정적 조화
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {Math.round(bciScore)}점
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div style={{ width: `${bciScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-1000"></div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              서로 다른 기질이지만, 부모님의 '공감 능력'이 갈등을 잘 중재하고 계시네요. 아이의 에너지를 부정하기보다 안전하게 발산할 공간을 만들어주세요.
            </p>
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
