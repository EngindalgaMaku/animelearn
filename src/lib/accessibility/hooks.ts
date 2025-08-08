"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Accessibility hooks for anime-themed Python learning platform
 * WCAG 2.1 AA compliant accessibility features
 */

// Keyboard navigation hook
export function useKeyboardNavigation() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
}

// Focus management hook
export function useFocusManagement() {
  const focusRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const captureFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, []);

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab" || !focusRef.current) return;

    const focusableElements = focusRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }, []);

  return {
    focusRef,
    captureFocus,
    restoreFocus,
    trapFocus,
  };
}

// Screen reader announcements hook
export function useScreenReader() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      setAnnouncements((prev) => [...prev, message]);

      // Clear announcement after screen reader has time to read it
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(
        () => {
          setAnnouncements((prev) => prev.slice(1));
        },
        priority === "assertive" ? 2000 : 1000
      );
    },
    []
  );

  const announceNavigation = useCallback(
    (destination: string) => {
      announce(`Navigated to ${destination}`, "polite");
    },
    [announce]
  );

  const announceError = useCallback(
    (error: string) => {
      announce(`Error: ${error}`, "assertive");
    },
    [announce]
  );

  const announceSuccess = useCallback(
    (message: string) => {
      announce(`Success: ${message}`, "polite");
    },
    [announce]
  );

  const announceLoading = useCallback(
    (message: string = "Loading") => {
      announce(message, "polite");
    },
    [announce]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    announcements,
    announce,
    announceNavigation,
    announceError,
    announceSuccess,
    announceLoading,
  };
}

// Color contrast and vision accessibility
export function useColorPreferences() {
  const [preferences, setPreferences] = useState({
    highContrast: false,
    reducedMotion: false,
    darkMode: false,
  });

  useEffect(() => {
    const checkPreferences = () => {
      setPreferences({
        highContrast: window.matchMedia("(prefers-contrast: high)").matches,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches,
        darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
      });
    };

    checkPreferences();

    const mediaQueries = [
      window.matchMedia("(prefers-contrast: high)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(prefers-color-scheme: dark)"),
    ];

    mediaQueries.forEach((mq) =>
      mq.addEventListener("change", checkPreferences)
    );

    return () => {
      mediaQueries.forEach((mq) =>
        mq.removeEventListener("change", checkPreferences)
      );
    };
  }, []);

  return preferences;
}

// ARIA live region hook
export function useAriaLive() {
  const liveRef = useRef<HTMLDivElement>(null);

  const updateLiveRegion = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (liveRef.current) {
        liveRef.current.setAttribute("aria-live", priority);
        liveRef.current.textContent = message;

        // Clear after announcement
        setTimeout(() => {
          if (liveRef.current) {
            liveRef.current.textContent = "";
          }
        }, 1000);
      }
    },
    []
  );

  return { liveRef, updateLiveRegion };
}

// Skip links hook
export function useSkipLinks() {
  const skipLinksRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showSkipLinks = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideSkipLinks = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && !e.shiftKey) {
        showSkipLinks();
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (
        skipLinksRef.current &&
        !skipLinksRef.current.contains(e.relatedTarget as Node)
      ) {
        hideSkipLinks();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [showSkipLinks, hideSkipLinks]);

  return { skipLinksRef, isVisible };
}

// Form accessibility hook
export function useFormAccessibility() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const addError = useCallback((fieldName: string, error: string) => {
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  }, []);

  const removeError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const markTouched = useCallback((fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  const getFieldProps = useCallback(
    (fieldName: string) => {
      const hasError = errors[fieldName] && touched[fieldName];

      return {
        "aria-invalid": hasError ? "true" : "false",
        "aria-describedby": hasError ? `${fieldName}-error` : undefined,
        onBlur: () => markTouched(fieldName),
      };
    },
    [errors, touched, markTouched]
  );

  const getErrorProps = useCallback(
    (fieldName: string) => {
      const hasError = errors[fieldName] && touched[fieldName];

      return {
        id: `${fieldName}-error`,
        role: "alert",
        "aria-live": "polite" as const,
        style: { display: hasError ? "block" : "none" },
      };
    },
    [errors, touched]
  );

  return {
    errors,
    touched,
    addError,
    removeError,
    markTouched,
    getFieldProps,
    getErrorProps,
  };
}

// Keyboard shortcuts hook
export function useKeyboardShortcuts() {
  const [shortcuts, setShortcuts] = useState<Map<string, () => void>>(
    new Map()
  );

  const registerShortcut = useCallback(
    (key: string, callback: () => void, description?: string) => {
      setShortcuts((prev) => new Map(prev).set(key, callback));
    },
    []
  );

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts((prev) => {
      const newShortcuts = new Map(prev);
      newShortcuts.delete(key);
      return newShortcuts;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = `${e.ctrlKey ? "ctrl+" : ""}${e.altKey ? "alt+" : ""}${
        e.shiftKey ? "shift+" : ""
      }${e.key.toLowerCase()}`;
      const callback = shortcuts.get(key);

      if (callback) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  return { registerShortcut, unregisterShortcut, shortcuts };
}

// Language and internationalization hook
export function useLanguagePreferences() {
  const [language, setLanguage] = useState("tr");
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    const detectedLanguage = navigator.language.split("-")[0];
    setLanguage(detectedLanguage);

    // RTL languages
    const rtlLanguages = ["ar", "he", "fa", "ur"];
    setDirection(rtlLanguages.includes(detectedLanguage) ? "rtl" : "ltr");
  }, []);

  return { language, direction, setLanguage };
}

// Viewport and zoom accessibility
export function useViewportAccessibility() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setZoomLevel(window.devicePixelRatio);
      setIsMobile(window.innerWidth < 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return { zoomLevel, isMobile };
}

// Text scaling hook for visual accessibility
export function useTextScaling() {
  const [textScale, setTextScale] = useState(1);

  const increaseTextSize = useCallback(() => {
    setTextScale((prev) => Math.min(prev + 0.1, 2));
  }, []);

  const decreaseTextSize = useCallback(() => {
    setTextScale((prev) => Math.max(prev - 0.1, 0.8));
  }, []);

  const resetTextSize = useCallback(() => {
    setTextScale(1);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${textScale * 16}px`;
  }, [textScale]);

  return {
    textScale,
    increaseTextSize,
    decreaseTextSize,
    resetTextSize,
  };
}
