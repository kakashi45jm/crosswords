import React from 'react';
import { X, Gift, Coins, Check } from 'lucide-react';

interface BonusWordsModalProps {
  discoveredBonusWords: string[];
  totalBonusWordsInLevel: string[];
  onClose: () => void;
  onOpenWordDefinition: (word: string) => void;
}

export const BonusWordsModal: React.FC<BonusWordsModalProps> = ({
  discoveredBonusWords,
  totalBonusWordsInLevel,
  onClose,
  onOpenWordDefinition,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-tile-pop border border-slate-700/80 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <Gift className="w-6 h-6 text-amber-300" />
            <div>
              <h3 className="font-extrabold text-base leading-tight">Bonus Words Jar</h3>
              <p className="text-xs text-purple-200 font-medium">Extra valid dictionary words</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/30 text-white"
            id="close-bonus-modal-btn"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col items-center">
          <div className="w-full bg-slate-800/90 border border-purple-500/30 rounded-2xl p-4 text-center mb-4">
            <div className="text-2xl font-black text-purple-300 mb-1">
              {discoveredBonusWords.length} / {totalBonusWordsInLevel.length}
            </div>
            <p className="text-xs text-purple-200 font-medium">
              Find bonus words to fill your jar and earn 500 🪙 extra!
            </p>
          </div>

          {/* List of found bonus words */}
          <div className="w-full text-left">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Discovered Bonus Words
            </div>

            {discoveredBonusWords.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs italic">
                No bonus words found yet for this level.
                <br />
                Try connecting extra valid dictionary words!
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {discoveredBonusWords.map((word) => (
                  <button
                    key={`bw_item_${word}`}
                    onClick={() => onOpenWordDefinition(word)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-950/80 text-purple-200 font-extrabold text-xs rounded-xl border border-purple-500/40 shadow-xs hover:scale-105 transition-transform"
                  >
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                    <span>{word}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm rounded-xl shadow-md hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-transform"
            id="back-to-game-btn"
          >
            Keep Playing
          </button>
        </div>
      </div>
    </div>
  );
};
