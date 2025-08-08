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
          refreshUser(); // AuthContext'teki user'ı güncelle
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
      alert("Yeni şifreler eşleşmiyor!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("Yeni şifre en az 6 karakter olmalı!");
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
        alert("Şifre başarıyla değiştirildi!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
      } else {
        alert(data.error || "Şifre değiştirilemedi!");
      }
    } catch (error) {
      console.error("Password change failed:", error);
      alert("Şifre değişikliğinde hata oluştu!");
    } finally {
      setUpdating(false);
    }
  };

  const handleUsernameChange = async () => {
    if (usernameForm.newUsername.length < 3) {
      alert("Kullanıcı adı en az 3 karakter olmalı!");
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
        alert("Kullanıcı adı başarıyla değiştirildi!");
        setProfile({ ...profile!, username: data.user.username });
        setUsernameForm({ newUsername: "" });
        setShowUsernameForm(false);
        refreshUser(); // AuthContext'teki user'ı güncelle
      } else {
        alert(data.error || "Kullanıcı adı değiştirilemedi!");
      }
    } catch (error) {
      console.error("Username change failed:", error);
      alert("Kullanıcı adı değişikliğinde hata oluştu!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-600">
                  Your account information and statistics
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-2">
                <Diamond className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">
                  {profile.currentDiamonds}
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-2">
                <Star className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">
                  Level {profile.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/hero/hero1.jpg"
            alt="Profile Hero"
            className="absolute right-0 top-0 h-32 w-32 rotate-12 rounded-2xl object-cover md:h-48 md:w-48"
          />
          <img
            src="/hero/hero2.jpg"
            alt="Profile Hero"
            className="absolute bottom-0 left-0 h-24 w-24 -rotate-12 rounded-2xl object-cover md:h-36 md:w-36"
          />
          <img
            src="/features/features4.jpg"
            alt="Profile Feature"
            className="absolute left-1/3 top-1/2 h-20 w-20 rotate-45 rounded-2xl object-cover md:h-28 md:w-28"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Profile Info */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profil Bilgileri
                  </h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={saveProfile}
                        className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-100"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
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

                  <h3 className="text-xl font-bold text-gray-900">
                    {profile.username}
                  </h3>
                  <p className="text-gray-600">{profile.email}</p>

                  {profile.isPremium && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-1 text-sm font-medium text-yellow-800">
                      ✨ Premium Üye
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {editing ? (
                    <>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Ad
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
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          placeholder="Adınız"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Soyad
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
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          placeholder="Soyadınız"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) =>
                            setEditForm({ ...editForm, bio: e.target.value })
                          }
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          placeholder="Kendiniz hakkında..."
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {(profile.firstName || profile.lastName) && (
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Ad Soyad
                          </label>
                          <p className="text-gray-900">
                            {`${profile.firstName || ""} ${
                              profile.lastName || ""
                            }`.trim()}
                          </p>
                        </div>
                      )}
                      {profile.bio && (
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Hakkımda
                          </label>
                          <p className="text-gray-900">{profile.bio}</p>
                        </div>
                      )}
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Üyelik Tarihi
                        </label>
                        <p className="text-gray-900">
                          {new Date(profile.createdAt).toLocaleDateString(
                            "tr-TR"
                          )}
                        </p>
                      </div>
                      {profile.lastLoginDate && (
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Son Giriş
                          </label>
                          <p className="text-gray-900">
                            {new Date(profile.lastLoginDate).toLocaleDateString(
                              "tr-TR"
                            )}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Level Progress */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Seviye İlerlemesi
                </h3>

                <div className="mb-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    Seviye {profile.level}
                  </div>
                  <div className="text-gray-600">{profile.experience} XP</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Mevcut Seviye XP</span>
                    <span>
                      {profile.currentLevelXp}/{profile.nextLevelXp}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${profile.xpProgress}%` }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Sonraki seviyeye{" "}
                    {profile.nextLevelXp - profile.currentLevelXp} XP kaldı
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-600" />
                  Güvenlik Ayarları
                </h3>

                <div className="space-y-4">
                  {/* Username Change */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Kullanıcı Adı</h4>
                        <p className="text-sm text-gray-600">Mevcut: {profile.username}</p>
                      </div>
                      <button
                        onClick={() => setShowUsernameForm(!showUsernameForm)}
                        className="flex items-center space-x-2 rounded-lg bg-blue-100 px-3 py-2 text-blue-700 hover:bg-blue-200"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Değiştir</span>
                      </button>
                    </div>

                    {showUsernameForm && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Yeni Kullanıcı Adı
                          </label>
                          <input
                            type="text"
                            value={usernameForm.newUsername}
                            onChange={(e) => setUsernameForm({ newUsername: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="Yeni kullanıcı adı"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUsernameChange}
                            disabled={updating}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            {updating ? "Değiştiriliyor..." : "Kaydet"}
                          </button>
                          <button
                            onClick={() => {
                              setShowUsernameForm(false);
                              setUsernameForm({ newUsername: "" });
                            }}
                            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Password Change */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Şifre</h4>
                        <p className="text-sm text-gray-600">Son değişiklik: {new Date(profile.createdAt).toLocaleDateString("tr-TR")}</p>
                      </div>
                      <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="flex items-center space-x-2 rounded-lg bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200"
                      >
                        <Key className="h-4 w-4" />
                        <span>Değiştir</span>
                      </button>
                    </div>

                    {showPasswordForm && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Mevcut Şifre
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                              placeholder="Mevcut şifreniz"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                          <label className="block text-sm font-medium text-gray-700">
                            Yeni Şifre
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                              placeholder="Yeni şifreniz"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                          <label className="block text-sm font-medium text-gray-700">
                            Yeni Şifre Tekrar
                          </label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            placeholder="Yeni şifrenizi tekrar girin"
                          />
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={handlePasswordChange}
                            disabled={updating}
                            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {updating ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
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
                            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Badges */}
              {profile.recentBadges.length > 0 && (
                <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Son Rozetler
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {profile.recentBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="rounded-lg bg-gray-50 p-3 text-center"
                      >
                        <div className="mb-1 text-2xl">{badge.icon}</div>
                        <div className="text-xs font-medium text-gray-900">
                          {badge.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(badge.earnedAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Center Column - Stats */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/80 p-6 text-center shadow-lg backdrop-blur-sm">
                  <BookOpen className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.stats.completedLessons}
                  </div>
                  <div className="text-sm text-gray-600">Tamamlanan Ders</div>
                </div>

                <div className="rounded-2xl bg-white/80 p-6 text-center shadow-lg backdrop-blur-sm">
                  <Brain className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.stats.completedQuizzes}
                  </div>
                  <div className="text-sm text-gray-600">Çözülen Quiz</div>
                </div>

                <div className="rounded-2xl bg-white/80 p-6 text-center shadow-lg backdrop-blur-sm">
                  <Award className="mx-auto mb-2 h-8 w-8 text-orange-600" />
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.stats.totalBadges}
                  </div>
                  <div className="text-sm text-gray-600">Kazanılan Rozet</div>
                </div>

                <div className="rounded-2xl bg-white/80 p-6 text-center shadow-lg backdrop-blur-sm">
                  <Zap className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.stats.currentStreak}
                  </div>
                  <div className="text-sm text-gray-600">Giriş Serisi</div>
                </div>
              </div>

              {/* Diamond Info */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  💎 Elmas Bilgileri
                </h3>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {profile.currentDiamonds}
                    </div>
                    <div className="text-sm text-gray-600">Mevcut Elmas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {profile.totalDiamonds}
                    </div>
                    <div className="text-sm text-gray-600">
                      Toplam Kazanılan
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Günlük İlerleme</span>
                    <span className="font-medium">
                      {profile.dailyDiamonds}/{profile.dailyLimit}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (profile.dailyDiamonds / profile.dailyLimit) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-center text-xs text-gray-600">
                    {profile.canEarnDiamonds
                      ? `Günde ${
                          profile.dailyLimit - profile.dailyDiamonds
                        } elmas daha kazanabilirsin`
                      : "Günlük limite ulaştın!"}
                  </div>
                </div>
              </div>

              {/* Learning Stats */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  📊 Öğrenme İstatistikleri
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Kod Gönderimi</span>
                    <span className="font-medium text-gray-900">
                      {profile.stats.codeSubmissions}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">En Uzun Seri</span>
                    <span className="font-medium text-gray-900">
                      {profile.stats.maxStreak} gün
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Günlük Görev Tamamlama
                    </span>
                    <span className="font-medium text-gray-900">
                      %{profile.questCompletionRate}
                    </span>
                  </div>

                  {profile.stats.totalCards > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sahip Olunan Kart</span>
                        <span className="font-medium text-gray-900">
                          {profile.stats.totalCards}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Koleksiyon Değeri</span>
                        <span className="font-medium text-purple-600">
                          💎 {profile.stats.totalCardValue}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Activity */}
            <div className="space-y-6">
              {/* Recent Transactions */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Son İşlemler
                </h3>

                {profile.recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {profile.recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString(
                              "tr-TR"
                            )}
                          </div>
                        </div>
                        <div
                          className={`font-medium ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount} 💎
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-gray-500">Henüz işlem yok</p>
                  </div>
                )}
              </div>

              {/* Achievement Summary */}
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  🏆 Başarılar
                </h3>

                <div className="space-y-4">
                  {profile.stats.completedLessons > 0 && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        İlk dersi tamamladın!
                      </span>
                    </div>
                  )}

                  {profile.stats.completedLessons >= 5 && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">5 ders tamamladın!</span>
                    </div>
                  )}

                  {profile.stats.currentStreak >= 3 && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        3 gün üst üste giriş yaptın!
                      </span>
                    </div>
                  )}

                  {profile.level >= 5 && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Seviye 5'e ulaştın!</span>
                    </div>
                  )}

                  {profile.stats.totalBadges === 0 &&
                    profile.stats.completedLessons === 0 && (
                      <div className="py-6 text-center">
                        <Target className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">
                          İlk başarınızı kazanmak için ders tamamlayın!
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
