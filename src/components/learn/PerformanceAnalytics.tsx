"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Clock,
  Zap,
  Trophy,
  Star,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Settings,
  Download,
  Share2,
  Eye,
  Calendar,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Award,
  Flame,
  Diamond,
  Crown,
  Rocket,
} from "lucide-react";

// Enhanced Performance Metrics
interface PerformanceMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  improvement: number;
  efficiency: number;
  focus: number;
  adaptability: number;
  retention: number;
}

interface GameSession {
  id: string;
  timestamp: Date;
  topic: string;
  difficulty: string;
  duration: number;
  score: number;
  accuracy: number;
  mistakes: number;
  hintsUsed: number;
  powerUpsUsed: number;
  maxStreak: number;
  averageResponseTime: number;
  cognitiveLoad: number;
  focusLevel: number;
  completionRate: number;
  learningGains: number;
  retentionScore: number;
  adaptabilityIndex: number;
  flowStateTime: number;
  peakPerformanceTime: number;
}

interface LearningTrend {
  period: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface SkillAssessment {
  skillName: string;
  currentLevel: number;
  maxLevel: number;
  progress: number;
  trend: 'improving' | 'declining' | 'stable';
  timeToMastery: number;
  recommendations: string[];
}

interface PredictiveInsight {
  type: 'performance' | 'learning' | 'engagement' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  actionItems: string[];
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

class AdvancedPerformanceEngine {
  private sessions: GameSession[] = [];
  private userId: string;
  private analytics: any = {};

  constructor(userId: string) {
    this.userId = userId;
    this.loadSessionData();
  }

  private loadSessionData() {
    const stored = localStorage.getItem(`performance_data_${this.userId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.sessions = data.sessions || [];
        this.analytics = data.analytics || {};
      } catch (error) {
        console.error('Failed to load performance data:', error);
      }
    }
  }

  private saveSessionData() {
    try {
      const data = {
        sessions: this.sessions,
        analytics: this.analytics,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(`performance_data_${this.userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save performance data:', error);
    }
  }

  recordSession(session: Omit<GameSession, 'id' | 'timestamp'>) {
    const gameSession: GameSession = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.sessions.unshift(gameSession);
    
    // Keep only last 100 sessions for performance
    if (this.sessions.length > 100) {
      this.sessions = this.sessions.slice(0, 100);
    }

    this.updateAnalytics();
    this.saveSessionData();
  }

  private updateAnalytics() {
    if (this.sessions.length === 0) return;

    // Calculate comprehensive analytics
    this.analytics = {
      ...this.calculatePerformanceMetrics(),
      ...this.calculateLearningTrends(),
      ...this.calculateSkillAssessments(),
      ...this.generatePredictiveInsights(),
      ...this.calculateAdvancedStatistics(),
    };
  }

  private calculatePerformanceMetrics(): { performanceMetrics: PerformanceMetrics } {
    const recentSessions = this.sessions.slice(0, 10);
    
    return {
      performanceMetrics: {
        accuracy: this.calculateAverage(recentSessions, 'accuracy'),
        speed: this.calculateSpeedMetric(recentSessions),
        consistency: this.calculateConsistency(recentSessions),
        improvement: this.calculateImprovement(),
        efficiency: this.calculateEfficiency(recentSessions),
        focus: this.calculateAverage(recentSessions, 'focusLevel'),
        adaptability: this.calculateAverage(recentSessions, 'adaptabilityIndex'),
        retention: this.calculateAverage(recentSessions, 'retentionScore'),
      }
    };
  }

  private calculateLearningTrends(): { learningTrends: LearningTrend[] } {
    const periods = ['7d', '30d', '90d'];
    const trends: LearningTrend[] = [];

    periods.forEach(period => {
      const dayCount = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - dayCount);
      
      const periodSessions = this.sessions.filter(s => s.timestamp >= cutoffDate);
      
      if (periodSessions.length > 0) {
        const currentValue = this.calculateAverage(periodSessions, 'score');
        const previousPeriodSessions = this.sessions.filter(s => {
          const prevCutoff = new Date(cutoffDate);
          prevCutoff.setDate(prevCutoff.getDate() - dayCount);
          return s.timestamp >= prevCutoff && s.timestamp < cutoffDate;
        });
        
        const previousValue = previousPeriodSessions.length > 0 
          ? this.calculateAverage(previousPeriodSessions, 'score')
          : currentValue;
        
        const change = ((currentValue - previousValue) / previousValue) * 100;
        
        trends.push({
          period,
          value: currentValue,
          trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
          change: Math.abs(change),
        });
      }
    });

    return { learningTrends: trends };
  }

  private calculateSkillAssessments(): { skillAssessments: SkillAssessment[] } {
    const skills = [
      'Memory Retention',
      'Pattern Recognition',
      'Speed Processing',
      'Focus & Concentration',
      'Strategic Thinking',
      'Adaptive Learning',
    ];

    const assessments: SkillAssessment[] = skills.map(skill => {
      const skillData = this.calculateSkillLevel(skill);
      return {
        skillName: skill,
        currentLevel: skillData.level,
        maxLevel: 10,
        progress: skillData.progress,
        trend: skillData.trend,
        timeToMastery: skillData.timeToMastery,
        recommendations: skillData.recommendations,
      };
    });

    return { skillAssessments: assessments };
  }

  private calculateSkillLevel(skillName: string) {
    const recentSessions = this.sessions.slice(0, 20);
    
    // Skill-specific calculations
    let level = 1;
    let progress = 0;
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    let timeToMastery = 0;
    let recommendations: string[] = [];

    switch (skillName) {
      case 'Memory Retention':
        level = Math.min(10, Math.floor(this.calculateAverage(recentSessions, 'retentionScore') * 10) + 1);
        break;
      case 'Pattern Recognition':
        level = Math.min(10, Math.floor(this.calculateAverage(recentSessions, 'accuracy') * 10) + 1);
        break;
      case 'Speed Processing':
        const avgSpeed = this.calculateAverage(recentSessions, 'averageResponseTime');
        level = Math.min(10, Math.floor((5000 - avgSpeed) / 500) + 1);
        break;
      case 'Focus & Concentration':
        level = Math.min(10, Math.floor(this.calculateAverage(recentSessions, 'focusLevel') * 10) + 1);
        break;
      case 'Strategic Thinking':
        const powerUpEfficiency = recentSessions.reduce((sum, s) => sum + (s.score / Math.max(s.powerUpsUsed, 1)), 0) / recentSessions.length;
        level = Math.min(10, Math.floor(powerUpEfficiency / 200) + 1);
        break;
      case 'Adaptive Learning':
        level = Math.min(10, Math.floor(this.calculateAverage(recentSessions, 'adaptabilityIndex') * 10) + 1);
        break;
    }

    progress = ((level - 1) / 9) * 100;
    timeToMastery = Math.max(0, (10 - level) * 5); // Estimated hours
    
    // Generate recommendations
    if (level < 5) {
      recommendations.push(`Focus on ${skillName.toLowerCase()} exercises`);
    } else if (level < 8) {
      recommendations.push(`Challenge yourself with harder difficulties`);
    } else {
      recommendations.push(`Maintain excellence through regular practice`);
    }

    return { level, progress, trend, timeToMastery, recommendations };
  }

  private generatePredictiveInsights(): { predictiveInsights: PredictiveInsight[] } {
    const insights: PredictiveInsight[] = [];
    
    if (this.sessions.length < 5) {
      return { predictiveInsights: insights };
    }

    // Performance prediction
    const recentPerformance = this.sessions.slice(0, 5).map(s => s.score);
    const trend = this.calculateTrendDirection(recentPerformance);
    
    if (trend > 0.1) {
      insights.push({
        type: 'performance',
        title: 'Accelerating Progress',
        description: 'Your performance is improving rapidly. You\'re on track for significant gains.',
        confidence: 85,
        actionItems: ['Continue current practice routine', 'Gradually increase difficulty'],
        impact: 'high',
        timeframe: 'Next 7 days',
      });
    } else if (trend < -0.1) {
      insights.push({
        type: 'performance',
        title: 'Performance Plateau',
        description: 'Your scores have plateaued. Consider mixing up your practice routine.',
        confidence: 78,
        actionItems: ['Try different game modes', 'Take a short break', 'Focus on weak areas'],
        impact: 'medium',
        timeframe: 'Next 14 days',
      });
    }

    // Learning optimization
    const optimalTime = this.findOptimalPlayTime();
    if (optimalTime) {
      insights.push({
        type: 'optimization',
        title: 'Peak Performance Window',
        description: `You perform ${optimalTime.improvement}% better during ${optimalTime.period}`,
        confidence: 92,
        actionItems: [`Schedule practice sessions during ${optimalTime.period}`],
        impact: 'high',
        timeframe: 'Immediate',
      });
    }

    return { predictiveInsights: insights };
  }

  private calculateAdvancedStatistics() {
    const recentSessions = this.sessions.slice(0, 30);
    
    return {
      advancedStats: {
        totalPlayTime: this.sessions.reduce((sum, s) => sum + s.duration, 0),
        averageSessionLength: this.calculateAverage(recentSessions, 'duration'),
        peakPerformanceScore: Math.max(...this.sessions.map(s => s.score)),
        longestStreak: Math.max(...this.sessions.map(s => s.maxStreak)),
        flowStatePercentage: this.calculateAverage(recentSessions, 'flowStateTime') * 100,
        improvementRate: this.calculateImprovementRate(),
        difficultyProgression: this.calculateDifficultyProgression(),
        cognitiveLoadOptimal: this.findOptimalCognitiveLoad(),
      }
    };
  }

  // Helper methods
  private calculateAverage(sessions: GameSession[], field: keyof GameSession): number {
    if (sessions.length === 0) return 0;
    const sum = sessions.reduce((acc, session) => acc + (session[field] as number), 0);
    return sum / sessions.length;
  }

  private calculateSpeedMetric(sessions: GameSession[]): number {
    if (sessions.length === 0) return 0;
    const avgResponseTime = this.calculateAverage(sessions, 'averageResponseTime');
    return Math.max(0, Math.min(1, (5000 - avgResponseTime) / 5000));
  }

  private calculateConsistency(sessions: GameSession[]): number {
    if (sessions.length < 2) return 1;
    const scores = sessions.map(s => s.score);
    const mean = scores.reduce((a, b) => a + b) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    return Math.max(0, 1 - (standardDeviation / mean));
  }

  private calculateImprovement(): number {
    if (this.sessions.length < 10) return 0;
    const recent = this.sessions.slice(0, 5);
    const older = this.sessions.slice(5, 10);
    const recentAvg = this.calculateAverage(recent, 'score');
    const olderAvg = this.calculateAverage(older, 'score');
    return olderAvg > 0 ? (recentAvg - olderAvg) / olderAvg : 0;
  }

  private calculateEfficiency(sessions: GameSession[]): number {
    if (sessions.length === 0) return 0;
    return sessions.reduce((sum, s) => sum + (s.score / Math.max(s.duration, 1)), 0) / sessions.length / 10;
  }

  private calculateTrendDirection(values: number[]): number {
    if (values.length < 2) return 0;
    let trend = 0;
    for (let i = 1; i < values.length; i++) {
      trend += (values[i] - values[i-1]) / values[i-1];
    }
    return trend / (values.length - 1);
  }

  private findOptimalPlayTime() {
    const hourlyPerformance: { [hour: number]: number[] } = {};
    
    this.sessions.forEach(session => {
      const hour = session.timestamp.getHours();
      if (!hourlyPerformance[hour]) {
        hourlyPerformance[hour] = [];
      }
      hourlyPerformance[hour].push(session.score);
    });

    let bestHour = -1;
    let bestAverage = 0;
    let overallAverage = this.calculateAverage(this.sessions, 'score');

    Object.entries(hourlyPerformance).forEach(([hour, scores]) => {
      if (scores.length >= 3) {
        const average = scores.reduce((a, b) => a + b) / scores.length;
        if (average > bestAverage) {
          bestAverage = average;
          bestHour = parseInt(hour);
        }
      }
    });

    if (bestHour !== -1 && bestAverage > overallAverage * 1.1) {
      const improvement = ((bestAverage - overallAverage) / overallAverage) * 100;
      const period = bestHour < 12 ? 'morning' : bestHour < 17 ? 'afternoon' : 'evening';
      
      return {
        hour: bestHour,
        period,
        improvement: Math.round(improvement),
        average: bestAverage,
      };
    }

    return null;
  }

  private calculateImprovementRate(): number {
    if (this.sessions.length < 20) return 0;
    
    const firstTen = this.sessions.slice(-10);
    const lastTen = this.sessions.slice(0, 10);
    
    const firstAvg = this.calculateAverage(firstTen, 'score');
    const lastAvg = this.calculateAverage(lastTen, 'score');
    
    return firstAvg > 0 ? ((lastAvg - firstAvg) / firstAvg) * 100 : 0;
  }

  private calculateDifficultyProgression(): string {
    const difficulties = this.sessions.slice(0, 10).map(s => s.difficulty);
    const uniqueDifficulties = [...new Set(difficulties)];
    
    if (uniqueDifficulties.includes('expert')) return 'Expert Level';
    if (uniqueDifficulties.includes('hard')) return 'Advanced';
    if (uniqueDifficulties.includes('medium')) return 'Intermediate';
    return 'Beginner';
  }

  private findOptimalCognitiveLoad(): number {
    const loadPerformance: { [load: string]: number[] } = {};
    
    this.sessions.forEach(session => {
      const loadLevel = session.cognitiveLoad < 0.3 ? 'low' : 
                      session.cognitiveLoad < 0.7 ? 'medium' : 'high';
      if (!loadPerformance[loadLevel]) {
        loadPerformance[loadLevel] = [];
      }
      loadPerformance[loadLevel].push(session.score);
    });

    let optimalLoad = 'medium';
    let bestPerformance = 0;

    Object.entries(loadPerformance).forEach(([load, scores]) => {
      if (scores.length >= 3) {
        const average = scores.reduce((a, b) => a + b) / scores.length;
        if (average > bestPerformance) {
          bestPerformance = average;
          optimalLoad = load;
        }
      }
    });

    return optimalLoad === 'low' ? 0.2 : optimalLoad === 'medium' ? 0.5 : 0.8;
  }

  // Public methods
  getPerformanceMetrics(): PerformanceMetrics {
    return this.analytics.performanceMetrics || {
      accuracy: 0, speed: 0, consistency: 0, improvement: 0,
      efficiency: 0, focus: 0, adaptability: 0, retention: 0
    };
  }

  getLearningTrends(): LearningTrend[] {
    return this.analytics.learningTrends || [];
  }

  getSkillAssessments(): SkillAssessment[] {
    return this.analytics.skillAssessments || [];
  }

  getPredictiveInsights(): PredictiveInsight[] {
    return this.analytics.predictiveInsights || [];
  }

  getAdvancedStats() {
    return this.analytics.advancedStats || {};
  }

  getSessionHistory(limit: number = 20): GameSession[] {
    return this.sessions.slice(0, limit);
  }

  exportData(): string {
    return JSON.stringify({
      userId: this.userId,
      sessions: this.sessions,
      analytics: this.analytics,
      exportDate: new Date().toISOString(),
    }, null, 2);
  }

  getChartData(type: 'performance' | 'trends' | 'skills') {
    switch (type) {
      case 'performance':
        return this.sessions.slice(0, 20).reverse().map((session, index) => ({
          session: index + 1,
          score: session.score,
          accuracy: session.accuracy * 100,
          speed: (5000 - session.averageResponseTime) / 50,
          focus: session.focusLevel * 100,
        }));
        
      case 'trends':
        return this.getLearningTrends().map(trend => ({
          period: trend.period,
          value: trend.value,
          change: trend.change,
        }));
        
      case 'skills':
        return this.getSkillAssessments().map(skill => ({
          skill: skill.skillName.split(' ')[0],
          level: skill.currentLevel,
          progress: skill.progress,
        }));
        
      default:
        return [];
    }
  }
}

export default AdvancedPerformanceEngine;
export type {
  PerformanceMetrics,
  GameSession,
  LearningTrend,
  SkillAssessment,
  PredictiveInsight,
};