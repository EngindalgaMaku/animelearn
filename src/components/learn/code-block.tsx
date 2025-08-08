"use client";

import { useState } from "react";
import { Copy, CheckCircle, Play } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  runnable?: boolean;
  output?: string;
}

export default function CodeBlock({
  code,
  language = "python",
  title,
  runnable = false,
  output,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-900 shadow-lg">
      {/* Header */}
      {(title || runnable) && (
        <div className="flex items-center justify-between bg-gray-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
            </div>
            {title && (
              <span className="text-sm font-medium text-gray-300">{title}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {runnable && (
              <button className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-xs text-white transition-colors hover:bg-green-700">
                <Play className="h-3 w-3" />
                Run
              </button>
            )}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 rounded-md bg-gray-700 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-sm text-gray-100">
          <code className={`language-${language}`}>
            {code.split("\n").map((line, index) => (
              <div key={index} className="flex">
                <span className="mr-4 w-8 flex-shrink-0 select-none text-right text-gray-500">
                  {index + 1}
                </span>
                <span className="flex-1">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Output */}
      {output && (
        <div className="border-t border-gray-700 bg-gray-800">
          <div className="px-4 py-2 text-xs font-medium text-gray-400">
            Output:
          </div>
          <pre className="px-4 pb-4 text-sm text-green-400">{output}</pre>
        </div>
      )}
    </div>
  );
}
