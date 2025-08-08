"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Sword,
  Trophy,
  BookOpen,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Settings,
  Search,
  Filter,
  Bell,
  Crown,
  Star,
  Flame,
  Shield,
  Zap,
  Calendar,
  Clock,
  Target,
  Award,
  TrendingUp,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Send,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  X,
  Check,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Download,
  Upload,
} from "lucide-react";

import SocialCommunityEngine, {
  Friend,
  Challenge,
  StudyGroup,
  SocialAchievement,
  SpectatorSession,
  CommunityPost,
  LeaderboardEntry,
  SocialNotification,
} from "./SocialCommunityEngine";

interface SocialCommunityUIProps {
  userId: string;
  onChallengeAccepted?: (challenge: Challenge) => void;
  onGameSpectate?: (session: SpectatorSession) => void;
  showCompactView?: boolean;
}

const SocialCommunityUI: React.FC<SocialCommunityUIProps> = ({
  userId,
  onChallengeAccepted,
  onGameSpectate,
  showCompactView = false,
}) => {
  // Core State
  const [socialEngine] = useState(() => new SocialCommunityEngine(userId));
  const [activeTab, setActiveTab] = useState<'friends' | 'challenges' | 'groups' | 'leaderboard' | 'community' | 'spectate'>('friends');
  
  // Data State
  const [friends, setFriends] = useState<Friend[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [achievements, setAchievements] = useState<SocialAchievement[]>([]);
  const [spectatorSessions, setSpectatorSessions] = useState<SpectatorSession[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  
  // Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTopic, setNewGroupTopic] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // Load initial data
  const refreshData = useCallback(() => {
    setFriends(socialEngine.getFriends());
    setChallenges(socialEngine.getChallenges());
    setStudyGroups(socialEngine.getStudyGroups());
    setAchievements(socialEngine.getAchievements());
    setSpectatorSessions(socialEngine.getSpectatorSessions());
    setCommunityPosts(socialEngine.getCommunityPosts());
    setNotifications(socialEngine.getNotifications());
    setLeaderboard(socialEngine.getLeaderboard('weekly'));
  }, [socialEngine]);

  useEffect(() => {
    refreshData();

    // Setup event listeners
    const handleFriendAdded = () => refreshData();
    const handleChallengeCreated = () => refreshData();
    const handleAchievementUnlocked = (data: any) => {
      // Show achievement notification
      console.log('Achievement unlocked:', data.achievement);
    };

    socialEngine.on('friend_added', handleFriendAdded);
    socialEngine.on('challenge_created', handleChallengeCreated);
    socialEngine.on('achievement_unlocked', handleAchievementUnlocked);

    return () => {
      socialEngine.off('friend_added', handleFriendAdded);
      socialEngine.off('challenge_created', handleChallengeCreated);
      socialEngine.off('achievement_unlocked', handleAchievementUnlocked);
    };
  }, [socialEngine, refreshData]);

  // Action Handlers
  const handleSendFriendRequest = async (targetUserId: string) => {
    await socialEngine.sendFriendRequest(targetUserId);
    refreshData();
  };

  const handleAcceptChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      socialEngine.acceptChallenge(challengeId);
      onChallengeAccepted?.(challenge);
      refreshData();
    }
  };

  const handleCreateChallenge = (friendId: string) => {
    socialEngine.createChallenge(friendId, 'memory_game', 'Mixed Topics', 'medium');
    refreshData();
  };

  const handleJoinSpectatorSession = (sessionId: string) => {
    const session = spectatorSessions.find(s => s.id === sessionId);
    if (session) {
      socialEngine.joinSpectatorSession(sessionId);
      onGameSpectate?.(session);
      refreshData();
    }
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      socialEngine.createPost('tip', newPostContent, [], ['memory-game', 'learning']);
      setNewPostContent('');
      setShowCreatePost(false);
      refreshData();
    }
  };

  const handleLikePost = (postId: string) => {
    socialEngine.likePost(postId);
    refreshData();
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (showCompactView) {
    // Compact view for integration
    return (
      <div className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{friends.length}</div>
            <div className="text-xs text-gray-600">Friends</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {challenges.filter(c => c.status === 'pending' && c.toUserId === userId).length}
            </div>
            <div className="text-xs text-gray-600">Challenges</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {achievements.filter(a => a.unlocked).length}
            </div>
            <div className="text-xs text-gray-600">Achievements</div>
          </div>
        </div>

        {/* Active Challenges */}
        {challenges.filter(c => c.status === 'pending' && c.toUserId === userId).length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <Sword className="h-4 w-4" />
              Challenge Waiting!
            </h4>
            {challenges
              .filter(c => c.status === 'pending' && c.toUserId === userId)
              .slice(0, 1)
              .map(challenge => (
                <div key={challenge.id} className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="text-orange-700 font-medium">{challenge.fromUser.username}</p>
                    <p className="text-orange-600 text-xs">{challenge.topic} • {challenge.difficulty}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptChallenge(challenge.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => socialEngine.acceptChallenge(challenge.id)}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Recent Achievements */}
        {achievements.filter(a => a.unlocked).length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Recent Achievement
            </h4>
            {achievements
              .filter(a => a.unlocked)
              .slice(0, 1)
              .map(achievement => (
                <div key={achievement.id} className="text-sm">
                  <p className="text-amber-700 font-medium">{achievement.title}</p>
                  <p className="text-amber-600 text-xs">{achievement.description}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Social Hub</h2>
              <p className="text-indigo-100">Connect, compete, and learn together</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{friends.length}</div>
            <div className="text-indigo-100">Friends</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {challenges.filter(c => c.status === 'completed' && c.results?.winnerId === userId).length}
            </div>
            <div className="text-indigo-100">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</div>
            <div className="text-indigo-100">Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{communityPosts.length}</div>
            <div className="text-indigo-100">Posts</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {[
          { id: 'friends', label: 'Friends', icon: Users },
          { id: 'challenges', label: 'Challenges', icon: Sword },
          { id: 'groups', label: 'Study Groups', icon: BookOpen },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { id: 'community', label: 'Community', icon: MessageCircle },
          { id: 'spectate', label: 'Spectate', icon: Eye },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content Based on Active Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'friends' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Add Friends */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Friends</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSendFriendRequest(searchQuery)}
                  disabled={!searchQuery.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Friends List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Friends ({friends.length})</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {friends.map((friend) => (
                  <div key={friend.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={friend.avatar}
                            alt={friend.username}
                            className="h-12 w-12 rounded-full"
                          />
                          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                            friend.status === 'online' ? 'bg-green-500' :
                            friend.status === 'playing' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{friend.username}</h4>
                          <p className="text-sm text-gray-600">
                            Level {friend.level} • {Math.round(friend.winRate * 100)}% win rate
                          </p>
                          <p className="text-xs text-gray-500">
                            {friend.gamesPlayed} games • {friend.favoriteTopics.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCreateChallenge(friend.id)}
                          className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 text-sm flex items-center space-x-1"
                        >
                          <Sword className="h-3 w-3" />
                          <span>Challenge</span>
                        </button>
                        <button
                          onClick={() => setSelectedFriend(friend)}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'challenges' && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Pending Challenges */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Pending Challenges</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {challenges
                  .filter(c => c.status === 'pending')
                  .map((challenge) => (
                    <div key={challenge.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={challenge.fromUserId === userId ? challenge.toUser.avatar : challenge.fromUser.avatar}
                            alt="User"
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {challenge.fromUserId === userId ? `Challenge to ${challenge.toUser.username}` : `Challenge from ${challenge.fromUser.username}`}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {challenge.topic} • {challenge.difficulty} • {challenge.gameMode}
                            </p>
                            <p className="text-xs text-gray-500">
                              Expires {challenge.expiresAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {challenge.toUserId === userId && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAcceptChallenge(challenge.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Accept
                            </button>
                            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Challenge History */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Recent Challenges</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {challenges
                  .filter(c => c.status === 'completed')
                  .slice(0, 5)
                  .map((challenge) => (
                    <div key={challenge.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex -space-x-2">
                            <img src={challenge.fromUser.avatar} alt="" className="h-8 w-8 rounded-full border-2 border-white" />
                            <img src={challenge.toUser.avatar} alt="" className="h-8 w-8 rounded-full border-2 border-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {challenge.fromUser.username} vs {challenge.toUser.username}
                            </h4>
                            <p className="text-sm text-gray-600">{challenge.topic} • {challenge.difficulty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${challenge.results?.winnerId === userId ? 'text-green-600' : 'text-red-600'}`}>
                            {challenge.results?.winnerId === userId ? 'WIN' : 'LOSS'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {challenge.results?.scores[userId] || 0} pts
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Leaderboard */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Weekly Leaderboard</h3>
                  <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>All Time</option>
                  </select>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <div key={entry.userId} className={`p-4 ${entry.userId === userId ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <div className="text-center w-8">
                        {entry.badge ? (
                          <span className="text-2xl">{entry.badge}</span>
                        ) : (
                          <span className="font-bold text-gray-600">#{entry.rank}</span>
                        )}
                      </div>
                      <img src={entry.user.avatar} alt="" className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{entry.user.username}</h4>
                        <p className="text-sm text-gray-600">
                          {entry.gamesPlayed} games • {Math.round(entry.winRate * 100)}% win rate
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{entry.score.toLocaleString()}</div>
                        <div className={`text-sm flex items-center ${
                          entry.change > 0 ? 'text-green-600' : entry.change < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {entry.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                           entry.change < 0 ? <TrendingUp className="h-3 w-3 mr-1 rotate-180" /> : null}
                          {entry.change !== 0 && Math.abs(entry.change)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'community' && (
          <motion.div
            key="community"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Create Post */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start space-x-4">
                <img src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${userId}`} alt="" className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <textarea
                    placeholder="Share a tip, ask a question, or celebrate an achievement..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-3">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Posts */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <img src={post.user.avatar} alt="" className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{post.user.username}</h4>
                        <span className="text-sm text-gray-500">
                          {post.createdAt.toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.type === 'achievement' ? 'bg-yellow-100 text-yellow-800' :
                          post.type === 'tip' ? 'bg-blue-100 text-blue-800' :
                          post.type === 'question' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center space-x-1 text-sm ${
                            post.likes.includes(userId) ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${post.likes.includes(userId) ? 'fill-current' : ''}`} />
                          <span>{post.likes.length}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments.length}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600">
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'spectate' && (
          <motion.div
            key="spectate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Live Games */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Live Games</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {spectatorSessions
                  .filter(s => s.currentState === 'playing')
                  .map((session) => (
                    <div key={session.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex -space-x-2">
                            {session.players.map((player, index) => (
                              <img
                                key={player.id}
                                src={player.avatar}
                                alt=""
                                className="h-8 w-8 rounded-full border-2 border-white"
                              />
                            ))}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {session.players.map(p => p.username).join(' vs ')}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {session.topic} • {session.viewers.length} viewers
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-red-600 font-medium">LIVE</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleJoinSpectatorSession(session.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Watch</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-4 top-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <img src={notification.fromUser.avatar} alt="" className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialCommunityUI;