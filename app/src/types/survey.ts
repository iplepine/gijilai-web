export type SurveyType = 'CHILD' | 'PARENT' | 'PARENTING_STYLE';

export interface Question {
    id: number;
    text?: string; // Legacy text or used as context title
    context?: string; // BARS situation
    type: SurveyType;
    category: string;
    facet?: string;
    reverse?: boolean;
    // BARS descriptions
    lowScoreDescription?: string; // Score 1
    midScoreDescription?: string; // Score 3
    highScoreDescription?: string; // Score 5
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
