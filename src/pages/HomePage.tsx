import React, { useState, useEffect, useRef } from 'react';
import { 
  Keyboard, 
  Trophy, 
  BookOpen, 
  Zap, 
  BarChart3, 
  Calendar,
  User, 
  Sunrise, 
  Sun, 
  Moon,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowRight,
  LifeBuoy
} from 'lucide-react';
import { UserAccount } from '../types';
import { TYPING_LEVELS } from '../data/typingLevels';
import { evaluateUserAchievements } from '../data/achievements';
import { HelpModal } from '../components/HelpModal';

// 24-Hour Rotating Motivational Messages for Welcome Section
const MOTIVATIONAL_MESSAGES = [
  { line1: "Keep typing,", line2: "Keep growing!" },
  { line1: "Every keystroke", line2: "makes you better!" },
  { line1: "Keep practicing,", line2: "Keep improving!" },
  { line1: "Type more,", line2: "improve more!" },
  { line1: "Small practice,", line2: "Big improvement!" },
  { line1: "Your typing journey starts", line2: "with every keystroke!" },
  { line1: "Accuracy first,", line2: "speed will follow!" },
  { line1: "Consistency is", line2: "the key to speed!" },
];

function getDailyMotivationalMessage(): { line1: string; line2: string } {
  const STORAGE_KEY = 'typing_world_daily_quote_v1';
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If less than 24 hours have passed since this message was assigned, keep the exact same message
      if (parsed && typeof parsed.index === 'number' && parsed.timestamp && (now - parsed.timestamp < ONE_DAY_MS)) {
        return MOTIVATIONAL_MESSAGES[parsed.index % MOTIVATIONAL_MESSAGES.length];
      }
      // If 24 hours have elapsed, advance to the next message
      const nextIndex = ((parsed?.index ?? 0) + 1) % MOTIVATIONAL_MESSAGES.length;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ index: nextIndex, timestamp: now }));
      return MOTIVATIONAL_MESSAGES[nextIndex];
    }
  } catch {
    // Ignore storage errors in private browsing
  }

  // Initial assignment based on 24-hour epoch
  const dayIndex = Math.floor(now / ONE_DAY_MS) % MOTIVATIONAL_MESSAGES.length;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ index: dayIndex, timestamp: now }));
  } catch {}
  return MOTIVATIONAL_MESSAGES[dayIndex];
}

interface HomePageProps {
  currentUser: UserAccount | null;
  onOpenProfile?: () => void;
  onOpenLevels: () => void;
  onOpenBadges?: () => void;
  onOpenAchievements: () => void;
  onStartPractice?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  onOpenProfile,
  onOpenLevels,
  onOpenAchievements,
  onStartPractice,
}) => {
  // Dynamic time-based greeting using user's local clock
  const [greetingInfo, setGreetingInfo] = useState(() => getLocalGreeting());
  // 24-hour persistent motivational message
  const [dailyQuote] = useState(() => getDailyMotivationalMessage());
  
  // Interactive modals for secondary dashboard features
  const [activeModal, setActiveModal] = useState<'practice' | 'test' | 'leaderboard' | 'challenge' | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Quick typing test states inside modal
  const sampleTestText = "The quick brown fox jumps over the lazy dog to practice speed.";
  const [testInput, setTestInput] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [testWpm, setTestWpm] = useState<number>(0);
  const [testAccuracy, setTestAccuracy] = useState<number>(100);
  const [testCompleted, setTestCompleted] = useState(false);
  const testInputRef = useRef<HTMLInputElement>(null);

  function getLocalGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let text = 'Good Evening';
    let period: 'morning' | 'afternoon' | 'evening' | 'night' = 'evening';

    if (hours >= 5 && hours < 12) {
      text = 'Good Morning';
      period = 'morning';
    } else if (hours >= 12 && hours < 17) {
      text = 'Good Afternoon';
      period = 'afternoon';
    } else if (hours >= 17 && hours < 21) {
      text = 'Good Evening';
      period = 'evening';
    } else {
      text = 'Good Night';
      period = 'night';
    }

    return { text, period };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingInfo(getLocalGreeting());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Reset mini test on open
  useEffect(() => {
    if (activeModal === 'test') {
      setTestInput('');
      setTestStarted(false);
      setTestStartTime(null);
      setTestWpm(0);
      setTestAccuracy(100);
      setTestCompleted(false);
      setTimeout(() => testInputRef.current?.focus(), 150);
    }
  }, [activeModal]);

  const handleTestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!testStarted) {
      setTestStarted(true);
      setTestStartTime(Date.now());
    }
    setTestInput(val);

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === sampleTestText[i]) correct++;
    }
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setTestAccuracy(acc);

    // Calculate live WPM
    if (testStartTime) {
      const elapsedMinutes = (Date.now() - testStartTime) / 60000;
      if (elapsedMinutes > 0.02) {
        const words = val.trim().split(/\s+/).filter(Boolean).length;
        setTestWpm(Math.round(words / elapsedMinutes));
      }
    }

    if (val.length >= sampleTestText.length) {
      setTestCompleted(true);
    }
  };

  const displayName = currentUser?.name?.trim() || 'Learner';
  const completedLevelsCount = currentUser?.completedLevels?.length || 0;
  const totalLevelsCount = TYPING_LEVELS.length;

  const evaluatedBadges = evaluateUserAchievements(currentUser);
  const unlockedBadgesCount = evaluatedBadges.filter((b) => b.isUnlocked).length;
  const totalBadgesCount = evaluatedBadges.length;

  // Mock global leaderboard data highlighting current user
  const leaderboardList = [
    { rank: 1, name: 'Aarav Sharma', serial: 'M22-04', wpm: 72, acc: 99, isMe: false },
    { rank: 2, name: currentUser?.name || 'You', serial: currentUser?.serialNumber || 'M22-01', wpm: Math.max(38, (currentUser?.completedLevels?.length || 0) * 15 + 24), acc: 98, isMe: true },
    { rank: 3, name: 'Priya Patel', serial: 'M22-07', wpm: 46, acc: 96, isMe: false },
    { rank: 4, name: 'Rahul Varma', serial: 'M22-12', wpm: 42, acc: 95, isMe: false },
    { rank: 5, name: 'Ananya Roy', serial: 'M22-09', wpm: 35, acc: 94, isMe: false },
  ];

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6">
      
      <div className="max-w-xl mx-auto w-full space-y-5 sm:space-y-6">
        
        {/* BRANDING & TOP HEADER ROW */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-600">
              Abhi Presents · Designed by Abhi
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xl">⌨️</span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Typing World
              </span>
            </div>
          </div>
        </div>

        {/* WELCOME CARD BANNER (Matched to Reference Image) */}
        <div className="relative overflow-hidden rounded-[24px] sm:rounded-3xl border border-blue-100/90 shadow-xs hover:shadow-sm transition-all duration-300 bg-gradient-to-r from-[#eff5ff] via-[#edf3ff] to-[#ebe7fe]">
          
          {/* Subtle Organic Background Waves matching reference image */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <svg
              className="absolute -right-6 -top-10 w-[55%] h-[180%] opacity-75"
              viewBox="0 0 400 300"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M120 0C190 70 140 180 230 300L400 300L400 0Z"
                fill="url(#welcomeWave1)"
              />
              <path
                d="M200 0C250 80 210 190 290 300L400 300L400 0Z"
                fill="url(#welcomeWave2)"
                fillOpacity="0.85"
              />
              <defs>
                <linearGradient id="welcomeWave1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e0eaff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="welcomeWave2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e5edff" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#e9e2fe" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative z-10 p-4 sm:p-5 sm:px-6 flex flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* LEFT / CENTER: Waving hand badge + "Welcome back to" + Username + Greeting Pill */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              
              {/* White circular badge with waving hand and purple motion arcs */}
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-white shadow-xs border border-blue-50/80 flex items-center justify-center shrink-0">
                <svg className="w-9 h-9 sm:w-10 sm:h-10" viewBox="0 0 44 44" fill="none">
                  {/* Left purple motion arcs */}
                  <path d="M7 16C5.5 19 5.5 24 7 27" stroke="#312e81" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M4 20C3.5 21.8 3.5 23.2 4 25" stroke="#312e81" strokeWidth="2.2" strokeLinecap="round" />

                  {/* Right purple motion arcs */}
                  <path d="M37 16C38.5 19 38.5 24 37 27" stroke="#312e81" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M40 20C40.5 21.8 40.5 23.2 40 25" stroke="#312e81" strokeWidth="2.2" strokeLinecap="round" />

                  {/* 3D stylized yellow hand */}
                  <path
                    d="M16 21V13.5C16 12.1 17.1 11 18.5 11C19.9 11 21 12.1 21 13.5V19.5M21 17V12C21 10.6 22.1 9.5 23.5 9.5C24.9 9.5 26 10.6 26 12V17.5M26 17.5V13C26 11.6 27.1 10.5 28.5 10.5C29.9 10.5 31 11.6 31 13V19M31 19V15C31 13.6 32.1 12.5 33.5 12.5C34.9 12.5 36 13.6 36 15V24C36 30.5 31 34.5 25 34.5C19 34.5 15.5 30 15.5 25V23C15.5 21.6 16.6 20.5 18 20.5"
                    fill="#fbbf24"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Subtle palm detail */}
                  <path d="M20 25C23 27 27 27 30 25" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>

              {/* Text column */}
              <div className="flex flex-col text-left min-w-0">
                {/* Welcome back to */}
                <span className="text-xs sm:text-sm font-semibold text-[#1e295a] tracking-tight">
                  Welcome back to
                </span>

                {/* Actual Username (Dynamic, not hardcoded) */}
                <h1 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#0f172a] tracking-tight leading-tight mt-0.5 truncate">
                  {displayName}
                </h1>

                {/* Dynamic Greeting Pill */}
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white shadow-xs border border-slate-200/80 w-fit">
                  {greetingInfo.period === 'morning' && (
                    <Sunrise className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  {greetingInfo.period === 'afternoon' && (
                    <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <circle cx="12" cy="12" r="4" fill="#f59e0b" fillOpacity="0.25" />
                      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
                    </svg>
                  )}
                  {greetingInfo.period === 'evening' && (
                    <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  {greetingInfo.period === 'night' && (
                    <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-slate-800">
                    {greetingInfo.text}
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: Motivational Message (changes once every 24 hours) + outline heart */}
            <div className="flex flex-col items-center justify-center shrink-0 text-center pl-2">
              <span className="text-xs sm:text-[13px] md:text-sm font-bold text-[#3730a3] leading-snug tracking-tight">
                {dailyQuote.line1}
              </span>
              <span className="text-xs sm:text-[13px] md:text-sm font-bold text-[#3730a3] leading-snug tracking-tight">
                {dailyQuote.line2}
              </span>

              {/* Centered Outline Heart matching reference image */}
              <div className="mt-1 flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#3730a3]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
            </div>

          </div>
        </div>

        {/* 2-COLUMN GRID OF FEATURE CARDS (CLEAN WHITE/LIGHT THEME) */}
        {/* Normal modern educational app look, white cards, subtle borders, soft shadows, no neon */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
          
          {/* BUTTON 1: LEVELS */}
          <button
            type="button"
            onClick={onOpenLevels}
            className="group relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white hover:bg-slate-50/80 active:scale-[0.98] border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[126px] sm:min-h-[142px]"
          >
            {/* Simple professional icon container with subtle pastel color */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-all duration-200 mb-2.5">
              <Keyboard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Feature Name */}
            <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
              Levels
            </span>

            {/* Current progress information */}
            <span className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-600 font-medium mt-0.5 font-mono">
              {completedLevelsCount}/{totalLevelsCount} Completed
            </span>
          </button>

          {/* BUTTON 2: ACHIEVEMENTS */}
          <button
            type="button"
            onClick={onOpenAchievements}
            className="group relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white hover:bg-slate-50/80 active:scale-[0.98] border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[126px] sm:min-h-[142px]"
          >
            {/* Simple professional icon container with subtle pastel color */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-all duration-200 mb-2.5">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Feature Name */}
            <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors tracking-tight">
              Achievements
            </span>

            {/* Number of achievements unlocked */}
            <span className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-600 font-medium mt-0.5 font-mono">
              {unlockedBadgesCount}/{totalBadgesCount} Unlocked
            </span>
          </button>

          {/* BUTTON 3: PRACTICE */}
          <button
            type="button"
            onClick={() => {
              if (onStartPractice) {
                onStartPractice();
              } else {
                setActiveModal('practice');
              }
            }}
            className="group relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white hover:bg-slate-50/80 active:scale-[0.98] border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[126px] sm:min-h-[142px]"
          >
            {/* Simple professional icon container with subtle pastel color */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-all duration-200 mb-2.5">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Feature Name */}
            <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">
              Practice
            </span>

            {/* Supporting text */}
            <span className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-600 font-medium mt-0.5">
              Keyboard Drills
            </span>
          </button>

          {/* BUTTON 4: TYPING TEST */}
          <button
            type="button"
            onClick={() => setActiveModal('test')}
            className="group relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white hover:bg-slate-50/80 active:scale-[0.98] border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[126px] sm:min-h-[142px]"
          >
            {/* Simple professional icon container with subtle pastel color */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-all duration-200 mb-2.5">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Feature Name */}
            <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors tracking-tight">
              Typing Test
            </span>

            {/* Supporting text */}
            <span className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-600 font-medium mt-0.5">
              Speed & Accuracy
            </span>
          </button>

          {/* BUTTON 5: LEADERBOARD */}
          <button
            type="button"
            onClick={() => setActiveModal('leaderboard')}
            className="group relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white hover:bg-slate-50/80 active:scale-[0.98] border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[126px] sm:min-h-[142px]"
          >
            {/* Simple professional icon container with subtle pastel color */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-105 transition-all duration-200 mb-2.5">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Feature Name */}
            <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors tracking-tight">
              Leaderboard
            </span>

            {/* Supporting text */}
            <span className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-600 font-medium mt-0.5">
              Top Typists
            </span>
          </button>

          {/* BUTTON 6: DAILY CHALLENGE */}
          <button
            type="button"
            onClick={() => setActiveModal('challenge')}
            className="group relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white hover:bg-slate-50/80 active:scale-[0.98] border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[126px] sm:min-h-[142px]"
          >
            {/* Simple professional icon container with subtle pastel color */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-all duration-200 mb-2.5">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Feature Name */}
            <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight">
              Daily Challenge
            </span>

            {/* Supporting text */}
            <span className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-600 font-medium mt-0.5">
              Today: 35+ WPM
            </span>
          </button>

          {/* BUTTON 7: HELP (Friendly Help icon & name "Help") */}
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="col-span-2 group relative flex flex-row items-center justify-center text-center p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-white hover:bg-slate-50/80 active:scale-[0.98] border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[80px] sm:min-h-[92px] gap-3.5"
          >
            {/* Friendly Help icon container */}
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-all duration-200 shrink-0">
              <LifeBuoy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="flex flex-col items-start text-left">
              {/* Feature Name: "Help" */}
              <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                Help
              </span>

              {/* Supporting text */}
              <span className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-600 font-medium">
                In-app support & step-by-step guidance
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* SUBTLE BRAND IDENTITY FOOTER PILL (Clean & light) */}
      <div className="pt-6 pb-1 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] text-slate-500 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Permanent Serial No:</span>
          <span className="font-mono font-bold text-slate-800">{currentUser?.serialNumber || 'M22-01'}</span>
        </div>
      </div>

      {/* ----------------- LIGHT THEMED MODALS FOR SECONDARY FEATURES ----------------- */}

      {/* PRACTICE MODAL */}
      {activeModal === 'practice' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5 text-left relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Typing Practice</h3>
                <p className="text-xs text-slate-500">Choose your practice module</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setActiveModal(null);
                  if (onStartPractice) onStartPractice();
                  else onOpenLevels();
                }}
                className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Level 1 — Keyboard Basics
                  </div>
                  <div className="text-xs text-slate-500">
                    Master PC keys, functions, and key layout
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenLevels();
                }}
                className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Browse All Levels Curriculum
                  </div>
                  <div className="text-xs text-slate-500">
                    Sequential Home Row, Top Row, and Drills
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TYPING TEST MODAL */}
      {activeModal === 'test' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5 text-left relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Speed Typing Test</h3>
                <p className="text-xs text-slate-500">Type the sentence below to calculate WPM</p>
              </div>
            </div>

            {/* Test Target sentence */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-mono leading-relaxed select-none text-slate-700">
              {sampleTestText.split('').map((char, idx) => {
                let colorClass = 'text-slate-400';
                if (idx < testInput.length) {
                  colorClass = testInput[idx] === char ? 'text-emerald-600 font-bold' : 'text-rose-600 bg-rose-100';
                } else if (idx === testInput.length) {
                  colorClass = 'text-slate-900 underline decoration-indigo-500 decoration-2 font-bold';
                }
                return (
                  <span key={idx} className={colorClass}>
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Realtime input box */}
            <input
              ref={testInputRef}
              type="text"
              disabled={testCompleted}
              value={testInput}
              onChange={handleTestInputChange}
              placeholder={testStarted ? "Keep typing..." : "Click here and start typing to begin..."}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-purple-600 focus:outline-none text-slate-900 font-mono text-sm placeholder:text-slate-400"
            />

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider block">Speed</span>
                <span className="text-xl font-black text-slate-900 font-mono">{testWpm} <span className="text-xs text-purple-600 font-sans font-semibold">WPM</span></span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider block">Accuracy</span>
                <span className="text-xl font-black text-emerald-600 font-mono">{testAccuracy}%</span>
              </div>
            </div>

            {testCompleted && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Test Finished! Great performance!</span>
                </div>
                <button
                  onClick={() => {
                    setTestInput('');
                    setTestStarted(false);
                    setTestStartTime(null);
                    setTestWpm(0);
                    setTestAccuracy(100);
                    setTestCompleted(false);
                    testInputRef.current?.focus();
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEADERBOARD MODAL */}
      {activeModal === 'leaderboard' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 text-left relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Global Leaderboard</h3>
                <p className="text-xs text-slate-500">Top performers in Typing World</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {leaderboardList.map((item) => (
                <div
                  key={item.rank}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                    item.isMe 
                      ? 'bg-indigo-50 border-indigo-200 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold font-mono text-slate-600">
                      {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.isMe && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-[9px] text-indigo-700 font-semibold uppercase">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{item.serial}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-bold text-rose-600">{item.wpm} WPM</span>
                    <span className="text-slate-500">{item.acc}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DAILY CHALLENGE MODAL */}
      {activeModal === 'challenge' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 text-left relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Daily Challenge</h3>
                <p className="text-xs text-slate-500">Complete today's milestone for rewards</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Today's Objective</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Daily Goal
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Speed Threshold: 35+ WPM with 95% Accuracy
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Finish any typing level or practice session achieving at least 35 Words Per Minute with high precision.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                onOpenLevels();
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Daily Challenge</span>
            </button>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

    </div>
  );
};
