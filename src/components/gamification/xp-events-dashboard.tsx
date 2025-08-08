'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Star, 
  Clock, 
  Calendar,
  Trophy,
  Target,
  Gift,
  Play,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

interface XPEvent {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  participantCount: number;
  maxParticipants?: number;
  requirements?: string[];
  rewards: {
    bonusXP: number;
    specialRewards?: string[];
  };
}

interface UserParticipation {
  eventId: string;
  joinedAt: string;
  earnedXP: number;
  isActive: boolean;
  progress: {
    completed: number;
    total: number;
  };
}

interface XPEventsStats {
  totalEventsParticipated: number;
  totalBonusXPEarned: number;
  currentActiveEvents: number;
  completedEvents: number;
}

interface XPEventsDashboardProps {
  className?: string;
}

const XPEventsDashboard: React.FC<XPEventsDashboardProps> = ({ className = '' }) => {
  const [events, setEvents] = useState<XPEvent[]>([]);
  const [userParticipations, setUserParticipations] = useState<UserParticipation[]>([]);
  const [stats, setStats] = useState<XPEventsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningEvent, setJoiningEvent] = useState<string | null>(null);

  useEffect(() => {
    fetchXPEvents();
  }, []);

  const fetchXPEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/xp-events');
      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
        setUserParticipations(data.userParticipations || []);
        setStats(data.stats);
      } else {
        setError(data.error || 'XP event verileri yüklenirken hata oluştu');
      }
    } catch (err) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async (eventId: string) => {
    try {
      setJoiningEvent(eventId);
      const response = await fetch('/api/xp-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchXPEvents(); // Refresh data
      } else {
        alert(data.error || 'Event\'e katılırken hata oluştu');
      }
    } catch (err) {
      alert('Bağlantı hatası');
    } finally {
      setJoiningEvent(null);
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return { expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { expired: false, days, hours, minutes };
  };

  const isUserParticipating = (eventId: string) => {
    return userParticipations.some(p => p.eventId === eventId && p.isActive);
  };

  const getUserParticipation = (eventId: string) => {
    return userParticipations.find(p => p.eventId === eventId);
  };

  const getEventStatusColor = (event: XPEvent) => {
    if (!event.isActive) return 'text-gray-500';
    
    const timeRemaining = getTimeRemaining(event.endDate);
    if (timeRemaining.expired) return 'text-red-500';
    if (timeRemaining.days === 0 && timeRemaining.hours < 2) return 'text-orange-500';
    
    return 'text-green-500';
  };

  const formatTimeRemaining = (timeRemaining: any) => {
    if (timeRemaining.expired) return 'Süresi doldu';
    
    if (timeRemaining.days > 0) {
      return `${timeRemaining.days}g ${timeRemaining.hours}s`;
    } else if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours}s ${timeRemaining.minutes}d`;
    } else {
      return `${timeRemaining.minutes}d`;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-40 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center">
          <Zap className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hata</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchXPEvents}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const activeEvents = events.filter(e => e.isActive);
  const upcomingEvents = events.filter(e => !e.isActive && new Date(e.startDate) > new Date());

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">XP Events</h2>
        <div className="flex items-center space-x-2 text-purple-600">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">Bonus XP Fırsatları</span>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-purple-700">{stats.currentActiveEvents}</div>
            <div className="text-sm text-purple-600">Aktif Event</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-blue-700">{stats.totalEventsParticipated}</div>
            <div className="text-sm text-blue-600">Katıldığım Event</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-700">{stats.totalBonusXPEarned}</div>
            <div className="text-sm text-green-600">Bonus XP</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <Award className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-orange-700">{stats.completedEvents}</div>
            <div className="text-sm text-orange-600">Tamamlanan</div>
          </div>
        </div>
      )}

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktif Events</h3>
          <div className="space-y-4">
            {activeEvents.map((event) => {
              const timeRemaining = getTimeRemaining(event.endDate);
              const isParticipating = isUserParticipating(event.id);
              const participation = getUserParticipation(event.id);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    isParticipating 
                      ? 'border-purple-200 bg-purple-50' 
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-xl font-bold text-gray-900">{event.name}</h4>
                        <div className="flex items-center space-x-1 bg-purple-100 px-2 py-1 rounded-full">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-700">
                            {event.multiplier}x XP
                          </span>
                        </div>
                        {isParticipating && (
                          <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              Katıldınız
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      
                      {/* Event Requirements */}
                      {event.requirements && event.requirements.length > 0 && (
                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            Gereksinimler:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {event.requirements.map((req, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className={`text-sm font-medium ${getEventStatusColor(event)}`}>
                        {timeRemaining.expired ? 'Süresi Doldu' : formatTimeRemaining(timeRemaining)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {event.participantCount} katılımcı
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </div>
                    </div>
                  </div>

                  {/* Progress for participating users */}
                  {isParticipating && participation && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>İlerleme</span>
                        <span>{participation.progress.completed} / {participation.progress.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(participation.progress.completed / participation.progress.total) * 100}%` 
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="text-sm text-purple-600 mt-1">
                        Kazanılan Bonus XP: {participation.earnedXP}
                      </div>
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium">
                          +{event.rewards.bonusXP} Bonus XP
                        </span>
                      </div>
                      {event.rewards.specialRewards && (
                        <div className="flex items-center space-x-1">
                          <Gift className="w-4 h-4 text-pink-600" />
                          <span className="text-sm font-medium">
                            Özel Ödüller
                          </span>
                        </div>
                      )}
                    </div>

                    {!isParticipating && !timeRemaining.expired && (
                      <button
                        onClick={() => joinEvent(event.id)}
                        disabled={joiningEvent === event.id}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        {joiningEvent === event.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Katılıyor...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Katıl</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yaklaşan Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">{event.name}</h4>
                  <div className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded-full">
                    <Zap className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">
                      {event.multiplier}x
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Başlangıç: {new Date(event.startDate).toLocaleDateString('tr-TR')}
                  </span>
                  <span className="text-blue-600 font-medium">
                    +{event.rewards.bonusXP} XP
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeEvents.length === 0 && upcomingEvents.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Şu anda aktif event yok
          </h3>
          <p className="text-gray-600 mb-4">
            Yeni XP multiplier event'leri için takipte kalın!
          </p>
          <button
            onClick={fetchXPEvents}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Yenile
          </button>
        </div>
      )}
    </div>
  );
};

export default XPEventsDashboard;