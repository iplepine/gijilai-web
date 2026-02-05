import type { SurveyQuestion } from '@/types';

// CBQ-VSF 문항 (간소화 버전 - 실제로는 36문항)
export const CBQ_QUESTIONS: SurveyQuestion[] = [
  // 외향성/활성 (Surgency) - 12문항
  { id: 'cbq_1', text: '항상 급하게 움직이려고 합니다.', factor: 'surgency', isReverse: false },
  { id: 'cbq_2', text: '거친 놀이(레슬링, 뛰어다니기 등)를 즐깁니다.', factor: 'surgency', isReverse: false },
  { id: 'cbq_3', text: '새로운 사람을 만나면 수줍어합니다.', factor: 'surgency', isReverse: true },
  { id: 'cbq_4', text: '놀이터 미끄럼틀이나 높은 곳을 좋아합니다.', factor: 'surgency', isReverse: false },
  { id: 'cbq_5', text: '차분히 앉아서 하는 활동을 좋아합니다.', factor: 'surgency', isReverse: true },
  { id: 'cbq_6', text: '또래 친구들과 쉽게 어울립니다.', factor: 'surgency', isReverse: false },

  // 부정적 정서 (Negative Affectivity) - 12문항
  { id: 'cbq_7', text: '원하는 것을 못 하게 하면 화를 냅니다.', factor: 'negativeAffect', isReverse: false },
  { id: 'cbq_8', text: '무서운 것(어둠, 동물 등)에 쉽게 겁을 먹습니다.', factor: 'negativeAffect', isReverse: false },
  { id: 'cbq_9', text: '사소한 상처에도 크게 속상해합니다.', factor: 'negativeAffect', isReverse: false },
  { id: 'cbq_10', text: '기분이 상하면 달래기 어렵습니다.', factor: 'negativeAffect', isReverse: false },
  { id: 'cbq_11', text: '울거나 짜증을 내도 금방 진정됩니다.', factor: 'negativeAffect', isReverse: true },
  { id: 'cbq_12', text: '작은 일에도 쉽게 슬퍼합니다.', factor: 'negativeAffect', isReverse: false },

  // 의도적 통제 (Effortful Control) - 12문항
  { id: 'cbq_13', text: '지시 사항을 잘 따릅니다.', factor: 'effortfulControl', isReverse: false },
  { id: 'cbq_14', text: '책을 볼 때 강한 집중력을 보입니다.', factor: 'effortfulControl', isReverse: false },
  { id: 'cbq_15', text: '하던 일을 중간에 멈추기 어려워합니다.', factor: 'effortfulControl', isReverse: true },
  { id: 'cbq_16', text: '조용한 활동(퍼즐, 그림 그리기)을 오래 할 수 있습니다.', factor: 'effortfulControl', isReverse: false },
  { id: 'cbq_17', text: '기다려야 할 때 참을성이 있습니다.', factor: 'effortfulControl', isReverse: false },
  { id: 'cbq_18', text: '작은 소리나 변화를 잘 알아챕니다.', factor: 'effortfulControl', isReverse: false },
];

// ATQ 문항 (간소화 버전 - 실제로는 77문항)
export const ATQ_QUESTIONS: SurveyQuestion[] = [
  // 부정적 감정
  { id: 'atq_1', text: '작은 일에도 쉽게 걱정이 됩니다.', factor: 'negativeAffect', isReverse: false },
  { id: 'atq_2', text: '기분 변화가 심한 편입니다.', factor: 'negativeAffect', isReverse: false },
  { id: 'atq_3', text: '스트레스를 받으면 짜증이 납니다.', factor: 'negativeAffect', isReverse: false },

  // 의도적 통제
  { id: 'atq_4', text: '계획을 세우고 그대로 실행합니다.', factor: 'effortfulControl', isReverse: false },
  { id: 'atq_5', text: '충동을 잘 억제할 수 있습니다.', factor: 'effortfulControl', isReverse: false },
  { id: 'atq_6', text: '한 가지 일에 오래 집중할 수 있습니다.', factor: 'effortfulControl', isReverse: false },

  // 외향성
  { id: 'atq_7', text: '새로운 사람을 만나는 것을 좋아합니다.', factor: 'surgency', isReverse: false },
  { id: 'atq_8', text: '활동적이고 에너지가 넘칩니다.', factor: 'surgency', isReverse: false },
  { id: 'atq_9', text: '신나는 활동을 좋아합니다.', factor: 'surgency', isReverse: false },
];

export const LIKERT_OPTIONS = [
  { value: 1, label: '전혀 그렇지 않다' },
  { value: 2, label: '그렇지 않다' },
  { value: 3, label: '약간 그렇지 않다' },
  { value: 4, label: '보통이다' },
  { value: 5, label: '약간 그렇다' },
  { value: 6, label: '그렇다' },
  { value: 7, label: '매우 그렇다' },
];

export const NA_OPTION = { value: 0, label: '해당 없음' };
