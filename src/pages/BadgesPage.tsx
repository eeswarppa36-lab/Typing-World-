import React from 'react';
import { ArrowLeft, Award, Sparkles } from 'lucide-react';
import { UserAccount } from '../types';
import { evaluateUserAchievements } from '../data/achievements';
import { AchievementsSection } from '../components/AchievementsSection';

interface BadgesPageProps {
  currentUser: UserAccount | null;
  onBack: () => void;
}

export const BadgesPage: React.FC<BadgesPageProps> = ({
  currentUser,
  onBack,
}) => {
  const evaluatedBadges = evaluateUserAchievements(currentUser);
  const unlockedCount = evaluatedBadges.filter((b) => b.isUnlocked).length;
  const totalCount = evaluatedBadges.length;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
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
              <span className="text-xl">🏆</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Digital Badges
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Collect all digital badges by reaching typing speed and precision milestones.
            </p>
          </div>
        </div>

        <div className="glass-panel px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{unlockedCount} of {totalCount} Badges Unlocked</span>
        </div>
      </div>

      {/* Badges Showcase Section */}
      <AchievementsSection achievements={evaluatedBadges} />
    </div>
  );
};
