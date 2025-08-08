// Anime-inspired Color Palette for Python Learning Platform
export const colors = {
  // Primary Colors - Anime inspired
  primary: {
    50: "#f0f4ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1", // Main primary
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },

  // Secondary Colors - Cherry blossom pink
  secondary: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899", // Main secondary
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724",
  },

  // Accent Colors - Japanese aesthetics
  accent: {
    gold: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b", // Main gold
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    teal: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6", // Main teal
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
  },

  // Semantic Colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Main success
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Main warning
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Main error
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Main info
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Neutrals - Clean and modern
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373", // Main neutral
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },

  // Special gradients for anime effects
  gradients: {
    sakura: "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 50%, #ec4899 100%)",
    ocean: "linear-gradient(135deg, #e0f2fe 0%, #0891b2 50%, #0e7490 100%)",
    sunset: "linear-gradient(135deg, #fef3c7 0%, #f59e0b 50%, #d97706 100%)",
    forest: "linear-gradient(135deg, #dcfce7 0%, #22c55e 50%, #15803d 100%)",
    nebula: "linear-gradient(135deg, #e0e7ff 0%, #6366f1 50%, #4338ca 100%)",
    fire: "linear-gradient(135deg, #fee2e2 0%, #ef4444 50%, #dc2626 100%)",
  },

  // Python code syntax highlighting
  syntax: {
    keyword: "#8b5cf6", // Purple for keywords (def, class, if, etc.)
    string: "#10b981", // Green for strings
    number: "#f59e0b", // Orange for numbers
    comment: "#6b7280", // Gray for comments
    function: "#3b82f6", // Blue for functions
    variable: "#ef4444", // Red for variables
    operator: "#8b5cf6", // Purple for operators
    background: "#1f2937", // Dark background
    text: "#f9fafb", // Light text
  },

  // Anime card rarity colors
  rarity: {
    common: {
      bg: "linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)",
      border: "#9ca3af",
      text: "#374151",
    },
    uncommon: {
      bg: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)",
      border: "#3b82f6",
      text: "#1e40af",
    },
    rare: {
      bg: "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)",
      border: "#ec4899",
      text: "#be185d",
    },
    epic: {
      bg: "linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)",
      border: "#8b5cf6",
      text: "#6d28d9",
    },
    legendary: {
      bg: "linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)",
      border: "#f59e0b",
      text: "#d97706",
    },
    mythic: {
      bg: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
      border: "#ef4444",
      text: "#dc2626",
    },
  },
} as const;

// Color utility functions
export const getColorValue = (
  colorPath: string,
  fallback = "#000000"
): string => {
  const keys = colorPath.split(".");
  let value: any = colors;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }

  return typeof value === "string" ? value : fallback;
};

// Alpha variants
export const withAlpha = (color: string, alpha: number): string => {
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const alphaHex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${hex}${alphaHex}`;
  }
  return color;
};

// Theme-aware color system
export const createColorSystem = (isDark = false) => ({
  background: {
    primary: isDark ? colors.neutral[900] : colors.neutral[50],
    secondary: isDark ? colors.neutral[800] : colors.neutral[100],
    tertiary: isDark ? colors.neutral[700] : colors.neutral[200],
  },
  text: {
    primary: isDark ? colors.neutral[100] : colors.neutral[900],
    secondary: isDark ? colors.neutral[300] : colors.neutral[700],
    tertiary: isDark ? colors.neutral[400] : colors.neutral[500],
  },
  border: {
    primary: isDark ? colors.neutral[700] : colors.neutral[300],
    secondary: isDark ? colors.neutral[600] : colors.neutral[200],
  },
  surface: {
    elevated: isDark ? colors.neutral[800] : "#ffffff",
    sunken: isDark ? colors.neutral[950] : colors.neutral[100],
  },
});

export type ColorSystem = ReturnType<typeof createColorSystem>;
export type ColorKey = keyof typeof colors;
