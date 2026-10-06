import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Sparkles, Trophy, BookOpen, Keyboard as KeyboardIcon, Zap, Volume2, VolumeX, Award, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KEYBOARD_KEYS_EXPLANATIONS, KEYBOARD_OVERVIEW } from '../data/keyboardKeys';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { completeLevelForActiveUser } from '../services/authService';
import { UserAccount } from '../types';

interface Level1PageProps {
  currentUser: UserAccount | null;
  onBack: () => void;
  onContinueToLevel2: () => void;
  onUserUpdated: (user: UserAccount) => void;
}

export const Level1Page: React.FC<Level1PageProps> = ({
  currentUser,
  onBack,
  onContinueToLevel2,
  onUserUpdated
}) => {
  // Key explorer state
  const [selectedKeyId, setSelectedKeyId] = useState<string>('alphabet-keys');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [physicalKeyPressed, setPhysicalKeyPressed] = useState<string>('');

  // Typing practice state
  const TARGET_TEXT = 'Typing World 123';
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if user already finished level 1
  useEffect(() => {
    if (currentUser?.completedLevels?.includes(1)) {
      setHasCompletedBefore(true);
    }
  }, [currentUser]);

  // Subtle keyclick audio synthesizer using Web Audio API (zero external assets needed)
  const playKeySound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Physical keyboard listener for practice & keyboard interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPhysicalKeyPressed(e.key);
      playKeySound();
    };

    const handleKeyUp = () => {
      setPhysicalKeyPressed('');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [soundEnabled]);

  // Handle typing input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Start timer on first keystroke
    if (startTime === null && val.length > 0) {
      setStartTime(Date.now());
    }

    setUserInput(val);

    // Calculate accuracy
    let correctCount = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === TARGET_TEXT[i]) {
        correctCount++;
      }
    }
    const acc = val.length > 0 ? Math.round((correctCount / val.length) * 100) : 100;
    setAccuracy(acc);

    // Calculate live WPM
    if (startTime && val.length > 0) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0) {
        const wordsTyped = val.length / 5;
        setWpm(Math.round(wordsTyped / elapsedMinutes));
      }
    }

    // Auto check if fully matched
    if (val === TARGET_TEXT) {
      triggerLevelCompletion();
    }
  };

  // Complete level logic
  const triggerLevelCompletion = () => {
    setIsCompleted(true);
    
    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const finalWpm = Math.max(wpm, 24);
    const updatedUser = completeLevelForActiveUser(1, {
      wpm: finalWpm,
      accuracy: accuracy
    });
    onUserUpdated(updatedUser);
  };

  const handleResetPractice = () => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    inputRef.current?.focus();
  };

  const selectedKeyInfo = KEYBOARD_KEYS_EXPLANATIONS.find(k => k.id === selectedKeyId) || KEYBOARD_KEYS_EXPLANATIONS[0];

  const filteredExplanations = KEYBOARD_KEYS_EXPLANATIONS.filter(k => {
    if (activeCategory === 'all') return true;
    return k.category === activeCategory;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>← Typing Levels</span>
          </button>
          
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-0.5">
              <span>Level 1 Fundamentals</span>
              {hasCompletedBefore && (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Level 1 — Keyboard Basics
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
            title="Toggle Keystroke Audio"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Key Clicks: On' : 'Key Clicks: Off'}</span>
          </button>

          {isCompleted && (
            <button
              onClick={onContinueToLevel2}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-emerald-600/30 cursor-pointer animate-pulse"
            >
              <span>Continue to Level 2 →</span>
            </button>
          )}
        </div>
      </div>

      {/* OVERVIEW INTRO CARD */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Mastering Standard Computer Keyboard Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Welcome to the Keyboard Basics Workshop
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The computer keyboard is your primary instrument for communicating with computers, software, and the world. A standard PC keyboard contains <strong className="text-slate-900">{KEYBOARD_OVERVIEW.totalKeysStandard}</strong> arranged into ergonomic functional zones.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {KEYBOARD_OVERVIEW.coreSections.map((sec, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>{sec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips Box */}
        <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/80 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Abhi's Pro Typing Tip</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Notice the tiny physical bumps on the <strong className="text-amber-950 font-bold">F</strong> and <strong className="text-amber-950 font-bold">J</strong> keys? These are your home indicators. Always rest your left index finger on F and your right index finger on J without glancing down.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] text-amber-700">
            21 Essential PC Key Types Detailed Below ↓
          </div>
        </div>
      </div>

      {/* INTERACTIVE VIRTUAL KEYBOARD SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <KeyboardIcon className="w-5 h-5 text-indigo-600" />
            <span>Interactive Keyboard Map</span>
          </h3>
          <span className="text-xs text-slate-500">
            Click any key on the diagram to learn its function
          </span>
        </div>

        <VirtualKeyboard
          activeKeyId={selectedKeyId}
          onSelectKeyId={(id) => setSelectedKeyId(id)}
          pressedKey={physicalKeyPressed}
        />
      </div>

      {/* KEYBOARD LESSON GUIDE — 21 KEY TYPES COVERED */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Comprehensive Key Guide (21 Required Keys)
            </h3>
            <p className="text-xs text-slate-500">
              Clear and simple explanations for every key on a standard PC keyboard.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {[
              { id: 'all', label: 'All Keys (21)' },
              { id: 'alphabet', label: 'Alphabet' },
              { id: 'number', label: 'Numbers' },
              { id: 'function', label: 'Functions (F1-F12)' },
              { id: 'control', label: 'Control & Modifiers' },
              { id: 'navigation', label: 'Navigation' },
              { id: 'numpad', label: 'Numeric Pad' },
              { id: 'symbol', label: 'Special Symbols' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Key Spotlight Display */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-mono font-bold text-lg sm:text-xl shadow-xs">
                {selectedKeyInfo.keyLabel}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{selectedKeyInfo.name}</h4>
                <span className="text-xs uppercase tracking-wider text-indigo-600 font-semibold">
                  Category: {selectedKeyInfo.category}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
                What this key does:
              </span>
              <p className="leading-relaxed text-slate-700">
                {selectedKeyInfo.description}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
                Everyday Usage & Typing Habits:
              </span>
              <p className="leading-relaxed text-slate-600">
                {selectedKeyInfo.commonUse}
              </p>
              {selectedKeyInfo.shortcutTip && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{selectedKeyInfo.shortcutTip}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid of all Key Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExplanations.map((key) => {
            const isSelected = selectedKeyId === key.id;
            return (
              <div
                key={key.id}
                onClick={() => setSelectedKeyId(key.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between shadow-2xs ${
                  isSelected
                    ? 'bg-indigo-50/60 border-indigo-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-indigo-700">
                      {key.keyLabel}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">
                      {key.category}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 mb-1.5">{key.name}</h5>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {key.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-indigo-600 font-medium flex items-center justify-between">
                  <span>{isSelected ? 'Currently Selected' : 'Click to inspect'}</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TYPING PRACTICE AREA */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 relative overflow-hidden shadow-sm">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Interactive Practical Test</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Level 1 Practice Area
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Type the exact text below to test your keystroke control and unlock Level 2.
            </p>
          </div>

          {/* Live Metrics Counters */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
            <div className="text-center">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Speed</span>
              <span className="font-mono text-lg font-bold text-slate-900">{wpm} <span className="text-xs font-normal text-slate-400">WPM</span></span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Accuracy</span>
              <span className={`font-mono text-lg font-bold ${accuracy >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {accuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* TARGET TEXT DISPLAY BOX */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6 text-center select-none shadow-2xs">
          <div className="text-xs text-slate-500 mb-2 font-medium">Practice Target Text:</div>
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-wider inline-flex flex-wrap justify-center gap-0.5">
            {TARGET_TEXT.split('').map((char, index) => {
              let charStyle = 'text-slate-600';
              if (index < userInput.length) {
                if (userInput[index] === char) {
                  charStyle = 'text-emerald-700 bg-emerald-100 rounded px-0.5';
                } else {
                  charStyle = 'text-rose-700 bg-rose-100 rounded px-0.5 underline';
                }
              } else if (index === userInput.length) {
                charStyle = 'text-slate-900 border-b-2 border-indigo-600 animate-pulse';
              }
              return (
                <span key={index} className={charStyle}>
                  {char === ' ' ? '␣' : char}
                </span>
              );
            })}
          </div>
        </div>

        {/* INPUT BOX */}
        <div className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type 'Typing World 123' here..."
              disabled={isCompleted}
              className="w-full py-4 px-5 rounded-2xl bg-white border-2 border-indigo-200 focus:border-indigo-500 text-slate-900 font-mono text-lg sm:text-xl placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-center shadow-xs"
              autoFocus
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              onClick={handleResetPractice}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Practice</span>
            </button>

            {/* Complete Level 1 Button */}
            <button
              onClick={triggerLevelCompletion}
              disabled={userInput.trim() !== TARGET_TEXT.trim() || isCompleted}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer ${
                userInput.trim() === TARGET_TEXT.trim() && !isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 animate-bounce'
                  : isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Level 1 ✓</span>
            </button>
          </div>
        </div>

        {/* SUCCESS NOTIFICATION & UNLOCK BANNER */}
        {isCompleted && (
          <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-md animate-in zoom-in-95 duration-300 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Trophy className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                🎉 Level 1 Completed! Level 2 is now unlocked.
              </h4>
              <p className="text-sm text-emerald-800">
                You typed <span className="font-bold text-slate-900 font-mono">{TARGET_TEXT}</span> with <span className="font-bold text-slate-900 font-mono">{accuracy}% accuracy</span>.
              </p>
            </div>

            {/* Newly Unlocked Digital Badges Notification */}
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-left max-w-md mx-auto shadow-2xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Digital Badges Unlocked:</span>
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  <KeyboardIcon className="w-3.5 h-3.5 text-indigo-600" />
                  Keyboard Explorer
                </span>
                {accuracy === 100 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    Perfectionist (100% Accuracy)
                  </span>
                )}
                {wpm >= 30 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Fast Typer (30+ WPM)
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Back to All Levels
              </button>
              
              {/* Mandatory Continue to Level 2 button */}
              <button
                onClick={onContinueToLevel2}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Continue to Level 2 →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
