import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  BellRing, 
  Bell, 
  CheckCircle2, 
  UserPlus, 
  Check, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { UserAccount } from '../types';
import { 
  getNotificationsForUser, 
  markAllNotificationsAsRead, 
  markNotificationAsRead,
  findUserBySerialOrEmail,
  acceptConnectionRequest,
  getConnectionStatus,
  AppNotification
} from '../services/connectionService';
import { ProfileInnerPage } from '../components/ProfileInnerPage';

interface NotificationsPageProps {
  currentUser: UserAccount | null;
  onBack: () => void;
  onNotificationRead?: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  currentUser,
  onBack,
  onNotificationRead,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (!currentUser) return [];
    return getNotificationsForUser(currentUser.email);
  });
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const hasMarkedReadRef = useRef(false);

  // Keep notifications updated reactively
  useEffect(() => {
    if (currentUser?.email) {
      setNotifications(getNotificationsForUser(currentUser.email));
    }
    const handleUpdate = () => {
      if (currentUser?.email) {
        setNotifications(getNotificationsForUser(currentUser.email));
      }
    };
    window.addEventListener('typing_world_connection_updated', handleUpdate);
    return () => window.removeEventListener('typing_world_connection_updated', handleUpdate);
  }, [currentUser?.email]);

  // Mark all notifications as read once when opening notifications page
  useEffect(() => {
    if (currentUser?.email && !hasMarkedReadRef.current) {
      hasMarkedReadRef.current = true;
      markAllNotificationsAsRead(currentUser.email);
      onNotificationRead?.();
    }
  }, [currentUser?.email, onNotificationRead]);

  const refreshNotifications = () => {
    if (currentUser) {
      setNotifications(getNotificationsForUser(currentUser.email));
      onNotificationRead?.();
    }
  };

  const handleOpenUserProfile = (userEmailOrSerial: string, notifId?: string) => {
    if (notifId) {
      markNotificationAsRead(notifId);
    }
    const user = findUserBySerialOrEmail(userEmailOrSerial);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handleDirectAccept = (e: React.MouseEvent, requestId?: string) => {
    e.stopPropagation();
    if (!currentUser || !requestId) return;
    acceptConnectionRequest(requestId, currentUser);
    refreshNotifications();
  };

  // If a profile is selected to view, render the Profile Inner Page!
  if (selectedUser) {
    return (
      <ProfileInnerPage
        targetUser={selectedUser}
        currentUser={currentUser}
        onBack={() => {
          setSelectedUser(null);
          refreshNotifications();
        }}
        onConnectionUpdated={refreshNotifications}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-6 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-5 pb-24">
      {/* Top Header Row with Working Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>← Back</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BellRing className="w-5 h-5 text-indigo-600" />
              <span>Notifications</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Bell className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">No Notifications Yet</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              When other typists send you connection requests or accept your requests, they will appear right here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isRequest = notif.type === 'request_received';
            const conn = currentUser ? getConnectionStatus(currentUser.email, notif.senderEmail) : { status: 'none' as const };
            const isAlreadyAccepted = conn.status === 'connected';
            const senderUser = findUserBySerialOrEmail(notif.senderEmail);
            const avatarUrl = notif.senderAvatar || senderUser?.avatarUrl;

            return (
              <div
                key={notif.id}
                onClick={() => handleOpenUserProfile(notif.senderEmail, notif.id)}
                className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-indigo-300 transition-all flex items-start gap-3.5 group cursor-pointer shadow-xs"
              >
                {/* Sender Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={notif.senderName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-base">
                      {notif.senderName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isRequest ? (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 border border-white flex items-center justify-center text-white text-[9px]">
                      <UserPlus className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-600 border border-white flex items-center justify-center text-white text-[9px]">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      {notif.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>

                  {/* Serial Handle */}
                  <div className="text-[11px] font-mono text-slate-500 mb-1">
                    @{notif.senderSerial}
                  </div>

                  {/* Message Body */}
                  <p className="text-xs text-slate-600 leading-snug">
                    {notif.message}
                  </p>

                  {/* Inline Action for Requests */}
                  {isRequest && (
                    <div className="mt-3 flex items-center gap-2">
                      {isAlreadyAccepted ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Connected</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleDirectAccept(e, notif.requestId)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                      )}
                      <span className="text-[11px] text-indigo-600 font-semibold group-hover:underline flex items-center gap-0.5">
                        <span>View Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}

                  {!isRequest && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Messages Approved</span>
                      </span>
                      <span className="text-[11px] text-indigo-600 font-semibold group-hover:underline flex items-center gap-0.5">
                        <span>View Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
