import { UserAccount } from '../types';
import { getRegisteredUsers } from './authService';

export interface ConnectionRequest {
  id: string;
  fromUserEmail: string;
  fromUserName: string;
  fromUserSerial: string;
  fromUserAvatar?: string;
  toUserEmail: string;
  toUserName: string;
  toUserSerial: string;
  toUserAvatar?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  acceptedAt?: string;
}

export interface MessagesApprovalRecord {
  id: string;
  userAEmail: string;
  userBEmail: string;
  userAName: string;
  userBName: string;
  userASerial: string;
  userBSerial: string;
  userAAvatar?: string;
  userBAvatar?: string;
  approvedAt: string;
  status: 'approved';
}

export interface AppNotification {
  id: string;
  recipientEmail: string;
  type: 'request_received' | 'request_accepted';
  title: string;
  message: string;
  senderEmail: string;
  senderName: string;
  senderSerial: string;
  senderAvatar?: string;
  createdAt: string;
  isRead: boolean;
  requestId?: string;
}

export interface ConnectionStatusResult {
  status: 'none' | 'pending_sent' | 'pending_received' | 'connected';
  request?: ConnectionRequest;
  isMessagesApproved: boolean;
}

const REQUESTS_STORAGE_KEY = 'typing_world_connection_requests_v1';
const NOTIFICATIONS_STORAGE_KEY = 'typing_world_notifications_v1';
const MESSAGES_APPROVALS_STORAGE_KEY = 'typing_world_messages_approvals_v1';

// Initial preloaded connection request between Aarav (M22-04) and current user so there is immediate interactive demo capability
const INITIAL_DEMO_REQUEST: ConnectionRequest = {
  id: 'req_seed_aarav_eeswarappa_01',
  fromUserEmail: 'aarav.sharma@gmail.com',
  fromUserName: 'Aarav Sharma',
  fromUserSerial: 'M22-04',
  fromUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  toUserEmail: 'eeswarppa36@gmail.com',
  toUserName: 'Eeswarappa',
  toUserSerial: 'M22-01',
  toUserAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  status: 'pending',
  createdAt: '2026-10-06T06:30:00.000Z',
};

const INITIAL_DEMO_NOTIFICATION: AppNotification = {
  id: 'notif_seed_aarav_eeswarappa_01',
  recipientEmail: 'eeswarppa36@gmail.com',
  type: 'request_received',
  title: 'Connection Request',
  message: 'Aarav Sharma sent you a connection request.',
  senderEmail: 'aarav.sharma@gmail.com',
  senderName: 'Aarav Sharma',
  senderSerial: 'M22-04',
  senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  createdAt: '2026-10-06T06:30:00.000Z',
  isRead: false,
  requestId: 'req_seed_aarav_eeswarappa_01',
};

function sanitizeAvatar(avatar?: string): string | undefined {
  if (!avatar) return undefined;
  // If avatar is a large base64 data URL (> 1000 chars), omit it from storage objects.
  // The UI dynamically falls back to looking up the user's avatar.
  if (avatar.startsWith('data:') && avatar.length > 1000) {
    return undefined;
  }
  return avatar;
}

function getStoredRequests(): ConnectionRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) {
      const initial = [INITIAL_DEMO_REQUEST];
      saveStoredRequests(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [INITIAL_DEMO_REQUEST];
  }
}

function saveStoredRequests(reqs: ConnectionRequest[]): void {
  const cleaned: ConnectionRequest[] = (reqs || []).slice(0, 40).map(r => ({
    ...r,
    fromUserAvatar: sanitizeAvatar(r.fromUserAvatar),
    toUserAvatar: sanitizeAvatar(r.toUserAvatar),
  }));

  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    try {
      const stripped = cleaned.slice(0, 15).map(({ fromUserAvatar, toUserAvatar, ...rest }) => rest);
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(stripped));
    } catch {
      try {
        const minimal = cleaned.slice(0, 5).map(({ fromUserAvatar, toUserAvatar, ...rest }) => rest);
        localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(minimal));
      } catch {}
    }
  }
}

export function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      const initial = [INITIAL_DEMO_NOTIFICATION];
      saveStoredNotifications(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [INITIAL_DEMO_NOTIFICATION];
  }
}

function saveStoredNotifications(notifs: AppNotification[]): void {
  const cleaned: AppNotification[] = (notifs || []).slice(0, 40).map(n => ({
    ...n,
    senderAvatar: sanitizeAvatar(n.senderAvatar)
  }));

  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    // If quota exceeded, progressively prune to preserve space
    try {
      const stripped = cleaned.slice(0, 15).map(({ senderAvatar, ...rest }) => rest);
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(stripped));
    } catch {
      try {
        const minimal = cleaned.slice(0, 5).map(({ senderAvatar, ...rest }) => rest);
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(minimal));
      } catch {
        try {
          localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
        } catch {}
      }
    }
  }
}

export function getStoredMessagesApprovals(): MessagesApprovalRecord[] {
  try {
    const raw = localStorage.getItem(MESSAGES_APPROVALS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredMessagesApprovals(approvals: MessagesApprovalRecord[]): void {
  const cleaned: MessagesApprovalRecord[] = (approvals || []).slice(0, 40).map(a => ({
    ...a,
    userAAvatar: sanitizeAvatar(a.userAAvatar),
    userBAvatar: sanitizeAvatar(a.userBAvatar),
  }));

  try {
    localStorage.setItem(MESSAGES_APPROVALS_STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    try {
      const stripped = cleaned.slice(0, 15).map(({ userAAvatar, userBAvatar, ...rest }) => rest);
      localStorage.setItem(MESSAGES_APPROVALS_STORAGE_KEY, JSON.stringify(stripped));
    } catch {}
  }
}

/**
 * Checks whether User A and User B have active Messages approval.
 * - Before acceptance: returns FALSE.
 * - After acceptance: returns TRUE for BOTH users.
 * - Saved persistently so it remains active when either user logs in again.
 */
export function areUsersApprovedForMessages(emailA?: string, emailB?: string): boolean {
  if (!emailA || !emailB) return false;
  const a = emailA.toLowerCase();
  const b = emailB.toLowerCase();
  if (a === b) return false;

  // 1. Check dedicated messages approvals storage
  const approvals = getStoredMessagesApprovals();
  const hasApproval = approvals.some(ap =>
    (ap.userAEmail.toLowerCase() === a && ap.userBEmail.toLowerCase() === b) ||
    (ap.userAEmail.toLowerCase() === b && ap.userBEmail.toLowerCase() === a)
  );
  if (hasApproval) return true;

  // 2. Check accepted connection requests
  const requests = getStoredRequests();
  const hasAcceptedReq = requests.some(r =>
    r.status === 'accepted' &&
    ((r.fromUserEmail.toLowerCase() === a && r.toUserEmail.toLowerCase() === b) ||
     (r.fromUserEmail.toLowerCase() === b && r.toUserEmail.toLowerCase() === a))
  );

  return hasAcceptedReq;
}

/**
 * Returns all user accounts that currently have an active Messages approval with the given user.
 */
export function getApprovedMessagesContacts(userEmail?: string): UserAccount[] {
  if (!userEmail) return [];
  const cleanEmail = userEmail.toLowerCase();
  const allUsers = getRegisteredUsers();

  return allUsers.filter(u => {
    if (u.email.toLowerCase() === cleanEmail) return false;
    return areUsersApprovedForMessages(cleanEmail, u.email);
  });
}

/**
 * Searches users by Serial Number / User ID (primary) or username.
 */
export function searchUsersBySerial(query: string, currentEmail?: string): UserAccount[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const allUsers = getRegisteredUsers();
  
  return allUsers.filter(u => {
    if (currentEmail && u.email.toLowerCase() === currentEmail.toLowerCase()) {
      return false;
    }

    const serial = (u.serialNumber || '').toLowerCase();
    const serialClean = serial.replace(/[^a-z0-9]/g, '');
    const queryClean = clean.replace(/[^a-z0-9]/g, '');
    const name = (u.name || '').toLowerCase();

    // Exact or partial serial match
    if (serial.includes(clean) || serialClean.includes(queryClean)) {
      return true;
    }
    // Also match username or handle
    if (name.includes(clean)) {
      return true;
    }

    return false;
  });
}

/**
 * Find user specifically by Serial Number or Email
 */
export function findUserBySerialOrEmail(identifier: string): UserAccount | null {
  const clean = identifier.trim().toLowerCase();
  const allUsers = getRegisteredUsers();

  const found = allUsers.find(u => 
    (u.serialNumber && u.serialNumber.toLowerCase() === clean) ||
    (u.email && u.email.toLowerCase() === clean)
  );

  return found || null;
}

/**
 * Get current connection status and Messages approval between User A and User B
 */
export function getConnectionStatus(
  userAEmail: string,
  userBEmail: string
): ConnectionStatusResult {
  const a = userAEmail.toLowerCase();
  const b = userBEmail.toLowerCase();
  const allReqs = getStoredRequests();

  const isApproved = areUsersApprovedForMessages(a, b);

  // Check if either sent a request to the other
  const req = allReqs.find(r => 
    (r.fromUserEmail.toLowerCase() === a && r.toUserEmail.toLowerCase() === b) ||
    (r.fromUserEmail.toLowerCase() === b && r.toUserEmail.toLowerCase() === a)
  );

  if (!req) {
    return { 
      status: isApproved ? 'connected' : 'none', 
      isMessagesApproved: isApproved 
    };
  }

  if (req.status === 'accepted' || isApproved) {
    return { 
      status: 'connected', 
      request: req, 
      isMessagesApproved: true 
    };
  }

  if (req.status === 'pending') {
    if (req.fromUserEmail.toLowerCase() === a) {
      return { 
        status: 'pending_sent', 
        request: req, 
        isMessagesApproved: false 
      };
    } else {
      return { 
        status: 'pending_received', 
        request: req, 
        isMessagesApproved: false 
      };
    }
  }

  return { 
    status: 'none', 
    isMessagesApproved: false 
  };
}

/**
 * User A sends a connection request to User B
 */
export function sendConnectionRequest(
  fromUser: UserAccount,
  toUser: UserAccount
): { success: boolean; error?: string; request?: ConnectionRequest } {
  if (fromUser.email.toLowerCase() === toUser.email.toLowerCase()) {
    return { success: false, error: 'You cannot send a request to yourself.' };
  }

  const current = getConnectionStatus(fromUser.email, toUser.email);
  if (current.status === 'connected') {
    return { success: false, error: 'Already connected.' };
  }
  if (current.status === 'pending_sent') {
    return { success: false, error: 'Request is already pending.' };
  }
  if (current.status === 'pending_received') {
    // If other user already sent a request, auto-accept it!
    return acceptConnectionRequest(current.request!.id, fromUser);
  }

  const newReq: ConnectionRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fromUserEmail: fromUser.email,
    fromUserName: fromUser.name,
    fromUserSerial: fromUser.serialNumber,
    fromUserAvatar: fromUser.avatarUrl,
    toUserEmail: toUser.email,
    toUserName: toUser.name,
    toUserSerial: toUser.serialNumber,
    toUserAvatar: toUser.avatarUrl,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const reqs = getStoredRequests();
  reqs.unshift(newReq);
  saveStoredRequests(reqs);

  // Send request notification to User B
  const notif: AppNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    recipientEmail: toUser.email,
    type: 'request_received',
    title: 'Connection Request',
    message: `${fromUser.name} sent you a connection request.`,
    senderEmail: fromUser.email,
    senderName: fromUser.name,
    senderSerial: fromUser.serialNumber,
    senderAvatar: fromUser.avatarUrl,
    createdAt: new Date().toISOString(),
    isRead: false,
    requestId: newReq.id,
  };

  const allNotifs = getStoredNotifications();
  allNotifs.unshift(notif);
  saveStoredNotifications(allNotifs);

  // Dispatch broadcast event for immediate reactive UI updates
  try {
    window.dispatchEvent(new CustomEvent('typing_world_connection_updated', {
      detail: { type: 'request_sent', from: fromUser.email, to: toUser.email }
    }));
  } catch (e) {
    // Ignore event error
  }

  return { success: true, request: newReq };
}

/**
 * User B accepts User A's connection request:
 * 1. Mark request as Accepted.
 * 2. Immediately mark User A and User B as APPROVED/CONNECTED for Messages.
 * 3. Persist Messages Approval state for BOTH users across sessions.
 * 4. Send acceptance notification to User A with exact text: "Your request was accepted."
 * 5. Show User B's profile photo and username.
 */
export function acceptConnectionRequest(
  requestId: string,
  currentUser: UserAccount
): { success: boolean; error?: string } {
  const reqs = getStoredRequests();
  const reqIndex = reqs.findIndex(r => r.id === requestId);

  if (reqIndex === -1) {
    return { success: false, error: 'Request not found.' };
  }

  const req = reqs[reqIndex];
  req.status = 'accepted';
  req.acceptedAt = new Date().toISOString();
  saveStoredRequests(reqs);

  // 1. Immediately record Messages Approval for BOTH User A and User B
  const approvals = getStoredMessagesApprovals();
  const a = req.fromUserEmail.toLowerCase();
  const b = req.toUserEmail.toLowerCase();

  const existingIndex = approvals.findIndex(ap =>
    (ap.userAEmail.toLowerCase() === a && ap.userBEmail.toLowerCase() === b) ||
    (ap.userAEmail.toLowerCase() === b && ap.userBEmail.toLowerCase() === a)
  );

  const approvalRecord: MessagesApprovalRecord = {
    id: `appr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userAEmail: req.fromUserEmail,
    userBEmail: req.toUserEmail,
    userAName: req.fromUserName,
    userBName: currentUser.name || req.toUserName,
    userASerial: req.fromUserSerial,
    userBSerial: currentUser.serialNumber || req.toUserSerial,
    userAAvatar: req.fromUserAvatar,
    userBAvatar: currentUser.avatarUrl || req.toUserAvatar,
    approvedAt: new Date().toISOString(),
    status: 'approved',
  };

  if (existingIndex >= 0) {
    approvals[existingIndex] = approvalRecord;
  } else {
    approvals.unshift(approvalRecord);
  }
  saveStoredMessagesApprovals(approvals);

  // 2. Send acceptance notification to User A (the requester)
  // Text MUST clearly say: "Your request was accepted."
  // Shows User B's profile photo, username, and serial number.
  const notif: AppNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    recipientEmail: req.fromUserEmail,
    type: 'request_accepted',
    title: 'Request Accepted',
    message: 'Your request was accepted.',
    senderEmail: currentUser.email,
    senderName: currentUser.name || req.toUserName,
    senderSerial: currentUser.serialNumber || req.toUserSerial,
    senderAvatar: currentUser.avatarUrl || req.toUserAvatar,
    createdAt: new Date().toISOString(),
    isRead: false,
    requestId: req.id,
  };

  const allNotifs = getStoredNotifications();
  allNotifs.unshift(notif);
  saveStoredNotifications(allNotifs);

  // Dispatch broadcast event for immediate reactive UI updates
  try {
    window.dispatchEvent(new CustomEvent('typing_world_connection_updated', {
      detail: { 
        type: 'request_accepted', 
        from: req.fromUserEmail, 
        to: req.toUserEmail, 
        acceptedBy: currentUser.email 
      }
    }));
  } catch (e) {
    // Ignore event error
  }

  return { success: true };
}

/**
 * Get all notifications for the specified user
 */
export function getNotificationsForUser(userEmail: string): AppNotification[] {
  const email = userEmail.toLowerCase();
  const notifs = getStoredNotifications();
  return notifs.filter(n => n.recipientEmail.toLowerCase() === email);
}

/**
 * Count unread notifications for a user (used for the green dot indicator)
 */
export function getUnreadNotificationCount(userEmail: string): number {
  const notifs = getNotificationsForUser(userEmail);
  return notifs.filter(n => !n.isRead).length;
}

/**
 * Mark a single notification as read
 */
export function markNotificationAsRead(notificationId: string): void {
  const notifs = getStoredNotifications();
  const target = notifs.find(n => n.id === notificationId);
  if (target && !target.isRead) {
    target.isRead = true;
    saveStoredNotifications(notifs);
    try {
      window.dispatchEvent(new CustomEvent('typing_world_connection_updated', {
        detail: { type: 'notification_read', id: notificationId }
      }));
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Mark all notifications as read for a user
 */
export function markAllNotificationsAsRead(userEmail: string): void {
  const email = userEmail.toLowerCase();
  const notifs = getStoredNotifications();
  let changed = false;
  for (const n of notifs) {
    if (n.recipientEmail.toLowerCase() === email && !n.isRead) {
      n.isRead = true;
      changed = true;
    }
  }
  if (changed) {
    saveStoredNotifications(notifs);
    try {
      window.dispatchEvent(new CustomEvent('typing_world_connection_updated', {
        detail: { type: 'all_notifications_read', email: userEmail }
      }));
    } catch (e) {
      // Ignore
    }
  }
}
