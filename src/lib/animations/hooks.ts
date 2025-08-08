"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDeviceCapabilities } from "@/lib/responsive";

/**
 * Animation hooks for anime-themed Python learning platform
 */

// Motion preference hook
export function useMotionPreference() {
  const { prefersReducedMotion } = useDeviceCapabilities();

  return {
    prefersReducedMotion,
    shouldAnimate: !prefersReducedMotion,
    // Provide fallback animations for reduced motion
    getVariant: (normalVariant: string, reducedVariant?: string) =>
      prefersReducedMotion ? reducedVariant || "static" : normalVariant,
  };
}

// Intersection observer hook for scroll animations
export function useInView(options: IntersectionObserverInit = {}) {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasBeenInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [options]);

  return { ref, isInView, hasBeenInView };
}

// Scroll progress hook
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = window.scrollY / totalHeight;
      setScrollProgress(Math.min(Math.max(currentProgress, 0), 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollProgress;
}

// Element scroll progress hook
export function useElementScrollProgress() {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate how much of the element is visible
      const visibleTop = Math.max(0, windowHeight - rect.top);
      const visibleBottom = Math.min(
        windowHeight,
        windowHeight - (rect.bottom - windowHeight)
      );
      const visibleHeight = Math.min(visibleTop, elementHeight);

      const scrollProgress = Math.min(
        Math.max(visibleHeight / elementHeight, 0),
        1
      );
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { ref, progress };
}

// Mouse position hook for interactive animations
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set mouse as not moving after 100ms of inactivity
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { mousePosition, isMoving };
}

// Element hover hook
export function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return { ref, isHovered };
}

// Focus hook for accessibility
export function useFocus() {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);

    return () => {
      element.removeEventListener("focus", handleFocus);
      element.removeEventListener("blur", handleBlur);
    };
  }, []);

  return { ref, isFocused };
}

// Window size change animation trigger
export function useWindowResize() {
  const [isResizing, setIsResizing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsResizing(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsResizing(false);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return isResizing;
}

// Sequence animation hook
export function useSequence() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((totalSteps: number, stepDuration: number = 300) => {
    setIsPlaying(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  return { currentStep, isPlaying, play, reset };
}

// Parallax hook
export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const scrolled = window.scrollY;
      const rate = scrolled * speed;

      setOffset(rate);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return { ref, offset };
}

// Performance-aware animation hook
export function usePerformanceAnimation() {
  const [canAnimate, setCanAnimate] = useState(true);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const checkPerformance = () => {
      const now = performance.now();
      const delta = now - lastTime.current;
      lastTime.current = now;

      frameCount.current++;

      // If frame time is consistently over 16ms (60fps), reduce animations
      if (frameCount.current % 60 === 0) {
        const avgFrameTime = delta;
        setCanAnimate(avgFrameTime < 20); // Allow up to 50fps
      }

      requestAnimationFrame(checkPerformance);
    };

    const id = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(id);
  }, []);

  return canAnimate;
}

// Stagger children animation hook
export function useStaggerChildren(childCount: number, delay: number = 0.1) {
  const [visibleChildren, setVisibleChildren] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setVisibleChildren(0);

    for (let i = 0; i <= childCount; i++) {
      setTimeout(() => {
        setVisibleChildren(i);
        if (i === childCount) {
          setIsAnimating(false);
        }
      }, i * delay * 1000);
    }
  }, [childCount, delay]);

  const reset = useCallback(() => {
    setVisibleChildren(0);
    setIsAnimating(false);
  }, []);

  return { visibleChildren, isAnimating, startAnimation, reset };
}

// Touch gesture hook for mobile animations
export function useSwipeGesture() {
  const [swipeDirection, setSwipeDirection] = useState<
    "left" | "right" | "up" | "down" | null
  >(null);
  const [isSwipping, setIsSwipping] = useState(false);
  const startTouch = useRef<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startTouch.current = { x: touch.clientX, y: touch.clientY };
      setIsSwipping(true);
      setSwipeDirection(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startTouch.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - startTouch.current.x;
      const deltaY = touch.clientY - startTouch.current.y;

      // Determine swipe direction based on largest delta
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setSwipeDirection(deltaX > 0 ? "right" : "left");
      } else {
        setSwipeDirection(deltaY > 0 ? "down" : "up");
      }
    };

    const handleTouchEnd = () => {
      startTouch.current = null;
      setIsSwipping(false);
      // Keep direction for a brief moment, then clear
      setTimeout(() => setSwipeDirection(null), 300);
    };

    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return { ref, swipeDirection, isSwipping };
}
