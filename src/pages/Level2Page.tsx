import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Trophy, Zap, Sparkles, Award, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount } from '../types';
import { completeLevelForActiveUser, isLevelUnlocked } from '../services/authService';

interface Level2PageProps {
  currentUser: UserAccount | null;
  onBack: () => void;
  onBackToLevels: () => void;
  onUserUpdated: (user: UserAccount) => void;
}

export const Level2Page: React.FC<Level2PageProps> = ({
  currentUser,
  onBack,
  onBackToLevels,
  onUserUpdated
}) => {
  const isUnlocked = isLevelUnlocked(2, currentUser);

  const DRILLS = [
    'asdf jkl; asdf jkl;',
    'ask dad fall salad lad',
    'all dads ask a lad flask'
  ];

  const [drillIndex, setDrillIndex] = useState(0);
  const targetText = DRILLS[drillIndex];
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isUnlocked) {
      // Safety redirect if attempted to navigate while locked
      onBackToLevels();
    }
  }, [isUnlocked, onBackToLevels]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (startTime === null && val.length > 0) {
      setStartTime(Date.now());
    }

    setUserInput(val);

    let correctCount = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) correctCount++;
    }
    const acc = val.length > 0 ? Math.round((correctCount / val.length) * 100) : 100;
    setAccuracy(acc);

    if (startTime && val.length > 0) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        setWpm(Math.round((val.length / 5) / elapsedMinutes));
      }
    }

    if (val === targetText) {
      if (drillIndex < DRILLS.length - 1) {
        setTimeout(() => {
          setDrillIndex(drillIndex + 1);
          setUserInput('');
          setStartTime(null);
        }, 400);
      } else {
        triggerLevelCompletion();
      }
    }
  };

  const triggerLevelCompletion = () => {
    setIsCompleted(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    const updatedUser = completeLevelForActiveUser(2, {
      wpm: Math.max(wpm, 28),
      accuracy: accuracy
    });
    onUserUpdated(updatedUser);
  };

  const handleReset = () => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    inputRef.current?.focus();
  };

  if (!isUnlocked) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>← Typing Levels</span>
          </button>
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Unlocked & Ready
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Level 2 — Home Row Practice
            </h1>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          Exercise {drillIndex + 1} of {DRILLS.length}
        </div>
      </div>

      {/* Educational Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Home Row Finger Placement Rules</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          The <strong className="text-white">Home Row</strong> is the foundation of touch typing. Keep your left hand on <span className="font-mono text-indigo-300 font-bold">A - S - D - F</span> and your right hand on <span className="font-mono text-indigo-300 font-bold">J - K - L - ;</span>. Return your fingers to these 8 keys after every keystroke.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-indigo-400 block font-bold">Left Pinky</span>
            <span className="text-slate-200">Key: A</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-indigo-400 block font-bold">Left Ring / Middle</span>
            <span className="text-slate-200">Keys: S and D</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-indigo-400 block font-bold">Left / Right Index</span>
            <span className="text-slate-200">Keys: F and J (Bumps)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-indigo-400 block font-bold">Right Hand</span>
            <span className="text-slate-200">Keys: K, L, and ;</span>
          </div>
        </div>
      </div>

      {/* Practice Area */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 relative shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
            <Zap className="w-4 h-4" />
            <span>Interactive Drill {drillIndex + 1}</span>
          </div>
          <div className="flex gap-4 font-mono text-xs text-slate-300">
            <span>Speed: <strong className="text-white">{wpm} WPM</strong></span>
            <span>Accuracy: <strong className="text-emerald-400">{accuracy}%</strong></span>
          </div>
        </div>

        {/* Target Text */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center font-mono text-2xl font-bold tracking-widest text-slate-300">
          {targetText.split('').map((ch, idx) => {
            let cl = 'text-slate-400';
            if (idx < userInput.length) {
              cl = userInput[idx] === ch ? 'text-emerald-400 bg-emerald-500/10 px-0.5' : 'text-rose-400 underline bg-rose-500/10 px-0.5';
            } else if (idx === userInput.length) {
              cl = 'text-white border-b-2 border-indigo-400 animate-pulse';
            }
            return <span key={idx} className={cl}>{ch === ' ' ? '␣' : ch}</span>;
          })}
        </div>

        {/* Input */}
        <div>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the home row drill shown above..."
            disabled={isCompleted}
            className="w-full py-4 px-5 rounded-2xl bg-slate-900 border-2 border-indigo-500/50 focus:border-indigo-400 text-white font-mono text-lg text-center focus:outline-none"
            autoFocus
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium border border-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Drill</span>
          </button>

          <span className="text-xs text-slate-400">
            Progress: {drillIndex + 1}/{DRILLS.length} sentences
          </span>
        </div>

        {isCompleted && (
          <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-center space-y-4 animate-in zoom-in-95">
            <Trophy className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-xl font-bold text-white">🎉 Level 2 Completed! Level 3 is now unlocked.</h4>
            <p className="text-xs text-emerald-200">
              Outstanding home row coordination. Your muscle memory is locking in!
            </p>

            {/* Badges unlocked */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-indigo-500/30 text-left max-w-md mx-auto">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Digital Badges Unlocked:</span>
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Home Row Hero
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600/30 text-violet-200 border border-violet-500/40 font-semibold">
                  <Trophy className="w-3.5 h-3.5 text-violet-400" />
                  Master Learner
                </span>
              </div>
            </div>

            <button
              onClick={onBackToLevels}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              Return to Levels Dashboard
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
