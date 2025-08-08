"use client";

import { useState } from "react";
import { BookOpen, Code, Target, CheckCircle, Lock, Clock, Trophy } from "lucide-react";
import CodeBlock from "@/components/ui/CodeBlock";

interface LessonTabSystemProps {
  lesson: any;
  activeSection: "introduction" | "syntax" | "examples" | "exercise" | "quiz";
  onSectionChange: (section: "introduction" | "syntax" | "examples" | "exercise" | "quiz") => void;
  lessonStarted: boolean;
  timeOnContent: number;
  isCodeCorrect?: boolean;
  onStartLesson: () => void;
}

export default function LessonTabSystem({
  lesson,
  activeSection,
  onSectionChange,
  lessonStarted,
  timeOnContent,
  isCodeCorrect = false,
  onStartLesson
}: LessonTabSystemProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const tabs = [
    {
      id: "introduction",
      name: "Introduction",
      icon: BookOpen,
      color: "blue",
      unlocked: true,
      content: lesson?.content?.introduction || lesson?.description
    },
    {
      id: "syntax",
      name: "Syntax",
      icon: Code,
      color: "green",
      unlocked: lessonStarted,
      content: lesson?.content?.syntax
    },
    {
      id: "examples",
      name: "Examples",
      icon: Target,
      color: "purple",
      unlocked: lessonStarted && timeOnContent >= 120, // 2 minutes
      content: lesson?.content?.examples
    },
    {
      id: "exercise",
      name: "Practice",
      icon: Code,
      color: "orange",
      unlocked: lessonStarted && timeOnContent >= 300, // 5 minutes
      exercise: lesson?.exercise
    },
    {
      id: "quiz",
      name: "Test",
      icon: Trophy,
      color: "red",
      unlocked: lessonStarted && (timeOnContent >= 300 || isCodeCorrect),
      quiz: lesson?.quiz
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeSection);

  // Parse content and split into pages
  const parseContentIntoPages = (content: string) => {
    if (!content) return [];
    
    // Split content by sections or paragraphs
    const sections = content.split(/\n\s*\n/).filter(Boolean);
    const pages = [];
    
    for (let i = 0; i < sections.length; i += 2) {
      const pageContent = sections.slice(i, i + 2).join('\n\n');
      pages.push(pageContent);
    }
    
    return pages.length > 0 ? pages : [content];
  };

  const renderCodeBlocks = (content: string) => {
    if (!content) return null;

    // Handle existing HTML content and code blocks
    const parts = content.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3).trim();
        const lines = codeContent.split('\n');
        const language = lines[0].includes('python') ? 'python' : 'python';
        const code = lines.slice(1).join('\n') || codeContent;
        
        return (
          <div key={index} className="my-6">
            <CodeBlock
              code={code}
              language={language}
              title={`Example ${Math.floor(index / 2) + 1}`}
            />
          </div>
        );
      }
      
      // For HTML content that's already in the database, render it safely
      if (part.includes('<') && part.includes('>')) {
        // Clean and format the HTML
        const cleanHTML = part
          .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-3 text-gray-900">')
          .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-4 text-gray-900">')
          .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-4 text-gray-900">')
          .replace(/<div>/g, '<div class="mb-4">')
          .replace(/<p>/g, '<p class="mb-3 text-gray-700 leading-relaxed">')
          .replace(/<br\/>/g, '<br/>')
          .replace(/<br>/g, '<br/>')
          .replace(/⚡/g, '<span class="text-yellow-600">⚡</span>')
          .replace(/🎯/g, '<span class="text-blue-600">🎯</span>')
          .replace(/💡/g, '<span class="text-yellow-500">💡</span>')
          .replace(/🔥/g, '<span class="text-red-500">🔥</span>')
          .replace(/🐍/g, '<span class="text-green-600">🐍</span>')
          .replace(/⭐/g, '<span class="text-yellow-500">⭐</span>')
          .replace(/🚀/g, '<span class="text-purple-600">🚀</span>');
          
        return (
          <div key={index} className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
          </div>
        );
      }
      
      // Fallback for plain text - markdown style
      const lines = part.split('\n').filter(line => line.trim());
      return (
        <div key={index} className="prose prose-lg max-w-none space-y-4">
          {lines.map((line, lineIndex) => {
            // Handle headers
            if (line.startsWith('# ')) {
              return <h1 key={lineIndex} className="text-2xl font-bold mb-4 text-gray-900">{line.slice(2)}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={lineIndex} className="text-xl font-semibold mb-3 text-gray-900">{line.slice(3)}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={lineIndex} className="text-lg font-medium mb-2 text-gray-900">{line.slice(4)}</h3>;
            }
            
            // Handle lists
            if (line.startsWith('- ')) {
              return <li key={lineIndex} className="ml-4 text-gray-700 mb-2">• {line.slice(2)}</li>;
            }
            
            // Regular paragraph
            return (
              <p key={lineIndex} className="mb-4 text-gray-700 leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const getCurrentPages = () => {
    if (!currentTab?.content) return [];
    return parseContentIntoPages(currentTab.content);
  };

  const pages = getCurrentPages();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <nav className="flex space-x-0" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            const isUnlocked = tab.unlocked;
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSectionChange(tab.id as any);
                    setCurrentPage(0);
                  }
                }}
                disabled={!isUnlocked}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium border-b-2 transition-all duration-200
                  ${isActive
                    ? `border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50`
                    : isUnlocked
                      ? `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50`
                      : `border-transparent text-gray-300 cursor-not-allowed bg-gray-50`
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${!isUnlocked ? 'opacity-50' : ''}`} />
                <span>{tab.name}</span>
                {!isUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                {isActive && <CheckCircle className="w-4 h-4 text-green-500" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {!lessonStarted && activeSection === "introduction" ? (
          /* Start Lesson Prompt */
          <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Click the button below to begin this lesson and unlock all sections step by step.
            </p>
            <button
              onClick={onStartLesson}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Start Lesson</span>
            </button>
          </div>
        ) : currentTab?.unlocked ? (
          <div className="p-8">
            {/* Progress Requirements */}
            {lessonStarted && activeSection !== "exercise" && activeSection !== "quiz" && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">Progress Requirements</span>
                  </div>
                  <div className="text-blue-600 text-sm">
                    {Math.floor(timeOnContent / 60)}:{(timeOnContent % 60).toString().padStart(2, '0')} / 5:00
                  </div>
                </div>
                
                {timeOnContent < 300 && !isCodeCorrect && (
                  <div className="mt-3">
                    <p className="text-blue-700 text-sm mb-2">
                      📚 Spend 5 minutes learning to unlock Practice & Test sections
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((timeOnContent / 300) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {(timeOnContent >= 300 || isCodeCorrect) && (
                  <p className="mt-3 text-green-700 text-sm">
                    ✅ All sections unlocked! You can now access Practice and Test.
                  </p>
                )}
              </div>
            )}

            {/* Content with Pagination */}
            {pages.length > 0 && activeSection !== "exercise" && activeSection !== "quiz" ? (
              <div>
                {/* Page Content */}
                <div className="mb-8">
                  <div className="prose prose-lg max-w-none">
                    {renderCodeBlocks(pages[currentPage] || "")}
                  </div>
                </div>

                {/* Pagination */}
                {pages.length > 1 && (
                  <div className="flex items-center justify-between border-t pt-6">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span>← Previous</span>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Page {currentPage + 1} of {pages.length}
                      </span>
                      <div className="flex space-x-1">
                        {pages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === currentPage ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                      disabled={currentPage === pages.length - 1}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span>Next →</span>
                    </button>
                  </div>
                )}
              </div>
            ) : activeSection === "exercise" ? (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Practice Exercise</h3>
                <p className="text-gray-600">Interactive coding exercise will be displayed here</p>
              </div>
            ) : activeSection === "quiz" ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Knowledge Test</h3>
                <p className="text-gray-600">Quiz component will be displayed here</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
                <p className="text-gray-600">This section doesn't have content yet</p>
              </div>
            )}
          </div>
        ) : (
          /* Locked Content */
          <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Section Locked
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Complete the previous sections to unlock this content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}