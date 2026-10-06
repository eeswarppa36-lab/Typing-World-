import { BadgeAchievement, EvaluatedAchievement, UserAccount } from '../types';

export const ACHIEVEMENTS_LIST: BadgeAchievement[] = [
  {
    id: 'first-step',
    title: 'Keyboard Explorer',
    subtitle: 'First Keystrokes',
    description: 'Complete Level 1: Keyboard Basics and master standard PC layout fundamentals.',
    category: 'Progression',
    tier: 'Bronze',
    icon: 'Keyboard',
    accentColor: 'indigo',
    targetRequirement: 'Complete Level 1',
  },
  {
    id: 'fast-typer',
    title: 'Fast Typer',
    subtitle: 'Velocity Milestone',
    description: 'Reach a typing velocity of 30+ Words Per Minute in any level completion challenge.',
    category: 'Speed',
    tier: 'Silver',
    icon: 'Zap',
    accentColor: 'amber',
    targetRequirement: 'Achieve 30+ WPM',
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    subtitle: 'Flawless Precision',
    description: 'Complete any level practice challenge with a flawless 100% accuracy score.',
    category: 'Accuracy',
    tier: 'Gold',
    icon: 'Target',
    accentColor: 'emerald',
    targetRequirement: 'Score 100% Accuracy',
  },
  {
    id: 'home-row-hero',
    title: 'Home Row Hero',
    subtitle: 'Anchor Placement',
    description: 'Successfully complete Level 2 Home Row drills without breaking rhythm.',
    category: 'Progression',
    tier: 'Silver',
    icon: 'ShieldCheck',
    accentColor: 'cyan',
    targetRequirement: 'Complete Level 2',
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    subtitle: 'High Velocity Sprint',
    description: 'Blast through any typing challenge exceeding 45+ Words Per Minute.',
    category: 'Speed',
    tier: 'Gold',
    icon: 'Flame',
    accentColor: 'rose',
    targetRequirement: 'Achieve 45+ WPM',
  },
  {
    id: 'master-learner',
    title: 'Master Learner',
    subtitle: 'Dedication & Mastery',
    description: 'Progress through the Typing World curriculum by completing 2 or more complete levels.',
    category: 'Mastery',
    tier: 'Diamond',
    icon: 'Trophy',
    accentColor: 'violet',
    targetRequirement: 'Complete 2+ Levels',
  },
  {
    id: 'sharpshooter',
    title: 'Sharpshooter',
    subtitle: 'Consistent Accuracy',
    description: 'Maintain 95% or higher accuracy across multiple completed typing lessons.',
    category: 'Accuracy',
    tier: 'Silver',
    icon: 'Crosshair',
    accentColor: 'emerald',
    targetRequirement: '95%+ Accuracy in 2 Levels',
  },
  {
    id: 'grandmaster',
    title: 'Typing Prodigy',
    subtitle: 'Peak Performance',
    description: 'Unlock at least 4 digital badges and achieve high-tier touch-typing mastery.',
    category: 'Mastery',
    tier: 'Diamond',
    icon: 'Crown',
    accentColor: 'amber',
    targetRequirement: 'Unlock 4 Other Badges',
  }
];

/**
 * Dynamically evaluate which badges the user has unlocked based on real stats and achievements
 */
export function evaluateUserAchievements(user: UserAccount | null): EvaluatedAchievement[] {
  const completed = user?.completedLevels || [];
  const stats = user?.levelStats || {};
  const statsValues = Object.values(stats);

  const highestWpm = statsValues.length > 0 
    ? Math.max(...statsValues.map(s => s.wpm)) 
    : 0;

  const has100Accuracy = statsValues.some(s => s.accuracy >= 100);

  const highAccuracyLevelsCount = statsValues.filter(s => s.accuracy >= 95).length;

  // Track initial badges before checking meta-badges
  const initialEvaluated: Record<string, { isUnlocked: boolean; progressPercent: number; currentProgressText: string; unlockedAt?: string }> = {
    'first-step': {
      isUnlocked: completed.includes(1),
      progressPercent: completed.includes(1) ? 100 : 0,
      currentProgressText: completed.includes(1) ? 'Completed Level 1' : 'Level 1 pending',
      unlockedAt: stats[1]?.completedAt,
    },
    'fast-typer': {
      isUnlocked: highestWpm >= 30,
      progressPercent: Math.min(100, Math.round((highestWpm / 30) * 100)),
      currentProgressText: `${highestWpm} / 30 WPM`,
      unlockedAt: statsValues.find(s => s.wpm >= 30)?.completedAt,
    },
    'perfectionist': {
      isUnlocked: has100Accuracy,
      progressPercent: has100Accuracy ? 100 : (statsValues.length > 0 ? Math.max(...statsValues.map(s => s.accuracy)) : 0),
      currentProgressText: has100Accuracy ? '100% Accuracy achieved' : 'Highest: ' + (statsValues.length > 0 ? Math.max(...statsValues.map(s => s.accuracy)) + '%' : '0%'),
      unlockedAt: statsValues.find(s => s.accuracy >= 100)?.completedAt,
    },
    'home-row-hero': {
      isUnlocked: completed.includes(2),
      progressPercent: completed.includes(2) ? 100 : (completed.includes(1) ? 50 : 0),
      currentProgressText: completed.includes(2) ? 'Completed Level 2' : (completed.includes(1) ? 'Level 2 in progress' : 'Locked'),
      unlockedAt: stats[2]?.completedAt,
    },
    'speed-demon': {
      isUnlocked: highestWpm >= 45,
      progressPercent: Math.min(100, Math.round((highestWpm / 45) * 100)),
      currentProgressText: `${highestWpm} / 45 WPM`,
      unlockedAt: statsValues.find(s => s.wpm >= 45)?.completedAt,
    },
    'master-learner': {
      isUnlocked: completed.length >= 2,
      progressPercent: Math.min(100, Math.round((completed.length / 2) * 100)),
      currentProgressText: `${completed.length} / 2 Levels`,
      unlockedAt: stats[2]?.completedAt || stats[1]?.completedAt,
    },
    'sharpshooter': {
      isUnlocked: highAccuracyLevelsCount >= 2,
      progressPercent: Math.min(100, Math.round((highAccuracyLevelsCount / 2) * 100)),
      currentProgressText: `${highAccuracyLevelsCount} / 2 Levels at 95%+`,
      unlockedAt: statsValues.filter(s => s.accuracy >= 95)[1]?.completedAt,
    },
  };

  // Count non-grandmaster unlocked badges
  const unlockedCount = Object.values(initialEvaluated).filter(b => b.isUnlocked).length;

  initialEvaluated['grandmaster'] = {
    isUnlocked: unlockedCount >= 4,
    progressPercent: Math.min(100, Math.round((unlockedCount / 4) * 100)),
    currentProgressText: `${unlockedCount} / 4 Badges`,
    unlockedAt: unlockedCount >= 4 ? new Date().toISOString() : undefined,
  };

  return ACHIEVEMENTS_LIST.map(badge => {
    const evalData = initialEvaluated[badge.id] || {
      isUnlocked: false,
      progressPercent: 0,
      currentProgressText: 'Not started',
    };

    return {
      ...badge,
      ...evalData,
    };
  });
}
