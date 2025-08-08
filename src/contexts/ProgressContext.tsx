"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProgressUpdate {
  id: string;
  type: 'achievement' | 'challenge' | 'level_up' | 'reward' | 'streak' | 'quiz_completion' | 'code_arena_completion';
  title: string;
  description: string;
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
  reward?: {
    diamonds?: number;
    xp?: number;
    cardPack?: string;
    special?: string;
  };
  timestamp: string;
  isNew: boolean;
  category?: string;
  rarity?: string;
  icon?: string;
}

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'achievement' | 'reward';
  title: string;
  message: string;
  icon?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: string;
}

interface ProgressContextType {
  progressUpdates: ProgressUpdate[];
  notifications: Notification[];
  isTracking: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markProgressAsRead: (id: string) => void;
  clearAllProgress: () => void;
  refreshProgress: () => void;
  updateUserProgress: (activityType: string, data: any) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Fetch progress updates
  const fetchProgressUpdates = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/progress/updates');
      if (response.ok) {
        const data = await response.json();
        setProgressUpdates(data.updates || []);
      }
    } catch (error) {
      console.error('Failed to fetch progress updates:', error);
    }
  }, [user]);

  // Real-time progress polling
  useEffect(() => {
    if (!user) return;

    setIsTracking(true);
    
    // Initial fetch
    fetchProgressUpdates();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchProgressUpdates();
    }, 30000);

    return () => {
      clearInterval(interval);
      setIsTracking(false);
    };
  }, [user, fetchProgressUpdates]);

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 most recent

    // Auto remove after duration
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, duration);
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Mark progress as read
  const markProgressAsRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/progress/updates/${id}/read`, {
        method: 'POST',
      });
      
      setProgressUpdates(prev => 
        prev.map(update => 
          update.id === id ? { ...update, isNew: false } : update
        )
      );
    } catch (error) {
      console.error('Failed to mark progress as read:', error);
    }
  }, []);

  // Clear all progress
  const clearAllProgress = useCallback(async () => {
    try {
      await fetch('/api/progress/updates/clear', {
        method: 'POST',
      });
      
      setProgressUpdates([]);
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }, []);

  // Refresh progress
  const refreshProgress = useCallback(() => {
    fetchProgressUpdates();
  }, [fetchProgressUpdates]);

  // Update user progress for specific activity
  const updateUserProgress = useCallback(async (activityType: string, data: any) => {
    if (!user) return;

    try {
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityType,
          data,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add notifications for any new achievements or progress
        if (result.notifications) {
          result.notifications.forEach((notification: any) => {
            addNotification({
              type: notification.type,
              title: notification.title,
              message: notification.message,
              icon: notification.icon,
              duration: notification.duration,
            });
          });
        }

        // Refresh progress updates
        await fetchProgressUpdates();
      }
    } catch (error) {
      console.error('Failed to update user progress:', error);
    }
  }, [user, addNotification, fetchProgressUpdates]);

  // Show achievement notification
  const showAchievementNotification = useCallback((achievement: any) => {
    addNotification({
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: `You earned "${achievement.title}"`,
      icon: achievement.icon || '🏆',
      duration: 8000,
      action: {
        label: 'View',
        onClick: () => window.location.href = '/achievements'
      }
    });
  }, [addNotification]);

  // Show level up notification
  const showLevelUpNotification = useCallback((level: number, rewards: any) => {
    addNotification({
      type: 'success',
      title: 'Level Up!',
      message: `Congratulations! You reached level ${level}`,
      icon: '⭐',
      duration: 8000,
      action: {
        label: 'Claim Rewards',
        onClick: () => {
          // Handle level up rewards
        }
      }
    });
  }, [addNotification]);

  // Listen for specific events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAchievementUnlocked = (event: CustomEvent) => {
      showAchievementNotification(event.detail);
    };

    const handleLevelUp = (event: CustomEvent) => {
      showLevelUpNotification(event.detail.level, event.detail.rewards);
    };

    const handleProgressUpdate = (event: CustomEvent) => {
      addNotification({
        type: 'info',
        title: 'Progress Update',
        message: event.detail.message,
        icon: event.detail.icon || '📈',
        duration: 4000,
      });
    };

    window.addEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
    window.addEventListener('level-up', handleLevelUp as EventListener);
    window.addEventListener('progress-update', handleProgressUpdate as EventListener);

    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
      window.removeEventListener('level-up', handleLevelUp as EventListener);
      window.removeEventListener('progress-update', handleProgressUpdate as EventListener);
    };
  }, [showAchievementNotification, showLevelUpNotification, addNotification]);

  const value: ProgressContextType = {
    progressUpdates,
    notifications,
    isTracking,
    addNotification,
    removeNotification,
    markProgressAsRead,
    clearAllProgress,
    refreshProgress,
    updateUserProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

// Helper functions for triggering events
export const triggerAchievementUnlocked = (achievement: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('achievement-unlocked', {
      detail: achievement
    }));
  }
};

export const triggerLevelUp = (level: number, rewards: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('level-up', {
      detail: { level, rewards }
    }));
  }
};

export const triggerProgressUpdate = (message: string, icon?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('progress-update', {
      detail: { message, icon }
    }));
  }
};