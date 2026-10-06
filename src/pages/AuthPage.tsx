import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  CheckCircle,
  Sparkles,
  Heart
} from 'lucide-react';
import { loginUser, registerUser, authenticateWithGoogle } from '../services/authService';
import { UserAccount } from '../types';
import clayMascotImg from '../assets/images/clay_login_mascot_1791194745842.jpg';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: (user: UserAccount) => void;
  onForgotPassword: () => void;
  onOpenFirebaseModal: () => void;
  onOpenGoogleModal?: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onSuccess,
  onForgotPassword,
  onOpenGoogleModal,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  
  // Login form state
  const [loginEmailOrUser, setLoginEmailOrUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign up form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [dob, setDob] = useState('');
  const [villageName, setVillageName] = useState('');
  const [favouriteDate, setFavouriteDate] = useState('2026-01-01');
  
  // UI states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Tab switch
  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await loginUser(loginEmailOrUser, loginPassword);
      if (res.success && res.user) {
        setSuccessMsg('Welcome back! Loading your Typing World...');
        setTimeout(() => {
          onSuccess(res.user!);
        }, 500);
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await registerUser({
        email: signupEmail,
        password: signupPassword,
        dob: dob || '2000-01-01',
        villageName: villageName || 'Typing World',
        favouriteDate: favouriteDate || '2026-01-01',
      });

      if (res.success && res.user) {
        setSuccessMsg('Account created successfully! Welcome to Typing World!');
        setTimeout(() => {
          onSuccess(res.user!);
        }, 600);
      } else {
        setErrorMsg(res.error || 'Failed to create account. Please check the fields.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In button
  const handleGoogleLogin = () => {
    if (onOpenGoogleModal) {
      onOpenGoogleModal();
      return;
    }
    setIsLoading(true);
    try {
      const user = authenticateWithGoogle({
        email: 'eeswarppa36@gmail.com',
        name: 'Eeswarappa',
      });
      setSuccessMsg('Signed in with Google! Welcome back!');
      setTimeout(() => {
        onSuccess(user);
      }, 500);
    } catch {
      setErrorMsg('Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#BEAFE2] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden font-sans select-none">
      
      {/* 3D CLAY BACKGROUND SCENERY */}
      {/* Floating 3D White Clay Clouds */}
      <div className="absolute top-10 left-6 sm:left-16 pointer-events-none hidden xs:flex items-center">
        <div className="w-16 h-8 bg-white/90 rounded-full shadow-lg shadow-purple-950/10 relative">
          <div className="w-9 h-9 bg-white/95 rounded-full absolute -top-4 left-3 shadow-xs" />
          <div className="w-7 h-7 bg-white/90 rounded-full absolute -top-2 left-8" />
        </div>
      </div>

      <div className="absolute top-24 right-6 sm:right-16 pointer-events-none hidden xs:flex items-center">
        <div className="w-20 h-9 bg-white/90 rounded-full shadow-lg shadow-purple-950/10 relative">
          <div className="w-10 h-10 bg-white/95 rounded-full absolute -top-4 left-4 shadow-xs" />
          <div className="w-8 h-8 bg-white/90 rounded-full absolute -top-2 left-10" />
        </div>
      </div>

      {/* Decorative Potted Clay Plant (Left) */}
      <div className="absolute bottom-8 left-4 sm:left-12 lg:left-24 pointer-events-none hidden md:flex flex-col items-center">
        {/* Plant Leaves */}
        <div className="relative w-16 h-28 flex flex-col items-center justify-end">
          <div className="w-5 h-14 bg-[#7EA869] rounded-full absolute top-0 transform -rotate-12 shadow-inner" />
          <div className="w-5 h-16 bg-[#8CB575] rounded-full absolute top-2 right-1 transform rotate-18 shadow-inner" />
          <div className="w-5 h-12 bg-[#7EA869] rounded-full absolute top-6 left-1 transform -rotate-25 shadow-inner" />
          <div className="w-6 h-12 bg-[#8CB575] rounded-full absolute top-8 right-2 transform rotate-20" />
          <div className="w-1.5 h-16 bg-[#5F884B] rounded-full" />
        </div>
        {/* Beige Clay Pot */}
        <div className="w-16 h-16 bg-[#E3D3C1] rounded-2xl shadow-xl shadow-purple-950/20 border-t-4 border-[#CDBBA8]" />
      </div>

      {/* Decorative Potted Pink Flower (Right) */}
      <div className="absolute bottom-8 right-4 sm:right-12 lg:right-24 pointer-events-none hidden md:flex flex-col items-center">
        {/* Pink Daisy Flower */}
        <div className="relative w-16 h-24 flex flex-col items-center justify-end">
          {/* Flower Petals */}
          <div className="relative w-12 h-12 flex items-center justify-center mb-1">
            <div className="w-4 h-4 bg-[#F7A6B8] rounded-full absolute -top-1" />
            <div className="w-4 h-4 bg-[#F7A6B8] rounded-full absolute -bottom-1" />
            <div className="w-4 h-4 bg-[#F7A6B8] rounded-full absolute -left-1" />
            <div className="w-4 h-4 bg-[#F7A6B8] rounded-full absolute -right-1" />
            <div className="w-4 h-4 bg-[#F7A6B8] rounded-full absolute -top-0.5 -left-0.5" />
            <div className="w-4 h-4 bg-[#F7A6B8] rounded-full absolute -top-0.5 -right-0.5" />
            <div className="w-4 h-4 bg-[#F7A6B8] rounded-full absolute -bottom-0.5 -left-0.5" />
            <div className="w-4 h-4 bg-[#F7A6B8] rounded-full absolute -bottom-0.5 -right-0.5" />
            {/* Yellow Center */}
            <div className="w-5 h-5 bg-[#F9D35A] rounded-full shadow-inner z-10" />
          </div>
          {/* Green Stem */}
          <div className="w-1.5 h-10 bg-[#7EA869] rounded-full relative">
            <div className="w-3.5 h-2 bg-[#7EA869] rounded-full absolute top-2 -left-2.5 transform -rotate-15" />
            <div className="w-3.5 h-2 bg-[#7EA869] rounded-full absolute top-4 -right-2.5 transform rotate-15" />
          </div>
        </div>
        {/* Pink Clay Pot */}
        <div className="w-14 h-14 bg-[#EAA1AA] rounded-2xl shadow-xl shadow-purple-950/20 border-t-3 border-[#D98C96]" />
      </div>

      {/* MAIN PHONE / CARD CONTAINER (Matching reference image) */}
      <div className="w-full max-w-[390px] bg-[#FAF7F2] rounded-[44px] shadow-2xl shadow-purple-950/25 p-6 sm:p-7 relative border-[5px] border-white/90 flex flex-col z-10">
        
        {/* TOP CUTE HEART ICON */}
        <div className="flex justify-center mb-1">
          <div className="w-7 h-7 rounded-full bg-[#F499AA] flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 fill-white text-white" />
          </div>
        </div>

        {/* HEADING WITH YELLOW SPARKLES */}
        <div className="text-center space-y-0.5">
          <div className="flex items-center justify-center gap-2">
            {/* Left Sparkles */}
            <div className="flex flex-col items-center gap-0.5 rotate-[-30deg]">
              <span className="w-2.5 h-0.5 bg-[#FFC555] rounded-full" />
              <span className="w-3 h-0.5 bg-[#FFC555] rounded-full ml-1" />
              <span className="w-2 h-0.5 bg-[#FFC555] rounded-full" />
            </div>

            <h1 className="text-2xl sm:text-[26px] font-black text-[#58418E] tracking-tight">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>

            {/* Right Sparkles */}
            <div className="flex flex-col items-center gap-0.5 rotate-[30deg]">
              <span className="w-2.5 h-0.5 bg-[#FFC555] rounded-full" />
              <span className="w-3 h-0.5 bg-[#FFC555] rounded-full mr-1" />
              <span className="w-2 h-0.5 bg-[#FFC555] rounded-full" />
            </div>
          </div>

          <p className="text-xs text-[#73638D] font-medium">
            {activeTab === 'login' ? 'Login to continue your journey' : 'Sign up to start learning touch typing'}
          </p>
        </div>

        {/* CUTE 3D MASCOT LEANING OVER THE CARD */}
        <div className="relative -mt-2 -mb-5 flex justify-center z-20 pointer-events-none">
          <div className="w-40 h-36 relative flex items-center justify-center">
            <img
              src={clayMascotImg}
              alt="Typing World Mascot"
              className="w-36 h-36 object-contain drop-shadow-md rounded-3xl"
            />
          </div>
        </div>

        {/* WHITE INNER CARD CONTAINER */}
        <div className="bg-white rounded-[32px] p-5 shadow-lg shadow-purple-900/10 border border-purple-100/90 z-20 space-y-3.5">
          
          {/* Notification Messages */}
          {errorMsg && (
            <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="leading-tight">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
              <span className="leading-tight">{successMsg}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            /* ------------------ LOGIN FORM ------------------ */
            <form onSubmit={handleLogin} className="space-y-3">
              
              {/* Field 1: Email or Username */}
              <div className="flex items-center gap-2.5 px-2 py-1.5 bg-[#F9F7FC] border border-[#E9E3F3] focus-within:border-[#967FC7] rounded-2xl transition-all shadow-2xs">
                {/* Purple Icon Pill */}
                <div className="w-9 h-9 rounded-xl bg-[#9881CE] text-white flex items-center justify-center shadow-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginEmailOrUser}
                  onChange={(e) => setLoginEmailOrUser(e.target.value)}
                  placeholder="Email or Username"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-[#9F93B8] focus:outline-none font-medium pr-2"
                />
              </div>

              {/* Field 2: Password */}
              <div className="flex items-center gap-2.5 px-2 py-1.5 bg-[#F9F7FC] border border-[#E9E3F3] focus-within:border-[#967FC7] rounded-2xl transition-all shadow-2xs">
                {/* Purple Icon Pill */}
                <div className="w-9 h-9 rounded-xl bg-[#9881CE] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-[#9F93B8] focus:outline-none font-medium pr-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[#A193BC] hover:text-[#7A63B4] transition-colors cursor-pointer shrink-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right pt-0.5">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-[#7C65BA] hover:text-[#5F46A1] font-semibold transition-colors cursor-pointer hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#9079C8] hover:bg-[#8169BA] active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-[#9079C8]/40 transition-all text-sm tracking-wide flex items-center justify-center cursor-pointer mt-1"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              {/* OR CONTINUE WITH DIVIDER */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-[#ECE6F5]" />
                <span className="text-[11px] text-[#A699BF] font-medium whitespace-nowrap">or continue with</span>
                <div className="flex-1 h-px bg-[#ECE6F5]" />
              </div>

              {/* THREE SOCIAL BUTTONS (Google, Apple, Facebook) */}
              <div className="flex items-center justify-center gap-4 pt-0.5">
                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  title="Sign in with Google"
                  className="w-11 h-11 rounded-full bg-[#FAF8FD] border border-[#E9E3F3] shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </button>

                {/* Apple Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  title="Sign in with Apple"
                  className="w-11 h-11 rounded-full bg-[#FAF8FD] border border-[#E9E3F3] shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 transition-all cursor-pointer text-slate-900"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.13.64-2.82 1.45-.6.71-1.13 1.87-1 2.98 1.07.08 2.17-.51 2.83-1.33z" />
                  </svg>
                </button>

                {/* Facebook Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  title="Sign in with Facebook"
                  className="w-11 h-11 rounded-full bg-[#FAF8FD] border border-[#E9E3F3] shadow-xs flex items-center justify-center hover:bg-white hover:scale-105 transition-all cursor-pointer text-[#1877F2]"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>

              {/* FOOTER SWITCH TO SIGN UP */}
              <div className="text-center pt-2">
                <span className="text-xs text-[#7B6A97]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('signup')}
                    className="text-[#7C62BC] font-bold hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </span>
              </div>

            </form>
          ) : (
            /* ------------------ SIGN UP FORM ------------------ */
            <form onSubmit={handleSignUp} className="space-y-3">
              
              {/* Field 1: Gmail address */}
              <div className="flex items-center gap-2.5 px-2 py-1.5 bg-[#F9F7FC] border border-[#E9E3F3] focus-within:border-[#967FC7] rounded-2xl transition-all shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#9881CE] text-white flex items-center justify-center shadow-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-[#9F93B8] focus:outline-none font-medium pr-2"
                />
              </div>

              {/* Field 2: Password */}
              <div className="flex items-center gap-2.5 px-2 py-1.5 bg-[#F9F7FC] border border-[#E9E3F3] focus-within:border-[#967FC7] rounded-2xl transition-all shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#9881CE] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create Password"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-[#9F93B8] focus:outline-none font-medium pr-1"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="p-1 text-[#A193BC] hover:text-[#7A63B4] transition-colors cursor-pointer shrink-0"
                >
                  {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Field 3: Date of Birth */}
              <div className="flex items-center gap-2.5 px-2 py-1.5 bg-[#F9F7FC] border border-[#E9E3F3] focus-within:border-[#967FC7] rounded-2xl transition-all shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#9881CE] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none font-medium pr-2"
                />
              </div>

              {/* Field 4: Village / Hometown */}
              <div className="flex items-center gap-2.5 px-2 py-1.5 bg-[#F9F7FC] border border-[#E9E3F3] focus-within:border-[#967FC7] rounded-2xl transition-all shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#9881CE] text-white flex items-center justify-center shadow-xs shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  placeholder="Village / Town (for recovery)"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-[#9F93B8] focus:outline-none font-medium pr-2"
                />
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#9079C8] hover:bg-[#8169BA] active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-[#9079C8]/40 transition-all text-sm tracking-wide flex items-center justify-center cursor-pointer mt-1"
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </button>

              {/* Divider & Google */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-[#ECE6F5]" />
                <span className="text-[11px] text-[#A699BF] font-medium whitespace-nowrap">or sign up with</span>
                <div className="flex-1 h-px bg-[#ECE6F5]" />
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="px-4 py-2 rounded-2xl bg-[#FAF8FD] border border-[#E9E3F3] text-xs font-bold text-[#58418E] flex items-center gap-2 hover:bg-white shadow-xs transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* FOOTER SWITCH TO LOGIN */}
              <div className="text-center pt-2">
                <span className="text-xs text-[#7B6A97]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('login')}
                    className="text-[#7C62BC] font-bold hover:underline cursor-pointer"
                  >
                    Login
                  </button>
                </span>
              </div>

            </form>
          )}

        </div>

        {/* BOTTOM BRANDING TAG */}
        <div className="mt-3 text-center">
          <span className="text-[10px] text-[#8675A3] font-semibold">
            Typing World · Abhi Presents
          </span>
        </div>

      </div>

    </div>
  );
};
