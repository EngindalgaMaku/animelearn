"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DiamondCounterProps {
  count: number;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "detailed";
  showIncrease?: boolean;
  increaseAmount?: number;
  className?: string;
}

export const DiamondCounter: React.FC<DiamondCounterProps> = ({
  count,
  animated = false,
  size = "md",
  variant = "default",
  showIncrease = false,
  increaseAmount = 0,
  className,
}) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const iconSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString("tr-TR");
  };

  return (
    <div className="relative">
      <motion.div
        className={cn(
          "flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500",
          "rounded-full text-white font-semibold shadow-lg",
          sizeClasses[size],
          animated && "animate-pulse",
          className
        )}
        initial={{ scale: 1 }}
        animate={{ scale: animated ? [1, 1.05, 1] : 1 }}
        transition={{
          duration: 0.3,
          repeat: animated ? Infinity : 0,
          repeatDelay: 2,
        }}
      >
        {/* Diamond Icon */}
        <motion.span
          className={cn(iconSizes[size], "drop-shadow-sm")}
          animate={{ rotate: animated ? [0, 5, -5, 0] : 0 }}
          transition={{ duration: 2, repeat: animated ? Infinity : 0 }}
        >
          💎
        </motion.span>

        {/* Count Display */}
        <motion.span
          className="font-bold tabular-nums"
          key={count}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.2 }}
        >
          {variant === "detailed"
            ? count.toLocaleString("tr-TR")
            : formatNumber(count)}
        </motion.span>

        {/* Optional Label for larger sizes */}
        {size === "lg" && variant === "detailed" && (
          <span className="text-xs opacity-90">elmas</span>
        )}
      </motion.div>

      {/* Increase Animation */}
      <AnimatePresence>
        {showIncrease && increaseAmount > 0 && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ duration: 1.5 }}
          >
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              +{increaseAmount} 💎
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Variants for different use cases
export const CompactDiamondCounter: React.FC<
  Omit<DiamondCounterProps, "variant" | "size">
> = (props) => <DiamondCounter {...props} variant="compact" size="sm" />;

export const DetailedDiamondCounter: React.FC<
  Omit<DiamondCounterProps, "variant">
> = (props) => <DiamondCounter {...props} variant="detailed" />;

// Hook for diamond counter animations
export const useDiamondAnimation = () => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [increaseAmount, setIncreaseAmount] = React.useState(0);

  const triggerIncrease = (amount: number) => {
    setIncreaseAmount(amount);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setIncreaseAmount(0);
    }, 2000);
  };

  return {
    isAnimating,
    increaseAmount,
    triggerIncrease,
  };
};
