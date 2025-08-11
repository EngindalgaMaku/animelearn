"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
interface RewardAnimation {
  type: string;
  amount: any;
  icon: string;
  color: string;
  delay: number;
  badgeData?: any;
}

interface FloatingRewardProps {
  animation: RewardAnimation;
  onComplete?: () => void;
}

interface RewardCascadeProps {
  animations: RewardAnimation[];
  isVisible: boolean;
  onComplete?: () => void;
}

interface ProgressionData {
  previous: {
    experience: number;
    diamonds: number;
    level: number;
    expToNextLevel: number;
  };
  current: {
    experience: number;
    diamonds: number;
    level: number;
    expToNextLevel: number;
  };
  earned: {
    experience: number;
    diamonds: number;
  };
  levelUp?: {
    newLevel: number;
    bonusDiamonds: number;
    bonusExperience: number;
  } | null;
}

interface RewardShowcaseProps {
  progression: ProgressionData;
  animations: RewardAnimation[];
  isVisible: boolean;
  onComplete?: () => void;
}

// Floating reward component for individual animations
export const FloatingReward: React.FC<FloatingRewardProps> = ({
  animation,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2000 + animation.delay);

    return () => clearTimeout(timer);
  }, [animation.delay, onComplete]);

  const getRewardText = () => {
    switch (animation.type) {
      case "experience":
        return `+${animation.amount} XP`;
      case "diamonds":
        return `+${animation.amount}`;
      case "level_up":
        return `LEVEL ${animation.amount}!`;
      case "badge":
        return "NEW BADGE!";
      default:
        return `+${animation.amount}`;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform"
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: -50 }}
          exit={{ scale: 0, opacity: 0, y: -100 }}
          transition={{
            delay: animation.delay / 1000,
            duration: 0.8,
            type: "spring",
            damping: 15,
          }}
        >
          <div
            className="flex items-center space-x-2 rounded-full px-6 py-3 text-lg font-bold text-white shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${animation.color}, ${animation.color}dd)`,
              boxShadow: `0 0 30px ${animation.color}66`,
            }}
          >
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              {animation.icon}
            </motion.span>
            <span>{getRewardText()}</span>
          </div>

          {/* Particle effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{ backgroundColor: animation.color }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: Math.cos((i * 60 * Math.PI) / 180) * 60,
                y: Math.sin((i * 60 * Math.PI) / 180) * 60,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 1,
                delay: animation.delay / 1000 + 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Reward cascade for multiple rewards
export const RewardCascade: React.FC<RewardCascadeProps> = ({
  animations,
  isVisible,
  onComplete,
}) => {
  const [currentAnimation, setCurrentAnimation] = React.useState(0);
  const [showingRewards, setShowingRewards] = React.useState<boolean[]>(
    new Array(animations.length).fill(false)
  );

  React.useEffect(() => {
    if (!isVisible || animations.length === 0) return;

    const timers: NodeJS.Timeout[] = [];

    animations.forEach((animation, index) => {
      const timer = setTimeout(() => {
        setShowingRewards((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, animation.delay);
      timers.push(timer);
    });

    // Complete after all animations
    const completeTimer = setTimeout(
      () => {
        onComplete?.();
      },
      Math.max(...animations.map((a) => a.delay)) + 3000
    );
    timers.push(completeTimer);

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [isVisible, animations, onComplete]);

  const handleRewardComplete = (index: number) => {
    setShowingRewards((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  if (!isVisible) return null;

  return (
    <>
      {animations.map(
        (animation, index) =>
          showingRewards[index] && (
            <FloatingReward
              key={`reward-${index}`}
              animation={{
                ...animation,
                delay: 0, // Already handled by cascade
              }}
              onComplete={() => handleRewardComplete(index)}
            />
          )
      )}
    </>
  );
};

// Comprehensive reward showcase with progression
export const RewardShowcase: React.FC<RewardShowcaseProps> = ({
  progression,
  animations,
  isVisible,
  onComplete,
}) => {
  const [phase, setPhase] = React.useState<
    "rewards" | "progression" | "complete"
  >("rewards");

  React.useEffect(() => {
    if (!isVisible) return;

    // Phase 1: Show individual rewards (3 seconds)
    const phaseTimer1 = setTimeout(() => {
      setPhase("progression");
    }, 3000);

    // Phase 2: Show progression summary (3 seconds)
    const phaseTimer2 = setTimeout(() => {
      setPhase("complete");
      onComplete?.();
    }, 6000);

    return () => {
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {phase === "rewards" && (
        <RewardCascade
          key="rewards"
          animations={animations}
          isVisible={true}
          onComplete={() => setPhase("progression")}
        />
      )}

      {phase === "progression" && (
        <motion.div
          key="progression"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="mx-4 max-w-md rounded-2xl bg-gradient-to-br from-purple-900 to-blue-900 p-8 text-center text-white shadow-2xl"
            initial={{ scale: 0, rotateY: -90 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: 90 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          >
            <motion.h2
              className="mb-6 text-3xl font-bold text-yellow-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              🎉 Harika İş! 🎉
            </motion.h2>

            {/* XP Progress */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="mb-2 flex justify-between text-sm">
                <span>⭐ Deneyim</span>
                <span>+{progression.earned.experience} XP</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-purple-800/50">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                  initial={{
                    width: `${(progression.previous.experience / (progression.previous.experience + progression.previous.expToNextLevel)) * 100}%`,
                  }}
                  animate={{
                    width: `${(progression.current.experience / (progression.current.experience + progression.current.expToNextLevel)) * 100}%`,
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-purple-200">
                <span>{progression.previous.experience}</span>
                <span>{progression.current.experience}</span>
              </div>
            </motion.div>

            {/* Diamond Progress */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="mb-2 flex justify-between text-sm">
                <span>💎 Elmas</span>
                <span>+{progression.earned.diamonds}</span>
              </div>
              <div className="flex items-center justify-between">
                <motion.span
                  className="text-2xl font-bold text-yellow-400"
                  key={progression.previous.diamonds}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                >
                  {progression.previous.diamonds}
                </motion.span>
                <span className="text-xl">→</span>
                <motion.span
                  className="text-2xl font-bold text-yellow-400"
                  key={progression.current.diamonds}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 1 }}
                >
                  {progression.current.diamonds}
                </motion.span>
              </div>
            </motion.div>

            {/* Level Up Bonus */}
            {progression.levelUp && (
              <motion.div
                className="mb-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
              >
                <div className="mb-2 text-xl font-bold">🚀 LEVEL UP!</div>
                <div className="text-lg">
                  Level {progression.levelUp.newLevel}
                </div>
                <div className="text-sm opacity-90">
                  Bonus: +{progression.levelUp.bonusDiamonds} 💎 +
                  {progression.levelUp.bonusExperience} XP
                </div>
              </motion.div>
            )}

            {/* Continue Button */}
            <motion.button
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-bold text-white transition-transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              onClick={() => {
                setPhase("complete");
                onComplete?.();
              }}
            >
              Devam Et! ✨
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for managing reward animations
export const useRewardAnimations = () => {
  const [isShowingRewards, setIsShowingRewards] = React.useState(false);
  const [currentAnimations, setCurrentAnimations] = React.useState<
    RewardAnimation[]
  >([]);
  const [currentProgression, setCurrentProgression] =
    React.useState<ProgressionData | null>(null);

  const showRewards = React.useCallback(
    (animations: RewardAnimation[], progression?: ProgressionData) => {
      setCurrentAnimations(animations);
      setCurrentProgression(progression || null);
      setIsShowingRewards(true);
    },
    []
  );

  const hideRewards = React.useCallback(() => {
    setIsShowingRewards(false);
    setCurrentAnimations([]);
    setCurrentProgression(null);
  }, []);

  return {
    isShowingRewards,
    currentAnimations,
    currentProgression,
    showRewards,
    hideRewards,
  };
};

// Hook for creating reward animations from API response
export const useRewardFromAPI = () => {
  const createAnimationsFromResponse = React.useCallback(
    (response: any): RewardAnimation[] => {
      const animations: RewardAnimation[] = [];

      // Add experience animation
      if (response.rewards?.experience > 0) {
        animations.push({
          type: "experience",
          amount: response.rewards.experience,
          icon: "⭐",
          color: "#FFD700",
          delay: 0,
        });
      }

      // Add diamond animation
      if (response.rewards?.diamonds > 0) {
        animations.push({
          type: "diamonds",
          amount: response.rewards.diamonds,
          icon: "💎",
          color: "#00D4FF",
          delay: 500,
        });
      }

      // Add level up animation
      if (response.rewards?.levelUp && response.rewards?.newLevel) {
        animations.push({
          type: "level_up",
          amount: response.rewards.newLevel,
          icon: "🎉",
          color: "#FF6B6B",
          delay: 1000,
        });
      }

      // Add badge animations
      if (response.rewards?.badges && response.rewards.badges.length > 0) {
        response.rewards.badges.forEach((badge: any, index: number) => {
          animations.push({
            type: "badge",
            amount: 1,
            icon: badge.icon || "🏆",
            color: badge.color || "#FFD700",
            delay: 1500 + index * 300,
            badgeData: badge,
          });
        });
      }

      return animations;
    },
    []
  );

  return { createAnimationsFromResponse };
};
