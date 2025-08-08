/**
 * Animation Presets
 * Anime-themed animation presets and easing functions
 */

import { Variants, Transition } from "framer-motion";

// Anime-inspired easing functions
export const easings = {
  // Standard easings
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],

  // Anime-style easings (more dramatic)
  animeEaseOut: [0.25, 0.46, 0.45, 0.94],
  animeEaseIn: [0.55, 0.06, 0.68, 0.19],
  animeEaseInOut: [0.87, 0, 0.13, 1],

  // Bouncy effects (character-like movements)
  bounce: [0.68, -0.55, 0.265, 1.55],
  bounceSoft: [0.25, 0.8, 0.25, 1],
  bounceHard: [0.6, -0.28, 0.735, 0.045],

  // Sharp effects (action scenes)
  sharp: [0.25, 0, 0.5, 1],
  snap: [0.1, 0, 0.9, 1],

  // Smooth effects (gentle movements)
  smooth: [0.4, 0, 0.2, 1],
  gentle: [0.25, 0.1, 0.25, 1],

  // Magic/mystical effects
  mystical: [0.645, 0.045, 0.355, 1],
  ethereal: [0.77, 0, 0.175, 1],
} as const;

// Standard durations (in seconds)
export const durations = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.6,
  slower: 1.0,
  slowest: 1.5,

  // Anime-style timing
  snap: 0.1,
  quick: 0.2,
  smooth: 0.4,
  dramatic: 0.8,
  cinematic: 1.2,
} as const;

// Common transitions
export const transitions = {
  // Basic transitions
  spring: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  } as Transition,

  springGentle: {
    type: "spring",
    damping: 25,
    stiffness: 200,
  } as Transition,

  springBouncy: {
    type: "spring",
    damping: 15,
    stiffness: 400,
  } as Transition,

  // Anime-style transitions
  animeSpring: {
    type: "spring",
    damping: 12,
    stiffness: 300,
    mass: 0.8,
  } as Transition,

  dramatic: {
    duration: durations.dramatic,
    ease: easings.animeEaseOut,
  } as Transition,

  snap: {
    duration: durations.snap,
    ease: easings.snap,
  } as Transition,

  smooth: {
    duration: durations.smooth,
    ease: easings.smooth,
  } as Transition,

  bounce: {
    duration: durations.normal,
    ease: easings.bounce,
  } as Transition,

  mystical: {
    duration: durations.slow,
    ease: easings.mystical,
  } as Transition,
} as const;

// Fade animations
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: transitions.smooth,
  },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    transition: transitions.snap,
  },
};

// Scale animations
export const scaleVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    transition: transitions.smooth,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: transitions.animeSpring,
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: transitions.snap,
  },
};

// Slide animations
export const slideVariants = {
  fromLeft: {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },
  fromRight: {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  },
  fromTop: {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  fromBottom: {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
} as const;

// Stagger animations (for lists)
export const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerChildVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: transitions.animeSpring,
  },
  exit: {
    y: -10,
    opacity: 0,
    scale: 0.98,
    transition: transitions.snap,
  },
};

// Anime-style special effects
export const specialEffects = {
  // Magical appearance
  magicalAppear: {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        duration: 0.8,
      },
    },
  } as Variants,

  // Power-up effect
  powerUp: {
    hidden: {
      scale: 0.5,
      opacity: 0,
      filter: "brightness(0.5)",
    },
    visible: {
      scale: 1,
      opacity: 1,
      filter: "brightness(1)",
      transition: {
        duration: 0.6,
        ease: easings.animeEaseOut,
      },
    },
  } as Variants,

  // Glowing effect
  glow: {
    initial: {
      boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
    },
    hover: {
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      transition: transitions.smooth,
    },
  } as Variants,

  // Floating effect
  float: {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as Variants,

  // Pulse effect
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as Variants,

  // Shake effect (for errors)
  shake: {
    animate: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  } as Variants,
} as const;

// Micro-interaction presets
export const microInteractions = {
  // Button interactions
  button: {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: transitions.snap,
    },
    tap: {
      scale: 0.95,
      transition: transitions.snap,
    },
  } as Variants,

  buttonSubtle: {
    rest: { scale: 1, opacity: 1 },
    hover: {
      scale: 1.02,
      opacity: 0.9,
      transition: transitions.smooth,
    },
    tap: { scale: 0.98 },
  } as Variants,

  // Card interactions
  card: {
    rest: {
      scale: 1,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      transition: transitions.smooth,
    },
    tap: { scale: 0.98 },
  } as Variants,

  // Icon interactions
  icon: {
    rest: { rotate: 0, scale: 1 },
    hover: {
      rotate: 5,
      scale: 1.1,
      transition: transitions.snap,
    },
    tap: {
      rotate: -5,
      scale: 0.9,
    },
  } as Variants,

  // Input interactions
  input: {
    rest: { scale: 1, borderColor: "#d1d5db" },
    focus: {
      scale: 1.01,
      borderColor: "#3b82f6",
      transition: transitions.smooth,
    },
  } as Variants,
} as const;

// Page transition presets
export const pageTransitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.smooth,
  },

  slide: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    transition: transitions.animeSpring,
  },

  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.1, opacity: 0 },
    transition: transitions.dramatic,
  },
} as const;

export type EasingKey = keyof typeof easings;
export type DurationKey = keyof typeof durations;
export type TransitionKey = keyof typeof transitions;
export type SpecialEffectKey = keyof typeof specialEffects;
export type MicroInteractionKey = keyof typeof microInteractions;
