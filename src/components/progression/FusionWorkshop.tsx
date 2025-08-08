'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BattleCard, 
  ElementType, 
  RarityTier 
} from '../../types/battle/core';
import { 
  FusionRecipe, 
  CardProgression 
} from '../../types/progression/evolution';
import { EvolutionManager } from '../../utils/progression/evolutionManager';

interface FusionWorkshopProps {
  playerCards: BattleCard[];
  fusionRecipes: FusionRecipe[];
  playerMaterials: Record<string, number>;
  onFusion: (resultCard: BattleCard) => void;
  onClose: () => void;
}

interface SelectedCards {
  primary: BattleCard | null;
  materials: BattleCard[];
}

export const FusionWorkshop: React.FC<FusionWorkshopProps> = ({
  playerCards,
  fusionRecipes,
  playerMaterials,
  onFusion,
  onClose
}) => {
  const [selectedCards, setSelectedCards] = useState<SelectedCards>({
    primary: null,
    materials: []
  });
  const [availableRecipes, setAvailableRecipes] = useState<FusionRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<FusionRecipe | null>(null);
  const [fusionProgress, setFusionProgress] = useState(0);
  const [isFusing, setIsFusing] = useState(false);
  const [fusionResult, setFusionResult] = useState<{
    success: boolean;
    resultCard?: BattleCard;
    failureReason?: string;
  } | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Filter recipes based on available cards
    const available = fusionRecipes.filter(recipe => {
      const primaryCards = playerCards.filter(card => 
        card.id === recipe.primaryCard.cardId && 
        card.level >= recipe.primaryCard.minLevel
      );
      return primaryCards.length > 0;
    });
    setAvailableRecipes(available);
  }, [playerCards, fusionRecipes]);

  const handlePrimaryCardSelect = (card: BattleCard) => {
    setSelectedCards({
      primary: card,
      materials: []
    });
    setSelectedRecipe(null);
  };

  const handleMaterialCardSelect = (card: BattleCard) => {
    if (selectedCards.materials.find(m => m.id === card.id)) {
      // Remove if already selected
      setSelectedCards(prev => ({
        ...prev,
        materials: prev.materials.filter(m => m.id !== card.id)
      }));
    } else {
      // Add to materials
      setSelectedCards(prev => ({
        ...prev,
        materials: [...prev.materials, card]
      }));
    }
  };

  const handleRecipeSelect = (recipe: FusionRecipe) => {
    setSelectedRecipe(recipe);
    
    // Auto-select primary card if available
    const primaryCard = playerCards.find(card => 
      card.id === recipe.primaryCard.cardId && 
      card.level >= recipe.primaryCard.minLevel
    );
    
    if (primaryCard) {
      setSelectedCards({
        primary: primaryCard,
        materials: []
      });
    }
  };

  const canAttemptFusion = () => {
    if (!selectedRecipe || !selectedCards.primary) return false;
    
    // Check if we have enough material cards
    const requiredMaterials = new Map<string, number>();
    selectedRecipe.materialCards.forEach(req => {
      requiredMaterials.set(req.cardId, req.quantity);
    });
    
    const providedMaterials = new Map<string, number>();
    selectedCards.materials.forEach(card => {
      const current = providedMaterials.get(card.id) || 0;
      providedMaterials.set(card.id, current + 1);
    });
    
    for (const [cardId, required] of requiredMaterials) {
      const provided = providedMaterials.get(cardId) || 0;
      if (provided < required) return false;
    }
    
    return true;
  };

  const calculateSuccessRate = () => {
    if (!selectedRecipe) return 0;
    
    let baseRate = selectedRecipe.fusionCost.successRate;
    
    // Add catalyst bonuses
    if (selectedRecipe.catalysts) {
      for (const catalyst of selectedRecipe.catalysts) {
        const available = playerMaterials[catalyst.itemId] || 0;
        if (available >= catalyst.quantity) {
          baseRate += 0.1; // +10% per catalyst
        }
      }
    }
    
    return Math.min(1.0, baseRate);
  };

  const handleFusion = async () => {
    if (!canAttemptFusion() || !selectedRecipe || !selectedCards.primary) return;
    
    setIsFusing(true);
    setFusionProgress(0);
    
    // Animate fusion progress
    const progressInterval = setInterval(() => {
      setFusionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 100);
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Attempt fusion
    const result = EvolutionManager.attemptFusion(
      selectedRecipe,
      selectedCards.primary,
      selectedCards.materials,
      playerMaterials
    );
    
    setFusionResult(result);
    setShowResult(true);
    setIsFusing(false);
    
    if (result.success && result.resultCard) {
      setTimeout(() => {
        onFusion(result.resultCard!);
        onClose();
      }, 3000);
    }
  };

  const getRarityColor = (rarity: RarityTier) => {
    const colors = {
      [RarityTier.COMMON]: 'border-gray-400',
      [RarityTier.UNCOMMON]: 'border-green-400',
      [RarityTier.RARE]: 'border-blue-400',
      [RarityTier.EPIC]: 'border-purple-400',
      [RarityTier.LEGENDARY]: 'border-yellow-400',
      [RarityTier.MYTHIC]: 'border-red-400',
      [RarityTier.DIVINE]: 'border-pink-400'
    };
    return colors[rarity] || 'border-gray-400';
  };

  const getElementColor = (element: ElementType) => {
    const colors: Record<ElementType, string> = {
      [ElementType.FIRE]: 'text-red-400',
      [ElementType.WATER]: 'text-blue-400',
      [ElementType.EARTH]: 'text-green-400',
      [ElementType.AIR]: 'text-cyan-400',
      [ElementType.LIGHT]: 'text-yellow-400',
      [ElementType.SHADOW]: 'text-purple-400',
      [ElementType.NEUTRAL]: 'text-gray-400'
    };
    return colors[element] || 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-900 rounded-2xl p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">🔬 Fusion Workshop</h2>
            <div className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500">
              {availableRecipes.length} Recipes Available
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recipes Panel */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Fusion Recipes</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableRecipes.map((recipe, index) => (
                <motion.div
                  key={index}
                  className={`bg-gray-800 rounded-lg p-4 cursor-pointer border-2 transition-all ${
                    selectedRecipe === recipe
                      ? 'border-purple-500 bg-gray-750'
                      : 'border-transparent hover:border-gray-600'
                  }`}
                  onClick={() => handleRecipeSelect(recipe)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      {recipe.resultCard.cardId}
                    </h4>
                    <div className="text-sm text-purple-400">
                      {Math.floor(recipe.fusionCost.successRate * 100)}% base rate
                    </div>
                  </div>

                  <div className="text-sm text-gray-400 mb-3">
                    Primary: {recipe.primaryCard.cardId} (Lv.{recipe.primaryCard.minLevel}+)
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Materials Required:</div>
                    {recipe.materialCards.map((material, i) => (
                      <div key={i} className="text-xs text-gray-400">
                        • {material.quantity}x {material.cardId}
                      </div>
                    ))}
                  </div>

                  {recipe.catalysts && recipe.catalysts.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <div className="text-xs text-gray-500 mb-1">Optional Catalysts:</div>
                      {recipe.catalysts.map((catalyst, i) => (
                        <div key={i} className="text-xs text-blue-400">
                          • {catalyst.quantity}x {catalyst.itemId} (+10% rate)
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fusion Setup */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Fusion Setup</h3>

            {/* Primary Card Slot */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Primary Card</h4>
              {selectedCards.primary ? (
                <div className={`border-2 ${getRarityColor(selectedCards.primary.rarity)} rounded-lg p-3 bg-gray-700`}>
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedCards.primary.imageUrl}
                      alt={selectedCards.primary.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <h5 className="text-white font-semibold">{selectedCards.primary.name}</h5>
                      <p className="text-sm text-gray-400">
                        Level {selectedCards.primary.level} • {selectedCards.primary.rarity}
                      </p>
                      <p className={`text-sm ${getElementColor(selectedCards.primary.element)}`}>
                        {selectedCards.primary.element}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-2">🎴</div>
                  <p className="text-gray-400">Select a primary card</p>
                </div>
              )}
            </div>

            {/* Material Cards */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Material Cards</h4>
              <div className="grid grid-cols-2 gap-3 min-h-[120px]">
                {selectedCards.materials.map((card, index) => (
                  <motion.div
                    key={index}
                    className={`border-2 ${getRarityColor(card.rarity)} rounded-lg p-2 bg-gray-700`}
                    layoutId={`material-${card.id}`}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h6 className="text-white text-sm font-semibold truncate">{card.name}</h6>
                        <p className="text-xs text-gray-400">Lv.{card.level}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {Array(Math.max(0, 4 - selectedCards.materials.length)).fill(null).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="border-2 border-dashed border-gray-600 rounded-lg p-2 flex items-center justify-center"
                  >
                    <span className="text-gray-500 text-xs">Empty</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fusion Button */}
            {selectedRecipe && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold">Success Rate:</span>
                  <span className="text-green-400 font-bold">
                    {Math.floor(calculateSuccessRate() * 100)}%
                  </span>
                </div>
                
                <button
                  onClick={handleFusion}
                  disabled={!canAttemptFusion() || isFusing}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    canAttemptFusion() && !isFusing
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isFusing ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Fusing...</span>
                    </span>
                  ) : canAttemptFusion() ? (
                    'Begin Fusion'
                  ) : (
                    'Setup Required'
                  )}
                </button>

                {isFusing && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fusionProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Available Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Available Cards</h3>
            <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {playerCards.map((card) => (
                  <motion.div
                    key={card.id}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      selectedCards.primary?.id === card.id
                        ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                        : selectedCards.materials.find(m => m.id === card.id)
                        ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                        : `${getRarityColor(card.rarity)} hover:bg-gray-700`
                    }`}
                    onClick={() => {
                      if (selectedRecipe?.primaryCard.cardId === card.id && card.level >= selectedRecipe.primaryCard.minLevel) {
                        handlePrimaryCardSelect(card);
                      } else {
                        handleMaterialCardSelect(card);
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="text-white font-semibold text-sm">{card.name}</h5>
                        <p className="text-xs text-gray-400">
                          Level {card.level} • {card.rarity}
                        </p>
                        <p className={`text-xs ${getElementColor(card.element)}`}>
                          {card.element}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">{card.attackPower}⚔️</div>
                        <div className="text-sm text-green-400">{card.health}❤️</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fusion Result Modal */}
        <AnimatePresence>
          {showResult && fusionResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            >
              <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                {fusionResult.success ? (
                  <>
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 2, repeat: Infinity },
                        scale: { duration: 1, repeat: Infinity }
                      }}
                      className="text-6xl mb-4"
                    >
                      ⚡
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Fusion Successful!</h3>
                    <p className="text-green-400 mb-4">A new powerful card has been created!</p>
                    {fusionResult.resultCard && (
                      <div className="bg-gray-800 rounded-lg p-4">
                        <img
                          src={fusionResult.resultCard.imageUrl}
                          alt={fusionResult.resultCard.name}
                          className="w-20 h-20 rounded-lg object-cover mx-auto mb-2"
                        />
                        <h4 className="text-lg font-semibold text-white">{fusionResult.resultCard.name}</h4>
                        <p className="text-purple-400">{fusionResult.resultCard.rarity}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">💥</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Fusion Failed</h3>
                    <p className="text-red-400 mb-4">{fusionResult.failureReason}</p>
                    <button
                      onClick={() => setShowResult(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};