import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  UserPlus, 
  Check, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Target, 
  FileText, 
  Star, 
  User, 
  Trophy, 
  Flame, 
  Crown,
  Sparkles
} from 'lucide-react';
import { UserAccount } from '../types';
import { 
  getConnectionStatus, 
  sendConnectionRequest, 
  acceptConnectionRequest 
} from '../services/connectionService';

interface ProfileInnerPageProps {
  targetUser: UserAccount;
  currentUser: UserAccount | null;
  onBack: () => void;
  onConnectionUpdated?: () => void;
}

export const ProfileInnerPage: React.FC<ProfileInnerPageProps> = ({
  targetUser,
  currentUser,
  onBack,
  onConnectionUpdated,
}) => {
  const [connectionState, setConnectionState] = useState(() => {
    if (!currentUser) return { status: 'none' as const, isMessagesApproved: false };
    return getConnectionStatus(currentUser.email, targetUser.email);
  });
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Keep connection state reactive across events
  React.useEffect(() => {
    if (!currentUser) return;
    const update = () => {
      setConnectionState(getConnectionStatus(currentUser.email, targetUser.email));
    };
    update();
    window.addEventListener('typing_world_connection_updated', update);
    return () => window.removeEventListener('typing_world_connection_updated', update);
  }, [currentUser?.email, targetUser.email]);

  // Compute dynamic stats from targetUser
  const statsValues = Object.values(targetUser.levelStats || {});
  const userWpm = statsValues.length > 0 
    ? Math.max(...statsValues.map(s => s.wpm)) 
    : (targetUser.completedLevels?.length ? 42 : 36);
  const userAccuracy = statsValues.length > 0 
    ? Math.max(...statsValues.map(s => s.accuracy)) 
    : 96;
  const totalTests = statsValues.length > 0 
    ? statsValues.length * 9 
    : (targetUser.completedLevels?.length ? 18 : 6);
  const bestScore = (userWpm * 190) + (userAccuracy * 8);

  const handleSendRequest = () => {
    if (!currentUser) return;
    const res = sendConnectionRequest(currentUser, targetUser);
    if (res.success) {
      setConnectionState(getConnectionStatus(currentUser.email, targetUser.email));
      setActionFeedback('Request sent successfully!');
      onConnectionUpdated?.();
      setTimeout(() => setActionFeedback(null), 3000);
    } else {
      setActionFeedback(res.error || 'Failed to send request');
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  const handleAcceptRequest = () => {
    if (!currentUser) return;
    let reqId = connectionState.request?.id;
    if (!reqId) {
      const conn = getConnectionStatus(currentUser.email, targetUser.email);
      reqId = conn.request?.id;
    }
    if (!reqId) return;
    const res = acceptConnectionRequest(reqId, currentUser);
    if (res.success) {
      const updated = getConnectionStatus(currentUser.email, targetUser.email);
      setConnectionState(updated);
      setActionFeedback('Request accepted! Messages approval is now active.');
      onConnectionUpdated?.();
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  const isMe = currentUser?.email.toLowerCase() === targetUser.email.toLowerCase();

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex justify-center pb-24 sm:pb-28 select-none">
      <div className="w-full max-w-md bg-[#060b18] min-h-screen flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* HERO BANNER SECTION (Exact sunset mountain scenery from reference) */}
        <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80"
            alt="Scenic Sunset Silhouette"
            className="w-full h-full object-cover object-center filter brightness-95"
          />

          {/* Twilight Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-[#060b18]/40 to-black/30 pointer-events-none" />

          {/* Top Bar with Back Arrow and 3 Dots */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
            <button
              onClick={onBack}
              aria-label="Go back"
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              aria-label="Options"
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Artistic Quote on the Upper Right (Exact reference: Better Typing Bigger Dreams) */}
          <div className="absolute top-14 right-4 text-right pointer-events-none z-10 flex flex-col items-end opacity-90">
            <Crown className="w-5 h-5 text-white/90 mb-1" />
            <div className="font-serif italic text-white/95 text-xs sm:text-sm font-semibold tracking-wide leading-tight drop-shadow-md">
              <div>Better</div>
              <div>Typing</div>
              <div>Bigger</div>
              <div>Dreams</div>
            </div>
            {/* Hand-drawn style decorative underline */}
            <svg className="w-20 h-3 text-white/80 mt-0.5" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12 Q 50 18 95 6" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* PROFILE HEADER & USER DETAILS (Overlapping the hero banner) */}
        <div className="relative px-4 sm:px-5 -mt-16 z-20 space-y-4">
          
          <div className="flex items-end justify-between gap-3">
            {/* Glowing Neon Circular Profile Avatar */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-cyan-400 ring-4 ring-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.65)] bg-slate-900 shrink-0">
              {targetUser.avatarUrl ? (
                <img
                  src={targetUser.avatarUrl}
                  alt={targetUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-900 to-blue-900 text-white text-3xl font-black">
                  {targetUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Action Button on the Right: Request / Accept / Pending / Connected */}
            {!isMe && (
              <div className="pb-2">
                {connectionState.status === 'none' && (
                  <button
                    type="button"
                    onClick={handleSendRequest}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all cursor-pointer active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Request</span>
                  </button>
                )}

                {connectionState.status === 'pending_sent' && (
                  <button
                    disabled
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-300 font-semibold text-xs sm:text-sm cursor-default"
                  >
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Requested</span>
                  </button>
                )}

                {connectionState.status === 'pending_received' && (
                  <button
                    type="button"
                    onClick={handleAcceptRequest}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all cursor-pointer active:scale-95 animate-pulse"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Accept</span>
                  </button>
                )}

                {connectionState.status === 'connected' && (
                  <button
                    disabled
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm shadow-md cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Connected</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* User Name & Dynamic Handle */}
          <div className="space-y-1 pt-1">
            <h1 className="text-2xl sm:text-[26px] font-black text-white tracking-tight flex items-center gap-2">
              <span>{targetUser.name}</span>
            </h1>

            {/* Dynamic Serial Number / User ID (e.g. @M22-04) */}
            <div className="text-xs sm:text-sm text-slate-400 font-mono font-medium">
              @{targetUser.serialNumber || 'M22-01'}
            </div>

            {/* Tag Pill: Type • Learn • Grow & Approval Status */}
            <div className="pt-1.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d1833] border border-blue-900/50 text-[11px] font-semibold text-slate-300 shadow-xs">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Type • Learn • Grow</span>
                <span>🚀</span>
              </span>

              {connectionState.status === 'connected' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 shadow-xs animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Messages Approved</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Feedback Toast */}
          {actionFeedback && (
            <div className="p-3 rounded-xl bg-blue-950/90 border border-blue-500/50 text-blue-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* 4 STAT CARDS IN A ROW (Exact layout from reference) */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            
            {/* 1. Typing Speed */}
            <div className="bg-[#0b152d]/90 border border-[#1b2b52] rounded-2xl p-2.5 sm:p-3 text-center shadow-md flex flex-col items-center justify-between">
              <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1">
                <Zap className="w-4 h-4 fill-blue-400" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono leading-tight">
                {userWpm} <span className="text-[10px] font-sans font-normal text-slate-400">WPM</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                Typing Speed
              </div>
            </div>

            {/* 2. Accuracy */}
            <div className="bg-[#0b152d]/90 border border-[#1b2b52] rounded-2xl p-2.5 sm:p-3 text-center shadow-md flex flex-col items-center justify-between">
              <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono leading-tight">
                {userAccuracy}%
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                Accuracy
              </div>
            </div>

            {/* 3. Total Tests */}
            <div className="bg-[#0b152d]/90 border border-[#1b2b52] rounded-2xl p-2.5 sm:p-3 text-center shadow-md flex flex-col items-center justify-between">
              <div className="w-7 h-7 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-1">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono leading-tight">
                {totalTests}
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                Total Tests
              </div>
            </div>

            {/* 4. Best Score */}
            <div className="bg-[#0b152d]/90 border border-[#1b2b52] rounded-2xl p-2.5 sm:p-3 text-center shadow-md flex flex-col items-center justify-between">
              <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono leading-tight">
                {bestScore.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                Best Score
              </div>
            </div>

          </div>

          {/* ABOUT SECTION (Exact layout from reference) */}
          <div className="bg-[#0b152d]/90 border border-[#1b2b52] rounded-2xl p-4 sm:p-5 shadow-md space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
              <span>About</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Hello! I'm {targetUser.name}. I love typing and improving my skills every day. Let's grow together! 🚀
            </p>
          </div>

          {/* ACHIEVEMENTS SECTION (Exact 4 hexagon badges from reference) */}
          <div className="bg-[#0b152d]/90 border border-[#1b2b52] rounded-2xl p-4 sm:p-5 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Achievements</span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1">
              
              {/* Badge 1: Speed Star */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                  <Zap className="w-6 h-6 fill-amber-400" />
                </div>
                <div className="text-[11px] font-bold text-white leading-tight">Speed Star</div>
                <div className="text-[10px] text-slate-400 font-medium">40+ WPM</div>
              </div>

              {/* Badge 2: Accuracy Pro */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
                  <Target className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-white leading-tight">Accuracy Pro</div>
                <div className="text-[10px] text-slate-400 font-medium">95%+</div>
              </div>

              {/* Badge 3: Test Champ */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-white leading-tight">Test Champ</div>
                <div className="text-[10px] text-slate-400 font-medium">10+ Tests</div>
              </div>

              {/* Badge 4: Consistent */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                  <Flame className="w-6 h-6 fill-emerald-400" />
                </div>
                <div className="text-[11px] font-bold text-white leading-tight">Consistent</div>
                <div className="text-[10px] text-slate-400 font-medium">7 Days</div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
