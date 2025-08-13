"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Brain } from "lucide-react";

interface MemoryGameContent {
  patterns: any[];
  gameSettings: any;
  scoring: any;
  levels: any[];
}

interface MemoryGameEditorProps {
  content: MemoryGameContent;
  onChange: (content: MemoryGameContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function MemoryGameEditor({
  content,
  onChange,
  onValidation,
}: MemoryGameEditorProps) {
  const [data, setData] = useState<MemoryGameContent>(() => {
    const defaultData: MemoryGameContent = {
      patterns: [],
      gameSettings: {},
      scoring: {},
      levels: [],
    };
    return { ...defaultData, ...content };
  });

  useEffect(() => {
    setData((prevData) => ({ ...prevData, ...content }));
  }, [content]);

  useEffect(() => {
    const isValid = data.patterns.length > 0;
    onValidation(isValid);
    onChange(data);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center space-x-2">
          <Brain className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Memory Game Editor
          </h3>
        </div>

        <div className="rounded-lg bg-pink-50 p-4">
          <p className="text-pink-800">
            This is a placeholder for the Memory Game editor. Full
            implementation will include pattern creation, memory challenges, and
            scoring systems.
          </p>
        </div>

        <div className="mt-4">
          <textarea
            value={JSON.stringify(data, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setData(parsed);
              } catch {}
            }}
            rows={10}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
            placeholder="Edit JSON content..."
          />
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-sm text-blue-800">
            Memory game editor is ready for configuration
          </p>
        </div>
      </div>
    </div>
  );
}
