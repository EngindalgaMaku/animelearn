/**
 * Performance System Index
 * Comprehensive performance monitoring and optimization tools
 */

import React from "react";

// Performance hooks
export {
  usePerformanceMonitor,
  useMemoryMonitor,
  useFPSMonitor,
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useOptimizedImage,
  useVirtualScrolling,
  useBundleMonitor,
  usePerformanceBudget,
  useResourceTiming,
} from "./hooks";

// Performance components
export {
  LazyComponent,
  OptimizedImage,
  VirtualScrollList,
  DebouncedInput,
  PerformanceMonitor,
  PerformanceBudget,
  ThrottledScroll,
  CodeSplitComponent,
  PerformanceAwareAnimation,
} from "./components";

// Performance utilities and constants
export const performanceConfig = {
  // Core Web Vitals thresholds
  webVitals: {
    lcp: {
      good: 2500, // ms
      needsImprovement: 4000, // ms
      poor: Infinity,
    },
    fid: {
      good: 100, // ms
      needsImprovement: 300, // ms
      poor: Infinity,
    },
    cls: {
      good: 0.1, // score
      needsImprovement: 0.25, // score
      poor: Infinity,
    },
    fcp: {
      good: 1800, // ms
      needsImprovement: 3000, // ms
      poor: Infinity,
    },
    ttfb: {
      good: 800, // ms
      needsImprovement: 1800, // ms
      poor: Infinity,
    },
  },

  // Performance budgets (recommended values)
  budgets: {
    mobile: {
      maxBundleSize: 200, // KB
      maxLoadTime: 3000, // ms
      maxLCP: 2500, // ms
      maxFID: 100, // ms
      maxCLS: 0.1, // score
    },
    desktop: {
      maxBundleSize: 500, // KB
      maxLoadTime: 2000, // ms
      maxLCP: 2000, // ms
      maxFID: 100, // ms
      maxCLS: 0.1, // score
    },
  },

  // Memory thresholds
  memory: {
    warning: 80, // percentage
    critical: 90, // percentage
    maxHeapSize: 50, // MB for typical SPA
  },

  // FPS thresholds
  fps: {
    excellent: 60,
    good: 50,
    acceptable: 30,
    poor: 20,
  },
};

// Performance utilities
export const performanceUtils = {
  // Calculate performance score based on Web Vitals
  calculateScore: (metrics: {
    lcp?: number | null;
    fid?: number | null;
    cls?: number;
    fcp?: number | null;
    ttfb?: number;
  }) => {
    const scores: number[] = [];
    const config = performanceConfig.webVitals;

    // LCP scoring
    if (metrics.lcp) {
      if (metrics.lcp <= config.lcp.good) scores.push(100);
      else if (metrics.lcp <= config.lcp.needsImprovement) scores.push(75);
      else scores.push(25);
    }

    // FID scoring
    if (metrics.fid) {
      if (metrics.fid <= config.fid.good) scores.push(100);
      else if (metrics.fid <= config.fid.needsImprovement) scores.push(75);
      else scores.push(25);
    }

    // CLS scoring
    if (typeof metrics.cls === "number") {
      if (metrics.cls <= config.cls.good) scores.push(100);
      else if (metrics.cls <= config.cls.needsImprovement) scores.push(75);
      else scores.push(25);
    }

    // FCP scoring
    if (metrics.fcp) {
      if (metrics.fcp <= config.fcp.good) scores.push(100);
      else if (metrics.fcp <= config.fcp.needsImprovement) scores.push(75);
      else scores.push(25);
    }

    // TTFB scoring
    if (typeof metrics.ttfb === "number") {
      if (metrics.ttfb <= config.ttfb.good) scores.push(100);
      else if (metrics.ttfb <= config.ttfb.needsImprovement) scores.push(75);
      else scores.push(25);
    }

    return scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b) / scores.length)
      : 0;
  },

  // Get grade from score
  getGrade: (score: number): "A" | "B" | "C" | "D" | "F" => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  },

  // Format bytes to human readable
  formatBytes: (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  },

  // Format milliseconds to human readable
  formatMs: (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  },

  // Check if device is low-end
  isLowEndDevice: (): boolean => {
    // Check available cores
    const cores = navigator.hardwareConcurrency || 1;
    if (cores < 4) return true;

    // Check memory (if available)
    if ("memory" in globalThis.performance) {
      const memory = (globalThis.performance as any).memory;
      const memoryGB = memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
      if (memoryGB < 2) return true;
    }

    // Check connection (if available)
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g"
      ) {
        return true;
      }
    }

    return false;
  },

  // Get network information
  getNetworkInfo: () => {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }
    return null;
  },

  // Optimize images based on device capabilities
  getOptimalImageFormat: (): "webp" | "avif" | "jpeg" => {
    // Check AVIF support
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;

    if (canvas.toDataURL("image/avif").startsWith("data:image/avif")) {
      return "avif";
    }

    // Check WebP support
    if (canvas.toDataURL("image/webp").startsWith("data:image/webp")) {
      return "webp";
    }

    return "jpeg";
  },

  // Calculate ideal image sizes for different breakpoints
  getResponsiveImageSizes: (baseWidth: number) => {
    const breakpoints = [320, 640, 768, 1024, 1280, 1536];
    return breakpoints.map((bp) => ({
      breakpoint: bp,
      width: Math.min(baseWidth, bp),
      height: Math.round((Math.min(baseWidth, bp) * 9) / 16), // 16:9 aspect ratio
    }));
  },
};

// Performance monitoring utilities
export const performanceMonitoring = {
  // Simple performance mark
  mark: (name: string) => {
    if (typeof globalThis !== "undefined" && globalThis.performance) {
      globalThis.performance.mark(name);
    }
  },

  // Simple performance measure
  measure: (name: string, startMark?: string, endMark?: string) => {
    if (typeof globalThis !== "undefined" && globalThis.performance) {
      try {
        if (startMark && endMark) {
          globalThis.performance.measure(name, startMark, endMark);
        } else if (startMark) {
          globalThis.performance.measure(name, startMark);
        } else {
          globalThis.performance.measure(name);
        }

        const measure = globalThis.performance.getEntriesByName(name)[0];
        return measure ? measure.duration : 0;
      } catch (error) {
        console.warn("Performance measurement failed:", error);
        return 0;
      }
    }
    return 0;
  },

  // Get all performance entries
  getEntries: () => {
    if (typeof globalThis !== "undefined" && globalThis.performance) {
      return {
        navigation: globalThis.performance.getEntriesByType("navigation"),
        resource: globalThis.performance.getEntriesByType("resource"),
        measure: globalThis.performance.getEntriesByType("measure"),
        mark: globalThis.performance.getEntriesByType("mark"),
        paint: globalThis.performance.getEntriesByType("paint"),
      };
    }
    return {
      navigation: [],
      resource: [],
      measure: [],
      mark: [],
      paint: [],
    };
  },
};

// Performance tips and recommendations
export const performanceTips = {
  // Critical rendering path optimization
  criticalPath: [
    "Minimize render-blocking resources (CSS, JavaScript)",
    "Optimize critical CSS and inline it",
    "Defer non-critical JavaScript",
    "Use resource hints (preload, prefetch, preconnect)",
    "Optimize web fonts loading",
  ],

  // Image optimization
  images: [
    "Use next-gen formats (WebP, AVIF)",
    "Implement responsive images with srcset",
    "Lazy load images below the fold",
    "Optimize image compression and quality",
    "Use appropriate image dimensions",
  ],

  // JavaScript optimization
  javascript: [
    "Implement code splitting and lazy loading",
    "Remove unused code (tree shaking)",
    "Minimize and compress JavaScript bundles",
    "Use efficient state management",
    "Optimize React rendering with memo and useMemo",
  ],

  // Network optimization
  network: [
    "Enable HTTP/2 and HTTP/3",
    "Use CDN for static assets",
    "Implement proper caching strategies",
    "Minimize HTTP requests",
    "Compress text-based resources (gzip, brotli)",
  ],

  // Memory optimization
  memory: [
    "Clean up event listeners and subscriptions",
    "Avoid memory leaks in useEffect",
    "Use object pooling for frequently created objects",
    "Implement virtual scrolling for large lists",
    "Optimize data structures and algorithms",
  ],
};

// Type definitions
export type PerformanceGrade = "A" | "B" | "C" | "D" | "F";
export type MetricStatus = "good" | "needs-improvement" | "poor";
export type DeviceType = "mobile" | "desktop";

export interface PerformanceMetrics {
  lcp?: number | null;
  fid?: number | null;
  cls?: number;
  fcp?: number | null;
  ttfb?: number;
  score?: number;
  grade?: PerformanceGrade;
}

export interface PerformanceSession {
  id: string;
  startTime: number;
  marks: Record<string, number>;
  measures: Record<string, number>;
  duration: number;
}

// Export default performance configuration for easy import
export default {
  config: performanceConfig,
  utils: performanceUtils,
  monitoring: performanceMonitoring,
  tips: performanceTips,
};
