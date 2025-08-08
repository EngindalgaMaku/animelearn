// Design System Foundation - Main Export
export * from "./colors";
export * from "./typography";
export * from "./spacing";
export * from "./theme";

// Re-export commonly used types and utilities
export type {
  Theme,
  ThemeMode,
  ThemeContextValue,
  BreakpointKey,
  ShadowKey,
  AnimationKey,
} from "./theme";

export type { ColorSystem, ColorKey } from "./colors";

export type { TypographyPreset, TypographyVariant } from "./typography";

export type {
  SpacingKey,
  SemanticSpacingKey,
  ComponentSpacingKey,
} from "./spacing";

// Default theme exports for convenience
export {
  lightTheme as defaultTheme,
  darkTheme,
  createTheme,
  themeUtils,
  cssVariables,
} from "./theme";

// Quick access to commonly used design tokens
export { colors, getColorValue, withAlpha, createColorSystem } from "./colors";

export {
  typography,
  typographyPresets,
  getTypographyStyle,
  typographyCSS,
} from "./typography";

export {
  spacing,
  getSpacing,
  spacingClasses,
  spacingPresets,
  createResponsiveSpacing,
} from "./spacing";
