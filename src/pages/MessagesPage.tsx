import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, ChevronRight, CheckCircle2, Clock, Users, UserCheck } from 'lucide-react';
import { UserAccount } from '../types';
import { 
  searchUsersBySerial, 
  getConnectionStatus, 
  getApprovedMessagesContacts 
} from '../services/connectionService';
import { ProfileInnerPage } from '../components/ProfileInnerPage';

interface MessagesPageProps {
  currentUser: UserAccount | null;
  onBack: () => void;
  onViewUserProfile?: (targetUser: UserAccount) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  currentUser,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Keep approved contacts and connection state reactively updated
  useEffect(() => {
    const handleUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };
    window.addEventListener('typing_world_connection_updated', handleUpdate);
    return () => window.removeEventListener('typing_world_connection_updated', handleUpdate);
  }, []);

  // Approved contacts for Messages
  const approvedContacts = getApprovedMessagesContacts(currentUser?.email);

  // If a profile is selected, render the Profile Inner Page directly!
  if (selectedUser) {
    return (
      <ProfileInnerPage
        targetUser={selectedUser}
        currentUser={currentUser}
        onBack={() => {
          setSelectedUser(null);
          setRefreshKey(prev => prev + 1);
        }}
        onConnectionUpdated={() => {
          setRefreshKey(prev => prev + 1);
        }}
      />
    );
  }

  // Search results
  const searchResults = searchUsersBySerial(searchQuery, currentUser?.email);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-6 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-5 pb-24 select-none">
      
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
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Messages
          </h1>
        </div>
      </div>

      {/* 1. MESSAGES SEARCH BAR (Placeholder must be only "Search") */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* 2. SEARCH RESULTS (Active Search) */}
      {searchQuery.trim() !== '' ? (
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-500 px-1">
            Search Results ({searchResults.length})
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">No User Found</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No user matches "{searchQuery}". Check the User ID / Serial Number and try again.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map((user) => {
                const conn = currentUser ? getConnectionStatus(currentUser.email, user.email) : { status: 'none' as const, isMessagesApproved: false };

                return (
                  <button
                    key={`${user.email}_${refreshKey}`}
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className="w-full p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all text-left flex items-center justify-between group shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Actual User Profile Photo */}
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                      </div>

                      {/* Actual Username & Serial Number */}
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>@{user.serialNumber}</span>
                          {(conn.status === 'connected' || conn.isMessagesApproved) && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Messages Approved
                            </span>
                          )}
                          {conn.status === 'pending_sent' && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                              <Clock className="w-3 h-3" /> Requested
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2 shrink-0">
                      <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        <span>View</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Empty search state: Display Approved Messages Contacts & Guidance */
        <div className="space-y-4">
          
          {/* Approved Contacts Section (if any connected/approved users exist) */}
          {approvedContacts.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Approved for Messages ({approvedContacts.length})</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>

              <div className="space-y-2">
                {approvedContacts.map((contact) => (
                  <button
                    key={`${contact.email}_${refreshKey}`}
                    type="button"
                    onClick={() => setSelectedUser(contact)}
                    className="w-full p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-emerald-300 transition-all text-left flex items-center justify-between group shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                        {contact.avatarUrl ? (
                          <img
                            src={contact.avatarUrl}
                            alt={contact.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-sm">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          {contact.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>@{contact.serialNumber}</span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Messages Approved
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2 shrink-0">
                      <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        <span>Profile</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clean Guidance Box */}
          <div className="p-6 sm:p-7 bg-white rounded-3xl border border-slate-200 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Find Typists by User ID
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Enter any registered Serial Number (such as <span className="font-mono font-bold text-slate-700">M22-04</span>, <span className="font-mono font-bold text-slate-700">M22-05</span>, <span className="font-mono font-bold text-slate-700">M22-07</span>) to view their profile and connect.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
