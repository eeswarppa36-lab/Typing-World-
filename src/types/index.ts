export type AppPage = 
  | 'home' 
  | 'privacy' 
  | 'auth' 
  | 'forgot-password' 
  | 'levels' 
  | 'badges'
  | 'achievements'
  | 'level-1'
  | 'level-2'
  | 'profile'
  | 'messages'
  | 'notifications';

export interface UserAccount {
  email: string;
  name: string;
  serialNumber: string; // Permanent, immutable unique serial number e.g. M22-01
  avatarUrl?: string; // Profile photo from Google or custom gallery photo
  isGoogleUser?: boolean;
  googleId?: string;
  dob?: string; // Date of Birth (for recovery)
  villageName?: string;
  favouriteDate?: string;
  passwordSalt?: string;
  passwordHash?: string;
  createdAt: string;
  completedLevels: number[]; // e.g. [1]
  levelStats?: Record<number, {
    wpm: number;
    accuracy: number;
    completedAt: string;
  }>;
  unlockedBadges?: string[]; // IDs of unlocked achievement badges
}

export interface BadgeAchievement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Speed' | 'Accuracy' | 'Progression' | 'Mastery';
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  icon: string;
  accentColor: string;
  targetRequirement: string;
}

export interface EvaluatedAchievement extends BadgeAchievement {
  isUnlocked: boolean;
  progressPercent: number;
  currentProgressText: string;
  unlockedAt?: string;
}

export interface LevelInfo {
  id: number;
  number: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  objectives: string[];
  targetKeys: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
}

export interface KeyDefinition {
  id: string;
  name: string;
  category: 'alphabet' | 'number' | 'function' | 'control' | 'navigation' | 'numpad' | 'symbol';
  keyLabel: string;
  description: string;
  commonUse: string;
  shortcutTip?: string;
}
