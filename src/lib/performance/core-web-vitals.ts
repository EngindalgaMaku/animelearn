'use client';

// Core Web Vitals monitoring and optimization
export interface WebVital {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  delta: number;
  entries: PerformanceEntry[];
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Thresholds for Core Web Vitals ratings
const VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(name: WebVital['name'], value: number): WebVital['rating'] {
  const thresholds = VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Web Vitals measurement functions
export function getCLS(onReport: (metric: WebVital) => void) {
  if (typeof window === 'undefined') return;

  let clsValue = 0;
  let sessionValue = 0;
  let sessionEntries: PerformanceEntry[] = [];

  const po = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

        if (
          sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000
        ) {
          sessionValue += (entry as any).value;
          sessionEntries.push(entry);
        } else {
          sessionValue = (entry as any).value;
          sessionEntries = [entry];
        }

        if (sessionValue > clsValue) {
          clsValue = sessionValue;
          onReport({
            name: 'CLS',
            value: clsValue,
            delta: clsValue,
            entries: sessionEntries,
            id: 'cls',
            rating: getRating('CLS', clsValue),
          });
        }
      }
    }
  });

  po.observe({ type: 'layout-shift', buffered: true });
}

export function getFID(onReport: (metric: WebVital) => void) {
  if (typeof window === 'undefined') return;

  const po = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const fidEntry = entry as any; // FID entries have processingStart property
      const value = fidEntry.processingStart - entry.startTime;
      onReport({
        name: 'FID',
        value,
        delta: value,
        entries: [entry],
        id: 'fid',
        rating: getRating('FID', value),
      });
    }
  });

  po.observe({ type: 'first-input', buffered: true });
}

export function getLCP(onReport: (metric: WebVital) => void) {
  if (typeof window === 'undefined') return;

  let lcpValue = 0;

  const po = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    if (lastEntry) {
      lcpValue = lastEntry.startTime;
      onReport({
        name: 'LCP',
        value: lcpValue,
        delta: lcpValue,
        entries: [lastEntry],
        id: 'lcp',
        rating: getRating('LCP', lcpValue),
      });
    }
  });

  po.observe({ type: 'largest-contentful-paint', buffered: true });
}

export function getFCP(onReport: (metric: WebVital) => void) {
  if (typeof window === 'undefined') return;

  const po = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        const value = entry.startTime;
        onReport({
          name: 'FCP',
          value,
          delta: value,
          entries: [entry],
          id: 'fcp',
          rating: getRating('FCP', value),
        });
      }
    }
  });

  po.observe({ type: 'paint', buffered: true });
}

export function getTTFB(onReport: (metric: WebVital) => void) {
  if (typeof window === 'undefined') return;

  const po = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.entryType === 'navigation') {
        const navEntry = entry as PerformanceNavigationTiming;
        const value = navEntry.responseStart - navEntry.requestStart;
        onReport({
          name: 'TTFB',
          value,
          delta: value,
          entries: [entry],
          id: 'ttfb',
          rating: getRating('TTFB', value),
        });
      }
    }
  });

  po.observe({ type: 'navigation', buffered: true });
}

// Analytics reporting
function sendToAnalytics(metric: WebVital) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      custom_map: {
        metric_rating: metric.rating,
        metric_delta: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
      },
    });
  }

  // Console logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      entries: metric.entries.length,
    });
  }
}

// Main function to start monitoring all Core Web Vitals
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getLCP(sendToAnalytics);
  getFCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

// Performance optimization helpers
export function optimizeForLCP() {
  // Preload critical resources
  const criticalResources = [
    '/fonts/inter-var.woff2',
    '/images/hero-bg.webp',
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.includes('.woff') ? 'font' : 'image';
    link.href = resource;
    if (resource.includes('.woff')) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

export function optimizeForCLS() {
  // Add aspect ratio CSS for images to prevent layout shift
  const style = document.createElement('style');
  style.textContent = `
    .aspect-ratio-container {
      position: relative;
      width: 100%;
    }
    .aspect-ratio-container::before {
      content: '';
      display: block;
      padding-top: var(--aspect-ratio, 56.25%);
    }
    .aspect-ratio-container > * {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;
  document.head.appendChild(style);
}

export function optimizeForFID() {
  // Defer non-critical JavaScript
  const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
  
  nonCriticalScripts.forEach(script => {
    const newScript = document.createElement('script');
    newScript.src = script.getAttribute('src') || '';
    newScript.defer = true;
    
    // Load after main thread is idle
    requestIdleCallback(() => {
      document.head.appendChild(newScript);
    });
    
    script.remove();
  });
}

// Resource hints for better performance
export function addResourceHints() {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossorigin) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

// Critical CSS inlining
export function inlineCriticalCSS(css: string) {
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
}

// Performance budget monitoring
export function checkPerformanceBudget() {
  if (typeof window === 'undefined') return;

  const budgets = {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    totalJS: 500000, // 500KB
    totalCSS: 100000, // 100KB
  };

  // Check resource sizes
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  let totalJS = 0;
  let totalCSS = 0;

  resources.forEach(resource => {
    if (resource.name.includes('.js')) {
      totalJS += resource.transferSize || 0;
    }
    if (resource.name.includes('.css')) {
      totalCSS += resource.transferSize || 0;
    }
  });

  const budgetResults = {
    totalJS: {
      size: totalJS,
      budget: budgets.totalJS,
      exceeded: totalJS > budgets.totalJS,
    },
    totalCSS: {
      size: totalCSS,
      budget: budgets.totalCSS,
      exceeded: totalCSS > budgets.totalCSS,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('💰 Performance Budget:', budgetResults);
  }

  return budgetResults;
}