"use client";

import { useState, useEffect, useCallback } from "react";
import { EventEmitter } from "events";

// Social Data Types
interface Friend {
  id: string;
  username: string;
  avatar: string;
  level: number;
  status: 'online' | 'offline' | 'playing';
  lastSeen: Date;
  mutualFriends: number;
  gamesPlayed: number;
  winRate: number;
  favoriteTopics: string[];
}

interface Challenge {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: Friend;
  toUser: Friend;
  gameMode: string;
  topic: string;
  difficulty: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  results?: {
    winnerId: string;
    scores: { [userId: string]: number };
    duration: number;
    completedAt: Date;
  };
  wager?: {
    type: 'points' | 'diamonds' | 'experience';
    amount: number;
  };
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  createdBy: string;
  members: Friend[];
  maxMembers: number;
  isPrivate: boolean;
  createdAt: Date;
  lastActivity: Date;
  currentSession?: {
    active: boolean;
    participants: string[];
    startedAt: Date;
    gameMode: string;
  };
  stats: {
    totalSessions: number;
    averageScore: number;
    topPerformer: string;
    improvementRate: number;
  };
}

interface SocialAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'social' | 'competitive' | 'collaborative' | 'community';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  requirements: string[];
  rewards: {
    points: number;
    diamonds: number;
    experience: number;
    title?: string;
  };
}

interface SpectatorSession {
  id: string;
  gameId: string;
  players: Friend[];
  viewers: Friend[];
  gameMode: string;
  topic: string;
  startedAt: Date;
  currentState: 'waiting' | 'playing' | 'paused' | 'finished';
  isPublic: boolean;
  chatEnabled: boolean;
  commentary?: {
    enabled: boolean;
    commentator: Friend;
  };
}

interface CommunityPost {
  id: string;
  userId: string;
  user: Friend;
  type: 'achievement' | 'score' | 'challenge' | 'tip' | 'question';
  content: string;
  attachments?: {
    type: 'image' | 'video' | 'score_card';
    url: string;
    metadata?: any;
  }[];
  tags: string[];
  likes: string[];
  comments: CommunityComment[];
  createdAt: Date;
  visibility: 'public' | 'friends' | 'group';
  groupId?: string;
}

interface CommunityComment {
  id: string;
  userId: string;
  user: Friend;
  content: string;
  createdAt: Date;
  likes: string[];
  replies: CommunityComment[];
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  user: Friend;
  score: number;
  gamesPlayed: number;
  winRate: number;
  streak: number;
  change: number; // rank change from previous period
  badge?: string;
}

interface SocialNotification {
  id: string;
  type: 'friend_request' | 'challenge' | 'achievement' | 'group_invite' | 'comment' | 'like';
  fromUserId: string;
  fromUser: Friend;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

class SocialCommunityEngine extends EventEmitter {
  private userId: string;
  private friends: Friend[] = [];
  private challenges: Challenge[] = [];
  private studyGroups: StudyGroup[] = [];
  private achievements: SocialAchievement[] = [];
  private spectatorSessions: SpectatorSession[] = [];
  private communityPosts: CommunityPost[] = [];
  private notifications: SocialNotification[] = [];
  private blockedUsers: Set<string> = new Set();
  private userPreferences: any = {};

  constructor(userId: string) {
    super();
    this.userId = userId;
    this.initializeData();
    this.setupEventListeners();
  }

  private initializeData() {
    // Load data from localStorage or API
    const stored = localStorage.getItem(`social_data_${this.userId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.friends = data.friends || [];
        this.challenges = data.challenges || [];
        this.studyGroups = data.studyGroups || [];
        this.achievements = data.achievements || this.getDefaultAchievements();
        this.notifications = data.notifications || [];
        this.blockedUsers = new Set(data.blockedUsers || []);
        this.userPreferences = data.preferences || this.getDefaultPreferences();
      } catch (error) {
        console.error('Failed to load social data:', error);
        this.achievements = this.getDefaultAchievements();
        this.userPreferences = this.getDefaultPreferences();
      }
    } else {
      this.achievements = this.getDefaultAchievements();
      this.userPreferences = this.getDefaultPreferences();
    }
  }

  private saveData() {
    try {
      const data = {
        friends: this.friends,
        challenges: this.challenges,
        studyGroups: this.studyGroups,
        achievements: this.achievements,
        notifications: this.notifications,
        blockedUsers: Array.from(this.blockedUsers),
        preferences: this.userPreferences,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(`social_data_${this.userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save social data:', error);
    }
  }

  private setupEventListeners() {
    // Simulate real-time updates
    setInterval(() => {
      this.updateFriendStatuses();
      this.checkChallengeExpiry();
      this.updateSpectatorSessions();
    }, 30000); // Update every 30 seconds
  }

  private getDefaultAchievements(): SocialAchievement[] {
    return [
      {
        id: 'first_friend',
        title: 'Making Friends',
        description: 'Add your first friend',
        icon: '👋',
        rarity: 'common',
        category: 'social',
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        requirements: ['Add 1 friend'],
        rewards: { points: 100, diamonds: 5, experience: 50 },
      },
      {
        id: 'challenge_master',
        title: 'Challenge Master',
        description: 'Win 10 friend challenges',
        icon: '⚔️',
        rarity: 'rare',
        category: 'competitive',
        progress: 0,
        maxProgress: 10,
        unlocked: false,
        requirements: ['Win 10 challenges'],
        rewards: { points: 500, diamonds: 25, experience: 200 },
      },
      {
        id: 'study_buddy',
        title: 'Study Buddy',
        description: 'Join 5 study group sessions',
        icon: '📚',
        rarity: 'common',
        category: 'collaborative',
        progress: 0,
        maxProgress: 5,
        unlocked: false,
        requirements: ['Participate in 5 study group sessions'],
        rewards: { points: 300, diamonds: 15, experience: 150 },
      },
      {
        id: 'community_leader',
        title: 'Community Leader',
        description: 'Help 50 other players improve',
        icon: '👑',
        rarity: 'legendary',
        category: 'community',
        progress: 0,
        maxProgress: 50,
        unlocked: false,
        requirements: ['Get 50 helpful votes on tips/comments'],
        rewards: { points: 2000, diamonds: 100, experience: 500, title: 'Community Leader' },
      },
      {
        id: 'spectator_sport',
        title: 'Spectator Sport',
        description: 'Watch 20 live games',
        icon: '👀',
        rarity: 'common',
        category: 'social',
        progress: 0,
        maxProgress: 20,
        unlocked: false,
        requirements: ['Watch 20 live games'],
        rewards: { points: 200, diamonds: 10, experience: 100 },
      },
      {
        id: 'viral_moment',
        title: 'Viral Moment',
        description: 'Get 100 likes on a post',
        icon: '🔥',
        rarity: 'epic',
        category: 'community',
        progress: 0,
        maxProgress: 100,
        unlocked: false,
        requirements: ['Receive 100 likes on a single post'],
        rewards: { points: 1000, diamonds: 50, experience: 300 },
      },
    ];
  }

  private getDefaultPreferences() {
    return {
      notifications: {
        friendRequests: true,
        challenges: true,
        achievements: true,
        groupInvites: true,
        comments: true,
        likes: false,
      },
      privacy: {
        showOnlineStatus: true,
        allowChallenges: true,
        showProfile: 'friends',
        allowSpectators: true,
      },
      social: {
        autoAcceptGroupInvites: false,
        allowDirectMessages: true,
        showPerformanceComparisons: true,
      },
    };
  }

  // Friend Management
  async sendFriendRequest(targetUserId: string): Promise<boolean> {
    if (this.friends.some(f => f.id === targetUserId) || this.blockedUsers.has(targetUserId)) {
      return false;
    }

    // Simulate API call
    const mockFriend: Friend = {
      id: targetUserId,
      username: `User${targetUserId.slice(-4)}`,
      avatar: `https://api.dicebear.com/6.x/adventurer/svg?seed=${targetUserId}`,
      level: Math.floor(Math.random() * 20) + 1,
      status: 'offline',
      lastSeen: new Date(),
      mutualFriends: Math.floor(Math.random() * 5),
      gamesPlayed: Math.floor(Math.random() * 100),
      winRate: Math.random() * 0.8 + 0.2,
      favoriteTopics: ['JavaScript', 'React', 'Node.js'].slice(0, Math.floor(Math.random() * 3) + 1),
    };

    this.addNotification({
      type: 'friend_request',
      fromUserId: targetUserId,
      fromUser: mockFriend,
      title: 'Friend Request Sent',
      message: `Friend request sent to ${mockFriend.username}`,
    });

    this.emit('friend_request_sent', { user: mockFriend });
    return true;
  }

  acceptFriendRequest(requestId: string): boolean {
    const notification = this.notifications.find(n => n.id === requestId && n.type === 'friend_request');
    if (!notification) return false;

    this.friends.push(notification.fromUser);
    this.removeNotification(requestId);
    
    this.updateAchievementProgress('first_friend', 1);
    this.saveData();
    this.emit('friend_added', { friend: notification.fromUser });
    return true;
  }

  removeFriend(friendId: string): boolean {
    const index = this.friends.findIndex(f => f.id === friendId);
    if (index === -1) return false;

    const removedFriend = this.friends[index];
    this.friends.splice(index, 1);
    this.saveData();
    this.emit('friend_removed', { friend: removedFriend });
    return true;
  }

  blockUser(userId: string): boolean {
    this.blockedUsers.add(userId);
    this.removeFriend(userId);
    this.saveData();
    this.emit('user_blocked', { userId });
    return true;
  }

  // Challenge System
  createChallenge(targetUserId: string, gameMode: string, topic: string, difficulty: string, wager?: any): Challenge {
    const targetFriend = this.friends.find(f => f.id === targetUserId);
    if (!targetFriend) {
      throw new Error('Target user is not a friend');
    }

    const challenge: Challenge = {
      id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId: this.userId,
      toUserId: targetUserId,
      fromUser: this.getCurrentUser(),
      toUser: targetFriend,
      gameMode,
      topic,
      difficulty,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      wager,
    };

    this.challenges.push(challenge);
    this.saveData();
    this.emit('challenge_created', { challenge });
    return challenge;
  }

  acceptChallenge(challengeId: string): boolean {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.status !== 'pending') return false;

    challenge.status = 'accepted';
    this.saveData();
    this.emit('challenge_accepted', { challenge });
    return true;
  }

  completeChallenge(challengeId: string, winnerId: string, scores: { [userId: string]: number }, duration: number): boolean {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.status !== 'accepted') return false;

    challenge.status = 'completed';
    challenge.results = {
      winnerId,
      scores,
      duration,
      completedAt: new Date(),
    };

    if (winnerId === this.userId) {
      this.updateAchievementProgress('challenge_master', 1);
    }

    this.saveData();
    this.emit('challenge_completed', { challenge });
    return true;
  }

  // Study Groups
  createStudyGroup(name: string, description: string, topic: string, isPrivate: boolean = false): StudyGroup {
    const studyGroup: StudyGroup = {
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      topic,
      createdBy: this.userId,
      members: [this.getCurrentUser()],
      maxMembers: 10,
      isPrivate,
      createdAt: new Date(),
      lastActivity: new Date(),
      stats: {
        totalSessions: 0,
        averageScore: 0,
        topPerformer: this.userId,
        improvementRate: 0,
      },
    };

    this.studyGroups.push(studyGroup);
    this.saveData();
    this.emit('study_group_created', { group: studyGroup });
    return studyGroup;
  }

  joinStudyGroup(groupId: string): boolean {
    const group = this.studyGroups.find(g => g.id === groupId);
    if (!group || group.members.length >= group.maxMembers) return false;

    if (!group.members.some(m => m.id === this.userId)) {
      group.members.push(this.getCurrentUser());
      group.lastActivity = new Date();
      this.saveData();
      this.emit('study_group_joined', { group });
    }
    return true;
  }

  startGroupSession(groupId: string, gameMode: string): boolean {
    const group = this.studyGroups.find(g => g.id === groupId);
    if (!group || group.currentSession?.active) return false;

    group.currentSession = {
      active: true,
      participants: [this.userId],
      startedAt: new Date(),
      gameMode,
    };

    this.updateAchievementProgress('study_buddy', 1);
    this.saveData();
    this.emit('group_session_started', { group });
    return true;
  }

  // Community Posts & Sharing
  createPost(type: CommunityPost['type'], content: string, attachments?: any[], tags: string[] = []): CommunityPost {
    const post: CommunityPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.userId,
      user: this.getCurrentUser(),
      type,
      content,
      attachments,
      tags,
      likes: [],
      comments: [],
      createdAt: new Date(),
      visibility: 'public',
    };

    this.communityPosts.unshift(post);
    this.saveData();
    this.emit('post_created', { post });
    return post;
  }

  likePost(postId: string): boolean {
    const post = this.communityPosts.find(p => p.id === postId);
    if (!post) return false;

    const likeIndex = post.likes.indexOf(this.userId);
    if (likeIndex === -1) {
      post.likes.push(this.userId);
      this.checkViralMoment(post);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    this.saveData();
    this.emit('post_liked', { post, liked: likeIndex === -1 });
    return true;
  }

  commentOnPost(postId: string, content: string): CommunityComment | null {
    const post = this.communityPosts.find(p => p.id === postId);
    if (!post) return null;

    const comment: CommunityComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.userId,
      user: this.getCurrentUser(),
      content,
      createdAt: new Date(),
      likes: [],
      replies: [],
    };

    post.comments.push(comment);
    this.saveData();
    this.emit('comment_added', { post, comment });
    return comment;
  }

  // Spectator Mode
  startSpectatorSession(gameId: string, players: Friend[], isPublic: boolean = true): SpectatorSession {
    const session: SpectatorSession = {
      id: `spectator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gameId,
      players,
      viewers: [],
      gameMode: 'memory_challenge',
      topic: 'Mixed Topics',
      startedAt: new Date(),
      currentState: 'playing',
      isPublic,
      chatEnabled: true,
    };

    this.spectatorSessions.push(session);
    this.saveData();
    this.emit('spectator_session_started', { session });
    return session;
  }

  joinSpectatorSession(sessionId: string): boolean {
    const session = this.spectatorSessions.find(s => s.id === sessionId);
    if (!session || session.currentState === 'finished') return false;

    if (!session.viewers.some(v => v.id === this.userId)) {
      session.viewers.push(this.getCurrentUser());
      this.updateAchievementProgress('spectator_sport', 1);
      this.saveData();
      this.emit('spectator_joined', { session });
    }
    return true;
  }

  // Leaderboards
  getLeaderboard(timeframe: 'daily' | 'weekly' | 'monthly' | 'alltime', category: string = 'overall'): LeaderboardEntry[] {
    // Simulate leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [];
    
    for (let i = 0; i < 10; i++) {
      const friend = this.friends[i] || {
        id: `user_${i}`,
        username: `Player${i + 1}`,
        avatar: `https://api.dicebear.com/6.x/adventurer/svg?seed=user${i}`,
        level: Math.floor(Math.random() * 50) + 1,
        status: 'offline' as const,
        lastSeen: new Date(),
        mutualFriends: 0,
        gamesPlayed: Math.floor(Math.random() * 200) + 50,
        winRate: Math.random() * 0.6 + 0.4,
        favoriteTopics: ['JavaScript'],
      };

      mockLeaderboard.push({
        rank: i + 1,
        userId: friend.id,
        user: friend,
        score: Math.floor(Math.random() * 5000) + 1000,
        gamesPlayed: friend.gamesPlayed,
        winRate: friend.winRate,
        streak: Math.floor(Math.random() * 20),
        change: Math.floor(Math.random() * 6) - 3, // -3 to +3
        badge: i < 3 ? ['🥇', '🥈', '🥉'][i] : undefined,
      });
    }

    return mockLeaderboard.sort((a, b) => b.score - a.score);
  }

  // Utility Methods
  private getCurrentUser(): Friend {
    return {
      id: this.userId,
      username: `User${this.userId.slice(-4)}`,
      avatar: `https://api.dicebear.com/6.x/adventurer/svg?seed=${this.userId}`,
      level: 15,
      status: 'online',
      lastSeen: new Date(),
      mutualFriends: 0,
      gamesPlayed: 50,
      winRate: 0.75,
      favoriteTopics: ['React', 'TypeScript'],
    };
  }

  private updateAchievementProgress(achievementId: string, progress: number) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    achievement.progress = Math.min(achievement.maxProgress, achievement.progress + progress);
    
    if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      this.emit('achievement_unlocked', { achievement });
      
      this.addNotification({
        type: 'achievement',
        fromUserId: 'system',
        fromUser: this.getCurrentUser(),
        title: 'Achievement Unlocked!',
        message: `You've unlocked "${achievement.title}"`,
        data: { achievement },
      });
    }
  }

  private checkViralMoment(post: CommunityPost) {
    if (post.likes.length >= 100) {
      this.updateAchievementProgress('viral_moment', post.likes.length);
    }
  }

  private addNotification(notification: Omit<SocialNotification, 'id' | 'read' | 'createdAt'>) {
    const fullNotification: SocialNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date(),
    };

    this.notifications.unshift(fullNotification);
    this.emit('notification_added', { notification: fullNotification });
  }

  private removeNotification(notificationId: string) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveData();
    }
  }

  private updateFriendStatuses() {
    // Simulate friend status updates
    this.friends.forEach(friend => {
      const randomStatus = Math.random();
      if (randomStatus < 0.7) friend.status = 'online';
      else if (randomStatus < 0.9) friend.status = 'playing';
      else friend.status = 'offline';
    });
    this.emit('friend_statuses_updated', { friends: this.friends });
  }

  private checkChallengeExpiry() {
    const now = new Date();
    this.challenges.forEach(challenge => {
      if (challenge.status === 'pending' && challenge.expiresAt < now) {
        challenge.status = 'expired';
        this.emit('challenge_expired', { challenge });
      }
    });
  }

  private updateSpectatorSessions() {
    // Clean up finished sessions
    this.spectatorSessions = this.spectatorSessions.filter(session => {
      const isOld = Date.now() - session.startedAt.getTime() > 2 * 60 * 60 * 1000; // 2 hours
      return !isOld || session.currentState !== 'finished';
    });
  }

  // Public API Methods
  getFriends(): Friend[] {
    return this.friends.filter(f => !this.blockedUsers.has(f.id));
  }

  getChallenges(): Challenge[] {
    return this.challenges;
  }

  getStudyGroups(): StudyGroup[] {
    return this.studyGroups;
  }

  getAchievements(): SocialAchievement[] {
    return this.achievements;
  }

  getNotifications(): SocialNotification[] {
    return this.notifications;
  }

  getCommunityPosts(): CommunityPost[] {
    return this.communityPosts;
  }

  getSpectatorSessions(): SpectatorSession[] {
    return this.spectatorSessions.filter(s => s.isPublic || s.viewers.some(v => v.id === this.userId));
  }

  markNotificationRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveData();
      return true;
    }
    return false;
  }

  updatePreferences(preferences: any): void {
    this.userPreferences = { ...this.userPreferences, ...preferences };
    this.saveData();
    this.emit('preferences_updated', { preferences: this.userPreferences });
  }

  getPreferences(): any {
    return this.userPreferences;
  }

  searchUsers(query: string): Friend[] {
    // Simulate user search
    const mockUsers: Friend[] = [];
    for (let i = 0; i < 5; i++) {
      mockUsers.push({
        id: `search_${i}_${Date.now()}`,
        username: `${query}User${i}`,
        avatar: `https://api.dicebear.com/6.x/adventurer/svg?seed=${query}${i}`,
        level: Math.floor(Math.random() * 30) + 1,
        status: 'offline',
        lastSeen: new Date(),
        mutualFriends: Math.floor(Math.random() * 10),
        gamesPlayed: Math.floor(Math.random() * 100),
        winRate: Math.random() * 0.8 + 0.2,
        favoriteTopics: ['JavaScript', 'React'].slice(0, Math.floor(Math.random() * 2) + 1),
      });
    }
    return mockUsers;
  }

  cleanup(): void {
    this.saveData();
    this.removeAllListeners();
  }
}

export default SocialCommunityEngine;
export type {
  Friend,
  Challenge,
  StudyGroup,
  SocialAchievement,
  SpectatorSession,
  CommunityPost,
  CommunityComment,
  LeaderboardEntry,
  SocialNotification,
};