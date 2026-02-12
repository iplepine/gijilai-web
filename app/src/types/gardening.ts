export type GardenTheme = 'SUNNY' | 'RAINY' | 'NIGHT' | 'SPRING';
export type PlantStage = 'SEED' | 'SPROUT' | 'GROWING' | 'BLOOMING' | 'FRUIT';

export interface GardenState {
    level: number;
    exp: number;
    maxExp: number;
    theme: GardenTheme;
    plantType: string; // e.g., 'Sunflower', 'Rose'
    stage: PlantStage;
    streak: number;
}

export interface DailyMission {
    id: string;
    date: string; // YYYY-MM-DD
    title: string; // 오늘의 한 문장
    guide: string; // 실행 가이드
    isCompleted: boolean;
}

export interface ProgramCycle {
    id: string;
    childId: string;
    concern: string; // e.g., '떼쓰기'
    duration: 3 | 7 | 14 | 21;
    startDate: string;
    currentDay: number;
}

// Mock Data Generators
export const MOCH_GARDEN_STATE: GardenState = {
    level: 1,
    exp: 20,
    maxExp: 100,
    theme: 'SUNNY',
    plantType: 'Sunflower',
    stage: 'SPROUT',
    streak: 3,
};

export const MOCK_DAILY_MISSION: DailyMission = {
    id: 'mission-001',
    date: new Date().toISOString().split('T')[0],
    title: '아이의 감정을 5초간 있는 그대로 읽어주세요.',
    guide: '아이가 울 때 바로 달래거나 그치라고 하기보다, "지금 많이 속상하구나"라고 말하고 5초간 기다려주세요. 아이 스스로 감정을 진정시킬 시간을 주는 것입니다.',
    isCompleted: false,
};

export const MOCK_PROGRAM_CYCLE: ProgramCycle = {
    id: 'cycle-001',
    childId: 'child-123',
    concern: '떼쓰기',
    duration: 7,
    startDate: '2023-10-01',
    currentDay: 3,
};
