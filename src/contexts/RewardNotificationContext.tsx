"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  RewardShowcase,
  RewardCascade,
  useRewardFromAPI,
} from "@/components/gamification/reward-animations";

// Types
interface RewardAnimation {
  type: string;
  amount: any;
  icon: string;
  color: string;
  delay: number;
  badgeData?: any;
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

interface RewardNotification {
  id: string;
  type: "simple" | "showcase";
  animations: RewardAnimation[];
  progression?: ProgressionData;
  duration?: number;
}

interface RewardNotificationContextType {
  showRewards: (
    animations: RewardAnimation[],
    progression?: ProgressionData
  ) => void;
  showSimpleReward: (
    type: string,
    amount: number,
    icon: string,
    color?: string
  ) => void;
  showRewardsFromAPI: (apiResponse: any) => void;
  isShowingRewards: boolean;
}

const RewardNotificationContext =
  createContext<RewardNotificationContextType | null>(null);

interface RewardNotificationProviderProps {
  children: React.ReactNode;
}

export const RewardNotificationProvider: React.FC<
  RewardNotificationProviderProps
> = ({ children }) => {
  const [currentNotification, setCurrentNotification] =
    useState<RewardNotification | null>(null);
  const { createAnimationsFromResponse } = useRewardFromAPI();

  const showRewards = useCallback(
    (animations: RewardAnimation[], progression?: ProgressionData) => {
      const notification: RewardNotification = {
        id: Date.now().toString(),
        type: progression ? "showcase" : "simple",
        animations,
        progression,
      };

      setCurrentNotification(notification);
    },
    []
  );

  const showSimpleReward = useCallback(
    (type: string, amount: number, icon: string, color: string = "#FFD700") => {
      const animation: RewardAnimation = {
        type,
        amount,
        icon,
        color,
        delay: 0,
      };

      showRewards([animation]);
    },
    [showRewards]
  );

  const showRewardsFromAPI = useCallback(
    (apiResponse: any) => {
      const animations = createAnimationsFromResponse(apiResponse);
      const progression = apiResponse.progression;

      if (animations.length > 0) {
        showRewards(animations, progression);
      }
    },
    [createAnimationsFromResponse, showRewards]
  );

  const handleRewardComplete = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  const contextValue: RewardNotificationContextType = {
    showRewards,
    showSimpleReward,
    showRewardsFromAPI,
    isShowingRewards: !!currentNotification,
  };

  return (
    <RewardNotificationContext.Provider value={contextValue}>
      {children}

      {/* Render active notifications */}
      {currentNotification && (
        <>
          {currentNotification.type === "showcase" &&
          currentNotification.progression ? (
            <RewardShowcase
              animations={currentNotification.animations}
              progression={currentNotification.progression}
              isVisible={true}
              onComplete={handleRewardComplete}
            />
          ) : (
            <RewardCascade
              animations={currentNotification.animations}
              isVisible={true}
              onComplete={handleRewardComplete}
            />
          )}
        </>
      )}
    </RewardNotificationContext.Provider>
  );
};

// Hook to use the reward notification context
export const useRewardNotifications = () => {
  const context = useContext(RewardNotificationContext);

  if (!context) {
    throw new Error(
      "useRewardNotifications must be used within a RewardNotificationProvider"
    );
  }

  return context;
};

// Pre-built notification helpers
export const useRewardHelpers = () => {
  const { showSimpleReward, showRewards, showRewardsFromAPI } =
    useRewardNotifications();

  const showDiamondReward = useCallback(
    (amount: number) => {
      showSimpleReward("diamonds", amount, "💎", "#00D4FF");
    },
    [showSimpleReward]
  );

  const showXPReward = useCallback(
    (amount: number) => {
      showSimpleReward("experience", amount, "⭐", "#FFD700");
    },
    [showSimpleReward]
  );

  const showLevelUp = useCallback(
    (newLevel: number) => {
      showSimpleReward("level_up", newLevel, "🎉", "#FF6B6B");
    },
    [showSimpleReward]
  );

  const showBadgeEarned = useCallback(
    (badge: any) => {
      const animation: RewardAnimation = {
        type: "badge",
        amount: 1,
        icon: badge.icon || "🏆",
        color: badge.color || "#FFD700",
        delay: 0,
        badgeData: badge,
      };
      showRewards([animation]);
    },
    [showRewards]
  );

  const showCodeArenaComplete = useCallback(
    (apiResponse: any) => {
      showRewardsFromAPI(apiResponse);
    },
    [showRewardsFromAPI]
  );

  return {
    showDiamondReward,
    showXPReward,
    showLevelUp,
    showBadgeEarned,
    showCodeArenaComplete,
  };
};

// Toast-style notification for smaller rewards
interface ToastRewardProps {
  type: "diamond" | "xp" | "badge";
  amount: number;
  isVisible: boolean;
  onComplete?: () => void;
}

export const ToastReward: React.FC<ToastRewardProps> = ({
  type,
  amount,
  isVisible,
  onComplete,
}) => {
  const configs = {
    diamond: {
      icon: "💎",
      color: "from-yellow-400 to-yellow-600",
      text: "elmas",
    },
    xp: { icon: "⭐", color: "from-blue-400 to-blue-600", text: "XP" },
    badge: {
      icon: "🏆",
      color: "from-purple-400 to-purple-600",
      text: "rozet",
    },
  };

  const config = configs[type];

  React.useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50">
      <div
        className={`bg-gradient-to-r ${config.color} animate-slide-in-right flex items-center space-x-2 rounded-lg px-4 py-2 text-white shadow-lg`}
      >
        <span className="text-lg">{config.icon}</span>
        <span className="font-semibold">
          +{amount} {config.text}
        </span>
      </div>
    </div>
  );
};

// Manager for toast notifications
export const useToastRewards = () => {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "diamond" | "xp" | "badge";
      amount: number;
    }>
  >([]);

  const showToast = useCallback(
    (type: "diamond" | "xp" | "badge", amount: number) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, type, amount }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3000);
    },
    []
  );

  const ToastContainer = () => (
    <div className="pointer-events-none fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastReward
          key={toast.id}
          type={toast.type}
          amount={toast.amount}
          isVisible={true}
          onComplete={() => {
            setToasts((prev) => prev.filter((t) => t.id !== toast.id));
          }}
        />
      ))}
    </div>
  );

  return {
    showToast,
    ToastContainer,
  };
};
