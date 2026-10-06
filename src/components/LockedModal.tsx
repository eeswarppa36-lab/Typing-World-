import React from 'react';
import { Lock, X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLevelNumber: number;
  targetLevelTitle: string;
  onGoToRequiredLevel?: (requiredLevel: number) => void;
}

export const LockedModal: React.FC<LockedModalProps> = ({
  isOpen,
  onClose,
  targetLevelNumber,
  targetLevelTitle,
  onGoToRequiredLevel
}) => {
  if (!isOpen) return null;

  const previousLevel = targetLevelNumber - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md p-6 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl shadow-indigo-500/10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-slate-800"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4 animate-bounce">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
          🔒 This level is locked
        </h3>
        
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Complete the previous level first to unlock <span className="font-semibold text-amber-300">Level {targetLevelNumber}: {targetLevelTitle}</span>.
        </p>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 mb-6 text-left flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-indigo-300 block mb-0.5">Required Step:</span>
            Complete <span className="text-white font-medium">Level {previousLevel}</span> typing challenge to earn your completion badge and unlock this module.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-300 bg-slate-800/90 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Got it
          </button>
          {onGoToRequiredLevel && (
            <button
              onClick={() => {
                onClose();
                onGoToRequiredLevel(previousLevel);
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
            >
              Play Level {previousLevel}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
