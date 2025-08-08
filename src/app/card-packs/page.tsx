"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Star, 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  Shield,
  Crown,
  Diamond,
  Zap,
  RefreshCw,
  Package
} from 'lucide-react';
import CardPackOpening from '@/components/gamification/card-pack-opening';

interface Card {
  cardId: string;
  name: string;
  series: string;
  rarity: string;
  attack: number;
  defense: number;
  special: number;
  image: string;
}

interface PackStats {
  collectionProgress: {
    totalCards: number;
    rarityBreakdown: Record<string, number>;
    rarityPercentages: Record<string, number>;
    totalValue: number;
    averageValue: number;
  };
  pityStatus: {
    rare: { current: number; threshold: number; guaranteed: number; bonusActive: boolean; guaranteedNext: boolean };
    epic: { current: number; threshold: number; guaranteed: number; bonusActive: boolean; guaranteedNext: boolean };
    legendary: { current: number; threshold: number; guaranteed: number; bonusActive: boolean; guaranteedNext: boolean };
  };
  recentPulls: Array<{
    rarity: string;
    cardName: string;
    cardSeries: string;
    timestamp: string;
  }>;
}

export default function CardPacksPage() {
  const [isOpening, setIsOpening] = useState(false);
  const [openedCards, setOpenedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [packStats, setPackStats] = useState<PackStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedPackType, setSelectedPackType] = useState('STANDARD');
  const [selectedPackCount, setSelectedPackCount] = useState(1);

  // Load pack statistics
  useEffect(() => {
    loadPackStats();
  }, []);

  const loadPackStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('/api/card-packs/stats');
      if (response.ok) {
        const data = await response.json();
        setPackStats(data);
      }
    } catch (error) {
      console.error('Failed to load pack stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const openCardPack = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/card-packs/open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          packType: selectedPackType,
          packCount: selectedPackCount
        })
      });

      if (response.ok) {
        const data = await response.json();
        setOpenedCards(data.cards);
        setIsOpening(true);
        
        // Reload stats after opening
        setTimeout(() => loadPackStats(), 1000);
      } else {
        throw new Error('Failed to open pack');
      }
    } catch (error) {
      console.error('Pack opening error:', error);
      alert('Failed to open pack. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      COMMON: 'from-gray-400 to-gray-600',
      UNCOMMON: 'from-green-400 to-green-600',
      RARE: 'from-blue-400 to-blue-600',
      EPIC: 'from-purple-400 to-purple-600',
      LEGENDARY: 'from-yellow-400 to-orange-500'
    };
    return colors[rarity as keyof typeof colors] || colors.COMMON;
  };

  const getRarityIcon = (rarity: string) => {
    const icons = {
      COMMON: <Star className="h-5 w-5" />,
      UNCOMMON: <Sparkles className="h-5 w-5" />,
      RARE: <Diamond className="h-5 w-5" />,
      EPIC: <Crown className="h-5 w-5" />,
      LEGENDARY: <Zap className="h-5 w-5" />
    };
    return icons[rarity as keyof typeof icons] || icons.COMMON;
  };

  const packTypes = [
    { id: 'STANDARD', name: 'Standard Pack', price: '100 coins', description: 'Basic pack with standard rates' },
    { id: 'PREMIUM', name: 'Premium Pack', price: '250 coins', description: 'Higher chance for rare cards' },
    { id: 'LEGENDARY', name: 'Legendary Pack', price: '500 coins', description: 'Guaranteed rare or higher' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎁 Card Pack Opening
          </h1>
          <p className="text-xl text-purple-200">
            Discover powerful anime cards with our advanced rarity system
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pack Opening Section */}
          <div className="lg:col-span-2">
            {/* Pack Type Selection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Package className="h-6 w-6 mr-2" />
                Select Pack Type
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {packTypes.map((pack) => (
                  <motion.div
                    key={pack.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPackType === pack.id
                        ? 'border-yellow-400 bg-yellow-400/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    onClick={() => setSelectedPackType(pack.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="text-white font-bold text-lg mb-2">{pack.name}</h3>
                    <p className="text-yellow-400 font-semibold mb-2">{pack.price}</p>
                    <p className="text-gray-300 text-sm">{pack.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Pack Count Selection */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2">Pack Quantity:</label>
                <select
                  value={selectedPackCount}
                  onChange={(e) => setSelectedPackCount(Number(e.target.value))}
                  className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-400"
                >
                  {[1, 2, 3, 5, 10].map(count => (
                    <option key={count} value={count} className="bg-slate-800">
                      {count} pack{count > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Open Button */}
              <motion.button
                onClick={openCardPack}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xl font-bold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all shadow-2xl disabled:opacity-50"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 mr-2 animate-spin" />
                    Opening Pack...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Gift className="h-6 w-6 mr-2" />
                    Open {selectedPackCount} {selectedPackType} Pack{selectedPackCount > 1 ? 's' : ''}
                  </div>
                )}
              </motion.button>
            </div>

            {/* Recent Pulls */}
            {packStats?.recentPulls && packStats.recentPulls.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Pulls</h3>
                <div className="space-y-3">
                  {packStats.recentPulls.map((pull, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getRarityColor(pull.rarity)}`}>
                          {getRarityIcon(pull.rarity)}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{pull.cardName}</p>
                          <p className="text-gray-300 text-sm">{pull.cardSeries}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getRarityColor(pull.rarity)} text-white`}>
                        {pull.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Statistics Section */}
          <div className="space-y-6">
            {/* Collection Stats */}
            {packStats?.collectionProgress && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Collection Stats
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center bg-white/5 rounded-lg p-4">
                    <p className="text-2xl font-bold text-yellow-400">{packStats.collectionProgress.totalCards}</p>
                    <p className="text-gray-300">Total Cards</p>
                  </div>
                  
                  <div className="text-center bg-white/5 rounded-lg p-4">
                    <p className="text-2xl font-bold text-green-400">{packStats.collectionProgress.totalValue.toLocaleString()}</p>
                    <p className="text-gray-300">Collection Value</p>
                  </div>

                  {/* Rarity Breakdown */}
                  <div className="space-y-2">
                    {Object.entries(packStats.collectionProgress.rarityBreakdown).map(([rarity, count]) => (
                      <div key={rarity} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded bg-gradient-to-r ${getRarityColor(rarity)}`}>
                            {getRarityIcon(rarity)}
                          </div>
                          <span className="text-white text-sm">{rarity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">{count}</span>
                          <span className="text-gray-400 text-sm">
                            ({packStats.collectionProgress.rarityPercentages[rarity]}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pity System Status */}
            {packStats?.pityStatus && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Pity Protection
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(packStats.pityStatus).map(([rarity, status]) => (
                    <div key={rarity} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold capitalize">{rarity}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          status.guaranteedNext ? 'bg-green-500' : 
                          status.bonusActive ? 'bg-yellow-500' : 'bg-gray-500'
                        } text-white`}>
                          {status.guaranteedNext ? 'GUARANTEED' : 
                           status.bonusActive ? 'BONUS ACTIVE' : 'NORMAL'}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            status.guaranteedNext ? 'bg-green-500' :
                            status.bonusActive ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                          style={{ 
                            width: `${Math.min((status.current / status.guaranteed) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{status.current} packs</span>
                        <span>Guaranteed at {status.guaranteed}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Refresh Stats Button */}
            <motion.button
              onClick={loadPackStats}
              disabled={statsLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {statsLoading ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Refresh Stats
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Card Pack Opening Modal */}
      {isOpening && openedCards.length > 0 && (
        <CardPackOpening
          isOpen={isOpening}
          onClose={() => setIsOpening(false)}
          cardPack={{
            id: selectedPackType,
            name: `${selectedPackType} Pack`,
            packType: selectedPackType,
            rarity: 'STANDARD'
          }}
          cards={openedCards.map(card => ({
            id: card.cardId,
            name: card.name,
            rarity: card.rarity,
            imageUrl: card.image,
            rarityLevel: card.rarity === 'LEGENDARY' ? 5 : 
                        card.rarity === 'EPIC' ? 4 :
                        card.rarity === 'RARE' ? 3 :
                        card.rarity === 'UNCOMMON' ? 2 : 1,
            series: card.series,
            character: card.name
          }))}
          onOpenComplete={(cards) => {
            console.log('Pack opening completed:', cards);
            loadPackStats(); // Refresh stats after completion
          }}
          celebrationType={openedCards.some(c => c.rarity === 'LEGENDARY') ? 'special' : 
                          openedCards.some(c => c.rarity === 'EPIC') ? 'big' : 'normal'}
        />
      )}
    </div>
  );
}