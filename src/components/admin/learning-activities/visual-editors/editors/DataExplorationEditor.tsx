"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Database } from "lucide-react";

interface DataExplorationContent {
  dataset: any;
  tasks: any[];
  tools: string[];
  learningGoals: string[];
}

interface DataExplorationEditorProps {
  content: DataExplorationContent;
  onChange: (content: DataExplorationContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function DataExplorationEditor({
  content,
  onChange,
  onValidation,
}: DataExplorationEditorProps) {
  const [data, setData] = useState<DataExplorationContent>(() => {
    const defaultData: DataExplorationContent = {
      dataset: {},
      tasks: [],
      tools: [],
      learningGoals: [],
    };
    return { ...defaultData, ...content };
  });

  useEffect(() => {
    setData((prevData) => ({ ...prevData, ...content }));
  }, [content]);

  useEffect(() => {
    const isValid = data.tasks.length > 0;
    onValidation(isValid);
    onChange(data);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center space-x-2">
          <Database className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Data Exploration Editor
          </h3>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-green-800">
            This is a placeholder for the Data Exploration editor. Full
            implementation will include dataset configuration, analysis tasks,
            and interactive data visualization tools.
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
            Data exploration editor is ready for configuration
          </p>
        </div>
      </div>
    </div>
  );
}
