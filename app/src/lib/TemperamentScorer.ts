import { Question } from '../types/survey';

export interface ScoreResult {
    NS: number;
    HA: number;
    RD: number;
    P: number;
}

export class TemperamentScorer {
    /**
     * Calculates the temperament scores based on the provided answers.
     * 
     * @param questions List of questions (CHILD_QUESTIONS or PARENT_QUESTIONS)
     * @param answers Record of question ID to score (1-5)
     * @returns Normalized scores (0-100) for each dimension (NS, HA, RD, P)
     */
    static calculate(questions: Question[], answers: Record<number, number>): ScoreResult {
        const scores = { NS: 0, HA: 0, RD: 0, P: 0 };
        const counts = { NS: 0, HA: 0, RD: 0, P: 0 };

        questions.forEach(q => {
            // Check if answer exists for this question
            if (answers[q.id] !== undefined) {
                const cat = q.category as keyof ScoreResult;
                // Double check if category is valid (NS, HA, RD, P)
                if (cat in scores) {
                    // Apply reverse scoring if needed
                    // 1 <-> 5, 2 <-> 4, 3 <-> 3
                    // Equation: Revised Score = 6 - Original Score
                    const scoreValue = q.reverse ? (6 - answers[q.id]) : answers[q.id];

                    scores[cat] += scoreValue;
                    counts[cat]++;
                }
            }
        });

        // Normalize to 0-100 scale
        // Formula: (Total Score / (Number of Items * 5)) * 100
        // Max score per item is 5.
        const normalized: ScoreResult = {
            NS: counts.NS > 0 ? Math.round((scores.NS / (counts.NS * 5)) * 100) : 0,
            HA: counts.HA > 0 ? Math.round((scores.HA / (counts.HA * 5)) * 100) : 0,
            RD: counts.RD > 0 ? Math.round((scores.RD / (counts.RD * 5)) * 100) : 0,
            P: counts.P > 0 ? Math.round((scores.P / (counts.P * 5)) * 100) : 0,
        };

        return normalized;
    }
}
