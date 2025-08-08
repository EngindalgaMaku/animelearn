"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Clock,
  Star,
  Diamond,
  CheckCircle,
  X,
  Trophy,
  Zap,
  Brain,
  HelpCircle,
  MessageSquare,
  Flame,
  Shield,
  Target,
  Sparkles,
  Rocket,
  Crown,
  Heart,
  Bolt,
  Snowflake,
  Wind,
  Eye,
  Timer,
  TrendingUp,
  Award,
  BookOpen,
  Lightbulb,
  BarChart,
  User,
  Users,
  Mic,
  Camera,
  Hand,
} from "lucide-react";

import AdaptiveLearningEngine, {
  LearningProfile,
  AdaptiveRecommendation,
  LearningMetrics
} from "./AdaptiveLearningEngine";

import GamificationEngine from "./GamificationEngine";
import InnovativeFeaturesUI from "./InnovativeFeaturesUI";
import PerformanceAnalyticsUI, { AdvancedPerformanceEngine } from "./PerformanceAnalyticsUI";
import SocialCommunityUI from "./SocialCommunityUI";

interface MemoryCard {
  id: string;
  text: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
  isHighlighted: boolean;
  type: 'question' | 'answer';
  cardType?: 'normal' | 'power' | 'bonus' | 'mystery';
  powerType?: 'freeze' | 'peek' | 'multiplier' | 'shield';
  animationClass?: string;
}

interface PowerUp {
  id: string;
  type: 'freeze' | 'peek' | 'multiplier' | 'shield' | 'hint' | 'shuffle';
  name: string;
  description: string;
  icon: React.ReactNode;
  cost: number;
  cooldown: number;
  active: boolean;
  remaining?: number;
}

interface ComboEffect {
  type: 'streak' | 'speed' | 'perfect';
  multiplier: number;
  message: string;
  color: string;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  type: 'star' | 'diamond' | 'fire' | 'ice';
  color: string;
  delay: number;
}

interface MemoryGameProps {
  activityId: string;
  content: {
    pairs: Array<{ id: number; text: string; match: string }>;
    timeLimit?: number;
    shuffleCards?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  };
  diamondReward: number;
  experienceReward: number;
  onComplete: (score: number, timeSpent: number, success: boolean) => void;
  isCompleted?: boolean;
  userId?: string;
  topic?: string;
  showGamification?: boolean;
}

const EnhancedMemoryGame: React.FC<MemoryGameProps> = ({
  activityId,
  content,
  diamondReward,
  experienceReward,
  onComplete,
  isCompleted = false,
  userId = "default_user",
  topic = "memory_game",
  showGamification = true,
}) => {
  // Core game state
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(content.timeLimit || 300);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<MemoryCard | null>(null);
  const [isFirstCompletion, setIsFirstCompletion] = useState(!isCompleted);
  const [isProcessing, setIsProcessing] = useState(false);

  // Enhanced features
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [combo, setCombo] = useState<ComboEffect | null>(null);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [screenShake, setScreenShake] = useState(false);
  const [cardAnimations, setCardAnimations] = useState<{[key: string]: string}>({});
  
  // Refs for audio and effects
  const audioContextRef = useRef<AudioContext | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // AI Learning Engine
  const [learningEngine] = useState(() => new AdaptiveLearningEngine(userId));
  const [adaptiveSettings, setAdaptiveSettings] = useState<any>(null);
  const [learningInsights, setLearningInsights] = useState<string[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<LearningMetrics>({
    accuracyRate: 0,
    averageTimePerCard: 0,
    streakPerformance: 0,
    improvementTrend: 0,
    focusLevel: 1,
    cognitiveLoad: 0,
  });
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState<AdaptiveRecommendation | null>(null);
  const [showLearningPanel, setShowLearningPanel] = useState(false);

  // Gamification Engine
  const [gamificationEngine] = useState(() => showGamification ? new GamificationEngine(userId) : null);
  const [showGamificationPanel, setShowGamificationPanel] = useState(false);
  const [characterLevel, setCharacterLevel] = useState(1);
  const [experienceGained, setExperienceGained] = useState(0);
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);
  const [skillActivated, setSkillActivated] = useState<string[]>([]);

  // Innovative Features
  const [showInnovativeFeatures, setShowInnovativeFeatures] = useState(false);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);
  const [arModeActive, setArModeActive] = useState(false);
  const [gestureControlsEnabled, setGestureControlsEnabled] = useState(false);

  // Performance Analytics
  const [performanceEngine] = useState(() => new AdvancedPerformanceEngine(userId));
  const [showPerformancePanel, setShowPerformancePanel] = useState(false);

  // Social & Community
  const [showSocialPanel, setShowSocialPanel] = useState(false);

  // Initialize power-ups
  useEffect(() => {
    const initialPowerUps: PowerUp[] = [
      {
        id: 'freeze',
        type: 'freeze',
        name: 'Time Freeze',
        description: 'Freeze timer for 10 seconds',
        icon: <Snowflake className="h-4 w-4" />,
        cost: 1,
        cooldown: 30,
        active: false,
      },
      {
        id: 'peek',
        type: 'peek',
        name: 'X-Ray Vision',
        description: 'Reveal all cards for 3 seconds',
        icon: <Eye className="h-4 w-4" />,
        cost: 2,
        cooldown: 45,
        active: false,
      },
      {
        id: 'multiplier',
        type: 'multiplier',
        name: 'Score Boost',
        description: '2x score for next 5 matches',
        icon: <TrendingUp className="h-4 w-4" />,
        cost: 2,
        cooldown: 60,
        active: false,
        remaining: 0,
      },
      {
        id: 'shield',
        type: 'shield',
        name: 'Mistake Shield',
        description: 'Protect from next 3 mistakes',
        icon: <Shield className="h-4 w-4" />,
        cost: 3,
        cooldown: 90,
        active: false,
        remaining: 0,
      },
    ];
    setPowerUps(initialPowerUps);
  }, []);

  // Audio functions
  const playSound = useCallback((type: 'match' | 'flip' | 'error' | 'complete' | 'powerup' | 'combo') => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Sound configurations
    const sounds = {
      match: { freq: 800, duration: 0.3, type: 'sine' as OscillatorType },
      flip: { freq: 400, duration: 0.1, type: 'square' as OscillatorType },
      error: { freq: 200, duration: 0.5, type: 'sawtooth' as OscillatorType },
      complete: { freq: 1000, duration: 1, type: 'sine' as OscillatorType },
      powerup: { freq: 1200, duration: 0.4, type: 'triangle' as OscillatorType },
      combo: { freq: 1500, duration: 0.6, type: 'sine' as OscillatorType },
    };
    
    const sound = sounds[type];
    oscillator.frequency.setValueAtTime(sound.freq, ctx.currentTime);
    oscillator.type = sound.type;
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + sound.duration);
  }, [soundEnabled]);

  // Initialize audio context, AI engine, and gamification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Initialize adaptive settings
    const initialMetrics: LearningMetrics = {
      accuracyRate: 0.7,
      averageTimePerCard: 3000,
      streakPerformance: 0,
      improvementTrend: 0,
      focusLevel: 1,
      cognitiveLoad: 0.5,
    };

    const adaptedSettings = learningEngine.adaptGameParameters(initialMetrics);
    setAdaptiveSettings(adaptedSettings);
    
    // Load learning insights
    const insights = learningEngine.getLearningInsights();
    setLearningInsights(insights);

    // Get recommendations
    const recommendations = learningEngine.recommendNextContent(topic);
    setAdaptiveRecommendations(recommendations);

    // Initialize gamification
    if (gamificationEngine) {
      const character = gamificationEngine.getCharacter();
      setCharacterLevel(character.level);
      
      // Check for active skills
      const activeSkills = character.activeSkills;
      setSkillActivated(activeSkills);

      // Setup gamification event listeners
      gamificationEngine.on('level_up', (data: any) => {
        setCharacterLevel(data.newLevel);
        setLevelUpAnimation(true);
        setTimeout(() => setLevelUpAnimation(false), 3000);
      });

      gamificationEngine.on('experience_gained', (data: any) => {
        setExperienceGained(data.amount);
        setTimeout(() => setExperienceGained(0), 2000);
      });
    }
  }, [learningEngine, topic, gamificationEngine]);

  // Particle system
  const createParticles = useCallback((x: number, y: number, type: 'star' | 'diamond' | 'fire' | 'ice', count: number = 5) => {
    const newParticles: Particle[] = [];
    const colors = {
      star: ['#FFD700', '#FFA500', '#FF6347'],
      diamond: ['#00FFFF', '#0080FF', '#4169E1'],
      fire: ['#FF4500', '#FF6347', '#FFD700'],
      ice: ['#87CEEB', '#00BFFF', '#1E90FF'],
    };
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `${Date.now()}-${i}`,
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        type,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        delay: i * 0.1,
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Clean up particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 2000);
  }, []);

  // Screen shake effect
  const triggerScreenShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  }, []);

  // Enhanced card animations
  const animateCard = useCallback((cardId: string, animation: string) => {
    setCardAnimations(prev => ({ ...prev, [cardId]: animation }));
    setTimeout(() => {
      setCardAnimations(prev => {
        const newAnimations = { ...prev };
        delete newAnimations[cardId];
        return newAnimations;
      });
    }, 1000);
  }, []);

  // Power-up functions
  const activatePowerUp = useCallback((powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp || powerUp.active || score < powerUp.cost) return;

    setScore(prev => prev - powerUp.cost);
    playSound('powerup');

    switch (powerUp.type) {
      case 'freeze':
        setPowerUps(prev => prev.map(p => 
          p.id === powerUpId ? { ...p, active: true } : p
        ));
        setTimeout(() => {
          setPowerUps(prev => prev.map(p => 
            p.id === powerUpId ? { ...p, active: false } : p
          ));
        }, 10000);
        break;

      case 'peek':
        setCards(prev => prev.map(card => ({ ...card, isHighlighted: true })));
        setTimeout(() => {
          setCards(prev => prev.map(card => ({ ...card, isHighlighted: false })));
        }, 3000);
        break;

      case 'multiplier':
        setPowerUps(prev => prev.map(p => 
          p.id === powerUpId ? { ...p, active: true, remaining: 5 } : p
        ));
        setMultiplier(2);
        break;

      case 'shield':
        setPowerUps(prev => prev.map(p => 
          p.id === powerUpId ? { ...p, active: true, remaining: 3 } : p
        ));
        break;
    }

    // Start cooldown
    setTimeout(() => {
      setPowerUps(prev => prev.map(p => 
        p.id === powerUpId ? { ...p, active: false } : p
      ));
    }, powerUp.cooldown * 1000);
  }, [powerUps, score, playSound]);

  // Combo system
  const checkCombo = useCallback(() => {
    if (streak >= 5) {
      const comboEffect: ComboEffect = {
        type: 'streak',
        multiplier: 2,
        message: `${streak} STREAK! 2x Score!`,
        color: 'text-orange-500'
      };
      setCombo(comboEffect);
      setMultiplier(prev => prev * 2);
      playSound('combo');
      
      setTimeout(() => setCombo(null), 3000);
    }
  }, [streak, playSound]);

  // Initialize cards with enhanced features and AI adaptation
  useEffect(() => {
    const gameCards: MemoryCard[] = [];
    
    // AI-determined special card probability based on user skill
    const userProfile = learningEngine.getProfile();
    const specialCardProbability = userProfile.currentLevel > 3 ? 0.15 : 0.05;
    
    content.pairs.forEach((pair, index) => {
      // AI-determined card types
      const isSpecial = Math.random() < specialCardProbability;
      const cardType = isSpecial ?
        (['power', 'bonus', 'mystery'][Math.floor(Math.random() * 3)] as any) :
        'normal';
      
      // Question card
      gameCards.push({
        id: `${pair.id}-1`,
        text: pair.text,
        pairId: pair.id.toString(),
        isFlipped: false,
        isMatched: false,
        isHighlighted: false,
        type: 'question',
        cardType,
      });
      
      // Answer card
      gameCards.push({
        id: `${pair.id}-2`,
        text: pair.match,
        pairId: pair.id.toString(),
        isFlipped: false,
        isMatched: false,
        isHighlighted: false,
        type: 'answer',
        cardType,
      });
    });

    // Shuffle cards
    if (content.shuffleCards !== false) {
      for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
      }
    }

    setCards(gameCards);
  }, [content, learningEngine]);

  // Enhanced timer with power-up effects and AI adaptation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Check if freeze power-up is active
    const freezeActive = powerUps.find(p => p.type === 'freeze')?.active;
    
    // AI-adaptive time limit
    const adaptedTimeLimit = adaptiveSettings?.timeLimit || (content.timeLimit || 300);
    
    if (gameStarted && !gameCompleted && timeLeft > 0 && !freezeActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        
        // Update focus level based on time pressure
        const timeRatio = timeLeft / adaptedTimeLimit;
        setCurrentMetrics(prev => ({
          ...prev,
          focusLevel: timeRatio > 0.5 ? 1 : timeRatio * 2
        }));
      }, 1000);
    } else if (timeLeft === 0 && !gameCompleted) {
      endGame(false);
    }

    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, timeLeft, powerUps, adaptiveSettings, content.timeLimit]);

  // Enhanced match checking with effects and AI tracking
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      const [card1Id, card2Id] = flippedCards;
      const card1 = cards.find(c => c.id === card1Id);
      const card2 = cards.find(c => c.id === card2Id);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        // Match found!
        playSound('match');
        setStreak(prev => prev + 1);
        setMaxStreak(prev => Math.max(prev, streak + 1));
        
        // AI Performance Tracking
        const matchTime = Date.now() - (startTime || Date.now());
        const updatedMetrics: LearningMetrics = {
          accuracyRate: (matchedPairs.size + 1) / (matchedPairs.size + 1 + mistakes),
          averageTimePerCard: matchTime / (matchedPairs.size + 1),
          streakPerformance: streak + 1,
          improvementTrend: ((streak + 1) - maxStreak) / Math.max(maxStreak, 1),
          focusLevel: currentMetrics.focusLevel,
          cognitiveLoad: mistakes / Math.max(matchedPairs.size + 1, 1),
        };
        
        setCurrentMetrics(updatedMetrics);
        
        // AI Learning Engine updates
        learningEngine.saveSession({
          topic,
          duration: matchTime,
          performance: {
            accuracy: updatedMetrics.accuracyRate,
            errorRate: mistakes / Math.max(matchedPairs.size + 1, 1),
            averageTime: matchTime / (matchedPairs.size + 1),
          },
          difficulty: content.difficulty || 'medium',
          completionRate: (matchedPairs.size + 1) / content.pairs.length,
          mistakes: mistakes,
          hints: hintsUsed,
        });
        
        // Calculate score with multiplier
        const baseScore = 100;
        const timeBonus = Math.max(0, timeLeft / (adaptiveSettings?.timeLimit || content.timeLimit || 300)) * 50;
        const streakBonus = streak * 10;
        const totalScore = Math.round((baseScore + timeBonus + streakBonus) * multiplier);
        setScore(prev => prev + totalScore);

        // Update multiplier power-up
        const multiplierPowerUp = powerUps.find(p => p.type === 'multiplier');
        if (multiplierPowerUp?.active && multiplierPowerUp.remaining) {
          setPowerUps(prev => prev.map(p => 
            p.type === 'multiplier' && p.remaining ? 
              { ...p, remaining: p.remaining - 1 } : p
          ));
          
          if (multiplierPowerUp.remaining <= 1) {
            setMultiplier(1);
            setPowerUps(prev => prev.map(p => 
              p.type === 'multiplier' ? { ...p, active: false, remaining: 0 } : p
            ));
          }
        }

        // Create particle effects
        if (gameContainerRef.current) {
          const rect = gameContainerRef.current.getBoundingClientRect();
          createParticles(rect.width / 2, rect.height / 2, 'star', 8);
        }

        // Animate matched cards
        animateCard(card1Id, 'match-success');
        animateCard(card2Id, 'match-success');

        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.pairId === card1.pairId
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          ));
          setMatchedPairs(prev => new Set([...prev, card1.pairId]));
          setFlippedCards([]);
          
          setTimeout(() => {
            setCards(prev => prev.filter(card => card.pairId !== card1.pairId));
            setIsProcessing(false);
          }, 800);
        }, 300);

        // Check for combos
        checkCombo();
      } else {
        // No match
        playSound('error');
        
        // Check shield power-up
        const shieldPowerUp = powerUps.find(p => p.type === 'shield');
        if (shieldPowerUp?.active && shieldPowerUp.remaining) {
          setPowerUps(prev => prev.map(p => 
            p.type === 'shield' && p.remaining ? 
              { ...p, remaining: p.remaining - 1 } : p
          ));
          
          if (shieldPowerUp.remaining <= 1) {
            setPowerUps(prev => prev.map(p => 
              p.type === 'shield' ? { ...p, active: false, remaining: 0 } : p
            ));
          }
        } else {
          setMistakes(prev => prev + 1);
          setStreak(0);
          triggerScreenShake();
          
          // AI tracking for mistakes
          const updatedMetrics: LearningMetrics = {
            ...currentMetrics,
            accuracyRate: matchedPairs.size / (matchedPairs.size + mistakes + 1),
            cognitiveLoad: (mistakes + 1) / Math.max(matchedPairs.size + mistakes + 1, 1),
          };
          setCurrentMetrics(updatedMetrics);
        }

        // Animate failed cards
        animateCard(card1Id, 'match-fail');
        animateCard(card2Id, 'match-fail');

        setTimeout(() => {
          setCards(prev => prev.map(card =>
            flippedCards.includes(card.id)
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setIsProcessing(false);
        }, 800);
      }
    }
  }, [flippedCards, cards, streak, multiplier, powerUps, timeLeft, content.timeLimit, playSound, createParticles, animateCard, triggerScreenShake, checkCombo]);

  // Game completion check
  useEffect(() => {
    if (matchedPairs.size === content.pairs.length && gameStarted) {
      endGame(true);
    }
  }, [matchedPairs, content.pairs.length, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    playSound('flip');
    
    // Auto-scroll to game area when game starts
    setTimeout(() => {
      if (gameContainerRef.current) {
        gameContainerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 500);
  };

  const resetGame = () => {
    // Reset all state
    setFlippedCards([]);
    setMatchedPairs(new Set());
    setTimeLeft(content.timeLimit || 300);
    setGameStarted(false);
    setGameCompleted(false);
    setMistakes(0);
    setHintsUsed(0);
    setShowHint(false);
    setStartTime(null);
    setIsProcessing(false);
    setSelectedCard(null);
    setStreak(0);
    setMaxStreak(0);
    setCombo(null);
    setScore(0);
    setMultiplier(1);
    setParticles([]);
    setCardAnimations({});
    
    // Reset power-ups
    setPowerUps(prev => prev.map(p => ({ 
      ...p, 
      active: false, 
      remaining: 0 
    })));
    
    // Recreate cards
    const gameCards: MemoryCard[] = [];
    content.pairs.forEach((pair) => {
      const isSpecial = Math.random() < 0.1;
      const cardType = isSpecial ? 
        (['power', 'bonus', 'mystery'][Math.floor(Math.random() * 3)] as any) : 
        'normal';
      
      gameCards.push({
        id: `${pair.id}-1`,
        text: pair.text,
        pairId: pair.id.toString(),
        isFlipped: false,
        isMatched: false,
        isHighlighted: false,
        type: 'question',
        cardType,
      });
      
      gameCards.push({
        id: `${pair.id}-2`,
        text: pair.match,
        pairId: pair.id.toString(),
        isFlipped: false,
        isMatched: false,
        isHighlighted: false,
        type: 'answer',
        cardType,
      });
    });

    if (content.shuffleCards !== false) {
      for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
      }
    }

    setCards(gameCards);
  };

  const endGame = (success: boolean) => {
    setGameCompleted(true);
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    
    // Final AI analytics
    const finalMetrics: LearningMetrics = {
      accuracyRate: matchedPairs.size / content.pairs.length,
      averageTimePerCard: timeSpent / content.pairs.length,
      streakPerformance: maxStreak,
      improvementTrend: (maxStreak - 1) / Math.max(content.pairs.length, 1),
      focusLevel: timeLeft / (adaptiveSettings?.timeLimit || content.timeLimit || 300),
      cognitiveLoad: mistakes / content.pairs.length,
    };
    
    // Record final session data
    learningEngine.saveSession({
      topic,
      duration: timeSpent,
      performance: {
        accuracy: finalMetrics.accuracyRate,
        errorRate: mistakes / content.pairs.length,
        averageTime: timeSpent / content.pairs.length,
      },
      difficulty: content.difficulty || 'medium',
      completionRate: success ? 1 : matchedPairs.size / content.pairs.length,
      mistakes: mistakes,
      hints: hintsUsed,
    });
    
    // Update learning insights
    const newInsights = learningEngine.getLearningInsights();
    setLearningInsights(newInsights);
    
    // Get new recommendations
    const newRecommendations = learningEngine.recommendNextContent(topic);
    setAdaptiveRecommendations(newRecommendations);

    // Update gamification progress
    if (gamificationEngine) {
      gamificationEngine.onGameComplete(
        score,
        timeSpent,
        finalMetrics.accuracyRate,
        topic.includes('multiplayer')
      );
    }

    // Record session in performance analytics
    performanceEngine.recordSession({
      topic,
      difficulty: content.difficulty || 'medium',
      duration: timeSpent,
      score,
      accuracy: finalMetrics.accuracyRate,
      mistakes,
      hintsUsed,
      powerUpsUsed: powerUps.filter(p => p.active).length,
      maxStreak,
      averageResponseTime: timeSpent / content.pairs.length * 1000,
      cognitiveLoad: finalMetrics.cognitiveLoad,
      focusLevel: finalMetrics.focusLevel,
      completionRate: success ? 1 : matchedPairs.size / content.pairs.length,
      learningGains: Math.min(1, finalMetrics.accuracyRate + (finalMetrics.improvementTrend * 0.1)),
      retentionScore: Math.min(1, finalMetrics.accuracyRate * (1 - finalMetrics.cognitiveLoad)),
      adaptabilityIndex: Math.min(1, finalMetrics.improvementTrend + 0.5),
      flowStateTime: finalMetrics.focusLevel,
      peakPerformanceTime: finalMetrics.focusLevel * timeSpent,
    });
    
    if (success) {
      playSound('complete');
      if (gameContainerRef.current) {
        const rect = gameContainerRef.current.getBoundingClientRect();
        createParticles(rect.width / 2, rect.height / 2, 'diamond', 15);
      }
    }
    
    if (success && isFirstCompletion) {
      setIsFirstCompletion(false);
      onComplete(score, timeSpent, success);
    } else if (!success) {
      onComplete(score, timeSpent, success);
    }
  };

  // Innovative Features Handlers
  const handleFeatureCommand = useCallback((action: string, params?: any) => {
    if (!gameStarted || gameCompleted) return;

    switch (action) {
      case 'select_card':
        // Voice/gesture card selection
        if (params?.cardId) {
          handleCardClick(params.cardId);
        }
        break;
        
      case 'flip_card':
        // Gesture-based card flip
        if (flippedCards.length < 2 && !isProcessing) {
          const availableCards = cards.filter(c => !c.isFlipped && !c.isMatched);
          if (availableCards.length > 0) {
            const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
            handleCardClick(randomCard.id);
          }
        }
        break;
        
      case 'use_powerup':
        // Voice/gesture power-up activation
        const availablePowerUps = powerUps.filter(p => !p.active && score >= p.cost);
        if (availablePowerUps.length > 0) {
          activatePowerUp(availablePowerUps[0].id);
        }
        break;
        
      case 'show_hint':
        // Voice/gesture hint request
        if (!showHint && gameStarted) {
          setShowHint(true);
          setHintsUsed(prev => prev + 1);
          setTimeout(() => setShowHint(false), 3000);
        }
        break;
        
      case 'reset_game':
        resetGame();
        break;
        
      case 'start_game':
        if (!gameStarted && !gameCompleted) {
          startGame();
        }
        break;
        
      case 'pause_game':
        // Implement pause functionality if needed
        break;
        
      default:
        console.log(`Unknown feature command: ${action}`);
    }
  }, [gameStarted, gameCompleted, flippedCards, isProcessing, cards, powerUps, score, showHint, hintsUsed, activatePowerUp]);

  const handleARCardPlaced = useCallback((cardId: string, position: any) => {
    // Handle AR card placement
    console.log(`AR card ${cardId} placed at position:`, position);
    // Could trigger special effects or scoring bonuses for AR mode
    if (arModeActive) {
      setScore(prev => prev + 10); // AR bonus points
      createParticles(position.x || 0, position.y || 0, 'star', 3);
    }
  }, [arModeActive, createParticles]);

  const handleCardClick = (cardId: string) => {
    if (!gameStarted || gameCompleted || isProcessing || flippedCards.length >= 2 || selectedCard) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    playSound('flip');
    setSelectedCard(card);
    
    setTimeout(() => {
      setCards(prev => prev.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      ));
      setFlippedCards(prev => [...prev, cardId]);
      setSelectedCard(null);
    }, 5000); // Increased to 5000ms (5 seconds) for comfortable reading
  };

  const handleModalClose = () => {
    setSelectedCard(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCardStyle = (card: MemoryCard) => {
    const animation = cardAnimations[card.id];
    let className = '';
    
    if (animation === 'match-success') {
      className += ' animate-bounce bg-green-200 border-green-400';
    } else if (animation === 'match-fail') {
      className += ' animate-pulse bg-red-200 border-red-400';
    }
    
    if (card.cardType === 'power') {
      className += ' bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400';
    } else if (card.cardType === 'bonus') {
      className += ' bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400';
    } else if (card.cardType === 'mystery') {
      className += ' bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-400';
    }
    
    return className;
  };

  return (
    <div 
      ref={gameContainerRef}
      className={`w-full max-w-6xl mx-auto p-6 ${screenShake ? 'animate-pulse' : ''}`}
    >
      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0, x: particle.x, y: particle.y }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1.5, 0], 
              y: particle.y - 100,
              rotate: 360 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2, 
              delay: particle.delay,
              ease: "easeOut" 
            }}
            className="absolute pointer-events-none z-50"
            style={{ color: particle.color }}
          >
            {particle.type === 'star' && <Star className="h-6 w-6" />}
            {particle.type === 'diamond' && <Diamond className="h-6 w-6" />}
            {particle.type === 'fire' && <Flame className="h-6 w-6" />}
            {particle.type === 'ice' && <Snowflake className="h-6 w-6" />}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Enhanced Header with Gamification */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Level Up Animation */}
        <AnimatePresence>
          {levelUpAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center z-10"
            >
              <div className="text-center">
                <Crown className="h-16 w-16 mx-auto mb-2 animate-bounce" />
                <div className="text-3xl font-bold">LEVEL UP!</div>
                <div className="text-xl">Level {characterLevel}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experience Gain Animation */}
        <AnimatePresence>
          {experienceGained > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold z-10"
            >
              +{experienceGained} XP
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between relative z-0">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Enhanced Memory Arena</h2>
              <p className="text-purple-100">Match pairs • Earn combos • Use power-ups!</p>
              {gamificationEngine && (
                <div className="flex items-center space-x-3 mt-1">
                  <div className="text-sm">
                    Level {characterLevel}
                  </div>
                  {skillActivated.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs">{skillActivated.length} skills active</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-xl font-bold">{formatTime(timeLeft)}</div>
              <div className="text-sm text-purple-200">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{matchedPairs.size}/{content.pairs.length}</div>
              <div className="text-sm text-purple-200">Pairs</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-300">{score}</div>
              <div className="text-sm text-purple-200">Score</div>
            </div>
            {gamificationEngine && (
              <button
                onClick={() => setShowGamificationPanel(!showGamificationPanel)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Character Progress"
              >
                <User className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="text-center rounded-lg bg-white/20 p-2">
            <div className="text-lg font-bold">{streak}</div>
            <div className="text-xs">Current Streak</div>
          </div>
          <div className="text-center rounded-lg bg-white/20 p-2">
            <div className="text-lg font-bold">{maxStreak}</div>
            <div className="text-xs">Best Streak</div>
          </div>
          <div className="text-center rounded-lg bg-white/20 p-2">
            <div className="text-lg font-bold">{multiplier}x</div>
            <div className="text-xs">Multiplier</div>
          </div>
          <div className="text-center rounded-lg bg-white/20 p-2">
            <div className="text-lg font-bold">{mistakes}</div>
            <div className="text-xs">Mistakes</div>
          </div>
        </div>

        {/* Combo Display */}
        <AnimatePresence>
          {combo && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="mt-4 text-center"
            >
              <div className={`text-2xl font-bold ${combo.color} animate-pulse`}>
                {combo.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Power-ups Panel */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 p-4">
        <h3 className="mb-3 text-lg font-bold text-indigo-900">⚡ Power-ups</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {powerUps.map((powerUp) => (
            <motion.button
              key={powerUp.id}
              onClick={() => activatePowerUp(powerUp.id)}
              disabled={powerUp.active || score < powerUp.cost || !gameStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-lg border-2 transition-all ${
                powerUp.active 
                  ? 'bg-green-200 border-green-400 text-green-800'
                  : score >= powerUp.cost && gameStarted
                    ? 'bg-white border-indigo-300 hover:border-indigo-500 hover:shadow-md'
                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {powerUp.icon}
                <span className="font-medium text-sm">{powerUp.name}</span>
              </div>
              <div className="text-xs text-gray-600">
                Cost: {powerUp.cost} • {powerUp.description}
                {powerUp.active && powerUp.remaining && (
                  <div className="text-green-600 font-bold">
                    {powerUp.remaining} uses left
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Gamification Quick Panel */}
      {gamificationEngine && showGamificationPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border border-indigo-200"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
              <User className="h-5 w-5" />
              Character Progress
            </h3>
            <button
              onClick={() => setShowGamificationPanel(false)}
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(() => {
              const character = gamificationEngine.getCharacter();
              return (
                <>
                  <div className="bg-white rounded-lg p-3 text-center border border-indigo-100">
                    <Crown className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-indigo-600">
                      {character.level}
                    </div>
                    <div className="text-xs text-gray-600">Level</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-indigo-100">
                    <Star className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-600">
                      {character.skillPoints}
                    </div>
                    <div className="text-xs text-gray-600">Skill Points</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-indigo-100">
                    <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-yellow-600">
                      {character.achievements.length}
                    </div>
                    <div className="text-xs text-gray-600">Achievements</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-indigo-100">
                    <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">
                      {character.completedChallenges}
                    </div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Active Skills */}
          {skillActivated.length > 0 && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100">
              <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Active Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillActivated.map((skillId, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                    {skillId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* AI Learning Insights Panel */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border border-emerald-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Learning Assistant
          </h3>
          <button
            onClick={() => setShowLearningPanel(!showLearningPanel)}
            className="text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            {showLearningPanel ? 'Hide' : 'Show'} Insights
          </button>
        </div>
        
        <AnimatePresence>
          {showLearningPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center border border-emerald-100">
                  <div className="text-lg font-bold text-emerald-600">
                    {Math.round(currentMetrics.accuracyRate * 100)}%
                  </div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-emerald-100">
                  <div className="text-lg font-bold text-emerald-600">
                    {Math.round(currentMetrics.focusLevel * 100)}%
                  </div>
                  <div className="text-xs text-gray-600">Focus Level</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-emerald-100">
                  <div className="text-lg font-bold text-emerald-600">
                    {Math.round((1 - currentMetrics.cognitiveLoad) * 100)}%
                  </div>
                  <div className="text-xs text-gray-600">Efficiency</div>
                </div>
              </div>

              {/* Learning Insights */}
              {learningInsights.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-emerald-100">
                  <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Learning Insights
                  </h4>
                  <ul className="space-y-1">
                    {learningInsights.slice(0, 3).map((insight, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-emerald-500 text-xs mt-1">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Recommendations */}
              {adaptiveRecommendations && (
                <div className="bg-white rounded-lg p-4 border border-emerald-100">
                  <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    AI Recommendations
                  </h4>
                  <div className="text-sm text-gray-700">
                    <p className="mb-2">
                      <strong>Recommended Difficulty:</strong> {adaptiveRecommendations.recommendedDifficulty}/5
                    </p>
                    <p className="mb-2">
                      <strong>Next Topics:</strong> {adaptiveRecommendations.nextTopics.slice(0, 2).join(', ')}
                    </p>
                    <p className="mb-2">
                      <strong>Study Tips:</strong> {adaptiveRecommendations.studyTips.slice(0, 1).join('')}
                    </p>
                    <p className="text-emerald-600 font-medium">
                      <strong>Estimated Time:</strong> {adaptiveRecommendations.estimatedCompletionTime} min
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Innovative Features Panel */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border border-cyan-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-cyan-800 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Next-Gen Interactions
          </h3>
          <button
            onClick={() => setShowInnovativeFeatures(!showInnovativeFeatures)}
            className="text-cyan-600 hover:text-cyan-800 transition-colors"
          >
            {showInnovativeFeatures ? 'Hide' : 'Show'} Features
          </button>
        </div>
        
        <AnimatePresence>
          {showInnovativeFeatures && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <InnovativeFeaturesUI
                onFeatureCommand={handleFeatureCommand}
                onARCardPlaced={handleARCardPlaced}
                gameActive={gameStarted && !gameCompleted}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Quick Status */}
        {!showInnovativeFeatures && (
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center gap-1 ${voiceCommandsEnabled ? 'text-green-600' : 'text-gray-400'}`}>
              <Mic className="h-4 w-4" />
              <span>Voice {voiceCommandsEnabled ? 'ON' : 'OFF'}</span>
            </div>
            <div className={`flex items-center gap-1 ${arModeActive ? 'text-blue-600' : 'text-gray-400'}`}>
              <Camera className="h-4 w-4" />
              <span>AR {arModeActive ? 'ON' : 'OFF'}</span>
            </div>
            <div className={`flex items-center gap-1 ${gestureControlsEnabled ? 'text-purple-600' : 'text-gray-400'}`}>
              <Hand className="h-4 w-4" />
              <span>Gesture {gestureControlsEnabled ? 'ON' : 'OFF'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-all ${
              soundEnabled 
                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          {!gameStarted && !gameCompleted && (
            <motion.button
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-white shadow-lg hover:shadow-xl"
            >
              <Rocket className="h-5 w-5" />
              <span>Launch Game</span>
            </motion.button>
          )}
          
          <motion.button
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-gray-500 to-slate-500 px-4 py-2 text-white shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </motion.button>
        </div>
      </div>

      {/* Enhanced Game Board */}
      <div className={`relative grid gap-4 ${
        cards.length <= 6 ? 'grid-cols-2 sm:grid-cols-3' :
        cards.length <= 12 ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-4' :
        'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
      }`}>
        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 180 }}
              whileHover={{ 
                scale: gameStarted && !card.isMatched && !isProcessing ? 1.05 : 1,
                rotateY: gameStarted && !card.isMatched && !isProcessing ? 5 : 0
              }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className={`relative aspect-square min-h-[80px] ${
                !gameStarted || card.isMatched || isProcessing || flippedCards.length >= 2 || selectedCard
                  ? 'cursor-default'
                  : 'cursor-pointer'
              } transition-all duration-300`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className={`
                absolute inset-0 rounded-xl border-2 transition-all duration-300 transform-gpu
                ${getCardStyle(card)}
                ${card.isMatched
                  ? 'border-green-400 bg-green-50 shadow-lg scale-105'
                  : card.isHighlighted
                    ? 'border-yellow-400 bg-yellow-50 shadow-2xl scale-110 animate-pulse'
                    : card.isFlipped
                      ? card.type === 'question'
                        ? 'border-blue-400 bg-blue-50 shadow-lg'
                        : 'border-green-400 bg-green-50 shadow-lg'
                      : card.type === 'question'
                        ? 'border-blue-200 bg-white hover:border-blue-400 hover:shadow-lg'
                        : 'border-green-200 bg-white hover:border-green-400 hover:shadow-lg'
                }
              `}>
                <div className="flex h-full items-center justify-center p-3">
                  {card.isFlipped || card.isMatched || card.isHighlighted ? (
                    <div className={`text-center ${
                      card.isMatched ? 'text-green-700' :
                      card.isHighlighted ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>
                      <div className="font-medium leading-snug text-center break-words text-xs overflow-hidden">
                        <div className="line-clamp-3">
                          {card.text.length > 30 ? `${card.text.substring(0, 30)}...` : card.text}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center rounded-lg relative overflow-hidden ${
                      card.cardType === 'power'
                        ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                        : card.cardType === 'bonus'
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                          : card.cardType === 'mystery'
                            ? 'bg-gradient-to-br from-indigo-400 to-indigo-600'
                            : card.type === 'question'
                              ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
                              : 'bg-gradient-to-br from-green-400 to-emerald-500'
                    }`}>
                      {/* Animated background for special cards */}
                      {card.cardType !== 'normal' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      )}
                      
                      <div className="flex flex-col items-center justify-center text-white relative z-10">
                        {card.cardType === 'power' ? (
                          <Bolt className="h-6 w-6 mb-1 animate-bounce" />
                        ) : card.cardType === 'bonus' ? (
                          <Crown className="h-6 w-6 mb-1 animate-spin" />
                        ) : card.cardType === 'mystery' ? (
                          <Sparkles className="h-6 w-6 mb-1 animate-pulse" />
                        ) : card.type === 'question' ? (
                          <HelpCircle className="h-6 w-6 mb-1" />
                        ) : (
                          <MessageSquare className="h-6 w-6 mb-1" />
                        )}
                        <span className="font-medium text-xs">
                          {card.cardType === 'power' ? 'POWER' :
                           card.cardType === 'bonus' ? 'BONUS' :
                           card.cardType === 'mystery' ? '???' :
                           card.type === 'question' ? 'Q' : 'A'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {card.isMatched && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500 animate-bounce" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Enhanced Card Content Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 50, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50, rotateX: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-gray-100 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
              
              <div className="text-center relative z-10">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    selectedCard.type === 'question'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {selectedCard.type === 'question' ? (
                    <HelpCircle className="h-8 w-8" />
                  ) : (
                    <MessageSquare className="h-8 w-8" />
                  )}
                </motion.div>
                
                <h3 className={`text-lg font-bold mb-4 ${
                  selectedCard.type === 'question' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {selectedCard.type === 'question' ? '🤔 Question' : '💡 Answer'}
                </h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed px-2"
                >
                  {selectedCard.text}
                </motion.p>
                
                <motion.button
                  onClick={handleModalClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
                >
                  Got it! ✨
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Completion Modal */}
      <AnimatePresence>
        {gameCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: -180 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 opacity-70"></div>
              
              <div className="text-center relative z-10">
                {matchedPairs.size === content.pairs.length ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Trophy className="mx-auto mb-4 h-20 w-20 text-yellow-500" />
                    </motion.div>
                    <h3 className="mb-3 text-3xl font-bold text-gray-900">
                      🎉 VICTORY! 🎉
                    </h3>
                    <p className="mb-6 text-lg text-gray-600">
                      Incredible performance in the Memory Arena!
                    </p>
                    
                    {/* Enhanced Score Display */}
                    <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{score}</div>
                          <div className="text-sm text-gray-600">Final Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">{maxStreak}</div>
                          <div className="text-sm text-gray-600">Best Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatTime((content.timeLimit || 300) - timeLeft)}
                          </div>
                          <div className="text-sm text-gray-600">Time Used</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {Math.round((matchedPairs.size / content.pairs.length) * 100)}%
                          </div>
                          <div className="text-sm text-gray-600">Accuracy</div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Badges */}
                    <div className="mb-6 flex flex-wrap justify-center gap-2">
                      {maxStreak >= 5 && (
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                          🔥 Streak Master
                        </span>
                      )}
                      {mistakes === 0 && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ✨ Flawless
                        </span>
                      )}
                      {timeLeft > (content.timeLimit || 300) * 0.5 && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          ⚡ Speed Demon
                        </span>
                      )}
                      {score > 1000 && (
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          👑 High Scorer
                        </span>
                      )}
                    </div>

                    {/* Rewards */}
                    {isFirstCompletion && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mb-6 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 p-4"
                      >
                        <h4 className="text-lg font-bold text-orange-800 mb-3">🎁 Rewards Earned!</h4>
                        <div className="flex items-center justify-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Diamond className="h-6 w-6 text-yellow-500" />
                            <span className="text-xl font-bold text-yellow-600">+{diamondReward}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-6 w-6 text-purple-500" />
                            <span className="text-xl font-bold text-purple-600">+{experienceReward} XP</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <>
                    <Clock className="mx-auto mb-4 h-16 w-16 text-red-500" />
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      ⏰ Time's Up!
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Challenge yourself again to beat your score!
                    </p>
                  </>
                )}
                
                <motion.button
                  onClick={resetGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 text-white hover:from-purple-700 hover:to-pink-700 font-bold text-lg shadow-lg"
                >
                  🚀 Play Again
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedMemoryGame;