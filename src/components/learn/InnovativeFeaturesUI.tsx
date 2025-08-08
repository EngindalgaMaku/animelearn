"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mic,
  Hand,
  Eye,
  Vibrate,
  Zap,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Loader,
  Smartphone,
  Monitor,
  Headphones,
  Gamepad2,
  ChevronDown,
  ChevronRight,
  Power,
  Wifi,
  WifiOff,
  Cpu,
  Activity,
  Target,
  MousePointer,
  Layers,
  Maximize,
} from "lucide-react";

import InnovativeFeatures, {
  FeatureCapabilities,
  ARConfiguration,
  VoiceConfiguration,
  GestureConfiguration,
  HapticConfiguration,
} from "./InnovativeFeatures";

interface InnovativeFeaturesUIProps {
  onFeatureCommand?: (action: string, params?: any) => void;
  onARCardPlaced?: (cardId: string, position: any) => void;
  gameActive?: boolean;
}

const InnovativeFeaturesUI: React.FC<InnovativeFeaturesUIProps> = ({
  onFeatureCommand,
  onARCardPlaced,
  gameActive = false,
}) => {
  // Core State
  const [featuresEngine] = useState(() => new InnovativeFeatures());
  const [capabilities, setCapabilities] = useState<FeatureCapabilities>({
    ar: false,
    voice: false,
    gesture: false,
    haptic: false,
    camera: false,
    microphone: false,
    deviceMotion: false,
    webGL: false,
    webXR: false,
  });

  // Feature States
  const [arActive, setArActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [gestureActive, setGestureActive] = useState(false);
  const [hapticActive, setHapticActive] = useState(false);
  const [eyeTrackingActive, setEyeTrackingActive] = useState(false);

  // UI States
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'ar' | 'voice' | 'gesture' | 'haptic'>('ar');
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Feature-specific states
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState<string>('');
  const [gazePosition, setGazePosition] = useState<{x: number, y: number} | null>(null);
  const [arCardPositions, setArCardPositions] = useState<{[key: string]: any}>({});

  // Configuration states
  const [arConfig, setArConfig] = useState<ARConfiguration>({
    enabled: false,
    trackingMode: 'markerless',
    cardScale: 1.0,
    cardSpacing: 0.15,
    lighting: 'auto',
    physics: true,
    shadows: true,
  });

  const [voiceConfig, setVoiceConfig] = useState<VoiceConfiguration>({
    enabled: false,
    language: 'en-US',
    sensitivity: 0.7,
    commands: {},
    confirmationRequired: false,
    feedbackEnabled: true,
  });

  const [gestureConfig, setGestureConfig] = useState<GestureConfiguration>({
    enabled: false,
    handTracking: false,
    eyeTracking: false,
    touchlessMode: false,
    gestureThreshold: 0.8,
    calibrationRequired: true,
  });

  const [hapticConfig, setHapticConfig] = useState<HapticConfiguration>({
    enabled: false,
    intensity: 0.5,
    patterns: {},
    spatialFeedback: false,
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const arCanvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize features engine
  useEffect(() => {
    const initializeEngine = async () => {
      // Setup event listeners
      featuresEngine.on('capabilities_detected', (caps: FeatureCapabilities) => {
        setCapabilities(caps);
      });

      featuresEngine.on('ar_initialized', () => {
        setArActive(true);
        setSuccess('AR mode activated!');
        setTimeout(() => setSuccess(''), 3000);
      });

      featuresEngine.on('ar_error', (data: any) => {
        setError(`AR Error: ${data.error.message || 'Unknown error'}`);
        setTimeout(() => setError(''), 5000);
      });

      featuresEngine.on('voice_initialized', () => {
        setSuccess('Voice recognition activated!');
        setTimeout(() => setSuccess(''), 3000);
      });

      featuresEngine.on('voice_listening_started', () => {
        setIsListening(true);
      });

      featuresEngine.on('voice_listening_stopped', () => {
        setIsListening(false);
      });

      featuresEngine.on('voice_transcript', (data: any) => {
        setVoiceTranscript(data.final || data.interim);
      });

      featuresEngine.on('voice_command_executed', (data: any) => {
        onFeatureCommand?.(data.action, data.params);
        featuresEngine.triggerHaptic('powerup_activate');
      });

      featuresEngine.on('gesture_detected', (data: any) => {
        setDetectedGesture(data.gesture);
        setTimeout(() => setDetectedGesture(''), 2000);
        
        // Map gestures to game actions
        const gestureActions: {[key: string]: string} = {
          'point': 'select_card',
          'grab': 'flip_card',
          'swipe_left': 'previous_card',
          'swipe_right': 'next_card',
          'thumbs_up': 'use_powerup',
          'peace': 'show_hint',
        };

        const action = gestureActions[data.gesture];
        if (action) {
          onFeatureCommand?.(action);
          featuresEngine.triggerHaptic('card_flip');
        }
      });

      featuresEngine.on('gaze_detected', (data: any) => {
        setGazePosition({ x: data.x, y: data.y });
      });

      featuresEngine.on('ar_card_placed', (data: any) => {
        setArCardPositions(prev => ({
          ...prev,
          [data.cardId]: data.position
        }));
        onARCardPlaced?.(data.cardId, data.position);
      });

      // Load initial configurations
      setArConfig(featuresEngine.getARConfig());
      setVoiceConfig(featuresEngine.getVoiceConfig());
      setGestureConfig(featuresEngine.getGestureConfig());
      setHapticConfig(featuresEngine.getHapticConfig());
    };

    initializeEngine();

    return () => {
      featuresEngine.cleanup();
    };
  }, [featuresEngine, onFeatureCommand, onARCardPlaced]);

  // Feature activation handlers
  const toggleAR = async () => {
    setIsInitializing(true);
    try {
      if (!arActive) {
        await featuresEngine.initializeAR();
      } else {
        await featuresEngine.stopAR();
        setArActive(false);
      }
    } catch (error: any) {
      setError(`AR Error: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
    setIsInitializing(false);
  };

  const toggleVoice = async () => {
    setIsInitializing(true);
    try {
      if (!voiceActive) {
        await featuresEngine.initializeVoice();
        setVoiceActive(true);
        featuresEngine.startVoiceListening();
      } else {
        featuresEngine.stopVoiceListening();
        setVoiceActive(false);
      }
    } catch (error: any) {
      setError(`Voice Error: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
    setIsInitializing(false);
  };

  const toggleGesture = async () => {
    setIsInitializing(true);
    try {
      if (!gestureActive) {
        await featuresEngine.initializeGesture();
        setGestureActive(true);
      } else {
        setGestureActive(false);
      }
    } catch (error: any) {
      setError(`Gesture Error: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
    setIsInitializing(false);
  };

  const toggleEyeTracking = async () => {
    setIsInitializing(true);
    try {
      if (!eyeTrackingActive) {
        await featuresEngine.initializeEyeTracking();
        setEyeTrackingActive(true);
      } else {
        setEyeTrackingActive(false);
      }
    } catch (error: any) {
      setError(`Eye Tracking Error: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
    setIsInitializing(false);
  };

  const toggleHaptic = () => {
    if (!hapticActive) {
      const success = featuresEngine.initializeHaptic();
      if (success) {
        setHapticActive(true);
        featuresEngine.triggerHaptic('powerup_activate');
        setSuccess('Haptic feedback activated!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Haptic feedback not supported on this device');
        setTimeout(() => setError(''), 5000);
      }
    } else {
      setHapticActive(false);
    }
  };

  // Configuration update handlers
  const updateARConfig = (updates: Partial<ARConfiguration>) => {
    const newConfig = { ...arConfig, ...updates };
    setArConfig(newConfig);
    featuresEngine.updateARConfig(newConfig);
  };

  const updateVoiceConfig = (updates: Partial<VoiceConfiguration>) => {
    const newConfig = { ...voiceConfig, ...updates };
    setVoiceConfig(newConfig);
    featuresEngine.updateVoiceConfig(newConfig);
  };

  const updateGestureConfig = (updates: Partial<GestureConfiguration>) => {
    const newConfig = { ...gestureConfig, ...updates };
    setGestureConfig(newConfig);
    featuresEngine.updateGestureConfig(newConfig);
  };

  const updateHapticConfig = (updates: Partial<HapticConfiguration>) => {
    const newConfig = { ...hapticConfig, ...updates };
    setHapticConfig(newConfig);
    featuresEngine.updateHapticConfig(newConfig);
  };

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2"
          >
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Control Panel */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <Zap className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Innovative Features</h2>
                <p className="text-indigo-100">Next-generation interaction technologies</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Feature Controls */}
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* AR Control */}
            <motion.button
              onClick={toggleAR}
              disabled={!capabilities.ar || isInitializing}
              whileHover={{ scale: capabilities.ar ? 1.02 : 1 }}
              whileTap={{ scale: capabilities.ar ? 0.98 : 1 }}
              className={`p-6 rounded-xl border-2 transition-all text-center ${
                !capabilities.ar
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : arActive
                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <Camera className={`h-8 w-8 mx-auto mb-2 ${arActive ? 'animate-pulse' : ''}`} />
              <h3 className="font-bold">AR Mode</h3>
              <p className="text-xs mt-1">
                {!capabilities.ar ? 'Not Supported' : arActive ? 'Active' : 'Inactive'}
              </p>
              {isInitializing && activeTab === 'ar' && (
                <Loader className="h-4 w-4 animate-spin mx-auto mt-2" />
              )}
            </motion.button>

            {/* Voice Control */}
            <motion.button
              onClick={toggleVoice}
              disabled={!capabilities.voice || isInitializing}
              whileHover={{ scale: capabilities.voice ? 1.02 : 1 }}
              whileTap={{ scale: capabilities.voice ? 0.98 : 1 }}
              className={`p-6 rounded-xl border-2 transition-all text-center ${
                !capabilities.voice
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : voiceActive
                    ? 'border-green-400 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              <Mic className={`h-8 w-8 mx-auto mb-2 ${isListening ? 'animate-bounce' : ''}`} />
              <h3 className="font-bold">Voice Control</h3>
              <p className="text-xs mt-1">
                {!capabilities.voice ? 'Not Supported' : isListening ? 'Listening...' : voiceActive ? 'Ready' : 'Inactive'}
              </p>
              {isInitializing && activeTab === 'voice' && (
                <Loader className="h-4 w-4 animate-spin mx-auto mt-2" />
              )}
            </motion.button>

            {/* Gesture Control */}
            <motion.button
              onClick={toggleGesture}
              disabled={!capabilities.gesture || isInitializing}
              whileHover={{ scale: capabilities.gesture ? 1.02 : 1 }}
              whileTap={{ scale: capabilities.gesture ? 0.98 : 1 }}
              className={`p-6 rounded-xl border-2 transition-all text-center ${
                !capabilities.gesture
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : gestureActive
                    ? 'border-purple-400 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
              }`}
            >
              <Hand className={`h-8 w-8 mx-auto mb-2 ${gestureActive ? 'animate-pulse' : ''}`} />
              <h3 className="font-bold">Gesture Control</h3>
              <p className="text-xs mt-1">
                {!capabilities.gesture ? 'Not Supported' : gestureActive ? 'Tracking' : 'Inactive'}
              </p>
              {detectedGesture && (
                <p className="text-xs font-bold text-purple-600 mt-1">{detectedGesture}</p>
              )}
            </motion.button>

            {/* Haptic Feedback */}
            <motion.button
              onClick={toggleHaptic}
              disabled={!capabilities.haptic}
              whileHover={{ scale: capabilities.haptic ? 1.02 : 1 }}
              whileTap={{ scale: capabilities.haptic ? 0.98 : 1 }}
              className={`p-6 rounded-xl border-2 transition-all text-center ${
                !capabilities.haptic
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : hapticActive
                    ? 'border-orange-400 bg-orange-50 text-orange-700'
                    : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
              }`}
            >
              <Vibrate className={`h-8 w-8 mx-auto mb-2 ${hapticActive ? 'animate-bounce' : ''}`} />
              <h3 className="font-bold">Haptic Feedback</h3>
              <p className="text-xs mt-1">
                {!capabilities.haptic ? 'Not Supported' : hapticActive ? 'Active' : 'Inactive'}
              </p>
            </motion.button>
          </div>

          {/* Live Voice Transcript */}
          {voiceActive && voiceTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-800">Voice Input:</span>
              </div>
              <p className="text-green-700 italic">"{voiceTranscript}"</p>
            </motion.div>
          )}

          {/* Eye Tracking Indicator */}
          {eyeTrackingActive && gazePosition && (
            <div className="relative">
              <motion.div
                className="fixed w-4 h-4 bg-red-500 rounded-full pointer-events-none z-50 border-2 border-white shadow-lg"
                style={{
                  left: gazePosition.x - 8,
                  top: gazePosition.y - 8,
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </div>
          )}

          {/* Advanced Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleEyeTracking}
                disabled={!capabilities.camera}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  eyeTrackingActive
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : capabilities.camera
                      ? 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm">Eye Tracking</span>
              </button>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Activity className="h-4 w-4" />
                <span>Device Motion: {capabilities.deviceMotion ? 'Supported' : 'Not Available'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                capabilities.webGL ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <Cpu className="h-3 w-3" />
                <span>WebGL</span>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                capabilities.webXR ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <Layers className="h-3 w-3" />
                <span>WebXR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 p-6 bg-gray-50"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Advanced Configuration</h3>
              
              {/* Configuration Tabs */}
              <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6">
                {[
                  { id: 'ar', label: 'AR', icon: Camera },
                  { id: 'voice', label: 'Voice', icon: Mic },
                  { id: 'gesture', label: 'Gesture', icon: Hand },
                  { id: 'haptic', label: 'Haptic', icon: Vibrate },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === id
                        ? 'bg-indigo-500 text-white'
                        : 'text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* AR Configuration */}
              {activeTab === 'ar' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tracking Mode
                      </label>
                      <select
                        value={arConfig.trackingMode}
                        onChange={(e) => updateARConfig({ trackingMode: e.target.value as any })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="markerless">Markerless</option>
                        <option value="markers">Marker-based</option>
                        <option value="plane_detection">Plane Detection</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Scale: {arConfig.cardScale}
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={arConfig.cardScale}
                        onChange={(e) => updateARConfig({ cardScale: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={arConfig.physics}
                        onChange={(e) => updateARConfig({ physics: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Physics Simulation</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={arConfig.shadows}
                        onChange={(e) => updateARConfig({ shadows: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Dynamic Shadows</span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Voice Configuration */}
              {activeTab === 'voice' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={voiceConfig.language}
                        onChange={(e) => updateVoiceConfig({ language: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                        <option value="de-DE">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sensitivity: {Math.round(voiceConfig.sensitivity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={voiceConfig.sensitivity}
                        onChange={(e) => updateVoiceConfig({ sensitivity: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={voiceConfig.confirmationRequired}
                        onChange={(e) => updateVoiceConfig({ confirmationRequired: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Require Confirmation</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={voiceConfig.feedbackEnabled}
                        onChange={(e) => updateVoiceConfig({ feedbackEnabled: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Audio Feedback</span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Gesture Configuration */}
              {activeTab === 'gesture' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gesture Threshold: {Math.round(gestureConfig.gestureThreshold * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={gestureConfig.gestureThreshold}
                      onChange={(e) => updateGestureConfig({ gestureThreshold: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={gestureConfig.handTracking}
                        onChange={(e) => updateGestureConfig({ handTracking: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Hand Tracking</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={gestureConfig.touchlessMode}
                        onChange={(e) => updateGestureConfig({ touchlessMode: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Touchless Mode</span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Haptic Configuration */}
              {activeTab === 'haptic' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intensity: {Math.round(hapticConfig.intensity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={hapticConfig.intensity}
                      onChange={(e) => updateHapticConfig({ intensity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => featuresEngine.triggerHaptic('card_flip')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                    >
                      Test Card Flip
                    </button>
                    <button
                      onClick={() => featuresEngine.triggerHaptic('match_success')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                    >
                      Test Match Success
                    </button>
                    <button
                      onClick={() => featuresEngine.triggerHaptic('level_up')}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                    >
                      Test Level Up
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AR Video Feed */}
      {arActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black rounded-xl overflow-hidden shadow-xl"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
          />
          <canvas
            ref={arCanvasRef}
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            AR Mode Active
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InnovativeFeaturesUI;