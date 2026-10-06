import React, { useState } from 'react';
import { X, Globe, Plus, ShieldCheck, Check } from 'lucide-react';
import { UserAccount } from '../types';
import { authenticateWithGoogle, getRegisteredUsers } from '../services/authService';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (user: UserAccount) => void;
  currentUser: UserAccount | null;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  onSignInSuccess,
  currentUser
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find all existing Google users saved in browser storage
  const registeredUsers = getRegisteredUsers();
  const existingGoogleUsers = registeredUsers.filter(u => u.isGoogleUser || u.email.includes('@gmail.com'));

  // Preset quick-test accounts for easy User A <-> User B testing
  const presetAccounts = [
    { email: 'eeswarppa36@gmail.com', name: 'Eeswarappa (M22-01)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
    { email: 'aarav.sharma@gmail.com', name: 'Aarav Sharma (M22-04)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
    { email: 'rahul.007@gmail.com', name: 'Rahul_007 (M22-05)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
    { email: 'priya.patel@gmail.com', name: 'Priya Patel (M22-07)', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
    { email: 'alex.morgan.type@gmail.com', name: 'Alex Morgan (M22-02)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80' },
  ];

  const handleSelectAccount = (email: string, name: string, avatarUrl?: string) => {
    try {
      const user = authenticateWithGoogle({
        email,
        name,
        avatarUrl,
      });
      onSignInSuccess(user);
      onClose();
    } catch {
      setError('Failed to sign in with this Google account.');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanEmail = customEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Google/Gmail address.');
      return;
    }
    const derivedName = customName.trim() || cleanEmail.split('@')[0];
    handleSelectAccount(cleanEmail, derivedName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-slate-800 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Sign in with Google
            </h3>
            <p className="text-xs text-slate-400">
              Choose an account to continue to Typing World
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Existing Accounts or Presets */}
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            Available Google Accounts:
          </div>

          {/* Merge preset & existing accounts without duplicates */}
          {Array.from(new Map(
            [...existingGoogleUsers.map(u => ({ email: u.email, name: u.name, avatar: u.avatarUrl, serial: u.serialNumber })),
             ...presetAccounts.map(p => ({ ...p, serial: undefined }))]
            .map(item => [item.email, item])
          ).values()).map(acc => {
            const isCurrentlyActive = currentUser?.email.toLowerCase() === acc.email.toLowerCase();

            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleSelectAccount(acc.email, acc.name, acc.avatar)}
                className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                  isCurrentlyActive
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {acc.avatar ? (
                      <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                    ) : (
                      acc.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                      <span>{acc.name}</span>
                      {acc.serial && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                          {acc.serial}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {acc.email}
                    </div>
                  </div>
                </div>

                {isCurrentlyActive ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <Check className="w-4 h-4" /> Active
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 group-hover:text-slate-300">
                    Sign in →
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Google Account input toggle */}
        {!showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/60 text-slate-400 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer mb-4"
          >
            <Plus className="w-4 h-4" />
            <span>Use another Google account</span>
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Google / Gmail Address
              </label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your.name@gmail.com"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Display Name (from Google Profile)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-white text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Every Google account receives its own permanent Serial Number (<span className="text-slate-200 font-mono font-bold">M22-XX</span>). Account data is never shared.
          </span>
        </div>

      </div>
    </div>
  );
};
