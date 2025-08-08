"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../../types/battle/core';
import BattleCard from './BattleCard';
import { 
  Zap, 
  Cloud, 
  Sun, 
  CloudRain,
  Mountain,
  Trees,
  Waves
} from 'lucide-react';

interface BattleFieldProps {
  gameState: GameState;
  onTargetSelect?: (position: { x: number; y: number }) => void;
  targetingMode?: boolean;
}

const weatherIcons = {
  'storm': CloudRain,
  'sunshine': Sun,
  'fog': Cloud,
  'blizzard': Cloud
};

const terrainIcons = {
  'mountains': Mountain,
  'forest': Trees,
  'desert': Sun,
  'ocean': Waves,
  'volcano': Mountain
};

export default function BattleField({ 
  gameState, 
  onTargetSelect, 
  targetingMode = false 
}: BattleFieldProps) {
  
  const handleFieldClick = (x: number, y: number) => {
    if (targetingMode && onTargetSelect) {
      onTargetSelect({ x, y });
    }
  };

  const WeatherIcon = gameState.weather ? weatherIcons[gameState.weather.type] : null;
  const TerrainIcon = gameState.terrain ? terrainIcons[gameState.terrain.type] : null;

  return (
    <div className="relative min-h-96 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl border border-white/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('/grid.svg')] bg-repeat"></div>
      </div>

      {/* Weather Effect */}
      {gameState.weather && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
            {WeatherIcon && <WeatherIcon className="h-5 w-5 text-blue-300" />}
            <span className="text-white text-sm font-medium capitalize">
              {gameState.weather.type}
            </span>
            <span className="text-gray-300 text-xs">
              {gameState.weather.turnsRemaining}t
            </span>
          </div>
          
          {/* Weather Visual Effects */}
          {gameState.weather.type === 'storm' && (
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-8 bg-blue-300/30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, 400],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Terrain Effect */}
      {gameState.terrain && (
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
          {TerrainIcon && <TerrainIcon className="h-5 w-5 text-green-300" />}
          <span className="text-white text-sm font-medium capitalize">
            {gameState.terrain.type}
          </span>
        </div>
      )}

      {/* Global Effects */}
      {gameState.globalEffects.length > 0 && (
        <div className="absolute top-4 left-4 space-y-2">
          {gameState.globalEffects.map((effect, index) => (
            <motion.div
              key={effect.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-purple-500/80 backdrop-blur-sm rounded-lg px-3 py-2"
            >
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">{effect.name}</span>
                <span className="text-purple-200 text-xs">
                  {effect.turnsRemaining}t
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Battle Field Grid */}
      <div className="relative h-full p-6">
        <div className="grid grid-cols-6 grid-rows-4 gap-2 h-full">
          
          {/* Opponent Field (Top 2 rows) */}
          <div className="col-span-6 row-span-2">
            <div className="h-full bg-red-900/20 backdrop-blur-sm rounded-xl border border-red-500/30 p-4">
              <div className="flex justify-center items-center h-full">
                <div className="grid grid-cols-3 gap-4 max-w-md w-full">
                  <AnimatePresence>
                    {gameState.opponent.field.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ scale: 0, y: -50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: -50 }}
                        className={`
                          ${targetingMode ? 'cursor-crosshair hover:ring-2 hover:ring-red-400' : ''}
                        `}
                        onClick={() => handleFieldClick(index, 0)}
                      >
                        <BattleCard
                          card={card}
                          isOpponent={true}
                          scale={0.8}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Opponent Field Label */}
              <div className="absolute top-2 left-4 text-red-300 text-sm font-medium">
                Opponent Field ({gameState.opponent.field.length}/6)
              </div>
            </div>
          </div>

          {/* Player Field (Bottom 2 rows) */}
          <div className="col-span-6 row-span-2">
            <div className="h-full bg-blue-900/20 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4">
              <div className="flex justify-center items-center h-full">
                <div className="grid grid-cols-3 gap-4 max-w-md w-full">
                  <AnimatePresence>
                    {gameState.player.field.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ scale: 0, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 50 }}
                        className={`
                          ${targetingMode ? 'cursor-crosshair hover:ring-2 hover:ring-blue-400' : ''}
                        `}
                        onClick={() => handleFieldClick(index, 1)}
                      >
                        <BattleCard
                          card={card}
                          scale={0.8}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Player Field Label */}
              <div className="absolute bottom-2 left-4 text-blue-300 text-sm font-medium">
                Your Field ({gameState.player.field.length}/6)
              </div>
            </div>
          </div>
        </div>

        {/* Center Divider */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        
        {/* Battle Zone Indicator */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className="text-white text-sm font-bold">⚔️ BATTLE ZONE ⚔️</span>
        </div>
      </div>

      {/* Targeting Mode Overlay */}
      {targetingMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-yellow-400/20 backdrop-blur-sm border-2 border-yellow-400 border-dashed rounded-2xl flex items-center justify-center"
        >
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-yellow-400 text-2xl mb-2">🎯</div>
            <h3 className="text-white text-lg font-bold mb-2">Select Target</h3>
            <p className="text-gray-300 text-sm">
              Click on a valid target to execute your action
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty Field Messages */}
      {gameState.player.field.length === 0 && gameState.opponent.field.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="text-xl font-bold mb-2">Ready for Battle</h3>
            <p className="text-sm">Play your first card to begin the epic duel!</p>
          </div>
        </div>
      )}
    </div>
  );
}