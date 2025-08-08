"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  Info,
  AlertTriangle,
  Trophy,
  Gift,
  Star,
  Zap,
  Crown,
  Diamond,
  TrendingUp,
} from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

interface NotificationProps {
  notification: {
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
  };
  onRemove: (id: string) => void;
}

function NotificationItem({ notification, onRemove }: NotificationProps) {
  const getIcon = () => {
    if (notification.icon) {
      return <span className="text-xl">{notification.icon}</span>;
    }
    
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-6 w-6" />;
      case 'info':
        return <Info className="h-6 w-6" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6" />;
      case 'achievement':
        return <Trophy className="h-6 w-6" />;
      case 'reward':
        return <Gift className="h-6 w-6" />;
      default:
        return <Info className="h-6 w-6" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'info':
        return 'from-blue-500 to-indigo-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'achievement':
        return 'from-purple-500 to-pink-500';
      case 'reward':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-200';
      case 'info':
        return 'border-blue-200';
      case 'warning':
        return 'border-yellow-200';
      case 'achievement':
        return 'border-purple-200';
      case 'reward':
        return 'border-yellow-200';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-xl border-2 ${getBorderColor()} bg-white shadow-xl backdrop-blur-sm`}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getBackgroundColor()} opacity-10`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
      
      <div className="relative p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={`flex-shrink-0 rounded-lg bg-gradient-to-r ${getBackgroundColor()} p-2 text-white shadow-md`}>
            {getIcon()}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 truncate">{notification.title}</h4>
              <button
                onClick={() => onRemove(notification.id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            
            {/* Action button */}
            {notification.action && (
              <button
                onClick={() => {
                  notification.action!.onClick();
                  onRemove(notification.id);
                }}
                className={`mt-3 px-3 py-1 bg-gradient-to-r ${getBackgroundColor()} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md`}
              >
                {notification.action.label}
              </button>
            )}
            
            {/* Timestamp */}
            <div className="text-xs text-gray-400 mt-2">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Achievement special effects */}
        {notification.type === 'achievement' && (
          <>
            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              >
                <Star className="h-3 w-3 text-yellow-400" />
              </motion.div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function NotificationSystem() {
  const { notifications, removeNotification } = useProgress();

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-full">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} className="mb-3">
            <NotificationItem
              notification={notification}
              onRemove={removeNotification}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Progress Tracker Component - Shows real-time progress updates
export function ProgressTracker() {
  const { progressUpdates, markProgressAsRead, clearAllProgress } = useProgress();
  const [isOpen, setIsOpen] = React.useState(false);

  const unreadCount = progressUpdates.filter(update => update.isNew).length;

  if (progressUpdates.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Progress Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-xl hover:from-blue-600 hover:to-purple-600 transition-all"
      >
        <TrendingUp className="h-6 w-6" />
        
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </motion.button>

      {/* Progress Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 backdrop-blur-sm"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Progress Updates</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearAllProgress}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Items */}
            <div className="p-4 space-y-3">
              {progressUpdates.map((update) => (
                <motion.div
                  key={update.id}
                  layout
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    update.isNew 
                      ? 'border-blue-200 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  onClick={() => markProgressAsRead(update.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${
                      update.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      update.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      update.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                      'bg-gradient-to-r from-gray-500 to-slate-500'
                    }`}>
                      {update.icon || (
                        update.type === 'achievement' ? '🏆' :
                        update.type === 'level_up' ? '⭐' :
                        update.type === 'challenge' ? '🎯' :
                        update.type === 'reward' ? '🎁' : '📈'
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {update.title}
                        </h4>
                        {update.isNew && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 mt-1">{update.description}</p>
                      
                      {update.progress && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{update.progress.current}/{update.progress.target}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${update.progress.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {update.reward && (
                        <div className="flex items-center space-x-2 mt-2">
                          {update.reward.diamonds && (
                            <div className="flex items-center space-x-1 text-xs text-yellow-600">
                              <Diamond className="h-3 w-3" />
                              <span>{update.reward.diamonds}</span>
                            </div>
                          )}
                          {update.reward.xp && (
                            <div className="flex items-center space-x-1 text-xs text-blue-600">
                              <Star className="h-3 w-3" />
                              <span>{update.reward.xp} XP</span>
                            </div>
                          )}
                          {update.reward.cardPack && (
                            <div className="flex items-center space-x-1 text-xs text-purple-600">
                              <Gift className="h-3 w-3" />
                              <span>Card Pack</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(update.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}