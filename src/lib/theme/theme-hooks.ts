"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./theme-provider";
import type { Theme, ResolvedTheme } from "./index";

/**
 * Theme preference hook with localStorage persistence
 */
export function useThemePreference() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const setLightTheme = useCallback(() => {
    setTheme("light");
  }, [setTheme]);

  const setDarkTheme = useCallback(() => {
    setTheme("dark");
  }, [setTheme]);

  const setSystemTheme = useCallback(() => {
    setTheme("system");
  }, [setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    isLoading,
    isDark: resolvedTheme === "dark",
    isLight: resolvedTheme === "light",
  };
}

/**
 * System theme detection hook
 */
export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsSupported(true);
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return {
    systemTheme,
    isSupported,
    isDarkMode: systemTheme === "dark",
    isLightMode: systemTheme === "light",
  };
}

/**
 * Theme transition hook for smooth animations
 */
export function useThemeTransition(duration: number = 300) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { resolvedTheme } = useTheme();

  const enableTransition = useCallback(() => {
    setIsTransitioning(true);

    // Disable transitions temporarily for theme change
    const css = document.createElement("style");
    css.appendChild(
      document.createTextNode(
        `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
      )
    );
    document.head.appendChild(css);

    // Re-enable transitions after theme change
    setTimeout(() => {
      document.head.removeChild(css);
      setIsTransitioning(false);
    }, duration);
  }, [duration]);

  useEffect(() => {
    enableTransition();
  }, [resolvedTheme, enableTransition]);

  return {
    isTransitioning,
    enableTransition,
  };
}

/**
 * Theme-aware media query hook
 */
export function useThemeMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Add theme context to media query if needed
    const themeAwareQuery = query.includes("prefers-color-scheme")
      ? query
      : `${query} and (prefers-color-scheme: ${resolvedTheme})`;

    const mediaQuery = window.matchMedia(themeAwareQuery);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query, resolvedTheme]);

  return matches;
}

/**
 * Theme-aware CSS custom properties hook
 */
export function useThemeVariables() {
  const { resolvedTheme } = useTheme();
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const themeVariables: Record<string, string> = {};

    // Extract theme-related CSS variables
    for (let i = 0; i < computedStyle.length; i++) {
      const property = computedStyle[i];
      if (property.startsWith("--color-") || property.startsWith("--theme-")) {
        themeVariables[property] = computedStyle
          .getPropertyValue(property)
          .trim();
      }
    }

    setVariables(themeVariables);
  }, [resolvedTheme]);

  const setVariable = useCallback((property: string, value: string) => {
    if (typeof document === "undefined") return;

    document.documentElement.style.setProperty(property, value);
    setVariables((prev) => ({ ...prev, [property]: value }));
  }, []);

  const removeVariable = useCallback((property: string) => {
    if (typeof document === "undefined") return;

    document.documentElement.style.removeProperty(property);
    setVariables((prev) => {
      const newVars = { ...prev };
      delete newVars[property];
      return newVars;
    });
  }, []);

  return {
    variables,
    setVariable,
    removeVariable,
  };
}

/**
 * Theme persistence hook
 */
export function useThemePersistence(key: string = "anime-card-theme") {
  const { theme, setTheme } = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(key);
      if (stored && ["light", "dark", "system"].includes(stored)) {
        setTheme(stored as Theme);
      }
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error);
    }

    setIsHydrated(true);
  }, [key, setTheme]);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(key, theme);
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error);
    }
  }, [theme, key, isHydrated]);

  const clearPersistedTheme = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setTheme("system");
    } catch (error) {
      console.warn("Failed to clear theme from localStorage:", error);
    }
  }, [key, setTheme]);

  return {
    isHydrated,
    clearPersistedTheme,
  };
}

/**
 * Theme accessibility hook
 */
export function useThemeAccessibility() {
  const { resolvedTheme } = useTheme();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const contrastQuery = window.matchMedia("(prefers-contrast: high)");

    setPrefersReducedMotion(motionQuery.matches);
    setPrefersHighContrast(contrastQuery.matches);

    const motionHandler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    const contrastHandler = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    motionQuery.addEventListener("change", motionHandler);
    contrastQuery.addEventListener("change", contrastHandler);

    return () => {
      motionQuery.removeEventListener("change", motionHandler);
      contrastQuery.removeEventListener("change", contrastHandler);
    };
  }, []);

  return {
    prefersReducedMotion,
    prefersHighContrast,
    isDarkMode: resolvedTheme === "dark",
    shouldUseReducedMotion: prefersReducedMotion,
    shouldUseHighContrast: prefersHighContrast,
  };
}

/**
 * Theme performance hook
 */
export function useThemePerformance() {
  const { resolvedTheme } = useTheme();
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    const measureRender = () => {
      const endTime = performance.now();
      setRenderTime(endTime - startTime);
    };

    // Measure on next frame
    requestAnimationFrame(measureRender);
  }, [resolvedTheme]);

  return {
    renderTime,
    isOptimal: renderTime < 16, // 60fps target
  };
}
