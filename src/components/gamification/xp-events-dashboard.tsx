"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Award,
} from "lucide-react";

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

const XPEventsDashboard: React.FC<XPEventsDashboardProps> = ({
  className = "",
}) => {
  const [events, setEvents] = useState<XPEvent[]>([]);
  const [userParticipations, setUserParticipations] = useState<
    UserParticipation[]
  >([]);
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
      const response = await fetch("/api/xp-events");
      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
        setUserParticipations(data.userParticipations || []);
        setStats(data.stats);
      } else {
        setError(data.error || "Error loading XP event data");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async (eventId: string) => {
    try {
      setJoiningEvent(eventId);
      const response = await fetch("/api/xp-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchXPEvents(); // Refresh data
      } else {
        alert(data.error || "Event'e katılırken hata oluştu");
      }
    } catch (err) {
      alert("Bağlantı hatası");
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
    return userParticipations.some((p) => p.eventId === eventId && p.isActive);
  };

  const getUserParticipation = (eventId: string) => {
    return userParticipations.find((p) => p.eventId === eventId);
  };

  const getEventStatusColor = (event: XPEvent) => {
    if (!event.isActive) return "text-gray-500";

    const timeRemaining = getTimeRemaining(event.endDate);
    if (timeRemaining.expired) return "text-red-500";
    if (timeRemaining.days === 0 && timeRemaining.hours < 2)
      return "text-orange-500";

    return "text-green-500";
  };

  const formatTimeRemaining = (timeRemaining: any) => {
    if (timeRemaining.expired) return "Süresi doldu";

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
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="mb-6 h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="space-y-4">
            <div className="h-24 rounded-lg bg-gray-200"></div>
            <div className="h-32 rounded-lg bg-gray-200"></div>
            <div className="h-40 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="text-center">
          <Zap className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Hata</h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={fetchXPEvents}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const activeEvents = events.filter((e) => e.isActive);
  const upcomingEvents = events.filter(
    (e) => !e.isActive && new Date(e.startDate) > new Date()
  );

  return (
    <div className={`space-y-6 rounded-xl bg-white p-6 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">XP Events</h2>
        <div className="flex items-center space-x-2 text-purple-600">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">Bonus XP Fırsatları</span>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-purple-50 p-4 text-center">
            <Zap className="mx-auto mb-2 h-6 w-6 text-purple-600" />
            <div className="text-lg font-bold text-purple-700">
              {stats.currentActiveEvents}
            </div>
            <div className="text-sm text-purple-600">Aktif Event</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <Trophy className="mx-auto mb-2 h-6 w-6 text-blue-600" />
            <div className="text-lg font-bold text-blue-700">
              {stats.totalEventsParticipated}
            </div>
            <div className="text-sm text-blue-600">Katıldığım Event</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <Star className="mx-auto mb-2 h-6 w-6 text-green-600" />
            <div className="text-lg font-bold text-green-700">
              {stats.totalBonusXPEarned}
            </div>
            <div className="text-sm text-green-600">Bonus XP</div>
          </div>
          <div className="rounded-lg bg-orange-50 p-4 text-center">
            <Award className="mx-auto mb-2 h-6 w-6 text-orange-600" />
            <div className="text-lg font-bold text-orange-700">
              {stats.completedEvents}
            </div>
            <div className="text-sm text-orange-600">Tamamlanan</div>
          </div>
        </div>
      )}

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Aktif Events
          </h3>
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
                  className={`rounded-xl border-2 p-6 transition-all ${
                    isParticipating
                      ? "border-purple-200 bg-purple-50"
                      : "border-gray-200 bg-white hover:border-purple-300"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <h4 className="text-xl font-bold text-gray-900">
                          {event.name}
                        </h4>
                        <div className="flex items-center space-x-1 rounded-full bg-purple-100 px-2 py-1">
                          <Zap className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-700">
                            {event.multiplier}x XP
                          </span>
                        </div>
                        {isParticipating && (
                          <div className="flex items-center space-x-1 rounded-full bg-green-100 px-2 py-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              Katıldınız
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="mb-3 text-gray-600">{event.description}</p>

                      {/* Event Requirements */}
                      {event.requirements && event.requirements.length > 0 && (
                        <div className="mb-3">
                          <div className="mb-1 text-sm font-medium text-gray-700">
                            Gereksinimler:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {event.requirements.map((req, index) => (
                              <span
                                key={index}
                                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 text-right">
                      <div
                        className={`text-sm font-medium ${getEventStatusColor(event)}`}
                      >
                        {timeRemaining.expired
                          ? "Süresi Doldu"
                          : formatTimeRemaining(timeRemaining)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {event.participantCount} katılımcı
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </div>
                    </div>
                  </div>

                  {/* Progress for participating users */}
                  {isParticipating && participation && (
                    <div className="mb-4">
                      <div className="mb-1 flex justify-between text-sm text-gray-600">
                        <span>İlerleme</span>
                        <span>
                          {participation.progress.completed} /{" "}
                          {participation.progress.total}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(participation.progress.completed / participation.progress.total) * 100}%`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="mt-1 text-sm text-purple-600">
                        Kazanılan Bonus XP: {participation.earnedXP}
                      </div>
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">
                          +{event.rewards.bonusXP} Bonus XP
                        </span>
                      </div>
                      {event.rewards.specialRewards && (
                        <div className="flex items-center space-x-1">
                          <Gift className="h-4 w-4 text-pink-600" />
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
                        className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                      >
                        {joiningEvent === event.id ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span>Katılıyor...</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
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
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Yaklaşan Events
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="mb-2 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">{event.name}</h4>
                  <div className="flex items-center space-x-1 rounded-full bg-blue-100 px-2 py-1">
                    <Zap className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">
                      {event.multiplier}x
                    </span>
                  </div>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  {event.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Başlangıç:{" "}
                    {new Date(event.startDate).toLocaleDateString("tr-TR")}
                  </span>
                  <span className="font-medium text-blue-600">
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
        <div className="py-12 text-center">
          <Sparkles className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Şu anda aktif event yok
          </h3>
          <p className="mb-4 text-gray-600">
            Yeni XP multiplier event'leri için takipte kalın!
          </p>
          <button
            onClick={fetchXPEvents}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            Yenile
          </button>
        </div>
      )}
    </div>
  );
};

export default XPEventsDashboard;
