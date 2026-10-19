"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  getIdToken: () => Promise<string | null>;
  demoLogin: () => void;
  isDemoUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  useEffect(() => {
    // Check if demo user was active in local session
    const savedDemo = typeof window !== "undefined" ? localStorage.getItem("demo_auth_active") : null;
    if (savedDemo === "true") {
      setIsDemoUser(true);
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsDemoUser(false);
          if (typeof window !== "undefined") localStorage.removeItem("demo_auth_active");
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firebase auth state listener error:", err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatAuthError = (err: any): string => {
    const code = err?.code || "";
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password. Please verify your credentials.";
      case "auth/email-already-in-use":
        return "An account with this email address already exists.";
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed login attempts. Please wait a few minutes before trying again.";
      case "auth/network-request-failed":
        return "Network connection error. Please check your internet connection.";
      default:
        return err?.message || "An authentication error occurred. Please try again.";
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      setUser(res.user);
      setIsDemoUser(false);
      if (typeof window !== "undefined") localStorage.removeItem("demo_auth_active");
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(formatAuthError(err));
      setLoading(false);
      return false;
    }
  };

  const signup = async (email: string, pass: string, name: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim()) {
        await updateProfile(res.user, { displayName: name.trim() });
      }
      setUser(res.user);
      setIsDemoUser(false);
      if (typeof window !== "undefined") localStorage.removeItem("demo_auth_active");
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(formatAuthError(err));
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      if (user) {
        await signOut(auth);
      }
      setUser(null);
      setIsDemoUser(false);
      if (typeof window !== "undefined") localStorage.removeItem("demo_auth_active");
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        success: true,
        message: "Password reset link sent to your email address.",
      };
    } catch (err: any) {
      const msg = formatAuthError(err);
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (user) {
      return await user.getIdToken();
    }
    return null;
  };

  const demoLogin = () => {
    setIsDemoUser(true);
    if (typeof window !== "undefined") localStorage.setItem("demo_auth_active", "true");
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        clearError,
        login,
        signup,
        logout,
        resetPassword,
        getIdToken,
        demoLogin,
        isDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
