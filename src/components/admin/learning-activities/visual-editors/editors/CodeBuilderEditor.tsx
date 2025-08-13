"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Wrench } from "lucide-react";

interface CodeBuilderContent {
  project: string;
  steps: any[];
  finalProject: any;
  requirements: string[];
}

interface CodeBuilderEditorProps {
  content: CodeBuilderContent;
  onChange: (content: CodeBuilderContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function CodeBuilderEditor({
  content,
  onChange,
  onValidation,
}: CodeBuilderEditorProps) {
  const [data, setData] = useState<CodeBuilderContent>(() => {
    const defaultData: CodeBuilderContent = {
      project: "",
      steps: [],
      finalProject: {},
      requirements: [],
    };
    return { ...defaultData, ...content };
  });

  useEffect(() => {
    setData((prevData) => ({ ...prevData, ...content }));
  }, [content]);

  useEffect(() => {
    const isValid = data.project.trim() !== "" && data.steps.length > 0;
    onValidation(isValid);
    onChange(data);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center space-x-2">
          <Wrench className="h-5 w-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Code Builder Editor
          </h3>
        </div>

        <div className="rounded-lg bg-teal-50 p-4">
          <p className="text-teal-800">
            This is a placeholder for the Code Builder editor. Full
            implementation will include step-by-step project building, modular
            programming concepts, and complete program construction.
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
            Code builder editor is ready for configuration
          </p>
        </div>
      </div>
    </div>
  );
}
