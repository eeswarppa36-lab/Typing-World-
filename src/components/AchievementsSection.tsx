import React, { useState } from 'react';
import { Award, Zap, Target, ShieldCheck, Flame, Trophy, Crosshair, Crown, Keyboard, Lock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { EvaluatedAchievement } from '../types';
import { AchievementBadgeModal } from './AchievementBadgeModal';

interface AchievementsSectionProps {
  achievements: EvaluatedAchievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<EvaluatedAchievement | null>(null);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter(badge => {
    if (filter === 'unlocked') return badge.isUnlocked;
    if (filter === 'locked') return !badge.isUnlocked;
    return true;
  });

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

  const getTierBadgeStyle = (tier: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        bg: 'bg-slate-900 border-slate-800 text-slate-500',
        cardBorder: 'border-slate-800/80 hover:border-slate-700',
        iconBg: 'bg-slate-950 border-slate-800 text-slate-600',
        badgePill: 'bg-slate-900 text-slate-500 border-slate-800',
      };
    }

    switch (tier) {
      case 'Diamond':
        return {
          bg: 'bg-violet-950/20 border-violet-500/30 text-violet-300',
          cardBorder: 'border-violet-500/40 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10',
          iconBg: 'bg-violet-600/20 border-violet-500/40 text-violet-300',
          badgePill: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
        };
      case 'Gold':
        return {
          bg: 'bg-amber-950/20 border-amber-500/30 text-amber-300',
          cardBorder: 'border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10',
          iconBg: 'bg-amber-600/20 border-amber-500/40 text-amber-300',
          badgePill: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'Silver':
        return {
          bg: 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300',
          cardBorder: 'border-cyan-500/40 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10',
          iconBg: 'bg-cyan-600/20 border-cyan-500/40 text-cyan-300',
          badgePill: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      default:
        return {
          bg: 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300',
          cardBorder: 'border-indigo-500/40 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10',
          iconBg: 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300',
          badgePill: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        };
    }
  };

  return (
    <div className="space-y-6 pt-4">
      
      {/* Header with Title and Filter Segmented Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Digital Badges & Achievements
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Reach speed, accuracy, and progression milestones to unlock prestigious achievement trophies.
          </p>
        </div>

        {/* Filter controls & Badge counter */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'unlocked'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'locked'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Locked ({totalCount - unlockedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Progress overview pill banner */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Trophy Case Status</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{unlockedCount} of {totalCount} Badges Collected</span>
              <span className="text-xs font-normal text-slate-400">({completionPercentage}%)</span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1">
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 text-right">
            Click any badge to inspect criteria & rewards
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAchievements.map((badge) => {
          const style = getTierBadgeStyle(badge.tier, badge.isUnlocked);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`group glass-card p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between ${style.cardBorder} ${
                badge.isUnlocked 
                  ? 'bg-slate-900/90 hover:-translate-y-1 shadow-md' 
                  : 'bg-slate-950/60 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                {/* Badge Top Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 ${style.iconBg}`}>
                    {renderIcon(badge.icon, 'w-6 h-6')}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${style.badgePill}`}>
                      {badge.tier}
                    </span>
                    {badge.isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge Titles */}
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-0.5">
                  {badge.title}
                </h3>
                <div className="text-xs text-indigo-400 font-medium mb-2">
                  {badge.subtitle}
                </div>

                {/* Short description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar / Requirement */}
              <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Goal:</span>
                  <span className="font-semibold text-slate-300 truncate max-w-[120px]">
                    {badge.targetRequirement}
                  </span>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      badge.isUnlocked 
                        ? 'bg-emerald-400' 
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span className="font-mono">{badge.currentProgressText}</span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                    Inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Badge Modal */}
      <AchievementBadgeModal
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />

    </div>
  );
};
