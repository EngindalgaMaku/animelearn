"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Play,
  RotateCcw,
  Loader2,
  Zap,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { usePyodide } from "@/hooks/usePyodide";

// Dynamic import for Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center bg-gray-900 text-white">
      <div className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading Monaco Editor...
      </div>
    </div>
  ),
});

export default function CodeEditorPage() {
  const [code, setCode] = useState(`# Welcome to the Python Code Editor!
# Write your Python code here and click Run to execute

print("Hello, World!")

# Example: Calculate fibonacci numbers
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Try running this:
for i in range(10):
    print(f"Fibonacci({i}) = {fibonacci(i)}")
`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">(
    "vs-dark"
  );

  // Pyodide hook for real Python execution
  const {
    isReady: pyodideReady,
    loading: pyodideLoading,
    runPython,
  } = usePyodide();

  // Reset code to initial state
  const resetCode = () => {
    setCode(`# Welcome to the Python Code Editor!
# Write your Python code here and click Run to execute

print("Hello, World!")

# Example: Calculate fibonacci numbers
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Try running this:
for i in range(10):
    print(f"Fibonacci({i}) = {fibonacci(i)}")
`);
    setOutput("");
  };

  // Run code with Pyodide
  const runCode = async () => {
    if (!pyodideReady) {
      setOutput("⚠️ Python interpreter is still loading. Please wait...");
      return;
    }

    setIsRunning(true);
    setOutput("");

    try {
      const result = await runPython(code);
      setExecutionTime(result.executionTime);

      if (result.isSuccess) {
        setOutput(
          `✅ Code executed successfully!\n${
            result.output || "(No output)"
          }\n⚡ Execution time: ${result.executionTime}ms`
        );
      } else {
        setOutput(
          `❌ Error occurred:\n${result.error}\n⚡ Execution time: ${result.executionTime}ms`
        );
      }
    } catch (error) {
      setOutput(`💥 Unexpected error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🐍 Python Code Editor
          </h1>
          <p className="mt-2 text-gray-600">
            Write and run Python code with real-time execution
          </p>
        </div>

        {/* Code Editor */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold">Code Editor</h3>
              {pyodideLoading && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading Python...
                </div>
              )}
              {pyodideReady && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Zap className="h-4 w-4" />
                  Python Ready
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetCode}
                className="flex items-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={runCode}
                disabled={isRunning || !pyodideReady}
                className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div
            className={`${
              isFullscreen ? "fixed inset-0 z-50 bg-white" : "relative"
            }`}
          >
            {isFullscreen && (
              <div className="flex items-center justify-between border-b bg-gray-50 p-4">
                <h3 className="font-semibold">Code Editor - Fullscreen</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setEditorTheme(
                        editorTheme === "vs-dark" ? "light" : "vs-dark"
                      )
                    }
                    className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                  >
                    {editorTheme === "vs-dark" ? "☀️ Light" : "🌙 Dark"}
                  </button>
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="flex items-center gap-1 rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                  >
                    <Minimize2 className="h-4 w-4" />
                    Exit Fullscreen
                  </button>
                </div>
              </div>
            )}

            <div className="relative">
              {!isFullscreen && (
                <div className="absolute right-2 top-2 z-10 flex gap-1">
                  <button
                    onClick={() =>
                      setEditorTheme(
                        editorTheme === "vs-dark" ? "light" : "vs-dark"
                      )
                    }
                    className="rounded bg-black/20 p-1 text-xs text-white hover:bg-black/40"
                    title="Toggle theme"
                  >
                    {editorTheme === "vs-dark" ? "☀️" : "🌙"}
                  </button>
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="rounded bg-black/20 p-1 text-white hover:bg-black/40"
                    title="Fullscreen"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </button>
                </div>
              )}

              <Editor
                height={
                  isFullscreen ? "calc(100vh - 80px)" : "calc(100vh - 250px)"
                }
                defaultLanguage="python"
                value={code}
                theme={editorTheme}
                onChange={(value) => setCode(value || "")}
                options={{
                  fontSize: 14,
                  fontFamily:
                    "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
                  fontLigatures: true,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  insertSpaces: true,
                  wordWrap: "on",
                  minimap: { enabled: isFullscreen },
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                    showFunctions: true,
                    showVariables: true,
                  },
                  quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: false,
                  },
                  parameterHints: { enabled: true },
                  autoIndent: "full",
                  formatOnType: true,
                  formatOnPaste: true,
                  dragAndDrop: true,
                  links: false,
                  colorDecorators: true,
                  contextmenu: true,
                  mouseWheelZoom: true,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  renderWhitespace: "boundary",
                  renderControlCharacters: false,
                  renderLineHighlight: "line",
                  selectionHighlight: true,
                  occurrencesHighlight: "singleFile",
                  folding: true,
                  foldingHighlight: true,
                  foldingStrategy: "indentation",
                  showFoldingControls: "mouseover",
                  bracketPairColorization: { enabled: true },
                }}
              />
            </div>
          </div>
        </div>

        {/* Output */}
        {output && (
          <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Output</h3>
              {executionTime > 0 && (
                <span className="text-sm text-gray-500">
                  ⚡ {executionTime}ms
                </span>
              )}
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-gray-900 p-4 text-sm text-green-400">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
