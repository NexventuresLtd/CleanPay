import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from "../types";

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user and tokens from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTokens = localStorage.getItem("tokens");

    if (storedUser && storedTokens) {
      try {
        setUser(JSON.parse(storedUser));
        setTokens(JSON.parse(storedTokens));
      } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("tokens");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    const userData = response.user;
    const tokenData = { access: response.access, refresh: response.refresh };

    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tokens", JSON.stringify(tokenData));
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await authService.register(data);
    const userData = response.user;
    const tokenData = { access: response.access, refresh: response.refresh };

    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tokens", JSON.stringify(tokenData));
  }, []);

  const logout = useCallback(async () => {
    if (tokens?.refresh) {
      try {
        await authService.logout(tokens.refresh);
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  }, [tokens]);

  const refreshUser = useCallback(async () => {
    if (!tokens?.access) return;

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, [tokens]);

  const value: AuthContextType = {
    user,
    tokens,
    loading,
    isAuthenticated: !!user && !!tokens,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
