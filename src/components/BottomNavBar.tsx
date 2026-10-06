import React from 'react';
import { AppPage } from '../types';

interface BottomNavBarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  hasUnreadNotifications?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentPage,
  onNavigate,
  hasUnreadNotifications = false,
}) => {
  const isMessagesActive = currentPage === 'messages';
  const isNotificationsActive = currentPage === 'notifications';
  const isProfileActive = currentPage === 'profile';

  return (
    <nav 
      aria-label="Bottom Navigation" 
      className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 select-none animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Black pill capsule container matching the reference design */}
      <div className="bg-[#0a0a0a] border border-white/15 shadow-2xl shadow-black/60 rounded-full px-2.5 py-2 sm:px-3 sm:py-2.5 flex items-center justify-center gap-3 sm:gap-5 backdrop-blur-xl">
        
        {/* 1. Messages Button */}
        <button
          type="button"
          onClick={() => onNavigate('messages')}
          aria-label="Messages"
          title="Messages"
          className={`relative rounded-full w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isMessagesActive
              ? 'bg-white text-black shadow-lg shadow-white/20'
              : 'text-white hover:text-white/80 hover:bg-white/10'
          }`}
        >
          {/* Minimalist Paper Airplane Icon from Reference Design */}
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 -translate-x-0.5" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>

        {/* 2. Notifications Button */}
        <button
          type="button"
          onClick={() => onNavigate('notifications')}
          aria-label="Notifications"
          title="Notifications"
          className={`relative rounded-full w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isNotificationsActive
              ? 'bg-white text-black shadow-lg shadow-white/20'
              : 'text-white hover:text-white/80 hover:bg-white/10'
          }`}
        >
          {/* Bell with Vibration Arcs Icon from Reference Design */}
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            <path d="M4 2C2.8 3.7 2 5.7 2 8" />
            <path d="M22 8c0-2.3-.8-4.3-2-6" />
          </svg>

          {/* Small Green Dot for new requests / unread notifications */}
          {hasUnreadNotifications && !isNotificationsActive && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0a0a0a] animate-pulse" />
          )}
        </button>

        {/* 3. Profile Button */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          aria-label="Profile"
          title="Profile"
          className={`relative rounded-full w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isProfileActive
              ? 'bg-white text-black shadow-lg shadow-white/20'
              : 'text-white hover:text-white/80 hover:bg-white/10'
          }`}
        >
          {/* Minimalist User Portrait Icon from Reference Design */}
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>

      </div>
    </nav>
  );
};
