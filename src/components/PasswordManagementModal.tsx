import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  X, 
  Mail, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound 
} from 'lucide-react';
import { UserAccount } from '../types';
import { 
  verifyCurrentPassword, 
  changeUserPassword, 
  sendPasswordResetOTP, 
  verifyPasswordResetOTP, 
  resetPasswordWithVerifiedOTP 
} from '../services/authService';

interface PasswordManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUserUpdated: (user: UserAccount) => void;
}

type PasswordStep = 'change' | 'forgot-email' | 'verify-otp' | 'reset-password' | 'success';

export const PasswordManagementModal: React.FC<PasswordManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
}) => {
  const [step, setStep] = useState<PasswordStep>('change');

  // Form Fields - Step 1: Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields - Step 2: Email Verification
  const [verificationEmail, setVerificationEmail] = useState(currentUser.email);

  // Form Fields - Step 3: OTP Verification
  const [otpCode, setOtpCode] = useState('');
  const [simulatedDeliveredOtp, setSimulatedDeliveredOtp] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds

  // Form Fields - Step 4: Reset Password
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  // Status & feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset states on modal open/close
  useEffect(() => {
    if (isOpen) {
      setStep('change');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setVerificationEmail(currentUser.email);
      setOtpCode('');
      setSimulatedDeliveredOtp(null);
      setResetNewPassword('');
      setResetConfirmPassword('');
      setErrorMessage(null);
      setSuccessNotice(null);
      setIsLoading(false);
    }
  }, [isOpen, currentUser.email]);

  // Live 10-Minute Countdown Timer for OTP
  useEffect(() => {
    if (step !== 'verify-otp' || !otpExpiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingSeconds = Math.max(0, Math.floor((otpExpiresAt - now) / 1000));
      setTimeLeft(remainingSeconds);

      if (remainingSeconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, otpExpiresAt]);

  if (!isOpen) return null;

  // Format seconds to mm:ss (10:00 -> 09:59 -> ... -> 00:00)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isExpired = timeLeft === 0;

  // STEP 1: Handle Normal Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation: Current password required
    if (!currentPassword) {
      setErrorMessage('Please enter your Current Password.');
      return;
    }

    // Validation: New password required & min length
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New Password must be at least 6 characters long.');
      return;
    }

    // Validation: New and Confirm must match exactly
    if (newPassword !== confirmPassword) {
      setErrorMessage('New Password and Confirm Password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await changeUserPassword(currentUser.email, currentPassword, newPassword);
      if (!result.success || !result.user) {
        setErrorMessage(result.error || 'Failed to update password.');
        setIsLoading(false);
        return;
      }

      onUserUpdated(result.user);
      setStep('success');
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Handle Email Verification & Request OTP
  const handleVerifyEmailAndSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanInput = verificationEmail.trim().toLowerCase();
    if (!cleanInput) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    // Verify email matches the user's account
    if (cleanInput !== currentUser.email.toLowerCase()) {
      setErrorMessage('The entered email does not match this Typing World account.');
      return;
    }

    setIsLoading(true);
    const result = sendPasswordResetOTP(cleanInput);

    if (!result.success || !result.expiresAt) {
      setErrorMessage(result.error || 'Failed to send OTP code.');
      setIsLoading(false);
      return;
    }

    setOtpExpiresAt(result.expiresAt);
    setTimeLeft(600); // exactly 10 minutes
    setSimulatedDeliveredOtp(result.code || null);
    setOtpCode('');
    setStep('verify-otp');
    setSuccessNotice(`Verification code sent to ${cleanInput}! Valid for exactly 10 minutes.`);
    setIsLoading(false);
  };

  // STEP 3: Handle Resend OTP
  const handleResendOTP = () => {
    setErrorMessage(null);
    setSuccessNotice(null);
    setIsLoading(true);

    const result = sendPasswordResetOTP(currentUser.email);
    if (!result.success || !result.expiresAt) {
      setErrorMessage(result.error || 'Failed to resend OTP.');
      setIsLoading(false);
      return;
    }

    // Invalidate previous OTP and reset timer to exactly 10:00
    setOtpExpiresAt(result.expiresAt);
    setTimeLeft(600);
    setSimulatedDeliveredOtp(result.code || null);
    setOtpCode('');
    setSuccessNotice(`New OTP code generated and sent to ${currentUser.email}!`);
    setIsLoading(false);
  };

  // STEP 3: Handle OTP Verification
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isExpired) {
      setErrorMessage('OTP has expired. Please tap "Resend OTP" to generate a new verification code.');
      return;
    }

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    const result = verifyPasswordResetOTP(currentUser.email, otpCode);
    if (!result.success) {
      setErrorMessage(result.error || 'Incorrect OTP code.');
      return;
    }

    // Valid OTP verified before 10-minute expiry -> open Reset Password screen
    setStep('reset-password');
    setErrorMessage(null);
  };

  // STEP 4: Handle Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!resetNewPassword || resetNewPassword.length < 6) {
      setErrorMessage('New Password must be at least 6 characters long.');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setErrorMessage('New Password and Confirm New Password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPasswordWithVerifiedOTP(currentUser.email, resetNewPassword);
      if (!result.success || !result.user) {
        setErrorMessage(result.error || 'Failed to reset password.');
        setIsLoading(false);
        return;
      }

      onUserUpdated(result.user);
      setStep('success');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 text-left relative overflow-hidden">
        
        {/* TOP BAR / NAVIGATION */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {step !== 'change' && step !== 'success' && (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  if (step === 'forgot-email') setStep('change');
                  else if (step === 'verify-otp') setStep('forgot-email');
                  else if (step === 'reset-password') setStep('verify-otp');
                }}
                className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <Lock className="w-4 h-4" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {step === 'change' && 'Password Settings'}
              {step === 'forgot-email' && 'Email Verification'}
              {step === 'verify-otp' && 'Verify OTP'}
              {step === 'reset-password' && 'Reset Password'}
              {step === 'success' && 'Password Updated'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FEEDBACK ALERTS */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successNotice && step !== 'success' && (
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 1: CHANGE PASSWORD FORM (WITH FORGOT PASSWORD LINK) */}
        {/* ======================================================== */}
        {step === 'change' && (
          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <p className="text-xs text-slate-500">
              Update your account password securely. Your current password must be verified before changes are applied.
            </p>

            {/* Current Password Field (Masked, Never plain text) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying & Updating...' : 'Update Password'}
            </button>

            {/* CLEARLY VISIBLE "FORGOT PASSWORD?" LINK */}
            <div className="pt-2 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('forgot-email');
                }}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Forgot Password?</span>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 2: EMAIL VERIFICATION SCREEN                        */}
        {/* ======================================================== */}
        {step === 'forgot-email' && (
          <form onSubmit={handleVerifyEmailAndSendOTP} className="space-y-4">
            <div className="text-center py-1">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mx-auto mb-2">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Verify Your Account Email</h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter the email address connected to your Typing World account to receive a 10-minute verification OTP code.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account Email Address
              </label>
              <input
                type="email"
                required
                value={verificationEmail}
                onChange={(e) => setVerificationEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying Account...' : 'Send Verification OTP'}
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 3: OTP VERIFICATION SCREEN (10-MINUTE TIMER)        */}
        {/* ======================================================== */}
        {step === 'verify-otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center py-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Enter Verification Code</h4>
              <p className="text-xs text-slate-500 mt-1">
                We sent a 6-digit one-time code to <span className="font-semibold text-slate-700">{currentUser.email}</span>.
              </p>
            </div>

            {/* Simulated Email Delivery Banner */}
            {simulatedDeliveredOtp && (
              <div className="p-3 rounded-2xl bg-indigo-50/90 border border-indigo-200 text-indigo-900 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Typing World OTP: <strong className="font-mono text-sm tracking-widest text-indigo-700">{simulatedDeliveredOtp}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(simulatedDeliveredOtp)}
                  className="px-2 py-1 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg text-[11px] font-bold cursor-pointer"
                >
                  Auto Fill
                </button>
              </div>
            )}

            {/* OTP Input Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-center text-2xl tracking-[0.35em] font-bold focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                autoFocus
              />

              {/* LIVE COUNTDOWN DIRECTLY BELOW OTP FIELD */}
              <div className="mt-2.5 flex flex-col items-center justify-center">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isExpired 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isExpired ? 'OTP Expired (00:00)' : `Valid for: ${formatTime(timeLeft)}`}
                  </span>
                </div>

                {/* EXACT "Resend OTP" BUTTON */}
                <div className="mt-2 text-xs flex items-center gap-1.5 text-slate-500">
                  <span>Didn't get the code?</span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Verify Code Button */}
            <button
              type="submit"
              disabled={isLoading || isExpired || otpCode.length !== 6}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-40"
            >
              Verify Code
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 4: RESET PASSWORD SCREEN                            */}
        {/* ======================================================== */}
        {step === 'reset-password' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div className="text-center py-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Create New Password</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your email was successfully verified. Set your new password below.
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showResetNewPassword ? 'text' : 'password'}
                  required
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showResetNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showResetConfirmPassword ? 'text' : 'password'}
                  required
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showResetConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 5: SUCCESS CONFIRMATION SCREEN                      */}
        {/* ======================================================== */}
        {step === 'success' && (
          <div className="py-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Password Changed Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Your password has been securely updated. You can now use your new password to sign in to Typing World.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
