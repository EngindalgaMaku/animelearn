import React, { useState, useCallback } from "react";
import { useSecureImage } from "@/hooks/useSecureImage";
import { AlertCircle, RefreshCw, Shield } from "lucide-react";

interface SecureImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  showWatermark?: boolean;
  watermarkText?: string;
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
  // Image protection props
  draggable?: boolean;
  onContextMenu?: (e: React.MouseEvent) => void;
  onDragStart?: (e: React.DragEvent) => void;
  objectFit?: "cover" | "contain" | "fill" | "scale-down" | "none";
}

export function SecureImage({
  src,
  alt,
  className = "",
  style,
  onLoad,
  onError,
  showWatermark = true,
  watermarkText = "©PROTECTED",
  placeholder,
  fallback,
  draggable = false,
  onContextMenu,
  onDragStart,
  objectFit = "cover",
  ...props
}: SecureImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    secureUrl,
    isLoading,
    error,
    isExpired,
    refresh,
    handleImageError,
    isReady,
    hasError,
  } = useSecureImage(src);

  // Handle image load success
  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image load error
  const handleError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
    handleImageError();
    onError?.();
  }, [handleImageError, onError]);

  // Handle context menu (right-click)
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onContextMenu?.(e);
      return false;
    },
    [onContextMenu]
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDragStart?.(e);
      return false;
    },
    [onDragStart]
  );

  // Retry button component
  const RetryButton = () => (
    <button
      onClick={refresh}
      className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      type="button"
    >
      <RefreshCw className="h-4 w-4" />
      <span>Retry</span>
    </button>
  );

  // Loading state
  if (isLoading || (!isReady && !hasError)) {
    return (
      <div className={`relative ${className}`} style={style}>
        {placeholder || (
          <div className="flex items-center justify-center bg-gray-100 animate-pulse">
            <div className="flex flex-col items-center space-y-2 p-4">
              <Shield className="h-8 w-8 text-gray-400" />
              <span className="text-gray-500 text-sm">
                Loading secure image...
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (hasError || error || !secureUrl) {
    return (
      <div className={`relative ${className}`} style={style}>
        {fallback || (
          <div className="flex items-center justify-center bg-red-50 border border-red-200 rounded-lg">
            <div className="flex flex-col items-center space-y-3 p-4 text-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-red-700 text-sm font-medium">
                  {isExpired
                    ? "Security token expired"
                    : "Failed to load secure image"}
                </p>
                <p className="text-red-600 text-xs mt-1">
                  {error || "Please try again"}
                </p>
              </div>
              <RetryButton />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <img
        src={secureUrl}
        alt={alt}
        className={`w-full h-full object-${objectFit} ${
          imageLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 select-none pointer-events-none`}
        onLoad={handleLoad}
        onError={handleError}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        draggable={draggable}
        style={
          {
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            WebkitTouchCallout: "none",
            KhtmlUserSelect: "none",
          } as React.CSSProperties
        }
        {...props}
      />

      {/* Protection overlay */}
      <div
        className="absolute inset-0 bg-transparent pointer-events-auto z-10"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{ userSelect: "none" }}
      />

      {/* Watermark */}
      {showWatermark && imageLoaded && (
        <div className="absolute bottom-1 right-1 text-white/30 text-xs font-bold pointer-events-none select-none bg-black/20 px-1 rounded">
          {watermarkText}
        </div>
      )}

      {/* Security indicator */}
      {imageLoaded && (
        <div
          className="absolute top-1 left-1 bg-green-500 text-white p-1 rounded-full opacity-80 pointer-events-none"
          title="Secure Image"
        >
          <Shield className="h-3 w-3" />
        </div>
      )}

      {/* Loading overlay */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      )}

      {/* Expired warning */}
      {isExpired && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
          Refreshing...
        </div>
      )}
    </div>
  );
}

// Utility component for multiple secure images
interface SecureImageGridProps {
  images: Array<{
    src: string | null | undefined;
    alt: string;
    className?: string;
  }>;
  className?: string;
  imageClassName?: string;
  showWatermark?: boolean;
  watermarkText?: string;
}

export function SecureImageGrid({
  images,
  className = "",
  imageClassName = "",
  showWatermark = true,
  watermarkText = "©PROTECTED",
}: SecureImageGridProps) {
  return (
    <div className={className}>
      {images.map((image, index) => (
        <SecureImage
          key={index}
          src={image.src}
          alt={image.alt}
          className={image.className || imageClassName}
          showWatermark={showWatermark}
          watermarkText={watermarkText}
        />
      ))}
    </div>
  );
}

export default SecureImage;
