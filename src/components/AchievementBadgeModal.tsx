import React from 'react';
import { X, Award, Zap, Target, ShieldCheck, Flame, Trophy, Crosshair, Crown, Keyboard, CheckCircle2, Lock, Calendar } from 'lucide-react';
import { EvaluatedAchievement } from '../types';

interface AchievementBadgeModalProps {
  badge: EvaluatedAchievement | null;
  onClose: () => void;
}

export const AchievementBadgeModal: React.FC<AchievementBadgeModalProps> = ({
  badge,
  onClose,
}) => {
  if (!badge) return null;

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className={className} />;
      case 'Target': return <Target className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Crosshair': return <Crosshair className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Keyboard': return <Keyboard className={className} />;
      default: return <Award className={className} />;
    }
  };

  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'Diamond':
        return {
          bg: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
          gradient: 'from-violet-600 via-indigo-600 to-fuchsia-600',
          border: 'border-violet-500/50',
          glow: 'shadow-violet-500/25',
        };
      case 'Gold':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          gradient: 'from-amber-500 via-yellow-500 to-orange-500',
          border: 'border-amber-500/50',
          glow: 'shadow-amber-500/25',
        };
      case 'Silver':
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
          border: 'border-cyan-500/50',
          glow: 'shadow-cyan-500/25',
        };
      default:
        return {
          bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          gradient: 'from-indigo-500 via-indigo-600 to-slate-700',
          border: 'border-indigo-500/50',
          glow: 'shadow-indigo-500/25',
        };
    }
  };

  const colors = getTierColors(badge.tier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md p-6 sm:p-7 bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle background glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b ${colors.gradient} opacity-20 blur-3xl -z-10`} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-slate-800 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Digital Badge Insignia */}
        <div className="relative mx-auto w-24 h-24 mb-5 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-3xl rotate-6 bg-gradient-to-tr ${colors.gradient} ${badge.isUnlocked ? 'opacity-90 shadow-xl ' + colors.glow : 'opacity-25 grayscale'}`} />
          <div className="relative w-20 h-20 rounded-2xl bg-slate-950 border border-slate-700/80 flex items-center justify-center text-white">
            {badge.isUnlocked ? (
              renderIcon(badge.icon, 'w-10 h-10 text-white animate-pulse')
            ) : (
              <div className="relative">
                {renderIcon(badge.icon, 'w-10 h-10 text-slate-600')}
                <Lock className="w-4 h-4 text-amber-400 absolute -bottom-1 -right-1" />
              </div>
            )}
          </div>
        </div>

        {/* Tier & Status Tag */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colors.bg}`}>
            {badge.tier} Tier
          </span>
          <span className="text-[11px] font-medium text-slate-400">·</span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {badge.category}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-2xl font-extrabold text-white tracking-tight mb-1">
          {badge.title}
        </h3>
        <p className="text-xs text-indigo-300 font-medium mb-4">
          {badge.subtitle}
        </p>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          {badge.description}
        </p>

        {/* Progress or Unlock Stamp */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Milestone Requirement:</span>
            <span className="font-semibold text-slate-200">{badge.targetRequirement}</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                badge.isUnlocked 
                  ? 'bg-gradient-to-r from-emerald-500 to-indigo-500' 
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${badge.progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Current Progress:</span>
            <span className={`font-mono font-medium ${badge.isUnlocked ? 'text-emerald-400' : 'text-slate-300'}`}>
              {badge.currentProgressText}
            </span>
          </div>

          {badge.isUnlocked && badge.unlockedAt && (
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Unlocked badge earned & saved to your profile</span>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          Close Badge Details
        </button>
      </div>
    </div>
  );
};
