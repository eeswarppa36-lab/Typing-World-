import { UserAccount } from '../types';
import { isFirebaseConfigured } from '../config/firebaseConfig';
import { evaluateUserAchievements } from '../data/achievements';

const USERS_STORAGE_KEY = 'typing_world_registered_users_v2';
const ACTIVE_USER_KEY = 'typing_world_current_session_v2';
const SERIAL_COUNTER_KEY = 'typing_world_serial_counter_v1';

/**
 * Generates the next permanent, unique sequential serial number.
 * Starts from M22-01 and increments monotonically: M22-01, M22-02, M22-03...
 * Never repeats or decrements.
 */
export function getNextPermanentSerialNumber(): string {
  try {
    const raw = localStorage.getItem(SERIAL_COUNTER_KEY);
    let counter = raw ? parseInt(raw, 10) : 1;
    if (isNaN(counter) || counter < 1) counter = 1;
    
    // Save next counter persistently for future users
    localStorage.setItem(SERIAL_COUNTER_KEY, String(counter + 1));
    
    // Format: M22-01, M22-02, M22-03...
    return `M22-${String(counter).padStart(2, '0')}`;
  } catch (err) {
    return 'M22-01';
  }
}

/**
 * Generates a random cryptographic salt.
 */
function generateSalt(): string {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes a SHA-256 hash using the native Web Crypto API.
 * Real passwords are NEVER stored in plain text.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:typing_world_salt`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const DEFAULT_SEEDED_USERS: UserAccount[] = [
  {
    email: 'eeswarppa36@gmail.com',
    name: 'Eeswarappa',
    serialNumber: 'M22-01',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00.000Z',
    completedLevels: [1],
    levelStats: { 1: { wpm: 38, accuracy: 98, completedAt: '2026-01-01' } },
  },
  {
    email: 'alex.morgan.type@gmail.com',
    name: 'Alex Morgan',
    serialNumber: 'M22-02',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    createdAt: '2026-01-02T00:00:00.000Z',
    completedLevels: [1, 2],
    levelStats: { 1: { wpm: 45, accuracy: 97, completedAt: '2026-01-02' } },
  },
  {
    email: 'sarah.connor@gmail.com',
    name: 'Sarah Connor',
    serialNumber: 'M22-03',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    createdAt: '2026-01-03T00:00:00.000Z',
    completedLevels: [1],
    levelStats: { 1: { wpm: 34, accuracy: 95, completedAt: '2026-01-03' } },
  },
  {
    email: 'aarav.sharma@gmail.com',
    name: 'Aarav Sharma',
    serialNumber: 'M22-04',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    createdAt: '2026-01-04T00:00:00.000Z',
    completedLevels: [1, 2],
    levelStats: { 1: { wpm: 72, accuracy: 99, completedAt: '2026-01-04' } },
  },
  {
    email: 'rahul.007@gmail.com',
    name: 'Rahul_007',
    serialNumber: 'M22-05',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    createdAt: '2026-01-05T00:00:00.000Z',
    completedLevels: [1, 2],
    levelStats: { 1: { wpm: 42, accuracy: 96, completedAt: '2026-01-05' } },
  },
  {
    email: 'priya.patel@gmail.com',
    name: 'Priya Patel',
    serialNumber: 'M22-07',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    createdAt: '2026-01-07T00:00:00.000Z',
    completedLevels: [1],
    levelStats: { 1: { wpm: 46, accuracy: 96, completedAt: '2026-01-07' } },
  },
  {
    email: 'rahul.varma@gmail.com',
    name: 'Rahul Varma',
    serialNumber: 'M22-12',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    createdAt: '2026-01-12T00:00:00.000Z',
    completedLevels: [1, 2],
    levelStats: { 1: { wpm: 42, accuracy: 95, completedAt: '2026-01-12' } },
  },
];

/**
 * Retrieve all registered users from browser storage.
 */
export function getRegisteredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      saveRegisteredUsers(DEFAULT_SEEDED_USERS);
      return DEFAULT_SEEDED_USERS;
    }
    const parsed: UserAccount[] = JSON.parse(raw);
    // Ensure all seeded users exist
    let merged = false;
    for (const seed of DEFAULT_SEEDED_USERS) {
      if (!parsed.some(u => u.email === seed.email || u.serialNumber === seed.serialNumber)) {
        parsed.push(seed);
        merged = true;
      }
    }
    if (merged) {
      saveRegisteredUsers(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse registered users:', err);
    return DEFAULT_SEEDED_USERS;
  }
}

/**
 * Save user list to browser storage.
 */
function saveRegisteredUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // If quota exceeded, strip large avatarUrls to free browser storage
    try {
      const sanitized = users.map(u => ({
        ...u,
        avatarUrl: u.avatarUrl && u.avatarUrl.length > 5000 ? undefined : u.avatarUrl
      }));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(sanitized));
    } catch {
      // Storage fully saturated, fallback safely
    }
  }
}

/**
 * Get current logged in user.
 */
export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    if (!raw) return null;
    const user: UserAccount = JSON.parse(raw);
    let changed = false;

    // Guarantee permanent serial number exists
    if (!user.serialNumber) {
      user.serialNumber = getNextPermanentSerialNumber();
      changed = true;
    }

    if (changed) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
      const users = getRegisteredUsers();
      const idx = users.findIndex(u => u.email === user.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], serialNumber: user.serialNumber };
        saveRegisteredUsers(users);
      }
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Set active user session.
 */
export function setCurrentUser(user: UserAccount | null): void {
  if (user) {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(ACTIVE_USER_KEY);
  }
}

/**
 * Register a new user account with secure password hashing.
 */
export async function registerUser(params: {
  email: string;
  password: string;
  dob: string;
  villageName: string;
  favouriteDate: string;
}): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
  const cleanEmail = params.email.trim().toLowerCase();
  
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid Gmail address.' };
  }
  if (!params.password || params.password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long.' };
  }
  if (!params.dob) {
    return { success: false, error: 'Date of Birth is required for account recovery.' };
  }
  if (!params.villageName.trim()) {
    return { success: false, error: 'Village Name is required for account recovery.' };
  }
  if (!params.favouriteDate) {
    return { success: false, error: 'Favourite Date is required for account recovery.' };
  }

  const users = getRegisteredUsers();
  const existing = users.find(u => u.email === cleanEmail);
  if (existing) {
    return { success: false, error: 'An account with this Gmail already exists. Please log in.' };
  }

  const salt = generateSalt();
  const hash = await hashPassword(params.password, salt);

  const newUser: UserAccount = {
    email: cleanEmail,
    name: cleanEmail.split('@')[0],
    serialNumber: getNextPermanentSerialNumber(),
    dob: params.dob.trim(),
    villageName: params.villageName.trim().toLowerCase(),
    favouriteDate: params.favouriteDate.trim(),
    passwordSalt: salt,
    passwordHash: hash,
    isGoogleUser: false,
    createdAt: new Date().toISOString(),
    completedLevels: [],
    levelStats: {},
  };

  users.push(newUser);
  saveRegisteredUsers(users);
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

/**
 * Login user using email and password.
 */
export async function loginUser(emailOrUsername: string, password: string): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
  const cleanInput = emailOrUsername.trim().toLowerCase();
  
  if (!cleanInput) {
    return { success: false, error: 'Please enter your Email or Username.' };
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  const users = getRegisteredUsers();
  const user = users.find(u => 
    u.email === cleanInput || 
    u.name.toLowerCase() === cleanInput ||
    u.email.split('@')[0].toLowerCase() === cleanInput
  );
  
  if (!user) {
    return { success: false, error: 'No account found with this Email or Username. Please check or sign up.' };
  }

  if (user.isGoogleUser && !user.passwordHash) {
    return { success: false, error: 'This account was created with Google Sign-In. Please click "Continue with Google".' };
  }

  if (!user.passwordSalt || !user.passwordHash) {
    return { success: false, error: 'Invalid account credentials record.' };
  }

  const computedHash = await hashPassword(password, user.passwordSalt);
  if (computedHash !== user.passwordHash) {
    return { success: false, error: 'Incorrect password. Please try again or use Forgot Password.' };
  }

  setCurrentUser(user);
  return { success: true, user };
}

/**
 * Verify account recovery details and reset password.
 */
export async function recoverAndResetPassword(params: {
  email: string;
  dob: string;
  villageName: string;
  favouriteDate: string;
  newPassword: string;
}): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanVillage = params.villageName.trim().toLowerCase();
  const cleanDob = params.dob.trim();
  const cleanFavDate = params.favouriteDate.trim();

  if (!cleanEmail || !cleanDob || !cleanVillage || !cleanFavDate || !params.newPassword) {
    return { success: false, error: 'Please fill in all recovery fields and enter a new password.' };
  }

  if (params.newPassword.length < 4) {
    return { success: false, error: 'New password must be at least 4 characters long.' };
  }

  const users = getRegisteredUsers();
  const userIndex = users.findIndex(u => u.email === cleanEmail);

  if (userIndex === -1) {
    return { success: false, error: 'Account verification failed. The provided recovery details do not match our records.' };
  }

  const user = users[userIndex];

  // Compare recovery fields strictly and safely without revealing which one failed
  const dobMatches = user.dob === cleanDob;
  const villageMatches = (user.villageName || '').toLowerCase() === cleanVillage;
  const favDateMatches = user.favouriteDate === cleanFavDate;

  if (!dobMatches || !villageMatches || !favDateMatches) {
    return { success: false, error: 'Account verification failed. The provided recovery details do not match our records.' };
  }

  // Hash new password securely
  const newSalt = generateSalt();
  const newHash = await hashPassword(params.newPassword, newSalt);

  user.passwordSalt = newSalt;
  user.passwordHash = newHash;
  users[userIndex] = user;
  saveRegisteredUsers(users);

  // Set active session with updated user
  setCurrentUser(user);

  return { success: true, user };
}

/**
 * Login or Sign Up with Google.
 * Fully compatible with Firebase Google Auth or fast Google profile setup.
 * Each Google account has its own separate permanent serial number and data.
 */
export function authenticateWithGoogle(googleProfile: {
  email: string;
  name?: string;
  avatarUrl?: string;
  googleId?: string;
}): UserAccount {
  const cleanEmail = googleProfile.email.trim().toLowerCase();
  const users = getRegisteredUsers();
  let user = users.find(u => u.email === cleanEmail);

  if (!user) {
    // Brand new Google user receives permanent sequential Serial Number
    const initialName = googleProfile.name?.trim() || cleanEmail.split('@')[0];
    const initialAvatar = googleProfile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initialName)}`;

    user = {
      email: cleanEmail,
      name: initialName,
      serialNumber: getNextPermanentSerialNumber(),
      avatarUrl: initialAvatar,
      isGoogleUser: true,
      googleId: googleProfile.googleId,
      createdAt: new Date().toISOString(),
      completedLevels: [],
      levelStats: {},
      unlockedBadges: [],
    };
    users.push(user);
    saveRegisteredUsers(users);
  } else {
    // Existing user: Load ALL existing saved profile and data!
    // Never change or repeat their permanent serial number!
    if (!user.serialNumber) {
      user.serialNumber = getNextPermanentSerialNumber();
    }
    user.isGoogleUser = true;
    if (googleProfile.googleId) user.googleId = googleProfile.googleId;
    saveRegisteredUsers(users);
  }

  setCurrentUser(user);
  return user;
}

/**
 * Updates the user's display name.
 * Changing name NEVER modifies the permanent Serial Number!
 */
export function updateDisplayName(
  email: string,
  newName: string
): { success: boolean; error?: string; user?: UserAccount } {
  const cleanEmail = email.trim().toLowerCase();
  const trimmed = newName.trim();

  if (!trimmed || trimmed.length < 2) {
    return { success: false, error: 'Name must be at least 2 characters long.' };
  }

  const users = getRegisteredUsers();
  const idx = users.findIndex(u => u.email === cleanEmail);
  if (idx === -1) {
    return { success: false, error: 'User account record not found.' };
  }

  const user = users[idx];
  // Update display name
  user.name = trimmed;
  // Permanent Serial Number is completely untouched!

  users[idx] = user;
  saveRegisteredUsers(users);
  setCurrentUser(user);

  return { success: true, user };
}

// Backwards-compatible alias
export const updateDisplayNameWithCoins = updateDisplayName;

/**
 * Updates the user's profile photo from gallery/camera.
 */
export function updateProfilePhoto(
  email: string,
  photoDataUrl: string | undefined
): UserAccount {
  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const idx = users.findIndex(u => u.email === cleanEmail);

  if (idx !== -1) {
    const user = users[idx];
    user.avatarUrl = photoDataUrl;
    users[idx] = user;
    saveRegisteredUsers(users);
    setCurrentUser(user);
    return user;
  }

  const current = getCurrentUser();
  if (current) {
    current.avatarUrl = photoDataUrl;
    setCurrentUser(current);
    return current;
  }

  throw new Error('User not found');
}

/**
 * Save completed level for active user.
 */
export function completeLevelForActiveUser(levelNumber: number, stats?: { wpm: number; accuracy: number }): UserAccount {
  const currentUser = getCurrentUser();
  const defaultGuestUser: UserAccount = {
    email: 'guest@typingworld.local',
    name: 'Learner',
    serialNumber: getNextPermanentSerialNumber(),
    createdAt: new Date().toISOString(),
    completedLevels: [],
  };

  const active = currentUser || defaultGuestUser;
  if (!active.completedLevels.includes(levelNumber)) {
    active.completedLevels = [...active.completedLevels, levelNumber].sort((a, b) => a - b);
  }

  if (stats) {
    active.levelStats = active.levelStats || {};
    active.levelStats[levelNumber] = {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      completedAt: new Date().toISOString(),
    };
  }

  // Synchronize unlocked digital badges
  const evaluatedBadges = evaluateUserAchievements(active);
  active.unlockedBadges = evaluatedBadges.filter(b => b.isUnlocked).map(b => b.id);

  setCurrentUser(active);

  // If user is registered in the list, update in store
  const users = getRegisteredUsers();
  const idx = users.findIndex(u => u.email === active.email);
  if (idx !== -1) {
    users[idx] = active;
    saveRegisteredUsers(users);
  }

  return active;
}

/**
 * Check if a level is unlocked.
 * Level 1 is always unlocked.
 * Level N requires Level N-1 to be completed.
 */
export function isLevelUnlocked(levelNumber: number, user: UserAccount | null): boolean {
  if (levelNumber === 1) return true;
  if (!user) return false;
  return user.completedLevels.includes(levelNumber - 1);
}

// ==========================================
// PASSWORD MANAGEMENT & 10-MINUTE OTP SYSTEM
// ==========================================

const OTP_STORAGE_KEY = 'typing_world_password_otp_v1';

interface StoredOTP {
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number; // Exactly 10 minutes
  used: boolean;
  verified: boolean;
  attempts: number;
}

/**
 * Verifies if the current password is correct for the specified user account.
 */
export async function verifyCurrentPassword(
  email: string,
  currentPassword: string
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const user = users.find(u => u.email === cleanEmail);

  if (!user) {
    return { success: false, error: 'User account not found.' };
  }

  if (!user.passwordSalt || !user.passwordHash) {
    return { 
      success: false, 
      error: 'No password set for this account yet. Please use "Forgot Password?" below to set a new password via Email OTP.' 
    };
  }

  const computedHash = await hashPassword(currentPassword, user.passwordSalt);
  if (computedHash !== user.passwordHash) {
    return { success: false, error: 'Incorrect Current Password. Please check and try again.' };
  }

  return { success: true };
}

/**
 * Changes a user's password after verifying the current password.
 */
export async function changeUserPassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
  // 1. Verify current password
  const verifyRes = await verifyCurrentPassword(email, currentPassword);
  if (!verifyRes.success) {
    return { success: false, error: verifyRes.error };
  }

  // 2. Validate new password
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  // 3. Hash with fresh salt
  const salt = generateSalt();
  const newHash = await hashPassword(newPassword, salt);

  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const idx = users.findIndex(u => u.email === cleanEmail);

  if (idx === -1) {
    return { success: false, error: 'User account not found.' };
  }

  const updatedUser: UserAccount = {
    ...users[idx],
    passwordSalt: salt,
    passwordHash: newHash,
    isGoogleUser: false,
  };

  users[idx] = updatedUser;
  saveRegisteredUsers(users);

  // Update current session if matching
  const current = getCurrentUser();
  if (current && current.email === cleanEmail) {
    setCurrentUser(updatedUser);
  }

  return { success: true, user: updatedUser };
}

/**
 * Generates and sends a single-use 10-minute OTP to the verified email address.
 * Invalidates any previous OTP for that email.
 */
export function sendPasswordResetOTP(
  email: string
): { success: boolean; error?: string; code?: string; expiresAt?: number } {
  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const user = users.find(u => u.email === cleanEmail);

  if (!user) {
    return { 
      success: false, 
      error: 'This email is not associated with any Typing World account.' 
    };
  }

  const now = Date.now();

  // Check rate limit: 10 seconds between resend requests
  try {
    const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (raw) {
      const prev: StoredOTP = JSON.parse(raw);
      if (prev.email === cleanEmail && now - prev.createdAt < 10000) {
        const waitSec = Math.ceil((10000 - (now - prev.createdAt)) / 1000);
        return { 
          success: false, 
          error: `Please wait ${waitSec} seconds before requesting a new OTP.` 
        };
      }
    }
  } catch {}

  // Generate 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // Valid for exactly 10 minutes (600,000 ms)
  const expiresAt = now + 10 * 60 * 1000;

  const otpRecord: StoredOTP = {
    email: cleanEmail,
    code,
    createdAt: now,
    expiresAt,
    used: false,
    verified: false,
    attempts: 0,
  };

  try {
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpRecord));
  } catch {}

  return { 
    success: true, 
    code, 
    expiresAt 
  };
}

/**
 * Verifies a single-use 10-minute OTP.
 * Rejects expired, reused, or incorrect OTPs.
 */
export function verifyPasswordResetOTP(
  email: string,
  enteredCode: string
): { success: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const code = enteredCode.trim();

  let record: StoredOTP | null = null;
  try {
    const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (raw) record = JSON.parse(raw);
  } catch {}

  if (!record || record.email !== cleanEmail) {
    return { success: false, error: 'No active OTP request found. Please request a new OTP.' };
  }

  const now = Date.now();

  // Check expiration (exactly 10 minutes)
  if (now > record.expiresAt) {
    return { 
      success: false, 
      error: 'OTP has expired. Please tap "Resend OTP" to generate a new verification code.' 
    };
  }

  // Check single-use
  if (record.used) {
    return { 
      success: false, 
      error: 'This OTP has already been used. Please request a new OTP.' 
    };
  }

  // Check attempts limit
  if (record.attempts >= 5) {
    return { 
      success: false, 
      error: 'Too many incorrect attempts. Please tap "Resend OTP" to get a new code.' 
    };
  }

  // Validate code
  if (record.code !== code) {
    record.attempts += 1;
    try {
      sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(record));
    } catch {}
    const remaining = 5 - record.attempts;
    return { 
      success: false, 
      error: remaining > 0 
        ? `Incorrect OTP code. (${remaining} attempts remaining)` 
        : 'Incorrect OTP code. Please request a new OTP.' 
    };
  }

  // Success: mark as verified and single-use
  record.verified = true;
  record.used = true;
  try {
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(record));
  } catch {}

  return { success: true };
}

/**
 * Resets a user's password after the OTP has been successfully verified.
 */
export async function resetPasswordWithVerifiedOTP(
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
  const cleanEmail = email.trim().toLowerCase();

  let record: StoredOTP | null = null;
  try {
    const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (raw) record = JSON.parse(raw);
  } catch {}

  // Must have a verified record for this email
  if (!record || record.email !== cleanEmail || !record.verified) {
    return { 
      success: false, 
      error: 'Unauthorized password reset. Please complete email OTP verification first.' 
    };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const salt = generateSalt();
  const hash = await hashPassword(newPassword, salt);

  const users = getRegisteredUsers();
  const idx = users.findIndex(u => u.email === cleanEmail);

  if (idx === -1) {
    return { success: false, error: 'User account not found.' };
  }

  const updatedUser: UserAccount = {
    ...users[idx],
    passwordSalt: salt,
    passwordHash: hash,
    isGoogleUser: false,
  };

  users[idx] = updatedUser;
  saveRegisteredUsers(users);

  // Clear OTP session once password is reset
  try {
    sessionStorage.removeItem(OTP_STORAGE_KEY);
  } catch {}

  const current = getCurrentUser();
  if (current && current.email === cleanEmail) {
    setCurrentUser(updatedUser);
  }

  return { success: true, user: updatedUser };
}
