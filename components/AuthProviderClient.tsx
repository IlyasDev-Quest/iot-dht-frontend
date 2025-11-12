"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/auth";
import {
  getCurrentUser,
  getUsers,
  registerUser,
  loginUser,
  logout as logoutStorage,
} from "@/lib/auth";

type AuthContextType = {
  currentUser: User | null;
  registering: boolean;
  registeringError?: string | null;
  register: (name: string, password: string, role: string) => Promise<{ ok: boolean; error?: string }>;
  login: (name: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  users: User[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registeringError, setRegisteringError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setUsers(getUsers());
  }, []);

  const register = async (name: string, password: string, role: string) => {
    setRegistering(true);
    setRegisteringError(null);
    try {
      const res = registerUser({ name, password, role });
      if (!res.ok) {
        setRegisteringError(res.error);
        setRegistering(false);
        return { ok: false, error: res.error };
      }
      setCurrentUser(res.user);
      setUsers(getUsers());
      setRegistering(false);
      return { ok: true };
    } catch (e: any) {
      setRegistering(false);
      setRegisteringError(e?.message ?? String(e));
      return { ok: false, error: e?.message ?? String(e) };
    }
  };

  const login = async (name: string, password: string) => {
    try {
      const res = loginUser(name, password);
      if (!res.ok) return { ok: false, error: res.error };
      setCurrentUser(res.user);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? String(e) };
    }
  };

  const logout = () => {
    logoutStorage();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, registering, registeringError, register, login, logout, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
