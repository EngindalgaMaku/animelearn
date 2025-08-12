"use client";

import { useState, useEffect } from "react";
import {
  User,
  Diamond,
  Star,
  Trophy,
  BookOpen,
  Brain,
  Calendar,
  TrendingUp,
  Award,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Key,
  UserCheck,
  Eye,
  EyeOff,
  Shield,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Settings,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  level: number;
  experience: number;
  xpProgress: number;
  nextLevelXp: number;
  currentLevelXp: number;
  currentDiamonds: number;
  totalDiamonds: number;
  dailyDiamonds: number;
  dailyLimit: number;
  canEarnDiamonds: boolean;
  isPremium: boolean;
  premiumExpiresAt?: string;
  stats: {
    totalCards: number;
    totalCardValue: number;
    completedLessons: number;
    completedQuizzes: number;
    codeSubmissions: number;
    currentStreak: number;
    maxStreak: number;
    totalBadges: number;
  };
  questCompletionRate: number;
  recentTransactions: Array<{
    id: string;
    amount: number;
    type: string;
    description: string;
    createdAt: string;
  }>;
  recentBadges: Array<{
    id: string;
    name: string;
    title: string;
    icon: string;
    rarity: string;
    earnedAt: string;
  }>;
  createdAt: string;
  lastLoginDate?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    avatar: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [usernameForm, setUsernameForm] = useState({
    newUsername: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Transaction pagination
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const [transactionFilter, setTransactionFilter] = useState("all");
  const transactionsPerPage = 5;

  const { isAuthenticated, user, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.user);
          setEditForm({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            bio: data.user.bio || "",
            avatar: data.user.avatar || "",
          });
        }
      }
    } catch (error) {
      console.error("Profile fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile({ ...profile!, ...data.user });
          setEditing(false);
          refreshUser();
        }
      }
    } catch (error) {
      console.error("Profile save failed:", error);
    }
  };

  const cancelEdit = () => {
    setEditForm({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      bio: profile?.bio || "",
      avatar: profile?.avatar || "",
    });
    setEditing(false);
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters!");
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType: "change_password",
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
      } else {
        alert(data.error || "Password could not be changed!");
      }
    } catch (error) {
      console.error("Password change failed:", error);
      alert("An error occurred while changing password!");
    } finally {
      setUpdating(false);
    }
  };

  const handleUsernameChange = async () => {
    if (usernameForm.newUsername.length < 3) {
      alert("Username must be at least 3 characters!");
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType: "change_username",
          username: usernameForm.newUsername,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Username changed successfully!");
        setProfile({ ...profile!, username: data.user.username });
        setUsernameForm({ newUsername: "" });
        setShowUsernameForm(false);
        refreshUser();
      } else {
        alert(data.error || "Username could not be changed!");
      }
    } catch (error) {
      console.error("Username change failed:", error);
      alert("An error occurred while changing username!");
    } finally {
      setUpdating(false);
    }
  };

  // Transaction filtering and pagination
  const getFilteredTransactions = () => {
    if (!profile) return [];

    const filtered = profile.recentTransactions.filter((transaction) => {
      if (transactionFilter === "all") return true;
      if (transactionFilter === "earnings" && transaction.amount > 0)
        return true;
      if (transactionFilter === "spendings" && transaction.amount < 0)
        return true;
      return false;
    });

    return filtered;
  };

  const getPaginatedTransactions = () => {
    const filtered = getFilteredTransactions();
    const startIndex = (currentTransactionPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalTransactionPages = () => {
    const filtered = getFilteredTransactions();
    return Math.ceil(filtered.length / transactionsPerPage);
  };

  const getTransactionIcon = (type: string) => {
    if (type.includes("COMPLETE") || type.includes("LEVEL"))
      return <Trophy className="h-4 w-4" />;
    if (type.includes("PURCHASE"))
      return <ArrowDownRight className="h-4 w-4" />;
    if (type.includes("REWARD")) return <ArrowUpRight className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getTransactionTypeColor = (amount: number) => {
    return amount > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <User className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-medium text-gray-900">
            Profile Not Found
          </h3>
          <p className="text-gray-600">
            Your profile information could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <header className="border-b border-white/20 bg-white/60 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 shadow-lg">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <User className="h-7 w-7 text-white" />
                  )}
                </div>
                {profile.isPremium && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-1">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {profile.username}!
                </h1>
                <p className="text-sm text-gray-600">
                  Your profile and statistics
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 px-4 py-2 backdrop-blur-sm">
                <Diamond className="h-5 w-5 text-yellow-600" />
                <span className="font-bold text-yellow-800">
                  {profile.currentDiamonds}
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 px-4 py-2 backdrop-blur-sm">
                <Star className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-blue-800">
                  Level {profile.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 border-b border-gray-200 pt-6">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "transactions", label: "Transactions", icon: Clock },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 rounded-t-lg px-6 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 bg-blue-50/50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Profile Summary - Left Column */}
            <div className="space-y-6 lg:col-span-4">
              {/* Profile Info Card */}
              <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 shadow-lg">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Avatar"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>

                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    {profile.username}
                  </h3>
                  <p className="mb-4 text-gray-600">{profile.email}</p>

                  {profile.isPremium && (
                    <span className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 text-sm font-medium text-yellow-800">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Premium Member
                    </span>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="mb-2 text-sm text-gray-600">
                      Member since:{" "}
                      {new Date(profile.createdAt).toLocaleDateString("en-US")}
                    </div>
                    {profile.lastLoginDate && (
                      <div className="text-sm text-gray-600">
                        Last login:{" "}
                        {new Date(profile.lastLoginDate).toLocaleDateString(
                          "en-US"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                  Level Progress
                </h3>

                <div className="mb-6 text-center">
                  <div className="mb-2 text-4xl font-bold text-blue-600">
                    {profile.level}
                  </div>
                  <div className="text-gray-600">{profile.experience} XP</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>
                      {profile.currentLevelXp}/{profile.nextLevelXp} XP
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${profile.xpProgress}%` }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {profile.nextLevelXp - profile.currentLevelXp} XP needed for
                    next level
                  </div>
                </div>
              </div>
            </div>

            {/* Main Stats - Center & Right Columns */}
            <div className="space-y-8 lg:col-span-8">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    icon: BookOpen,
                    value: profile.stats.completedLessons,
                    label: "Completed Lessons",
                    color: "from-blue-500 to-blue-600",
                    bgColor: "from-blue-500/10 to-blue-600/10",
                  },
                  {
                    icon: Brain,
                    value: profile.stats.completedQuizzes,
                    label: "Solved Quizzes",
                    color: "from-purple-500 to-purple-600",
                    bgColor: "from-purple-500/10 to-purple-600/10",
                  },
                  {
                    icon: Award,
                    value: profile.stats.totalBadges,
                    label: "Earned Badges",
                    color: "from-orange-500 to-orange-600",
                    bgColor: "from-orange-500/10 to-orange-600/10",
                  },
                  {
                    icon: Zap,
                    value: profile.stats.currentStreak,
                    label: "Login Streak",
                    color: "from-yellow-500 to-yellow-600",
                    bgColor: "from-yellow-500/10 to-yellow-600/10",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl bg-gradient-to-br ${stat.bgColor} border border-white/20 p-6 shadow-sm transition-all duration-300 hover:shadow-lg`}
                  >
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${stat.color} mb-4 shadow-sm`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="mb-1 text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Diamond Stats */}
              <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-6 flex items-center text-lg font-semibold text-gray-900">
                  <Diamond className="mr-2 h-5 w-5 text-yellow-600" />
                  Diamond Statistics
                </h3>

                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="mb-2 text-3xl font-bold text-yellow-600">
                      {profile.currentDiamonds}
                    </div>
                    <div className="text-sm text-gray-600">
                      Current Diamonds
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-3xl font-bold text-purple-600">
                      {profile.totalDiamonds}
                    </div>
                    <div className="text-sm text-gray-600">Total Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-3xl font-bold text-blue-600">
                      {Math.round(
                        (profile.dailyDiamonds / profile.dailyLimit) * 100
                      )}
                      %
                    </div>
                    <div className="text-sm text-gray-600">Daily Progress</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily Limit</span>
                    <span className="font-medium">
                      {profile.dailyDiamonds}/{profile.dailyLimit}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (profile.dailyDiamonds / profile.dailyLimit) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {profile.canEarnDiamonds
                      ? `You can earn ${profile.dailyLimit - profile.dailyDiamonds} more diamonds today`
                      : "Daily limit reached! 🎉"}
                  </div>
                </div>
              </div>

              {/* Achievement Summary */}
              <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-6 flex items-center text-lg font-semibold text-gray-900">
                  <Trophy className="mr-2 h-5 w-5 text-orange-600" />
                  My Achievements
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    {
                      condition: profile.stats.completedLessons > 0,
                      text: "Completed your first lesson!",
                      completed: true,
                    },
                    {
                      condition: profile.stats.completedLessons >= 5,
                      text: "Completed 5 lessons!",
                      completed: profile.stats.completedLessons >= 5,
                    },
                    {
                      condition: profile.stats.currentStreak >= 3,
                      text: "Logged in 3 days in a row!",
                      completed: profile.stats.currentStreak >= 3,
                    },
                    {
                      condition: profile.level >= 5,
                      text: "Reached level 5!",
                      completed: profile.level >= 5,
                    },
                    {
                      condition: profile.stats.totalBadges >= 1,
                      text: "Earned your first badge!",
                      completed: profile.stats.totalBadges >= 1,
                    },
                    {
                      condition: profile.stats.completedQuizzes >= 10,
                      text: "Solved 10 quizzes!",
                      completed: profile.stats.completedQuizzes >= 10,
                    },
                  ]
                    .filter((achievement) => achievement.condition)
                    .map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3"
                      >
                        <CheckCircle
                          className={`h-5 w-5 ${achievement.completed ? "text-green-500" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-sm ${achievement.completed ? "text-gray-900" : "text-gray-600"}`}
                        >
                          {achievement.text}
                        </span>
                      </div>
                    ))}

                  {profile.stats.totalBadges === 0 &&
                    profile.stats.completedLessons === 0 && (
                      <div className="col-span-2 py-8 text-center">
                        <Target className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <p className="mb-2 text-gray-600">
                          Complete a lesson for your first achievement!
                        </p>
                        <p className="text-sm text-gray-500">
                          Every completed lesson brings you closer to new
                          achievements.
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="space-y-6">
            {/* Transaction Filters */}
            <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <Clock className="mr-2 h-5 w-5 text-blue-600" />
                  Transaction History
                </h2>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={transactionFilter}
                      onChange={(e) => {
                        setTransactionFilter(e.target.value);
                        setCurrentTransactionPage(1);
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="all">All Transactions</option>
                      <option value="earnings">Earnings</option>
                      <option value="spendings">Spendings</option>
                    </select>
                  </div>

                  <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-sm">
              {getPaginatedTransactions().length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {getPaginatedTransactions().map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-6 transition-colors hover:bg-gray-50/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${getTransactionTypeColor(transaction.amount)}`}
                          >
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {transaction.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString("tr-TR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="text-xs uppercase tracking-wide text-gray-400">
                              {transaction.type.replace(/_/g, " ")}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              transaction.amount > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            {transaction.amount}
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Diamond className="h-3 w-3" />
                            <span>Diamonds</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No transactions yet
                  </h3>
                  <p className="text-gray-600">
                    {transactionFilter === "all"
                      ? "No transactions have been made yet."
                      : `No transactions found matching the selected filter.`}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {getTotalTransactionPages() > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-6 py-4">
                  <div className="text-sm text-gray-600">
                    Page {currentTransactionPage} / {getTotalTransactionPages()}{" "}
                    ({getFilteredTransactions().length} transactions)
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentTransactionPage((prev) =>
                          Math.max(1, prev - 1)
                        )
                      }
                      disabled={currentTransactionPage === 1}
                      className="flex items-center space-x-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentTransactionPage((prev) =>
                          Math.min(getTotalTransactionPages(), prev + 1)
                        )
                      }
                      disabled={
                        currentTransactionPage === getTotalTransactionPages()
                      }
                      className="flex items-center space-x-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <User className="mr-2 h-5 w-5 text-blue-600" />
                  Profile Information
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={saveProfile}
                      className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center space-x-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {editing ? (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Your last name"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        About Me
                      </label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bio: e.target.value })
                        }
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <p className="rounded-lg bg-gray-50 p-3 text-gray-900">
                        {`${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="rounded-lg bg-gray-50 p-3 text-gray-900">
                        {profile.email}
                      </p>
                    </div>
                    <div className="lg:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        About Me
                      </label>
                      <p className="min-h-[100px] rounded-lg bg-gray-50 p-3 text-gray-900">
                        {profile.bio || "No bio added yet."}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Security Settings */}
            <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <h3 className="mb-6 flex items-center text-lg font-semibold text-gray-900">
                <Shield className="mr-2 h-5 w-5 text-red-600" />
                Security Settings
              </h3>

              <div className="space-y-6">
                {/* Username Change */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Username</h4>
                      <p className="text-sm text-gray-600">
                        Current: {profile.username}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowUsernameForm(!showUsernameForm)}
                      className="flex items-center space-x-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Change</span>
                    </button>
                  </div>

                  {showUsernameForm && (
                    <div className="space-y-4 border-t border-gray-200 pt-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          New Username
                        </label>
                        <input
                          type="text"
                          value={usernameForm.newUsername}
                          onChange={(e) =>
                            setUsernameForm({ newUsername: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="New username"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleUsernameChange}
                          disabled={updating}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                          {updating ? "Changing..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setShowUsernameForm(false);
                            setUsernameForm({ newUsername: "" });
                          }}
                          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Change */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-600">
                        Last changed:{" "}
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US"
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="flex items-center space-x-2 rounded-lg bg-red-100 px-4 py-2 text-red-700 transition-colors hover:bg-red-200"
                    >
                      <Key className="h-4 w-4" />
                      <span>Change</span>
                    </button>
                  </div>

                  {showPasswordForm && (
                    <div className="space-y-4 border-t border-gray-200 pt-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Your current password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-4"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Your new password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-4"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Confirm your new password"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handlePasswordChange}
                          disabled={updating}
                          className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                        >
                          {updating ? "Changing..." : "Change Password"}
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordForm({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          }}
                          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
