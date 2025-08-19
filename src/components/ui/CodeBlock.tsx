"use client";

import { useState } from "react";
import { Copy, Check, Play, Loader2, Zap } from "lucide-react";
import Editor from "@monaco-editor/react";
import { usePyodide } from "@/hooks/usePyodide";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  editable?: boolean;
  runnable?: boolean;
  onChange?: (code: string) => void;
}

export default function CodeBlock({
  code,
  language = "python",
  title,
  showLineNumbers = true,
  editable = false,
  runnable = false,
  onChange,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [editableCode, setEditableCode] = useState(code);

  // Pyodide integration for runnable code blocks
  const {
    isReady: pyodideReady,
    loading: pyodideLoading,
    runPython,
  } = usePyodide();
  const [runOutput, setRunOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const isErrorOutput = !!(
    runnable &&
    runOutput &&
    /^error[:]/i.test(runOutput.trim())
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setEditableCode(newCode);
    onChange?.(newCode);
  };

  // Simple syntax highlighting for Python
  const highlightCode = (code: string) => {
    if (language !== "python") return code;

    return code
      .replace(
        /(def|class|if|elif|else|for|while|try|except|finally|with|import|from|as|return|yield|break|continue|pass|raise|assert|del|global|nonlocal|lambda|and|or|not|in|is|True|False|None)/g,
        '<span class="text-blue-600 font-semibold">$1</span>'
      )
      .replace(
        /(print|len|range|list|dict|set|tuple|str|int|float|bool|type|isinstance|hasattr|getattr|setattr|delattr)/g,
        '<span class="text-purple-600 font-semibold">$1</span>'
      )
      .replace(/#(.*)$/gm, '<span class="text-gray-500 italic">#$1</span>')
      .replace(
        /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g,
        '<span class="text-green-600">$1$2$1</span>'
      )
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-600">$1</span>');
  };

  const displayCode = editable ? editableCode : code;
  const lines = displayCode.split("\n");

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      {/* Header */}
      {(title || !editable) && (
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
            </div>
            {title && (
              <span className="text-sm font-medium text-gray-700">{title}</span>
            )}
            <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">
              {language}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {runnable && language === "python" && (
              <>
                {pyodideLoading ? (
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Python...
                  </div>
                ) : pyodideReady ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Zap className="h-4 w-4" />
                    Python Ready
                  </div>
                ) : null}
                <button
                  onClick={async () => {
                    if (!pyodideReady || isRunning) return;
                    try {
                      setIsRunning(true);
                      setRunOutput("");
                      setExecutionTime(null);
                      const result = await runPython(displayCode);
                      setExecutionTime(result.executionTime);
                      if (result.isSuccess) {
                        setRunOutput(result.output || "(No output)");
                      } else {
                        setRunOutput(`Error: ${result.error}`);
                      }
                    } finally {
                      setIsRunning(false);
                    }
                  }}
                  disabled={!pyodideReady || isRunning}
                  className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                  title="Run code"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Run
                </button>
              </>
            )}
            {!editable && (
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-gray-800"
                title="Copy code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        <div className="w-full">
          <Editor
            value={displayCode}
            onChange={(value) => {
              if (editable) {
                handleCodeChange(value ?? "");
              }
            }}
            language={language || "python"}
            theme="vs-dark"
            path={`${(title || "snippet").toString().replace(/\s+/g, "-").toLowerCase()}.${language === "python" ? "py" : language || "txt"}`}
            height={`${Math.min(Math.max(lines.length * 22 + 24, 220), 600)}px`}
            options={{
              readOnly: !editable,
              lineNumbers: showLineNumbers ? "on" : "off",
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 4,
              detectIndentation: false,
              renderWhitespace: "selection",
              folding: true,
              fontSize: 14,
              cursorBlinking: "smooth",
              contextmenu: true,
            }}
          />
        </div>
      </div>

      {/* Output Panel for runnable snippets */}
      {runnable && runOutput && (
        <div
          className={`border-t border-gray-200 ${isErrorOutput ? "bg-red-50" : "bg-white"}`}
        >
          <div
            className={`px-4 py-2 text-xs font-medium ${isErrorOutput ? "text-red-700" : "text-gray-700"}`}
          >
            Output{executionTime !== null ? ` • ${executionTime}ms` : ""}:
          </div>
          <pre
            className={`whitespace-pre-wrap px-4 pb-4 text-sm ${isErrorOutput ? "text-red-800" : "text-gray-900"}`}
          >
            {runOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
