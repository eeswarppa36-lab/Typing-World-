/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppPage, UserAccount } from './types';
import { getCurrentUser, setCurrentUser, isLevelUnlocked, authenticateWithGoogle } from './services/authService';
import { Navbar } from './components/Navbar';
import { FirebaseModal } from './components/FirebaseModal';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AuthPage } from './pages/AuthPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { TypingLevelsPage } from './pages/TypingLevelsPage';
import { BadgesPage } from './pages/BadgesPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { Level1Page } from './pages/Level1Page';
import { Level2Page } from './pages/Level2Page';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { BottomNavBar } from './components/BottomNavBar';
import { getUnreadNotificationCount } from './services/connectionService';

export default function App() {
  const [currentUser, setUser] = useState<UserAccount | null>(() => getCurrentUser());
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    const existing = getCurrentUser();
    return existing ? 'home' : 'auth';
  });
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isGoogleSignInModalOpen, setIsGoogleSignInModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [levelsTab, setLevelsTab] = useState<'all' | 'levels' | 'achievements'>('all');
  
  // Track unread notification status without forced continuous re-renders
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(() => {
    const existing = getCurrentUser();
    return existing ? getUnreadNotificationCount(existing.email) > 0 : false;
  });

  const checkUnreadNotifs = React.useCallback(() => {
    if (!currentUser) {
      setHasUnreadNotifs(false);
      return;
    }
    const hasUnread = getUnreadNotificationCount(currentUser.email) > 0;
    setHasUnreadNotifs(prev => (prev !== hasUnread ? hasUnread : prev));
  }, [currentUser]);

  useEffect(() => {
    checkUnreadNotifs();
    const handleUpdate = () => checkUnreadNotifs();
    window.addEventListener('typing_world_connection_updated', handleUpdate);
    const interval = setInterval(checkUnreadNotifs, 3000);
    return () => {
      window.removeEventListener('typing_world_connection_updated', handleUpdate);
      clearInterval(interval);
    };
  }, [checkUnreadNotifs]);

  const handleNotificationRead = React.useCallback(() => {
    setHasUnreadNotifs(false);
  }, []);

  // Enforce authentication gate: redirect unauthenticated users to Login
  useEffect(() => {
    if (!currentUser && currentPage !== 'auth' && currentPage !== 'forgot-password' && currentPage !== 'privacy') {
      setCurrentPage('auth');
    }
  }, [currentUser, currentPage]);

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setCurrentPage('auth');
  };

  const handleAuthSuccess = (authenticatedUser: UserAccount) => {
    setUser(authenticatedUser);
    setCurrentPage('home'); // After successful login, open the Home Screen
  };

  const handleSelectLevel = (levelNumber: number) => {
    if (levelNumber === 1) {
      setCurrentPage('level-1');
    } else if (levelNumber === 2) {
      if (isLevelUnlocked(2, currentUser)) {
        setCurrentPage('level-2');
      } else {
        setCurrentPage('levels');
      }
    }
  };

  const handleUserUpdated = (updatedUser: UserAccount) => {
    setUser({ ...updatedUser });
  };

  const handleSimulateGoogleSignIn = (email: string, name: string) => {
    const googleUser = authenticateWithGoogle({
      email,
      name,
    });
    setUser(googleUser);
    setCurrentPage('profile');
  };

  // Determine back navigation label & destination for top bar
  const getNavBackConfig = () => {
    switch (currentPage) {
      case 'privacy':
        return { label: 'Back', destination: 'home' as AppPage };
      case 'auth':
        return { label: 'Privacy Policy', destination: 'privacy' as AppPage };
      case 'forgot-password':
        return { label: 'Login', destination: 'auth' as AppPage };
      case 'profile':
        return { label: 'Back', destination: 'home' as AppPage };
      case 'levels':
        return { label: 'Back', destination: 'home' as AppPage };
      case 'badges':
        return { label: 'Back', destination: 'home' as AppPage };
      case 'achievements':
        return { label: 'Back', destination: 'home' as AppPage };
      case 'level-1':
      case 'level-2':
        return { label: 'All Levels', destination: 'levels' as AppPage };
      case 'messages':
        return { label: 'Back', destination: 'home' as AppPage };
      case 'notifications':
        return { label: 'Back', destination: 'home' as AppPage };
      default:
        return undefined;
    }
  };

  const backConfig = getNavBackConfig();

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-900 transition-colors ${
      currentPage === 'auth' ? 'bg-[#BEAFE2]' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* Top Navigation Bar with working back button & brand (hidden on full-screen login and dedicated profile screen) */}
      {currentPage !== 'auth' && currentPage !== 'profile' && (
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
          onOpenGoogleSignIn={() => setIsGoogleSignInModalOpen(true)}
          backDestination={backConfig?.destination}
          backLabel={backConfig?.label}
        />
      )}

      {/* Main Page Routing */}
      <main className="flex-1 w-full pb-16 sm:pb-20">
        {currentPage === 'home' && (
          <HomePage
            currentUser={currentUser}
            onOpenProfile={() => setCurrentPage('profile')}
            onOpenLevels={() => setCurrentPage('levels')}
            onOpenBadges={() => setCurrentPage('badges')}
            onOpenAchievements={() => setCurrentPage('achievements')}
            onStartPractice={() => setCurrentPage('level-1')}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onBack={() => setCurrentPage('home')}
            onUserUpdated={handleUserUpdated}
            onNavigateToLevels={() => {
              setLevelsTab('levels');
              setCurrentPage('levels');
            }}
            onLogout={handleLogout}
          />
        )}

        {currentPage === 'badges' && (
          <BadgesPage
            currentUser={currentUser}
            onBack={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'achievements' && (
          <AchievementsPage
            currentUser={currentUser}
            onBack={() => setCurrentPage('home')}
            onNavigateToLevels={() => setCurrentPage('levels')}
          />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPolicyPage
            onPrevious={() => setCurrentPage('home')}
            onNext={() => {
              setAuthTab('login');
              setCurrentPage('auth');
            }}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            initialTab={authTab}
            onBack={() => setCurrentPage('home')}
            onSuccess={handleAuthSuccess}
            onForgotPassword={() => setCurrentPage('forgot-password')}
            onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
            onOpenGoogleModal={() => setIsGoogleSignInModalOpen(true)}
          />
        )}

        {currentPage === 'forgot-password' && (
          <ForgotPasswordPage
            onBack={() => setCurrentPage('auth')}
            onSuccess={handleAuthSuccess}
          />
        )}

        {currentPage === 'levels' && (
          <TypingLevelsPage
            currentUser={currentUser}
            onSelectLevel={handleSelectLevel}
            onBack={() => setCurrentPage('home')}
            initialTab={levelsTab}
          />
        )}

        {currentPage === 'level-1' && (
          <Level1Page
            currentUser={currentUser}
            onBack={() => setCurrentPage('levels')}
            onContinueToLevel2={() => setCurrentPage('level-2')}
            onUserUpdated={handleUserUpdated}
          />
        )}

        {currentPage === 'level-2' && (
          <Level2Page
            currentUser={currentUser}
            onBack={() => setCurrentPage('levels')}
            onBackToLevels={() => setCurrentPage('levels')}
            onUserUpdated={handleUserUpdated}
          />
        )}

        {currentPage === 'messages' && (
          <MessagesPage
            currentUser={currentUser}
            onBack={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'notifications' && (
          <NotificationsPage
            currentUser={currentUser}
            onBack={() => setCurrentPage('home')}
            onNotificationRead={handleNotificationRead}
          />
        )}
      </main>

      {/* Google Sign-In & Account Switcher Modal */}
      <GoogleSignInModal
        isOpen={isGoogleSignInModalOpen}
        onClose={() => setIsGoogleSignInModalOpen(false)}
        onSignInSuccess={(user) => {
          setUser(user);
        }}
        currentUser={currentUser}
      />

      {/* Firebase & Authentication Settings Modal */}
      <FirebaseModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
        onSimulateGoogleSignIn={handleSimulateGoogleSignIn}
      />

      {/* Subtle modern footer */}
      {currentPage !== 'auth' && (
        <footer className={`border-t py-4 px-4 pb-24 sm:pb-24 text-center text-xs transition-colors ${
          currentPage === 'home' || currentPage === 'profile' || currentPage === 'messages' || currentPage === 'notifications'
            ? 'bg-[#f8fafc] border-slate-200 text-slate-500'
            : 'bg-slate-950 border-slate-900/80 text-slate-500'
        }`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Abhi Presents · Designed by Abhi</span>
            <span>⌨️ Typing World © 2026 · Modern Touch Typing Education</span>
          </div>
        </footer>
      )}

      {/* Minimalist 3-Button Fixed Bottom Navigation Bar (Reference Design) */}
      {currentPage !== 'auth' && (
        <BottomNavBar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          hasUnreadNotifications={hasUnreadNotifs}
        />
      )}

    </div>
  );
}
