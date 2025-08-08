"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Star,
  Diamond,
  Trophy,
  Zap,
  Brain,
  Target,
  Crown,
  Shield,
  Flame,
  Sparkles,
  Award,
  Gift,
  Calendar,
  Clock,
  TrendingUp,
  Lock,
  Check,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  Info,
} from "lucide-react";

import GamificationEngine, {
  PlayerCharacter,
  SkillTree,
  SkillNode,
  Achievement,
  ProgressionMilestone,
  SeasonalEvent,
} from "./GamificationEngine";

interface GamificationDashboardProps {
  userId: string;
  onSkillActivated?: (skillId: string) => void;
  onAchievementUnlocked?: (achievementId: string) => void;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  userId,
  onSkillActivated,
  onAchievementUnlocked,
}) => {
  // Core State
  const [gamificationEngine] = useState(() => new GamificationEngine(userId));
  const [character, setCharacter] = useState<PlayerCharacter | null>(null);
  const [skillTrees, setSkillTrees] = useState<SkillTree[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [milestones, setMilestones] = useState<ProgressionMilestone[]>([]);
  const [seasonalEvents, setSeasonalEvents] = useState<SeasonalEvent[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<'character' | 'skills' | 'achievements' | 'milestones'>('character');
  const [selectedSkillTree, setSelectedSkillTree] = useState<string>('');
  const [expandedAchievementCategories, setExpandedAchievementCategories] = useState<Set<string>>(new Set(['gameplay']));
  const [showHiddenAchievements, setShowHiddenAchievements] = useState(false);
  const [showSkillTooltip, setShowSkillTooltip] = useState<string>('');
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);

  // Animation States
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);
  const [experienceGainAnimation, setExperienceGainAnimation] = useState(false);
  const [achievementPopup, setAchievementPopup] = useState<Achievement | null>(null);

  // Initialize data
  useEffect(() => {
    const loadData = () => {
      setCharacter(gamificationEngine.getCharacter());
      setSkillTrees(gamificationEngine.getSkillTrees());
      setAchievements(gamificationEngine.getAchievements());
      setMilestones(gamificationEngine.getProgressionMilestones());
      setSeasonalEvents(gamificationEngine.getSeasonalEvents());
      
      // Set default skill tree
      const trees = gamificationEngine.getSkillTrees();
      if (trees.length > 0 && !selectedSkillTree) {
        setSelectedSkillTree(trees[0].id);
      }
    };

    loadData();

    // Setup event listeners
    const handleLevelUp = (data: any) => {
      setLevelUpAnimation(true);
      setTimeout(() => setLevelUpAnimation(false), 3000);
      loadData();
    };

    const handleExperienceGained = (data: any) => {
      setExperienceGainAnimation(true);
      setTimeout(() => setExperienceGainAnimation(false), 1000);
      loadData();
    };

    const handleAchievementCompleted = (data: any) => {
      setAchievementPopup(data.achievement);
      setTimeout(() => setAchievementPopup(null), 5000);
      onAchievementUnlocked?.(data.achievement.id);
      loadData();
    };

    const handleSkillUnlocked = (data: any) => {
      onSkillActivated?.(data.skill.id);
      loadData();
    };

    gamificationEngine.on('level_up', handleLevelUp);
    gamificationEngine.on('experience_gained', handleExperienceGained);
    gamificationEngine.on('achievement_completed', handleAchievementCompleted);
    gamificationEngine.on('skill_unlocked', handleSkillUnlocked);

    return () => {
      // Cleanup listeners if needed
    };
  }, [gamificationEngine, selectedSkillTree, onSkillActivated, onAchievementUnlocked]);

  const handleUnlockSkill = (skillId: string) => {
    const success = gamificationEngine.unlockSkill(skillId);
    if (success) {
      setCharacter(gamificationEngine.getCharacter());
      setSkillTrees(gamificationEngine.getSkillTrees());
    }
  };

  const handleUpgradeSkill = (skillId: string) => {
    const success = gamificationEngine.upgradeSkill(skillId);
    if (success) {
      setCharacter(gamificationEngine.getCharacter());
      setSkillTrees(gamificationEngine.getSkillTrees());
    }
  };

  const handlePrestige = () => {
    const success = gamificationEngine.prestige();
    if (success) {
      setCharacter(gamificationEngine.getCharacter());
      setSkillTrees(gamificationEngine.getSkillTrees());
      setShowPrestigeModal(false);
    }
  };

  const toggleAchievementCategory = (category: string) => {
    const newExpanded = new Set(expandedAchievementCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedAchievementCategories(newExpanded);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'intelligence': return Brain;
      case 'memory': return Target;
      case 'speed': return Zap;
      case 'focus': return Eye;
      case 'creativity': return Sparkles;
      case 'persistence': return Shield;
      default: return Star;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'mythic': return 'text-pink-600 bg-pink-100 border-pink-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSkillTreeColor = (treeId: string) => {
    switch (treeId) {
      case 'memory_mastery': return 'from-purple-500 to-indigo-600';
      case 'speed_demon': return 'from-yellow-500 to-orange-600';
      case 'focus_master': return 'from-blue-500 to-cyan-600';
      case 'strategist': return 'from-green-500 to-emerald-600';
      case 'social_butterfly': return 'from-pink-500 to-rose-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  if (!character) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your character...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Level Up Animation */}
      <AnimatePresence>
        {levelUpAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -100 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-8 text-white text-center shadow-2xl">
              <Crown className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-2">LEVEL UP!</h2>
              <p className="text-xl">Level {character.level}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Popup */}
      <AnimatePresence>
        {achievementPopup && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-40 bg-white rounded-xl p-4 shadow-xl border-2 border-yellow-400 max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{achievementPopup.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900">Achievement Unlocked!</h3>
                <p className="text-sm text-gray-600">{achievementPopup.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl backdrop-blur-sm">
                {character.appearance.avatar}
              </div>
              {character.prestige > 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  ✦{character.prestige}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{character.username}</h1>
              <p className="text-purple-100">{character.appearance.title}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Crown className="h-4 w-4" />
                  <span>Level {character.level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Diamond className="h-4 w-4 text-yellow-300" />
                  <span>{character.diamonds}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-purple-300" />
                  <span>{character.skillPoints} SP</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-purple-200 mb-2">Progress to Level {character.level + 1}</div>
            <div className="w-48 bg-white/20 rounded-full h-3 mb-2">
              <motion.div
                className="bg-yellow-400 h-3 rounded-full relative"
                style={{ width: `${(character.experience / character.experienceToNext) * 100}%` }}
                animate={experienceGainAnimation ? { scale: [1, 1.1, 1] } : {}}
              >
                <div className="absolute right-0 top-0 h-3 w-1 bg-white/60 rounded-full"></div>
              </motion.div>
            </div>
            <div className="text-sm text-purple-200">
              {character.experience} / {character.experienceToNext} XP
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'character', label: 'Character', icon: User },
          { id: 'skills', label: 'Skill Trees', icon: Sparkles },
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'milestones', label: 'Milestones', icon: Target },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === id
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Character Tab */}
      {activeTab === 'character' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Character Stats */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Character Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(character.stats).map(([stat, value]) => {
                const Icon = getStatIcon(stat);
                return (
                  <div key={stat} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900 capitalize">{stat}</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{value}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${Math.min((value / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Game Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Game Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Challenges Completed</span>
                </div>
                <span className="font-bold text-blue-600">{character.completedChallenges}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <span>Perfect Games</span>
                </div>
                <span className="font-bold text-green-600">{character.perfectGames}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <span>Multiplayer Wins</span>
                </div>
                <span className="font-bold text-purple-600">{character.multiplayerWins}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>Total Play Time</span>
                </div>
                <span className="font-bold text-orange-600">{formatTime(character.totalPlayTime)}</span>
              </div>
            </div>

            {/* Prestige Section */}
            {character.level >= 100 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-300">
                <h3 className="font-bold text-yellow-800 mb-2">Prestige Available!</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Reset your level with permanent bonuses and exclusive rewards.
                </p>
                <button
                  onClick={() => setShowPrestigeModal(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <Crown className="h-4 w-4 inline mr-2" />
                  Enter Prestige
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Skill Trees Tab */}
      {activeTab === 'skills' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Skill Tree Selector */}
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {skillTrees.map((tree) => (
              <button
                key={tree.id}
                onClick={() => setSelectedSkillTree(tree.id)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl whitespace-nowrap transition-all ${
                  selectedSkillTree === tree.id
                    ? 'bg-white shadow-lg border-2 border-purple-400'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getSkillTreeColor(tree.id)} text-white text-2xl flex items-center justify-center`}>
                  {tree.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">{tree.name}</h3>
                  <p className="text-sm text-gray-600">{tree.unlockedNodes}/{tree.totalNodes} unlocked</p>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Skill Tree */}
          {selectedSkillTree && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              {(() => {
                const tree = skillTrees.find(t => t.id === selectedSkillTree);
                if (!tree) return null;

                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getSkillTreeColor(tree.id)} text-white text-3xl flex items-center justify-center`}>
                          {tree.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{tree.name}</h2>
                          <p className="text-gray-600">{tree.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Available Skill Points</div>
                        <div className="text-2xl font-bold text-purple-600">{character.skillPoints}</div>
                      </div>
                    </div>

                    {/* Skill Nodes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tree.nodes.map((skill) => {
                        const canUnlock = skill.prerequisites.every(prereq => 
                          character.unlockedSkills.includes(prereq)
                        ) && character.skillPoints >= skill.cost;
                        
                        const canUpgrade = skill.isUnlocked && 
                          skill.currentLevel < skill.maxLevel && 
                          character.skillPoints >= (skill.cost * skill.currentLevel);

                        return (
                          <div
                            key={skill.id}
                            className={`relative p-4 rounded-lg border-2 transition-all ${
                              skill.isUnlocked
                                ? 'bg-green-50 border-green-200'
                                : canUnlock
                                  ? 'bg-blue-50 border-blue-200 hover:shadow-md cursor-pointer'
                                  : 'bg-gray-50 border-gray-200 opacity-60'
                            }`}
                            onMouseEnter={() => setShowSkillTooltip(skill.id)}
                            onMouseLeave={() => setShowSkillTooltip('')}
                          >
                            {/* Skill Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                                  skill.isUnlocked ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                                }`}>
                                  {skill.icon}
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">{skill.name}</h3>
                                  <div className="text-xs text-gray-500">
                                    Tier {skill.tier} • {skill.currentLevel}/{skill.maxLevel}
                                  </div>
                                </div>
                              </div>
                              
                              {!skill.isUnlocked && (
                                <Lock className="h-4 w-4 text-gray-400" />
                              )}
                            </div>

                            {/* Skill Description */}
                            <p className="text-sm text-gray-600 mb-3">{skill.description}</p>

                            {/* Prerequisites */}
                            {skill.prerequisites.length > 0 && !skill.isUnlocked && (
                              <div className="mb-3">
                                <div className="text-xs text-gray-500 mb-1">Requires:</div>
                                <div className="flex flex-wrap gap-1">
                                  {skill.prerequisites.map(prereqId => {
                                    const prereqSkill = tree.nodes.find(s => s.id === prereqId);
                                    const isCompleted = character.unlockedSkills.includes(prereqId);
                                    return (
                                      <span
                                        key={prereqId}
                                        className={`text-xs px-2 py-1 rounded-full ${
                                          isCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                      >
                                        {prereqSkill?.name || prereqId}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Action Button */}
                            <div className="flex space-x-2">
                              {!skill.isUnlocked ? (
                                <button
                                  onClick={() => handleUnlockSkill(skill.id)}
                                  disabled={!canUnlock}
                                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                    canUnlock
                                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                >
                                  Unlock ({skill.cost} SP)
                                </button>
                              ) : skill.currentLevel < skill.maxLevel ? (
                                <button
                                  onClick={() => handleUpgradeSkill(skill.id)}
                                  disabled={!canUpgrade}
                                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                    canUpgrade
                                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                >
                                  Upgrade ({skill.cost * skill.currentLevel} SP)
                                </button>
                              ) : (
                                <div className="flex-1 py-2 px-3 bg-green-500 text-white rounded-lg text-sm font-medium text-center">
                                  Maxed
                                </div>
                              )}
                            </div>

                            {/* Tooltip */}
                            {showSkillTooltip === skill.id && (
                              <div className="absolute top-0 left-full ml-2 z-10 bg-black text-white p-3 rounded-lg text-sm max-w-xs">
                                <h4 className="font-bold mb-1">{skill.name}</h4>
                                <p className="mb-2">{skill.description}</p>
                                <div className="space-y-1">
                                  {skill.effects.map((effect, index) => (
                                    <div key={index} className="text-xs text-gray-300">
                                      • {effect.description}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </motion.div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Achievement Controls */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
            <button
              onClick={() => setShowHiddenAchievements(!showHiddenAchievements)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {showHiddenAchievements ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showHiddenAchievements ? 'Hide' : 'Show'} Secret</span>
            </button>
          </div>

          {/* Achievement Categories */}
          {['gameplay', 'progression', 'social', 'special'].map(category => {
            const categoryAchievements = achievements.filter(
              a => a.category === category && (showHiddenAchievements || !a.isHidden)
            );
            
            if (categoryAchievements.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-xl shadow-lg border border-gray-200">
                <button
                  onClick={() => toggleAchievementCategory(category)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-6 w-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900 capitalize">{category}</h3>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                      {categoryAchievements.filter(a => a.isCompleted).length}/{categoryAchievements.length}
                    </span>
                  </div>
                  {expandedAchievementCategories.has(category) ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedAchievementCategories.has(category) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryAchievements.map(achievement => (
                          <div
                            key={achievement.id}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              achievement.isCompleted
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="text-3xl">{achievement.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-bold text-gray-900">{achievement.name}</h4>
                                  <span className={`text-xs px-2 py-1 rounded-full border ${getRarityColor(achievement.rarity)}`}>
                                    {achievement.rarity}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                                
                                {/* Progress Bar */}
                                <div className="mb-3">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-500">Progress</span>
                                    <span className="font-medium">
                                      {achievement.progress}/{achievement.maxProgress}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all ${
                                        achievement.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                      }`}
                                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Rewards */}
                                <div className="flex flex-wrap gap-2">
                                  {achievement.rewards.map((reward, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                                    >
                                      {reward.description}
                                    </span>
                                  ))}
                                </div>

                                {achievement.isCompleted && achievement.completedAt && (
                                  <div className="mt-2 text-xs text-green-600">
                                    Completed {new Date(achievement.completedAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">Progression Milestones</h2>
          
          <div className="space-y-4">
            {milestones.map((milestone) => {
              const isReached = character.level >= milestone.level;
              const isCurrent = character.level < milestone.level && 
                (milestones.find(m => m.level < milestone.level && character.level >= m.level) || 
                 character.level >= 1);

              return (
                <div
                  key={milestone.level}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    isReached
                      ? 'bg-green-50 border-green-300'
                      : isCurrent
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                      isReached ? 'bg-green-500 text-white' : 
                      isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      {milestone.level}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                      <p className="text-gray-600 mb-3">{milestone.description}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          <Star className="h-4 w-4" />
                          <span>+{milestone.rewards.skillPoints} Skill Points</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          <Diamond className="h-4 w-4" />
                          <span>+{milestone.rewards.diamonds} Diamonds</span>
                        </div>
                        {milestone.rewards.unlocks.map(unlock => (
                          <span key={unlock} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {unlock}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      {isReached ? (
                        <Check className="h-8 w-8 text-green-500" />
                      ) : isCurrent ? (
                        <Target className="h-8 w-8 text-blue-500" />
                      ) : (
                        <Lock className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Prestige Modal */}
      <AnimatePresence>
        {showPrestigeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPrestigeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Prestige</h2>
                <p className="text-gray-600 mb-6">
                  Reset to level 1 but gain permanent bonuses and exclusive rewards. This cannot be undone!
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-yellow-800 mb-2">Prestige Bonuses:</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• +{(character.prestige * 5 + 10)} Skill Points</li>
                    <li>• +{(character.prestige * 2 + 5)} to all base stats</li>
                    <li>• Keep all achievements</li>
                    <li>• Keep tier 1 skills unlocked</li>
                    <li>• Unlock prestige-exclusive content</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPrestigeModal(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePrestige}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Prestige Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamificationDashboard;