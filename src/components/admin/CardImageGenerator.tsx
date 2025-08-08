'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createSampleCards } from '../../data/cards/cardFactory';
import { ElementType } from '../../types/battle/core';

// Kart prompt'ları
const cardPrompts: Record<string, string> = {
  'fire_001': 'Professional TCG card artwork, anime style fantasy illustration of a small mischievous fire sprite, floating fairy-like creature made of living flames, bright orange and red fire aura, sparkling ember particles, playful expression with glowing yellow eyes, translucent fiery wings, dancing around small floating flames, magical forest background with warm lighting, digital painting, detailed shading, vibrant colors, trading card game quality, 400x600 resolution, vertical composition',
  
  'fire_002': 'Epic legendary TCG card artwork, majestic ancient red dragon breathing massive flames, enormous wingspan with detailed scales, molten lava flowing from mountains in background, intense orange and crimson fire effects, glowing golden eyes, sharp crystalline horns, dramatic lighting with volcanic atmosphere, smoke and ember particles, high fantasy anime art style, extremely detailed digital painting, legendary rarity quality, 400x600 resolution',
  
  'fire_003': 'Spell card artwork for TCG, devastating meteor falling from space toward earth, massive fiery projectile with bright orange trail, cosmic background with stars, impact explosion with fire and debris, dramatic perspective from ground looking up, intense lighting effects, anime style digital art, magical energy waves, epic destruction scene, spell card composition, 400x600 resolution',
  
  'water_001': 'Anime style TCG character artwork, mystical water mage with flowing blue robes, long silver hair flowing like water, glowing blue eyes, graceful pose summoning ocean waves, water magic swirling around hands, peaceful ocean background with gentle waves, blue and cyan color palette, detailed character design, magical staff with crystal, serene expression, 400x600 resolution',
  
  'water_002': 'Mythic rarity TCG artwork, colossal sea kraken rising from dark ocean depths, massive tentacles with detailed suction cups, bioluminescent patterns glowing blue, fierce eyes in the deep water, underwater scene with rays of light from surface, dark blue and teal colors, epic scale showing size comparison, anime style sea monster, highly detailed tentacles, 400x600 resolution',
  
  'earth_001': 'TCG creature card artwork, animated stone golem with moss and crystals, humanoid rock formation with glowing green gems for eyes, ancient runes carved into stone body, protective stance in enchanted forest, earth magic aura, brown and green color scheme, fantasy anime art style, detailed rock texture, magical energy flowing through cracks, 400x600 resolution',
  
  'earth_002': 'Epic TCG card artwork, colossal humanoid giant made of living mountain, towering over landscape, rocky skin with grass and trees growing on body, massive size comparison with mountains, earth elemental magic, brown and grey colors with green vegetation, anime fantasy style, dramatic upward perspective, cloudy sky background, extremely detailed, 400x600 resolution',
  
  'air_001': 'Graceful TCG creature artwork, ethereal wind elemental in flowing motion, translucent body made of swirling air currents, elegant dancing pose mid-flight, long flowing hair like wind streams, light blue and white colors, sky background with floating clouds, anime style character design, magical wind effects, serene expression, delicate features, 400x600 resolution',
  
  'air_002': 'Legendary TCG card artwork, powerful storm god commanding lightning and thunder, floating in stormy sky, crackling electricity around body, dramatic cape flowing in wind, glowing electric blue eyes, holding lightning bolt, dark storm clouds background, intense lighting effects, anime style powerful character, purple and blue color scheme, 400x600 resolution',
  
  'light_001': 'Divine TCG creature artwork, beautiful angel with six pure white wings, golden halo and armor, serene peaceful expression, holy light radiating from body, floating in heavenly clouds, warm golden and white colors, anime style divine character, detailed feather texture, protective aura, celestial background with light rays, 400x600 resolution',
  
  'light_002': 'Divine rarity TCG artwork, magnificent phoenix made of pure solar energy, brilliant white and gold flames, majestic wingspan spreading across sky, rebirth energy radiating outward, celestial fire effects, ascending toward sun, extremely bright lighting, anime fantasy style, most beautiful and divine creature, golden color palette with white accents, 400x600 resolution',
  
  'shadow_001': 'TCG character artwork, stealthy ninja assassin emerging from shadows, hooded figure with glowing purple eyes, dark clothing with shadow magic effects, daggers with dark energy, crouching stealth pose, nighttime urban background, purple and black color scheme, anime style character design, mysterious atmosphere, shadow tendrils, 400x600 resolution',
  
  'shadow_002': 'Epic TCG creature artwork, otherworldly being from space between dimensions, partially transparent body with void energy, dark purple and black colors, cosmic background with swirling galaxies, reality distortion effects around figure, anime style supernatural entity, mysterious hooded appearance, floating in zero gravity, 400x600 resolution',
  
  'neutral_001': 'TCG artifact creature artwork, mechanical golem made of clear magical crystals, geometric crystalline body structure, glowing inner energy core, neutral colors with rainbow crystal refractions, magical workshop background, anime style construct design, detailed crystal facets, standing guard pose, 400x600 resolution',
  
  'neutral_002': 'TCG character artwork, wise elderly mage with long beard, multiple floating magical books and scrolls, staff with neutral magical crystal, scholarly robes in earth tones, library background filled with ancient tomes, anime style character design, peaceful intellectual appearance, magical knowledge aura, 400x600 resolution'
};

interface GenerationStatus {
  cardId: string;
  status: 'pending' | 'generating' | 'success' | 'error';
  imageUrl?: string;
  error?: string;
}

export const CardImageGenerator: React.FC = () => {
  const [generationStatus, setGenerationStatus] = useState<Record<string, GenerationStatus>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const sampleCards = createSampleCards();

  const initializeStatus = () => {
    const status: Record<string, GenerationStatus> = {};
    sampleCards.forEach(card => {
      status[card.id] = {
        cardId: card.id,
        status: 'pending'
      };
    });
    setGenerationStatus(status);
  };

  React.useEffect(() => {
    initializeStatus();
  }, []);

  const generateSingleCard = async (cardId: string) => {
    const card = sampleCards.find(c => c.id === cardId);
    if (!card || !cardPrompts[cardId]) return;

    setGenerationStatus(prev => ({
      ...prev,
      [cardId]: { ...prev[cardId], status: 'generating' }
    }));

    try {
      const response = await fetch('/api/imagen/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: cardPrompts[cardId],
          cardId: cardId,
          element: card.element
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGenerationStatus(prev => ({
          ...prev,
          [cardId]: {
            ...prev[cardId],
            status: 'success',
            imageUrl: result.imageUrl
          }
        }));
      } else {
        setGenerationStatus(prev => ({
          ...prev,
          [cardId]: {
            ...prev[cardId],
            status: 'error',
            error: result.error
          }
        }));
      }
    } catch (error) {
      setGenerationStatus(prev => ({
        ...prev,
        [cardId]: {
          ...prev[cardId],
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const generateAllCards = async () => {
    setIsGenerating(true);

    // Reset all statuses
    initializeStatus();

    for (const card of sampleCards) {
      if (cardPrompts[card.id]) {
        await generateSingleCard(card.id);
        // Rate limiting: 3 saniye bekle
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setIsGenerating(false);
  };

  const generateSelectedCards = async () => {
    if (selectedCards.length === 0) return;

    setIsGenerating(true);

    for (const cardId of selectedCards) {
      await generateSingleCard(cardId);
      // Rate limiting: 3 saniye bekle
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    setIsGenerating(false);
  };

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const selectAllCards = () => {
    setSelectedCards(sampleCards.map(card => card.id));
  };

  const clearSelection = () => {
    setSelectedCards([]);
  };

  const getElementColor = (element: ElementType) => {
    const colors = {
      [ElementType.FIRE]: 'border-red-500 bg-red-500',
      [ElementType.WATER]: 'border-blue-500 bg-blue-500',
      [ElementType.EARTH]: 'border-green-500 bg-green-500',
      [ElementType.AIR]: 'border-cyan-500 bg-cyan-500',
      [ElementType.LIGHT]: 'border-yellow-500 bg-yellow-500',
      [ElementType.SHADOW]: 'border-purple-500 bg-purple-500',
      [ElementType.NEUTRAL]: 'border-gray-500 bg-gray-500'
    };
    return colors[element] || 'border-gray-500 bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-600';
      case 'generating': return 'bg-blue-600 animate-pulse';
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const successCount = Object.values(generationStatus).filter(s => s.status === 'success').length;
  const errorCount = Object.values(generationStatus).filter(s => s.status === 'error').length;
  const pendingCount = Object.values(generationStatus).filter(s => s.status === 'pending').length;
  const generatingCount = Object.values(generationStatus).filter(s => s.status === 'generating').length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">🎨 Card Image Generator</h1>
        <p className="text-gray-400 mb-6">
          Google Imagen kullanarak "Elements of Legends" kartları için professional artwork oluşturun
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{successCount}</div>
            <div className="text-sm text-gray-400">Generated</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{generatingCount}</div>
            <div className="text-sm text-gray-400">Generating</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{errorCount}</div>
            <div className="text-sm text-gray-400">Failed</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">{pendingCount}</div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={generateAllCards}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🎨</span>
            <span>{isGenerating ? 'Generating All...' : 'Generate All Cards'}</span>
          </motion.button>

          <motion.button
            onClick={generateSelectedCards}
            disabled={isGenerating || selectedCards.length === 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>✨</span>
            <span>Generate Selected ({selectedCards.length})</span>
          </motion.button>

          <button
            onClick={selectAllCards}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold"
          >
            Select All
          </button>

          <button
            onClick={clearSelection}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleCards.map((card) => {
          const status = generationStatus[card.id];
          const isSelected = selectedCards.includes(card.id);
          
          return (
            <motion.div
              key={card.id}
              className={`bg-gray-800 rounded-lg overflow-hidden border-2 transition-all ${
                isSelected ? 'border-blue-500 bg-blue-900 bg-opacity-30' : 'border-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {/* Selection Checkbox */}
              <div className="p-4 pb-0">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCardSelection(card.id)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-white font-semibold">{card.name}</span>
                </label>
              </div>

              {/* Card Preview */}
              <div className="p-4">
                <div className="h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {status?.imageUrl ? (
                    <img
                      src={status.imageUrl}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎴</div>
                      <div className="text-sm text-gray-400">{card.id}</div>
                    </div>
                  )}
                </div>

                {/* Element Badge */}
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white mb-3 ${getElementColor(card.element).split(' ')[1]} bg-opacity-20 border ${getElementColor(card.element).split(' ')[0]}`}>
                  {card.element}
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(status?.status || 'pending')}`}>
                    {status?.status || 'pending'}
                  </div>
                  
                  {status?.status === 'pending' && (
                    <button
                      onClick={() => generateSingleCard(card.id)}
                      disabled={isGenerating}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Generate
                    </button>
                  )}
                  
                  {status?.status === 'error' && (
                    <button
                      onClick={() => generateSingleCard(card.id)}
                      disabled={isGenerating}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Retry
                    </button>
                  )}
                </div>

                {/* Error Message */}
                {status?.error && (
                  <div className="mt-2 text-xs text-red-400 bg-red-900 bg-opacity-30 p-2 rounded">
                    {status.error}
                  </div>
                )}

                {/* Prompt Preview */}
                <details className="mt-3">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-white">
                    View Prompt
                  </summary>
                  <div className="mt-2 text-xs text-gray-300 bg-gray-900 p-2 rounded max-h-20 overflow-y-auto">
                    {cardPrompts[card.id] || 'No prompt available'}
                  </div>
                </details>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};