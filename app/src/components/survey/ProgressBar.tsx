import React from 'react';

interface ProgressBarProps {
    progress: number; // 0 to 100
    themeColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, themeColor = '#6C5CE7' }) => {
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
                className="h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%`, backgroundColor: themeColor }}
            ></div>
        </div>
    );
};
