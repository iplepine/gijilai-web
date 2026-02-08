import React from 'react';
import { Question } from '../../types/survey';

interface QuestionCardProps {
    question: Question;
    currentAnswer?: number;
    onAnswer: (score: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, currentAnswer, onAnswer }) => {
    const options = [
        { value: 1, label: '전혀 아님' },
        { value: 2, label: '아님' },
        { value: 3, label: '보통' },
        { value: 4, label: '그렇다' },
        { value: 5, label: '매우 그렇다' },
    ];

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 min-h-[400px] w-full max-w-md mx-auto animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Q{question.id}</h3>
            <p className="text-lg text-gray-600 text-center mb-8 leading-relaxed break-keep">
                {question.text}
            </p>

            <div className="flex flex-col w-full gap-3">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onAnswer(option.value)}
                        className={`
              w-full py-4 px-6 rounded-xl text-left transition-all duration-200 font-medium
              ${currentAnswer === option.value
                                ? 'bg-primary/10 border-2 border-primary text-primary'
                                : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                            }
            `}
                        style={{
                            borderColor: currentAnswer === option.value ? '#6C5CE7' : undefined,
                            color: currentAnswer === option.value ? '#6C5CE7' : undefined,
                            backgroundColor: currentAnswer === option.value ? '#6C5CE71A' : undefined
                        }}
                    >
                        <span className="flex items-center justify-between">
                            <span>{option.label}</span>
                            {currentAnswer === option.value && (
                                <span className="text-lg">✓</span>
                            )}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
