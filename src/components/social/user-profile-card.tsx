"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Calendar,
  Trophy,
  Star,
  Zap,
  BookOpen,
  Code,
  MessageCircle,
  UserPlus,
  Settings,
  Badge,
  Crown,
  Heart,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { colors, typographyPresets, spacing } from "@/lib/design-system";

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinedAt: Date;
  isOnline: boolean;
  lastSeen?: Date;

  // Learning Stats
  totalXP: number;
  currentLevel: number;
  completedLessons: number;
  completedExercises: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;

  // Social Stats
  followers: number;
  following: number;
  studyGroups: number;
  mentorshipCount: number;

  // Achievements & Badges
  badges: UserBadge[];
  topSkills: string[];
  recentAchievements: Achievement[];

  // Relationship with current user
  isFollowing?: boolean;
  isFriend?: boolean;
  isMentor?: boolean;
  isMentee?: boolean;
  isBlocked?: boolean;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  xpReward: number;
}

interface UserProfileCardProps {
  profile: UserProfile;
  variant?: "default" | "compact" | "detailed" | "mini";
  showActions?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
  className?: string;
}

const rarityColors = {
  common: {
    bg: colors.neutral[100],
    border: colors.neutral[300],
    text: colors.neutral[700],
  },
  rare: {
    bg: colors.info[100],
    border: colors.info[300],
    text: colors.info[700],
  },
  epic: {
    bg: colors.secondary[100],
    border: colors.secondary[300],
    text: colors.secondary[700],
  },
  legendary: {
    bg: colors.warning[100],
    border: colors.warning[300],
    text: colors.warning[700],
  },
};

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profile,
  variant = "default",
  showActions = true,
  onFollow,
  onMessage,
  onViewProfile,
  className,
}) => {
  const formatJoinDate = (date: Date): string => {
    return date.toLocaleDateString("tr-TR", { year: "numeric", month: "long" });
  };

  const getLastSeenText = (): string => {
    if (profile.isOnline) return "Çevrimiçi";
    if (!profile.lastSeen) return "Uzun zaman önce";

    const diffMs = Date.now() - profile.lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Az önce";
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${diffDays} gün önce`;
  };

  const getLevelProgress = (): number => {
    const xpForCurrentLevel = Math.pow(profile.currentLevel - 1, 2) * 1000;
    const xpForNextLevel = Math.pow(profile.currentLevel, 2) * 1000;
    const currentLevelXP = profile.totalXP - xpForCurrentLevel;
    const neededXP = xpForNextLevel - xpForCurrentLevel;
    return Math.min((currentLevelXP / neededXP) * 100, 100);
  };

  if (variant === "mini") {
    return (
      <motion.div
        className={cn(
          "flex items-center space-x-3 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer",
          className
        )}
        whileHover={{ y: -1 }}
        onClick={onViewProfile}
      >
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold"
            style={{
              backgroundImage: profile.avatar
                ? `url(${profile.avatar})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!profile.avatar && profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
              profile.isOnline ? "bg-green-500" : "bg-gray-400"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 truncate">
            {profile.displayName}
          </div>
          <div className="text-xs text-gray-500">
            Level {profile.currentLevel} • {profile.totalXP} XP
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">{getLastSeenText()}</div>
        </div>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        className={cn(
          "bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden",
          className
        )}
        whileHover={{ y: -2 }}
      >
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-3">
            <div className="relative">
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold"
                style={{
                  backgroundImage: profile.avatar
                    ? `url(${profile.avatar})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!profile.avatar && profile.displayName.charAt(0).toUpperCase()}
              </div>
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                  profile.isOnline ? "bg-green-500" : "bg-gray-400"
                )}
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {profile.displayName}
              </h3>
              <p className="text-sm text-gray-500">@{profile.username}</p>
              <p className="text-xs text-gray-400">{getLastSeenText()}</p>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold">
                  Level {profile.currentLevel}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {profile.totalXP.toLocaleString()} XP
              </div>
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {profile.bio}
            </p>
          )}

          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-sm font-semibold text-blue-600">
                {profile.completedLessons}
              </div>
              <div className="text-xs text-gray-500">Ders</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-green-600">
                {profile.currentStreak}
              </div>
              <div className="text-xs text-gray-500">Seri</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-purple-600">
                {profile.followers}
              </div>
              <div className="text-xs text-gray-500">Takipçi</div>
            </div>
          </div>

          {showActions && (
            <div className="flex space-x-2">
              <button
                onClick={onFollow}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                  profile.isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                )}
              >
                {profile.isFollowing ? "Takip Ediliyor" : "Takip Et"}
              </button>
              <button
                onClick={onMessage}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Default and detailed variants
  return (
    <motion.div
      className={cn(
        "bg-white rounded-xl shadow-sm border overflow-hidden",
        variant === "detailed" ? "max-w-md" : "max-w-sm",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header/Cover */}
      <div className="h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end space-x-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-xl font-bold text-gray-700"
                style={{
                  backgroundImage: profile.avatar
                    ? `url(${profile.avatar})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!profile.avatar && profile.displayName.charAt(0).toUpperCase()}
              </div>
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white",
                  profile.isOnline ? "bg-green-500" : "bg-gray-400"
                )}
              />
            </div>

            <div className="text-white pb-2">
              <div className="text-xs opacity-75">{getLastSeenText()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Basic Info */}
        <div className="mb-4">
          <h2
            style={typographyPresets.heading.h4}
            className="text-gray-800 mb-1"
          >
            {profile.displayName}
          </h2>
          <p className="text-gray-500 text-sm mb-2">@{profile.username}</p>

          {profile.bio && (
            <p className="text-gray-600 text-sm mb-3">{profile.bio}</p>
          )}

          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {profile.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatJoinDate(profile.joinedAt)} tarihinde katıldı</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">
                Level {profile.currentLevel}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {profile.totalXP.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${getLevelProgress()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="font-semibold text-blue-700">
              {profile.completedLessons}
            </div>
            <div className="text-xs text-blue-600">Tamamlanan Ders</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Code className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <div className="font-semibold text-green-700">
              {profile.completedExercises}
            </div>
            <div className="text-xs text-green-600">Çözülen Egzersiz</div>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Zap className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <div className="font-semibold text-orange-700">
              {profile.currentStreak}
            </div>
            <div className="text-xs text-orange-600">Günlük Seri</div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Trophy className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <div className="font-semibold text-purple-700">
              %{profile.averageScore}
            </div>
            <div className="text-xs text-purple-600">Ortalama Puan</div>
          </div>
        </div>

        {/* Social Stats */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="font-semibold text-gray-800">
              {profile.followers}
            </div>
            <div className="text-xs text-gray-500">Takipçi</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-800">
              {profile.following}
            </div>
            <div className="text-xs text-gray-500">Takip</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-800">
              {profile.studyGroups}
            </div>
            <div className="text-xs text-gray-500">Grup</div>
          </div>
        </div>

        {variant === "detailed" && (
          <>
            {/* Top Skills */}
            {profile.topSkills.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  En İyi Beceriler
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.topSkills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Badges */}
            {profile.badges.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Son Rozetler
                </h4>
                <div className="flex space-x-2">
                  {profile.badges.slice(0, 3).map((badge) => {
                    const rarity = rarityColors[badge.rarity];
                    return (
                      <div
                        key={badge.id}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
                        style={{
                          backgroundColor: rarity.bg,
                          borderColor: rarity.border,
                        }}
                        title={badge.name}
                      >
                        {badge.icon}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-3">
            <button
              onClick={onFollow}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2",
                profile.isFollowing
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              <UserPlus className="w-4 h-4" />
              <span>{profile.isFollowing ? "Takip Ediliyor" : "Takip Et"}</span>
            </button>

            <button
              onClick={onMessage}
              className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Sample user data for testing
export const sampleUserProfile: UserProfile = {
  id: "1",
  username: "pythonmaster",
  displayName: "Ahmet Yılmaz",
  bio: "Python öğrenmeyi seven bir yazılım geliştirici. Machine learning ve web development ile ilgileniyorum.",
  location: "İstanbul, Türkiye",
  joinedAt: new Date("2023-06-15"),
  isOnline: true,

  totalXP: 12500,
  currentLevel: 15,
  completedLessons: 45,
  completedExercises: 120,
  currentStreak: 12,
  longestStreak: 28,
  averageScore: 87,

  followers: 234,
  following: 67,
  studyGroups: 3,
  mentorshipCount: 5,

  badges: [
    {
      id: "1",
      name: "Python Başlangıcı",
      description: "İlk 10 Python dersini tamamladı",
      icon: "🐍",
      rarity: "common",
      earnedAt: new Date("2023-07-01"),
    },
    {
      id: "2",
      name: "Seri Yapıcı",
      description: "7 gün üst üste çalıştı",
      icon: "🔥",
      rarity: "rare",
      earnedAt: new Date("2023-08-15"),
    },
  ],

  topSkills: ["Python", "Machine Learning", "Web Development", "Data Analysis"],
  recentAchievements: [],

  isFollowing: false,
  isFriend: false,
};
