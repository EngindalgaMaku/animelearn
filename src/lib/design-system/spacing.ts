// Spacing System for Anime Python Learning Platform
export const spacing = {
  // Base spacing unit (4px)
  unit: 4,

  // Spacing scale (in rem units)
  scale: {
    0: "0", // 0px
    px: "1px", // 1px
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    11: "2.75rem", // 44px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    28: "7rem", // 112px
    32: "8rem", // 128px
    36: "9rem", // 144px
    40: "10rem", // 160px
    44: "11rem", // 176px
    48: "12rem", // 192px
    52: "13rem", // 208px
    56: "14rem", // 224px
    60: "15rem", // 240px
    64: "16rem", // 256px
    72: "18rem", // 288px
    80: "20rem", // 320px
    96: "24rem", // 384px
  },

  // Semantic spacing for specific use cases
  semantic: {
    // Component internal spacing
    component: {
      xs: "0.25rem", // 4px - minimal padding
      sm: "0.5rem", // 8px - small padding
      md: "0.75rem", // 12px - medium padding
      lg: "1rem", // 16px - large padding
      xl: "1.5rem", // 24px - extra large padding
      "2xl": "2rem", // 32px - double extra large padding
    },

    // Layout spacing
    layout: {
      xs: "0.5rem", // 8px - tight sections
      sm: "1rem", // 16px - small sections
      md: "1.5rem", // 24px - medium sections
      lg: "2rem", // 32px - large sections
      xl: "3rem", // 48px - extra large sections
      "2xl": "4rem", // 64px - double extra large sections
      "3xl": "6rem", // 96px - triple extra large sections
      "4xl": "8rem", // 128px - quad extra large sections
    },

    // Content spacing
    content: {
      xs: "0.5rem", // 8px - tight content
      sm: "0.75rem", // 12px - small content
      md: "1rem", // 16px - medium content
      lg: "1.5rem", // 24px - large content
      xl: "2rem", // 32px - extra large content
    },

    // Stack spacing (for vertical layouts)
    stack: {
      xs: "0.25rem", // 4px - minimal stack
      sm: "0.5rem", // 8px - small stack
      md: "0.75rem", // 12px - medium stack
      lg: "1rem", // 16px - large stack
      xl: "1.5rem", // 24px - extra large stack
      "2xl": "2rem", // 32px - double extra large stack
      "3xl": "3rem", // 48px - triple extra large stack
    },

    // Inline spacing (for horizontal layouts)
    inline: {
      xs: "0.25rem", // 4px - minimal inline
      sm: "0.5rem", // 8px - small inline
      md: "0.75rem", // 12px - medium inline
      lg: "1rem", // 16px - large inline
      xl: "1.5rem", // 24px - extra large inline
      "2xl": "2rem", // 32px - double extra large inline
    },
  },

  // Specific component spacing patterns
  components: {
    // Card spacing
    card: {
      padding: {
        sm: "0.75rem", // 12px
        md: "1rem", // 16px
        lg: "1.5rem", // 24px
        xl: "2rem", // 32px
      },
      gap: {
        sm: "0.5rem", // 8px
        md: "0.75rem", // 12px
        lg: "1rem", // 16px
      },
    },

    // Form spacing
    form: {
      fieldGap: "1rem", // 16px - between form fields
      groupGap: "1.5rem", // 24px - between form groups
      labelGap: "0.25rem", // 4px - between label and input
      buttonGap: "0.75rem", // 12px - between buttons
    },

    // Navigation spacing
    navigation: {
      itemGap: "0.5rem", // 8px - between nav items
      sectionGap: "1rem", // 16px - between nav sections
      padding: "0.75rem", // 12px - nav item padding
    },

    // Button spacing
    button: {
      padding: {
        xs: "0.25rem 0.5rem", // 4px 8px
        sm: "0.375rem 0.75rem", // 6px 12px
        md: "0.5rem 1rem", // 8px 16px
        lg: "0.75rem 1.5rem", // 12px 24px
        xl: "1rem 2rem", // 16px 32px
      },
      gap: "0.5rem", // 8px - between button elements
    },

    // Modal/Dialog spacing
    modal: {
      padding: "1.5rem", // 24px - modal content padding
      headerGap: "1rem", // 16px - between header elements
      contentGap: "1.5rem", // 24px - between content sections
      footerGap: "0.75rem", // 12px - between footer buttons
    },

    // List spacing
    list: {
      itemGap: "0.5rem", // 8px - between list items
      nestedIndent: "1rem", // 16px - nested list indentation
      iconGap: "0.5rem", // 8px - between icon and text
    },

    // Grid spacing
    grid: {
      gap: {
        xs: "0.5rem", // 8px
        sm: "0.75rem", // 12px
        md: "1rem", // 16px
        lg: "1.5rem", // 24px
        xl: "2rem", // 32px
      },
    },

    // Gamification specific spacing
    gamification: {
      badge: {
        padding: "0.25rem 0.5rem", // 4px 8px
        gap: "0.25rem", // 4px
      },
      achievement: {
        padding: "1rem", // 16px
        gap: "0.75rem", // 12px
      },
      progress: {
        gap: "0.5rem", // 8px
      },
      stats: {
        gap: "1rem", // 16px
      },
    },
  },

  // Responsive spacing breakpoints
  responsive: {
    mobile: {
      container: "1rem", // 16px - mobile container padding
      section: "1.5rem", // 24px - mobile section spacing
      content: "1rem", // 16px - mobile content spacing
    },
    tablet: {
      container: "2rem", // 32px - tablet container padding
      section: "2rem", // 32px - tablet section spacing
      content: "1.5rem", // 24px - tablet content spacing
    },
    desktop: {
      container: "3rem", // 48px - desktop container padding
      section: "3rem", // 48px - desktop section spacing
      content: "2rem", // 32px - desktop content spacing
    },
  },
} as const;

// Spacing utility functions
export const getSpacing = (key: string): string => {
  const keys = key.split(".");
  let value: any = spacing;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return spacing.scale[4]; // fallback to 1rem
    }
  }

  return typeof value === "string" ? value : spacing.scale[4];
};

// Generate spacing classes for CSS-in-JS
export const spacingClasses = {
  // Margin classes
  margin: {
    all: (size: keyof typeof spacing.scale) => ({
      margin: spacing.scale[size],
    }),
    top: (size: keyof typeof spacing.scale) => ({
      marginTop: spacing.scale[size],
    }),
    right: (size: keyof typeof spacing.scale) => ({
      marginRight: spacing.scale[size],
    }),
    bottom: (size: keyof typeof spacing.scale) => ({
      marginBottom: spacing.scale[size],
    }),
    left: (size: keyof typeof spacing.scale) => ({
      marginLeft: spacing.scale[size],
    }),
    horizontal: (size: keyof typeof spacing.scale) => ({
      marginLeft: spacing.scale[size],
      marginRight: spacing.scale[size],
    }),
    vertical: (size: keyof typeof spacing.scale) => ({
      marginTop: spacing.scale[size],
      marginBottom: spacing.scale[size],
    }),
  },

  // Padding classes
  padding: {
    all: (size: keyof typeof spacing.scale) => ({
      padding: spacing.scale[size],
    }),
    top: (size: keyof typeof spacing.scale) => ({
      paddingTop: spacing.scale[size],
    }),
    right: (size: keyof typeof spacing.scale) => ({
      paddingRight: spacing.scale[size],
    }),
    bottom: (size: keyof typeof spacing.scale) => ({
      paddingBottom: spacing.scale[size],
    }),
    left: (size: keyof typeof spacing.scale) => ({
      paddingLeft: spacing.scale[size],
    }),
    horizontal: (size: keyof typeof spacing.scale) => ({
      paddingLeft: spacing.scale[size],
      paddingRight: spacing.scale[size],
    }),
    vertical: (size: keyof typeof spacing.scale) => ({
      paddingTop: spacing.scale[size],
      paddingBottom: spacing.scale[size],
    }),
  },

  // Gap classes
  gap: {
    all: (size: keyof typeof spacing.scale) => ({ gap: spacing.scale[size] }),
    column: (size: keyof typeof spacing.scale) => ({
      columnGap: spacing.scale[size],
    }),
    row: (size: keyof typeof spacing.scale) => ({
      rowGap: spacing.scale[size],
    }),
  },
};

// Preset spacing combinations for common patterns
export const spacingPresets = {
  // Card layouts
  card: {
    compact: {
      padding: spacing.components.card.padding.sm,
      gap: spacing.components.card.gap.sm,
    },
    comfortable: {
      padding: spacing.components.card.padding.md,
      gap: spacing.components.card.gap.md,
    },
    spacious: {
      padding: spacing.components.card.padding.lg,
      gap: spacing.components.card.gap.lg,
    },
  },

  // Stack layouts
  stack: {
    tight: { gap: spacing.semantic.stack.xs },
    normal: { gap: spacing.semantic.stack.md },
    loose: { gap: spacing.semantic.stack.xl },
  },

  // Inline layouts
  inline: {
    tight: { gap: spacing.semantic.inline.xs },
    normal: { gap: spacing.semantic.inline.md },
    loose: { gap: spacing.semantic.inline.xl },
  },

  // Section layouts
  section: {
    tight: {
      padding: spacing.semantic.layout.sm,
      gap: spacing.semantic.content.sm,
    },
    normal: {
      padding: spacing.semantic.layout.md,
      gap: spacing.semantic.content.md,
    },
    loose: {
      padding: spacing.semantic.layout.lg,
      gap: spacing.semantic.content.lg,
    },
  },
};

// Generate responsive spacing utilities
export const createResponsiveSpacing = (
  baseSize: keyof typeof spacing.scale
) => ({
  mobile:
    spacing.scale[
      Math.max(0, Number(baseSize) - 1) as keyof typeof spacing.scale
    ] || spacing.scale[baseSize],
  tablet: spacing.scale[baseSize],
  desktop:
    spacing.scale[
      Math.min(96, Number(baseSize) + 1) as keyof typeof spacing.scale
    ] || spacing.scale[baseSize],
});

// Anime-specific spacing patterns
export const animeSpacing = {
  // Manga panel inspired layouts
  panel: {
    gap: spacing.scale[2], // 8px - tight panel spacing
    padding: spacing.scale[4], // 16px - panel content padding
    border: spacing.scale[1], // 4px - panel border spacing
  },

  // Card game inspired layouts
  cardGame: {
    hand: spacing.scale[3], // 12px - between cards in hand
    field: spacing.scale[6], // 24px - between field zones
    stack: spacing.scale[1], // 4px - between stacked cards
  },

  // Dialog/speech bubble spacing
  dialog: {
    bubble: spacing.scale[3], // 12px - inside speech bubble
    between: spacing.scale[4], // 16px - between dialog bubbles
    character: spacing.scale[6], // 24px - between character and dialog
  },
};

export type SpacingKey = keyof typeof spacing.scale;
export type SemanticSpacingKey = keyof typeof spacing.semantic;
export type ComponentSpacingKey = keyof typeof spacing.components;
