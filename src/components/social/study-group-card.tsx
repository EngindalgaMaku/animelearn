"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Clock,
  BookOpen,
  Target,
  Star,
  MessageCircle,
  UserPlus,
  Settings,
  MoreHorizontal,
  Crown,
  Shield,
  User,
  Lock,
  Globe,
  Hash,
  Zap,
  Trophy,
  TrendingUp,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { colors, typographyPresets, spacing } from "@/lib/design-system";

export interface StudyGroupMember {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: "owner" | "moderator" | "member";
  joinedAt: Date;
  lastActive: Date;
  isOnline: boolean;
  contributionScore: number;
}

export interface StudyGroupActivity {
  id: string;
  type:
    | "lesson_completed"
    | "exercise_solved"
    | "quiz_passed"
    | "discussion"
    | "member_joined";
  userId: string;
  username: string;
  description: string;
  timestamp: Date;
  relatedContent?: {
    id: string;
    title: string;
    type: string;
  };
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  category: "beginner" | "intermediate" | "advanced" | "mixed";
  topic: string;
  privacy: "public" | "private" | "invite_only";

  // Member info
  memberCount: number;
  maxMembers: number;
  members: StudyGroupMember[];

  // Progress & Stats
  totalXP: number;
  completedLessons: number;
  activeDiscussions: number;
  weeklyGoal: number;
  weeklyProgress: number;

  // Dates
  createdAt: Date;
  lastActivity: Date;

  // Study schedule
  studySchedule?: {
    days: string[];
    startTime: string;
    duration: number; // minutes
    timezone: string;
  };

  // Current user's relationship
  isMember?: boolean;
  isOwner?: boolean;
  isModerator?: boolean;
  joinRequestPending?: boolean;

  // Recent activity
  recentActivities: StudyGroupActivity[];

  // Tags
  tags: string[];
}

interface StudyGroupCardProps {
  group: StudyGroup;
  variant?: "default" | "compact" | "detailed" | "featured";
  showJoinButton?: boolean;
  onJoin?: () => void;
  onView?: () => void;
  onMessage?: () => void;
  className?: string;
}

const categoryConfig = {
  beginner: {
    color: colors.success[500],
    bg: colors.success[50],
    label: "Başlangıç",
  },
  intermediate: {
    color: colors.warning[500],
    bg: colors.warning[50],
    label: "Orta",
  },
  advanced: { color: colors.error[500], bg: colors.error[50], label: "İleri" },
  mixed: { color: colors.info[500], bg: colors.info[50], label: "Karma" },
};

const privacyIcons = {
  public: Globe,
  private: Lock,
  invite_only: Shield,
};

export const StudyGroupCard: React.FC<StudyGroupCardProps> = ({
  group,
  variant = "default",
  showJoinButton = true,
  onJoin,
  onView,
  onMessage,
  className,
}) => {
  const category = categoryConfig[group.category];
  const PrivacyIcon = privacyIcons[group.privacy];

  const formatLastActivity = (date: Date): string => {
    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Az önce aktif";
    if (diffHours < 24) return `${diffHours} saat önce aktif`;
    return `${diffDays} gün önce aktif`;
  };

  const getProgressPercentage = (): number => {
    return Math.min((group.weeklyProgress / group.weeklyGoal) * 100, 100);
  };

  const getOnlineMembersCount = (): number => {
    return group.members.filter((member) => member.isOnline).length;
  };

  if (variant === "compact") {
    return (
      <motion.div
        className={cn(
          "cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md",
          className
        )}
        whileHover={{ y: -2 }}
        onClick={onView}
      >
        <div className="p-4">
          <div className="mb-3 flex items-start space-x-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 font-bold text-white shadow-sm"
              style={{
                backgroundImage: group.coverImage
                  ? `url(${group.coverImage})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!group.coverImage && group.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <h3 className="truncate font-semibold text-gray-800">
                  {group.name}
                </h3>
                <PrivacyIcon className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                {group.description}
              </p>

              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>
                    {group.memberCount}/{group.maxMembers}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>{getOnlineMembersCount()} çevrimiçi</span>
                </div>
                <span
                  className="rounded-full px-2 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: category.bg,
                    color: category.color,
                  }}
                >
                  {category.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {formatLastActivity(group.lastActivity)}
            </div>

            {showJoinButton && !group.isMember && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin?.();
                }}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600"
              >
                Katıl
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        className={cn(
          "cursor-pointer overflow-hidden rounded-xl border-2 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-300 hover:shadow-xl",
          className
        )}
        whileHover={{ y: -4, scale: 1.02 }}
        onClick={onView}
      >
        {/* Cover Image/Header */}
        <div
          className="relative h-32 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"
          style={{
            backgroundImage: group.coverImage
              ? `url(${group.coverImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              {category.label}
            </span>
            <div className="flex space-x-2">
              <PrivacyIcon className="h-5 w-5 text-white/80" />
              {group.isMember && <Crown className="h-5 w-5 text-yellow-400" />}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h2
              style={typographyPresets.heading.h3}
              className="mb-1 text-white"
            >
              {group.name}
            </h2>
            <p className="text-sm text-white/90">{group.topic}</p>
          </div>
        </div>

        <div className="p-6">
          <p className="mb-4 line-clamp-2 text-gray-600">{group.description}</p>

          {/* Stats Grid */}
          <div className="mb-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <Users className="mx-auto mb-1 h-5 w-5 text-blue-500" />
              <div className="font-semibold text-blue-700">
                {group.memberCount}
              </div>
              <div className="text-xs text-blue-600">Üye</div>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-center">
              <BookOpen className="mx-auto mb-1 h-5 w-5 text-green-500" />
              <div className="font-semibold text-green-700">
                {group.completedLessons}
              </div>
              <div className="text-xs text-green-600">Ders</div>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 text-center">
              <Zap className="mx-auto mb-1 h-5 w-5 text-purple-500" />
              <div className="font-semibold text-purple-700">
                {group.totalXP.toLocaleString()}
              </div>
              <div className="text-xs text-purple-600">XP</div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="mb-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">Haftalık Hedef</span>
              <span className="text-gray-500">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{group.weeklyProgress} dakika</span>
              <span>{group.weeklyGoal} dakika</span>
            </div>
          </div>

          {/* Recent Activity Preview */}
          {group.recentActivities.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 font-medium text-gray-800">
                Son Aktiviteler
              </h4>
              <div className="space-y-2">
                {group.recentActivities.slice(0, 2).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-2 text-sm text-gray-600"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="font-medium">{activity.username}</span>
                    <span>{activity.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {showJoinButton && !group.isMember && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin?.();
                }}
                className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
              >
                <UserPlus className="h-4 w-4" />
                <span>Gruba Katıl</span>
              </button>
            )}

            {group.isMember && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMessage?.();
                }}
                className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-green-500 px-4 py-2 font-medium text-white transition-colors hover:bg-green-600"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Sohbete Katıl</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      className={cn(
        "overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div
        className="relative h-24 cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500"
        style={{
          backgroundImage: group.coverImage
            ? `url(${group.coverImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={onView}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
          <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {category.label}
          </span>
          <div className="flex items-center space-x-1">
            <PrivacyIcon className="h-4 w-4 text-white/80" />
            {group.isMember && <Crown className="h-4 w-4 text-yellow-400" />}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Group Info */}
        <div className="mb-4">
          <div className="mb-2 flex items-start justify-between">
            <h3
              className="cursor-pointer font-semibold text-gray-800 transition-colors hover:text-blue-600"
              onClick={onView}
            >
              {group.name}
            </h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {group.description}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>
                {group.memberCount}/{group.maxMembers}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>{getOnlineMembersCount()} çevrimiçi</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatLastActivity(group.lastActivity)}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded bg-gray-50 p-2 text-center">
            <div className="text-sm font-semibold text-gray-800">
              {group.completedLessons}
            </div>
            <div className="text-xs text-gray-500">Ders</div>
          </div>
          <div className="rounded bg-gray-50 p-2 text-center">
            <div className="text-sm font-semibold text-gray-800">
              {group.activeDiscussions}
            </div>
            <div className="text-xs text-gray-500">Tartışma</div>
          </div>
          <div className="rounded bg-gray-50 p-2 text-center">
            <div className="text-sm font-semibold text-gray-800">
              {group.totalXP.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">XP</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>Haftalık İlerleme</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        {/* Tags */}
        {group.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {group.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                >
                  #{tag}
                </span>
              ))}
              {group.tags.length > 3 && (
                <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                  +{group.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {showJoinButton && !group.isMember && (
            <button
              onClick={onJoin}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                group.joinRequestPending
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              {group.joinRequestPending ? "İstek Gönderildi" : "Katıl"}
            </button>
          )}

          {group.isMember && (
            <button
              onClick={onMessage}
              className="flex-1 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
            >
              Sohbet
            </button>
          )}

          <button
            onClick={onView}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
          >
            Görüntüle
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Sample study group data
export const sampleStudyGroups: StudyGroup[] = [
  {
    id: "1",
    name: "Python Başlangıç Grubu",
    description:
      "Support group for Python beginners. Let's learn and grow together!",
    category: "beginner",
    topic: "Python Fundamentals",
    privacy: "public",
    memberCount: 24,
    maxMembers: 30,
    members: [],
    totalXP: 45000,
    completedLessons: 12,
    activeDiscussions: 5,
    weeklyGoal: 300,
    weeklyProgress: 180,
    createdAt: new Date("2024-01-15"),
    lastActivity: new Date(Date.now() - 3600000),
    isMember: false,
    recentActivities: [
      {
        id: "1",
        type: "lesson_completed",
        userId: "user1",
        username: "ahmet123",
        description: "completed Variables lesson",
        timestamp: new Date(Date.now() - 1800000),
      },
    ],
    tags: ["python", "beginner", "programming", "software"],
  },
  {
    id: "2",
    name: "Machine Learning Warriors",
    description:
      "We share experience on ML algorithms and deep learning topics.",
    category: "advanced",
    topic: "Machine Learning",
    privacy: "invite_only",
    memberCount: 15,
    maxMembers: 20,
    members: [],
    totalXP: 125000,
    completedLessons: 35,
    activeDiscussions: 8,
    weeklyGoal: 500,
    weeklyProgress: 320,
    createdAt: new Date("2023-12-01"),
    lastActivity: new Date(Date.now() - 1800000),
    isMember: true,
    isOwner: false,
    recentActivities: [],
    tags: ["ml", "ai", "deep-learning", "neural-networks"],
  },
];
