"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary" | "mythic";
export type BadgeCategory =
  | "learning"
  | "social"
  | "achievement"
  | "special"
  | "event";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: BadgeCategory;
  unlockedAt?: Date;
  progress?: {
    current: number;
    total: number;
  };
}

interface BadgeComponentProps {
  badge: Badge;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showProgress?: boolean;
  showTooltip?: boolean;
  locked?: boolean;
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

const rarityColors = {
  common: {
    bg: "from-gray-400 to-gray-500",
    border: "border-gray-400",
    glow: "shadow-gray-400/50",
  },
  rare: {
    bg: "from-blue-400 to-blue-500",
    border: "border-blue-400",
    glow: "shadow-blue-400/50",
  },
  epic: {
    bg: "from-purple-400 to-purple-500",
    border: "border-purple-400",
    glow: "shadow-purple-400/50",
  },
  legendary: {
    bg: "from-yellow-400 to-orange-500",
    border: "border-yellow-400",
    glow: "shadow-yellow-400/50",
  },
  mythic: {
    bg: "from-pink-400 to-red-500",
    border: "border-pink-400",
    glow: "shadow-pink-400/50",
  },
};

const sizeClasses = {
  xs: { container: "w-8 h-8", icon: "text-xs", text: "text-xs" },
  sm: { container: "w-12 h-12", icon: "text-sm", text: "text-xs" },
  md: { container: "w-16 h-16", icon: "text-lg", text: "text-sm" },
  lg: { container: "w-20 h-20", icon: "text-xl", text: "text-base" },
  xl: { container: "w-24 h-24", icon: "text-2xl", text: "text-lg" },
};

export const BadgeComponent: React.FC<BadgeComponentProps> = ({
  badge,
  size = "md",
  showProgress = false,
  showTooltip = true,
  locked = false,
  animated = true,
  onClick,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const rarity = rarityColors[badge.rarity];
  const sizeClass = sizeClasses[size];

  const isUnlocked = !!badge.unlockedAt;
  const progressPercentage = badge.progress
    ? (badge.progress.current / badge.progress.total) * 100
    : 100;

  return (
    <div className="relative">
      <motion.div
        className={cn(
          "relative rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300",
          sizeClass.container,
          isUnlocked && !locked
            ? `bg-gradient-to-br ${rarity.bg} ${rarity.border}`
            : "bg-gray-600 border-gray-500",
          isUnlocked &&
            !locked &&
            animated &&
            isHovered &&
            `shadow-lg ${rarity.glow}`,
          locked && "opacity-50 grayscale",
          className
        )}
        whileHover={animated ? { scale: 1.1 } : {}}
        whileTap={animated ? { scale: 0.95 } : {}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Badge Icon */}
        <span
          className={cn(
            sizeClass.icon,
            isUnlocked && !locked ? "text-white" : "text-gray-400"
          )}
        >
          {locked ? "🔒" : badge.icon}
        </span>

        {/* Rarity Glow Effect */}
        {isUnlocked && !locked && animated && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full opacity-30",
              `bg-gradient-to-br ${rarity.bg}`
            )}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Progress Ring */}
        {showProgress &&
          badge.progress &&
          badge.progress.current < badge.progress.total && (
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 45 * (1 - progressPercentage / 100),
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
          )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isHovered && (
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl max-w-xs">
              <div className="flex items-center space-x-2 mb-1">
                <span className={cn("font-bold", sizeClass.text)}>
                  {badge.name}
                </span>
                <div
                  className={cn(
                    "px-2 py-1 rounded text-xs font-bold uppercase tracking-wide",
                    `bg-gradient-to-r ${rarity.bg} text-white`
                  )}
                >
                  {badge.rarity}
                </div>
              </div>

              <p className="text-xs text-gray-300 mb-2">{badge.description}</p>

              {badge.progress && (
                <div className="text-xs text-gray-400">
                  İlerleme: {badge.progress.current}/{badge.progress.total}
                </div>
              )}

              {badge.unlockedAt && (
                <div className="text-xs text-green-400 mt-1">
                  ✓ {badge.unlockedAt.toLocaleDateString("tr-TR")} tarihinde
                  kazanıldı
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Badge Grid Component
interface BadgeGridProps {
  badges: Badge[];
  columns?: number;
  showProgress?: boolean;
  onBadgeClick?: (badge: Badge) => void;
  className?: string;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({
  badges,
  columns = 4,
  showProgress = false,
  onBadgeClick,
  className,
}) => {
  return (
    <div className={cn(`grid gap-4`, `grid-cols-${columns}`, className)}>
      {badges.map((badge) => (
        <BadgeComponent
          key={badge.id}
          badge={badge}
          showProgress={showProgress}
          onClick={() => onBadgeClick?.(badge)}
        />
      ))}
    </div>
  );
};

// Badge Showcase Component
interface BadgeShowcaseProps {
  recentBadges: Badge[];
  totalBadges: number;
  className?: string;
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  recentBadges,
  totalBadges,
  className,
}) => {
  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-lg", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Son Kazanılan Rozetler
        </h3>
        <span className="text-sm text-gray-600">
          {totalBadges} toplam rozet
        </span>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-2">
        {recentBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BadgeComponent badge={badge} size="lg" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Badge Unlock Animation
interface BadgeUnlockAnimationProps {
  badge: Badge;
  onComplete?: () => void;
}

export const BadgeUnlockAnimation: React.FC<BadgeUnlockAnimationProps> = ({
  badge,
  onComplete,
}) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
      >
        <motion.div
          className="mb-6"
          animate={{
            rotateY: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotateY: { duration: 2, repeat: Infinity },
            scale: { duration: 1, repeat: Infinity, repeatDelay: 1 },
          }}
        >
          <BadgeComponent
            badge={badge}
            size="xl"
            animated={false}
            showTooltip={false}
          />
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-yellow-400 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ROZET KAZANILDI!
        </motion.h2>

        <motion.p
          className="text-xl text-white mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {badge.name}
        </motion.p>

        <motion.p
          className="text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {badge.description}
        </motion.p>

        {/* Sparkle effects */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: Math.cos((i * 30 * Math.PI) / 180) * 150,
              y: Math.sin((i * 30 * Math.PI) / 180) * 150,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 2, delay: 1 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Predefined badge templates
export const badgeTemplates = {
  learning: [
    {
      id: "first-lesson",
      name: "İlk Adım",
      description: "İlk dersini tamamladın!",
      icon: "📚",
      rarity: "common" as BadgeRarity,
      category: "learning" as BadgeCategory,
    },
    {
      id: "week-streak",
      name: "Haftalık Yolcu",
      description: "7 gün üst üste ders yaptın",
      icon: "🔥",
      rarity: "rare" as BadgeRarity,
      category: "learning" as BadgeCategory,
    },
    {
      id: "python-master",
      name: "Python Ustası",
      description: "Tüm Python derslerini tamamladın",
      icon: "🐍",
      rarity: "legendary" as BadgeRarity,
      category: "achievement" as BadgeCategory,
    },
  ],
};
