/**
 * Responsive System Index
 * Mobile-first responsive design tools for anime-themed Python learning platform
 */

// Breakpoints and media queries
export {
  breakpoints,
  mediaQueries,
  containerSizes,
  gridCols,
  responsiveSpacing,
  responsiveTypography,
  type Breakpoint,
  type MediaQuery,
  type ContainerSize,
  type GridCols,
} from "./breakpoints";

// React hooks
export {
  useMediaQuery,
  useBreakpoint,
  useDeviceCapabilities,
  useWindowSize,
  useOrientation,
  useResponsiveValue,
  useResponsiveColumns,
  useContainerSize,
} from "./hooks";

// Alias for useBreakpoint (legacy compatibility)
export { useBreakpoint as useResponsive } from "./hooks";

// React components
export {
  Container,
  Grid,
  Flex,
  Stack,
  Spacer,
  Show,
  Hide,
  Padding,
} from "./components";

// Import for internal use
import { breakpoints, type Breakpoint } from "./breakpoints";

// Utility functions
export const responsive = {
  // Quick media query builders
  above: (breakpoint: Breakpoint) => `(min-width: ${breakpoints[breakpoint]})`,
  below: (breakpoint: Breakpoint) => {
    const bpValues: Record<Breakpoint, number> = {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
    };
    return `(max-width: ${bpValues[breakpoint] - 1}px)`;
  },
  between: (min: Breakpoint, max: Breakpoint) =>
    `(min-width: ${breakpoints[min]}) and (max-width: ${breakpoints[max]})`,

  // Responsive value helpers
  createResponsiveValue: <T>(values: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    "2xl"?: T;
  }) => values,

  // Common responsive patterns
  mobileFirst: <T>(mobile: T, desktop: T) => ({
    xs: mobile,
    md: desktop,
  }),

  tabletFirst: <T>(mobile: T, tablet: T, desktop: T) => ({
    xs: mobile,
    md: tablet,
    lg: desktop,
  }),

  // Grid helpers
  responsiveGrid: (
    cols:
      | number
      | {
          xs?: number;
          sm?: number;
          md?: number;
          lg?: number;
          xl?: number;
          "2xl"?: number;
        }
  ) => {
    if (typeof cols === "number") {
      return { xs: 1, md: Math.ceil(cols / 2), lg: cols };
    }
    return cols;
  },
};
