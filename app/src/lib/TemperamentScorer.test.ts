import { TemperamentScorer } from './TemperamentScorer';
import { Question } from '../types/survey';

// Using a subset of questions to test specific logic (Normal + Reverse)
const MOCK_QUESTIONS: Question[] = [
    {
        id: 1, type: 'CHILD', category: 'NS', facet: 'Test NS 1',
        choices: ["1", "2", "3", "4", "5"]
    },
    {
        id: 2, type: 'CHILD', category: 'NS', facet: 'Test NS 2',
        choices: ["1", "2", "3", "4", "5"]
    },
    {
        id: 3, type: 'CHILD', category: 'HA', facet: 'Test HA Normal',
        choices: ["1", "2", "3", "4", "5"]
    },
    {
        id: 4, type: 'CHILD', category: 'HA', facet: 'Test HA Reverse',
        choices: ["1", "2", "3", "4", "5"],
        reverse: true // High score = Low Trait
    }
];

describe('TemperamentScorer', () => {

    test('calculate: Minimum Scores (All 1s)', () => {
        const answers = {
            1: 1, // NS
            2: 1, // NS
            3: 1, // HA (Normal) -> 1
            4: 1  // HA (Reverse) -> 5
        };

        const result = TemperamentScorer.calculate(MOCK_QUESTIONS, answers);

        // NS: (1+1) / (2*5) = 2/10 = 20
        expect(result.NS).toBe(20);

        // HA: (1 + 5) / (2*5) = 6/10 = 60
        expect(result.HA).toBe(60);
    });

    test('calculate: Maximum Scores (All 5s)', () => {
        const answers = {
            1: 5, // NS
            2: 5, // NS
            3: 5, // HA (Normal) -> 5
            4: 5  // HA (Reverse) -> 1
        };

        const result = TemperamentScorer.calculate(MOCK_QUESTIONS, answers);

        // NS: (5+5) / (2*5) = 10/10 = 100
        expect(result.NS).toBe(100);

        // HA: (5 + 1) / (2*5) = 6/10 = 60
        expect(result.HA).toBe(60);
    });

    test('calculate: Mixed Case', () => {
        const answers = {
            1: 3, // NS -> 3
            2: 3, // NS -> 3
            3: 3, // HA -> 3
            4: 3  // HA (Reverse 3 -> 3)
        };

        const result = TemperamentScorer.calculate(MOCK_QUESTIONS, answers);

        // All mid
        expect(result.NS).toBe(60); // 6/10 = 60
        expect(result.HA).toBe(60); // 6/10 = 60
    });

    test('calculate: Reverse Logic Specific Check', () => {
        const answers = {
            4: 5 // High Score on Reverse Item -> Low Trait Value (1)
        };
        // Only providing answer for Q4 (HA Reverse)
        // HA Score: (1) / (1*5) = 1/5 = 20

        // However, calculate logic counts total items based on answers provided?
        // Wait, current logic iterates ALL questions and checks if answer exists.
        // Yes.

        const result = TemperamentScorer.calculate([MOCK_QUESTIONS[3]], answers);
        expect(result.HA).toBe(20);
    });

    test('calculate: Handles Unanswered Questions (Zero Count)', () => {
        const result = TemperamentScorer.calculate(MOCK_QUESTIONS, {});
        expect(result.NS).toBe(0);
        expect(result.HA).toBe(0);
        expect(result.RD).toBe(0);
        expect(result.P).toBe(0);
    });
});
