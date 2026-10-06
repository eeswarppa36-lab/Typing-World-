import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { AppPage, UserAccount } from '../types';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  currentUser: UserAccount | null;
  onLogout?: () => void;
  onOpenFirebaseModal: () => void;
  onOpenGoogleSignIn: () => void;
  backDestination?: AppPage;
  backLabel?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  onOpenFirebaseModal,
  onOpenGoogleSignIn,
  backDestination,
  backLabel,
}) => {
  const showBack = currentPage !== 'home';
  const isLight = true;

  const getNavLinkClass = (isActive: boolean) => {
    if (isLight) {
      return isActive 
        ? 'text-indigo-600 font-bold' 
        : 'text-slate-600 hover:text-slate-900';
    }
    return isActive 
      ? 'text-indigo-400 font-semibold' 
      : 'text-slate-300 hover:text-white';
  };

  const handleBack = () => {
    if (backDestination) {
      onNavigate(backDestination);
      return;
    }
    // Default smart back route:
    if (currentPage === 'privacy') onNavigate('home');
    else if (currentPage === 'auth') onNavigate('privacy');
    else if (currentPage === 'forgot-password') onNavigate('auth');
    else if (currentPage === 'levels') onNavigate('home');
    else if (currentPage === 'badges') onNavigate('home');
    else if (currentPage === 'achievements') onNavigate('home');
    else if (currentPage === 'profile') onNavigate('home');
    else if (currentPage === 'level-1' || currentPage === 'level-2') onNavigate('levels');
    else onNavigate('home');
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors ${
      isLight 
        ? 'border-slate-200 bg-white/95 backdrop-blur-md text-slate-800' 
        : 'border-slate-800/80 bg-slate-950/80 backdrop-blur-xl text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Back arrow + Brand wordmark */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              aria-label="Go back"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-xs cursor-pointer ${
                isLight 
                  ? 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200' 
                  : 'text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4 text-indigo-500" />
              <span className="text-xs">{backLabel || 'Back'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer text-left"
          >
            <span className="text-xl sm:text-2xl">⌨️</span>
            <span className={isLight ? "text-slate-900 font-extrabold" : "bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent"}>
              Typing World
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean, no duplicate Home, no top Profile) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onNavigate('levels')}
            className={`transition-colors cursor-pointer ${getNavLinkClass(currentPage === 'levels' || currentPage === 'level-1' || currentPage === 'level-2')}`}
          >
            Typing Levels
          </button>
          <button
            onClick={() => onNavigate('privacy')}
            className={`transition-colors cursor-pointer ${getNavLinkClass(currentPage === 'privacy')}`}
          >
            Privacy Policy
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Settings and Auth only, no top Profile or top Sign Out) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenFirebaseModal}
            title="Firebase & Auth Settings"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isLight
                ? 'text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                : 'text-slate-400 hover:text-indigo-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          {!currentUser && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenGoogleSignIn}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-slate-200"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
