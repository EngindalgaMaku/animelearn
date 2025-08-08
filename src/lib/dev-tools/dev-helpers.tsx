/**
 * Development helpers for React components and hooks
 */

import React, { useState, useEffect, useRef } from "react";
import { createMockUser, createMockCard, generateMockData } from "./mock-data";
import { createDebugger } from "./debug";
import { isDevelopment } from "./environment";

// Development mode hook
export const useDevMode = () => {
  const [isDevMode, setIsDevMode] = useState(isDevelopment());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle dev mode with Ctrl+Shift+D
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setIsDevMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return isDevMode;
};

// Hot reload hook
export const useHotReload = (
  callback: () => void,
  dependencies: any[] = []
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (isDevelopment()) {
      callbackRef.current();
    }
  }, dependencies);
};

// Mock data hook
export const useMockData = <T,>(
  generator: () => T,
  count: number = 1,
  refreshKey?: string
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDevelopment()) {
      setLoading(true);
      // Simulate async loading
      setTimeout(() => {
        const mockData = Array.from({ length: count }, generator);
        setData(mockData);
        setLoading(false);
      }, 100);
    }
  }, [count, refreshKey]);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = Array.from({ length: count }, generator);
      setData(mockData);
      setLoading(false);
    }, 100);
  };

  return { data, loading, refresh };
};

// Development Panel Component
export const DevPanel: React.FC<{
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  onClose?: () => void;
}> = ({ position = "bottom-right", onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const isDevMode = useDevMode();

  if (!isDevelopment() || !isDevMode) {
    return null;
  }

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const tabs = [
    { id: "info", label: "Info", icon: "ℹ️" },
    { id: "performance", label: "Perf", icon: "⚡" },
    { id: "storage", label: "Storage", icon: "💾" },
    { id: "network", label: "Network", icon: "🌐" },
  ];

  return (
    <div className={`fixed ${positionClasses[position]} z-[9999]`}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Open Dev Panel"
        >
          🛠️
        </button>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-80 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Dev Panel</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 text-xs font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-3 text-xs space-y-2 max-h-60 overflow-y-auto">
            {activeTab === "info" && <InfoPanel />}
            {activeTab === "performance" && <PerformancePanel />}
            {activeTab === "storage" && <StoragePanel />}
            {activeTab === "network" && <NetworkPanel />}
          </div>
        </div>
      )}
    </div>
  );
};

// Info Panel
const InfoPanel: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="font-medium text-gray-800">Environment</div>
      <div className="text-gray-600">Node: {process.env.NODE_ENV}</div>
      <div className="text-gray-600">React: {React.version}</div>
      <div className="text-gray-600">URL: {window.location.pathname}</div>

      <div className="font-medium text-gray-800 mt-3">Screen</div>
      <div className="text-gray-600">
        {window.innerWidth} × {window.innerHeight}
      </div>

      <div className="font-medium text-gray-800 mt-3">User Agent</div>
      <div className="text-gray-600 break-all">
        {navigator.userAgent.substring(0, 50)}...
      </div>
    </div>
  );
};

// Performance Panel
const PerformancePanel: React.FC = () => {
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    setRenderCount((prev) => prev + 1);
  });

  return (
    <div className="space-y-2">
      <div className="font-medium text-gray-800">Render Count</div>
      <div className="text-gray-600">{renderCount}</div>

      <div className="font-medium text-gray-800">Memory</div>
      <div className="text-gray-600">
        {(performance as any).memory
          ? `${Math.round(
              (performance as any).memory.usedJSHeapSize / 1024 / 1024
            )}MB`
          : "N/A"}
      </div>

      <div className="font-medium text-gray-800">Timing</div>
      <div className="text-gray-600">
        Load: {Math.round(performance.now())}ms
      </div>
    </div>
  );
};

// Storage Panel
const StoragePanel: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState({
    localStorage: 0,
    sessionStorage: 0,
  });

  useEffect(() => {
    const getStorageSize = (storage: Storage) => {
      let size = 0;
      for (let key in storage) {
        if (storage.hasOwnProperty(key)) {
          size += storage[key].length + key.length;
        }
      }
      return size;
    };

    setStorageInfo({
      localStorage: getStorageSize(localStorage),
      sessionStorage: getStorageSize(sessionStorage),
    });
  }, []);

  const clearStorage = (type: "local" | "session") => {
    if (type === "local") {
      localStorage.clear();
    } else {
      sessionStorage.clear();
    }
    window.location.reload();
  };

  return (
    <div className="space-y-2">
      <div className="font-medium text-gray-800">Storage Usage</div>
      <div className="text-gray-600">
        Local: {storageInfo.localStorage} bytes
      </div>
      <div className="text-gray-600">
        Session: {storageInfo.sessionStorage} bytes
      </div>

      <div className="space-y-1 mt-3">
        <button
          onClick={() => clearStorage("local")}
          className="w-full px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
        >
          Clear Local Storage
        </button>
        <button
          onClick={() => clearStorage("session")}
          className="w-full px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200"
        >
          Clear Session Storage
        </button>
      </div>
    </div>
  );
};

// Network Panel
const NetworkPanel: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="font-medium text-gray-800">Connection</div>
      <div className="text-gray-600">
        {(navigator as any).connection?.effectiveType || "Unknown"}
      </div>

      <div className="font-medium text-gray-800">Online</div>
      <div className="text-gray-600">
        {navigator.onLine ? "✅ Online" : "❌ Offline"}
      </div>

      <div className="font-medium text-gray-800">API Status</div>
      <div className="text-gray-600">🟢 Connected</div>
    </div>
  );
};

// Debug Overlay Component
export const DebugOverlay: React.FC<{
  children: React.ReactNode;
  showBounds?: boolean;
  showProps?: boolean;
}> = ({ children, showBounds = true, showProps = false }) => {
  if (!isDevelopment()) {
    return <>{children}</>;
  }

  return (
    <div
      className={`relative ${
        showBounds ? "border border-dashed border-red-400" : ""
      }`}
    >
      {children}
    </div>
  );
};

// Performance Monitor Component
export const PerformanceMonitor: React.FC<{
  threshold?: number;
  onSlowRender?: (renderTime: number) => void;
}> = ({ threshold = 16, onSlowRender }) => {
  const renderStartTime = useRef<number>(0);
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    if (renderStartTime.current) {
      const duration = performance.now() - renderStartTime.current;
      setRenderTime(duration);

      if (duration > threshold) {
        onSlowRender?.(duration);
        console.warn(`Slow render detected: ${duration.toFixed(2)}ms`);
      }
    }
  });

  if (!isDevelopment()) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 z-[9999] px-2 py-1 text-xs font-mono ${
        renderTime > threshold
          ? "bg-red-500 text-white"
          : "bg-green-500 text-white"
      }`}
    >
      {renderTime.toFixed(1)}ms
    </div>
  );
};

// Development utilities
export const devUtils = {
  log: createDebugger({ level: "DEBUG", namespace: "DevUtils" }),

  generateTestData: () =>
    generateMockData({
      users: 10,
      cards: 50,
      progress: 25,
      achievements: 15,
    }),

  simulateError: (message: string = "Test error") => {
    throw new Error(message);
  },

  simulateDelay: (ms: number = 1000) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  measurePerformance: (label: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
  },
};
