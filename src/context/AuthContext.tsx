import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "lms_auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    username: null,
    role: null,
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: AuthState = JSON.parse(raw);
        setState(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const persist = (s: AuthState) => {
    setState(s);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  };

  const login = (token: string, username: string, role: string) => {
    persist({ token, username, role });
  };

  const logout = () => {
    persist({ token: null, username: null, role: null });
  };

  const value: AuthContextValue = {
    ...state,
    isAuthenticated: !!state.token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
