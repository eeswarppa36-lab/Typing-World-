import React, { useState } from 'react';
import { ArrowLeft, Mail, Calendar, MapPin, Heart, Lock, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { recoverAndResetPassword } from '../services/authService';
import { UserAccount } from '../types';

interface ForgotPasswordPageProps {
  onBack: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onBack,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [villageName, setVillageName] = useState('');
  const [favouriteDate, setFavouriteDate] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await recoverAndResetPassword({
        email,
        dob,
        villageName,
        favouriteDate,
        newPassword
      });

      if (res.success && res.user) {
        setSuccessMsg('Password changed successfully!');
        setTimeout(() => {
          onSuccess(res.user!);
        }, 1200);
      } else {
        // Clear error message without exposing specific matching details
        setErrorMsg(res.error || 'Account recovery failed. The provided recovery details do not match our records.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto flex flex-col justify-center">
      
      {/* Top Bar with working Back arrow */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>← Back to Login</span>
        </button>

        <span className="text-xs text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Account Security Recovery</span>
        </span>
      </div>

      {/* Main Glassmorphism Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
        
        {/* Page Heading & Prompt */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Forget Password Settings
          </h1>
          <p className="text-sm font-medium text-indigo-300 mt-2">
            Recover your account
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Provide the registered security questions and your new password to verify and restore access.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success notification */}
        {successMsg && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-200 shadow-lg shadow-emerald-500/10">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div>Password changed successfully!</div>
              <div className="text-xs font-normal text-emerald-300/80 mt-0.5">
                Redirecting you to Home Screen...
              </div>
            </div>
          </div>
        )}

        {/* RECOVERY FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Gmail */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              1. Gmail Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered Gmail"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* 2. Date of Birth */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              2. Date of Birth
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* 3. Village Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              3. Village Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                placeholder="Enter your registered village name"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* 4. Favourite Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              4. Favourite Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Heart className="w-4 h-4" />
              </div>
              <input
                type="date"
                required
                value={favouriteDate}
                onChange={(e) => setFavouriteDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* 5. New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              5. New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new secure password"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || Boolean(successMsg)}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying Details...' : 'Verify & Change Password'}
            </button>
          </div>

        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Remember your credentials? Return to Login
          </button>
        </div>

      </div>
    </div>
  );
};
