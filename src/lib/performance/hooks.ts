"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Performance hooks for anime-themed Python learning platform
 * Comprehensive performance monitoring and optimization tools
 */

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    navigation: null as PerformanceNavigationTiming | null,
    memory: null as any,
    paintTiming: [] as PerformanceEntry[],
    largestContentfulPaint: null as PerformanceEntry | null,
    firstInputDelay: null as number | null,
    cumulativeLayoutShift: 0,
  });

  useEffect(() => {
    // Navigation timing
    const navigationEntry = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    // Memory usage (Chrome only)
    const memoryInfo = (performance as any).memory;

    // Paint timing
    const paintEntries = performance.getEntriesByType("paint");

    // Largest Contentful Paint
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics((prev) => ({ ...prev, largestContentfulPaint: lastEntry }));
    });

    if ("PerformanceObserver" in window) {
      try {
        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        // Observer not supported
      }
    }

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.entryType === "first-input") {
          setMetrics((prev) => ({
            ...prev,
            firstInputDelay: entry.processingStart - entry.startTime,
          }));
        }
      });
    });

    try {
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      // Observer not supported
    }

    // Cumulative Layout Shift
    let cumulativeLayoutShiftScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          cumulativeLayoutShiftScore += (entry as any).value;
          setMetrics((prev) => ({
            ...prev,
            cumulativeLayoutShift: cumulativeLayoutShiftScore,
          }));
        }
      }
    });

    try {
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      // Observer not supported
    }

    setMetrics((prev) => ({
      ...prev,
      navigation: navigationEntry,
      memory: memoryInfo,
      paintTiming: paintEntries,
    }));

    return () => {
      observer.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  const getWebVitals = useCallback(() => {
    const navigation = metrics.navigation;
    if (!navigation) return null;

    return {
      // Core Web Vitals
      lcp: metrics.largestContentfulPaint?.startTime || null, // Largest Contentful Paint
      fid: metrics.firstInputDelay, // First Input Delay
      cls: metrics.cumulativeLayoutShift, // Cumulative Layout Shift

      // Other important metrics
      fcp:
        metrics.paintTiming.find(
          (entry) => entry.name === "first-contentful-paint"
        )?.startTime || null,
      ttfb: navigation.responseStart - navigation.requestStart, // Time to First Byte
      domContentLoaded:
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,

      // Performance grades
      grades: {
        lcp:
          (metrics.largestContentfulPaint?.startTime || 0) < 2500
            ? "good"
            : (metrics.largestContentfulPaint?.startTime || 0) < 4000
            ? "needs-improvement"
            : "poor",
        fid:
          (metrics.firstInputDelay || 0) < 100
            ? "good"
            : (metrics.firstInputDelay || 0) < 300
            ? "needs-improvement"
            : "poor",
        cls:
          metrics.cumulativeLayoutShift < 0.1
            ? "good"
            : metrics.cumulativeLayoutShift < 0.25
            ? "needs-improvement"
            : "poor",
      },
    };
  }, [metrics]);

  return { metrics, getWebVitals };
}

// Memory usage monitoring hook
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState({
    used: 0,
    total: 0,
    limit: 0,
    percentage: 0,
  });

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const used = memory.usedJSHeapSize;
        const total = memory.totalJSHeapSize;
        const limit = memory.jsHeapSizeLimit;

        setMemoryInfo({
          used: Math.round(used / 1024 / 1024), // MB
          total: Math.round(total / 1024 / 1024), // MB
          limit: Math.round(limit / 1024 / 1024), // MB
          percentage: Math.round((used / limit) * 100),
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// FPS monitoring hook
export function useFPSMonitor() {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationId = useRef<number | null>(null);

  useEffect(() => {
    const measureFPS = (currentTime: number) => {
      frameCount.current++;

      if (currentTime >= lastTime.current + 1000) {
        setFps(
          Math.round(
            (frameCount.current * 1000) / (currentTime - lastTime.current)
          )
        );
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationId.current = requestAnimationFrame(measureFPS);
    };

    animationId.current = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return fps;
}

// Debounce hook for performance optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for performance optimization
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastExecution = useRef<number>(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastExecution.current >= delay) {
        lastExecution.current = now;
        return callback(...args);
      } else {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
          lastExecution.current = Date.now();
          callback(...args);
        }, delay - (now - lastExecution.current));
      }
    }) as T,
    [callback, delay]
  );
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [options]);

  return { ref, isIntersecting, hasIntersected };
}

// Optimized image loading hook
export function useOptimizedImage(
  src: string,
  options: {
    placeholder?: string;
    quality?: number;
    format?: "webp" | "avif" | "auto";
  } = {}
) {
  const [imageSrc, setImageSrc] = useState(options.placeholder || "");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { ref, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (!hasIntersected) return;

    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };

    img.onerror = () => {
      setIsError(true);
    };

    // Create optimized src with format and quality
    let optimizedSrc = src;
    if (options.format === "auto") {
      // Check browser support and use best format
      if (supportsWebP()) {
        optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      }
    } else if (options.format) {
      optimizedSrc = src.replace(
        /\.(jpg|jpeg|png|webp)$/i,
        `.${options.format}`
      );
    }

    img.src = optimizedSrc;
  }, [src, hasIntersected, options.format]);

  return { ref, imageSrc, isLoaded, isError };
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling(
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  const totalHeight = itemCount * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleRange,
    totalHeight,
    offsetY,
    handleScroll,
  };
}

// Bundle size monitoring hook
export function useBundleMonitor() {
  const [bundleInfo, setBundleInfo] = useState({
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    imageSize: 0,
    loadTime: 0,
  });

  useEffect(() => {
    const calculateBundleSize = () => {
      const resources = performance.getEntriesByType("resource");
      let totalSize = 0;
      let jsSize = 0;
      let cssSize = 0;
      let imageSize = 0;

      resources.forEach((resource: any) => {
        if (resource.transferSize) {
          totalSize += resource.transferSize;

          if (resource.name.includes(".js")) {
            jsSize += resource.transferSize;
          } else if (resource.name.includes(".css")) {
            cssSize += resource.transferSize;
          } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            imageSize += resource.transferSize;
          }
        }
      });

      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const loadTime = navigation
        ? navigation.loadEventEnd - navigation.fetchStart
        : 0;

      setBundleInfo({
        totalSize: Math.round(totalSize / 1024), // KB
        jsSize: Math.round(jsSize / 1024), // KB
        cssSize: Math.round(cssSize / 1024), // KB
        imageSize: Math.round(imageSize / 1024), // KB
        loadTime: Math.round(loadTime),
      });
    };

    // Calculate after page load
    if (document.readyState === "complete") {
      calculateBundleSize();
    } else {
      window.addEventListener("load", calculateBundleSize);
      return () => window.removeEventListener("load", calculateBundleSize);
    }
  }, []);

  return bundleInfo;
}

// Performance budget monitoring
export function usePerformanceBudget(budget: {
  maxBundleSize?: number; // KB
  maxLoadTime?: number; // ms
  maxLCP?: number; // ms
  maxFID?: number; // ms
  maxCLS?: number;
}) {
  const { getWebVitals } = usePerformanceMonitor();
  const bundleInfo = useBundleMonitor();

  const [budgetStatus, setBudgetStatus] = useState({
    bundleSize: "unknown" as "pass" | "fail" | "unknown",
    loadTime: "unknown" as "pass" | "fail" | "unknown",
    lcp: "unknown" as "pass" | "fail" | "unknown",
    fid: "unknown" as "pass" | "fail" | "unknown",
    cls: "unknown" as "pass" | "fail" | "unknown",
  });

  useEffect(() => {
    const vitals = getWebVitals();

    setBudgetStatus({
      bundleSize: budget.maxBundleSize
        ? bundleInfo.totalSize <= budget.maxBundleSize
          ? "pass"
          : "fail"
        : "unknown",
      loadTime:
        budget.maxLoadTime && vitals?.loadComplete
          ? vitals.loadComplete <= budget.maxLoadTime
            ? "pass"
            : "fail"
          : "unknown",
      lcp:
        budget.maxLCP && vitals?.lcp
          ? vitals.lcp <= budget.maxLCP
            ? "pass"
            : "fail"
          : "unknown",
      fid:
        budget.maxFID && vitals?.fid
          ? vitals.fid <= budget.maxFID
            ? "pass"
            : "fail"
          : "unknown",
      cls:
        budget.maxCLS && vitals?.cls !== undefined
          ? vitals.cls <= budget.maxCLS
            ? "pass"
            : "fail"
          : "unknown",
    });
  }, [budget, bundleInfo, getWebVitals]);

  return budgetStatus;
}

// Helper function to check WebP support
function supportsWebP(): boolean {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL("image/webp").indexOf("webp") !== -1;
}

// Resource timing monitoring
export function useResourceTiming() {
  const [resourceMetrics, setResourceMetrics] = useState<{
    slowResources: PerformanceResourceTiming[];
    totalResources: number;
    averageLoadTime: number;
  }>({
    slowResources: [],
    totalResources: 0,
    averageLoadTime: 0,
  });

  useEffect(() => {
    const analyzeResources = () => {
      const resources = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];

      const slowResources = resources.filter(
        (resource) => resource.duration > 1000 // Resources taking more than 1 second
      );

      const totalLoadTime = resources.reduce(
        (sum, resource) => sum + resource.duration,
        0
      );
      const averageLoadTime =
        resources.length > 0 ? totalLoadTime / resources.length : 0;

      setResourceMetrics({
        slowResources,
        totalResources: resources.length,
        averageLoadTime: Math.round(averageLoadTime),
      });
    };

    if (document.readyState === "complete") {
      analyzeResources();
    } else {
      window.addEventListener("load", analyzeResources);
      return () => window.removeEventListener("load", analyzeResources);
    }
  }, []);

  return resourceMetrics;
}
