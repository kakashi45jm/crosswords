import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { CrosswordGrid } from './components/CrosswordGrid';
import { WordPreview, WordPreviewStatus } from './components/WordPreview';
import { LetterWheel } from './components/LetterWheel';
import { ActionControls } from './components/ActionControls';
import { LevelSelectModal } from './components/LevelSelectModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { BonusWordsModal } from './components/BonusWordsModal';
import { SettingsModal } from './components/SettingsModal';
import { WordDictionaryModal } from './components/WordDictionaryModal';

import { getLevelData, getWorldThemeForLevel } from './data/levels';
import { loadPlayerData, savePlayerData, updateLevelSave, clearPlayerData } from './utils/storage';
import { soundFx } from './utils/audio';
import { PlayerData } from './types';

export default function App() {
  // Player data state
  const [playerData, setPlayerData] = useState<PlayerData>(() => loadPlayerData());

  // Current active level data
  const currentLevelId = playerData.currentLevelId;
  const levelData = useMemo(() => getLevelData(currentLevelId), [currentLevelId]);
  const worldTheme = useMemo(() => getWorldThemeForLevel(currentLevelId), [currentLevelId]);

  // Letter wheel shuffle array state
  const [wheelLetters, setWheelLetters] = useState<string[]>(() => [...levelData.letters]);
  const [shuffleToken, setShuffleToken] = useState<number>(0);

  // In-level progress state
  const savedProgress = playerData.levelProgress[currentLevelId];
  const [solvedWordIds, setSolvedWordIds] = useState<string[]>(() => savedProgress?.solvedWords || []);
  const [discoveredBonusWords, setDiscoveredBonusWords] = useState<string[]>(
    () => savedProgress?.discoveredBonusWords || []
  );
  const [revealedHints, setRevealedHints] = useState<{ row: number; col: number }[]>(
    () => savedProgress?.revealedHints || []
  );

  // Wheel selection state
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [previewStatus, setPreviewStatus] = useState<WordPreviewStatus>('idle');
  const [statusText, setStatusText] = useState<string>('');

  // Target Hint state
  const [targetHintActive, setTargetHintActive] = useState<boolean>(false);

  // Modals state
  const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showBonusModal, setShowBonusModal] = useState<boolean>(false);
  const [showLevelComplete, setShowLevelComplete] = useState<boolean>(false);
  const [activeDefinitionWord, setActiveDefinitionWord] = useState<string | null>(null);

  // Last level completed reward stats
  const [completedStats, setCompletedStats] = useState<{ stars: number; coins: number }>({
    stars: 3,
    coins: 500,
  });

  // Sync mute setting to soundFx engine
  useEffect(() => {
    soundFx.setMuted(!playerData.soundEnabled);
  }, [playerData.soundEnabled]);

  // Reset in-level state when level changes
  useEffect(() => {
    const prog = playerData.levelProgress[currentLevelId];
    setWheelLetters([...levelData.letters]);
    setSolvedWordIds(prog?.solvedWords || []);
    setDiscoveredBonusWords(prog?.discoveredBonusWords || []);
    setRevealedHints(prog?.revealedHints || []);
    setSelectedIndices([]);
    setPreviewStatus('idle');
    setStatusText('');
    setTargetHintActive(false);
    setShowLevelComplete(false);
  }, [currentLevelId, levelData, playerData.levelProgress]);

  // Active word spelling derived from wheel selections
  const activeWord = useMemo(() => {
    return selectedIndices.map((idx) => wheelLetters[idx]).join('');
  }, [selectedIndices, wheelLetters]);

  // Handle letter selection changes
  const handleSelectionChange = useCallback((indices: number[]) => {
    setSelectedIndices(indices);
    setPreviewStatus('idle');
    setStatusText('');
  }, []);

  // Submit active word
  const handleSubmitWord = useCallback(() => {
    if (!activeWord || activeWord.length < 2) {
      setSelectedIndices([]);
      return;
    }

    const matchedGridWord = levelData.gridWords.find((gw) => gw.word === activeWord);

    if (matchedGridWord) {
      if (solvedWordIds.includes(matchedGridWord.id)) {
        // Already solved
        soundFx.playDuplicateWord();
        setPreviewStatus('duplicate');
        setStatusText('Already Solved');
      } else {
        // Newly solved required word!
        const newSolved = [...solvedWordIds, matchedGridWord.id];
        setSolvedWordIds(newSolved);
        soundFx.playWordValid();
        setPreviewStatus('valid');
        setStatusText('Great Job!');

        // Update local save
        const isLevelFinished = newSolved.length === levelData.gridWords.length;
        setPlayerData((prev) =>
          updateLevelSave(prev, currentLevelId, (p) => ({
            ...p,
            solvedWords: newSolved,
            isCompleted: isLevelFinished ? true : p.isCompleted,
          }))
        );

        // Check level complete
        if (isLevelFinished) {
          setTimeout(() => {
            const hintsUsed = revealedHints.length;
            const stars = hintsUsed === 0 ? 3 : hintsUsed <= 2 ? 2 : 1;
            const coinsEarned = 500 + discoveredBonusWords.length * 50;

            setCompletedStats({ stars, coins: coinsEarned });

            // Unlock next level & add coins
            setPlayerData((prev) => {
              const newCoins = prev.coins + coinsEarned;
              const nextLvl = currentLevelId + 1;
              const newMax = Math.max(prev.unlockedLevelMax, nextLvl);
              const updated = {
                ...prev,
                coins: newCoins,
                unlockedLevelMax: newMax,
              };
              savePlayerData(updated);
              return updated;
            });

            soundFx.playLevelComplete();
            setShowLevelComplete(true);
          }, 400);
        }
      }
    } else if (levelData.bonusWords.includes(activeWord)) {
      if (discoveredBonusWords.includes(activeWord)) {
        soundFx.playDuplicateWord();
        setPreviewStatus('duplicate');
        setStatusText('Bonus Already Found');
      } else {
        // Newly found bonus word!
        const newBonus = [...discoveredBonusWords, activeWord];
        setDiscoveredBonusWords(newBonus);
        soundFx.playBonusWord();
        setPreviewStatus('bonus');
        setStatusText('+50 Coins Bonus!');

        // Add 50 bonus coins
        setPlayerData((prev) => {
          const updated = {
            ...prev,
            coins: prev.coins + 50,
            totalBonusWordsFound: prev.totalBonusWordsFound + 1,
          };
          savePlayerData(updated);
          return updateLevelSave(updated, currentLevelId, (p) => ({
            ...p,
            discoveredBonusWords: newBonus,
          }));
        });
      }
    } else {
      // Invalid word
      soundFx.playWordInvalid();
      setPreviewStatus('invalid');
      setStatusText('Not in Word List');
    }

    // Clear selection after brief delay
    setTimeout(() => {
      setSelectedIndices([]);
      setPreviewStatus('idle');
      setStatusText('');
    }, 400);
  }, [
    activeWord,
    levelData,
    solvedWordIds,
    discoveredBonusWords,
    revealedHints,
    currentLevelId,
  ]);

  // Shuffle letter wheel order
  const handleShuffle = useCallback(() => {
    soundFx.playShuffle();
    setWheelLetters((prev) => [...prev].sort(() => Math.random() - 0.5));
    setShuffleToken((prev) => prev + 1);
    setSelectedIndices([]);
  }, []);

  // Hint Logic
  const handleHint = useCallback(
    (type: 'standard' | 'target' | 'multi') => {
      let cost = 25;
      let count = 1;

      if (type === 'target') {
        cost = 40;
        setTargetHintActive(true);
        setStatusText('Tap a blank cell to reveal');
        return;
      } else if (type === 'multi') {
        cost = 80;
        count = 3;
      }

      if (playerData.coins < cost) {
        soundFx.playWordInvalid();
        setStatusText('Not enough coins!');
        setTimeout(() => setStatusText(''), 1000);
        return;
      }

      // Collect all unsolved letter cell coordinates
      const unsolvedCells: { row: number; col: number; char: string }[] = [];
      const solvedSet = new Set(solvedWordIds);
      const hintsSet = new Set(revealedHints.map((h) => `${h.row}_${h.col}`));

      levelData.gridWords.forEach((gw) => {
        if (!solvedSet.has(gw.id)) {
          gw.word.split('').forEach((char, idx) => {
            const r = gw.direction === 'vertical' ? gw.row + idx : gw.row;
            const c = gw.direction === 'horizontal' ? gw.col + idx : gw.col;
            if (!hintsSet.has(`${r}_${c}`)) {
              unsolvedCells.push({ row: r, col: c, char });
            }
          });
        }
      });

      if (unsolvedCells.length === 0) {
        setStatusText('All cells revealed!');
        setTimeout(() => setStatusText(''), 1000);
        return;
      }

      // Deduct coins & reveal random cells
      const toReveal = unsolvedCells.sort(() => Math.random() - 0.5).slice(0, count);
      const newHints = [...revealedHints, ...toReveal.map((c) => ({ row: c.row, col: c.col }))];

      setRevealedHints(newHints);
      soundFx.playHint();

      setPlayerData((prev) => {
        const updated = { ...prev, coins: prev.coins - cost };
        savePlayerData(updated);
        return updateLevelSave(updated, currentLevelId, (p) => ({
          ...p,
          revealedHints: newHints,
        }));
      });
    },
    [playerData.coins, solvedWordIds, revealedHints, levelData, currentLevelId]
  );

  // Target Cell Hint Click
  const handleTargetCellClick = useCallback(
    (row: number, col: number) => {
      if (!targetHintActive) return;

      if (playerData.coins < 40) {
        soundFx.playWordInvalid();
        setStatusText('Not enough coins!');
        setTargetHintActive(false);
        return;
      }

      const hintsSet = new Set(revealedHints.map((h) => `${h.row}_${h.col}`));
      if (hintsSet.has(`${row}_${col}`)) {
        setTargetHintActive(false);
        return;
      }

      const newHints = [...revealedHints, { row, col }];
      setRevealedHints(newHints);
      soundFx.playHint();
      setTargetHintActive(false);

      setPlayerData((prev) => {
        const updated = { ...prev, coins: prev.coins - 40 };
        savePlayerData(updated);
        return updateLevelSave(updated, currentLevelId, (p) => ({
          ...p,
          revealedHints: newHints,
        }));
      });
    },
    [targetHintActive, playerData.coins, revealedHints, currentLevelId]
  );

  // Toggle sound enabled
  const handleToggleSound = useCallback(() => {
    setPlayerData((prev) => {
      const updated = { ...prev, soundEnabled: !prev.soundEnabled };
      savePlayerData(updated);
      return updated;
    });
  }, []);

  // Reset Game Data
  const handleResetProgress = useCallback(() => {
    const fresh = clearPlayerData();
    setPlayerData(fresh);
  }, []);

  // Level Navigation
  const handleSelectLevel = useCallback((lvlId: number) => {
    setPlayerData((prev) => {
      const updated = { ...prev, currentLevelId: lvlId };
      savePlayerData(updated);
      return updated;
    });
  }, []);

  const handleNextLevel = useCallback(() => {
    const nextLvl = currentLevelId + 1;
    handleSelectLevel(nextLvl);
    setShowLevelComplete(false);
  }, [currentLevelId, handleSelectLevel]);

  const handleReplayLevel = useCallback(() => {
    // Reset level progress in save
    setPlayerData((prev) =>
      updateLevelSave(prev, currentLevelId, () => ({
        levelId: currentLevelId,
        stars: 0,
        solvedWords: [],
        discoveredBonusWords: [],
        revealedHints: [],
        isCompleted: false,
      }))
    );
    setSolvedWordIds([]);
    setDiscoveredBonusWords([]);
    setRevealedHints([]);
    setShowLevelComplete(false);
  }, [currentLevelId]);

  return (
    <div
      className={`w-full h-full flex flex-col bg-gradient-to-b ${worldTheme.bgGradient} transition-colors duration-500 overflow-hidden relative no-scroll`}
    >
      {/* Play Store Wordscapes-style Scenic Background Picture */}
      {worldTheme.bgImage && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={worldTheme.bgImage}
            alt={worldTheme.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-35 scale-105 transition-all duration-700 ease-in-out filter brightness-75 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/90 backdrop-blur-[1px]" />
        </div>
      )}

      {/* Main Game Interface Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {/* Top Header */}
        <Header
          levelId={currentLevelId}
          worldTheme={worldTheme}
          coins={playerData.coins}
          totalStars={playerData.totalStars}
          bonusCount={discoveredBonusWords.length}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenBonusWords={() => setShowBonusModal(true)}
        />

        {/* Crossword Grid Matrix Area */}
        <CrosswordGrid
          gridWords={levelData.gridWords}
          gridRows={levelData.gridRows}
          gridCols={levelData.gridCols}
          solvedWordIds={solvedWordIds}
          revealedHints={revealedHints}
          onSelectWord={(word) => setActiveDefinitionWord(word)}
          onSelectCell={(row, col) => handleTargetCellClick(row, col)}
        />

        {/* Active Word Spelling Preview */}
        <WordPreview
          currentWord={activeWord}
          status={previewStatus}
          statusText={statusText}
        />

        {/* Interactive Circular Letter Wheel */}
        <LetterWheel
          letters={wheelLetters}
          selectedIndices={selectedIndices}
          onSelectionChange={handleSelectionChange}
          onSubmitWord={handleSubmitWord}
          onLetterSound={(step) => soundFx.playLetterSelect(step)}
          shuffleToken={shuffleToken}
        />

        {/* Action Controls Bar */}
        <ActionControls
          onShuffle={handleShuffle}
          onHint={handleHint}
          onClear={() => setSelectedIndices([])}
          onSubmit={handleSubmitWord}
          coins={playerData.coins}
          hasActiveWord={selectedIndices.length > 0}
        />
      </div>

      {/* Modals */}
      {showLevelSelect && (
        <LevelSelectModal
          playerData={playerData}
          onSelectLevel={handleSelectLevel}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {showLevelComplete && (
        <LevelCompleteModal
          levelData={levelData}
          stars={completedStats.stars}
          earnedCoins={completedStats.coins}
          bonusWordsFound={discoveredBonusWords}
          solvedWords={levelData.gridWords.map((w) => w.word)}
          onNextLevel={handleNextLevel}
          onReplayLevel={handleReplayLevel}
          onOpenWordDefinition={(word) => setActiveDefinitionWord(word)}
        />
      )}

      {showBonusModal && (
        <BonusWordsModal
          discoveredBonusWords={discoveredBonusWords}
          totalBonusWordsInLevel={levelData.bonusWords}
          onClose={() => setShowBonusModal(false)}
          onOpenWordDefinition={(word) => setActiveDefinitionWord(word)}
        />
      )}

      {showSettings && (
        <SettingsModal
          playerData={playerData}
          onToggleSound={handleToggleSound}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettings(false)}
        />
      )}

      {activeDefinitionWord && (
        <WordDictionaryModal
          word={activeDefinitionWord}
          onClose={() => setActiveDefinitionWord(null)}
        />
      )}
    </div>
  );
}
