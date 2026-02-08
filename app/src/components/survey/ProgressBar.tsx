import React from 'react';

interface ProgressBarProps {
    progress: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%`, backgroundColor: '#6C5CE7' }} // Using Primary color from spec
            ></div>
        </div>
    );
};
