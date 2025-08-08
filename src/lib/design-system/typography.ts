// Typography System for Anime Python Learning Platform
export const typography = {
  // Font Families
  fontFamily: {
    // Primary font for headings and UI
    primary: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ],

    // Secondary font for body text
    secondary: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ],

    // Monospace for code
    mono: [
      '"JetBrains Mono"',
      '"Fira Code"',
      "Consolas",
      '"Monaco"',
      '"Cascadia Code"',
      '"SF Mono"',
      '"Roboto Mono"',
      "monospace",
    ],

    // Japanese/Anime inspired decorative font
    japanese: [
      '"Noto Sans JP"',
      '"Hiragino Sans"',
      '"Yu Gothic"',
      "Meiryo",
      "sans-serif",
    ],

    // Playful font for gamification elements
    playful: ['"Comic Neue"', '"Nunito"', '"Quicksand"', "sans-serif"],
  },

  // Font Sizes (using rem for scalability)
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
    "7xl": "4.5rem", // 72px
    "8xl": "6rem", // 96px
    "9xl": "8rem", // 128px
  },

  // Font Weights
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },

  // Line Heights
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  // Letter Spacing
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// Typography Presets for specific use cases
export const typographyPresets = {
  // Display text (hero sections, major headings)
  display: {
    large: {
      fontSize: typography.fontSize["6xl"],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    medium: {
      fontSize: typography.fontSize["5xl"],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    small: {
      fontSize: typography.fontSize["4xl"],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
  },

  // Headings
  heading: {
    h1: {
      fontSize: typography.fontSize["3xl"],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    h2: {
      fontSize: typography.fontSize["2xl"],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    h3: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    h4: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    h5: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    h6: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
  },

  // Body text
  body: {
    large: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.secondary.join(", "),
    },
    medium: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.secondary.join(", "),
    },
    small: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.secondary.join(", "),
    },
  },

  // Code text
  code: {
    large: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.mono.join(", "),
    },
    medium: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.mono.join(", "),
    },
    small: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.mono.join(", "),
    },
  },

  // UI Labels and captions
  label: {
    large: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    medium: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    small: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wider,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
  },

  // Gamification specific styles
  gamification: {
    achievement: {
      fontSize: typography.fontSize["2xl"],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.wide,
      fontFamily: typography.fontFamily.playful.join(", "),
    },
    badge: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.none,
      letterSpacing: typography.letterSpacing.widest,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    level: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.none,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.primary.join(", "),
    },
    stats: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.none,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.mono.join(", "),
    },
  },

  // Japanese/Anime inspired text
  japanese: {
    heading: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.japanese.join(", "),
    },
    body: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed,
      letterSpacing: typography.letterSpacing.normal,
      fontFamily: typography.fontFamily.japanese.join(", "),
    },
  },
} as const;

// Utility functions
export const getTypographyStyle = (
  preset: keyof typeof typographyPresets,
  variant?: string
) => {
  const presetGroup = typographyPresets[preset];
  if (!presetGroup) return {};

  if (variant && variant in presetGroup) {
    return (presetGroup as any)[variant];
  }

  // Return first available variant if no specific variant requested
  const firstKey = Object.keys(presetGroup)[0];
  return (presetGroup as any)[firstKey];
};

// CSS-in-JS compatible styles
export const typographyCSS = {
  // Generate CSS class names
  generateCSS: () => {
    const css: Record<string, any> = {};

    Object.entries(typographyPresets).forEach(([presetName, variants]) => {
      Object.entries(variants).forEach(([variantName, styles]) => {
        const className = `typography-${presetName}-${variantName}`;
        css[className] = styles;
      });
    });

    return css;
  },

  // Get Tailwind-compatible classes
  getTailwindClasses: (
    preset: keyof typeof typographyPresets,
    variant: string
  ) => {
    const style = getTypographyStyle(preset, variant);
    if (!style) return "";

    const classes: string[] = [];

    // Font size mapping
    const fontSizeMap: Record<string, string> = {
      "0.75rem": "text-xs",
      "0.875rem": "text-sm",
      "1rem": "text-base",
      "1.125rem": "text-lg",
      "1.25rem": "text-xl",
      "1.5rem": "text-2xl",
      "1.875rem": "text-3xl",
      "2.25rem": "text-4xl",
      "3rem": "text-5xl",
      "3.75rem": "text-6xl",
    };

    // Font weight mapping
    const fontWeightMap: Record<string, string> = {
      "300": "font-light",
      "400": "font-normal",
      "500": "font-medium",
      "600": "font-semibold",
      "700": "font-bold",
      "800": "font-extrabold",
    };

    if (style.fontSize && fontSizeMap[style.fontSize]) {
      classes.push(fontSizeMap[style.fontSize]);
    }

    if (style.fontWeight && fontWeightMap[style.fontWeight]) {
      classes.push(fontWeightMap[style.fontWeight]);
    }

    return classes.join(" ");
  },
};

// Responsive typography scales
export const responsiveTypography = {
  mobile: {
    display: { large: "2.5rem", medium: "2rem", small: "1.75rem" },
    heading: { h1: "1.5rem", h2: "1.25rem", h3: "1.125rem" },
    body: { large: "1rem", medium: "0.875rem", small: "0.75rem" },
  },
  tablet: {
    display: { large: "4rem", medium: "3rem", small: "2.25rem" },
    heading: { h1: "2rem", h2: "1.5rem", h3: "1.25rem" },
    body: { large: "1.125rem", medium: "1rem", small: "0.875rem" },
  },
  desktop: {
    display: { large: "6rem", medium: "4.5rem", small: "3rem" },
    heading: { h1: "3rem", h2: "2.25rem", h3: "1.875rem" },
    body: { large: "1.25rem", medium: "1rem", small: "0.875rem" },
  },
};

export type TypographyPreset = keyof typeof typographyPresets;
export type TypographyVariant<T extends TypographyPreset> =
  keyof (typeof typographyPresets)[T];
