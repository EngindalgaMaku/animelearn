'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  getResponsiveImageSizes, 
  getImagePriority, 
  getOptimizedImageUrl,
  trackImagePerformance 
} from '@/lib/performance/image-optimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  type?: 'card' | 'hero' | 'thumbnail' | 'banner';
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  type = 'card',
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadStartTime] = useState(() => performance.now());

  useEffect(() => {
    // Optimize image URL based on device capabilities
    const optimizeImage = async () => {
      try {
        const optimizedSrc = await getOptimizedImageUrl(src, width, quality);
        setImageSrc(optimizedSrc);
      } catch (error) {
        console.warn('Failed to optimize image:', error);
        setImageSrc(src);
      }
    };

    optimizeImage();
  }, [src, width, quality]);

  const handleLoad = () => {
    setIsLoading(false);
    trackImagePerformance(src, loadStartTime);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  // Fallback image for errors
  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-slate-100 ${className}`}
        style={{ width, height }}
      >
        <div className="text-slate-400 text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <span className="text-xs">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={getResponsiveImageSizes(type)}
        placeholder={placeholder}
        blurDataURL={blurDataURL || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+hBhSVJL/xZqJGyBhUVcKbm1Nv2aKlOH9VdtDBHMKG4hYGGhgOxqU4kEVQKpGcEvwRAjNojEoAwdTgAQ8n5X7fOo5lWKpgJhzwxK4zJhJuN1Nzl8aBFONwVOoJW5NKY+OOsj2hH7CKLVyZ9V1r3c+KvM3FjFfnS0UNnZy2GKx4BPvJy/7jdLKb+txFfTVjK5Xv5nIDPw2R8RGDgSyIz4K45VD7Ac/nz6BqhBNfDO4TGNMFQRGrp4oUJvAKZLkTYmrLZq5SX/Y0xZvmCJOk6KjYiJGXYGnykXdYpVvOGXzCZO5PKlQV9T8vYBn6zQTKrfLBHkjrTjvjAL8mI2lD9jgwOkxo7aKD5SfCKc9VyaJdmLHnvxzjW3OlwMIjLvnZp+qP9QfMyGz5iZlr8nNrlr0HQ1H5kxVjJMsrsVCvlFEXMKGOPQHRwU9f1Zfq+TJk16Y3DjL6cFfHMO0dTHVUKLSSdNm8j/xr+n1wz7WVhvpJMSHqQ+XiZJlIHfMYFI41Zpr7s+TiWHhLTFMsGwQGGI9k7bkwpF7JIU7sjXW6f5m3pZveMJY6YaXXV5Hf1sHvfzg0qF9Z+UKjCNrxHGCLWXoNfFKJjqHMK9xkNovrnrq6E8WYS0EwWq3C0lCOGb/EHVWDc5yfUkP7++7yFu3SjgU0r5h6ldhLBUnZcZkNFFFLCYCVHrOgz8C+xqpMFUbAFY5V2tUE1rUIYhEgkLDj9K/gE0PJLfFKEhRgKJ2VSlVLDCFHzQ8Q7G5gAEvmwsJSV0I+KHdv5KD0h8Mv8AK/y6rtrKQ2YwQ2YSNFrEn+gF6/NcPbXr5XYzHdfwB9HGS34+oXJcNbL4UH9BgPlH5PN8+C5vL2Kv5cSZQAz8zMggG2E5GCxm1+7rR5HGbmXFdOLgzCEKJFMFFhfOyq5rJcYOBVYNF0r8ZmP/LYy9PJbR6yNdIV4G7TQDvLJnUQzhhPNJw51MG9VCNkjzGFdNwJBBJk9qoJJKOXWlnEHjrPNBhSVJG/JZkm0jS2yS6A3xIRgIKo1NFBQHr6PkU8cQlwQ8MWLIo2uQGK0QRAp+PxQRbBLo9A2KI0+oTv5lUfgS+2lJBg8dG8lAKTvDJGk6kGI5zCrN0rAmklygLAYhZ0F6ATQN'}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          transition-all duration-300 ease-in-out
          ${isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'}
        `}
        {...props}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
      )}
    </div>
  );
}

// Specialized components for different use cases
export function CardImage({ src, alt, className, ...props }: Omit<OptimizedImageProps, 'type'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      type="card"
      className={className}
      width={300}
      height={400}
      placeholder="blur"
      {...props}
    />
  );
}

export function HeroImage({ src, alt, className, priority = true, ...props }: Omit<OptimizedImageProps, 'type'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      type="hero"
      className={className}
      priority={priority}
      quality={85}
      {...props}
    />
  );
}

export function ThumbnailImage({ src, alt, className, ...props }: Omit<OptimizedImageProps, 'type'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      type="thumbnail"
      className={className}
      width={150}
      height={150}
      quality={70}
      {...props}
    />
  );
}

export function BannerImage({ src, alt, className, ...props }: Omit<OptimizedImageProps, 'type'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      type="banner"
      className={className}
      priority={true}
      quality={85}
      {...props}
    />
  );
}