import { LevelData, GridWord, WorldTheme } from '../types';
import { isWordValidInDictionary, RAW_DICTIONARY_WORDS } from './dictionary';

export const WORLD_THEMES: WorldTheme[] = [
  {
    id: 1,
    name: 'Elegant Night',
    bgGradient: 'from-slate-950 via-slate-900 to-slate-950',
    bgImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#f59e0b',
    cardColor: 'bg-slate-800/90 border-slate-700/80',
    wheelColor: 'from-amber-500 via-orange-500 to-amber-600',
    levelRange: [1, 50],
    icon: '🌙',
  },
  {
    id: 2,
    name: 'Midnight Sapphire',
    bgGradient: 'from-slate-950 via-blue-950 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#38bdf8',
    cardColor: 'bg-slate-800/90 border-blue-900/60',
    wheelColor: 'from-sky-500 via-blue-600 to-indigo-600',
    levelRange: [51, 100],
    icon: '💎',
  },
  {
    id: 3,
    name: 'Emerald Forest',
    bgGradient: 'from-slate-950 via-emerald-950 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#34d399',
    cardColor: 'bg-slate-800/90 border-emerald-900/60',
    wheelColor: 'from-emerald-500 via-teal-600 to-green-600',
    levelRange: [101, 150],
    icon: '🍃',
  },
  {
    id: 4,
    name: 'Mystic Violet',
    bgGradient: 'from-slate-950 via-purple-950 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#c084fc',
    cardColor: 'bg-slate-800/90 border-purple-900/60',
    wheelColor: 'from-purple-500 via-indigo-600 to-violet-600',
    levelRange: [151, 200],
    icon: '🔮',
  },
  {
    id: 5,
    name: 'Obsidian Gold',
    bgGradient: 'from-stone-950 via-neutral-900 to-stone-950',
    bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#fbbf24',
    cardColor: 'bg-stone-800/90 border-amber-900/60',
    wheelColor: 'from-amber-500 via-yellow-600 to-orange-600',
    levelRange: [201, 250],
    icon: '👑',
  },
  {
    id: 6,
    name: 'Ruby Sunset',
    bgGradient: 'from-slate-950 via-rose-950 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#fb7185',
    cardColor: 'bg-slate-800/90 border-rose-900/60',
    wheelColor: 'from-rose-500 via-pink-600 to-red-600',
    levelRange: [251, 300],
    icon: '🌹',
  },
  {
    id: 7,
    name: 'Starlight Galaxy',
    bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#818cf8',
    cardColor: 'bg-slate-800/90 border-indigo-900/60',
    wheelColor: 'from-indigo-500 via-slate-700 to-indigo-800',
    levelRange: [301, 350],
    icon: '✨',
  },
  {
    id: 8,
    name: 'Cyan Glacier',
    bgGradient: 'from-slate-950 via-cyan-950 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#22d3ee',
    cardColor: 'bg-slate-800/90 border-cyan-900/60',
    wheelColor: 'from-cyan-500 via-blue-600 to-teal-600',
    levelRange: [351, 400],
    icon: '❄️',
  },
  {
    id: 9,
    name: 'Amber Ember',
    bgGradient: 'from-slate-950 via-orange-950 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#fb923c',
    cardColor: 'bg-slate-800/90 border-orange-900/60',
    wheelColor: 'from-orange-500 via-amber-600 to-red-600',
    levelRange: [401, 450],
    icon: '🔥',
  },
  {
    id: 10,
    name: 'Cyber Aurora',
    bgGradient: 'from-slate-950 via-fuchsia-950 to-slate-900',
    bgImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#e879f9',
    cardColor: 'bg-slate-800/90 border-fuchsia-900/60',
    wheelColor: 'from-fuchsia-500 via-purple-600 to-cyan-600',
    levelRange: [451, 500],
    icon: '⚡',
  },
];

export function getWorldThemeForLevel(levelId: number): WorldTheme {
  const worldIndex = Math.min(Math.floor((levelId - 1) / 50), WORLD_THEMES.length - 1);
  return WORLD_THEMES[worldIndex];
}

// Handcrafted introductory levels
const HANDCRAFTED_LEVELS: Record<number, { letters: string[]; words: { word: string; row: number; col: number; dir: 'horizontal' | 'vertical' }[] }> = {
  1: {
    letters: ['C', 'A', 'T'],
    words: [
      { word: 'CAT', row: 0, col: 0, dir: 'horizontal' },
      { word: 'ACT', row: 0, col: 1, dir: 'vertical' },
    ],
  },
  2: {
    letters: ['D', 'O', 'G'],
    words: [
      { word: 'DOG', row: 0, col: 0, dir: 'horizontal' },
      { word: 'GOD', row: 0, col: 2, dir: 'vertical' },
    ],
  },
  3: {
    letters: ['S', 'U', 'N', 'R'],
    words: [
      { word: 'SUN', row: 1, col: 0, dir: 'horizontal' },
      { word: 'RUN', row: 0, col: 1, dir: 'vertical' },
    ],
  },
  4: {
    letters: ['C', 'A', 'R', 'T'],
    words: [
      { word: 'CART', row: 0, col: 0, dir: 'horizontal' },
      { word: 'CAT', row: 0, col: 0, dir: 'vertical' },
      { word: 'ARC', row: 0, col: 1, dir: 'vertical' },
      { word: 'CAR', row: 2, col: 1, dir: 'horizontal' },
    ],
  },
  5: {
    letters: ['S', 'T', 'A', 'R'],
    words: [
      { word: 'STAR', row: 0, col: 0, dir: 'horizontal' },
      { word: 'SAT', row: 0, col: 0, dir: 'vertical' },
      { word: 'ART', row: 1, col: 0, dir: 'horizontal' },
      { word: 'RAT', row: 0, col: 3, dir: 'vertical' },
    ],
  },
  6: {
    letters: ['F', 'I', 'S', 'H'],
    words: [
      { word: 'FISH', row: 0, col: 0, dir: 'horizontal' },
      { word: 'HIS', row: 0, col: 3, dir: 'vertical' },
    ],
  },
  7: {
    letters: ['B', 'O', 'A', 'T'],
    words: [
      { word: 'BOAT', row: 0, col: 0, dir: 'horizontal' },
      { word: 'BAT', row: 0, col: 0, dir: 'vertical' },
      { word: 'OAT', row: 0, col: 1, dir: 'vertical' },
    ],
  },
  8: {
    letters: ['B', 'I', 'R', 'D'],
    words: [
      { word: 'BIRD', row: 0, col: 0, dir: 'horizontal' },
      { word: 'BID', row: 0, col: 0, dir: 'vertical' },
      { word: 'RIB', row: 0, col: 2, dir: 'vertical' },
    ],
  },
  9: {
    letters: ['F', 'I', 'R', 'E'],
    words: [
      { word: 'FIRE', row: 0, col: 0, dir: 'horizontal' },
      { word: 'FIR', row: 0, col: 0, dir: 'vertical' },
    ],
  },
  10: {
    letters: ['S', 'N', 'O', 'W'],
    words: [
      { word: 'SNOW', row: 0, col: 0, dir: 'horizontal' },
      { word: 'SON', row: 0, col: 0, dir: 'vertical' },
      { word: 'WON', row: 0, col: 3, dir: 'vertical' },
      { word: 'NOW', row: 2, col: 0, dir: 'horizontal' },
    ],
  },
  11: {
    letters: ['P', 'L', 'A', 'N', 'T'],
    words: [
      { word: 'PLANT', row: 0, col: 0, dir: 'horizontal' },
      { word: 'PLAN', row: 0, col: 0, dir: 'vertical' },
      { word: 'ANT', row: 0, col: 2, dir: 'vertical' },
      { word: 'TAN', row: 2, col: 2, dir: 'horizontal' },
    ],
  },
  12: {
    letters: ['B', 'E', 'A', 'C', 'H'],
    words: [
      { word: 'BEACH', row: 0, col: 0, dir: 'horizontal' },
      { word: 'EACH', row: 0, col: 1, dir: 'vertical' },
      { word: 'ACHE', row: 1, col: 1, dir: 'horizontal' },
    ],
  },
  13: {
    letters: ['C', 'L', 'E', 'A', 'N'],
    words: [
      { word: 'CLEAN', row: 0, col: 0, dir: 'horizontal' },
      { word: 'LEAN', row: 0, col: 1, dir: 'vertical' },
      { word: 'CAN', row: 0, col: 0, dir: 'vertical' },
      { word: 'ACE', row: 2, col: 1, dir: 'horizontal' },
    ],
  },
  14: {
    letters: ['D', 'R', 'E', 'A', 'M'],
    words: [
      { word: 'DREAM', row: 0, col: 0, dir: 'horizontal' },
      { word: 'READ', row: 0, col: 1, dir: 'vertical' },
      { word: 'DARE', row: 0, col: 0, dir: 'vertical' },
      { word: 'RAD', row: 2, col: 0, dir: 'horizontal' },
    ],
  },
  15: {
    letters: ['F', 'L', 'A', 'M', 'E'],
    words: [
      { word: 'FLAME', row: 0, col: 0, dir: 'horizontal' },
      { word: 'LAME', row: 0, col: 1, dir: 'vertical' },
      { word: 'FLEA', row: 0, col: 0, dir: 'vertical' },
      { word: 'MALE', row: 2, col: 1, dir: 'horizontal' },
    ],
  },
  16: {
    letters: ['S', 'M', 'I', 'L', 'E'],
    words: [
      { word: 'SMILE', row: 0, col: 0, dir: 'horizontal' },
      { word: 'MILE', row: 0, col: 1, dir: 'vertical' },
      { word: 'SLIM', row: 0, col: 0, dir: 'vertical' },
      { word: 'LIME', row: 2, col: 1, dir: 'horizontal' },
    ],
  },
  17: {
    letters: ['C', 'A', 'S', 'T', 'L', 'E'],
    words: [
      { word: 'CASTLE', row: 0, col: 0, dir: 'horizontal' },
      { word: 'SCALE', row: 0, col: 2, dir: 'vertical' },
      { word: 'TALE', row: 0, col: 3, dir: 'vertical' },
      { word: 'CAST', row: 0, col: 0, dir: 'vertical' },
    ],
  },
  18: {
    letters: ['F', 'L', 'O', 'W', 'E', 'R'],
    words: [
      { word: 'FLOWER', row: 0, col: 0, dir: 'horizontal' },
      { word: 'FLOW', row: 0, col: 0, dir: 'vertical' },
      { word: 'WOLF', row: 0, col: 3, dir: 'vertical' },
      { word: 'ROLE', row: 4, col: 1, dir: 'horizontal' },
    ],
  },
  19: {
    letters: ['G', 'A', 'R', 'D', 'E', 'N'],
    words: [
      { word: 'GARDEN', row: 0, col: 0, dir: 'horizontal' },
      { word: 'DANGER', row: 0, col: 3, dir: 'vertical' },
      { word: 'NEAR', row: 2, col: 3, dir: 'horizontal' },
      { word: 'RED', row: 0, col: 2, dir: 'vertical' },
    ],
  },
  20: {
    letters: ['S', 'P', 'R', 'I', 'N', 'G'],
    words: [
      { word: 'SPRING', row: 0, col: 0, dir: 'horizontal' },
      { word: 'RING', row: 0, col: 2, dir: 'vertical' },
      { word: 'SPIN', row: 0, col: 0, dir: 'vertical' },
      { word: 'PING', row: 0, col: 1, dir: 'vertical' },
    ],
  },
  21: {
    letters: ['S', 'I', 'L', 'V', 'E', 'R'],
    words: [
      { word: 'SILVER', row: 0, col: 0, dir: 'horizontal' },
      { word: 'RIVER', row: 0, col: 5, dir: 'vertical' },
      { word: 'LIVE', row: 0, col: 2, dir: 'vertical' },
      { word: 'VEIL', row: 3, col: 1, dir: 'horizontal' },
    ],
  },
  22: {
    letters: ['B', 'R', 'I', 'D', 'G', 'E'],
    words: [
      { word: 'BRIDGE', row: 0, col: 0, dir: 'horizontal' },
      { word: 'RIDGE', row: 0, col: 1, dir: 'vertical' },
      { word: 'BIRD', row: 0, col: 0, dir: 'vertical' },
      { word: 'DIE', row: 2, col: 1, dir: 'horizontal' },
    ],
  },
  23: {
    letters: ['H', 'A', 'R', 'B', 'O', 'R'],
    words: [
      { word: 'HARBOR', row: 0, col: 0, dir: 'horizontal' },
      { word: 'ROAR', row: 0, col: 2, dir: 'vertical' },
      { word: 'BAR', row: 0, col: 3, dir: 'vertical' },
      { word: 'BOAR', row: 1, col: 2, dir: 'horizontal' },
    ],
  },
  24: {
    letters: ['F', 'O', 'R', 'E', 'S', 'T'],
    words: [
      { word: 'FOREST', row: 0, col: 0, dir: 'horizontal' },
      { word: 'REST', row: 0, col: 2, dir: 'vertical' },
      { word: 'FORT', row: 0, col: 0, dir: 'vertical' },
      { word: 'SORE', row: 0, col: 4, dir: 'vertical' },
    ],
  },
  25: {
    letters: ['S', 'U', 'N', 'L', 'I', 'G', 'H', 'T'],
    words: [
      { word: 'SUNLIGHT', row: 0, col: 0, dir: 'horizontal' },
      { word: 'LIGHT', row: 0, col: 3, dir: 'vertical' },
      { word: 'NIGHT', row: 0, col: 2, dir: 'vertical' },
      { word: 'SIGHT', row: 0, col: 0, dir: 'vertical' },
    ],
  },
};

// Seed-based pseudo-random number generator for deterministic levels
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate valid subwords that can be constructed from letters
function findPossibleWordsFromLetters(letters: string[]): string[] {
  const letterCount: Record<string, number> = {};
  letters.forEach((char) => {
    letterCount[char] = (letterCount[char] || 0) + 1;
  });

  return RAW_DICTIONARY_WORDS.filter((word) => {
    if (word.length < 3) return false;
    const tempCount = { ...letterCount };
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!tempCount[char]) return false;
      tempCount[char]--;
    }
    return true;
  });
}

// Root candidates for procedurally generated levels
const ROOT_WORD_POOL = [
  'PLANET', 'FLOWER', 'GARDEN', 'STREAM', 'HARBOR', 'SPRING', 'CASTLE', 'SILVER',
  'BREEZE', 'SUMMER', 'WINTER', 'FOREST', 'BRIDGE', 'DRAGON', 'YELLOW', 'BEAUTY',
  'CANDLE', 'CHANCE', 'CIRCLE', 'CLEVER', 'ISLAND', 'LANTERN', 'MIRROR', 'ORANGE',
  'POCKET', 'PUZZLE', 'TALENT', 'TRAVEL', 'WONDER', 'ACTION', 'ANIMAL', 'ANSWER'
];

export function getLevelData(levelId: number): LevelData {
  const theme = getWorldThemeForLevel(levelId);

  let letters: string[] = [];
  let gridWords: GridWord[] = [];
  let allPossibleWords: string[] = [];

  if (HANDCRAFTED_LEVELS[levelId]) {
    const raw = HANDCRAFTED_LEVELS[levelId];
    letters = [...raw.letters];
    gridWords = raw.words.map((w, index) => ({
      id: `w_${levelId}_${index}`,
      word: w.word,
      row: w.row,
      col: w.col,
      direction: w.dir,
    }));
    allPossibleWords = findPossibleWordsFromLetters(letters);
  } else {
    // Procedurally generated level
    const rootIndex = Math.floor(seededRandom(levelId * 17) * ROOT_WORD_POOL.length);
    const rootWord = ROOT_WORD_POOL[rootIndex];
    letters = rootWord.split('').sort(() => seededRandom(levelId * 3) - 0.5);

    allPossibleWords = findPossibleWordsFromLetters(letters);

    // Pick 3-5 subwords for the crossword grid
    const targetGridWords = allPossibleWords
      .filter((w) => w.length >= 3)
      .sort((a, b) => b.length - a.length);

    const chosen: string[] = [rootWord];
    for (const w of targetGridWords) {
      if (chosen.length >= 4) break;
      if (!chosen.includes(w)) {
        chosen.push(w);
      }
    }

    // Layout engine: Place root word at (0,0) horizontally
    gridWords.push({
      id: `w_${levelId}_0`,
      word: rootWord,
      row: 1,
      col: 0,
      direction: 'horizontal',
    });

    let verticalOffset = 0;
    const usedCols = new Set<number>();
    chosen.slice(1).forEach((word, idx) => {
      // Find intersecting letter
      let placed = false;
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const rootCharIdx = rootWord.indexOf(char);
        if (rootCharIdx !== -1 && !usedCols.has(rootCharIdx)) {
          usedCols.add(rootCharIdx);
          gridWords.push({
            id: `w_${levelId}_${idx + 1}`,
            word: word,
            row: 1 - i,
            col: rootCharIdx,
            direction: 'vertical',
          });
          placed = true;
          break;
        }
      }
      if (!placed) {
        gridWords.push({
          id: `w_${levelId}_${idx + 1}`,
          word: word,
          row: 3 + verticalOffset,
          col: 1,
          direction: 'horizontal',
        });
        verticalOffset += 2;
      }
    });
  }

  // Normalize grid coordinates to start from top-left (0,0)
  let minRow = Infinity;
  let minCol = Infinity;
  let maxRow = -Infinity;
  let maxCol = -Infinity;

  gridWords.forEach((gw) => {
    const len = gw.word.length;
    const endRow = gw.direction === 'vertical' ? gw.row + len - 1 : gw.row;
    const endCol = gw.direction === 'horizontal' ? gw.col + len - 1 : gw.col;

    minRow = Math.min(minRow, gw.row);
    minCol = Math.min(minCol, gw.col);
    maxRow = Math.max(maxRow, endRow);
    maxCol = Math.max(maxCol, endCol);
  });

  const rowOffset = minRow < 0 ? Math.abs(minRow) : -minRow;
  const colOffset = minCol < 0 ? Math.abs(minCol) : -minCol;

  gridWords = gridWords.map((gw) => ({
    ...gw,
    row: gw.row + rowOffset,
    col: gw.col + colOffset,
  }));

  const gridRows = maxRow - minRow + 1;
  const gridCols = maxCol - minCol + 1;

  const requiredSet = new Set(gridWords.map((w) => w.word));
  const bonusWords = allPossibleWords.filter((w) => !requiredSet.has(w));

  const difficulty: 'easy' | 'medium' | 'hard' | 'expert' =
    letters.length <= 4 ? 'easy' : letters.length <= 5 ? 'medium' : letters.length <= 6 ? 'hard' : 'expert';

  return {
    id: levelId,
    worldId: theme.id,
    worldName: theme.name,
    themeColor: theme.accentColor,
    letters,
    gridWords,
    bonusWords,
    gridRows,
    gridCols,
    difficulty,
  };
}
