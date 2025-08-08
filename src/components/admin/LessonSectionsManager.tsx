"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Code,
  HelpCircle,
  Target,
  FileText,
  Video,
  Image,
  CheckSquare,
  Lightbulb,
  AlertTriangle,
  Save,
  X,
} from "lucide-react";
import RichTextEditor from "./RichTextEditor";

interface LessonSection {
  id: string;
  title: string;
  type: 'intro' | 'theory' | 'example' | 'practice' | 'quiz' | 'summary' | 'media' | 'exercise';
  content: string;
  order: number;
  isRequired: boolean;
  estimatedTime: number; // minutes
  metadata?: {
    codeLanguage?: string;
    quizQuestions?: number;
    mediaUrl?: string;
    mediaType?: 'video' | 'image' | 'audio';
    exerciseType?: 'coding' | 'multiple-choice' | 'fill-blank';
  };
}

interface LessonSectionsManagerProps {
  sections: LessonSection[];
  onChange: (sections: LessonSection[]) => void;
}

const sectionTypes = [
  {
    type: 'intro',
    label: 'Introduction',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-800',
    description: 'Course introduction and objectives'
  },
  {
    type: 'theory',
    label: 'Theory',
    icon: FileText,
    color: 'bg-purple-100 text-purple-800',
    description: 'Theoretical concepts and explanations'
  },
  {
    type: 'example',
    label: 'Example',
    icon: Code,
    color: 'bg-green-100 text-green-800',
    description: 'Code examples and demonstrations'
  },
  {
    type: 'practice',
    label: 'Practice',
    icon: Target,
    color: 'bg-orange-100 text-orange-800',
    description: 'Hands-on practice exercises'
  },
  {
    type: 'quiz',
    label: 'Quiz',
    icon: HelpCircle,
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Knowledge assessment questions'
  },
  {
    type: 'media',
    label: 'Media',
    icon: Video,
    color: 'bg-pink-100 text-pink-800',
    description: 'Videos, images, or audio content'
  },
  {
    type: 'exercise',
    label: 'Exercise',
    icon: CheckSquare,
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Interactive coding exercises'
  },
  {
    type: 'summary',
    label: 'Summary',
    icon: Lightbulb,
    color: 'bg-gray-100 text-gray-800',
    description: 'Key takeaways and conclusion'
  }
];

export default function LessonSectionsManager({ sections, onChange }: LessonSectionsManagerProps) {
  const [editingSection, setEditingSection] = useState<LessonSection | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('theory');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createSection = () => {
    const sectionType = sectionTypes.find(t => t.type === selectedType)!;
    
    const newSection: LessonSection = {
      id: generateId(),
      title: `New ${sectionType.label}`,
      type: selectedType as any,
      content: '',
      order: sections.length + 1,
      isRequired: false,
      estimatedTime: 5,
      metadata: {}
    };

    onChange([...sections, newSection]);
    setEditingSection(newSection);
    setShowCreateForm(false);
  };

  const updateSection = (id: string, updates: Partial<LessonSection>) => {
    const updated = sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    );
    onChange(updated);
  };

  const deleteSection = (id: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      const filtered = sections.filter(section => section.id !== id);
      // Update order
      filtered.forEach((section, index) => {
        section.order = index + 1;
      });
      onChange(filtered);
    }
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(section => section.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newSections[index], newSections[swapIndex]] = 
    [newSections[swapIndex], newSections[index]];

    // Update order
    newSections.forEach((section, idx) => {
      section.order = idx + 1;
    });

    onChange(newSections);
  };

  const getSectionTypeInfo = (type: string) => {
    return sectionTypes.find(t => t.type === type) || sectionTypes[0];
  };

  const SectionForm = ({ section }: { section: LessonSection }) => {
    const typeInfo = getSectionTypeInfo(section.type);
    
    return (
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${typeInfo.color}`}>
              <typeInfo.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{typeInfo.label} Section</h4>
              <p className="text-sm text-gray-600">{typeInfo.description}</p>
            </div>
          </div>
          <button
            onClick={() => setEditingSection(null)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title *
            </label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter section title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Time (min)
            </label>
            <input
              type="number"
              value={section.estimatedTime}
              onChange={(e) => updateSection(section.id, { estimatedTime: parseInt(e.target.value) || 5 })}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Section-specific metadata */}
        {section.type === 'media' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media URL
              </label>
              <input
                type="url"
                value={section.metadata?.mediaUrl || ''}
                onChange={(e) => updateSection(section.id, { 
                  metadata: { ...section.metadata, mediaUrl: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media Type
              </label>
              <select
                value={section.metadata?.mediaType || 'video'}
                onChange={(e) => updateSection(section.id, { 
                  metadata: { ...section.metadata, mediaType: e.target.value as any }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
              </select>
            </div>
          </div>
        )}

        {section.type === 'quiz' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions
            </label>
            <input
              type="number"
              value={section.metadata?.quizQuestions || 5}
              onChange={(e) => updateSection(section.id, { 
                metadata: { ...section.metadata, quizQuestions: parseInt(e.target.value) || 5 }
              })}
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {(section.type === 'example' || section.type === 'exercise') && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Programming Language
            </label>
            <select
              value={section.metadata?.codeLanguage || 'python'}
              onChange={(e) => updateSection(section.id, { 
                metadata: { ...section.metadata, codeLanguage: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
          </div>
        )}

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={section.isRequired}
              onChange={(e) => updateSection(section.id, { isRequired: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Required section (students must complete)</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            value={section.content}
            onChange={(content) => updateSection(section.id, { content })}
            placeholder={`Write your ${typeInfo.label.toLowerCase()} content here...`}
            height="400px"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setEditingSection(null)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            <span>Save Section</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lesson Sections</h3>
          <p className="text-sm text-gray-600">
            {sections.length} section{sections.length !== 1 ? 's' : ''} • 
            {sections.reduce((total, section) => total + section.estimatedTime, 0)} min total
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-4">Choose Section Type</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {sectionTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => setSelectedType(type.type)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedType === type.type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-2 rounded-lg mb-2 ${type.color}`}>
                    <type.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">{type.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={createSection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Section
            </button>
          </div>
        </div>
      )}

      {/* Editing Section */}
      {editingSection && (
        <SectionForm section={editingSection} />
      )}

      {/* Sections List */}
      <div className="space-y-3">
        {sections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No sections yet. Add your first section to get started!</p>
          </div>
        ) : (
          sections.map((section, index) => {
            const typeInfo = getSectionTypeInfo(section.type);
            
            return (
              <div key={section.id} className="border border-gray-200 rounded-lg bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">#{section.order}</span>
                      <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                        <typeInfo.icon className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{section.title}</h4>
                        {section.isRequired && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{typeInfo.label}</span>
                        <span>{section.estimatedTime} min</span>
                        <span>{section.content.length} chars</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingSection(section)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {section.content && !editingSection && (
                  <div className="mt-3 text-sm text-gray-600 border-t pt-3">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: section.content.substring(0, 200) + (section.content.length > 200 ? '...' : '')
                      }} 
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}