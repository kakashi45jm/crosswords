import React from 'react';
import { Star, Coins, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { LevelData } from '../types';

interface LevelCompleteModalProps {
  levelData: LevelData;
  stars: number;
  earnedCoins: number;
  bonusWordsFound: string[];
  solvedWords: string[];
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onOpenWordDefinition: (word: string) => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelData,
  stars,
  earnedCoins,
  bonusWordsFound,
  solvedWords,
  onNextLevel,
  onReplayLevel,
  onOpenWordDefinition,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-tile-pop border border-slate-700/80 text-center p-6 flex flex-col items-center">
        {/* Banner header */}
        <div className="inline-block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest px-4 py-1 rounded-full mb-3 shadow-md">
          Level {levelData.id} Solved
        </div>

        <h2 className="text-2xl font-black text-slate-100 tracking-tight mb-2">
          Awesome Job!
        </h2>

        {/* Animated Stars */}
        <div className="flex items-center justify-center space-x-2 my-3">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= stars;
            return (
              <div
                key={`comp_star_${starIndex}`}
                className={`p-2 rounded-2xl ${
                  isEarned
                    ? 'bg-amber-500/20 border border-amber-400/40 text-amber-400 animate-star-pop'
                    : 'bg-slate-800 text-slate-600 border border-slate-700'
                }`}
                style={{ animationDelay: `${starIndex * 0.15}s` }}
              >
                <Star
                  className={`w-8 h-8 ${
                    isEarned ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-600'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Rewards Box */}
        <div className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-3 my-3 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Total Reward</span>
            <div className="flex items-center space-x-1">
              <Coins className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-xl font-black text-amber-300">+{earnedCoins}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-700" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-purple-400 uppercase">Bonus Words</span>
            <span className="text-xl font-black text-purple-300">
              {bonusWordsFound.length} / {levelData.bonusWords.length}
            </span>
          </div>
        </div>

        {/* Words Solved List */}
        <div className="w-full text-left my-2">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Words Solved (Tap for meaning)</span>
            <BookOpen className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-950 rounded-xl border border-slate-800">
            {solvedWords.map((word) => (
              <button
                key={`sol_w_${word}`}
                onClick={() => onOpenWordDefinition(word)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-transform"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col space-y-2 mt-4">
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
            id="next-level-btn"
          >
            <span>Next Level</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onReplayLevel}
            className="w-full py-2.5 bg-slate-800 text-slate-300 font-bold text-sm rounded-2xl flex items-center justify-center space-x-1.5 hover:bg-slate-700 active:scale-95 transition-transform border border-slate-700"
            id="replay-level-btn"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Replay Level</span>
          </button>
        </div>
      </div>
    </div>
  );
};
