import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCurrentUser, logout as authLogout } from '../services/authService';
import type { DemoUser } from '../types';

interface AuthContextValue {
  user: DemoUser | null;
  loading: boolean;
  login: (user: DemoUser) => void;
  logout: () => void;
  isWorkerOrSupervisor: () => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  function login(u: DemoUser) {
    setUser(u);
  }

  function logout() {
    authLogout();
    setUser(null);
  }

  function isWorkerOrSupervisor() {
    return user?.role === 'worker' || user?.role === 'supervisor';
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isWorkerOrSupervisor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
