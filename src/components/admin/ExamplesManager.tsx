"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Play,
  Copy,
  ChevronUp,
  ChevronDown,
  Code,
  Eye,
  Save,
  X,
} from "lucide-react";

interface Example {
  id: string;
  title: string;
  description: string;
  code: string;
  output?: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
  isInteractive: boolean;
}

interface ExamplesManagerProps {
  examples: Example[];
  onChange: (examples: Example[]) => void;
}

export default function ExamplesManager({ examples, onChange }: ExamplesManagerProps) {
  const [editingExample, setEditingExample] = useState<Example | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExample, setNewExample] = useState<Partial<Example>>({
    title: "",
    description: "",
    code: "",
    output: "",
    explanation: "",
    difficulty: 'easy',
    isInteractive: false,
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addExample = () => {
    if (!newExample.title || !newExample.code) {
      alert("Title and code are required");
      return;
    }

    const example: Example = {
      id: generateId(),
      title: newExample.title!,
      description: newExample.description || "",
      code: newExample.code!,
      output: newExample.output,
      explanation: newExample.explanation,
      difficulty: newExample.difficulty!,
      order: examples.length + 1,
      isInteractive: newExample.isInteractive || false,
    };

    onChange([...examples, example]);
    setNewExample({
      title: "",
      description: "",
      code: "",
      output: "",
      explanation: "",
      difficulty: 'easy',
      isInteractive: false,
    });
    setShowCreateForm(false);
  };

  const updateExample = (id: string, updates: Partial<Example>) => {
    const updated = examples.map(ex => 
      ex.id === id ? { ...ex, ...updates } : ex
    );
    onChange(updated);
    setEditingExample(null);
  };

  const deleteExample = (id: string) => {
    if (confirm("Are you sure you want to delete this example?")) {
      const filtered = examples.filter(ex => ex.id !== id);
      onChange(filtered);
    }
  };

  const duplicateExample = (example: Example) => {
    const duplicate: Example = {
      ...example,
      id: generateId(),
      title: `${example.title} (Copy)`,
      order: examples.length + 1,
    };
    onChange([...examples, duplicate]);
  };

  const moveExample = (id: string, direction: 'up' | 'down') => {
    const index = examples.findIndex(ex => ex.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === examples.length - 1)
    ) {
      return;
    }

    const newExamples = [...examples];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newExamples[index], newExamples[swapIndex]] = 
    [newExamples[swapIndex], newExamples[index]];

    // Update order
    newExamples.forEach((ex, idx) => {
      ex.order = idx + 1;
    });

    onChange(newExamples);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ExampleForm = ({ 
    example, 
    onSave, 
    onCancel 
  }: { 
    example: Partial<Example>; 
    onSave: (example: Partial<Example>) => void;
    onCancel: () => void;
  }) => (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={example.title || ""}
            onChange={(e) => onSave({ ...example, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Example title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={example.difficulty || 'easy'}
            onChange={(e) => onSave({ ...example, difficulty: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={example.description || ""}
          onChange={(e) => onSave({ ...example, description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Brief description of what this example demonstrates"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Code *
        </label>
        <textarea
          value={example.code || ""}
          onChange={(e) => onSave({ ...example, code: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          placeholder="# Write Python code here
print('Hello, World!')"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Output
          </label>
          <textarea
            value={example.output || ""}
            onChange={(e) => onSave({ ...example, output: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="Hello, World!"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Explanation
          </label>
          <textarea
            value={example.explanation || ""}
            onChange={(e) => onSave({ ...example, explanation: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Explain what this code does..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={example.isInteractive || false}
            onChange={(e) => onSave({ ...example, isInteractive: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Interactive (students can run/edit)</span>
        </label>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (example.title && example.code) {
                if ('id' in example) {
                  updateExample(example.id!, example);
                } else {
                  addExample();
                }
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4 inline mr-1" />
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Code Examples</h3>
          <p className="text-sm text-gray-600">
            {examples.length} example{examples.length !== 1 ? 's' : ''} • Interactive examples help students learn by doing
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Example</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <ExampleForm
          example={newExample}
          onSave={setNewExample}
          onCancel={() => {
            setShowCreateForm(false);
            setNewExample({
              title: "",
              description: "",
              code: "",
              output: "",
              explanation: "",
              difficulty: 'easy',
              isInteractive: false,
            });
          }}
        />
      )}

      {/* Examples List */}
      <div className="space-y-3">
        {examples.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Code className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No examples yet. Add your first code example to get started!</p>
          </div>
        ) : (
          examples.map((example, index) => (
            <div key={example.id} className="border border-gray-200 rounded-lg bg-white">
              {editingExample?.id === example.id ? (
                <div className="p-4">
                  <ExampleForm
                    example={editingExample}
                    onSave={(updated) => setEditingExample(updated as Example)}
                    onCancel={() => setEditingExample(null)}
                  />
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{example.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(example.difficulty)}`}>
                          {example.difficulty}
                        </span>
                        {example.isInteractive && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            <Play className="h-3 w-3 inline mr-1" />
                            Interactive
                          </span>
                        )}
                        <span className="text-xs text-gray-500">#{example.order}</span>
                      </div>
                      
                      {example.description && (
                        <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                      )}
                      
                      <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono overflow-x-auto mb-2">
                        <pre>{example.code}</pre>
                      </div>
                      
                      {example.output && (
                        <div className="bg-gray-50 border-l-4 border-blue-400 p-2 text-sm">
                          <div className="text-xs text-gray-500 mb-1">Output:</div>
                          <pre className="font-mono">{example.output}</pre>
                        </div>
                      )}
                      
                      {example.explanation && (
                        <div className="mt-2 text-sm text-gray-700 bg-blue-50 p-2 rounded">
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        type="button"
                        onClick={() => moveExample(example.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExample(example.id, 'down')}
                        disabled={index === examples.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateExample(example)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingExample(example)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteExample(example.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}