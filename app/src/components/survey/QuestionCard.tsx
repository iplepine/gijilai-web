import React from 'react';
import { Question } from '../../types/survey';

interface QuestionCardProps {
    question: Question;
    currentAnswer?: number;
    onAnswer: (score: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, currentAnswer, onAnswer }) => {
    // BARS-specific rendering logic
    const isBARS = !!question.context;

    const renderOptionContent = (value: number, label: string) => {
        let description = '';
        let icon = '';

        if (isBARS) {
            if (value === 1) {
                description = question.lowScoreDescription || '';
                icon = '😨'; // Default icon for low intensity/hesitation
            } else if (value === 3) {
                description = question.midScoreDescription || '';
                icon = '🤔'; // Default icon for mid intensity/observation
            } else if (value === 5) {
                description = question.highScoreDescription || '';
                icon = '🤩'; // Default icon for high intensity/action
            }
        }

        // Custom icons based on context/reversal could be added here, 
        // but for now we stick to the requested simple mapping.

        return (
            <div className="flex items-center w-full">
                {/* Icon Wrapper */}
                {icon && (
                    <div className="mr-4 text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                        {icon}
                    </div>
                )}

                <div className="flex-1 text-left">
                    <div className="font-bold text-gray-800 text-sm mb-0.5">
                        {value}. {label}
                    </div>
                    {description && (
                        <div className="text-xs text-gray-500 font-normal break-keep">
                            {description}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const options = [
        { value: 1, label: '매우 그렇지 않다' }, // Or specific label if needed
        { value: 2, label: '그렇지 않다' },
        { value: 3, label: '보통이다' },
        { value: 4, label: '그렇다' },
        { value: 5, label: '매우 그렇다' },
    ];

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 min-h-[500px] w-full max-w-md mx-auto animate-fadeIn">
            <div className="mb-6 text-center">
                <span className="text-sm font-bold text-primary tracking-wider uppercase mb-1 block">
                    {question.category} - {question.facet}
                </span>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {isBARS ? question.context : question.text}
                </h3>
                {isBARS && (
                    <p className="text-sm text-gray-400 mt-2">
                        다음 상황에서 아이는 어떻게 행동하나요?
                    </p>
                )}
            </div>

            <div className="flex flex-col w-full gap-3">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onAnswer(option.value)}
                        className={`
              w-full py-3 px-4 rounded-xl border-2 transition-all duration-200
              ${currentAnswer === option.value
                                ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                            }
            `}
                        style={{
                            borderColor: currentAnswer === option.value ? '#6C5CE7' : undefined
                        }}
                    >
                        {renderOptionContent(option.value, option.label)}
                    </button>
                ))}
            </div>
        </div>
    );
};
