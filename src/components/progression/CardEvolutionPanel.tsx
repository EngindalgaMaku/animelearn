'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BattleCard, 
  ElementType, 
  RarityTier 
} from '../../types/battle/core';
import { 
  EvolutionStage, 
  EvolutionPath, 
  CardProgression, 
  EvolutionChain,
  EvolutionPreview,
  EvolutionEvent
} from '../../types/progression/evolution';
import { EvolutionManager, ProgressionAnalytics } from '../../utils/progression/evolutionManager';

interface CardEvolutionPanelProps {
  card: BattleCard;
  progression: CardProgression;
  evolutionChain: EvolutionChain;
  playerMaterials: Record<string, number>;
  onEvolution: (evolvedCard: BattleCard, updatedProgression: CardProgression) => void;
  onClose: () => void;
}

const stageColors = {
  [EvolutionStage.BASE]: 'from-gray-400 to-gray-600',
  [EvolutionStage.EVOLVED]: 'from-blue-400 to-blue-600',
  [EvolutionStage.MEGA]: 'from-purple-400 to-purple-600',
  [EvolutionStage.LEGENDARY]: 'from-yellow-400 to-yellow-600',
  [EvolutionStage.AWAKENED]: 'from-red-400 to-red-600'
};

const stageNames = {
  [EvolutionStage.BASE]: 'Base',
  [EvolutionStage.EVOLVED]: 'Evolved',
  [EvolutionStage.MEGA]: 'Mega',
  [EvolutionStage.LEGENDARY]: 'Legendary',
  [EvolutionStage.AWAKENED]: 'Awakened'
};

export const CardEvolutionPanel: React.FC<CardEvolutionPanelProps> = ({
  card,
  progression,
  evolutionChain,
  playerMaterials,
  onEvolution,
  onClose
}) => {
  const [selectedPath, setSelectedPath] = useState<EvolutionPath | null>(null);
  const [previewData, setPreviewData] = useState<EvolutionPreview | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [insights, setInsights] = useState<Array<{ type: string; message: string; priority: number }>>([]);

  const currentStageData = evolutionChain.stages[progression.currentStage];
  const availablePaths = currentStageData?.paths || [];

  useEffect(() => {
    const progressionInsights = ProgressionAnalytics.getProgressionInsights(progression);
    setInsights(progressionInsights);
  }, [progression]);

  const handlePathSelect = (path: EvolutionPath) => {
    setSelectedPath(path);
    const preview = EvolutionManager.getEvolutionPreview(
      card,
      progression,
      path.toStage,
      evolutionChain
    );
    setPreviewData(preview);
  };

  const handleEvolution = async () => {
    if (!selectedPath || !previewData || !previewData.canAfford) return;

    setIsEvolving(true);
    
    try {
      // Simulate evolution process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = EvolutionManager.evolveCard(card, progression, selectedPath);
      
      // Show celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      
      onEvolution(result.evolvedCard, result.updatedProgression);
      
      // Close panel after celebration
      setTimeout(() => onClose(), 3500);
      
    } catch (error) {
      console.error('Evolution failed:', error);
    } finally {
      setIsEvolving(false);
    }
  };

  const getStageIcon = (stage: EvolutionStage) => {
    switch (stage) {
      case EvolutionStage.BASE:
        return '⭐';
      case EvolutionStage.EVOLVED:
        return '🌟';
      case EvolutionStage.MEGA:
        return '✨';
      case EvolutionStage.LEGENDARY:
        return '💫';
      case EvolutionStage.AWAKENED:
        return '🔥';
      default:
        return '⭐';
    }
  };

  const getRarityColor = (rarity: RarityTier) => {
    const colors = {
      [RarityTier.COMMON]: 'text-gray-400',
      [RarityTier.UNCOMMON]: 'text-green-400',
      [RarityTier.RARE]: 'text-blue-400',
      [RarityTier.EPIC]: 'text-purple-400',
      [RarityTier.LEGENDARY]: 'text-yellow-400',
      [RarityTier.MYTHIC]: 'text-red-400',
      [RarityTier.DIVINE]: 'text-pink-400'
    };
    return colors[rarity] || 'text-gray-400';
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
        className="bg-gray-900 rounded-2xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">Card Evolution</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${stageColors[progression.currentStage]}`}>
              {getStageIcon(progression.currentStage)} {stageNames[progression.currentStage]}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Insights Panel */}
        {insights.length > 0 && (
          <div className="mb-6 bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Progression Insights</h3>
            <div className="space-y-2">
              {insights.slice(0, 3).map((insight, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 text-sm ${
                    insight.type === 'success' ? 'text-green-400' :
                    insight.type === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>{insight.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Card */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Current Card</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold text-white">{card.name}</h4>
                  <p className={`text-sm ${getRarityColor(card.rarity)}`}>
                    {card.rarity} • Level {progression.level}
                  </p>
                  <p className="text-sm text-gray-400">{card.element} Element</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-700 rounded">
                  <div className="text-red-400 font-bold">{card.attackPower}</div>
                  <div className="text-xs text-gray-400">Attack</div>
                </div>
                <div className="text-center p-2 bg-gray-700 rounded">
                  <div className="text-green-400 font-bold">{card.health}</div>
                  <div className="text-xs text-gray-400">Health</div>
                </div>
                <div className="text-center p-2 bg-gray-700 rounded">
                  <div className="text-blue-400 font-bold">{card.defense}</div>
                  <div className="text-xs text-gray-400">Defense</div>
                </div>
                <div className="text-center p-2 bg-gray-700 rounded">
                  <div className="text-yellow-400 font-bold">{card.speed}</div>
                  <div className="text-xs text-gray-400">Speed</div>
                </div>
              </div>

              {/* Experience Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Experience</span>
                  <span className="text-blue-400">
                    {progression.experience} / {EvolutionManager.getExperienceForLevel(progression.level + 1)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (progression.experience / EvolutionManager.getExperienceForLevel(progression.level + 1)) * 100
                      }%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Battle Stats */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Battle Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Battles:</span>
                  <span className="text-white ml-2">{progression.battlesParticipated}</span>
                </div>
                <div>
                  <span className="text-gray-400">Victories:</span>
                  <span className="text-green-400 ml-2">{progression.victoriesAchieved}</span>
                </div>
                <div>
                  <span className="text-gray-400">Win Rate:</span>
                  <span className="text-blue-400 ml-2">
                    {((progression.victoriesAchieved / Math.max(1, progression.battlesParticipated)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Best Streak:</span>
                  <span className="text-yellow-400 ml-2">{progression.bestWinStreak}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Evolution Paths */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Evolution Paths</h3>
            
            {availablePaths.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="text-lg font-semibold text-white mb-2">Maximum Evolution Reached</h4>
                <p className="text-gray-400">This card has reached its ultimate form!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availablePaths.map((path, index) => {
                  const requirementCheck = EvolutionManager.checkEvolutionRequirements(
                    progression,
                    path.requirements,
                    playerMaterials
                  );
                  
                  return (
                    <motion.div
                      key={index}
                      className={`bg-gray-800 rounded-lg p-4 cursor-pointer border-2 transition-all ${
                        selectedPath === path
                          ? 'border-blue-500 bg-gray-750'
                          : 'border-transparent hover:border-gray-600'
                      }`}
                      onClick={() => handlePathSelect(path)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getStageIcon(path.toStage)}</span>
                          <div>
                            <h4 className="text-lg font-semibold text-white">
                              {stageNames[path.toStage]} Evolution
                            </h4>
                            <p className="text-sm text-gray-400">
                              {path.unlocks.newAbilities.length} new abilities
                            </p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          requirementCheck.canEvolve
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}>
                          {requirementCheck.canEvolve ? 'Ready' : 'Locked'}
                        </div>
                      </div>

                      {/* Stat Boosts Preview */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="text-center">
                          <div className="text-red-400 font-bold">+{path.unlocks.statBoosts.attackPower}</div>
                          <div className="text-xs text-gray-400">ATK</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-bold">+{path.unlocks.statBoosts.health}</div>
                          <div className="text-xs text-gray-400">HP</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-bold">+{path.unlocks.statBoosts.defense}</div>
                          <div className="text-xs text-gray-400">DEF</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold">+{path.unlocks.statBoosts.speed}</div>
                          <div className="text-xs text-gray-400">SPD</div>
                        </div>
                      </div>

                      {/* Requirements */}
                      {!requirementCheck.canEvolve && (
                        <div className="text-sm text-red-400">
                          <div className="font-semibold mb-1">Requirements:</div>
                          <ul className="text-xs space-y-1">
                            {requirementCheck.missingRequirements.map((req, i) => (
                              <li key={i}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Cost */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <span className="text-blue-400">💎</span>
                            <span className="text-white">{path.evolutionCost.diamonds}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-purple-400">⏱️</span>
                            <span className="text-white">{Math.floor(path.evolutionCost.time / 3600000)}h</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Evolution Preview */}
            {previewData && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Evolution Preview</h4>
                
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={previewData.previewCard.imageUrl}
                    alt={previewData.previewCard.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-lg font-semibold text-white">{previewData.previewCard.name}</h5>
                    <p className={`text-sm ${getRarityColor(previewData.previewCard.rarity)}`}>
                      {previewData.previewCard.rarity}
                    </p>
                  </div>
                </div>

                {/* Stat Comparison */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <div className="text-red-400 font-bold">
                      {card.attackPower} → {previewData.previewCard.attackPower}
                    </div>
                    <div className="text-xs text-gray-400">Attack</div>
                  </div>
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <div className="text-green-400 font-bold">
                      {card.health} → {previewData.previewCard.health}
                    </div>
                    <div className="text-xs text-gray-400">Health</div>
                  </div>
                </div>

                {/* Evolution Button */}
                <button
                  onClick={handleEvolution}
                  disabled={!previewData.canAfford || isEvolving}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    previewData.canAfford && !isEvolving
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isEvolving ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Evolving...</span>
                    </span>
                  ) : previewData.canAfford ? (
                    'Begin Evolution'
                  ) : (
                    'Requirements Not Met'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Evolution Celebration */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity },
                    scale: { duration: 1, repeat: Infinity }
                  }}
                  className="text-8xl mb-4"
                >
                  ✨
                </motion.div>
                <h2 className="text-4xl font-bold text-white mb-2">Evolution Complete!</h2>
                <p className="text-xl text-blue-400">Your card has reached a new level of power!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};