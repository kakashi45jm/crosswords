import React from 'react';

export type WordPreviewStatus = 'idle' | 'valid' | 'bonus' | 'duplicate' | 'invalid';

interface WordPreviewProps {
  currentWord: string;
  status: WordPreviewStatus;
  statusText?: string;
}

export const WordPreview: React.FC<WordPreviewProps> = ({
  currentWord,
  status,
  statusText,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'valid':
        return 'bg-emerald-600 text-white shadow-lg border-2 border-emerald-400 animate-tile-pop';
      case 'bonus':
        return 'bg-amber-500 text-slate-950 shadow-lg border-2 border-amber-300 animate-tile-pop';
      case 'duplicate':
        return 'bg-slate-800 text-amber-300 border-2 border-amber-500/80 animate-shake';
      case 'invalid':
        return 'bg-slate-800 text-rose-400 border-2 border-rose-500/80 animate-shake';
      default:
        return 'bg-slate-800/90 text-slate-100 shadow-md border border-slate-700/80';
    }
  };

  return (
    <div className="h-10 flex items-center justify-center my-1 select-none">
      {currentWord || statusText ? (
        <div
          className={`px-4 py-1.5 rounded-full flex items-center space-x-1 font-black text-lg sm:text-xl tracking-wider transition-all duration-150 ${getStatusStyles()}`}
          id="word-preview-pill"
        >
          {statusText ? (
            <span className="text-sm font-bold tracking-normal">{statusText}</span>
          ) : (
            currentWord.split('').map((char, index) => (
              <span
                key={`pw_${index}_${char}`}
                className="inline-block uppercase animate-tile-pop"
              >
                {char}
              </span>
            ))
          )}
        </div>
      ) : (
        <div className="text-xs font-semibold text-slate-400/80 italic tracking-wide">
          Swipe or tap letters to spell words
        </div>
      )}
    </div>
  );
};
