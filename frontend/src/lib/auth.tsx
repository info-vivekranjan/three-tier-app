"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { UserInfo } from "./api";

interface AuthContextType {
  user: UserInfo | null;
  setUser: (u: UserInfo | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // AFTER ✅ - reads localStorage immediately during state initialisation
  const [user, setUserState] = useState<UserInfo | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("userInfo");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setUser = (u: UserInfo | null) => {
    setUserState(u);
    if (u) localStorage.setItem("userInfo", JSON.stringify(u));
    else localStorage.removeItem("userInfo");
  };

  const logout = () => {
    localStorage.clear();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
