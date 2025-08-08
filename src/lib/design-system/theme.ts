// Theme System for Anime Python Learning Platform
import { colors, createColorSystem, type ColorSystem } from "./colors";
import { typography, typographyPresets } from "./typography";
import { spacing } from "./spacing";

// Shadows and elevation
export const shadows = {
  none: "none",
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",

  // Anime-inspired special shadows
  glow: {
    primary: `0 0 20px ${colors.primary[500]}40`,
    secondary: `0 0 20px ${colors.secondary[500]}40`,
    success: `0 0 20px ${colors.success[500]}40`,
    warning: `0 0 20px ${colors.warning[500]}40`,
    error: `0 0 20px ${colors.error[500]}40`,
    gold: `0 0 20px ${colors.accent.gold[500]}40`,
    teal: `0 0 20px ${colors.accent.teal[500]}40`,
  },

  // Card/component specific shadows
  card: {
    default: "0 2px 8px rgb(0 0 0 / 0.1)",
    hover: "0 8px 25px rgb(0 0 0 / 0.15)",
    active: "0 1px 3px rgb(0 0 0 / 0.12)",
  },

  // Elevation levels
  elevation: {
    0: "none",
    1: "0 1px 3px rgb(0 0 0 / 0.12), 0 1px 2px rgb(0 0 0 / 0.24)",
    2: "0 3px 6px rgb(0 0 0 / 0.16), 0 3px 6px rgb(0 0 0 / 0.23)",
    3: "0 10px 20px rgb(0 0 0 / 0.19), 0 6px 6px rgb(0 0 0 / 0.23)",
    4: "0 14px 28px rgb(0 0 0 / 0.25), 0 10px 10px rgb(0 0 0 / 0.22)",
    5: "0 19px 38px rgb(0 0 0 / 0.30), 0 15px 12px rgb(0 0 0 / 0.22)",
  },
} as const;

// Border radius
export const borderRadius = {
  none: "0px",
  xs: "0.125rem", // 2px
  sm: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",

  // Component specific radius
  button: "0.375rem",
  card: "0.75rem",
  input: "0.375rem",
  badge: "9999px",
  modal: "1rem",
} as const;

// Animation and transitions
export const animations = {
  // Duration
  duration: {
    fastest: "75ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slowest: "500ms",
  },

  // Easing functions
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",

    // Anime-inspired easings
    elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    snappy: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  },

  // Common transitions
  transition: {
    all: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    colors:
      "color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    shadow: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Keyframes for common animations
  keyframes: {
    fadeIn: {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" },
    },
    fadeOut: {
      "0%": { opacity: "1" },
      "100%": { opacity: "0" },
    },
    slideUp: {
      "0%": { transform: "translateY(10px)", opacity: "0" },
      "100%": { transform: "translateY(0)", opacity: "1" },
    },
    slideDown: {
      "0%": { transform: "translateY(-10px)", opacity: "0" },
      "100%": { transform: "translateY(0)", opacity: "1" },
    },
    scaleIn: {
      "0%": { transform: "scale(0.9)", opacity: "0" },
      "100%": { transform: "scale(1)", opacity: "1" },
    },
    bounce: {
      "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
      "40%, 43%": { transform: "translate3d(0, -30px, 0)" },
      "70%": { transform: "translate3d(0, -15px, 0)" },
      "90%": { transform: "translate3d(0, -4px, 0)" },
    },
    shake: {
      "0%, 100%": { transform: "translateX(0)" },
      "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
      "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
    },
    pulse: {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.5" },
    },
    spin: {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  },
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Z-index layers
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Theme configuration
export interface Theme {
  colors: typeof colors & { system: ColorSystem };
  typography: typeof typography;
  typographyPresets: typeof typographyPresets;
  spacing: typeof spacing;
  shadows: typeof shadows;
  borderRadius: typeof borderRadius;
  animations: typeof animations;
  breakpoints: typeof breakpoints;
  zIndex: typeof zIndex;
  mode: "light" | "dark";
}

// Create theme function
export const createTheme = (mode: "light" | "dark" = "light"): Theme => ({
  colors: {
    ...colors,
    system: createColorSystem(mode === "dark"),
  },
  typography,
  typographyPresets,
  spacing,
  shadows,
  borderRadius,
  animations,
  breakpoints,
  zIndex,
  mode,
});

// Default themes
export const lightTheme = createTheme("light");
export const darkTheme = createTheme("dark");

// Theme context value type
export type ThemeContextValue = {
  theme: Theme;
  toggleMode: () => void;
  setMode: (mode: "light" | "dark") => void;
};

// Utility functions for theme usage
export const themeUtils = {
  // Get responsive value
  getResponsiveValue: <T>(
    values: Partial<Record<keyof typeof breakpoints, T>>,
    fallback: T
  ): T => {
    // This would typically use a hook to get current breakpoint
    // For now, return the fallback
    return fallback;
  },

  // Get color with opacity
  getColorWithOpacity: (color: string, opacity: number): string => {
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },

  // Get elevation shadow
  getElevation: (level: keyof typeof shadows.elevation): string => {
    return shadows.elevation[level];
  },

  // Create responsive styles
  createResponsiveStyles: (styles: Record<string, any>) => {
    return styles; // This would be enhanced with actual responsive logic
  },
};

// CSS custom properties for theme
export const cssVariables = (theme: Theme) => ({
  // Colors
  "--color-primary": theme.colors.primary[500],
  "--color-primary-light": theme.colors.primary[400],
  "--color-primary-dark": theme.colors.primary[600],
  "--color-secondary": theme.colors.secondary[500],
  "--color-success": theme.colors.success[500],
  "--color-warning": theme.colors.warning[500],
  "--color-error": theme.colors.error[500],
  "--color-info": theme.colors.info[500],

  // System colors
  "--color-background": theme.colors.system.background.primary,
  "--color-surface": theme.colors.system.surface.elevated,
  "--color-text": theme.colors.system.text.primary,
  "--color-text-secondary": theme.colors.system.text.secondary,
  "--color-border": theme.colors.system.border.primary,

  // Typography
  "--font-family-primary": theme.typography.fontFamily.primary.join(", "),
  "--font-family-mono": theme.typography.fontFamily.mono.join(", "),

  // Spacing
  "--spacing-unit": theme.spacing.scale[1],
  "--spacing-sm": theme.spacing.scale[2],
  "--spacing-md": theme.spacing.scale[4],
  "--spacing-lg": theme.spacing.scale[8],

  // Radius
  "--radius-sm": theme.borderRadius.sm,
  "--radius-md": theme.borderRadius.md,
  "--radius-lg": theme.borderRadius.lg,

  // Shadows
  "--shadow-sm": theme.shadows.sm,
  "--shadow-md": theme.shadows.md,
  "--shadow-lg": theme.shadows.lg,

  // Transitions
  "--transition-fast": theme.animations.transition.all,
  "--transition-colors": theme.animations.transition.colors,
});

export type ThemeMode = "light" | "dark";
export type BreakpointKey = keyof typeof breakpoints;
export type ShadowKey = keyof typeof shadows;
export type AnimationKey = keyof typeof animations.keyframes;
