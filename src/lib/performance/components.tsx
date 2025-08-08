"use client";

import React, { Suspense, lazy, memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
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

/**
 * Performance-optimized components for anime-themed Python learning platform
 */

// Lazy loading wrapper component
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyComponent({
  children,
  fallback = <div className="animate-pulse bg-gray-200 rounded h-32" />,
  threshold = 0.1,
  rootMargin = "100px",
  className,
}: LazyComponentProps) {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {hasIntersected ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

// Optimized image component with lazy loading and format optimization
interface OptimizedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  quality?: number;
  format?: "webp" | "avif" | "auto";
  className?: string;
  width?: number;
  height?: number;
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
  quality = 85,
  format = "auto",
  className,
  width,
  height,
  ...props
}: OptimizedImageProps) {
  const { imageSrc, isLoaded, isError } = useOptimizedImage(src, {
    placeholder,
    quality,
    format,
  });
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          isError && "opacity-50"
        )}
        loading="lazy"
        decoding="async"
        {...props}
      />

      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Görüntü yüklenemedi
        </div>
      )}
    </div>
  );
});

// Virtual scrolling list component for large datasets
interface VirtualScrollListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

export function VirtualScrollList({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 5,
}: VirtualScrollListProps) {
  const { visibleRange, totalHeight, offsetY, handleScroll } =
    useVirtualScrolling(items.length, itemHeight, containerHeight, overscan);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  return (
    <div
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderItem(item, visibleRange.startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
}

// Debounced input component
interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  className?: string;
}

export function DebouncedInput({
  value,
  onChange,
  delay = 300,
  className,
  ...props
}: DebouncedInputProps) {
  const [inputValue, setInputValue] = React.useState(value);
  const debouncedValue = useDebounce(inputValue, delay);

  React.useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-lg",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        className
      )}
      {...props}
    />
  );
}

// Performance monitor dashboard component
interface PerformanceMonitorProps {
  className?: string;
  showDetails?: boolean;
}

export function PerformanceMonitor({
  className,
  showDetails = false,
}: PerformanceMonitorProps) {
  const { getWebVitals } = usePerformanceMonitor();
  const memoryInfo = useMemoryMonitor();
  const fps = useFPSMonitor();
  const bundleInfo = useBundleMonitor();
  const resourceMetrics = useResourceTiming();

  const webVitals = getWebVitals();

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "good":
        return "text-green-600 bg-green-100";
      case "needs-improvement":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!webVitals) {
    return (
      <div className={cn("p-4 bg-gray-100 rounded-lg", className)}>
        <p className="text-gray-600">Performance verileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Core Web Vitals */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="font-semibold mb-3 text-gray-800">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div
              className={cn(
                "inline-flex px-2 py-1 rounded text-xs font-medium mb-1",
                getGradeColor(webVitals.grades.lcp)
              )}
            >
              {webVitals.grades.lcp}
            </div>
            <div className="text-lg font-bold">
              {webVitals.lcp ? `${Math.round(webVitals.lcp)}ms` : "N/A"}
            </div>
            <div className="text-sm text-gray-600">LCP</div>
          </div>

          <div className="text-center">
            <div
              className={cn(
                "inline-flex px-2 py-1 rounded text-xs font-medium mb-1",
                getGradeColor(webVitals.grades.fid)
              )}
            >
              {webVitals.grades.fid}
            </div>
            <div className="text-lg font-bold">
              {webVitals.fid ? `${Math.round(webVitals.fid)}ms` : "N/A"}
            </div>
            <div className="text-sm text-gray-600">FID</div>
          </div>

          <div className="text-center">
            <div
              className={cn(
                "inline-flex px-2 py-1 rounded text-xs font-medium mb-1",
                getGradeColor(webVitals.grades.cls)
              )}
            >
              {webVitals.grades.cls}
            </div>
            <div className="text-lg font-bold">{webVitals.cls.toFixed(3)}</div>
            <div className="text-sm text-gray-600">CLS</div>
          </div>
        </div>
      </div>

      {/* Real-time metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-lg font-bold">{fps} FPS</div>
          <div className="text-sm text-gray-600">Frame Rate</div>
          <div className={cn("w-full bg-gray-200 rounded-full h-2 mt-2")}>
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                fps >= 50
                  ? "bg-green-500"
                  : fps >= 30
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
              style={{ width: `${Math.min((fps / 60) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-lg font-bold">{memoryInfo.used}MB</div>
          <div className="text-sm text-gray-600">Memory Usage</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                memoryInfo.percentage < 60
                  ? "bg-green-500"
                  : memoryInfo.percentage < 80
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
              style={{ width: `${memoryInfo.percentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-lg font-bold">{bundleInfo.totalSize}KB</div>
          <div className="text-sm text-gray-600">Bundle Size</div>
          <div className="text-xs text-gray-500 mt-1">
            JS: {bundleInfo.jsSize}KB | CSS: {bundleInfo.cssSize}KB
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-lg font-bold">
            {resourceMetrics.totalResources}
          </div>
          <div className="text-sm text-gray-600">Resources</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: {resourceMetrics.averageLoadTime}ms
          </div>
        </div>
      </div>

      {/* Detailed metrics */}
      {showDetails && (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="font-semibold mb-3 text-gray-800">
            Detaylı Metrikler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Timing Metrics</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>TTFB:</span>
                  <span>{Math.round(webVitals.ttfb)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>FCP:</span>
                  <span>
                    {webVitals.fcp ? `${Math.round(webVitals.fcp)}ms` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>DOM Ready:</span>
                  <span>{Math.round(webVitals.domContentLoaded)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Load Complete:</span>
                  <span>{Math.round(webVitals.loadComplete)}ms</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Resource Analysis</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Total Resources:</span>
                  <span>{resourceMetrics.totalResources}</span>
                </div>
                <div className="flex justify-between">
                  <span>Slow Resources:</span>
                  <span
                    className={
                      resourceMetrics.slowResources.length > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {resourceMetrics.slowResources.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Images:</span>
                  <span>{bundleInfo.imageSize}KB</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Limit:</span>
                  <span>{memoryInfo.limit}MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Performance budget checker component
interface PerformanceBudgetProps {
  budget: {
    maxBundleSize?: number;
    maxLoadTime?: number;
    maxLCP?: number;
    maxFID?: number;
    maxCLS?: number;
  };
  className?: string;
}

export function PerformanceBudget({
  budget,
  className,
}: PerformanceBudgetProps) {
  const budgetStatus = usePerformanceBudget(budget);

  const getStatusIcon = (status: "pass" | "fail" | "unknown") => {
    switch (status) {
      case "pass":
        return "✅";
      case "fail":
        return "❌";
      case "unknown":
        return "⏳";
    }
  };

  const getStatusColor = (status: "pass" | "fail" | "unknown") => {
    switch (status) {
      case "pass":
        return "text-green-600";
      case "fail":
        return "text-red-600";
      case "unknown":
        return "text-gray-600";
    }
  };

  return (
    <div className={cn("bg-white rounded-lg p-4 shadow-sm border", className)}>
      <h3 className="font-semibold mb-3 text-gray-800">Performance Budget</h3>
      <div className="space-y-2">
        {Object.entries(budgetStatus).map(([metric, status]) => (
          <div key={metric} className="flex items-center justify-between">
            <span className="capitalize">
              {metric.replace(/([A-Z])/g, " $1")}
            </span>
            <span className={cn("flex items-center", getStatusColor(status))}>
              {getStatusIcon(status)} {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Throttled scroll component
interface ThrottledScrollProps {
  children: React.ReactNode;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  throttleMs?: number;
  className?: string;
}

export function ThrottledScroll({
  children,
  onScroll,
  throttleMs = 16, // ~60fps
  className,
}: ThrottledScrollProps) {
  const throttledScrollHandler = useThrottle(onScroll, throttleMs);

  return (
    <div className={className} onScroll={throttledScrollHandler}>
      {children}
    </div>
  );
}

// Code splitting component wrapper
interface CodeSplitComponentProps {
  componentLoader: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: any;
}

export function CodeSplitComponent({
  componentLoader,
  fallback = <div>Loading...</div>,
  props = {},
}: CodeSplitComponentProps) {
  const LazyComponent = lazy(componentLoader);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Performance-aware animation wrapper
interface PerformanceAwareAnimationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  fpsThreshold?: number;
  className?: string;
}

export function PerformanceAwareAnimation({
  children,
  fallback,
  fpsThreshold = 30,
  className,
}: PerformanceAwareAnimationProps) {
  const fps = useFPSMonitor();
  const shouldAnimate = fps >= fpsThreshold;

  if (!shouldAnimate && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div
      className={cn(
        className,
        !shouldAnimate && "motion-reduce:transform-none"
      )}
    >
      {children}
    </div>
  );
}
