import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IntakeFormData, SurveyResponse, AnalysisResult } from '@/types';

interface AppState {
  // Intake Form
  intake: IntakeFormData;
  setIntake: (data: Partial<IntakeFormData>) => void;
  resetIntake: () => void;

  // Survey
  surveyProgress: number;
  cbqResponses: Record<string, number>;
  atqResponses: Record<string, number>;
  setCbqResponse: (questionId: string, score: number) => void;
  setAtqResponse: (questionId: string, score: number) => void;
  setSurveyProgress: (progress: number) => void;

  // Analysis Result
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult) => void;

  // Payment
  isPaid: boolean;
  setIsPaid: (paid: boolean) => void;

  // Reset all
  resetAll: () => void;
}

const initialIntake: IntakeFormData = {
  privacyAgreed: false,
  disclaimerAgreed: false,
  childName: '',
  gender: '',
  birthDate: '',
  birthTime: '',
  birthPlace: '',
  concerns: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Intake
      intake: initialIntake,
      setIntake: (data) =>
        set((state) => ({
          intake: { ...state.intake, ...data },
        })),
      resetIntake: () => set({ intake: initialIntake }),

      // Survey
      surveyProgress: 0,
      cbqResponses: {},
      atqResponses: {},
      setCbqResponse: (questionId, score) =>
        set((state) => ({
          cbqResponses: { ...state.cbqResponses, [questionId]: score },
        })),
      setAtqResponse: (questionId, score) =>
        set((state) => ({
          atqResponses: { ...state.atqResponses, [questionId]: score },
        })),
      setSurveyProgress: (progress) => set({ surveyProgress: progress }),

      // Analysis
      analysisResult: null,
      setAnalysisResult: (result) => set({ analysisResult: result }),

      // Payment
      isPaid: false,
      setIsPaid: (paid) => set({ isPaid: paid }),

      // Reset
      resetAll: () =>
        set({
          intake: initialIntake,
          surveyProgress: 0,
          cbqResponses: {},
          atqResponses: {},
          analysisResult: null,
          isPaid: false,
        }),
    }),
    {
      name: 'temperament-storage',
      partialize: (state) => ({
        intake: state.intake,
        cbqResponses: state.cbqResponses,
        atqResponses: state.atqResponses,
        surveyProgress: state.surveyProgress,
      }),
    }
  )
);
