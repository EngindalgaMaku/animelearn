/**
 * Debug utilities for development tools
 */

import React, { useEffect, useRef } from "react";

export type DebugLevel = "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE";

interface DebugConfig {
  level: DebugLevel;
  namespace?: string;
  enableTimestamp?: boolean;
  enableStackTrace?: boolean;
}

const DEBUG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4,
} as const;

class Debugger {
  private config: DebugConfig;
  private startTime: number;

  constructor(config: DebugConfig) {
    this.config = config;
    this.startTime = Date.now();
  }

  private shouldLog(level: DebugLevel): boolean {
    return DEBUG_LEVELS[level] <= DEBUG_LEVELS[this.config.level];
  }

  private formatMessage(
    level: DebugLevel,
    message: string,
    data?: any
  ): string {
    const timestamp = this.config.enableTimestamp
      ? `[${new Date().toISOString()}]`
      : "";
    const namespace = this.config.namespace ? `[${this.config.namespace}]` : "";

    return `${timestamp}${namespace}[${level}] ${message}`;
  }

  log(level: DebugLevel, message: string, data?: any) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, data);

    switch (level) {
      case "ERROR":
        console.error(formattedMessage, data);
        break;
      case "WARN":
        console.warn(formattedMessage, data);
        break;
      case "INFO":
        console.info(formattedMessage, data);
        break;
      case "DEBUG":
      case "TRACE":
        console.log(formattedMessage, data);
        break;
    }

    if (
      this.config.enableStackTrace &&
      (level === "ERROR" || level === "WARN")
    ) {
      console.trace();
    }
  }

  error(message: string, data?: any) {
    this.log("ERROR", message, data);
  }

  warn(message: string, data?: any) {
    this.log("WARN", message, data);
  }

  info(message: string, data?: any) {
    this.log("INFO", message, data);
  }

  debug(message: string, data?: any) {
    this.log("DEBUG", message, data);
  }

  trace(message: string, data?: any) {
    this.log("TRACE", message, data);
  }

  time(label: string) {
    console.time(label);
  }

  timeEnd(label: string) {
    console.timeEnd(label);
  }

  group(label: string) {
    console.group(label);
  }

  groupEnd() {
    console.groupEnd();
  }
}

export const createDebugger = (config: DebugConfig): Debugger => {
  return new Debugger(config);
};

// React hook for debug values
export const useDebugValue = (
  value: any,
  formatter?: (value: any) => string
) => {
  // Always call the hook to avoid conditional calls
  React.useDebugValue(
    process.env.NODE_ENV === "development" ? value : null,
    formatter
  );
};

// HOC for adding debug info to components
export const withDebugInfo = <P extends object>(
  Component: React.ComponentType<P>,
  debugName?: string
): React.ComponentType<P> => {
  const WrappedComponent = (props: P) => {
    const renderCount = useRef(0);
    renderCount.current++;

    useEffect(() => {
      if (process.env.NODE_ENV === "development") {
        console.log(`${debugName || Component.name} mounted`);
        return () => {
          console.log(`${debugName || Component.name} unmounted`);
        };
      }
    }, []);

    if (process.env.NODE_ENV === "development") {
      console.log(
        `${debugName || Component.name} rendered (${renderCount.current})`
      );
    }

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withDebugInfo(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};

// Performance logging utility
export const logPerformance = (label: string, fn: () => void) => {
  if (process.env.NODE_ENV === "development") {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`⚡ ${label}: ${(end - start).toFixed(2)}ms`);
  } else {
    fn();
  }
};

// Component performance debugger
export const debugComponent = (name: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (process.env.NODE_ENV === "development") {
        console.time(`${name}.${propertyKey}`);
        const result = originalMethod.apply(this, args);
        console.timeEnd(`${name}.${propertyKey}`);
        return result;
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};

// Performance logger class
export class PerformanceLogger {
  private metrics: Map<string, number[]> = new Map();

  log(metric: string, value: number) {
    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, []);
    }
    this.metrics.get(metric)!.push(value);
  }

  getAverage(metric: string): number {
    const values = this.metrics.get(metric) || [];
    return values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
  }

  getMin(metric: string): number {
    const values = this.metrics.get(metric) || [];
    return values.length > 0 ? Math.min(...values) : 0;
  }

  getMax(metric: string): number {
    const values = this.metrics.get(metric) || [];
    return values.length > 0 ? Math.max(...values) : 0;
  }

  getReport(): Record<
    string,
    { avg: number; min: number; max: number; count: number }
  > {
    const report: any = {};

    for (const [metric, values] of this.metrics) {
      report[metric] = {
        avg: this.getAverage(metric),
        min: this.getMin(metric),
        max: this.getMax(metric),
        count: values.length,
      };
    }

    return report;
  }

  clear() {
    this.metrics.clear();
  }
}

export const createPerformanceLogger = (): PerformanceLogger => {
  return new PerformanceLogger();
};

// Global debug instance for development
export const devDebugger = createDebugger({
  level: "DEBUG",
  namespace: "Zumenzu",
  enableTimestamp: true,
  enableStackTrace: false,
});
