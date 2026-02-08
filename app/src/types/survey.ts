export type SurveyType = 'CHILD' | 'PARENT' | 'PARENTING_STYLE';

export interface Question {
    id: number;
    text?: string; // Legacy text or used as context title
    context?: string; // BARS situation
    type: SurveyType;
    category: string;
    facet?: string;
    reverse?: boolean;
    // BARS 5-step descriptions
    choices?: string[]; // Array of 5 strings corresponding to score 1..5
}

export interface Answer {
    questionId: number;
    score: number; // 1-5
}

export interface SurveyResult {
    childTemperament: {
        NS: number;
        HA: number;
        RD: number;
        P: number;
    };
    parentTemperament: {
        NS: number;
        HA: number;
        RD: number;
        P: number;
    };
    parentingStyle: {
        efficacy: number;
        autonomy: number;
        responsiveness: number;
    };
    bciScore: number;
}
