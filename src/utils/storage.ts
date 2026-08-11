import { PlayerData, SavedLevelProgress } from '../types';

const STORAGE_KEY = 'word_connect_crossword_save_v1';

export const DEFAULT_PLAYER_DATA: PlayerData = {
  coins: 500,
  currentLevelId: 1,
  unlockedLevelMax: 1,
  levelProgress: {},
  totalStars: 0,
  totalBonusWordsFound: 0,
  soundEnabled: true,
  musicEnabled: true,
  theme: 'nature',
  dailyStreak: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
};

export function loadPlayerData(): PlayerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PLAYER_DATA };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PLAYER_DATA,
      ...parsed,
      levelProgress: parsed.levelProgress || {},
    };
  } catch (e) {
    console.warn('LocalStorage error or restricted mode, using memory state', e);
    return { ...DEFAULT_PLAYER_DATA };
  }
}

export function savePlayerData(data: PlayerData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

export function clearPlayerData(): PlayerData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('LocalStorage clear failed', e);
  }
  return { ...DEFAULT_PLAYER_DATA };
}

export function updateLevelSave(
  playerData: PlayerData,
  levelId: number,
  updateFn: (prev: SavedLevelProgress) => SavedLevelProgress
): PlayerData {
  const existing = playerData.levelProgress[levelId] || {
    levelId,
    stars: 0,
    solvedWords: [],
    discoveredBonusWords: [],
    revealedHints: [],
    isCompleted: false,
  };

  const updated = updateFn(existing);
  const newProgressMap = {
    ...playerData.levelProgress,
    [levelId]: updated,
  };

  // Recalculate stars
  let totalStars = 0;
  Object.values(newProgressMap).forEach((p) => {
    totalStars += p.stars || 0;
  });

  const updatedPlayer = {
    ...playerData,
    levelProgress: newProgressMap,
    totalStars,
  };

  savePlayerData(updatedPlayer);
  return updatedPlayer;
}
