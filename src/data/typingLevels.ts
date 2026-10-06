import { LevelInfo } from '../types';

export const TYPING_LEVELS: LevelInfo[] = [
  {
    id: 1,
    number: 1,
    title: 'Keyboard Basics',
    slug: 'level-1',
    category: 'Fundamentals',
    description: 'Master standard PC keyboard layout, all 21 key types, finger positioning, and basic keystroke control.',
    objectives: [
      'Learn standard 104-key PC architecture',
      'Understand alphabet, numbers, and function keys',
      'Practice special navigation & modifier keys',
      'Complete first practical typing test: "Typing World 123"'
    ],
    targetKeys: 'All Standard PC Keys & Numbers',
    estimatedTime: '8-10 mins',
    difficulty: 'Beginner',
  },
  {
    id: 2,
    number: 2,
    title: 'Home Row Practice',
    slug: 'level-2',
    category: 'Finger Placement',
    description: 'Lock in anchor fingers on A, S, D, F and J, K, L, ; keys with steady cadence and zero look-down.',
    objectives: [
      'Locate tactile bumps on F and J index keys',
      'Build muscle memory on home row resting positions',
      'Type balanced left & right hand letter combinations',
      'Achieve minimum 20 WPM home row flow'
    ],
    targetKeys: 'A S D F G H J K L ;',
    estimatedTime: '10-12 mins',
    difficulty: 'Beginner',
  },
  {
    id: 3,
    number: 3,
    title: 'Top Row Practice',
    slug: 'level-3',
    category: 'Reach & Motion',
    description: 'Extend upward reach from home row to Q, W, E, R, T, Y, U, I, O, P while keeping wrist stability.',
    objectives: [
      'Upward diagonal finger reach techniques',
      'Seamless return to home row anchor points',
      'High-frequency vowel typing (E, I, O, U)',
      'Sentence construction with top and home rows'
    ],
    targetKeys: 'Q W E R T Y U I O P',
    estimatedTime: '12-15 mins',
    difficulty: 'Intermediate',
  },
  {
    id: 4,
    number: 4,
    title: 'Bottom Row Practice',
    slug: 'level-4',
    category: 'Reach & Motion',
    description: 'Master downward finger travel to Z, X, C, V, B, N, M, comma, period, and slash with agile coordination.',
    objectives: [
      'Downward finger sweep technique',
      'Left and right shift coordination for punctuation',
      'Complete 3-row alphabet synthesis',
      'Fluid typing across full 26 English letters'
    ],
    targetKeys: 'Z X C V B N M , . /',
    estimatedTime: '12-15 mins',
    difficulty: 'Intermediate',
  },
  {
    id: 5,
    number: 5,
    title: 'Numbers & Symbols',
    slug: 'level-5',
    category: 'Precision',
    description: 'Tackle the top number row (1–0) and complex coding/punctuation symbols (!, @, #, $, %, &, *, etc.).',
    objectives: [
      'Master Shift key combinations for top-row symbols',
      'Accurate numerical input without looking down',
      'Special brackets, parentheses, quotes, and slashes',
      'Pass practical mixed alphanumeric paragraph test'
    ],
    targetKeys: '1-9 0 ! @ # $ % ^ & * ( ) _ +',
    estimatedTime: '15 mins',
    difficulty: 'Advanced',
  },
  {
    id: 6,
    number: 6,
    title: 'Speed Challenge',
    slug: 'level-6',
    category: 'Velocity',
    description: 'Push your typing velocity beyond 40+ Words Per Minute with continuous timed paragraphs and rhythm drills.',
    objectives: [
      'Develop sustained typing cadence without pausing',
      'Eliminate hesitation on common word patterns (the, and, that, with)',
      'Reach minimum 40 WPM milestone target',
      'Maintain rhythm across 120-second sprint'
    ],
    targetKeys: 'Fast Prose & Common Bigrams',
    estimatedTime: '10 mins',
    difficulty: 'Advanced',
  },
  {
    id: 7,
    number: 7,
    title: 'Accuracy Challenge',
    slug: 'level-7',
    category: 'Discipline',
    description: 'Precision over velocity: maintain 98%+ clean accuracy with penalties for backspaces and typos.',
    objectives: [
      'Minimize corrective backspacing',
      'Precision pacing for tricky consonant clusters',
      'Maintain 98%+ accuracy across 200 words',
      'Build rock-solid muscle memory trust'
    ],
    targetKeys: 'High-Fidelity Text & Complex Prose',
    estimatedTime: '12 mins',
    difficulty: 'Advanced',
  },
  {
    id: 8,
    number: 8,
    title: 'Final Typing Test',
    slug: 'level-8',
    category: 'Mastery',
    description: 'The ultimate Typing World comprehensive certification test. Combine speed, accuracy, symbols, and endurance.',
    objectives: [
      'Complete 3-minute comprehensive certification exam',
      'Combine letters, numerals, capitalizations, and symbols',
      'Achieve 50+ WPM with 95%+ accuracy',
      'Unlock the Typing World Master Certificate badge'
    ],
    targetKeys: 'Full Keyboard Mastery Test',
    estimatedTime: '15 mins',
    difficulty: 'Master',
  },
];
