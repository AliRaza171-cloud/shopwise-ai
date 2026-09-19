"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User, SignupPayload, LoginPayload } from "@/types/auth";
import * as authApi from "@/services/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean; // true while we check for an existing session on first load
  signup: (payload: SignupPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (updated: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "sahi_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On first load, if a token is already in localStorage (from a previous
  // session), try to fetch the current user so refreshing the page doesn't
  // log you out.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .fetchCurrentUser()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  function handleSuccess(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
    router.push("/dashboard");
  }

  async function signup(payload: SignupPayload) {
    const res = await authApi.signup(payload);
    handleSuccess(res.access_token, res.user);
  }

  async function login(payload: LoginPayload) {
    const res = await authApi.login(payload);
    handleSuccess(res.access_token, res.user);
  }

  async function loginWithGoogle(idToken: string) {
    const res = await authApi.loginWithGoogle(idToken);
    handleSuccess(res.access_token, res.user);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push("/");
  }

  function updateUser(updated: User) {
    setUser(updated);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, loginWithGoogle, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
