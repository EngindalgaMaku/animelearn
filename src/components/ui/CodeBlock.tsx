"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  editable?: boolean;
  onChange?: (code: string) => void;
}

export default function CodeBlock({
  code,
  language = "python",
  title,
  showLineNumbers = true,
  editable = false,
  onChange,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [editableCode, setEditableCode] = useState(code);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
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
      .replace(
        /#(.*)$/gm,
        '<span class="text-gray-500 italic">#$1</span>'
      )
      .replace(
        /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g,
        '<span class="text-green-600">$1$2$1</span>'
      )
      .replace(
        /\b(\d+\.?\d*)\b/g,
        '<span class="text-orange-600">$1</span>'
      );
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
      {/* Header */}
      {(title || !editable) && (
        <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {title && (
              <span className="text-sm font-medium text-gray-700">{title}</span>
            )}
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              {language}
            </span>
          </div>
          
          {!editable && (
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
            </button>
          )}
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        {editable ? (
          <textarea
            value={editableCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full p-4 bg-transparent border-none focus:outline-none font-mono text-sm resize-none"
            style={{ minHeight: '200px' }}
          />
        ) : (
          <div className="flex">
            {/* Line Numbers */}
            {showLineNumbers && (
              <div className="flex-shrink-0 bg-gray-100 px-4 py-4 text-xs text-gray-400 font-mono select-none border-r border-gray-200">
                {lines.map((_, index) => (
                  <div key={index} className="leading-6">
                    {index + 1}
                  </div>
                ))}
              </div>
            )}
            
            {/* Code */}
            <div className="flex-1 p-4 font-mono text-sm bg-white overflow-x-auto">
              {lines.map((line, index) => (
                <div key={index} className="leading-6">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(line) || '&nbsp;'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}