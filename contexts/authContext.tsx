"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  login as loginService,
  logout as logoutService,
} from "@/services/authService";
import { getCurrentUser } from "@/services/userService";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    const result = await loginService({ email, password });

    if (result.success) {
      // After successful login, fetch user data
      const userResult = await getCurrentUser();

      if (userResult.success && userResult.user) {
        setUser(userResult.user);
      }
    }

    return result;
  };

  const logout = async (): Promise<void> => {
    await logoutService();
    setUser(null);
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const result = await getCurrentUser();

      if (result.success && result.user) {
        setUser(result.user);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
