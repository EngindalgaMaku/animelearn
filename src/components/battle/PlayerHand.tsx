"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { BattleCard as BattleCardType } from '../../types/battle/core';
import BattleCard from './BattleCard';

interface PlayerHandProps {
  cards: BattleCardType[];
  selectedCard?: BattleCardType | null;
  onCardSelect: (card: BattleCardType) => void;
  disabled?: boolean;
  maxDisplayCards?: number;
}

export default function PlayerHand({ 
  cards, 
  selectedCard, 
  onCardSelect, 
  disabled = false,
  maxDisplayCards = 8
}: PlayerHandProps) {
  
  const displayCards = cards.slice(0, maxDisplayCards);
  const hasMoreCards = cards.length > maxDisplayCards;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="relative">
      {/* Hand Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-end justify-center space-x-2 px-4 py-2 overflow-x-auto"
        style={{
          // Slight fan effect for better visibility
          transformStyle: 'preserve-3d'
        }}
      >
        <AnimatePresence mode="popLayout">
          {displayCards.map((card, index) => {
            const isSelected = selectedCard?.id === card.id;
            const cardRotation = (index - (displayCards.length - 1) / 2) * 3; // Fan rotation
            const cardOffset = Math.abs(index - (displayCards.length - 1) / 2) * 2; // Slight height offset
            
            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                layout
                className="relative"
                style={{
                  transform: `rotate(${cardRotation}deg) translateY(${cardOffset}px)`,
                  zIndex: isSelected ? 50 : 10 + index
                }}
                whileHover={!disabled ? {
                  scale: 1.05,
                  y: -10,
                  rotate: 0,
                  zIndex: 100,
                  transition: { duration: 0.2 }
                } : {}}
                animate={isSelected ? {
                  scale: 1.1,
                  y: -15,
                  rotate: 0,
                  zIndex: 100
                } : {}}
              >
                <BattleCard
                  card={card}
                  isSelected={isSelected}
                  onClick={() => !disabled && onCardSelect(card)}
                  disabled={disabled}
                  scale={0.9}
                />
                
                {/* Mana Cost Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center z-10">
                  <span className="text-white text-xs font-bold">{card.manaCost}</span>
                </div>

                {/* Card Count for duplicates */}
                {cards.filter(c => c.name === card.name).length > 1 && (
                  <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-green-600 rounded-full border-2 border-white flex items-center justify-center z-10">
                    <span className="text-white text-xs font-bold">
                      {cards.filter(c => c.name === card.name).length}
                    </span>
                  </div>
                )}

                {/* Playable Indicator */}
                {!disabled && (
                  <div className="absolute top-2 left-2">
                    <div className={`w-2 h-2 rounded-full ${
                      card.manaCost <= 10 ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* More Cards Indicator */}
        {hasMoreCards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center w-20 h-28 bg-gray-800 border-2 border-gray-600 rounded-xl"
          >
            <div className="text-center text-gray-400">
              <div className="text-lg font-bold">+{cards.length - maxDisplayCards}</div>
              <div className="text-xs">more</div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Hand Stats */}
      <div className="mt-2 flex justify-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <span>Cards:</span>
          <span className="text-white font-semibold">{cards.length}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Avg Cost:</span>
          <span className="text-blue-400 font-semibold">
            {cards.length > 0 ? (cards.reduce((sum, card) => sum + card.manaCost, 0) / cards.length).toFixed(1) : '0'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Playable:</span>
          <span className="text-green-400 font-semibold">
            {cards.filter(card => card.manaCost <= 10).length}
          </span>
        </div>
      </div>

      {/* Selected Card Details */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-50"
          >
            <div className="bg-black/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-sm">
              <h3 className="text-white font-bold text-lg mb-2">{selectedCard.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{selectedCard.description}</p>
              
              {selectedCard.abilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-yellow-400 font-semibold text-sm">Abilities:</h4>
                  {selectedCard.abilities.map((ability, index) => (
                    <div key={index} className="bg-purple-900/50 rounded-lg p-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-purple-300 font-medium text-sm">{ability.name}</span>
                        <span className="text-blue-400 text-xs">{ability.manaCost} mana</span>
                      </div>
                      <p className="text-gray-400 text-xs">{ability.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedCard.keywords.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {selectedCard.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disabled Overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-lg font-bold mb-1">Waiting...</div>
            <div className="text-sm text-gray-300">Opponent's turn</div>
          </div>
        </div>
      )}
    </div>
  );
}