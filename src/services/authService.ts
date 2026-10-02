// =============================================================================
// AUTHENTICATION SERVICE — Demo session management
// IMPORTANT: Credentials are hardcoded for demonstration only.
// Replace with a real authentication backend before deployment.
// =============================================================================

import type { DemoSession, DemoUser } from '../types';
import { DEMO_CREDENTIALS } from '../data/demoUsers';

const SESSION_KEY = 'anganwadi_session_v1';
const SESSION_DURATION_HOURS = 8;

export interface AuthResult {
  success: boolean;
  user?: DemoUser;
  error?: string;
}

export function login(email: string, password: string): AuthResult {
  const match = DEMO_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );

  if (!match) {
    return { success: false, error: 'Invalid email or password. Please check your demo credentials.' };
  }

  const session: DemoSession = {
    user: match.user,
    loginTime: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000).toISOString(),
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    return { success: false, error: 'Unable to save session. Please check browser storage settings.' };
  }

  return { success: true, user: match.user };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: DemoSession = JSON.parse(raw);
    if (new Date(session.expiresAt) < new Date()) {
      logout();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getCurrentUser(): DemoUser | null {
  return getSession()?.user ?? null;
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
