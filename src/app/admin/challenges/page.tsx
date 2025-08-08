"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Trophy, 
  Calendar, 
  Target,
  Diamond,
  Zap,
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface Challenge {
  id: string;
  title: string;
  description: string;
  challengeType: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  targetValue: number;
  diamondReward: number;
  experienceReward: number;
  category: string;
  participantCount: number;
  completionCount: number;
  averageProgress: number;
  createdAt: string;
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/challenges');
      if (response.ok) {
        const data = await response.json();
        setChallenges(data.challenges || []);
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChallengeActive = async (challengeId: string, isActive: boolean) => {
    try {
      setActionLoading(challengeId);
      const response = await fetch(`/api/admin/challenges/${challengeId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        setChallenges(prev => prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, isActive: !isActive }
            : challenge
        ));
      }
    } catch (error) {
      console.error('Failed to toggle challenge:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteChallenge = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(challengeId);
      const response = await fetch(`/api/admin/challenges/${challengeId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setChallenges(prev => prev.filter(challenge => challenge.id !== challengeId));
      }
    } catch (error) {
      console.error('Failed to delete challenge:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredChallenges = challenges
    .filter(challenge => {
      if (filter === 'active') return challenge.isActive;
      if (filter === 'inactive') return !challenge.isActive;
      if (filter === 'completed') {
        const endDate = new Date(challenge.endDate);
        return endDate < new Date();
      }
      if (filter === 'upcoming') {
        const startDate = new Date(challenge.startDate);
        return startDate > new Date();
      }
      return true;
    })
    .filter(challenge => 
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Challenge];
      const bValue = b[sortBy as keyof Challenge];
      const modifier = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      
      return ((aValue as number) - (bValue as number)) * modifier;
    });

  const getChallengeStatusIcon = (challenge: Challenge) => {
    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    if (!challenge.isActive) return <Pause className="h-4 w-4 text-gray-500" />;
    if (endDate < now) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (startDate > now) return <Clock className="h-4 w-4 text-blue-500" />;
    return <Play className="h-4 w-4 text-green-500" />;
  };

  const getChallengeStatusColor = (challenge: Challenge) => {
    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    if (!challenge.isActive) return 'border-gray-300 bg-gray-50';
    if (endDate < now) return 'border-green-300 bg-green-50';
    if (startDate > now) return 'border-blue-300 bg-blue-50';
    return 'border-purple-300 bg-purple-50';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'code_arena': return <Target className="h-4 w-4" />;
      case 'quiz': return <Trophy className="h-4 w-4" />;
      case 'daily_login': return <Calendar className="h-4 w-4" />;
      case 'card_collection': return <Diamond className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🎯 Challenge Management
              </h1>
              <p className="text-purple-200">
                Create and manage weekly challenges for users
              </p>
            </div>
            
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-5 w-5 inline mr-2" />
              Create Challenge
            </motion.button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="all" className="bg-slate-800">All Challenges</option>
                <option value="active" className="bg-slate-800">Active</option>
                <option value="inactive" className="bg-slate-800">Inactive</option>
                <option value="upcoming" className="bg-slate-800">Upcoming</option>
                <option value="completed" className="bg-slate-800">Completed</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="createdAt" className="bg-slate-800">Created Date</option>
                <option value="startDate" className="bg-slate-800">Start Date</option>
                <option value="participantCount" className="bg-slate-800">Participants</option>
                <option value="completionCount" className="bg-slate-800">Completions</option>
              </select>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{challenges.length}</p>
                <p className="text-purple-200">Total Challenges</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {challenges.filter(c => c.isActive).length}
                </p>
                <p className="text-green-200">Active</p>
              </div>
              <Play className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {challenges.reduce((sum, c) => sum + c.participantCount, 0)}
                </p>
                <p className="text-blue-200">Total Participants</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {challenges.length > 0 
                    ? Math.round(challenges.reduce((sum, c) => sum + c.averageProgress, 0) / challenges.length)
                    : 0
                  }%
                </p>
                <p className="text-yellow-200">Avg. Progress</p>
              </div>
              <BarChart3 className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-xl p-6 h-32"></div>
              ))}
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-400 mb-2">No challenges found</p>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first challenge to get started'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredChallenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border-2 rounded-xl p-6 ${getChallengeStatusColor(challenge)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getChallengeStatusIcon(challenge)}
                        <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-600">
                          {getTypeIcon(challenge.challengeType)}
                          <span className="text-sm capitalize">{challenge.challengeType.replace('_', ' ')}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{challenge.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Target</p>
                          <p className="font-semibold text-gray-900">{challenge.targetValue}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Participants</p>
                          <p className="font-semibold text-gray-900">{challenge.participantCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Completed</p>
                          <p className="font-semibold text-gray-900">{challenge.completionCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Progress</p>
                          <p className="font-semibold text-gray-900">{Math.round(challenge.averageProgress)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Rewards</p>
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center text-sm">
                              <Diamond className="h-3 w-3 mr-1" />
                              {challenge.diamondReward}
                            </span>
                            <span className="flex items-center text-sm">
                              <Zap className="h-3 w-3 mr-1" />
                              {challenge.experienceReward}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Start: {new Date(challenge.startDate).toLocaleDateString()}</span>
                        <span>End: {new Date(challenge.endDate).toLocaleDateString()}</span>
                        <span className="capitalize">Category: {challenge.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/admin/challenges/${challenge.id}`}>
                        <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      
                      <Link href={`/admin/challenges/${challenge.id}/edit`}>
                        <button className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      
                      <button
                        onClick={() => toggleChallengeActive(challenge.id, challenge.isActive)}
                        disabled={actionLoading === challenge.id}
                        className={`p-2 text-white rounded-lg transition-colors ${
                          challenge.isActive 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {actionLoading === challenge.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : challenge.isActive ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => deleteChallenge(challenge.id)}
                        disabled={actionLoading === challenge.id}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}