"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession, signOut, signIn, getSession } from "next-auth/react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  birthDate?: string;
  level: number;
  experience: number;
  currentDiamonds: number;
  totalDiamonds: number;
  dailyDiamonds: number;
  lastDailyReset: string;
  codeArenasCompleted: number;
  quizzesCompleted: number;
  codeSubmissionCount: number;
  loginStreak: number;
  maxLoginStreak: number;
  lastLoginDate?: string;
  isPremium: boolean;
  premiumExpiresAt?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (
    updates: Partial<User>
  ) => Promise<{ success: boolean; error?: string }>;
  // Gamification helpers
  getNextLevelXP: () => number;
  getXPProgress: () => number;
  canLevelUp: () => boolean;
  getDailyDiamondsRemaining: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { data: session, status } = useSession();

  // Handle hydration properly
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only process auth state after hydration is complete
    if (!isHydrated) {
      return;
    }

    try {
      if (status === "loading") {
        setLoading(true);
        return;
      }

      if (status === "authenticated" && session?.user) {
        setIsAuthenticated(true);
        setAuthError(null);

        // Safely extract user data with comprehensive null checks
        const sessionUser = session.user;
        const safeEmail = sessionUser?.email || "";
        const safeName = sessionUser?.name || "";
        const emailUsername = safeEmail ? safeEmail.split("@")[0] : "";

        // Create user object with maximum safety
        const safeUser: User = {
          id: sessionUser?.id || "",
          username: sessionUser?.username || emailUsername || "User",
          email: safeEmail,
          role: sessionUser?.role || "user",
          firstName: safeName ? safeName.split(" ")[0] : "",
          lastName: safeName ? safeName.split(" ").slice(1).join(" ") : "",
          avatar: sessionUser?.image || "",
          level: Number(sessionUser?.level) || 1,
          experience: Number(sessionUser?.experience) || 0,
          currentDiamonds: Number(sessionUser?.currentDiamonds) || 100,
          totalDiamonds: Number(sessionUser?.totalDiamonds) || 100,
          dailyDiamonds: 0,
          lastDailyReset: new Date().toISOString(),
          codeArenasCompleted:
            Number((sessionUser as any)?.codeArenasCompleted) || 0,
          quizzesCompleted: Number((sessionUser as any)?.quizzesCompleted) || 0,
          codeSubmissionCount: 0,
          loginStreak: Number(sessionUser?.loginStreak) || 1,
          maxLoginStreak: Number(sessionUser?.maxLoginStreak) || 1,
          lastLoginDate: new Date().toISOString(),
          isPremium: Boolean(sessionUser?.isPremium) || false,
          isActive: true,
          emailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(safeUser);
      } else {
        // status === "unauthenticated" or any other state
        setIsAuthenticated(false);
        setUser(null);
        setAuthError(null);
      }

      setLoading(false);
    } catch (error) {
      console.error("AuthContext processing error:", error);
      setAuthError("Failed to process authentication");
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  }, [session, status, isHydrated]);

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/users/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          setAuthError(null);
        }
      }
    } catch (error) {
      console.error("User refresh failed:", error);
      setAuthError("Failed to refresh user data");
    }
  };

  const updateProfile = async (
    updates: Partial<User>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Profile update failed" };
      }
    } catch (error) {
      return { success: false, error: "Connection error" };
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signIn("credentials", {
        usernameOrEmail: username,
        password: password,
        redirect: false,
      });

      if (result?.ok) {
        // Force session refresh
        const newSession = await getSession();
        if (newSession?.user) {
          setIsAuthenticated(true);
          setUser({
            id: newSession.user.id || "",
            username:
              newSession.user.username ||
              newSession.user.email?.split("@")[0] ||
              "User",
            email: newSession.user.email || "",
            role: newSession.user.role || "user",
            level: newSession.user.level || 1,
            experience: newSession.user.experience || 0,
            currentDiamonds: newSession.user.currentDiamonds || 100,
            totalDiamonds: newSession.user.totalDiamonds || 100,
            dailyDiamonds: 0,
            lastDailyReset: new Date().toISOString(),
            codeArenasCompleted:
              (newSession.user as any).codeArenasCompleted || 0,
            quizzesCompleted: (newSession.user as any).quizzesCompleted || 0,
            codeSubmissionCount: 0,
            loginStreak: newSession.user.loginStreak || 1,
            maxLoginStreak: newSession.user.maxLoginStreak || 1,
            lastLoginDate: new Date().toISOString(),
            isPremium: newSession.user.isPremium || false,
            isActive: true,
            emailVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        return { success: true };
      } else {
        return { success: false, error: result?.error || "Login failed" };
      }
    } catch (error) {
      return { success: false, error: "Connection error" };
    }
  };

  const logout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Auto-login after successful registration
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed" };
      }
    } catch (error) {
      return { success: false, error: "Connection error" };
    }
  };

  // Gamification helper functions
  const getNextLevelXP = (): number => {
    if (!user) return 0;
    // XP required for next level: level * 1000
    return user.level * 1000;
  };

  const getXPProgress = (): number => {
    if (!user) return 0;
    const currentLevelXP = (user.level - 1) * 1000;
    const nextLevelXP = user.level * 1000;
    const progressXP = user.experience - currentLevelXP;
    return Math.round((progressXP / (nextLevelXP - currentLevelXP)) * 100);
  };

  const canLevelUp = (): boolean => {
    if (!user) return false;
    return user.experience >= user.level * 1000;
  };

  const getDailyDiamondsRemaining = (): number => {
    if (!user) return 0;
    const today = new Date().toDateString();
    const lastReset = new Date(user.lastDailyReset).toDateString();

    if (today !== lastReset) {
      return 100; // Daily limit
    }

    return Math.max(0, 100 - user.dailyDiamonds);
  };

  // Don't render children until hydrated to prevent SSR mismatches
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        getNextLevelXP,
        getXPProgress,
        canLevelUp,
        getDailyDiamondsRemaining,
      }}
    >
      {authError && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          Auth Error: {authError}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
