import React from 'react';
import { ArrowLeft, Target, Zap, Trophy, ShieldCheck, Flame, Award, CheckCircle2, Lock } from 'lucide-react';
import { UserAccount } from '../types';
import { evaluateUserAchievements } from '../data/achievements';
import { TYPING_LEVELS } from '../data/typingLevels';

interface AchievementsPageProps {
  currentUser: UserAccount | null;
  onBack: () => void;
  onNavigateToLevels: () => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  currentUser,
  onBack,
  onNavigateToLevels,
}) => {
  const completedCount = currentUser?.completedLevels?.length || 0;
  const stats = currentUser?.levelStats || {};
  const statsValues = Object.values(stats);
  const highestWpm = statsValues.length > 0 ? Math.max(...statsValues.map((s) => s.wpm)) : 0;
  const highestAccuracy = statsValues.length > 0 ? Math.max(...statsValues.map((s) => s.accuracy)) : 0;

  const milestones = [
    {
      title: 'First Keystroke Milestone',
      description: 'Complete your first formal typing challenge in Level 1: Keyboard Basics.',
      isCompleted: completedCount >= 1,
      progress: Math.min(100, completedCount * 100),
      current: completedCount >= 1 ? 'Completed' : '0/1 Levels',
      icon: 'ShieldCheck',
      category: 'Progression',
    },
    {
      title: 'Velocity Threshold: 30 WPM',
      description: 'Sustain a typing speed of at least 30 Words Per Minute in any challenge.',
      isCompleted: highestWpm >= 30,
      progress: Math.min(100, Math.round((highestWpm / 30) * 100)),
      current: `${highestWpm} / 30 WPM`,
      icon: 'Zap',
      category: 'Speed',
    },
    {
      title: 'Precision Master: 100% Accuracy',
      description: 'Finish a typing test with absolute zero typos and flawless execution.',
      isCompleted: highestAccuracy >= 100,
      progress: highestAccuracy,
      current: `${highestAccuracy}% Accuracy`,
      icon: 'Target',
      category: 'Accuracy',
    },
    {
      title: 'Sprint Champion: 45+ WPM',
      description: 'Break into advanced typing velocity with sustained 45+ Words Per Minute.',
      isCompleted: highestWpm >= 45,
      progress: Math.min(100, Math.round((highestWpm / 45) * 100)),
      current: `${highestWpm} / 45 WPM`,
      icon: 'Flame',
      category: 'Speed',
    },
    {
      title: 'Curriculum Progression: 3 Levels',
      description: 'Conquer Level 1, Level 2, and Level 3 sequential lessons.',
      isCompleted: completedCount >= 3,
      progress: Math.min(100, Math.round((completedCount / 3) * 100)),
      current: `${completedCount} / 3 Levels`,
      icon: 'Trophy',
      category: 'Progression',
    },
    {
      title: 'Master Typist Certification',
      description: 'Complete all sequential typing modules and achieve certification status.',
      isCompleted: completedCount >= TYPING_LEVELS.length,
      progress: Math.round((completedCount / TYPING_LEVELS.length) * 100),
      current: `${completedCount} / ${TYPING_LEVELS.length} Levels`,
      icon: 'Award',
      category: 'Mastery',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header Row with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>← Back</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Achievements & Milestones
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Track your cumulative typing records, speed benchmarks, and long-term milestones.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToLevels}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
        >
          Practice Levels →
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-medium text-slate-400 mb-1">Personal Best Velocity</div>
          <div className="text-2xl font-extrabold text-white font-mono flex items-baseline gap-1.5">
            <span>{highestWpm}</span>
            <span className="text-xs text-indigo-400 font-sans font-bold">WPM</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-medium text-slate-400 mb-1">Highest Accuracy Record</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {highestAccuracy}%
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-medium text-slate-400 mb-1">Levels Mastered</div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono">
            {completedCount} / {TYPING_LEVELS.length}
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Current Progress Towards Milestones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`glass-card p-5 rounded-2xl border transition-all ${
                m.isCompleted
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800/80 bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      m.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {m.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{m.title}</h3>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                      {m.category}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                    m.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {m.current}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {m.description}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
                <div
                  className={`h-full transition-all duration-500 ${
                    m.isCompleted
                      ? 'bg-gradient-to-r from-emerald-500 to-indigo-400'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${m.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
