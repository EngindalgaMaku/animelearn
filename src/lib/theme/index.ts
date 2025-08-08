/**
 * Theme System Index
 * Light/Dark mode theme provider and utilities for anime-themed Python learning platform
 */

export { ThemeProvider, useTheme } from "./theme-provider";
export { ThemeToggle, AnimatedThemeToggle } from "./theme-toggle";
export { themeColors, createThemeVariables } from "./theme-colors";
export {
  useThemePreference,
  useSystemTheme,
  useThemeTransition,
} from "./theme-hooks";

// Theme types
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

// Theme configuration
export const themeConfig = {
  attribute: "class",
  defaultTheme: "system" as Theme,
  enableSystem: true,
  disableTransitionOnChange: false,
  storageKey: "anime-card-theme",

  // Animation durations for theme transitions
  transitions: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },

  // Theme-specific settings
  themes: {
    light: {
      name: "Light Mode",
      description: "Clean and bright interface perfect for daytime learning",
      icon: "☀️",
    },
    dark: {
      name: "Dark Mode",
      description: "Easy on the eyes for night-time coding sessions",
      icon: "🌙",
    },
    system: {
      name: "System",
      description: "Automatically follows your device preference",
      icon: "💻",
    },
  },
} as const;

// Utility functions
export const getThemeFromStorage = (
  key: string = themeConfig.storageKey
): Theme => {
  if (typeof window === "undefined") return themeConfig.defaultTheme;

  try {
    const stored = localStorage.getItem(key);
    return (stored as Theme) || themeConfig.defaultTheme;
  } catch {
    return themeConfig.defaultTheme;
  }
};

export const setThemeInStorage = (
  theme: Theme,
  key: string = themeConfig.storageKey
): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, theme);
  } catch {
    // Silently fail if localStorage is not available
  }
};

export const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const resolveTheme = (theme: Theme): ResolvedTheme => {
  return theme === "system" ? getSystemTheme() : theme;
};

// Theme CSS class utilities
export const getThemeClasses = (theme: ResolvedTheme) => {
  const baseClasses = "transition-colors duration-300";
  const themeClasses = theme === "dark" ? "dark" : "";

  return `${baseClasses} ${themeClasses}`.trim();
};

// Color mode detection utilities
export const isDarkMode = (theme: ResolvedTheme): boolean => theme === "dark";
export const isLightMode = (theme: ResolvedTheme): boolean => theme === "light";

// Theme event system
export const createThemeChangeEvent = (theme: ResolvedTheme) => {
  return new CustomEvent("themeChange", {
    detail: { theme, timestamp: Date.now() },
  });
};

export const dispatchThemeChange = (theme: ResolvedTheme) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(createThemeChangeEvent(theme));
  }
};

// Media query helpers
export const createThemeMediaQuery = () => {
  if (typeof window === "undefined") return null;

  return window.matchMedia("(prefers-color-scheme: dark)");
};

export const watchSystemTheme = (callback: (isDark: boolean) => void) => {
  const mediaQuery = createThemeMediaQuery();
  if (!mediaQuery) return () => {};

  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener("change", handler);

  return () => mediaQuery.removeEventListener("change", handler);
};
