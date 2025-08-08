"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "diamond" | "xp" | "badge" | "level" | "streak" | "special";
  value?: number;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

interface AchievementCelebrationProps {
  achievement: Achievement;
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
}

const celebrationStyles = {
  diamond: {
    bg: "from-yellow-400 to-yellow-600",
    particles: "💎",
    sound: "bling",
  },
  xp: {
    bg: "from-blue-400 to-blue-600",
    particles: "⭐",
    sound: "level",
  },
  badge: {
    bg: "from-purple-400 to-purple-600",
    particles: "🏆",
    sound: "achievement",
  },
  level: {
    bg: "from-green-400 to-green-600",
    particles: "🚀",
    sound: "levelup",
  },
  streak: {
    bg: "from-orange-400 to-orange-600",
    particles: "🔥",
    sound: "streak",
  },
  special: {
    bg: "from-pink-400 to-pink-600",
    particles: "✨",
    sound: "special",
  },
};

export const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
  achievement,
  isVisible,
  onComplete,
  duration = 3000,
}) => {
  const style = celebrationStyles[achievement.type];

  React.useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl opacity-70"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                  rotate: 0,
                  scale: 0,
                }}
                animate={{
                  y: -50,
                  rotate: 360,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2,
                  ease: "easeOut",
                }}
              >
                {style.particles}
              </motion.div>
            ))}
          </div>

          {/* Main achievement card */}
          <motion.div
            className={cn(
              "relative bg-gradient-to-br text-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center",
              style.bg
            )}
            initial={{ scale: 0, rotateY: -90 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: 90 }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 300,
              duration: 0.6,
            }}
          >
            {/* Glow effect */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-2xl opacity-30 blur-xl",
                `bg-gradient-to-br ${style.bg}`
              )}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Achievement icon */}
            <motion.div
              className="text-6xl mb-4 relative z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", damping: 10 }}
            >
              {achievement.icon}
            </motion.div>

            {/* Achievement title */}
            <motion.h2
              className="text-2xl font-bold mb-2 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {achievement.title}
            </motion.h2>

            {/* Achievement description */}
            <motion.p
              className="text-lg opacity-90 mb-4 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {achievement.description}
            </motion.p>

            {/* Value display */}
            {achievement.value && (
              <motion.div
                className="text-3xl font-bold relative z-10"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
              >
                +{achievement.value}
                {achievement.type === "diamond" && " 💎"}
                {achievement.type === "xp" && " XP"}
              </motion.div>
            )}

            {/* Rarity indicator */}
            {achievement.rarity && achievement.rarity !== "common" && (
              <motion.div
                className="absolute top-4 right-4 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wide"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                {achievement.rarity}
              </motion.div>
            )}

            {/* Shooting stars effect */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{
                  x: `${20 + i * 15}%`,
                  y: `${20 + i * 10}%`,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: `${80 + i * 5}%`,
                  y: `${10 + i * 5}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: 1.2 + i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>

          {/* Fireworks effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`firework-${i}`}
                className="absolute"
                style={{
                  left: `${20 + (i % 4) * 20}%`,
                  top: `${20 + Math.floor(i / 4) * 40}%`,
                }}
              >
                {[...Array(6)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos((j * 60 * Math.PI) / 180) * 50,
                      y: Math.sin((j * 60 * Math.PI) / 180) * 50,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 1.5 + i * 0.2,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Queue system for multiple achievements
interface AchievementQueueProps {
  achievements: Achievement[];
  onAllComplete?: () => void;
}

export const AchievementQueue: React.FC<AchievementQueueProps> = ({
  achievements,
  onAllComplete,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (achievements.length > 0 && currentIndex === 0) {
      setIsVisible(true);
    }
  }, [achievements.length]);

  const handleComplete = React.useCallback(() => {
    setIsVisible(false);

    setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsVisible(true);
      } else {
        setCurrentIndex(0);
        onAllComplete?.();
      }
    }, 300);
  }, [currentIndex, achievements.length, onAllComplete]);

  if (achievements.length === 0) return null;

  return (
    <AchievementCelebration
      achievement={achievements[currentIndex]}
      isVisible={isVisible}
      onComplete={handleComplete}
    />
  );
};

// Hook for achievement management
export const useAchievements = () => {
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);

  const addAchievement = React.useCallback((achievement: Achievement) => {
    setAchievements((prev) => [...prev, achievement]);
  }, []);

  const clearAchievements = React.useCallback(() => {
    setAchievements([]);
  }, []);

  return {
    achievements,
    addAchievement,
    clearAchievements,
  };
};

// Predefined achievement templates
export const achievementTemplates = {
  firstLesson: {
    id: "first-lesson",
    title: "İlk Adım Atıldı!",
    description: "İlk dersini başarıyla tamamladın",
    icon: "🎓",
    type: "xp" as const,
    value: 100,
    rarity: "common" as const,
  },
  diamondEarned: (amount: number) => ({
    id: "diamond-earned",
    title: "Elmas Kazandın!",
    description: "Harika bir performans gösterdin",
    icon: "💎",
    type: "diamond" as const,
    value: amount,
    rarity: amount >= 100 ? ("rare" as const) : ("common" as const),
  }),
  levelUp: (level: number) => ({
    id: "level-up",
    title: "Seviye Atladın!",
    description: `Level ${level} olarak yeni yetenekler kazandın`,
    icon: "🚀",
    type: "level" as const,
    value: level,
    rarity: level >= 10 ? ("epic" as const) : ("rare" as const),
  }),
  weekStreak: {
    id: "week-streak",
    title: "Haftalık Seri!",
    description: "7 gün üst üste ders yaptın",
    icon: "🔥",
    type: "streak" as const,
    rarity: "rare" as const,
  },
};
