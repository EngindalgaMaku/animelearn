"use client";

import { GameState, BattleCard } from '../../types/battle/core';

export interface PerformanceMetrics {
  frameRate: number;
  memoryUsage: number;
  renderTime: number;
  aiResponseTime: number;
  networkLatency: number;
  cardRenderCount: number;
  effectsCount: number;
  soundsPlaying: number;
}

export interface OptimizationSettings {
  enableAnimations: boolean;
  animationQuality: 'low' | 'medium' | 'high' | 'ultra';
  maxParticles: number;
  enableShadows: boolean;
  enableBlur: boolean;
  enableGlow: boolean;
  maxSoundsSimultaneous: number;
  enableAutoBatching: boolean;
  enableLazyLoading: boolean;
  enableMemoryOptimization: boolean;
  targetFPS: number;
}

class PerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    frameRate: 60,
    memoryUsage: 0,
    renderTime: 0,
    aiResponseTime: 0,
    networkLatency: 0,
    cardRenderCount: 0,
    effectsCount: 0,
    soundsPlaying: 0
  };

  private settings: OptimizationSettings = {
    enableAnimations: true,
    animationQuality: 'high',
    maxParticles: 100,
    enableShadows: true,
    enableBlur: true,
    enableGlow: true,
    maxSoundsSimultaneous: 8,
    enableAutoBatching: true,
    enableLazyLoading: true,
    enableMemoryOptimization: true,
    targetFPS: 60
  };

  private performanceLevel: 'potato' | 'low' | 'medium' | 'high' | 'ultra' = 'high';
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private frameTimeHistory: number[] = [];
  private memoryHistory: number[] = [];

  constructor() {
    this.loadSettings();
    this.detectPerformanceLevel();
  }

  private loadSettings() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('battlePerformanceSettings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    }
  }

  private saveSettings() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('battlePerformanceSettings', JSON.stringify(this.settings));
    }
  }

  private detectPerformanceLevel() {
    if (typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    
    let score = 0;

    // Check hardware capabilities
    if (gl && 'getExtension' in gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (typeof renderer === 'string') {
          if (renderer.includes('Intel')) score += 1;
          else if (renderer.includes('NVIDIA') || renderer.includes('AMD')) score += 3;
        }
      }
      score += 2; // WebGL support
    }

    // Check memory
    if ((navigator as any).deviceMemory) {
      const memory = (navigator as any).deviceMemory;
      if (memory >= 8) score += 3;
      else if (memory >= 4) score += 2;
      else score += 1;
    } else {
      score += 2; // Assume medium
    }

    // Check CPU cores
    if (navigator.hardwareConcurrency) {
      const cores = navigator.hardwareConcurrency;
      if (cores >= 8) score += 3;
      else if (cores >= 4) score += 2;
      else score += 1;
    } else {
      score += 2; // Assume medium
    }

    // Determine performance level
    if (score >= 9) this.performanceLevel = 'ultra';
    else if (score >= 7) this.performanceLevel = 'high';
    else if (score >= 5) this.performanceLevel = 'medium';
    else if (score >= 3) this.performanceLevel = 'low';
    else this.performanceLevel = 'potato';

    this.applyPerformancePreset();
  }

  private applyPerformancePreset() {
    switch (this.performanceLevel) {
      case 'potato':
        this.settings = {
          ...this.settings,
          enableAnimations: false,
          animationQuality: 'low',
          maxParticles: 10,
          enableShadows: false,
          enableBlur: false,
          enableGlow: false,
          maxSoundsSimultaneous: 2,
          targetFPS: 30
        };
        break;
      case 'low':
        this.settings = {
          ...this.settings,
          enableAnimations: true,
          animationQuality: 'low',
          maxParticles: 25,
          enableShadows: false,
          enableBlur: false,
          enableGlow: false,
          maxSoundsSimultaneous: 4,
          targetFPS: 30
        };
        break;
      case 'medium':
        this.settings = {
          ...this.settings,
          enableAnimations: true,
          animationQuality: 'medium',
          maxParticles: 50,
          enableShadows: true,
          enableBlur: false,
          enableGlow: true,
          maxSoundsSimultaneous: 6,
          targetFPS: 60
        };
        break;
      case 'high':
        this.settings = {
          ...this.settings,
          enableAnimations: true,
          animationQuality: 'high',
          maxParticles: 100,
          enableShadows: true,
          enableBlur: true,
          enableGlow: true,
          maxSoundsSimultaneous: 8,
          targetFPS: 60
        };
        break;
      case 'ultra':
        this.settings = {
          ...this.settings,
          enableAnimations: true,
          animationQuality: 'ultra',
          maxParticles: 200,
          enableShadows: true,
          enableBlur: true,
          enableGlow: true,
          maxSoundsSimultaneous: 12,
          targetFPS: 120
        };
        break;
    }
    this.saveSettings();
  }

  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.updateMetrics();
      this.adaptiveOptimization();
    }, 1000);
  }

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  private updateMetrics() {
    // Frame rate calculation
    const now = performance.now();
    this.frameTimeHistory.push(now);
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }
    
    if (this.frameTimeHistory.length > 1) {
      const totalTime = this.frameTimeHistory[this.frameTimeHistory.length - 1] - this.frameTimeHistory[0];
      this.metrics.frameRate = Math.round((this.frameTimeHistory.length - 1) / (totalTime / 1000));
    }

    // Memory usage
    if ((performance as any).memory) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
      this.memoryHistory.push(this.metrics.memoryUsage);
      if (this.memoryHistory.length > 60) {
        this.memoryHistory.shift();
      }
    }

    // Count active elements
    this.metrics.cardRenderCount = document.querySelectorAll('[data-card-component]').length;
    this.metrics.effectsCount = document.querySelectorAll('[data-effect-animation]').length;
  }

  private adaptiveOptimization() {
    // Auto-adjust settings based on performance
    if (this.metrics.frameRate < this.settings.targetFPS * 0.8) {
      this.downgradeSettings();
    } else if (this.metrics.frameRate > this.settings.targetFPS * 1.1) {
      this.upgradeSettings();
    }

    // Memory management
    if (this.metrics.memoryUsage > 100) { // 100MB threshold
      this.enforceMemoryLimits();
    }
  }

  private downgradeSettings() {
    if (this.settings.animationQuality === 'ultra') {
      this.settings.animationQuality = 'high';
    } else if (this.settings.animationQuality === 'high') {
      this.settings.animationQuality = 'medium';
    } else if (this.settings.animationQuality === 'medium') {
      this.settings.animationQuality = 'low';
    }

    if (this.settings.maxParticles > 25) {
      this.settings.maxParticles = Math.floor(this.settings.maxParticles * 0.8);
    }

    if (this.settings.enableGlow) {
      this.settings.enableGlow = false;
    } else if (this.settings.enableBlur) {
      this.settings.enableBlur = false;
    } else if (this.settings.enableShadows) {
      this.settings.enableShadows = false;
    }

    this.saveSettings();
  }

  private upgradeSettings() {
    // Only upgrade if we have sustained good performance
    const recentFrames = this.frameTimeHistory.slice(-30);
    const avgFrameRate = recentFrames.length > 10 ? 
      recentFrames.reduce((sum, time, i, arr) => {
        if (i === 0) return 0;
        return sum + 1000 / (time - arr[i-1]);
      }, 0) / (recentFrames.length - 1) : this.metrics.frameRate;

    if (avgFrameRate > this.settings.targetFPS * 1.2) {
      if (!this.settings.enableShadows) {
        this.settings.enableShadows = true;
      } else if (!this.settings.enableBlur) {
        this.settings.enableBlur = true;
      } else if (!this.settings.enableGlow) {
        this.settings.enableGlow = true;
      } else if (this.settings.maxParticles < 200) {
        this.settings.maxParticles = Math.floor(this.settings.maxParticles * 1.2);
      }
    }

    this.saveSettings();
  }

  private enforceMemoryLimits() {
    // Clear old animation data
    const elements = document.querySelectorAll('[data-cleanup-ready]');
    elements.forEach(el => el.remove());

    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }

    // Reduce particle count
    if (this.settings.maxParticles > 25) {
      this.settings.maxParticles = Math.floor(this.settings.maxParticles * 0.7);
    }
  }

  // Card rendering optimization
  optimizeCardRendering(cards: BattleCard[]): BattleCard[] {
    if (!this.settings.enableLazyLoading) {
      return cards;
    }

    // Only render visible cards
    const visibleCards = cards.filter((card, index) => {
      const element = document.querySelector(`[data-card-id="${card.id}"]`);
      if (!element) return true; // Render if not in DOM yet
      
      const rect = element.getBoundingClientRect();
      return rect.bottom >= 0 && rect.top <= window.innerHeight;
    });

    return visibleCards;
  }

  // Animation optimization
  getOptimizedAnimationConfig() {
    return {
      enabled: this.settings.enableAnimations,
      quality: this.settings.animationQuality,
      reducedMotion: this.settings.animationQuality === 'low',
      maxParticles: this.settings.maxParticles,
      enableShadows: this.settings.enableShadows,
      enableBlur: this.settings.enableBlur,
      enableGlow: this.settings.enableGlow
    };
  }

  // Batch operations for better performance
  batchOperations<T>(operations: (() => T)[]): T[] {
    if (!this.settings.enableAutoBatching) {
      return operations.map(op => op());
    }

    // Use requestAnimationFrame for batching
    return new Promise<T[]>((resolve) => {
      requestAnimationFrame(() => {
        const results = operations.map(op => op());
        resolve(results);
      });
    }) as any;
  }

  // Memory-efficient game state management
  optimizeGameState(gameState: GameState): GameState {
    if (!this.settings.enableMemoryOptimization) {
      return gameState;
    }

    // Create a lightweight copy with only essential data
    const optimized: GameState = {
      ...gameState,
      actionHistory: gameState.actionHistory.slice(-50), // Keep only recent actions
      player: {
        ...gameState.player,
        graveyard: gameState.player.graveyard.slice(-20) // Limit graveyard size
      },
      opponent: {
        ...gameState.opponent,
        graveyard: gameState.opponent.graveyard.slice(-20)
      }
    };

    return optimized;
  }

  // Network optimization for multiplayer
  optimizeNetworkData(data: any): any {
    // Compress data for network transmission
    const optimized = {
      ...data,
      timestamp: Date.now()
    };

    // Remove unnecessary fields for network transmission
    if (optimized.gameState) {
      delete optimized.gameState.actionHistory;
      delete optimized.gameState.turnStartTime;
    }

    return optimized;
  }

  // Public API
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getSettings(): OptimizationSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<OptimizationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  getPerformanceLevel(): string {
    return this.performanceLevel;
  }

  // Performance testing utilities
  async runPerformanceTest(): Promise<{
    averageFrameRate: number;
    memoryUsage: number;
    renderTime: number;
    recommendation: string;
  }> {
    const startTime = performance.now();
    const startMemory = this.metrics.memoryUsage;

    // Simulate heavy rendering
    for (let i = 0; i < 100; i++) {
      await new Promise(resolve => requestAnimationFrame(resolve));
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;
    const memoryUsage = this.metrics.memoryUsage - startMemory;

    let recommendation = 'Current settings are optimal';
    if (renderTime > 2000) {
      recommendation = 'Consider lowering visual quality for better performance';
    } else if (renderTime < 500) {
      recommendation = 'You can increase visual quality for better experience';
    }

    return {
      averageFrameRate: this.metrics.frameRate,
      memoryUsage,
      renderTime,
      recommendation
    };
  }

  // Debug information
  getDebugInfo(): object {
    return {
      metrics: this.metrics,
      settings: this.settings,
      performanceLevel: this.performanceLevel,
      frameHistory: this.frameTimeHistory.slice(-10),
      memoryHistory: this.memoryHistory.slice(-10),
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory
    };
  }
}

// Global performance optimizer instance
export const performanceOptimizer = new PerformanceOptimizer();

// React hook for performance optimization
export function usePerformanceOptimization() {
  const startMonitoring = () => {
    performanceOptimizer.startMonitoring();
  };

  const stopMonitoring = () => {
    performanceOptimizer.stopMonitoring();
  };

  const getMetrics = () => {
    return performanceOptimizer.getMetrics();
  };

  const getSettings = () => {
    return performanceOptimizer.getSettings();
  };

  const updateSettings = (settings: Partial<OptimizationSettings>) => {
    performanceOptimizer.updateSettings(settings);
  };

  const runTest = async () => {
    return await performanceOptimizer.runPerformanceTest();
  };

  const getAnimationConfig = () => {
    return performanceOptimizer.getOptimizedAnimationConfig();
  };

  return {
    startMonitoring,
    stopMonitoring,
    getMetrics,
    getSettings,
    updateSettings,
    runTest,
    getAnimationConfig,
    performanceLevel: performanceOptimizer.getPerformanceLevel()
  };
}

// Utility functions for common optimizations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export default performanceOptimizer;