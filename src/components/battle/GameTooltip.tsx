"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Zap, Heart, Shield, Sword, Star } from 'lucide-react';

interface TooltipProps {
  content: string;
  title?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  showIcon?: boolean;
  type?: 'default' | 'warning' | 'success' | 'info';
}

const typeStyles = {
  default: 'bg-gray-900 border-gray-600',
  warning: 'bg-orange-900 border-orange-600',
  success: 'bg-green-900 border-green-600',
  info: 'bg-blue-900 border-blue-600'
};

const typeIcons = {
  default: Info,
  warning: Star,
  success: Shield,
  info: Zap
};

export default function GameTooltip({ 
  content, 
  title, 
  children, 
  position = 'top', 
  delay = 500,
  showIcon = true,
  type = 'default'
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const Icon = typeIcons[type];

  useEffect(() => {
    const updatePosition = () => {
      if (!tooltipRef.current || !triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let newPosition = position;

      // Check if tooltip would go off screen and adjust
      if (position === 'top' && triggerRect.top - tooltipRect.height < 0) {
        newPosition = 'bottom';
      } else if (position === 'bottom' && triggerRect.bottom + tooltipRect.height > viewport.height) {
        newPosition = 'top';
      } else if (position === 'left' && triggerRect.left - tooltipRect.width < 0) {
        newPosition = 'right';
      } else if (position === 'right' && triggerRect.right + tooltipRect.width > viewport.width) {
        newPosition = 'left';
      }

      setActualPosition(newPosition);
    };

    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (actualPosition) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (actualPosition) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-900 border-l-4 border-r-4 border-t-4';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-gray-900 border-l-4 border-r-4 border-b-4';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-gray-900 border-t-4 border-b-4 border-l-4';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-gray-900 border-t-4 border-b-4 border-r-4';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-900 border-l-4 border-r-4 border-t-4';
    }
  };

  return (
    <div 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute z-50 max-w-xs ${getPositionClasses()}
            `}
          >
            <div className={`
              ${typeStyles[type]} backdrop-blur-sm rounded-lg border p-3 shadow-xl
            `}>
              {title && (
                <div className="flex items-center space-x-2 mb-2">
                  {showIcon && <Icon className="h-4 w-4 text-yellow-400" />}
                  <h4 className="text-white font-semibold text-sm">{title}</h4>
                </div>
              )}
              <p className="text-gray-300 text-sm leading-relaxed">{content}</p>
            </div>
            
            {/* Arrow */}
            <div className={`absolute w-0 h-0 ${getArrowClasses()}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pre-built tooltip components for common game elements
export function HealthTooltip({ children }: { children: React.ReactNode }) {
  return (
    <GameTooltip
      title="Can Puanı"
      content="Oyuncunun hayatta kalma gücü. 0'a düştüğünde oyun kaybedilir. Saldırılar ve büyüler can azaltır, iyileştirme büyüleri can artırır."
      type="success"
    >
      {children}
    </GameTooltip>
  );
}

export function ManaTooltip({ children }: { children: React.ReactNode }) {
  return (
    <GameTooltip
      title="Mana Puanı"
      content="Kartları oynamak için gereken enerji. Her tur başında maksimum mana yenilenir. Kartın sağ üst köşesindeki sayı mana maliyetini gösterir."
      type="info"
    >
      {children}
    </GameTooltip>
  );
}

export function AttackTooltip({ children }: { children: React.ReactNode }) {
  return (
    <GameTooltip
      title="Saldırı Gücü"
      content="Kartın hasar verme kapasitesi. Rakip kartlara veya doğrudan rakibe saldırırken kullanılır. Yüksek saldırı = daha fazla hasar."
      type="warning"
    >
      {children}
    </GameTooltip>
  );
}

export function DefenseTooltip({ children }: { children: React.ReactNode }) {
  return (
    <GameTooltip
      title="Savunma Gücü"
      content="Kartın aldığı hasarı azaltan değer. Savunma 3 olan bir karta 5 hasar verilirse, gerçekte sadece 2 hasar alır."
      type="default"
    >
      {children}
    </GameTooltip>
  );
}

export function TurnTimerTooltip({ children }: { children: React.ReactNode }) {
  return (
    <GameTooltip
      title="Tur Zamanlayıcısı"
      content="Her tur için kalan süre. Süre dolduğunda tur otomatik olarak geçer. Hızlı düşünün ve stratejik hamleler yapın!"
      type="warning"
    >
      {children}
    </GameTooltip>
  );
}