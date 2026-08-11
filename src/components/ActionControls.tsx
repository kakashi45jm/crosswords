import React, { useState } from 'react';
import { Shuffle, Lightbulb, Eraser, Check, Target, Zap } from 'lucide-react';

interface ActionControlsProps {
  onShuffle: () => void;
  onHint: (type: 'standard' | 'target' | 'multi') => void;
  onClear: () => void;
  onSubmit: () => void;
  coins: number;
  hasActiveWord: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  onShuffle,
  onHint,
  onClear,
  onSubmit,
  coins,
  hasActiveWord,
}) => {
  const [showHintMenu, setShowHintMenu] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto px-6 py-1 flex items-center justify-between select-none relative z-30">
      {/* Shuffle Button */}
      <button
        onClick={onShuffle}
        className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-slate-800/90 shadow-lg border border-slate-700/80 text-slate-200 active:scale-90 transition-transform hover:border-amber-400"
        id="shuffle-btn"
        aria-label="Shuffle letters"
      >
        <Shuffle className="w-5 h-5 text-amber-400" />
        <span className="text-[9px] font-bold text-slate-300">Shuffle</span>
      </button>

      {/* Clear / Backspace Button */}
      <button
        onClick={onClear}
        disabled={!hasActiveWord}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-full shadow-lg border transition-all ${
          hasActiveWord
            ? 'bg-slate-800/90 text-rose-400 border-rose-500/50 active:scale-90 hover:border-rose-400'
            : 'bg-slate-900/60 text-slate-600 border-slate-800 opacity-60 cursor-not-allowed'
        }`}
        id="clear-btn"
        aria-label="Clear active word"
      >
        <Eraser className="w-5 h-5" />
        <span className="text-[9px] font-bold">Clear</span>
      </button>

      {/* Manual Submit Button */}
      <button
        onClick={onSubmit}
        disabled={!hasActiveWord}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-full shadow-lg border transition-all ${
          hasActiveWord
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 active:scale-95 animate-pulse'
            : 'bg-slate-900/60 text-slate-600 border-slate-800 opacity-60 cursor-not-allowed'
        }`}
        id="submit-word-btn"
        aria-label="Submit word"
      >
        <Check className="w-5 h-5" />
        <span className="text-[9px] font-bold">Submit</span>
      </button>

      {/* Hint Button & Popover */}
      <div className="relative">
        <button
          onClick={() => setShowHintMenu(!showHintMenu)}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-gradient-to-b from-amber-400 via-amber-500 to-orange-600 text-slate-950 shadow-lg border border-amber-300 active:scale-90 transition-transform"
          id="hint-main-btn"
          aria-label="Hint menu"
        >
          <Lightbulb className="w-5 h-5 text-slate-950 fill-slate-950" />
          <span className="text-[9px] font-black text-slate-950">25 🪙</span>
        </button>

        {/* Hint Options Menu */}
        {showHintMenu && (
          <div className="absolute bottom-14 right-0 w-48 bg-slate-900/95 rounded-2xl shadow-2xl border border-slate-700 p-2 z-50 animate-tile-pop backdrop-blur-md">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 px-2">
              Select Hint Type
            </div>
            <button
              onClick={() => {
                onHint('standard');
                setShowHintMenu(false);
              }}
              disabled={coins < 25}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold mb-1 transition-colors ${
                coins >= 25 ? 'hover:bg-slate-800 text-slate-100' : 'opacity-50 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Single Random</span>
              </div>
              <span className="text-amber-400 font-black">25 🪙</span>
            </button>

            <button
              onClick={() => {
                onHint('target');
                setShowHintMenu(false);
              }}
              disabled={coins < 40}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold mb-1 transition-colors ${
                coins >= 40 ? 'hover:bg-slate-800 text-slate-100' : 'opacity-50 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-orange-400" />
                <span>Target Cell</span>
              </div>
              <span className="text-amber-400 font-black">40 🪙</span>
            </button>

            <button
              onClick={() => {
                onHint('multi');
                setShowHintMenu(false);
              }}
              disabled={coins < 80}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-colors ${
                coins >= 80 ? 'hover:bg-slate-800 text-slate-100' : 'opacity-50 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>3 Multi Hints</span>
              </div>
              <span className="text-amber-400 font-black">80 🪙</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
