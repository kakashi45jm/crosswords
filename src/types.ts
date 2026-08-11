export type Direction = 'horizontal' | 'vertical';

export interface GridWord {
  id: string;
  word: string;
  row: number;
  col: number;
  direction: Direction;
  clue?: string;
  definition?: string;
}

export interface GridCell {
  row: number;
  col: number;
  letter: string;
  wordIds: string[];
  isSolved: boolean;
  isHinted?: boolean;
}

export interface LevelData {
  id: number;
  worldId: number;
  worldName: string;
  themeColor: string;
  letters: string[]; // e.g. ['C', 'A', 'T', 'S']
  gridWords: GridWord[];
  bonusWords: string[];
  gridRows: number;
  gridCols: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface WorldTheme {
  id: number;
  name: string;
  bgGradient: string;
  bgImage?: string;
  accentColor: string;
  cardColor: string;
  wheelColor: string;
  levelRange: [number, number];
  icon: string;
}

export interface SavedLevelProgress {
  levelId: number;
  stars: number; // 1 - 3
  solvedWords: string[];
  discoveredBonusWords: string[];
  revealedHints: { row: number; col: number }[];
  isCompleted: boolean;
}

export interface PlayerData {
  coins: number;
  currentLevelId: number;
  unlockedLevelMax: number;
  levelProgress: Record<number, SavedLevelProgress>;
  totalStars: number;
  totalBonusWordsFound: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  theme: string;
  dailyStreak: number;
  lastLoginDate: string;
}

export interface WordDefinition {
  word: string;
  partOfSpeech: string;
  definition: string;
}
