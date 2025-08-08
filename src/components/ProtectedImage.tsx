"use client";

import { useEffect, useRef, useState } from "react";

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  watermarkText?: string;
  showWatermark?: boolean;
}

export default function ProtectedImage({
  src,
  alt,
  className = "",
  watermarkText = "©PROTECTED",
  showWatermark = false,
}: ProtectedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Container boyutunu al
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // Canvas boyutunu container'a eşitle
      canvas.width = containerWidth;
      canvas.height = containerHeight;

      // Resim aspect ratio'su
      const imgAspectRatio = img.width / img.height;
      const containerAspectRatio = containerWidth / containerHeight;

      let drawWidth,
        drawHeight,
        offsetX = 0,
        offsetY = 0;

      // object-cover mantığı - container'ı tamamen doldur
      if (imgAspectRatio > containerAspectRatio) {
        // Resim daha geniş - height'ı container'a fit et
        drawHeight = containerHeight;
        drawWidth = drawHeight * imgAspectRatio;
        offsetX = (containerWidth - drawWidth) / 2;
      } else {
        // Resim daha uzun - width'i container'a fit et
        drawWidth = containerWidth;
        drawHeight = drawWidth / imgAspectRatio;
        offsetY = (containerHeight - drawHeight) / 2;
      }

      // Canvas'ı temizle
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // Resmi çiz
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Watermark ekle
      if (showWatermark && watermarkText) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = "#000000";
        ctx.font = `${Math.max(12, containerWidth / 20)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(watermarkText, containerWidth / 2, containerHeight / 2);
        ctx.restore();
      }

      setIsLoaded(true);
    };

    img.onerror = () => {
      setError(true);
    };

    img.src = src;

    // Protection event listeners
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const preventDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    const preventSelect = (e: Event) => {
      e.preventDefault();
      return false;
    };

    if (canvas) {
      canvas.addEventListener("contextmenu", preventRightClick);
      canvas.addEventListener("dragstart", preventDragStart);
      canvas.addEventListener("selectstart", preventSelect);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("contextmenu", preventRightClick);
        canvas.removeEventListener("dragstart", preventDragStart);
        canvas.removeEventListener("selectstart", preventSelect);
      }
    };
  }, [src, watermarkText, showWatermark]);

  if (error) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${!isLoaded ? "hidden" : ""}`}
        style={{
          userSelect: "none",
          pointerEvents: isLoaded ? "auto" : "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
        aria-label={alt}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
