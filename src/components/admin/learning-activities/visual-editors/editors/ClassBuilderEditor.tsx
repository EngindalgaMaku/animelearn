"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Building } from "lucide-react";

interface ClassBuilderContent {
  className: string;
  attributes: any[];
  methods: any[];
  inheritance: any;
  examples: string[];
  challenges: string[];
}

interface ClassBuilderEditorProps {
  content: ClassBuilderContent;
  onChange: (content: ClassBuilderContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function ClassBuilderEditor({
  content,
  onChange,
  onValidation,
}: ClassBuilderEditorProps) {
  const [data, setData] = useState<ClassBuilderContent>(() => {
    const defaultData: ClassBuilderContent = {
      className: "",
      attributes: [],
      methods: [],
      inheritance: {},
      examples: [],
      challenges: [],
    };
    return { ...defaultData, ...content };
  });

  useEffect(() => {
    setData((prevData) => ({ ...prevData, ...content }));
  }, [content]);

  useEffect(() => {
    const isValid = data.className.trim() !== "" && data.methods.length > 0;
    onValidation(isValid);
    onChange(data);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center space-x-2">
          <Building className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Class Builder Editor
          </h3>
        </div>

        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-purple-800">
            This is a placeholder for the Class Builder editor. Full
            implementation will include OOP concepts, class design, method
            implementation, and inheritance structures.
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
            Class builder editor is ready for configuration
          </p>
        </div>
      </div>
    </div>
  );
}
