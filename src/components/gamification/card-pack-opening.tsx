"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Sparkles,
  Star,
  Crown,
  Zap,
  Diamond,
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  Gift,
  Trophy,
  Flame,
  Gem,
  Hexagon,
  Shield
} from "lucide-react";

interface Card {
  id: string;
  name: string;
  rarity: string;
  imageUrl?: string;
  rarityLevel: number;
  element?: string;
  series?: string;
  character?: string;
}

interface CardPack {
  id: string;
  name: string;
  packType: string;
  imageUrl?: string;
  rarity: string;
}

interface CardPackOpeningProps {
  isOpen: boolean;
  onClose: () => void;
  cardPack: CardPack;
  cards: Card[];
  onOpenComplete?: (cards: Card[]) => void;
  celebrationType?: 'normal' | 'big' | 'pack' | 'weekly' | 'special';
}

export default function CardPackOpening({
  isOpen,
  onClose,
  cardPack,
  cards,
  onOpenComplete,
  celebrationType = 'normal'
}: CardPackOpeningProps) {
  const [stage, setStage] = useState<'intro' | 'opening' | 'revealing' | 'celebration' | 'complete'>('intro');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [showRarityBurst, setShowRarityBurst] = useState(false);
  const [burstRarity, setBurstRarity] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Enhanced motion values for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [30, -30]);
  const rotateY = useTransform(mouseX, [-300, 300], [-30, 30]);

  // Reset state when pack opens
  useEffect(() => {
    if (isOpen) {
      setStage('intro');
      setCurrentCardIndex(0);
      setRevealedCards([]);
    }
  }, [isOpen]);

  const playSound = (type: 'pack_open' | 'card_reveal' | 'rare_card' | 'celebration') => {
    if (!soundEnabled) return;
    
    // In a real implementation, you would load actual sound files
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Different frequencies for different sounds
      const frequencies = {
        pack_open: 440,
        card_reveal: 523,
        rare_card: 659,
        celebration: 880
      };
      
      oscillator.frequency.setValueAtTime(frequencies[type], context.currentTime);
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    } catch (error) {
      // Fallback for browsers that don't support AudioContext
      console.log('Sound effect:', type);
    }
  };

  const startOpening = () => {
    setStage('opening');
    playSound('pack_open');
    
    setTimeout(() => {
      setStage('revealing');
      revealNextCard();
    }, 2000);
  };

  const revealNextCard = () => {
    if (currentCardIndex < cards.length) {
      const card = cards[currentCardIndex];
      setRevealedCards(prev => [...prev, card]);
      
      // Enhanced rarity burst effect
      if (card.rarityLevel >= 4) {
        setShowRarityBurst(true);
        setBurstRarity(card.rarityLevel);
        playSound('rare_card');
        setTimeout(() => setShowRarityBurst(false), 2000);
      } else {
        playSound('card_reveal');
      }
      
      setCurrentCardIndex(prev => prev + 1);
      
      if (currentCardIndex + 1 >= cards.length) {
        setTimeout(() => {
          setStage('celebration');
          playSound('celebration');
          
          setTimeout(() => {
            setStage('complete');
            onOpenComplete?.(cards);
          }, 3000);
        }, 1500);
      }
    }
  };

  const getRarityColor = (rarity: string, level: number) => {
    const colors = {
      1: 'from-gray-400 to-gray-600',
      2: 'from-green-400 to-green-600', 
      3: 'from-blue-400 to-blue-600',
      4: 'from-purple-400 to-purple-600',
      5: 'from-yellow-400 to-orange-500',
      6: 'from-pink-400 to-red-500'
    };
    return colors[level as keyof typeof colors] || colors[1];
  };

  const getRarityGlow = (level: number) => {
    const glows = {
      1: 'shadow-lg',
      2: 'shadow-green-500/50 shadow-2xl',
      3: 'shadow-blue-500/50 shadow-2xl',
      4: 'shadow-purple-500/50 shadow-2xl animate-pulse',
      5: 'shadow-yellow-500/50 shadow-2xl animate-pulse',
      6: 'shadow-pink-500/50 shadow-2xl animate-pulse'
    };
    return glows[level as keyof typeof glows] || glows[1];
  };

  const getRarityParticleColor = (level: number) => {
    const colors = {
      1: '#9CA3AF',
      2: '#10B981',
      3: '#3B82F6',
      4: '#8B5CF6',
      5: '#F59E0B',
      6: '#EF4444'
    };
    return colors[level as keyof typeof colors] || colors[1];
  };

  const getRarityIcon = (level: number) => {
    const icons = {
      1: <Star className="h-6 w-6" />,
      2: <Sparkles className="h-6 w-6" />,
      3: <Diamond className="h-6 w-6" />,
      4: <Crown className="h-6 w-6" />,
      5: <Flame className="h-6 w-6" />,
      6: <Gem className="h-6 w-6" />
    };
    return icons[level as keyof typeof icons] || icons[1];
  };

  const getCelebrationIcon = () => {
    switch (celebrationType) {
      case 'special': return <Crown className="h-16 w-16 text-yellow-400" />;
      case 'weekly': return <Trophy className="h-16 w-16 text-purple-400" />;
      case 'pack': return <Gift className="h-16 w-16 text-blue-400" />;
      case 'big': return <Diamond className="h-16 w-16 text-emerald-400" />;
      default: return <Star className="h-16 w-16 text-yellow-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      >
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated particles */}
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-40"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i % 6]
              }}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1080,
                scale: 0
              }}
              animate={{
                y: -100,
                x: `+=${Math.random() * 200 - 100}`,
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Floating orbs */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 60 - 30, 0],
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: Math.random() * 6 + 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Rarity Burst Effect */}
        <AnimatePresence>
          {showRarityBurst && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Radial burst */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 2 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div
                  className="w-96 h-96 rounded-full opacity-30"
                  style={{
                    background: `radial-gradient(circle, ${getRarityParticleColor(burstRarity)}40 0%, transparent 70%)`
                  }}
                />
              </motion.div>

              {/* Burst particles */}
              {[...Array(30)].map((_, i) => {
                const angle = (i / 30) * 360;
                const distance = 200 + Math.random() * 100;
                return (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: getRarityParticleColor(burstRarity) }}
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      rotate: angle
                    }}
                    animate={{
                      x: Math.cos((angle * Math.PI) / 180) * distance,
                      y: Math.sin((angle * Math.PI) / 180) * distance,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeOut"
                    }}
                  />
                );
              })}

              {/* Shockwave effect */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div
                  className="w-32 h-32 rounded-full border-4 opacity-60"
                  style={{ borderColor: getRarityParticleColor(burstRarity) }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
          
          {/* Intro Stage */}
          {stage === 'intro' && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-center"
            >
              <motion.div
                className="relative mb-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  perspective: "1000px"
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const centerX = rect.left + rect.width / 2;
                  const centerY = rect.top + rect.height / 2;
                  mouseX.set(e.clientX - centerX);
                  mouseY.set(e.clientY - centerY);
                }}
                onMouseLeave={() => {
                  mouseX.set(0);
                  mouseY.set(0);
                }}
              >
                <motion.div
                  className={`w-64 h-80 bg-gradient-to-br ${getRarityColor(cardPack.rarity, 3)} rounded-2xl ${getRarityGlow(3)} flex items-center justify-center relative overflow-hidden`}
                  style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: "preserve-3d"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* 3D layered background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10" style={{ transform: "translateZ(10px)" }}></div>
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/5 to-transparent" style={{ transform: "translateZ(20px)" }}></div>
                  
                  <div className="text-center z-10" style={{ transform: "translateZ(50px)" }}>
                    <motion.div
                      animate={{
                        rotateY: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Gift className="h-20 w-20 text-white mb-4 mx-auto drop-shadow-2xl" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">{cardPack.name}</h3>
                    <p className="text-white/80 capitalize drop-shadow-md">{cardPack.packType} Pack</p>
                  </div>
                  
                  {/* Enhanced Sparkles with 3D effect */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        transform: `translateZ(${Math.random() * 40 + 10}px)`
                      }}
                      animate={{
                        scale: [0, 1.5, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0],
                        z: [0, 50, 0]
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.15
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-yellow-400 drop-shadow-lg" />
                    </motion.div>
                  ))}

                  {/* Floating gems */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`gem-${i}`}
                      className="absolute"
                      style={{
                        left: `${15 + Math.random() * 70}%`,
                        top: `${15 + Math.random() * 70}%`
                      }}
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: 3 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    >
                      <Diamond className="h-3 w-3 text-blue-300" />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              
              <motion.button
                onClick={startOpening}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xl font-bold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎁 Open Pack
              </motion.button>
            </motion.div>
          )}

          {/* Enhanced Opening Animation */}
          {stage === 'opening' && (
            <motion.div
              className="text-center"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 0.8, 1.5] }}
              transition={{ duration: 2 }}
            >
              <motion.div
                className="w-64 h-80 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-2xl shadow-yellow-500/50 flex items-center justify-center relative overflow-hidden"
                animate={{
                  rotateY: [0, 180, 360, 540],
                  scale: [1, 1.1, 0.9, 1.2, 1.3],
                  boxShadow: [
                    "0 25px 50px -12px rgba(234, 179, 8, 0.25)",
                    "0 25px 50px -12px rgba(234, 179, 8, 0.5)",
                    "0 25px 50px -12px rgba(239, 68, 68, 0.5)",
                    "0 25px 50px -12px rgba(234, 179, 8, 0.25)"
                  ]
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Energy waves */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-4 border-white/30 rounded-2xl"
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.6, 0.3, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}

                <div className="text-center z-10">
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.3, 1]
                    }}
                    transition={{
                      rotate: { duration: 1, repeat: Infinity },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <Sparkles className="h-16 w-16 text-white drop-shadow-2xl" />
                  </motion.div>
                  <motion.p
                    className="text-white text-xl font-bold mt-4 drop-shadow-lg"
                    animate={{
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity
                    }}
                  >
                    Opening...
                  </motion.p>
                </div>

                {/* Swirling particles */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * 360;
                  return (
                    <motion.div
                      key={`swirl-${i}`}
                      className="absolute w-3 h-3 bg-white rounded-full"
                      style={{
                        left: '50%',
                        top: '50%'
                      }}
                      animate={{
                        x: [0, Math.cos((angle * Math.PI) / 180) * 100],
                        y: [0, Math.sin((angle * Math.PI) / 180) * 100],
                        rotate: [0, 360],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {/* Card Revealing */}
          {stage === 'revealing' && (
            <div className="w-full">
              <div className="flex justify-center items-center space-x-4 flex-wrap gap-4">
                {revealedCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ 
                      scale: 0, 
                      rotateY: 180,
                      y: -200 
                    }}
                    animate={{ 
                      scale: 1, 
                      rotateY: 0,
                      y: 0 
                    }}
                    transition={{ 
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="relative"
                  >
                    <div className={`w-48 h-64 bg-gradient-to-br ${getRarityColor(card.rarity, card.rarityLevel)} rounded-xl ${getRarityGlow(card.rarityLevel)} overflow-hidden relative`}>
                      {/* Card Image */}
                      {card.imageUrl ? (
                        <img 
                          src={card.imageUrl} 
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800">
                          <Star className="h-16 w-16 text-white/50" />
                        </div>
                      )}
                      
                      {/* Card Info Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h4 className="text-white font-bold text-lg">{card.name}</h4>
                          <p className="text-white/80 text-sm">{card.series}</p>
                          <p className="text-white/60 text-xs capitalize">{card.rarity}</p>
                        </div>
                      </div>
                      
                      {/* Rarity Border Effect */}
                      {card.rarityLevel >= 4 && (
                        <div className="absolute inset-0 rounded-xl border-2 border-yellow-400 animate-pulse"></div>
                      )}
                      
                      {/* New Card Badge */}
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        NEW!
                      </div>
                    </div>
                    
                    {/* Sparkle Effects */}
                    {card.rarityLevel >= 4 && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`
                            }}
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                              rotate: [0, 360]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          >
                            <Sparkles className="h-3 w-3 text-yellow-400" />
                          </motion.div>
                        ))}
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Continue Button */}
              {currentCardIndex < cards.length && (
                <motion.div
                  className="text-center mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <button
                    onClick={revealNextCard}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    Reveal Next Card ({currentCardIndex + 1}/{cards.length})
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Celebration */}
          {stage === 'celebration' && (
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0] 
                }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                {getCelebrationIcon()}
              </motion.div>
              
              <motion.h2
                className="text-4xl font-bold text-white mt-4 mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: 2 }}
              >
                Congratulations!
              </motion.h2>
              
              <motion.p
                className="text-xl text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                You received {cards.length} new cards!
              </motion.p>
              
              {/* Confetti Effect */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i % 6],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, -200, 200],
                    rotate: [0, 360],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Complete Stage */}
          {stage === 'complete' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Pack Opening Complete!</h3>
              <p className="text-white/80 mb-6">Check your collection to see your new cards.</p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  Continue
                </button>
                
                <button
                  onClick={() => {
                    setStage('intro');
                    setCurrentCardIndex(0);
                    setRevealedCards([]);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Replay</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
