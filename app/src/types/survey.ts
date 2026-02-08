export type SurveyType = 'CHILD' | 'PARENT' | 'PARENTING_STYLE';

export interface Question {
    id: number;
    text: string;
    type: SurveyType;
    category: string; // e.g., 'NS', 'HA', 'RD', 'P' or 'Efficacy', 'Autonomy', 'Responsiveness'
    facet?: string;
    reverse?: boolean; // True if the score needs to be reversed
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
