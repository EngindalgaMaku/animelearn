"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Trophy,
  Star,
  PlayCircle,
  CheckCircle,
  Lock,
  BookOpen,
  Code,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { colors, typographyPresets, spacing } from "@/lib/design-system";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  topics: string[];
  isCompleted: boolean;
  isLocked: boolean;
  progress: number; // 0-100
  xpReward: number;
  diamondReward: number;
  enrolledCount: number;
  rating: number;
  ratingCount: number;
  prerequisite?: string[];
  category:
    | "basics"
    | "data-structures"
    | "algorithms"
    | "web"
    | "ai"
    | "projects";
  hasQuiz: boolean;
  hasExercises: boolean;
  exerciseCount: number;
  completedAt?: Date;
  estimatedTime?: number;
}

interface LessonCardProps {
  lesson: Lesson;
  variant?: "default" | "compact" | "featured" | "grid";
  showProgress?: boolean;
  onClick?: () => void;
  className?: string;
}

const difficultyConfig = {
  beginner: {
    color: colors.success[500],
    bgColor: colors.success[50],
    textColor: colors.success[700],
    icon: "🟢",
    label: "Başlangıç",
  },
  intermediate: {
    color: colors.warning[500],
    bgColor: colors.warning[50],
    textColor: colors.warning[700],
    icon: "🟡",
    label: "Orta",
  },
  advanced: {
    color: colors.error[500],
    bgColor: colors.error[50],
    textColor: colors.error[700],
    icon: "🔴",
    label: "İleri",
  },
};

const categoryConfig = {
  basics: { icon: "📚", label: "Temel Kavramlar", color: colors.primary[500] },
  "data-structures": {
    icon: "🗃️",
    label: "Veri Yapıları",
    color: colors.secondary[500],
  },
  algorithms: { icon: "⚡", label: "Algoritmalar", color: colors.warning[500] },
  web: { icon: "🌐", label: "Web Geliştirme", color: colors.success[500] },
  ai: { icon: "🤖", label: "Yapay Zeka", color: colors.accent.teal[500] },
  projects: { icon: "🛠️", label: "Projeler", color: colors.info[500] },
};

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  variant = "default",
  showProgress = true,
  onClick,
  className,
}) => {
  const difficulty = difficultyConfig[lesson.difficulty];
  const category = categoryConfig[lesson.category];

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}dk`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}s ${remainingMinutes}dk`;
  };

  const getStatusIcon = () => {
    if (lesson.isLocked) return <Lock className="w-5 h-5 text-gray-400" />;
    if (lesson.isCompleted)
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (lesson.progress > 0)
      return <PlayCircle className="w-5 h-5 text-blue-500" />;
    return <BookOpen className="w-5 h-5 text-gray-500" />;
  };

  const getStatusText = () => {
    if (lesson.isLocked) return "Kilitli";
    if (lesson.isCompleted) return "Tamamlandı";
    if (lesson.progress > 0) return `%${lesson.progress} Tamamlandı`;
    return "Başla";
  };

  const cardVariants = {
    default: "p-6",
    compact: "p-4",
    featured: "p-8",
    grid: "p-5",
  };

  if (variant === "compact") {
    return (
      <motion.div
        className={cn(
          "bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer",
          lesson.isLocked && "opacity-60",
          cardVariants[variant],
          className
        )}
        whileHover={{ y: -2 }}
        onClick={onClick}
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: category.color + "20" }}
            >
              {category.icon}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3
                style={typographyPresets.heading.h5}
                className="text-gray-800 truncate"
              >
                {lesson.title}
              </h3>
              {getStatusIcon()}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(lesson.duration)}</span>
              </span>
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: difficulty.bgColor,
                  color: difficulty.textColor,
                }}
              >
                {difficulty.label}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className="text-sm font-medium text-gray-800">
              {lesson.xpReward} XP
            </div>
            <div className="text-xs text-gray-500">
              {lesson.diamondReward} 💎
            </div>
          </div>
        </div>

        {showProgress && lesson.progress > 0 && !lesson.isCompleted && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${lesson.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        className={cn(
          "bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden",
          lesson.isLocked && "opacity-60",
          cardVariants[variant],
          className
        )}
        whileHover={{ y: -4, scale: 1.02 }}
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-sm"
              style={{
                backgroundColor: category.color,
                color: "white",
              }}
            >
              {category.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className="px-2 py-1 rounded-full text-xs font-bold uppercase"
                  style={{
                    backgroundColor: category.color + "20",
                    color: category.color,
                  }}
                >
                  {category.label}
                </span>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: difficulty.bgColor,
                    color: difficulty.textColor,
                  }}
                >
                  {difficulty.icon} {difficulty.label}
                </span>
              </div>
              <h2
                style={typographyPresets.heading.h3}
                className="text-gray-800"
              >
                {lesson.title}
              </h2>
            </div>
          </div>
          <div className="text-right">{getStatusIcon()}</div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lesson.topics.slice(0, 3).map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {topic}
            </span>
          ))}
          {lesson.topics.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
              +{lesson.topics.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div style={typographyPresets.heading.h4} className="text-blue-600">
              {lesson.xpReward}
            </div>
            <div className="text-xs text-gray-500">XP Ödülü</div>
          </div>
          <div className="text-center">
            <div
              style={typographyPresets.heading.h4}
              className="text-yellow-600"
            >
              {lesson.diamondReward}
            </div>
            <div className="text-xs text-gray-500">Elmas</div>
          </div>
          <div className="text-center">
            <div
              style={typographyPresets.heading.h4}
              className="text-green-600"
            >
              {formatDuration(lesson.duration)}
            </div>
            <div className="text-xs text-gray-500">Süre</div>
          </div>
          <div className="text-center">
            <div
              style={typographyPresets.heading.h4}
              className="text-purple-600"
            >
              {lesson.exerciseCount}
            </div>
            <div className="text-xs text-gray-500">Egzersiz</div>
          </div>
        </div>

        {/* Progress */}
        {showProgress && lesson.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">İlerleme</span>
              <span className="font-medium">{lesson.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${lesson.progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          className={cn(
            "w-full py-3 rounded-lg font-medium transition-colors",
            lesson.isLocked
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : lesson.isCompleted
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-blue-500 text-white hover:bg-blue-600"
          )}
          disabled={lesson.isLocked}
        >
          {getStatusText()}
        </button>
      </motion.div>
    );
  }

  // Default and grid variants
  return (
    <motion.div
      className={cn(
        "bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden",
        lesson.isLocked && "opacity-60",
        cardVariants[variant],
        className
      )}
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      {/* Thumbnail/Header */}
      {lesson.thumbnail ? (
        <div className="relative h-48 mb-4">
          <img
            src={lesson.thumbnail}
            alt={lesson.title}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute top-3 left-3">
            <span
              className="px-2 py-1 rounded-full text-xs font-medium bg-white/90"
              style={{ color: difficulty.textColor }}
            >
              {difficulty.icon} {difficulty.label}
            </span>
          </div>
          <div className="absolute top-3 right-3">{getStatusIcon()}</div>
        </div>
      ) : (
        <div
          className="h-32 mb-4 rounded-lg flex items-center justify-center text-4xl"
          style={{
            backgroundColor: category.color + "10",
            border: `2px dashed ${category.color}50`,
          }}
        >
          {category.icon}
        </div>
      )}

      {/* Content */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3
            style={typographyPresets.heading.h4}
            className="text-gray-800 line-clamp-2"
          >
            {lesson.title}
          </h3>
          <div className="ml-2 flex-shrink-0">{getStatusIcon()}</div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {lesson.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(lesson.duration)}</span>
            </span>
            {lesson.hasExercises && (
              <span className="flex items-center space-x-1">
                <Code className="w-4 h-4" />
                <span>{lesson.exerciseCount}</span>
              </span>
            )}
            {lesson.hasQuiz && <Target className="w-4 h-4" />}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{lesson.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1 text-blue-600">
              <Zap className="w-4 h-4" />
              <span>{lesson.xpReward} XP</span>
            </span>
            <span className="flex items-center space-x-1 text-yellow-600">
              <span>💎</span>
              <span>{lesson.diamondReward}</span>
            </span>
          </div>
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: category.color + "20",
              color: category.color,
            }}
          >
            {category.label}
          </span>
        </div>

        {/* Progress */}
        {showProgress && lesson.progress > 0 && !lesson.isCompleted && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>İlerleme</span>
              <span>{lesson.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${lesson.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Topics */}
        <div className="flex flex-wrap gap-1">
          {lesson.topics.slice(0, 2).map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {topic}
            </span>
          ))}
          {lesson.topics.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
              +{lesson.topics.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Grid container component
interface LessonGridProps {
  lessons: Lesson[];
  variant?: "grid" | "list" | "compact";
  onLessonClick?: (lesson: Lesson) => void;
  className?: string;
}

export const LessonGrid: React.FC<LessonGridProps> = ({
  lessons,
  variant = "grid",
  onLessonClick,
  className,
}) => {
  const gridClasses = {
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    list: "space-y-4",
    compact: "space-y-3",
  };

  return (
    <div className={cn(gridClasses[variant], className)}>
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          variant={
            variant === "grid"
              ? "default"
              : variant === "list"
              ? "compact"
              : variant
          }
          onClick={() => onLessonClick?.(lesson)}
        />
      ))}
    </div>
  );
};

// Sample lesson data
export const sampleLessons: Lesson[] = [
  {
    id: "1",
    title: "Python Temelleri",
    description:
      "Python programlamaya giriş, değişkenler, veri tipleri ve temel operatörler",
    difficulty: "beginner",
    duration: 45,
    topics: ["Değişkenler", "Veri Tipleri", "Operatörler", "Input/Output"],
    isCompleted: false,
    isLocked: false,
    progress: 0,
    xpReward: 100,
    diamondReward: 25,
    enrolledCount: 1250,
    rating: 4.8,
    ratingCount: 324,
    category: "basics",
    hasQuiz: true,
    hasExercises: true,
    exerciseCount: 5,
  },
  {
    id: "2",
    title: "Listeler ve Döngüler",
    description:
      "Python listelerinin kullanımı, for ve while döngüleri ile veri işleme",
    difficulty: "beginner",
    duration: 60,
    topics: ["Listeler", "For Döngüsü", "While Döngüsü", "List Comprehension"],
    isCompleted: true,
    isLocked: false,
    progress: 100,
    xpReward: 150,
    diamondReward: 35,
    enrolledCount: 980,
    rating: 4.7,
    ratingCount: 256,
    category: "basics",
    hasQuiz: true,
    hasExercises: true,
    exerciseCount: 8,
    completedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    title: "Veri Yapıları - Stack ve Queue",
    description:
      "Stack ve Queue veri yapılarının implementasyonu ve kullanım alanları",
    difficulty: "intermediate",
    duration: 90,
    topics: ["Stack", "Queue", "Deque", "Priority Queue"],
    isCompleted: false,
    isLocked: false,
    progress: 35,
    xpReward: 250,
    diamondReward: 60,
    enrolledCount: 567,
    rating: 4.9,
    ratingCount: 189,
    category: "data-structures",
    hasQuiz: true,
    hasExercises: true,
    exerciseCount: 12,
  },
];
