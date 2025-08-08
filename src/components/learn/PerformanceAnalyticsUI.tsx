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
  MousePointer,
  Maximize2,
  Minimize2,
  Info,
  ChevronDown,
  ChevronUp,
  Heart,
} from "lucide-react";

import AdvancedPerformanceEngine, {
  PerformanceMetrics,
  GameSession,
  LearningTrend,
  SkillAssessment,
  PredictiveInsight,
} from "./PerformanceAnalytics";

interface PerformanceAnalyticsUIProps {
  userId: string;
  onSessionRecord?: (session: any) => void;
  showDetailedView?: boolean;
}

const PerformanceAnalyticsUI: React.FC<PerformanceAnalyticsUIProps> = ({
  userId,
  onSessionRecord,
  showDetailedView = false,
}) => {
  // Core State
  const [analyticsEngine] = useState(() => new AdvancedPerformanceEngine(userId));
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    accuracy: 0, speed: 0, consistency: 0, improvement: 0,
    efficiency: 0, focus: 0, adaptability: 0, retention: 0
  });
  
  // UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'skills' | 'insights' | 'history'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [expandedView, setExpandedView] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('score');
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Data State
  const [learningTrends, setLearningTrends] = useState<LearningTrend[]>([]);
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [sessionHistory, setSessionHistory] = useState<GameSession[]>([]);
  const [advancedStats, setAdvancedStats] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);

  // Load analytics data
  const refreshData = useCallback(() => {
    setPerformanceMetrics(analyticsEngine.getPerformanceMetrics());
    setLearningTrends(analyticsEngine.getLearningTrends());
    setSkillAssessments(analyticsEngine.getSkillAssessments());
    setPredictiveInsights(analyticsEngine.getPredictiveInsights());
    setSessionHistory(analyticsEngine.getSessionHistory(50));
    setAdvancedStats(analyticsEngine.getAdvancedStats());
    setChartData(analyticsEngine.getChartData('performance'));
  }, [analyticsEngine]);

  useEffect(() => {
    refreshData();
  }, [refreshData, timeRange]);

  // Record new session
  const recordSession = useCallback((sessionData: any) => {
    analyticsEngine.recordSession(sessionData);
    refreshData();
    onSessionRecord?.(sessionData);
  }, [analyticsEngine, refreshData, onSessionRecord]);

  // Export data
  const exportData = useCallback(() => {
    const data = analyticsEngine.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance_analytics_${userId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  }, [analyticsEngine, userId]);

  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
  const METRIC_COLORS = {
    score: '#8884d8',
    accuracy: '#82ca9d',
    speed: '#ffc658',
    focus: '#ff7300',
  };

  // Performance Score Calculation
  const calculateOverallScore = () => {
    const weights = {
      accuracy: 0.25,
      speed: 0.15,
      consistency: 0.15,
      improvement: 0.15,
      efficiency: 0.1,
      focus: 0.1,
      adaptability: 0.05,
      retention: 0.05,
    };
    
    return Math.round(
      Object.entries(performanceMetrics).reduce(
        (sum, [key, value]) => sum + (value * (weights[key as keyof typeof weights] || 0)),
        0
      ) * 100
    );
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-50' };
    if (score >= 70) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 60) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (score >= 50) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const overallScore = calculateOverallScore();
  const performanceGrade = getPerformanceGrade(overallScore);

  if (!showDetailedView) {
    // Compact view for integration
    return (
      <div className="space-y-4">
        {/* Performance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{overallScore}</div>
            <div className="text-xs text-gray-600">Performance Score</div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full mt-1 ${performanceGrade.bg} ${performanceGrade.color}`}>
              Grade {performanceGrade.grade}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(performanceMetrics.accuracy * 100)}%
            </div>
            <div className="text-xs text-gray-600">Accuracy</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(performanceMetrics.consistency * 100)}%
            </div>
            <div className="text-xs text-gray-600">Consistency</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(performanceMetrics.improvement * 100)}%
            </div>
            <div className="text-xs text-gray-600">Improvement</div>
          </div>
        </div>

        {/* Quick Insights */}
        {predictiveInsights.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Insight
            </h4>
            <div className="text-sm">
              <p className="text-indigo-700 font-medium">{predictiveInsights[0].title}</p>
              <p className="text-indigo-600 text-xs mt-1">{predictiveInsights[0].description}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Performance Analytics</h2>
              <p className="text-blue-100">AI-powered learning insights and predictions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Export Data"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={refreshData}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setExpandedView(!expandedView)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title={expandedView ? "Collapse" : "Expand"}
            >
              {expandedView ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Overall Performance Score */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{overallScore}</div>
            <div className="text-blue-100">Performance Score</div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${performanceGrade.bg} ${performanceGrade.color}`}>
              Grade {performanceGrade.grade}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">{sessionHistory.length}</div>
            <div className="text-blue-100">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              {Math.round((advancedStats.totalPlayTime || 0) / 60)} min
            </div>
            <div className="text-blue-100">Total Play Time</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'performance', label: 'Performance', icon: TrendingUp },
          { id: 'skills', label: 'Skills', icon: Target },
          { id: 'insights', label: 'AI Insights', icon: Brain },
          { id: 'history', label: 'History', icon: Clock },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
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
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {Object.entries(performanceMetrics).map(([key, value]) => (
                <div key={key} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {Math.round(value * 100)}%
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Trends Chart */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Performance Trends</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                  >
                    <option value="score">Score</option>
                    <option value="accuracy">Accuracy</option>
                    <option value="speed">Speed</option>
                    <option value="focus">Focus</option>
                  </select>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as any)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                  >
                    <option value="line">Line</option>
                    <option value="bar">Bar</option>
                    <option value="area">Area</option>
                  </select>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'line' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={METRIC_COLORS[selectedMetric as keyof typeof METRIC_COLORS] || '#8884d8'}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey={selectedMetric}
                      fill={METRIC_COLORS[selectedMetric as keyof typeof METRIC_COLORS] || '#8884d8'}
                    />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="session" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={METRIC_COLORS[selectedMetric as keyof typeof METRIC_COLORS] || '#8884d8'}
                      fill={METRIC_COLORS[selectedMetric as keyof typeof METRIC_COLORS] || '#8884d8'}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Learning Trends */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learningTrends.map((trend, index) => (
                <div key={trend.period} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900">
                      Last {trend.period === '7d' ? '7 Days' : trend.period === '30d' ? '30 Days' : '90 Days'}
                    </h4>
                    <div className={`flex items-center space-x-1 ${
                      trend.trend === 'up' ? 'text-green-600' :
                      trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {trend.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                       trend.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                       <div className="w-4 h-4 rounded-full bg-gray-400" />}
                      <span className="text-sm font-medium">
                        {trend.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {Math.round(trend.value)}
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'skills' && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Skills Radar Chart */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Skill Assessment</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={analyticsEngine.getChartData('skills')}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar
                    name="Current Level"
                    dataKey="level"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Progress"
                    dataKey="progress"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillAssessments.map((skill, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900">{skill.skillName}</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {skill.currentLevel}/{skill.maxLevel}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(skill.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Time to Mastery:</strong> {skill.timeToMastery} hours
                  </div>

                  <div className="text-sm">
                    <strong className="text-gray-900">Recommendations:</strong>
                    <ul className="mt-1 space-y-1">
                      {skill.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-gray-600 flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* AI Insights */}
            <div className="grid grid-cols-1 gap-6">
              {predictiveInsights.map((insight, index) => (
                <div key={index} className={`rounded-xl p-6 border-2 ${
                  insight.impact === 'high' ? 'border-red-200 bg-red-50' :
                  insight.impact === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        insight.type === 'performance' ? 'bg-blue-100 text-blue-600' :
                        insight.type === 'learning' ? 'bg-green-100 text-green-600' :
                        insight.type === 'engagement' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {insight.type === 'performance' ? <TrendingUp className="h-5 w-5" /> :
                         insight.type === 'learning' ? <Brain className="h-5 w-5" /> :
                         insight.type === 'engagement' ? <Heart className="h-5 w-5" /> :
                         <Zap className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{insight.title}</h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {insight.type} • {insight.impact} impact • {insight.timeframe}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {insight.confidence}% confidence
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{insight.description}</p>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recommended Actions:</h4>
                    <ul className="space-y-2">
                      {insight.actionItems.map((action, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {predictiveInsights.length === 0 && (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
                <p className="text-gray-600">Complete more sessions to unlock AI insights and predictions.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Session History */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Session History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sessionHistory.slice(0, 20).map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.timestamp.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {session.topic}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {session.score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {Math.round(session.accuracy * 100)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {Math.round(session.duration / 60)}m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {session.maxStreak}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Export Analytics Data</h3>
              <p className="text-gray-600 mb-6">
                Download your complete performance analytics data including session history, metrics, and insights.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={exportData}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PerformanceAnalyticsUI;
export { AdvancedPerformanceEngine };