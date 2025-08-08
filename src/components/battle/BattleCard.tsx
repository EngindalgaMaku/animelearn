"use client";

import { motion } from 'framer-motion';
import { BattleCard as BattleCardType, ElementType, RarityTier } from '../../types/battle/core';
import { 
  Flame, 
  Droplet, 
  Mountain, 
  Wind, 
  Sun, 
  Moon, 
  Zap,
  Star,
  Crown,
  Shield
} from 'lucide-react';

interface BattleCardProps {
  card: BattleCardType;
  isSelected?: boolean;
  isOpponent?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  scale?: number;
}

const elementIcons = {
  [ElementType.FIRE]: Flame,
  [ElementType.WATER]: Droplet,
  [ElementType.EARTH]: Mountain,
  [ElementType.AIR]: Wind,
  [ElementType.LIGHT]: Sun,
  [ElementType.SHADOW]: Moon,
  [ElementType.NEUTRAL]: Zap
};

const elementColors = {
  [ElementType.FIRE]: 'from-red-500 to-orange-600',
  [ElementType.WATER]: 'from-blue-500 to-cyan-600',
  [ElementType.EARTH]: 'from-amber-600 to-yellow-700',
  [ElementType.AIR]: 'from-gray-400 to-slate-500',
  [ElementType.LIGHT]: 'from-yellow-300 to-amber-400',
  [ElementType.SHADOW]: 'from-purple-700 to-indigo-800',
  [ElementType.NEUTRAL]: 'from-gray-600 to-gray-700'
};

const rarityColors = {
  [RarityTier.COMMON]: 'border-gray-400',
  [RarityTier.UNCOMMON]: 'border-green-400',
  [RarityTier.RARE]: 'border-blue-400',
  [RarityTier.EPIC]: 'border-purple-400',
  [RarityTier.LEGENDARY]: 'border-orange-400',
  [RarityTier.MYTHIC]: 'border-pink-400',
  [RarityTier.DIVINE]: 'border-yellow-400 shadow-yellow-400/50'
};

const rarityGlow = {
  [RarityTier.COMMON]: '',
  [RarityTier.UNCOMMON]: 'shadow-green-400/30',
  [RarityTier.RARE]: 'shadow-blue-400/30',
  [RarityTier.EPIC]: 'shadow-purple-400/30',
  [RarityTier.LEGENDARY]: 'shadow-orange-400/30',
  [RarityTier.MYTHIC]: 'shadow-pink-400/50',
  [RarityTier.DIVINE]: 'shadow-yellow-400/60'
};

export default function BattleCard({ 
  card, 
  isSelected = false, 
  isOpponent = false,
  onClick, 
  disabled = false,
  scale = 1
}: BattleCardProps) {
  const ElementIcon = elementIcons[card.element];
  const elementGradient = elementColors[card.element];
  const rarityBorder = rarityColors[card.rarity];
  const rarityGlowClass = rarityGlow[card.rarity];

  const isPlayable = card.canAttack || card.canUseAbilities;
  const isDamaged = card.health < card.maxHealth;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: isSelected ? scale * 1.05 : scale,
        opacity: disabled ? 0.6 : 1
      }}
      whileHover={!disabled ? { scale: scale * 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: scale * 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`
        relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 
        ${rarityBorder} ${rarityGlowClass}
        cursor-pointer transition-all duration-200 overflow-hidden
        ${isSelected ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''}
        ${!disabled && isPlayable ? 'hover:shadow-lg' : ''}
        ${disabled ? 'cursor-not-allowed' : ''}
        ${isOpponent ? 'transform rotate-180' : ''}
      `}
      style={{ 
        width: `${120 * scale}px`, 
        height: `${168 * scale}px`,
        minWidth: `${120 * scale}px`
      }}
    >
      {/* Rarity Shine Effect */}
      {(card.rarity === RarityTier.MYTHIC || card.rarity === RarityTier.DIVINE) && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
      )}

      {/* Header */}
      <div className={`px-2 py-1 bg-gradient-to-r ${elementGradient} text-white`}>
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center space-x-1">
            <ElementIcon className="h-3 w-3" />
            <span className="truncate">{card.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{card.manaCost}</span>
            <Zap className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Card Image */}
      <div className="relative h-20 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ElementIcon className="h-8 w-8 text-gray-500" />
          </div>
        )}
        
        {/* Rarity Indicator */}
        <div className="absolute top-1 right-1">
          {card.rarity === RarityTier.LEGENDARY && <Crown className="h-3 w-3 text-orange-400" />}
          {card.rarity === RarityTier.MYTHIC && <Star className="h-3 w-3 text-pink-400" />}
          {card.rarity === RarityTier.DIVINE && <Sun className="h-3 w-3 text-yellow-400" />}
        </div>

        {/* Status Effects Indicator */}
        {card.statusEffects.length > 0 && (
          <div className="absolute bottom-1 left-1 flex space-x-1">
            {card.statusEffects.map((effect, index) => (
              <div 
                key={index}
                className="w-2 h-2 rounded-full bg-purple-400"
                title={`${effect.type} (${effect.duration} turns)`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Type & Description */}
      <div className="px-2 py-1">
        <div className="text-xs text-gray-300 font-medium mb-1">
          {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)}
        </div>
        <div className="text-xs text-gray-400 line-clamp-2">
          {card.description}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50">
        <div className="flex justify-between items-center text-white text-sm font-bold">
          <div className="flex items-center space-x-1">
            <span className="text-red-400">{card.attackPower}</span>
            <span className="text-xs">⚔</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={isDamaged ? 'text-yellow-400' : 'text-green-400'}>
              {card.health}
            </span>
            <span className="text-xs">❤</span>
          </div>
          {card.defense > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-blue-400">{card.defense}</span>
              <Shield className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>

      {/* Abilities Indicator */}
      {card.abilities.length > 0 && (
        <div className="absolute top-16 right-1">
          <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{card.abilities.length}</span>
          </div>
        </div>
      )}

      {/* Can't Attack/Use Abilities Overlay */}
      {!isPlayable && !isOpponent && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded">
            Summoning Sickness
          </span>
        </div>
      )}

      {/* Selection Glow */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl border-2 border-yellow-400 pointer-events-none animate-pulse"></div>
      )}
    </motion.div>
  );
}