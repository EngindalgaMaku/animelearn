"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  Eye,
  Edit,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  showPreview?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  height = "300px",
  showPreview = true,
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && !isPreview) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isPreview]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertHTML = (html: string) => {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const div = document.createElement("div");
        div.innerHTML = html;
        const frag = document.createDocumentFragment();
        let child;
        while ((child = div.firstChild)) {
          frag.appendChild(child);
        }
        range.insertNode(frag);
        handleInput();
      }
    }
  };

  const formatters = [
    {
      name: "Bold",
      icon: Bold,
      command: "bold",
      shortcut: "Ctrl+B",
    },
    {
      name: "Italic",
      icon: Italic,
      command: "italic",
      shortcut: "Ctrl+I",
    },
    {
      name: "Underline",
      icon: Underline,
      command: "underline",
      shortcut: "Ctrl+U",
    },
    {
      name: "Bullet List",
      icon: List,
      command: "insertUnorderedList",
    },
    {
      name: "Numbered List",
      icon: ListOrdered,
      command: "insertOrderedList",
    },
    {
      name: "Quote",
      icon: Quote,
      action: () => insertHTML("<blockquote>Quote text here</blockquote>"),
    },
    {
      name: "Code Block",
      icon: Code,
      action: () => insertHTML("<pre><code>Your code here</code></pre>"),
    },
    {
      name: "Align Left",
      icon: AlignLeft,
      command: "justifyLeft",
    },
    {
      name: "Align Center",
      icon: AlignCenter,
      command: "justifyCenter",
    },
    {
      name: "Align Right",
      icon: AlignRight,
      command: "justifyRight",
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          execCommand("bold");
          break;
        case "i":
          e.preventDefault();
          execCommand("italic");
          break;
        case "u":
          e.preventDefault();
          execCommand("underline");
          break;
      }
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      insertHTML(`<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`);
    }
  };

  const insertCodeExample = () => {
    const code = prompt("Enter Python code:");
    if (code) {
      insertHTML(`
        <div class="code-example bg-gray-900 text-green-400 p-4 rounded-lg my-4">
          <div class="text-xs text-gray-400 mb-2">Python</div>
          <pre><code>${code}</code></pre>
        </div>
      `);
    }
  };

  const insertMathFormula = () => {
    const formula = prompt("Enter math formula (LaTeX):");
    if (formula) {
      insertHTML(`<span class="math-formula bg-blue-50 px-2 py-1 rounded text-blue-800">${formula}</span>`);
    }
  };

  const getTextContent = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
            {formatters.slice(0, 3).map((formatter) => {
              const Icon = formatter.icon;
              return (
                <button
                  key={formatter.name}
                  type="button"
                  onClick={() => 
                    formatter.command 
                      ? execCommand(formatter.command) 
                      : formatter.action?.()
                  }
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                  title={`${formatter.name} ${formatter.shortcut ? `(${formatter.shortcut})` : ""}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          {/* Lists */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
            {formatters.slice(3, 5).map((formatter) => {
              const Icon = formatter.icon;
              return (
                <button
                  key={formatter.name}
                  type="button"
                  onClick={() => execCommand(formatter.command!)}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                  title={formatter.name}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          {/* Alignment */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
            {formatters.slice(7, 10).map((formatter) => {
              const Icon = formatter.icon;
              return (
                <button
                  key={formatter.name}
                  type="button"
                  onClick={() => execCommand(formatter.command!)}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                  title={formatter.name}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          {/* Special Elements */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => formatters[5].action?.()}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={insertCodeExample}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Code Example"
            >
              <Code className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={insertLink}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Insert Link"
            >
              <Link className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={insertImage}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Insert Image"
            >
              <Image className="h-4 w-4" />
            </button>
          </div>

          {/* Special Inserts */}
          <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={insertMathFormula}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors text-xs font-mono"
              title="Math Formula"
            >
              ∑
            </button>
            <button
              type="button"
              onClick={() => insertHTML('<div class="highlight bg-yellow-100 p-2 rounded my-2">💡 <strong>Important:</strong> Add your note here</div>')}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Highlight Box"
            >
              💡
            </button>
            <button
              type="button"
              onClick={() => insertHTML('<div class="warning bg-orange-100 border-l-4 border-orange-400 p-2 my-2">⚠️ <strong>Warning:</strong> Add warning here</div>')}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Warning Box"
            >
              ⚠️
            </button>
          </div>

          {/* Preview Toggle */}
          {showPreview && (
            <div className="flex items-center ml-auto">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className={`p-1.5 rounded transition-colors ${
                  isPreview 
                    ? "bg-blue-100 text-blue-600" 
                    : "hover:bg-gray-200"
                }`}
                title={isPreview ? "Edit Mode" : "Preview Mode"}
              >
                {isPreview ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor/Preview */}
      {isPreview ? (
        <div 
          className="p-4 prose max-w-none"
          style={{ minHeight: height }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="p-4 focus:outline-none"
          style={{ minHeight: height }}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      )}

      {/* Status Bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>
            {getTextContent(value).length} characters
          </span>
          <span>
            {isPreview ? "Preview Mode" : "Edit Mode"}
          </span>
        </div>
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        .prose h1 { @apply text-3xl font-bold mb-4; }
        .prose h2 { @apply text-2xl font-bold mb-3; }
        .prose h3 { @apply text-xl font-bold mb-2; }
        .prose p { @apply mb-3; }
        .prose blockquote { @apply border-l-4 border-blue-400 pl-4 italic my-4; }
        .prose ul { @apply list-disc list-inside mb-3; }
        .prose ol { @apply list-decimal list-inside mb-3; }
        .prose code { @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono; }
        .prose pre { @apply bg-gray-900 text-green-400 p-4 rounded my-4 overflow-x-auto; }
        .prose a { @apply text-blue-600 hover:underline; }
        .prose img { @apply max-w-full h-auto rounded my-4; }
      `}</style>
    </div>
  );
}