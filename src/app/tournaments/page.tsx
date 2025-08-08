"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Trophy, 
  Users, 
  Calendar, 
  Clock, 
  Diamond, 
  Star, 
  Crown,
  Plus,
  Filter,
  Search,
  Eye,
  Play,
  Target,
  ArrowRight,
  Medal,
  Flame,
  Zap,
  ChevronRight,
  Award
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tournament, 
  TournamentType, 
  TournamentStatus, 
  TournamentFormat,
  RankTier 
} from "../../types/tournament/core";

interface TournamentCardProps {
  tournament: Tournament;
}

function TournamentCard({ tournament }: TournamentCardProps) {
  const getStatusColor = (status: TournamentStatus) => {
    switch (status) {
      case TournamentStatus.REGISTRATION:
        return 'bg-green-500';
      case TournamentStatus.READY:
        return 'bg-yellow-500';
      case TournamentStatus.IN_PROGRESS:
        return 'bg-blue-500';
      case TournamentStatus.FINISHED:
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: TournamentType) => {
    switch (type) {
      case TournamentType.SINGLE_ELIMINATION:
        return <Target className="h-4 w-4" />;
      case TournamentType.DOUBLE_ELIMINATION:
        return <Zap className="h-4 w-4" />;
      case TournamentType.ROUND_ROBIN:
        return <Users className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  const timeToStart = tournament.tournamentStart - Date.now();
  const isStartingSoon = timeToStart > 0 && timeToStart < 3600000; // 1 hour

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 truncate">{tournament.name}</h3>
            {tournament.isOfficial && (
              <Crown className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">{tournament.description}</p>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(tournament.status)}`}>
            {tournament.status.replace('_', ' ').toUpperCase()}
          </div>
          {isStartingSoon && (
            <div className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold animate-pulse">
              Starting Soon!
            </div>
          )}
        </div>
      </div>

      {/* Tournament Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {getTypeIcon(tournament.type)}
            <span className="capitalize">{tournament.type.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(tournament.tournamentStart).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Diamond className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">{tournament.prizePool.totalValue.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{new Date(tournament.tournamentStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Award className="h-4 w-4" />
            <span className="capitalize">{tournament.format}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {tournament.status === TournamentStatus.IN_PROGRESS && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Tournament Progress</span>
            <span>{tournament.stats.completedMatches}/{tournament.stats.totalMatches} matches</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${tournament.stats.totalMatches > 0 ? 
                  (tournament.stats.completedMatches / tournament.stats.totalMatches) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Requirements */}
      {tournament.requirements && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Requirements:</div>
          <div className="flex flex-wrap gap-1">
            {tournament.requirements.minRank && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                Min: {tournament.requirements.minRank}
              </span>
            )}
            {tournament.requirements.maxRank && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                Max: {tournament.requirements.maxRank}
              </span>
            )}
            {tournament.requirements.verifiedAccount && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                Verified
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Link
          href={`/tournaments/${tournament.id}`}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Link>
        
        {tournament.status === TournamentStatus.REGISTRATION && (
          <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Join
          </button>
        )}
        
        {tournament.status === TournamentStatus.IN_PROGRESS && (
          <button className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">
            <Play className="h-4 w-4 mr-2" />
            Watch
          </button>
        )}
      </div>

      {/* Live indicator */}
      {tournament.status === TournamentStatus.IN_PROGRESS && tournament.stats.spectatorPeak > 0 && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>LIVE</span>
          <span>{tournament.stats.spectatorPeak}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function TournamentsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TournamentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TournamentType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState<RankTier>(RankTier.GOLD);

  // Sample tournament data
  useEffect(() => {
    const sampleTournaments: Tournament[] = [
      {
        id: 'weekly_championship',
        name: 'Weekly Championship',
        description: 'Compete for the weekly championship title and exclusive rewards!',
        organizerId: 'admin',
        organizerName: 'Tournament Admin',
        type: TournamentType.SINGLE_ELIMINATION,
        format: TournamentFormat.STANDARD,
        status: TournamentStatus.REGISTRATION,
        maxParticipants: 64,
        minParticipants: 8,
        currentParticipants: 42,
        participants: [],
        waitingList: [],
        registrationStart: Date.now() - 86400000,
        registrationEnd: Date.now() + 3600000,
        tournamentStart: Date.now() + 7200000,
        estimatedEnd: Date.now() + 14400000,
        requirements: {
          minRank: RankTier.SILVER,
          verifiedAccount: true,
          deckFormat: TournamentFormat.STANDARD
        },
        prizePool: {
          totalValue: 5000,
          currency: 'diamonds',
          distribution: [
            { position: 1, reward: 'Champion Title', amount: 2000 },
            { position: 2, reward: 'Runner-up Title', amount: 1500 },
            { position: 3, reward: 'Semi-finalist Title', amount: 1000 }
          ]
        },
        bracket: {
          type: TournamentType.SINGLE_ELIMINATION,
          rounds: [],
          currentRound: 1,
          winnersAdvance: 1
        },
        rules: {
          matchFormat: 'best_of_3',
          timeLimit: 1800,
          allowSpectators: true,
          maxSpectators: 100,
          chatEnabled: true
        },
        stats: {
          totalMatches: 0,
          completedMatches: 0,
          averageMatchTime: 0,
          spectatorPeak: 0,
          totalViewTime: 0
        },
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now(),
        tags: ['weekly', 'championship', 'competitive'],
        isOfficial: true
      },
      {
        id: 'rookie_cup',
        name: 'Rookie Cup',
        description: 'Tournament for new players to get competitive experience!',
        organizerId: 'admin',
        organizerName: 'Tournament Admin',
        type: TournamentType.ROUND_ROBIN,
        format: TournamentFormat.STANDARD,
        status: TournamentStatus.IN_PROGRESS,
        maxParticipants: 16,
        minParticipants: 8,
        currentParticipants: 16,
        participants: [],
        waitingList: [],
        registrationStart: Date.now() - 172800000,
        registrationEnd: Date.now() - 3600000,
        tournamentStart: Date.now() - 1800000,
        estimatedEnd: Date.now() + 3600000,
        requirements: {
          maxRank: RankTier.GOLD,
          verifiedAccount: false,
          deckFormat: TournamentFormat.STANDARD
        },
        prizePool: {
          totalValue: 1000,
          currency: 'diamonds',
          distribution: [
            { position: 1, reward: 'Rookie Champion', amount: 500 },
            { position: 2, reward: 'Rookie Runner-up', amount: 300 },
            { position: 3, reward: 'Rookie Third', amount: 200 }
          ]
        },
        bracket: {
          type: TournamentType.ROUND_ROBIN,
          rounds: [],
          currentRound: 3,
          winnersAdvance: 1
        },
        rules: {
          matchFormat: 'best_of_1',
          timeLimit: 900,
          allowSpectators: true,
          maxSpectators: 50,
          chatEnabled: true
        },
        stats: {
          totalMatches: 60,
          completedMatches: 35,
          averageMatchTime: 720,
          spectatorPeak: 127,
          totalViewTime: 25200
        },
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now(),
        tags: ['rookie', 'beginner', 'learning'],
        isOfficial: true
      }
    ];

    setTournaments(sampleTournaments);
    setFilteredTournaments(sampleTournaments);
  }, []);

  // Filter tournaments
  useEffect(() => {
    let filtered = tournaments;

    if (searchQuery) {
      filtered = filtered.filter(tournament =>
        tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tournament => tournament.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(tournament => tournament.type === typeFilter);
    }

    setFilteredTournaments(filtered);
  }, [tournaments, searchQuery, statusFilter, typeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading Tournaments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🏆 Tournament Arena</h1>
              <p className="text-gray-300">Compete in epic tournaments and climb the ranks</p>
            </div>
            
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-semibold">{user?.username}</div>
                  <div className="text-gray-300 text-sm">Rank: {currentUserRank}</div>
                </div>
                <Link
                  href="/tournaments/create"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Tournament
                </Link>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as TournamentStatus | 'all')}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value={TournamentStatus.REGISTRATION}>Registration Open</option>
                      <option value={TournamentStatus.READY}>Ready to Start</option>
                      <option value={TournamentStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TournamentStatus.FINISHED}>Finished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as TournamentType | 'all')}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="all">All Types</option>
                      <option value={TournamentType.SINGLE_ELIMINATION}>Single Elimination</option>
                      <option value={TournamentType.DOUBLE_ELIMINATION}>Double Elimination</option>
                      <option value={TournamentType.ROUND_ROBIN}>Round Robin</option>
                      <option value={TournamentType.SWISS}>Swiss</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Featured Tournaments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🔥 Featured Tournaments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTournaments
              .filter(t => t.isOfficial)
              .slice(0, 2)
              .map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
          </div>
        </div>

        {/* All Tournaments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">All Tournaments</h2>
            <div className="text-gray-300 text-sm">
              {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {filteredTournaments.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No tournaments found</h3>
              <p className="text-gray-300 mb-4">Try adjusting your filters or check back later for new tournaments.</p>
              {isAuthenticated && (
                <Link
                  href="/tournaments/create"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your Own Tournament
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTournaments.map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </div>

        {/* Tournament Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Active Players</h3>
                <p className="text-gray-300 text-sm">Currently competing</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">1,247</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Weekly Prize Pool</h3>
                <p className="text-gray-300 text-sm">Total rewards</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">25,000 💎</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Live Viewers</h3>
                <p className="text-gray-300 text-sm">Watching tournaments</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">3,891</div>
          </div>
        </div>
      </div>
    </div>
  );
}