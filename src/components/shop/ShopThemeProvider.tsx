"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Star, 
  Flame, 
  Zap, 
  Crown,
  Diamond,
  Trophy,
  Target,
  Gift
} from "lucide-react";

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  particles: {
    color: string;
    count: number;
    icon: React.ReactNode;
  };
  effects: {
    glow: string;
    animation: string;
  };
}

interface ShopTheme {
  "anime-collection": ThemeConfig;
  "star-collection": ThemeConfig;
  "car-collection": ThemeConfig;
}

const shopThemes: ShopTheme = {
  "anime-collection": {
    primary: "#FF6B6B",
    secondary: "#9333EA",
    accent: "#F59E0B",
    background: "from-pink-50 via-purple-50 to-indigo-50",
    particles: {
      color: "#FF6B6B",
      count: 15,
      icon: <Sparkles className="h-4 w-4" />
    },
    effects: {
      glow: "shadow-pink-500/25",
      animation: "animate-pulse"
    }
  },
  "star-collection": {
    primary: "#4ECDC4",
    secondary: "#0891B2",
    accent: "#10B981",
    background: "from-cyan-50 via-teal-50 to-blue-50",
    particles: {
      color: "#4ECDC4",
      count: 12,
      icon: <Star className="h-4 w-4" />
    },
    effects: {
      glow: "shadow-cyan-500/25",
      animation: "animate-bounce"
    }
  },
  "car-collection": {
    primary: "#45B7D1",
    secondary: "#DC2626",
    accent: "#FBBF24",
    background: "from-blue-50 via-indigo-50 to-cyan-50",
    particles: {
      color: "#45B7D1",
      count: 10,
      icon: <Flame className="h-4 w-4" />
    },
    effects: {
      glow: "shadow-blue-500/25",
      animation: "animate-ping"
    }
  }
};

interface ShopThemeContextType {
  currentTheme: keyof ShopTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: keyof ShopTheme) => void;
  gamificationLevel: number;
  streakCount: number;
  collectibleCount: number;
}

const ShopThemeContext = createContext<ShopThemeContextType | undefined>(undefined);

export const useShopTheme = () => {
  const context = useContext(ShopThemeContext);
  if (!context) {
    throw new Error("useShopTheme must be used within ShopThemeProvider");
  }
  return context;
};

interface ShopThemeProviderProps {
  children: ReactNode;
  initialTheme?: keyof ShopTheme;
}

export default function ShopThemeProvider({
  children,
  initialTheme = "anime-collection"
}: ShopThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<keyof ShopTheme>(initialTheme);
  const [gamificationLevel, setGamificationLevel] = useState(5);
  const [streakCount, setStreakCount] = useState(7);
  const [collectibleCount, setCollectibleCount] = useState(23);
  const [isLoaded, setIsLoaded] = useState(false);

  const themeConfig = shopThemes[currentTheme];

  const setTheme = (theme: keyof ShopTheme) => {
    setCurrentTheme(theme);
  };

  // Prevent hydration mismatches and flickering
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ShopThemeContext.Provider value={{
      currentTheme,
      themeConfig,
      setTheme,
      gamificationLevel,
      streakCount,
      collectibleCount
    }}>
      <div className={`min-h-screen bg-gradient-to-br ${themeConfig.background} ${isLoaded ? 'transition-all duration-500' : ''}`}>
        {/* Animated Background Particles - Only show after load */}
        {isLoaded && <ParticleBackground theme={themeConfig} />}
        
        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Theme Transition Effects - Only show after load */}
        {isLoaded && <ThemeTransitionEffects currentTheme={currentTheme} />}
      </div>
    </ShopThemeContext.Provider>
  );
}

// Particle Background Component - Optimized to prevent flickering
function ParticleBackground({ theme }: { theme: ThemeConfig }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [mounted, setMounted] = useState(false);

  // Generate consistent positions - reduced count for better performance
  const particleCount = Math.min(theme.particles.count, 8); // Limit particles to reduce load
  const particlePositions = Array.from({ length: particleCount }, (_, i) => ({
    initialX: (i * 123 + 456) % dimensions.width,
    initialY: (i * 789 + 234) % dimensions.height,
    animateX: (i * 345 + 678) % dimensions.width,
    animateY: (i * 567 + 890) % dimensions.height,
    duration: 25 + (i % 8) * 3, // Slower, more subtle animations
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      if (typeof window !== "undefined") {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }
    }, 100); // Small delay to prevent flash

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particlePositions.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute opacity-10" // Reduced opacity for subtlety
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            opacity: 0,
          }}
          animate={{
            x: particle.animateX,
            y: particle.animateY,
            rotate: 360,
            opacity: 0.1,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.2, // Stagger the animations
          }}
          style={{ color: theme.particles.color }}
        >
          {theme.particles.icon}
        </motion.div>
      ))}
    </div>
  );
}

// Gamification Header Component
function GamificationHeader() {
  const { themeConfig, gamificationLevel, streakCount, collectibleCount } = useShopTheme();

  return (
    <motion.div 
      className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Level & XP */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                style={{ backgroundColor: themeConfig.primary }}
              >
                {gamificationLevel}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Level {gamificationLevel}</div>
                <div className="text-xs text-gray-500">Card Collector</div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: themeConfig.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-xs text-gray-600">650/1000 XP</span>
            </div>
          </div>

          {/* Center: Shop Title */}
          <div className="hidden md:block text-center">
            <h1 className="text-xl font-bold text-gray-900">🎴 Premium Card Shop</h1>
            <p className="text-xs text-gray-600">Discover legendary collectibles</p>
          </div>

          {/* Right: Stats */}
          <div className="flex items-center space-x-4">
            {/* Streak Counter */}
            <div className="flex items-center space-x-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-900">{streakCount}</span>
              <span className="text-xs text-gray-500 hidden sm:inline">day streak</span>
            </div>

            {/* Collectibles Count */}
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-900">{collectibleCount}</span>
              <span className="text-xs text-gray-500 hidden sm:inline">collected</span>
            </div>

            {/* Diamond Count */}
            <div className="flex items-center space-x-1">
              <Diamond className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-900">1,247</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Theme Transition Effects - Simplified to prevent flickering
function ThemeTransitionEffects({ currentTheme }: { currentTheme: keyof ShopTheme }) {
  const [showEffects, setShowEffects] = useState(false);

  // Only show effects on theme change, not on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEffects(true);
    }, 1000); // Delay to prevent initial flash

    return () => clearTimeout(timer);
  }, [currentTheme]);

  if (!showEffects) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${currentTheme}-effects`}
        className="fixed inset-0 pointer-events-none z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Reduced particle burst - only on manual theme changes */}
        {currentTheme === 'anime-collection' && showEffects && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute opacity-30"
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 0.8, 0],
                  rotate: 180,
                  x: Math.cos(i * 45) * 150,
                  y: Math.sin(i * 45) * 150
                }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
              >
                <Sparkles className="h-4 w-4 text-pink-500" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Achievement Notification Component
export function AchievementNotification({ 
  title, 
  description, 
  icon, 
  show, 
  onClose 
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  show: boolean;
  onClose: () => void;
}) {
  const { themeConfig } = useShopTheme();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-20 right-4 z-50 max-w-sm"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl border-l-4 p-4"
            style={{ borderLeftColor: themeConfig.primary }}
          >
            <div className="flex items-start space-x-3">
              <div 
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: themeConfig.primary }}
              >
                {icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                <p className="text-xs text-gray-600 mt-1">{description}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}