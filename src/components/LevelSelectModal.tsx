import React, { useState } from 'react';
import { X, Star, Lock, CheckCircle2 } from 'lucide-react';
import { WORLD_THEMES } from '../data/levels';
import { PlayerData } from '../types';

interface LevelSelectModalProps {
  playerData: PlayerData;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  playerData,
  onSelectLevel,
  onClose,
}) => {
  const currentWorldIndex = Math.floor((playerData.currentLevelId - 1) / 50);
  const [selectedWorldId, setSelectedWorldId] = useState(currentWorldIndex + 1);

  const activeWorld = WORLD_THEMES.find((w) => w.id === selectedWorldId) || WORLD_THEMES[0];
  const [startLevel, endLevel] = activeWorld.levelRange;

  const levelIds: number[] = [];
  for (let i = startLevel; i <= endLevel; i++) {
    levelIds.push(i);
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 w-full max-w-lg h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-tile-pop border border-slate-700/80">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{activeWorld.icon}</span>
            <div>
              <h2 className="text-lg font-black leading-none text-slate-950">{activeWorld.name}</h2>
              <p className="text-xs text-slate-900 font-medium">
                Levels {startLevel} - {endLevel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/30 active:scale-95 text-slate-950"
            id="close-level-select-btn"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* World Theme Tabs */}
        <div className="flex overflow-x-auto p-2 bg-slate-950 gap-2 border-b border-slate-800 no-scrollbar">
          {WORLD_THEMES.map((world) => {
            const isSelected = world.id === selectedWorldId;
            const isWorldUnlocked = playerData.unlockedLevelMax >= world.levelRange[0];

            return (
              <button
                key={`world_tab_${world.id}`}
                onClick={() => isWorldUnlocked && setSelectedWorldId(world.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md scale-105 font-black'
                    : isWorldUnlocked
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
                }`}
              >
                <span>{world.icon}</span>
                <span>W{world.id}</span>
                {!isWorldUnlocked && <Lock className="w-3 h-3 text-slate-500" />}
              </button>
            );
          })}
        </div>

        {/* Level Grid */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-3 bg-slate-900/90">
          {levelIds.map((lvlId) => {
            const isUnlocked = lvlId <= playerData.unlockedLevelMax;
            const isCurrent = lvlId === playerData.currentLevelId;
            const progress = playerData.levelProgress[lvlId];
            const stars = progress?.stars || 0;
            const isCompleted = progress?.isCompleted || false;

            return (
              <button
                key={`lvl_card_${lvlId}`}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(lvlId);
                    onClose();
                  }
                }}
                disabled={!isUnlocked}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-105 ring-2 ring-amber-300 font-extrabold'
                    : isCompleted
                    ? 'bg-slate-800/90 border-emerald-500/60 text-slate-100 hover:border-emerald-400'
                    : isUnlocked
                    ? 'bg-slate-800/80 border-slate-700/80 text-slate-100 hover:border-amber-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed'
                }`}
                id={`level-select-item-${lvlId}`}
              >
                <span className="text-sm font-extrabold">{lvlId}</span>

                {/* Stars or Lock State */}
                {isUnlocked ? (
                  <div className="flex items-center space-x-0.5 mt-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={`s_${starIdx}`}
                        className={`w-3 h-3 ${
                          starIdx <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600 fill-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600 mt-1" />
                )}

                {isCompleted && (
                  <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-emerald-400 fill-slate-950" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
