import React, { useState } from 'react';
import { X, Volume2, VolumeX, HelpCircle, RefreshCw, Smartphone, Award } from 'lucide-react';
import { PlayerData } from '../types';

interface SettingsModalProps {
  playerData: PlayerData;
  onToggleSound: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  playerData,
  onToggleSound,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-tile-pop border border-slate-700/80 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
          <h3 className="font-extrabold text-base text-slate-100">Game Settings</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/30 text-white"
            id="close-settings-btn"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
            <div className="flex items-center space-x-3">
              {playerData.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-amber-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div className="text-left">
                <div className="text-sm font-extrabold text-slate-100">Sound Effects</div>
                <div className="text-[11px] text-slate-400">Synthesized game chimes</div>
              </div>
            </div>
            <button
              onClick={onToggleSound}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                playerData.soundEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
              id="toggle-sound-btn"
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                  playerData.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Device Optimization Badge */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-emerald-500/40 flex items-center space-x-3">
            <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-left text-xs">
              <span className="font-extrabold text-emerald-300 block">iOS 9.3.5 Optimized</span>
              <span className="text-slate-300">Lightweight 2D graphics & 100% offline ready</span>
            </div>
          </div>

          {/* How to Play */}
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="flex items-center justify-between p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-slate-100 font-extrabold text-sm hover:bg-slate-800"
            id="how-to-play-btn"
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-sky-400" />
              <span>How To Play</span>
            </div>
            <span className="text-xs text-sky-400 font-bold">{showTutorial ? 'Hide' : 'Show'}</span>
          </button>

          {showTutorial && (
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-sky-500/30 text-xs text-slate-300 text-left space-y-2">
              <p>• <strong>Swipe or Tap</strong> letters on the wheel to spell words.</p>
              <p>• <strong>Crossword Grid</strong> automatically accepts required words.</p>
              <p>• <strong>Bonus Words</strong> earn extra coins when discovered!</p>
              <p>• Use <strong>Shuffle</strong> to rearrange letters and <strong>Hints</strong> when stuck.</p>
            </div>
          )}

          {/* Reset Progress */}
          <div className="pt-2 border-t border-slate-800">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2.5 text-xs font-bold text-rose-400 bg-rose-950/40 border border-rose-500/30 rounded-xl hover:bg-rose-950/60 flex items-center justify-center space-x-1.5"
                id="reset-progress-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Game Progress</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-2xl text-center">
                <p className="text-xs font-bold text-rose-200 mb-2">Are you sure? All level progress will be cleared.</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1.5 bg-slate-800 text-slate-200 font-bold text-xs rounded-lg border border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onResetProgress();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
