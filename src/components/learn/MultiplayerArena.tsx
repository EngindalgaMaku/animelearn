"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Trophy,
  Zap,
  Crown,
  Star,
  Sword,
  Shield,
  Timer,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Medal,
  Target,
  Flame,
  Brain,
  Gamepad2,
  Wifi,
  WifiOff,
  UserPlus,
  Search,
  Filter,
  ChevronRight,
  Clock,
  DollarSign,
  Award,
} from "lucide-react";

import MultiplayerEngine, {
  Player,
  GameRoom,
  Tournament,
  LeaderboardEntry,
  GameEvent,
} from "./MultiplayerEngine";

interface MultiplayerArenaProps {
  onGameStart?: (gameRoom: GameRoom) => void;
  userId?: string;
  username?: string;
}

const MultiplayerArena: React.FC<MultiplayerArenaProps> = ({
  onGameStart,
  userId = "player_1",
  username = "Anonymous",
}) => {
  // Multiplayer Engine
  const [multiplayerEngine] = useState(() => new MultiplayerEngine());
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);

  // UI State
  const [activeTab, setActiveTab] = useState<'pvp' | 'tournaments' | 'leaderboard' | 'spectate'>('pvp');
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [matchmakingTime, setMatchmakingTime] = useState(0);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  // Tournament State
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showTournamentDetails, setShowTournamentDetails] = useState(false);

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'weekly' | 'tournament'>('global');

  // Spectator State
  const [spectatorRooms, setSpectatorRooms] = useState<GameRoom[]>([]);
  const [isSpectating, setIsSpectating] = useState(false);

  // Refs
  const matchmakingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize multiplayer engine
  useEffect(() => {
    const initEngine = async () => {
      try {
        const player = await multiplayerEngine.authenticatePlayer(username);
        setCurrentPlayer(player);
        setIsConnected(true);

        // Load initial data
        const [tournamentsList, leaderboardData] = await Promise.all([
          multiplayerEngine.getTournaments('all'),
          multiplayerEngine.getLeaderboard('global', 50),
        ]);

        setTournaments(tournamentsList);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Failed to initialize multiplayer engine:', error);
      }
    };

    initEngine();

    // Setup event listeners
    const handleMatchFound = (room: GameRoom) => {
      setCurrentRoom(room);
      setIsMatchmaking(false);
      if (matchmakingIntervalRef.current) {
        clearInterval(matchmakingIntervalRef.current);
        matchmakingIntervalRef.current = null;
      }
      setMatchmakingTime(0);
      onGameStart?.(room);
    };

    const handleRoomJoined = (room: GameRoom) => {
      setCurrentRoom(room);
    };

    const handlePlayerAuthenticated = (player: Player) => {
      setCurrentPlayer(player);
      setIsConnected(true);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setCurrentRoom(null);
    };

    multiplayerEngine.on('match_found', handleMatchFound);
    multiplayerEngine.on('room_joined', handleRoomJoined);
    multiplayerEngine.on('player_authenticated', handlePlayerAuthenticated);
    multiplayerEngine.on('disconnected', handleDisconnected);

    return () => {
      multiplayerEngine.off('match_found', handleMatchFound);
      multiplayerEngine.off('room_joined', handleRoomJoined);
      multiplayerEngine.off('player_authenticated', handlePlayerAuthenticated);
      multiplayerEngine.off('disconnected', handleDisconnected);
      
      if (matchmakingIntervalRef.current) {
        clearInterval(matchmakingIntervalRef.current);
      }
    };
  }, [multiplayerEngine, username, onGameStart]);

  // Matchmaking timer
  useEffect(() => {
    if (isMatchmaking) {
      matchmakingIntervalRef.current = setInterval(() => {
        setMatchmakingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (matchmakingIntervalRef.current) {
        clearInterval(matchmakingIntervalRef.current);
        matchmakingIntervalRef.current = null;
      }
      setMatchmakingTime(0);
    }

    return () => {
      if (matchmakingIntervalRef.current) {
        clearInterval(matchmakingIntervalRef.current);
      }
    };
  }, [isMatchmaking]);

  const startMatchmaking = async (difficulty: string = 'any') => {
    setIsMatchmaking(true);
    try {
      await multiplayerEngine.findMatch(difficulty);
    } catch (error) {
      console.error('Matchmaking failed:', error);
      setIsMatchmaking(false);
    }
  };

  const cancelMatchmaking = () => {
    setIsMatchmaking(false);
  };

  const createRoom = async () => {
    try {
      const room = await multiplayerEngine.createRoom({
        timeLimit: 300,
        difficulty: 'medium',
        powerUpsEnabled: true,
      });
      setCurrentRoom(room);
      setShowCreateRoom(false);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      await multiplayerEngine.joinRoom(roomId);
      setShowJoinRoom(false);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const joinTournament = async (tournamentId: string) => {
    try {
      const success = await multiplayerEngine.joinTournament(tournamentId);
      if (success) {
        // Refresh tournaments
        const updatedTournaments = await multiplayerEngine.getTournaments('all');
        setTournaments(updatedTournaments);
      }
    } catch (error) {
      console.error('Failed to join tournament:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-600" />;
    return <span className="text-lg font-bold text-gray-600">{rank}</span>;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Gamepad2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Multiplayer Arena</h1>
              <p className="text-purple-100">Battle players worldwide in real-time memory challenges</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="h-5 w-5 text-green-300" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-300" />
                )}
                <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              {currentPlayer && (
                <div className="text-sm text-purple-200">
                  {currentPlayer.username} • Level {currentPlayer.level} • Rating: {currentPlayer.rating}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'pvp', label: 'PvP Battles', icon: Sword },
          { id: 'tournaments', label: 'Tournaments', icon: Trophy },
          { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
          { id: 'spectate', label: 'Spectate', icon: Eye },
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

      {/* PvP Battles Tab */}
      {activeTab === 'pvp' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Matchmaking Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Match</h2>
            
            {!isMatchmaking ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  onClick={() => startMatchmaking('easy')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all"
                >
                  <Shield className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="text-lg font-bold text-green-800">Casual</h3>
                  <p className="text-sm text-green-600">Relaxed gameplay for beginners</p>
                </motion.button>
                
                <motion.button
                  onClick={() => startMatchmaking('medium')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all"
                >
                  <Target className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="text-lg font-bold text-blue-800">Ranked</h3>
                  <p className="text-sm text-blue-600">Competitive matches with rating</p>
                </motion.button>
                
                <motion.button
                  onClick={() => startMatchmaking('hard')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl border-2 border-red-200 hover:border-red-400 transition-all"
                >
                  <Flame className="h-8 w-8 text-red-600 mb-3" />
                  <h3 className="text-lg font-bold text-red-800">Pro</h3>
                  <p className="text-sm text-red-600">Elite players only</p>
                </motion.button>
              </div>
            ) : (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <Search className="h-12 w-12 text-purple-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Finding Match</h3>
                <p className="text-gray-600 mb-4">
                  Searching for opponents... {formatTime(matchmakingTime)}
                </p>
                <button
                  onClick={cancelMatchmaking}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Cancel Search
                </button>
              </div>
            )}
          </div>

          {/* Room Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Private Room</h3>
              <p className="text-gray-600 mb-4">
                Set up a custom game and invite friends to join your memory challenge.
              </p>
              <button
                onClick={() => setShowCreateRoom(true)}
                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="h-5 w-5" />
                <span>Create Room</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Join Room</h3>
              <p className="text-gray-600 mb-4">
                Enter a room code to join an existing game with specific players.
              </p>
              <button
                onClick={() => setShowJoinRoom(true)}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Gamepad2 className="h-5 w-5" />
                <span>Join Room</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tournaments Tab */}
      {activeTab === 'tournaments' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <motion.div
                key={tournament.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 cursor-pointer"
                onClick={() => {
                  setSelectedTournament(tournament);
                  setShowTournamentDetails(true);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      tournament.status === 'registration' ? 'bg-blue-100' :
                      tournament.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Trophy className={`h-6 w-6 ${
                        tournament.status === 'registration' ? 'text-blue-600' :
                        tournament.status === 'active' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{tournament.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tournament.status === 'registration' ? 'bg-blue-100 text-blue-800' :
                        tournament.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tournament.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <p className="text-gray-600 text-sm mb-4">{tournament.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{tournament.currentParticipants.length}/{tournament.maxParticipants} players</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>Prize: {tournament.prizePool.first} coins</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Starts: {formatDate(tournament.startDate)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(tournament.currentParticipants.length / tournament.maxParticipants) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Leaderboard Type Selector */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Rankings</h2>
              <div className="flex space-x-2">
                {[
                  { id: 'global', label: 'Global' },
                  { id: 'weekly', label: 'Weekly' },
                  { id: 'tournament', label: 'Tournament' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setLeaderboardType(id as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      leaderboardType === id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {leaderboard.slice(0, 10).map((entry, index) => (
                <motion.div
                  key={entry.player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{entry.player.username}</div>
                      <div className="text-sm text-gray-600">
                        Level {entry.player.level} • {entry.gamesPlayed} games played
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg text-purple-600">{entry.score.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">
                      {Math.round(entry.winRate * 100)}% win rate
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Spectate Tab */}
      {activeTab === 'spectate' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Games</h2>
            <div className="text-center py-12">
              <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Live Games</h3>
              <p className="text-gray-500">
                Check back later to watch exciting matches between top players!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tournament Details Modal */}
      <AnimatePresence>
        {showTournamentDetails && selectedTournament && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTournamentDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTournament.name}</h2>
                  <p className="text-gray-600">{selectedTournament.description}</p>
                </div>
                <button
                  onClick={() => setShowTournamentDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Tournament Info</h3>
                  <div className="space-y-2 text-sm">
                    <div>Type: {selectedTournament.type}</div>
                    <div>Entry Fee: {selectedTournament.entryFee} coins</div>
                    <div>Max Players: {selectedTournament.maxParticipants}</div>
                    <div>Start: {formatDate(selectedTournament.startDate)}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Prize Pool</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span>1st: {selectedTournament.prizePool.first} coins</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Medal className="h-4 w-4 text-gray-400" />
                      <span>2nd: {selectedTournament.prizePool.second} coins</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-orange-600" />
                      <span>3rd: {selectedTournament.prizePool.third} coins</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTournament.status === 'registration' && (
                <button
                  onClick={() => joinTournament(selectedTournament.id)}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                >
                  Join Tournament ({selectedTournament.entryFee} coins)
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiplayerArena;