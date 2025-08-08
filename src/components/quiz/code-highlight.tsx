"use client";

import { useEffect, useState } from "react";

interface CodeHighlightProps {
  code: string;
  language?: string;
  inline?: boolean;
}

export default function CodeHighlight({ code, language = "python", inline = false }: CodeHighlightProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    // Simple Python syntax highlighting
    const highlight = (text: string) => {
      let highlighted = text;
      
      // Keywords
      const keywords = [
        'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'as',
        'try', 'except', 'finally', 'with', 'lambda', 'yield', 'break', 'continue', 'pass',
        'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None', 'print', 'len', 'range',
        'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple'
      ];
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span class="text-purple-300 font-semibold">${keyword}</span>`);
      });
      
      // Strings
      highlighted = highlighted.replace(/'([^']*?)'/g, '<span class="text-green-300">\'$1\'</span>');
      highlighted = highlighted.replace(/"([^"]*?)"/g, '<span class="text-green-300">"$1"</span>');
      
      // Numbers
      highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="text-blue-300">$&</span>');
      
      // Comments
      highlighted = highlighted.replace(/#.*$/gm, '<span class="text-gray-400 italic">$&</span>');
      
      // Functions
      highlighted = highlighted.replace(/(\w+)\(/g, '<span class="text-yellow-300">$1</span>(');
      
      // Operators
      highlighted = highlighted.replace(/([+\-*/%=<>!]+)/g, '<span class="text-pink-300">$1</span>');
      
      return highlighted;
    };

    setHighlightedCode(highlight(code));
  }, [code]);

  if (inline) {
    return (
      <code 
        className="bg-gray-800 text-gray-100 px-2 py-1 rounded text-sm font-mono border border-gray-600"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden my-4">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-gray-400 font-medium">{language}</span>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code 
          className="text-gray-100 text-sm font-mono leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}