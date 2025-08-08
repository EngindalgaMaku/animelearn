"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Eye, 
  Hand, 
  Target,
  Zap,
  Heart,
  Shield,
  Crown,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  targetSelector?: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
  action?: string;
  highlight?: boolean;
}

interface TutorialOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Elements of Legends\'e Hoş Geldiniz!',
    description: 'Bu etkileşimli rehber size oyunun temellerini öğretecek. Dünya çapında rekabet edebilecek bir strateji ustası olmaya hazır mısınız?',
    icon: Crown,
    position: 'center'
  },
  {
    id: 'objective',
    title: 'Oyunun Amacı',
    description: 'Rakibinizin canını 100\'den 0\'a düşürerek zaferi kazanın! Stratejik kart kombinasyonları kullanarak güçlü saldırılar yapın.',
    icon: Target,
    position: 'center'
  },
  {
    id: 'health',
    title: 'Can Sistemi',
    description: 'Sağ üstte kendi canınızı, sol üstte rakibinizin canını görebilirsiniz. Can 0\'a düştüğünde oyun biter!',
    icon: Heart,
    position: 'top',
    targetSelector: '.health-display'
  },
  {
    id: 'mana',
    title: 'Mana Sistemi',
    description: 'Kartları oynamak için mana gerekir. Her tur başında mana yenilenir. Kartın sağ üst köşesindeki sayı mana maliyetini gösterir.',
    icon: Zap,
    position: 'top',
    targetSelector: '.mana-display'
  },
  {
    id: 'hand',
    title: 'Elinizdeki Kartlar',
    description: 'Alt tarafta elinizdeki kartları görebilirsiniz. Yeşil nokta olan kartlar oynanabilir, kırmızı nokta olanlar çok pahalı.',
    icon: Hand,
    position: 'bottom',
    targetSelector: '.player-hand'
  },
  {
    id: 'battlefield',
    title: 'Savaş Alanı',
    description: 'Kartları ortadaki savaş alanına oynayın. Üst kısım rakibin alanı, alt kısım sizin alanınız.',
    icon: Shield,
    position: 'center',
    targetSelector: '.battle-field'
  },
  {
    id: 'card-stats',
    title: 'Kart İstatistikleri',
    description: 'Her kartın saldırı gücü (⚔), canı (❤) ve savunması (🛡) vardır. Rakip kartlara saldırarak onları yok edin!',
    icon: Eye,
    position: 'center'
  },
  {
    id: 'turn-timer',
    title: 'Tur Zamanlayıcısı',
    description: 'Her tur için 30 saniyeniz var. Süre dolmadan hamleni yap! Sağ üstteki zamanlayıcıyı takip et.',
    icon: Zap,
    position: 'top',
    targetSelector: '.turn-timer'
  },
  {
    id: 'first-move',
    title: 'İlk Hamlenizi Yapın!',
    description: 'Şimdi elinizden bir kart seçin ve savaş alanına oynayın. Yeşil noktalı kartları seçebilirsiniz.',
    icon: PlayCircle,
    position: 'bottom',
    targetSelector: '.player-hand',
    action: 'play-card',
    highlight: true
  }
];

export default function TutorialOverlay({ isVisible, onComplete, onSkip }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const currentTutorialStep = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const nextStep = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTutorial = () => {
    onSkip();
  };

  if (!isVisible) return null;

  if (showWelcome) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 text-center max-w-lg mx-4 border border-purple-500/50 shadow-2xl"
        >
          <div className="mb-6">
            <Crown className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Elements of Legends</h2>
            <p className="text-purple-200 text-lg leading-relaxed">
              Bu oyundan hiçbir şey anlamadığınızı fark ettik! 😊
              <br />
              <br />
              Endişelenmeyin - bu etkileşimli rehber size her şeyi adım adım öğretecek.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <Lightbulb className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-white font-medium">Kolay Öğrenme</p>
              <p className="text-purple-200">Adım adım rehber</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <Target className="h-6 w-6 text-red-400 mx-auto mb-2" />
              <p className="text-white font-medium">Net Hedefler</p>
              <p className="text-purple-200">Anlaşılır amaçlar</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium">Hızla Öğren</p>
              <p className="text-purple-200">5 dakikada usta ol</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowWelcome(false)}
              className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105"
            >
              🎮 Rehberi Başlat - Oyunu Öğren!
            </button>
            <button
              onClick={skipTutorial}
              className="w-full px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
            >
              Atla (Önerilmez)
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      >
        {/* Highlight Effect */}
        {currentTutorialStep.highlight && currentTutorialStep.targetSelector && (
          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, transparent 200px, rgba(0,0,0,0.8) 300px)`
              }}
            />
          </div>
        )}

        {/* Tutorial Panel */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            absolute max-w-md mx-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 shadow-2xl
            ${currentTutorialStep.position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}
            ${currentTutorialStep.position === 'top' ? 'top-4 left-1/2 transform -translate-x-1/2' : ''}
            ${currentTutorialStep.position === 'bottom' ? 'bottom-4 left-1/2 transform -translate-x-1/2' : ''}
            ${currentTutorialStep.position === 'left' ? 'left-4 top-1/2 transform -translate-y-1/2' : ''}
            ${currentTutorialStep.position === 'right' ? 'right-4 top-1/2 transform -translate-y-1/2' : ''}
          `}
        >
          {/* Progress Bar */}
          <div className="h-1 bg-gray-700 rounded-t-2xl overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <currentTutorialStep.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{currentTutorialStep.title}</h3>
                  <p className="text-gray-400 text-sm">Adım {currentStep + 1} / {tutorialSteps.length}</p>
                </div>
              </div>
              <button
                onClick={skipTutorial}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {currentTutorialStep.description}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Önceki</span>
              </button>

              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-yellow-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
              >
                <span>{isLastStep ? 'Tamamla' : 'Sonraki'}</span>
                {!isLastStep && <ArrowRight className="h-4 w-4" />}
                {isLastStep && <CheckCircle className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pointing Arrow for targeted elements */}
        {currentTutorialStep.targetSelector && currentTutorialStep.position !== 'center' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
              absolute w-8 h-8 text-yellow-400
              ${currentTutorialStep.position === 'top' ? 'top-20 left-1/2 transform -translate-x-1/2' : ''}
              ${currentTutorialStep.position === 'bottom' ? 'bottom-20 left-1/2 transform -translate-x-1/2 rotate-180' : ''}
              ${currentTutorialStep.position === 'left' ? 'left-20 top-1/2 transform -translate-y-1/2 -rotate-90' : ''}
              ${currentTutorialStep.position === 'right' ? 'right-20 top-1/2 transform -translate-y-1/2 rotate-90' : ''}
            `}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full animate-bounce">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}