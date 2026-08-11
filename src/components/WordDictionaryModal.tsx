import React from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { getWordDefinition } from '../data/dictionary';

interface WordDictionaryModalProps {
  word: string;
  onClose: () => void;
}

export const WordDictionaryModal: React.FC<WordDictionaryModalProps> = ({
  word,
  onClose,
}) => {
  const def = getWordDefinition(word);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 w-full max-w-xs rounded-3xl shadow-2xl overflow-hidden animate-tile-pop border border-slate-700/80 text-center p-5">
        <div className="flex justify-end mb-1">
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200"
            id="close-dict-modal-btn"
            aria-label="Close word definition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <BookOpen className="w-6 h-6" />
        </div>

        <h3 className="text-2xl font-black text-slate-100 tracking-wider uppercase mb-1">
          {def.word}
        </h3>

        <span className="inline-block bg-slate-800 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-3 border border-slate-700">
          {def.partOfSpeech}
        </span>

        <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-800/80 p-3 rounded-xl border border-slate-700 mb-4">
          "{def.definition}"
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md active:scale-95 transition-transform"
          id="got-it-dict-btn"
        >
          Got It!
        </button>
      </div>
    </div>
  );
};
