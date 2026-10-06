import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Trash2, 
  Edit3, 
  Lock, 
  ChevronRight, 
  Headphones, 
  LogOut, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Copy, 
  X, 
  User 
} from 'lucide-react';
import { UserAccount } from '../types';
import { updateDisplayName, updateProfilePhoto } from '../services/authService';
import { HelpModal } from '../components/HelpModal';
import { PasswordManagementModal } from '../components/PasswordManagementModal';
import defaultMascotAvatar from '../assets/images/clay_login_mascot_1791194745842.jpg';

interface ProfilePageProps {
  currentUser: UserAccount | null;
  onBack: () => void;
  onUserUpdated: (updatedUser: UserAccount) => void;
  onNavigateToLevels?: () => void;
  onLogout?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onBack,
  onUserUpdated,
  onLogout,
}) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editedName, setEditedName] = useState(currentUser?.name || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Modals for the clean profile index options
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [copiedSerial, setCopiedSerial] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
        <div className="bg-white p-8 rounded-3xl text-center max-w-sm border border-slate-200 shadow-sm">
          <p className="text-slate-600 text-sm mb-4">Please sign in to view your profile.</p>
          <button
            onClick={onBack}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const displayName = currentUser.name?.trim() || currentUser.email.split('@')[0] || 'Learner';
  const serialNo = currentUser.serialNumber || 'M22-01';

  // Handle Photo Upload from device gallery with safe lightweight compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      // Compress to 160x160 JPEG so it takes only ~5KB instead of megabytes
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = 160;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Draw center cropped
            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;
            ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
            const compressed = canvas.toDataURL('image/jpeg', 0.75);
            const updated = updateProfilePhoto(currentUser.email, compressed);
            onUserUpdated(updated);
            setSuccessMessage('Profile photo updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
            return;
          }
        } catch {
          // Fallback if canvas fails
        }
        const updated = updateProfilePhoto(currentUser.email, rawDataUrl);
        onUserUpdated(updated);
        setSuccessMessage('Profile photo updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo Removal back to default avatar
  const handleRemovePhoto = () => {
    const updated = updateProfilePhoto(currentUser.email, undefined);
    onUserUpdated(updated);
    setSuccessMessage('Profile photo removed. Returned to default avatar.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Handle Name Edit Submission
  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmed = editedName.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a valid display name.');
      return;
    }

    const result = updateDisplayName(currentUser.email, trimmed);
    if (!result.success || !result.user) {
      setErrorMessage(result.error || 'Failed to update name.');
      return;
    }

    onUserUpdated(result.user);
    setIsEditProfileOpen(false);
    setSuccessMessage('Display name updated successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Handle Copy Serial Number to Clipboard
  const handleCopySerial = () => {
    navigator.clipboard.writeText(serialNo);
    setCopiedSerial(true);
    setTimeout(() => setCopiedSerial(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans pb-10">
      
      {/* Hidden file picker input for device gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* 1. CURVED VIBRANT BLUE-CYAN GRADIENT HEADER (Matched to Reference Image) */}
      <div className="relative w-full bg-gradient-to-b from-[#0284c7] via-[#2563eb] to-[#4f46e5] text-white pt-6 pb-9 px-4 sm:px-6 rounded-b-[36px] sm:rounded-b-[44px] shadow-lg shadow-blue-900/15 overflow-hidden">
        
        {/* Soft radial atmospheric glow waves matching reference image */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -left-16 -top-16 w-72 h-72 rounded-full bg-cyan-400/25 blur-2xl" />
          <div className="absolute -right-16 top-1/2 w-80 h-80 rounded-full bg-indigo-400/30 blur-3xl" />
          <svg
            className="absolute bottom-0 left-0 w-full h-24 opacity-20 pointer-events-none"
            viewBox="0 0 500 120"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60 C150 120 350 0 500 60 L500 120 L0 120 Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Top Bar inside Header Banner */}
        <div className="relative z-10 max-w-md mx-auto flex items-center justify-between mb-5">
          {/* Back button & Profile title */}
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white hover:text-cyan-100 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-lg sm:text-xl font-bold tracking-tight">Profile</span>
          </button>

          {/* Edit Profile button */}
          <button
            type="button"
            onClick={() => {
              setEditedName(currentUser.name);
              setIsEditProfileOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-md text-white text-xs sm:text-sm font-semibold border border-white/20 shadow-xs transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Center: Profile Avatar with Camera Icon & Dynamic Username & Serial ID */}
        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Avatar Container with white ring border */}
          <div className="relative group">
            <div className="w-26 h-26 sm:w-28 sm:h-28 rounded-full ring-4 ring-white/95 shadow-xl shadow-blue-950/25 overflow-hidden bg-cyan-100/40 flex items-center justify-center">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={defaultMascotAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Small camera icon badge overlapping bottom-right */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload photo from device gallery"
              title="Upload photo from gallery"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white border-2 border-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>

            {/* Small remove photo icon badge (only when custom photo exists) */}
            {currentUser.avatarUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                aria-label="Remove custom photo"
                title="Remove photo & restore default avatar"
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white border-2 border-white flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
              >
                <Trash2 className="w-3 h-3 text-white" />
              </button>
            )}
          </div>

          {/* Actual Logged-In Username (Never hardcoded) */}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-3">
            {displayName}
          </h2>

          {/* User's Permanent Serial Number / ID Pill */}
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono font-semibold text-xs tracking-wider border border-white/25 mt-2">
            <span>ID: {serialNo}</span>
          </div>

        </div>

      </div>

      {/* Floating Notifications */}
      <div className="max-w-md mx-auto w-full px-4 pt-4">
        {errorMessage && (
          <div className="p-3.5 mb-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 mb-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* 2. PROFILE OPTIONS (Separate rounded cards matching reference image) */}
      <div className="max-w-md mx-auto w-full px-4 py-3 space-y-3 sm:space-y-3.5">
        
        {/* CARD 1: PASSWORD */}
        <button
          type="button"
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md p-3.5 sm:p-4 flex items-center justify-between transition-all duration-200 active:scale-[0.99] cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#e0f2fe] border border-[#bae6fd]/60 flex items-center justify-center text-[#0284c7] group-hover:scale-105 transition-transform shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-slate-800 tracking-tight">
              Password
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-sky-500/70 group-hover:text-sky-600 transition-colors" />
        </button>

        {/* CARD 2: SERIAL NUMBER (Verified Permanent ID) */}
        <button
          type="button"
          onClick={() => setIsSerialModalOpen(true)}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md p-3.5 sm:p-4 flex items-center justify-between transition-all duration-200 active:scale-[0.99] cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] border border-[#ddd6fe]/60 flex items-center justify-center text-[#7c3aed] group-hover:scale-105 transition-transform shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-base font-bold text-slate-800 tracking-tight">
                Serial Number
              </span>
              <span className="text-xs font-mono font-bold text-indigo-600 truncate">
                {serialNo}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors" />
        </button>

        {/* CARD 3: HELP & SUPPORT (Opens AI Assistant with screenshot analysis) */}
        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md p-3.5 sm:p-4 flex items-center justify-between transition-all duration-200 active:scale-[0.99] cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ffedd5] border border-[#fed7aa]/60 flex items-center justify-center text-[#ea580c] group-hover:scale-105 transition-transform shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-slate-800 tracking-tight">
              Help & Support
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-orange-400 group-hover:text-orange-600 transition-colors" />
        </button>

        {/* CARD 4: SIGN OUT */}
        <button
          type="button"
          onClick={() => setIsSignOutConfirmOpen(true)}
          className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-md p-3.5 sm:p-4 flex items-center justify-between transition-all duration-200 active:scale-[0.99] cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ffe4e6] border border-[#fecdd3]/60 flex items-center justify-center text-[#f43f5e] group-hover:scale-105 transition-transform shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-slate-800 tracking-tight">
              Sign Out
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-rose-400 group-hover:text-rose-600 transition-colors" />
        </button>

      </div>

      {/* MODAL 1: SIGN OUT CONFIRMATION DIALOG */}
      {isSignOutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Sign Out</h3>
              <p className="text-sm text-slate-600 font-medium">
                Are you sure you want to sign out?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSignOutConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignOutConfirmOpen(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    onBack();
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SERIAL NUMBER DETAILS & COPY */}
      {isSerialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Permanent Serial Number</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your unique, permanent identifier in Typing World
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-mono text-xl font-bold text-indigo-700 tracking-wider">
                {serialNo}
              </span>
              <button
                type="button"
                onClick={handleCopySerial}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 hover:text-indigo-600 shadow-xs transition-colors cursor-pointer"
              >
                {copiedSerial ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500 text-left leading-relaxed">
              This Serial Number was generated for your account. It remains permanently connected to your user account and never changes.
            </p>

            <button
              type="button"
              onClick={() => setIsSerialModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: FULL PASSWORD MANAGEMENT & 10-MINUTE OTP SCREEN */}
      <PasswordManagementModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        currentUser={currentUser}
        onUserUpdated={onUserUpdated}
      />

      {/* MODAL 4: EDIT PROFILE (DISPLAY NAME & PHOTO) */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                  autoFocus
                />
              </div>

              {/* Photo Actions inside Edit Profile */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Profile Photo</span>
                    <span className="text-slate-500">Device gallery photo</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setIsEditProfileOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Change
                  </button>
                  {currentUser.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        handleRemovePhoto();
                        setIsEditProfileOpen(false);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. HELP & SUPPORT MODAL (Full Multi-Lingual, Context-Aware AI Assistant) */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

    </div>
  );
};
