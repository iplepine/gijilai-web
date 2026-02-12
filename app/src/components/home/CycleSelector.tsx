'use client';

import { ProgramCycle } from '@/types/gardening';
import { Icon } from '@/components/ui/Icon';

interface CycleSelectorProps {
    cycle: ProgramCycle | null;
    onChange: () => void;
}

export function CycleSelector({ cycle, onChange }: CycleSelectorProps) {
    if (!cycle) {
        return (
            <button
                onClick={onChange}
                className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
            >
                <Icon name="add_circle" />
                <span className="font-medium">새로운 돌봄 루틴 시작하기</span>
            </button>
        );
    }

    const progress = (cycle.currentDay / cycle.duration) * 100;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-primary text-sm">📅</span>
                    {cycle.concern} 마음 돌봄 루틴 ({cycle.duration}일)
                </h3>
                <button className="text-xs text-gray-400 underline" onClick={onChange}>변경</button>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                    className="absolute top-0 left-0 h-full bg-garden-green rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Day {cycle.currentDay}</span>
                <span>{cycle.duration - cycle.currentDay}일 남음</span>
            </div>
        </div>
    );
}
