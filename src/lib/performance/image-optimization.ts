import { ImageProps } from 'next/image';

// Image optimization utilities for better Core Web Vitals
export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  priority?: boolean;
  lazy?: boolean;
}

// Generate responsive image sizes based on viewport
export function getResponsiveImageSizes(type: 'card' | 'hero' | 'thumbnail' | 'banner'): string {
  switch (type) {
    case 'card':
      return '(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw';
    case 'hero':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw';
    case 'thumbnail':
      return '(max-width: 640px) 25vw, (max-width: 768px) 20vw, 15vw';
    case 'banner':
      return '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 70vw';
    default:
      return '100vw';
  }
}

// Preload critical images for better LCP
export function preloadCriticalImages(images: string[]) {
  if (typeof window !== 'undefined') {
    images.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
}

// Generate blur data URL for better perceived performance
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(0.5, '#e5e7eb');
  gradient.addColorStop(1, '#d1d5db');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

// Image loading priority helper
export function getImagePriority(context: 'above-fold' | 'below-fold' | 'lazy'): boolean {
  return context === 'above-fold';
}

// WebP support detection
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// AVIF support detection  
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

// Generate optimized image URL based on device capabilities
export async function getOptimizedImageUrl(
  src: string, 
  width?: number, 
  quality: number = 75
): Promise<string> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return src;
  }

  const [webpSupported, avifSupported] = await Promise.all([
    supportsWebP(),
    supportsAVIF()
  ]);

  let optimizedSrc = src;

  // Add quality parameter if URL supports it
  const separator = src.includes('?') ? '&' : '?';
  optimizedSrc += `${separator}q=${quality}`;

  // Add width parameter for responsive images
  if (width) {
    optimizedSrc += `&w=${width}`;
  }

  // Add format parameter based on browser support
  if (avifSupported) {
    optimizedSrc += '&f=avif';
  } else if (webpSupported) {
    optimizedSrc += '&f=webp';
  }

  return optimizedSrc;
}

// Lazy loading observer for custom images
export class LazyImageObserver {
  private observer: IntersectionObserver;
  private images: Set<HTMLImageElement> = new Set();

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer.unobserve(img);
            this.images.delete(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );
  }

  observe(img: HTMLImageElement) {
    this.images.add(img);
    this.observer.observe(img);
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }

  disconnect() {
    this.observer.disconnect();
    this.images.clear();
  }
}

// Create global lazy loading instance
let globalLazyObserver: LazyImageObserver | null = null;

export function getGlobalLazyObserver(): LazyImageObserver {
  if (!globalLazyObserver && typeof window !== 'undefined') {
    globalLazyObserver = new LazyImageObserver();
  }
  return globalLazyObserver!;
}

// Performance monitoring for images
export function trackImagePerformance(src: string, startTime: number) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // Track image loading performance
    if ('gtag' in window) {
      (window as any).gtag('event', 'image_load_time', {
        event_category: 'Performance',
        event_label: src,
        value: Math.round(loadTime)
      });
    }
    
    console.log(`Image loaded: ${src} in ${loadTime.toFixed(2)}ms`);
  }
}