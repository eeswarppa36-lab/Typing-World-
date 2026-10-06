import React, { useState } from 'react';
import { ArrowLeft, Search, Lock, Unlock, CheckCircle2, Play, Flame, Trophy, Award, Clock, Sparkles } from 'lucide-react';
import { TYPING_LEVELS } from '../data/typingLevels';
import { LevelInfo, UserAccount } from '../types';
import { isLevelUnlocked } from '../services/authService';
import { LockedModal } from '../components/LockedModal';
import { evaluateUserAchievements } from '../data/achievements';
import { AchievementsSection } from '../components/AchievementsSection';

interface TypingLevelsPageProps {
  currentUser: UserAccount | null;
  onSelectLevel: (levelNumber: number) => void;
  onBack: () => void;
  initialTab?: 'all' | 'levels' | 'achievements';
}

export const TypingLevelsPage: React.FC<TypingLevelsPageProps> = ({
  currentUser,
  onSelectLevel,
  onBack,
  initialTab = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'levels' | 'achievements'>(initialTab);
  
  // State for locked modal popup
  const [lockedModalData, setLockedModalData] = useState<{
    isOpen: boolean;
    levelNumber: number;
    levelTitle: string;
  }>({
    isOpen: false,
    levelNumber: 1,
    levelTitle: '',
  });

  const completedCount = currentUser?.completedLevels?.length || 0;
  const totalLevels = TYPING_LEVELS.length;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);

  // Evaluate dynamic achievements & badges
  const evaluatedAchievements = evaluateUserAchievements(currentUser);
  const unlockedBadgesCount = evaluatedAchievements.filter(a => a.isUnlocked).length;
  const totalBadgesCount = evaluatedAchievements.length;

  // Filter levels based on level number and level name as required
  const filteredLevels = TYPING_LEVELS.filter((lvl) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    
    // Check level number (e.g. "1", "level 1", "lvl 1")
    const matchNumber = 
      lvl.number.toString() === q || 
      `level ${lvl.number}`.includes(q) || 
      `level-${lvl.number}`.includes(q);
      
    // Check level title and description
    const matchTitle = lvl.title.toLowerCase().includes(q);
    const matchCategory = lvl.category.toLowerCase().includes(q);

    return matchNumber || matchTitle || matchCategory;
  });

  const handleCardClick = (level: LevelInfo) => {
    const unlocked = isLevelUnlocked(level.number, currentUser);

    if (unlocked) {
      onSelectLevel(level.number);
    } else {
      // Show attractive modal: "🔒 This level is locked. Complete the previous level first."
      setLockedModalData({
        isOpen: true,
        levelNumber: level.number,
        levelTitle: level.title,
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header Row with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>← Back</span>
          </button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>⌨️</span>
              <span>Typing Levels</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Master progressive typing stages from keyboard layout to high-speed tests.
            </p>
          </div>
        </div>

        {/* User Progress Stats Card */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className="text-xs text-slate-500">Levels Progress</div>
              <div className="text-sm font-bold text-slate-900">
                {completedCount} of {totalLevels} Levels
              </div>
            </div>
          </div>

          <div className="h-7 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <div className="text-xs text-slate-500">Digital Badges</div>
              <div className="text-sm font-bold text-slate-900">
                {unlockedBadgesCount} of {totalBadgesCount} Unlocked
              </div>
            </div>
          </div>

          <div className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden hidden lg:block">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Overview
          </button>
          <button
            onClick={() => setActiveTab('levels')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'levels'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>⌨️ Levels</span>
            <span className="text-[11px] opacity-80">({totalLevels})</span>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'achievements'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏆 Badges</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              unlockedBadgesCount > 0 ? 'bg-amber-100 text-amber-800' : 'text-slate-500'
            }`}>
              {unlockedBadgesCount}/{totalBadgesCount}
            </span>
          </button>
        </div>

        {activeTab !== 'achievements' && (
          <div className="text-xs text-slate-500 hidden sm:block">
            Type in search bar to filter typing levels
          </div>
        )}
      </div>

      {/* Modern Search Bar & Levels Grid */}
      {(activeTab === 'all' || activeTab === 'levels') && (
        <>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-indigo-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔎 Search typing levels... (e.g., keyboard, speed, 1, 2)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-500 hover:text-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-slate-500 mt-2 px-1">
                Showing results matching "{searchQuery}" ({filteredLevels.length} found). Locked levels remain locked.
              </p>
            )}
          </div>

          {/* Grid of Typing Level Cards */}
          {filteredLevels.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs">
              <p className="text-slate-500 text-sm">No typing levels found matching "{searchQuery}".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredLevels.map((lvl) => {
                const unlocked = isLevelUnlocked(lvl.number, currentUser);
                const isCompleted = currentUser?.completedLevels?.includes(lvl.number);
                const stats = currentUser?.levelStats?.[lvl.number];

                return (
                  <div
                    key={lvl.id}
                    onClick={() => handleCardClick(lvl)}
                    className={`group relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer select-none shadow-xs ${
                      isCompleted
                        ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300 hover:shadow-md'
                        : unlocked
                        ? 'border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5'
                        : 'border-slate-200 bg-slate-50/80 opacity-80 hover:opacity-95 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      {/* Top Card Badge: Level Number & Lock Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : unlocked
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          Level {lvl.number}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          {isCompleted ? (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Completed</span>
                            </span>
                          ) : unlocked ? (
                            <span className="flex items-center gap-1 text-indigo-600">
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Unlocked</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-600">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Locked</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Level Name & Subtitle */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                        Level {lvl.number} — {lvl.title}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                        {lvl.description}
                      </p>

                      {/* Metadata: Target keys & estimated duration */}
                      <div className="space-y-1.5 text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Focus Keys:</span>
                          <span className="font-mono text-slate-700 truncate max-w-[130px] font-medium">{lvl.targetKeys}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Est. Time:
                          </span>
                          <span className="text-slate-700 font-medium">{lvl.estimatedTime}</span>
                        </div>
                        {stats && (
                          <div className="flex items-center justify-between text-emerald-600 pt-1 font-mono font-medium">
                            <span>Best Speed:</span>
                            <span>{stats.wpm} WPM ({stats.accuracy}%)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Action / Start Button */}
                    <div className="mt-5 pt-3 border-t border-slate-100">
                      {unlocked ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLevel(lvl.number);
                          }}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isCompleted ? 'Practice Again' : 'Start Level'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(lvl);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 hover:text-amber-700 hover:border-amber-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked (Complete Level {lvl.number - 1})</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Lock System Explanation Banner */}
      {(activeTab === 'all' || activeTab === 'levels') && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start sm:items-center gap-3 shadow-xs">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-900">Typing World Progression Guarantee:</span> Levels must be completed sequentially to ensure solid muscle memory. Complete each practical typing challenge to instantly unlock the next module.
          </div>
        </div>
      )}

      {/* DIGITAL BADGES & ACHIEVEMENTS SYSTEM */}
      {(activeTab === 'all' || activeTab === 'achievements') && (
        <div className="pt-4 border-t border-slate-200">
          <AchievementsSection achievements={evaluatedAchievements} />
        </div>
      )}

      {/* Locked Modal Popup */}
      <LockedModal
        isOpen={lockedModalData.isOpen}
        onClose={() => setLockedModalData({ ...lockedModalData, isOpen: false })}
        targetLevelNumber={lockedModalData.levelNumber}
        targetLevelTitle={lockedModalData.levelTitle}
        onGoToRequiredLevel={(req) => onSelectLevel(req)}
      />

    </div>
  );
};
