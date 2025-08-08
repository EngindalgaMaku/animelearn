"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MousePointer,
  ArrowDown,
  ArrowUp,
  Hand,
  Target,
  Zap,
  Clock,
  AlertCircle
} from 'lucide-react';

interface HintProps {
  type: 'click' | 'drag' | 'hover' | 'wait' | 'urgent';
  message: string;
  position: { x: number; y: number };
  isVisible: boolean;
  onDismiss?: () => void;
}

interface AnimatedHintsProps {
  hints: HintProps[];
}

const hintIcons = {
  click: MousePointer,
  drag: Hand,
  hover: Target,
  wait: Clock,
  urgent: AlertCircle
};

const hintColors = {
  click: 'from-blue-500 to-cyan-500',
  drag: 'from-green-500 to-emerald-500',
  hover: 'from-purple-500 to-violet-500',
  wait: 'from-yellow-500 to-orange-500',
  urgent: 'from-red-500 to-pink-500'
};

export default function AnimatedHints({ hints }: AnimatedHintsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {hints.map((hint, index) => {
          const Icon = hintIcons[hint.type];
          const colorGradient = hintColors[hint.type];
          
          return hint.isVisible ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              style={{
                left: hint.position.x,
                top: hint.position.y,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute pointer-events-auto"
            >
              {/* Main hint bubble */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`
                  bg-gradient-to-r ${colorGradient} rounded-xl p-3 shadow-2xl 
                  border border-white/20 backdrop-blur-sm max-w-xs
                `}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className="h-5 w-5 text-white" />
                  <span className="text-white font-semibold text-sm">
                    {hint.type === 'click' && 'Tıklayın'}
                    {hint.type === 'drag' && 'Sürükleyin'}
                    {hint.type === 'hover' && 'Üzerine Gelin'}
                    {hint.type === 'wait' && 'Bekleyin'}
                    {hint.type === 'urgent' && 'Acil!'}
                  </span>
                </div>
                <p className="text-white text-xs leading-relaxed">
                  {hint.message}
                </p>
                
                {hint.onDismiss && (
                  <button
                    onClick={hint.onDismiss}
                    className="absolute top-1 right-1 w-4 h-4 text-white/60 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </motion.div>

              {/* Animated pointer for click hints */}
              {hint.type === 'click' && (
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2"
                >
                  <ArrowDown className="h-6 w-6 text-white" />
                </motion.div>
              )}

              {/* Pulsing ring for urgent hints */}
              {hint.type === 'urgent' && (
                <motion.div
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.8, 0, 0.8]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 border-2 border-red-400 rounded-xl"
                />
              )}

              {/* Loading dots for wait hints */}
              {hint.type === 'wait' && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                      className="w-2 h-2 bg-yellow-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
}

// Helper hook for managing hints
export function useAnimatedHints() {
  const [hints, setHints] = useState<HintProps[]>([]);

  const addHint = (hint: Omit<HintProps, 'isVisible'>) => {
    setHints(prev => [...prev, { ...hint, isVisible: true }]);
  };

  const removeHint = (index: number) => {
    setHints(prev => 
      prev.map((hint, i) => 
        i === index ? { ...hint, isVisible: false } : hint
      )
    );
  };

  const clearHints = () => {
    setHints([]);
  };

  return { hints, addHint, removeHint, clearHints };
}

// Pre-built hint configurations
export const gameHints = {
  playFirstCard: {
    type: 'click' as const,
    message: 'İlk kartınızı oynamak için elinizden bir kart seçin. Yeşil noktalı kartlar oynanabilir!',
  },
  selectTarget: {
    type: 'click' as const,
    message: 'Bu kart bir hedef gerektiriyor. Saldırmak istediğiniz kartı veya rakibi seçin.',
  },
  waitingForAI: {
    type: 'wait' as const,
    message: 'AI hamlesini düşünüyor. Stratejinizi gözden geçirin.',
  },
  timeRunningOut: {
    type: 'urgent' as const,
    message: 'Süreniz bitiyor! Hızlıca bir hamle yapın.',
  },
  useAbility: {
    type: 'hover' as const,
    message: 'Bu kartın özel yetenekleri var. Detayları görmek için üzerine gelin.',
  }
};