/**
 * Mobile-first breakpoint system
 * Anime-themed Python learning platform için responsive breakpoints
 */

// Breakpoint değerleri (mobile-first approach)
export const breakpoints = {
  xs: "320px", // Extra small phones
  sm: "640px", // Small phones and large phones
  md: "768px", // Tablets
  lg: "1024px", // Small laptops
  xl: "1280px", // Large laptops
  "2xl": "1536px", // Desktop monitors
} as const;

// Media query helpers
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  "2xl": `(min-width: ${breakpoints["2xl"]})`,

  // Max-width queries (for specific ranges)
  maxXs: `(max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  maxSm: `(max-width: ${parseInt(breakpoints.md) - 1}px)`,
  maxMd: `(max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  maxLg: `(max-width: ${parseInt(breakpoints.xl) - 1}px)`,
  maxXl: `(max-width: ${parseInt(breakpoints["2xl"]) - 1}px)`,

  // Range queries
  smToMd: `(min-width: ${breakpoints.sm}) and (max-width: ${
    parseInt(breakpoints.lg) - 1
  }px)`,
  mdToLg: `(min-width: ${breakpoints.md}) and (max-width: ${
    parseInt(breakpoints.xl) - 1
  }px)`,
  lgToXl: `(min-width: ${breakpoints.lg}) and (max-width: ${
    parseInt(breakpoints["2xl"]) - 1
  }px)`,

  // Orientation queries
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",

  // Device-specific queries
  mobile: `(max-width: ${parseInt(breakpoints.md) - 1}px)`,
  tablet: `(min-width: ${breakpoints.md}) and (max-width: ${
    parseInt(breakpoints.lg) - 1
  }px)`,
  desktop: `(min-width: ${breakpoints.lg})`,

  // High DPI displays
  retina: "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",

  // Touch devices
  touch: "(pointer: coarse)",
  noTouch: "(pointer: fine)",

  // Hover capability
  hover: "(hover: hover)",
  noHover: "(hover: none)",

  // Motion preferences
  motionReduce: "(prefers-reduced-motion: reduce)",
  motionNoPreference: "(prefers-reduced-motion: no-preference)",

  // Color scheme preferences
  darkMode: "(prefers-color-scheme: dark)",
  lightMode: "(prefers-color-scheme: light)",
} as const;

// Container max-widths
export const containerSizes = {
  xs: "100%",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Grid system
export const gridCols = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "11",
  12: "12",
} as const;

// Responsive spacing scale
export const responsiveSpacing = {
  // Padding
  px: {
    xs: "1rem", // 16px
    sm: "1.5rem", // 24px
    md: "2rem", // 32px
    lg: "2.5rem", // 40px
    xl: "3rem", // 48px
    "2xl": "4rem", // 64px
  },

  // Margins
  mx: {
    xs: "1rem",
    sm: "1.5rem",
    md: "2rem",
    lg: "3rem",
    xl: "4rem",
    "2xl": "6rem",
  },

  // Gap for flexbox/grid
  gap: {
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "2.5rem", // 40px
    "2xl": "3rem", // 48px
  },
} as const;

// Typography responsive scales
export const responsiveTypography = {
  fontSize: {
    xs: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    sm: {
      xs: "0.875rem",
      sm: "1rem",
      base: "1.125rem",
      lg: "1.25rem",
      xl: "1.5rem",
      "2xl": "1.875rem",
      "3xl": "2.25rem",
      "4xl": "3rem",
    },
    md: {
      xs: "1rem",
      sm: "1.125rem",
      base: "1.25rem",
      lg: "1.5rem",
      xl: "1.875rem",
      "2xl": "2.25rem",
      "3xl": "3rem",
      "4xl": "3.75rem",
    },
  },

  lineHeight: {
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
} as const;

export type Breakpoint = keyof typeof breakpoints;
export type MediaQuery = keyof typeof mediaQueries;
export type ContainerSize = keyof typeof containerSizes;
export type GridCols = keyof typeof gridCols;
