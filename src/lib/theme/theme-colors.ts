/**
 * Theme Colors
 * Color definitions and utilities for light/dark mode themes
 */

export const themeColors = {
  light: {
    // Background colors
    background: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      tertiary: "#f1f5f9",
      overlay: "rgba(0, 0, 0, 0.1)",
      modal: "#ffffff",
    },

    // Text colors
    text: {
      primary: "#1e293b",
      secondary: "#475569",
      tertiary: "#64748b",
      muted: "#94a3b8",
      inverse: "#ffffff",
    },

    // Border colors
    border: {
      primary: "#e2e8f0",
      secondary: "#cbd5e1",
      focus: "#3b82f6",
      error: "#ef4444",
      success: "#22c55e",
    },

    // Brand colors (same for both themes)
    brand: {
      primary: "#6366f1",
      secondary: "#ec4899",
      accent: "#f59e0b",
    },

    // Anime-themed colors
    anime: {
      sakura: "#ffb3d1",
      ocean: "#7dd3fc",
      sunset: "#fbbf24",
      forest: "#86efac",
      nebula: "#a78bfa",
      fire: "#fb7185",
    },

    // Status colors
    status: {
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },

    // Card rarity colors
    rarity: {
      common: "#6b7280",
      uncommon: "#22c55e",
      rare: "#3b82f6",
      epic: "#a855f7",
      legendary: "#f59e0b",
      mythic: "#ef4444",
    },
  },

  dark: {
    // Background colors
    background: {
      primary: "#0f172a",
      secondary: "#1e293b",
      tertiary: "#334155",
      overlay: "rgba(0, 0, 0, 0.5)",
      modal: "#1e293b",
    },

    // Text colors
    text: {
      primary: "#f8fafc",
      secondary: "#e2e8f0",
      tertiary: "#cbd5e1",
      muted: "#94a3b8",
      inverse: "#1e293b",
    },

    // Border colors
    border: {
      primary: "#334155",
      secondary: "#475569",
      focus: "#60a5fa",
      error: "#f87171",
      success: "#4ade80",
    },

    // Brand colors (same for both themes)
    brand: {
      primary: "#6366f1",
      secondary: "#ec4899",
      accent: "#f59e0b",
    },

    // Anime-themed colors (darker variants)
    anime: {
      sakura: "#db2777",
      ocean: "#0ea5e9",
      sunset: "#d97706",
      forest: "#059669",
      nebula: "#8b5cf6",
      fire: "#dc2626",
    },

    // Status colors
    status: {
      success: "#4ade80",
      warning: "#fbbf24",
      error: "#f87171",
      info: "#60a5fa",
    },

    // Card rarity colors (enhanced for dark mode)
    rarity: {
      common: "#9ca3af",
      uncommon: "#4ade80",
      rare: "#60a5fa",
      epic: "#c084fc",
      legendary: "#fbbf24",
      mythic: "#f87171",
    },
  },
} as const;

export type ThemeMode = keyof typeof themeColors;
export type ColorCategory = keyof typeof themeColors.light;
export type ColorName<T extends ColorCategory> =
  keyof (typeof themeColors.light)[T];

// Utility function to get theme-specific colors
export const getThemeColor = <T extends ColorCategory>(
  theme: ThemeMode,
  category: T,
  name: ColorName<T>
): string => {
  return themeColors[theme][category][
    name as keyof (typeof themeColors)[ThemeMode][T]
  ] as string;
};

// Create CSS custom properties for theme colors
export const createThemeVariables = (theme: ThemeMode) => {
  const colors = themeColors[theme];
  const variables: Record<string, string> = {};

  // Flatten color object into CSS variables
  Object.entries(colors).forEach(([category, categoryColors]) => {
    Object.entries(categoryColors as Record<string, string>).forEach(
      ([name, value]) => {
        variables[`--color-${category}-${name}`] = value as string;
      }
    );
  });

  return variables;
};

// Apply theme variables to document
export const applyThemeVariables = (theme: ThemeMode) => {
  if (typeof document === "undefined") return;

  const variables = createThemeVariables(theme);
  const root = document.documentElement;

  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

// Generate theme-aware Tailwind CSS classes
export const createThemeClasses = (theme: ThemeMode) => {
  return {
    background: {
      primary: theme === "dark" ? "bg-slate-900" : "bg-white",
      secondary: theme === "dark" ? "bg-slate-800" : "bg-slate-50",
      tertiary: theme === "dark" ? "bg-slate-700" : "bg-slate-100",
    },
    text: {
      primary: theme === "dark" ? "text-slate-100" : "text-slate-900",
      secondary: theme === "dark" ? "text-slate-200" : "text-slate-600",
      muted: theme === "dark" ? "text-slate-400" : "text-slate-500",
    },
    border: {
      primary: theme === "dark" ? "border-slate-700" : "border-slate-200",
      secondary: theme === "dark" ? "border-slate-600" : "border-slate-300",
    },
  };
};

// Generate gradients for theme
export const themeGradients = {
  light: {
    primary: "bg-gradient-to-br from-indigo-500 to-purple-600",
    secondary: "bg-gradient-to-br from-pink-500 to-rose-500",
    accent: "bg-gradient-to-br from-amber-400 to-orange-500",
    anime: {
      sakura: "bg-gradient-to-br from-pink-300 to-pink-500",
      ocean: "bg-gradient-to-br from-blue-400 to-cyan-500",
      sunset: "bg-gradient-to-br from-yellow-400 to-orange-500",
      forest: "bg-gradient-to-br from-green-400 to-emerald-500",
      nebula: "bg-gradient-to-br from-purple-400 to-indigo-500",
      fire: "bg-gradient-to-br from-red-400 to-pink-500",
    },
  },
  dark: {
    primary: "bg-gradient-to-br from-indigo-600 to-purple-700",
    secondary: "bg-gradient-to-br from-pink-600 to-rose-600",
    accent: "bg-gradient-to-br from-amber-500 to-orange-600",
    anime: {
      sakura: "bg-gradient-to-br from-pink-500 to-pink-700",
      ocean: "bg-gradient-to-br from-blue-600 to-cyan-700",
      sunset: "bg-gradient-to-br from-yellow-500 to-orange-600",
      forest: "bg-gradient-to-br from-green-600 to-emerald-700",
      nebula: "bg-gradient-to-br from-purple-600 to-indigo-700",
      fire: "bg-gradient-to-br from-red-600 to-pink-700",
    },
  },
};

// Color contrast utilities
export const getContrastColor = (backgroundColor: string): "light" | "dark" => {
  // Simple contrast detection - in real app you'd use a proper algorithm
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "dark" : "light";
};

// Theme-aware shadow utilities
export const themeShadows = {
  light: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  dark: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
  },
};
