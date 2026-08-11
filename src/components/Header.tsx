import React from 'react';
import { MapPin, Coins, Settings, Star, Gift } from 'lucide-react';
import { WorldTheme } from '../types';

interface HeaderProps {
  levelId: number;
  worldTheme: WorldTheme;
  coins: number;
  totalStars: number;
  bonusCount: number;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
  onOpenBonusWords: () => void;
  onClaimDailyReward?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  levelId,
  worldTheme,
  coins,
  totalStars,
  bonusCount,
  onOpenLevelSelect,
  onOpenSettings,
  onOpenBonusWords,
}) => {
  return (
    <header className="w-full max-w-lg mx-auto px-4 py-2 flex items-center justify-between z-20 select-none">
      {/* Level & World Selector */}
      <button
        onClick={onOpenLevelSelect}
        className="flex items-center space-x-1.5 bg-slate-800/90 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md border border-slate-700/80 active:scale-95 transition-transform"
        id="level-select-btn"
      >
        <MapPin className="w-4 h-4 text-amber-400" />
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-slate-100 leading-none">
            Lvl {levelId}
          </span>
          <span className="text-[10px] text-slate-400 font-medium leading-tight">
            {worldTheme.name}
          </span>
        </div>
      </button>

      {/* Middle: Stars & Bonus Jar */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/40">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-amber-300">{totalStars}</span>
        </div>

        <button
          onClick={onOpenBonusWords}
          className="relative flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2.5 py-1 rounded-full shadow-md border border-purple-400/30 active:scale-95 transition-transform"
          id="bonus-words-btn"
        >
          <Gift className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-xs font-bold">Bonus</span>
          {bonusCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 animate-bounce">
              {bonusCount}
            </span>
          )}
        </button>
      </div>

      {/* Right: Coins & Settings */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 bg-slate-800/90 border border-amber-500/40 px-3 py-1 rounded-full shadow-md">
          <Coins className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse-glow" />
          <span className="text-xs font-black text-amber-300">{coins}</span>
        </div>

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-full bg-slate-800/90 shadow-md border border-slate-700/80 text-slate-300 hover:text-white active:rotate-45 transition-transform"
          id="settings-btn"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
