/**
 * Animations System Index
 * Anime-themed animation system for Python learning platform
 */

// Animation presets and utilities
export {
  easings,
  durations,
  transitions,
  fadeVariants,
  scaleVariants,
  slideVariants,
  staggerVariants,
  staggerChildVariants,
  specialEffects,
  microInteractions,
  pageTransitions,
  type EasingKey,
  type DurationKey,
  type TransitionKey,
  type SpecialEffectKey,
  type MicroInteractionKey,
} from "./presets";

// Animation hooks
export {
  useMotionPreference,
  useInView,
  useScrollProgress,
  useElementScrollProgress,
  useMousePosition,
  useHover,
  useFocus,
  useWindowResize,
  useSequence,
  useParallax,
  usePerformanceAnimation,
  useStaggerChildren,
  useSwipeGesture,
} from "./hooks";

// Animation components
export {
  AnimatedWrapper,
  FadeIn,
  ScaleIn,
  SlideIn,
  StaggerChildren,
  AnimatedButton,
  AnimatedCard,
  AnimatedIcon,
  MagicalAppear,
  PowerUp,
  Floating,
  Pulse,
  Shake,
  PageTransition,
  Presence,
} from "./components";

// Utility functions for animations
export const animations = {
  // Quick preset builders
  createFadeIn: (delay = 0, duration = 0.3) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay, duration },
  }),

  createSlideIn: (
    direction: "left" | "right" | "up" | "down",
    distance = 50
  ) => {
    const directions = {
      left: { x: -distance },
      right: { x: distance },
      up: { y: -distance },
      down: { y: distance },
    };

    return {
      initial: { ...directions[direction], opacity: 0 },
      animate: { x: 0, y: 0, opacity: 1 },
      transition: { type: "spring", damping: 12, stiffness: 300, mass: 0.8 },
    };
  },

  createScale: (from = 0.8, to = 1) => ({
    initial: { scale: from, opacity: 0 },
    animate: { scale: to, opacity: 1 },
    transition: { type: "spring", damping: 12, stiffness: 300, mass: 0.8 },
  }),

  // Stagger helpers
  createStagger: (childDelay = 0.1, totalDelay = 0.2) => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: childDelay,
          delayChildren: totalDelay,
        },
      },
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", damping: 12, stiffness: 300, mass: 0.8 },
      },
    },
  }),

  // Anime-style effects
  createMagicalEntry: (delay = 0) => ({
    initial: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    animate: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        delay,
        type: "spring",
        damping: 15,
        stiffness: 200,
        duration: 0.8,
      },
    },
  }),

  createFloating: (amplitude = 10, duration = 3) => ({
    animate: {
      y: [-amplitude, amplitude, -amplitude],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }),

  createPulse: (scale = 1.05, duration = 2) => ({
    animate: {
      scale: [1, scale, 1],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }),

  createGlow: (color = "rgba(59, 130, 246, 0.5)") => ({
    initial: { boxShadow: `0 0 0 ${color}` },
    hover: {
      boxShadow: `0 0 20px ${color}`,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  }),

  // Page transitions
  createPageTransition: (variant: "fade" | "slide" | "scale" = "fade") => {
    switch (variant) {
      case "slide":
        return {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "-100%" },
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 300,
            mass: 0.8,
          },
        };
      case "scale":
        return {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.1, opacity: 0 },
          transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        };
    }
  },

  // Micro-interaction builders
  createButtonHover: (scale = 1.05) => ({
    rest: { scale: 1 },
    hover: {
      scale,
      transition: { duration: 0.1, ease: [0.1, 0, 0.9, 1] },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1, ease: [0.1, 0, 0.9, 1] },
    },
  }),

  createCardHover: (translateY = -5, shadowIntensity = 0.15) => ({
    rest: {
      y: 0,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    hover: {
      y: translateY,
      boxShadow: `0 10px 25px rgba(0, 0, 0, ${shadowIntensity})`,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  }),

  createIconRotate: (angle = 5) => ({
    rest: { rotate: 0 },
    hover: {
      rotate: angle,
      transition: { duration: 0.1, ease: [0.1, 0, 0.9, 1] },
    },
  }),
};

// Animation sequences for complex interactions
export const sequences = {
  // Level up sequence
  levelUp: (onComplete?: () => void) => ({
    scale: [0.8, 1.2, 1],
    rotate: [0, 10, -10, 0],
    opacity: [0, 1, 1, 1],
    transition: {
      duration: 1.2,
      times: [0, 0.3, 0.7, 1],
      ease: [0.25, 0.46, 0.45, 0.94],
      onComplete,
    },
  }),

  // Achievement unlock
  achievementUnlock: {
    scale: [0, 1.1, 1],
    opacity: [0, 1, 1],
    rotate: [180, 0, 0],
    transition: {
      duration: 0.8,
      times: [0, 0.6, 1],
      ease: [0.68, -0.55, 0.265, 1.55],
    },
  },

  // Error shake
  errorShake: {
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },

  // Success celebration
  successCelebration: {
    scale: [1, 1.1, 1],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 0.6,
      ease: [0.68, -0.55, 0.265, 1.55],
    },
  },
};

// Performance optimized animations
export const performanceOptimized = {
  // Use transform instead of layout properties
  fastSlide: {
    transform: "translateX(0)",
    transition: "transform 0.3s ease-out",
  },

  fastFade: {
    opacity: 1,
    transition: "opacity 0.3s ease-out",
  },

  fastScale: {
    transform: "scale(1)",
    transition: "transform 0.3s ease-out",
  },
};

// Accessibility helpers
export const a11y = {
  // Respect reduced motion preference
  respectMotion: (animation: any, fallback: any = {}) => ({
    "@media (prefers-reduced-motion: reduce)": fallback,
    "@media (prefers-reduced-motion: no-preference)": animation,
  }),

  // Focus-visible animations
  focusVisible: {
    outline: "2px solid #3b82f6",
    outlineOffset: "2px",
    transition: "outline 0.2s ease-out",
  },
};
