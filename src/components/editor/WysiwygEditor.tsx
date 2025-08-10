"use client";

import React, { useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onImageUpload?: (file: File) => Promise<string | null>;
}

export default function WysiwygEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  onImageUpload,
}: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  // Format commands
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertHTML = (html: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const div = document.createElement("div");
        div.innerHTML = html;
        const fragment = document.createDocumentFragment();

        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }

        range.insertNode(fragment);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      handleInput();
    }
  };

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      try {
        const url = await onImageUpload(file);
        if (url) {
          insertHTML(
            `<img src="${url}" alt="" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`
          );
        }
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      const selection = window.getSelection();
      const selectedText = selection?.toString() || "Link";
      insertHTML(
        `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${selectedText}</a>`
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Handle common shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "b":
          event.preventDefault();
          execCommand("bold");
          break;
        case "i":
          event.preventDefault();
          execCommand("italic");
          break;
        case "u":
          event.preventDefault();
          execCommand("underline");
          break;
      }
    }
  };

  // Toolbar buttons configuration
  const toolbarButtons = [
    {
      icon: Type,
      title: "Heading 2",
      action: () => execCommand("formatBlock", "h2"),
    },
    {
      icon: Bold,
      title: "Bold (Ctrl+B)",
      action: () => execCommand("bold"),
    },
    {
      icon: Italic,
      title: "Italic (Ctrl+I)",
      action: () => execCommand("italic"),
    },
    {
      icon: Underline,
      title: "Underline (Ctrl+U)",
      action: () => execCommand("underline"),
    },
    {
      icon: List,
      title: "Bullet List",
      action: () => execCommand("insertUnorderedList"),
    },
    {
      icon: LinkIcon,
      title: "Insert Link",
      action: insertLink,
    },
    {
      icon: Code,
      title: "Code Block",
      action: () => {
        const selection = window.getSelection();
        const selectedText = selection?.toString() || "code";
        insertHTML(
          `<pre style="background: #f3f4f6; padding: 12px; border-radius: 6px; overflow-x: auto; font-family: monospace;"><code>${selectedText}</code></pre>`
        );
      },
    },
    {
      icon: AlignLeft,
      title: "Align Left",
      action: () => execCommand("justifyLeft"),
    },
    {
      icon: AlignCenter,
      title: "Align Center",
      action: () => execCommand("justifyCenter"),
    },
    {
      icon: AlignRight,
      title: "Align Right",
      action: () => execCommand("justifyRight"),
    },
  ];

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-300 ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-gray-300 bg-gray-50 p-3">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            className="rounded p-2 text-gray-700 transition-colors hover:bg-gray-200"
            title={button.title}
          >
            <button.icon className="h-4 w-4" />
          </button>
        ))}

        <div className="mx-2 h-8 border-l border-gray-300"></div>

        {/* Image Upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded p-2 text-gray-700 transition-colors hover:bg-gray-200"
          title="Insert Image"
          disabled={!onImageUpload}
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="min-h-[300px] p-4 focus:outline-none"
        style={{
          lineHeight: "1.6",
          fontSize: "16px",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        div[contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }

        div[contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 16px 0;
        }

        div[contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 14px 0;
        }

        div[contenteditable] h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 12px 0;
        }

        div[contenteditable] p {
          margin: 8px 0;
        }

        div[contenteditable] ul {
          margin: 8px 0;
          padding-left: 24px;
        }

        div[contenteditable] ol {
          margin: 8px 0;
          padding-left: 24px;
        }

        div[contenteditable] li {
          margin: 4px 0;
        }

        div[contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          color: #6b7280;
        }

        div[contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }

        div[contenteditable] strong {
          font-weight: bold;
        }

        div[contenteditable] em {
          font-style: italic;
        }

        div[contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
