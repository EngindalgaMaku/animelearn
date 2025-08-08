"use client";

import { useState, useEffect, useRef } from "react";

// AI-Powered Adaptive Learning Engine
export interface LearningProfile {
  userId: string;
  currentLevel: number;
  learningSpeed: 'slow' | 'medium' | 'fast' | 'adaptive';
  strengths: string[];
  weaknesses: string[];
  preferredDifficulty: number;
  retentionRate: number;
  averageResponseTime: number;
  mistakePatterns: {[topic: string]: number};
  masteryLevels: {[topic: string]: number};
  lastActivity: Date;
  totalPlayTime: number;
  sessionCount: number;
}

export interface AdaptiveRecommendation {
  nextTopics: string[];
  recommendedDifficulty: number;
  spacedRepetitionSchedule: {[topic: string]: Date};
  studyTips: string[];
  estimatedCompletionTime: number;
}

export interface LearningMetrics {
  accuracyRate: number;
  averageTimePerCard: number;
  streakPerformance: number;
  improvementTrend: number;
  focusLevel: number;
  cognitiveLoad: number;
}

class AdaptiveLearningEngine {
  private profile: LearningProfile;
  private sessionData: any[] = [];
  private neuroplasticityModel: Map<string, number> = new Map();

  constructor(userId: string) {
    this.profile = this.initializeProfile(userId);
    this.loadNeuroplasticityModel();
  }

  private initializeProfile(userId: string): LearningProfile {
    // Load from localStorage or create new profile
    const saved = typeof window !== 'undefined' 
      ? localStorage.getItem(`learning_profile_${userId}`)
      : null;
    
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      userId,
      currentLevel: 1,
      learningSpeed: 'adaptive',
      strengths: [],
      weaknesses: [],
      preferredDifficulty: 2,
      retentionRate: 0.7,
      averageResponseTime: 3000,
      mistakePatterns: {},
      masteryLevels: {},
      lastActivity: new Date(),
      totalPlayTime: 0,
      sessionCount: 0,
    };
  }

  private loadNeuroplasticityModel() {
    // Simplified brain plasticity simulation
    // Based on Hebbian learning: "Cells that fire together, wire together"
    const concepts = [
      'python_syntax', 'variables', 'loops', 'functions', 'classes',
      'data_structures', 'algorithms', 'debugging', 'problem_solving'
    ];

    concepts.forEach(concept => {
      this.neuroplasticityModel.set(concept, Math.random() * 0.5 + 0.3); // 0.3-0.8 baseline
    });
  }

  // AI-powered difficulty adjustment
  calculateOptimalDifficulty(topic: string, recentPerformance: LearningMetrics): number {
    const baseDifficulty = this.profile.preferredDifficulty;
    const masteryLevel = this.profile.masteryLevels[topic] || 0;
    const neuroplasticity = this.neuroplasticityModel.get(topic) || 0.5;
    
    // Vygotsky's Zone of Proximal Development
    const zpd = this.calculateZPD(recentPerformance, masteryLevel);
    
    // Flow theory - optimal challenge level
    const flowState = this.calculateFlowState(recentPerformance);
    
    // Adaptive scaling based on multiple factors
    let adjustedDifficulty = baseDifficulty;
    
    // Performance-based adjustment
    if (recentPerformance.accuracyRate > 0.9 && recentPerformance.averageTimePerCard < 2000) {
      adjustedDifficulty += 0.5; // Increase challenge
    } else if (recentPerformance.accuracyRate < 0.6) {
      adjustedDifficulty -= 0.3; // Reduce challenge
    }
    
    // Neuroplasticity factor
    adjustedDifficulty *= neuroplasticity;
    
    // ZPD factor
    adjustedDifficulty *= zpd;
    
    // Flow state optimization
    adjustedDifficulty *= flowState;
    
    return Math.max(1, Math.min(5, Math.round(adjustedDifficulty)));
  }

  private calculateZPD(performance: LearningMetrics, masteryLevel: number): number {
    // Zone of Proximal Development calculation
    const currentAbility = (performance.accuracyRate + masteryLevel) / 2;
    const optimalChallenge = currentAbility + 0.2; // Sweet spot
    
    return Math.max(0.5, Math.min(1.5, optimalChallenge));
  }

  private calculateFlowState(performance: LearningMetrics): number {
    // Flow state indicators
    const challengeSkillBalance = 1 - Math.abs(performance.accuracyRate - 0.8);
    const focusLevel = performance.focusLevel || 0.7;
    const engagementLevel = performance.streakPerformance / 10;
    
    return (challengeSkillBalance + focusLevel + engagementLevel) / 3;
  }

  // Spaced Repetition System (SuperMemo Algorithm)
  calculateSpacedRepetition(topic: string, quality: number): Date {
    const now = new Date();
    const masteryLevel = this.profile.masteryLevels[topic] || 0;
    
    let interval: number;
    
    if (masteryLevel === 0) {
      interval = 1; // First review: 1 day
    } else if (masteryLevel === 1) {
      interval = 6; // Second review: 6 days
    } else {
      // SuperMemo-2 algorithm
      const previousInterval = 6; // Default previous interval
      const easinessFactor = Math.max(1.3, 2.5 + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      interval = Math.round(previousInterval * easinessFactor);
    }
    
    // Quality adjustment
    if (quality < 3) {
      interval = 1; // Reset if poorly remembered
    }
    
    const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
    return nextReview;
  }

  // Cognitive Load Theory implementation
  calculateCognitiveLoad(gameState: any): number {
    const intrinsicLoad = gameState.pairCount * 0.1; // Based on content complexity
    const extraneousLoad = gameState.distractions * 0.05; // UI distractions
    const germaneLoad = gameState.learningActivities * 0.15; // Meaningful learning
    
    const totalLoad = intrinsicLoad + extraneousLoad - germaneLoad;
    return Math.max(0, Math.min(1, totalLoad));
  }

  // Metacognitive awareness enhancement
  generateLearningInsights(sessionData: any[]): string[] {
    const insights: string[] = [];
    
    if (sessionData.length < 3) return insights;
    
    const recentSessions = sessionData.slice(-5);
    const avgAccuracy = recentSessions.reduce((sum, session) => sum + session.accuracy, 0) / recentSessions.length;
    const avgTime = recentSessions.reduce((sum, session) => sum + session.averageTime, 0) / recentSessions.length;
    
    // Pattern detection
    if (avgAccuracy > 0.85) {
      insights.push("🎯 Excellent accuracy! Consider increasing difficulty for optimal challenge.");
    } else if (avgAccuracy < 0.6) {
      insights.push("💡 Focus on accuracy over speed. Take time to read carefully.");
    }
    
    if (avgTime < 2000) {
      insights.push("⚡ You're getting faster! Great pattern recognition skills.");
    } else if (avgTime > 5000) {
      insights.push("🧠 Take your time to think. Quality over speed leads to better retention.");
    }
    
    // Learning style detection
    const mistakePattern = this.analyzeMistakePatterns(recentSessions);
    if (mistakePattern === 'visual') {
      insights.push("👁️ You learn better with visual cues. Try the peek power-up more often.");
    } else if (mistakePattern === 'sequential') {
      insights.push("📋 You prefer structured learning. Focus on completing topics in order.");
    }
    
    return insights;
  }

  private analyzeMistakePatterns(sessions: any[]): string {
    // Analyze mistake patterns to determine learning style
    let visualMistakes = 0;
    let sequentialMistakes = 0;
    let auditoryMistakes = 0;
    
    sessions.forEach(session => {
      if (session.mistakes) {
        session.mistakes.forEach((mistake: any) => {
          if (mistake.type === 'visual_confusion') visualMistakes++;
          if (mistake.type === 'sequence_error') sequentialMistakes++;
          if (mistake.type === 'auditory_similarity') auditoryMistakes++;
        });
      }
    });
    
    if (visualMistakes > sequentialMistakes && visualMistakes > auditoryMistakes) {
      return 'visual';
    } else if (sequentialMistakes > auditoryMistakes) {
      return 'sequential';
    } else {
      return 'auditory';
    }
  }

  // Personalized content recommendation
  recommendNextContent(currentTopic: string): AdaptiveRecommendation {
    const masteryLevel = this.profile.masteryLevels[currentTopic] || 0;
    const weakTopics = Object.entries(this.profile.masteryLevels)
      .filter(([_, level]) => level < 0.7)
      .map(([topic, _]) => topic);
    
    // Knowledge graph traversal
    const nextTopics = this.findOptimalLearningPath(currentTopic, weakTopics);
    
    // Spaced repetition schedule
    const spacedRepetitionSchedule: {[topic: string]: Date} = {};
    Object.keys(this.profile.masteryLevels).forEach(topic => {
      spacedRepetitionSchedule[topic] = this.calculateSpacedRepetition(topic, masteryLevel);
    });
    
    const studyTips = this.generatePersonalizedTips();
    
    return {
      nextTopics,
      recommendedDifficulty: this.profile.preferredDifficulty,
      spacedRepetitionSchedule,
      studyTips,
      estimatedCompletionTime: this.estimateCompletionTime(nextTopics),
    };
  }

  private findOptimalLearningPath(currentTopic: string, weakTopics: string[]): string[] {
    // Simplified knowledge graph
    const prerequisites: {[key: string]: string[]} = {
      'variables': ['python_basics'],
      'conditionals': ['variables'],
      'loops': ['conditionals'],
      'functions': ['loops'],
      'classes': ['functions'],
      'data_structures': ['classes'],
      'algorithms': ['data_structures'],
    };
    
    const path: string[] = [];
    
    // Add weak topics that are prerequisites
    weakTopics.forEach(topic => {
      if (prerequisites[currentTopic]?.includes(topic)) {
        path.unshift(topic); // Add to beginning
      }
    });
    
    // Add next logical topics
    Object.entries(prerequisites).forEach(([topic, prereqs]) => {
      if (prereqs.includes(currentTopic) && !path.includes(topic)) {
        path.push(topic);
      }
    });
    
    return path.slice(0, 3); // Limit to 3 recommendations
  }

  private generatePersonalizedTips(): string[] {
    const tips: string[] = [];
    
    if (this.profile.learningSpeed === 'slow') {
      tips.push("🐌 Take breaks between sessions to improve retention.");
      tips.push("📝 Write down key concepts after each game.");
    } else if (this.profile.learningSpeed === 'fast') {
      tips.push("🚀 Try advanced topics to stay challenged.");
      tips.push("🔄 Review previous topics to maintain mastery.");
    }
    
    if (this.profile.retentionRate < 0.6) {
      tips.push("🧠 Use the spaced repetition schedule for better memory.");
      tips.push("🎯 Focus on understanding concepts, not just memorization.");
    }
    
    return tips;
  }

  private estimateCompletionTime(topics: string[]): number {
    const baseTimePerTopic = 15; // minutes
    const personalSpeedMultiplier = this.profile.learningSpeed === 'fast' ? 0.7 : 
                                   this.profile.learningSpeed === 'slow' ? 1.5 : 1.0;
    
    return Math.round(topics.length * baseTimePerTopic * personalSpeedMultiplier);
  }

  // Real-time adaptation during gameplay
  adaptGameParameters(currentMetrics: LearningMetrics): any {
    const cognitiveLoad = this.calculateCognitiveLoad({
      pairCount: currentMetrics.accuracyRate < 0.6 ? 6 : 8,
      distractions: currentMetrics.focusLevel < 0.7 ? 2 : 0,
      learningActivities: 3,
    });
    
    return {
      timeLimit: this.adaptTimeLimit(currentMetrics),
      hintAvailability: this.adaptHintSystem(currentMetrics),
      cardPresentationSpeed: this.adaptPresentationSpeed(currentMetrics),
      feedbackIntensity: this.adaptFeedbackSystem(currentMetrics),
      cognitiveLoad,
    };
  }

  private adaptTimeLimit(metrics: LearningMetrics): number {
    const baseTime = 300; // 5 minutes
    
    if (metrics.averageTimePerCard > 4000) {
      return baseTime * 1.3; // Give more time
    } else if (metrics.averageTimePerCard < 1500) {
      return baseTime * 0.8; // Challenge with less time
    }
    
    return baseTime;
  }

  private adaptHintSystem(metrics: LearningMetrics): number {
    if (metrics.accuracyRate < 0.5) {
      return 5; // More hints available
    } else if (metrics.accuracyRate > 0.9) {
      return 1; // Fewer hints for challenge
    }
    
    return 3; // Standard
  }

  private adaptPresentationSpeed(metrics: LearningMetrics): number {
    // Speed of card reveal in milliseconds
    if (metrics.focusLevel < 0.6) {
      return 2500; // Slower reveal for better focus
    } else if (metrics.averageTimePerCard < 2000) {
      return 1000; // Faster reveal for quick learners
    }
    
    return 1500; // Standard
  }

  private adaptFeedbackSystem(metrics: LearningMetrics): 'minimal' | 'standard' | 'enhanced' {
    if (metrics.accuracyRate < 0.6) {
      return 'enhanced'; // More detailed feedback
    } else if (metrics.accuracyRate > 0.9) {
      return 'minimal'; // Less interruption
    }
    
    return 'standard';
  }

  // Save learning data
  saveSession(sessionData: any) {
    this.sessionData.push(sessionData);
    
    // Update mastery levels
    if (sessionData.topic) {
      const currentMastery = this.profile.masteryLevels[sessionData.topic] || 0;
      const newMastery = this.calculateNewMastery(currentMastery, sessionData.performance);
      this.profile.masteryLevels[sessionData.topic] = newMastery;
    }
    
    // Update neuroplasticity model
    this.updateNeuroplasticity(sessionData);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`learning_profile_${this.profile.userId}`, JSON.stringify(this.profile));
      localStorage.setItem(`session_data_${this.profile.userId}`, JSON.stringify(this.sessionData.slice(-20))); // Keep last 20 sessions
    }
  }

  private calculateNewMastery(currentMastery: number, performance: any): number {
    const learningRate = 0.1;
    const performanceScore = (performance.accuracy + (1 - performance.errorRate)) / 2;
    
    return Math.min(1, currentMastery + learningRate * performanceScore);
  }

  private updateNeuroplasticity(sessionData: any) {
    // Simulate synaptic strengthening based on practice
    if (sessionData.topic) {
      const current = this.neuroplasticityModel.get(sessionData.topic) || 0.5;
      const improvement = sessionData.performance.accuracy * 0.05;
      const newStrength = Math.min(1, current + improvement);
      this.neuroplasticityModel.set(sessionData.topic, newStrength);
    }
  }

  // Get current profile
  getProfile(): LearningProfile {
    return { ...this.profile };
  }

  // Get learning insights
  getLearningInsights(): string[] {
    return this.generateLearningInsights(this.sessionData);
  }
}

export default AdaptiveLearningEngine;