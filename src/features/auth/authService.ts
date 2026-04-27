import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, firebaseEnabled } from '@/services/firebase';
import type { AppUser } from '@/types';

const DEMO_USER: AppUser = {
  uid: 'demo-001',
  email: 'demo@medicore.app',
  displayName: 'Dr. Demo User',
  role: 'doctor',
  photoURL: null,
};

const DEMO_PASSWORD = 'demo1234';
const STORAGE_KEY = 'medicore.session';

function mapFirebaseUser(u: FirebaseUser): AppUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName ?? (u.email ? u.email.split('@')[0] : 'Clinician'),
    role: 'doctor',
    photoURL: u.photoURL,
  };
}

export async function login(email: string, password: string): Promise<AppUser> {
  if (firebaseEnabled && auth) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(cred.user);
  }

  // DEMO fallback — local-only mock auth so the app runs without Firebase.
  await new Promise((r) => setTimeout(r, 600));
  if (email !== DEMO_USER.email || password !== DEMO_PASSWORD) {
    throw new Error('Invalid email or password.');
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
  return DEMO_USER;
}

export async function logout(): Promise<void> {
  if (firebaseEnabled && auth) {
    await fbSignOut(auth);
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Subscribes to auth state changes. Returns an unsubscribe function.
 * In DEMO mode, dispatches the cached user from localStorage exactly once.
 */
export function subscribeToAuth(cb: (user: AppUser | null) => void): () => void {
  if (firebaseEnabled && auth) {
    return onAuthStateChanged(auth, (u) => {
      cb(u ? mapFirebaseUser(u) : null);
    });
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  cb(raw ? (JSON.parse(raw) as AppUser) : null);
  return () => {};
}

export const demoCredentials = {
  email: DEMO_USER.email!,
  password: DEMO_PASSWORD,
};
