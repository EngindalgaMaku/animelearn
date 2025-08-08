"use client";

import { useState, useEffect } from "react";
import { mediaQueries, breakpoints, type Breakpoint } from "./breakpoints";

/**
 * Media query hook - belirli bir media query'nin durumunu izler
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // SSR compatibility check
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

/**
 * Breakpoint hook - aktif breakpoint'i döndürür
 */
export function useBreakpoint(): {
  current: Breakpoint;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const isXs = useMediaQuery(mediaQueries.xs);
  const isSm = useMediaQuery(mediaQueries.sm);
  const isMd = useMediaQuery(mediaQueries.md);
  const isLg = useMediaQuery(mediaQueries.lg);
  const isXl = useMediaQuery(mediaQueries.xl);
  const is2Xl = useMediaQuery(mediaQueries["2xl"]);

  const isMobile = useMediaQuery(mediaQueries.mobile);
  const isTablet = useMediaQuery(mediaQueries.tablet);
  const isDesktop = useMediaQuery(mediaQueries.desktop);

  // Determine current breakpoint
  let current: Breakpoint = "xs";
  if (is2Xl) current = "2xl";
  else if (isXl) current = "xl";
  else if (isLg) current = "lg";
  else if (isMd) current = "md";
  else if (isSm) current = "sm";

  return {
    current,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile,
    isTablet,
    isDesktop,
  };
}

/**
 * Device capabilities hook
 */
export function useDeviceCapabilities() {
  const hasTouch = useMediaQuery(mediaQueries.touch);
  const hasHover = useMediaQuery(mediaQueries.hover);
  const isRetina = useMediaQuery(mediaQueries.retina);
  const prefersReducedMotion = useMediaQuery(mediaQueries.motionReduce);
  const prefersDarkMode = useMediaQuery(mediaQueries.darkMode);
  const isPortrait = useMediaQuery(mediaQueries.portrait);
  const isLandscape = useMediaQuery(mediaQueries.landscape);

  return {
    hasTouch,
    hasHover,
    isRetina,
    prefersReducedMotion,
    prefersDarkMode,
    isPortrait,
    isLandscape,
    isTouchDevice: hasTouch && !hasHover,
    isDesktopDevice: !hasTouch && hasHover,
  };
}

/**
 * Window size hook
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize(); // Set initial size
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
}

/**
 * Orientation hook
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window !== "undefined") {
        setOrientation(
          window.innerHeight > window.innerWidth ? "portrait" : "landscape"
        );
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkOrientation);
      checkOrientation(); // Set initial orientation
      return () => window.removeEventListener("resize", checkOrientation);
    }
  }, []);

  return orientation;
}

/**
 * Responsive value hook - breakpoint'e göre değer seçer
 */
export function useResponsiveValue<T>(values?: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
}): T | undefined {
  const { current } = useBreakpoint();

  // values undefined ise undefined döndür
  if (!values) {
    return undefined;
  }

  // Fallback logic - en yakın tanımlı değeri bulur
  const breakpointOrder: Breakpoint[] = ["2xl", "xl", "lg", "md", "sm", "xs"];
  const currentIndex = breakpointOrder.indexOf(current);

  // Mevcut breakpoint'ten başlayarak geriye doğru arar
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
}

/**
 * Responsive grid columns hook
 */
export function useResponsiveColumns(columns?: {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  "2xl"?: number;
}) {
  return useResponsiveValue(columns) || 1;
}

/**
 * Container size hook - responsive container boyutları
 */
export function useContainerSize() {
  const { current } = useBreakpoint();
  const { width } = useWindowSize();

  const maxWidths = {
    xs: "100%",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  };

  return {
    maxWidth: maxWidths[current],
    currentWidth: width,
    shouldUseFullWidth: current === "xs" || (width && width < 640),
  };
}
