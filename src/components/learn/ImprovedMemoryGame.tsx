"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Clock,
  Star,
  Diamond,
  CheckCircle,
  X,
  Trophy,
  Zap,
  Brain,
  HelpCircle,
  MessageSquare,
  ArrowDown,
  Target,
} from "lucide-react";

interface GameCard {
  id: string;
  text: string;
  pairId: string;
  isSelected: boolean;
  isMatched: boolean;
  isHighlighted: boolean;
  type: 'question' | 'answer';
}

interface GamePair {
  id: string;
  question: string;
  answer: string;
  isMatched: boolean;
}

interface ImprovedMemoryGameProps {
  activityId: string;
  content: {
    pairs: Array<{ id: number; text: string; match: string }>;
    timeLimit?: number;
    shuffleCards?: boolean;
  };
  diamondReward: number;
  experienceReward: number;
  onComplete: (score: number, timeSpent: number, success: boolean) => void;
  isCompleted?: boolean;
}

const ImprovedMemoryGame: React.FC<ImprovedMemoryGameProps> = ({
  activityId,
  content,
  diamondReward,
  experienceReward,
  onComplete,
  isCompleted = false,
}) => {
  const [questions, setQuestions] = useState<GameCard[]>([]);
  const [answers, setAnswers] = useState<GameCard[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<GameCard | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<GameCard | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(content.timeLimit || 300);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFirstCompletion, setIsFirstCompletion] = useState(!isCompleted);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Initialize cards with proper separation
  useEffect(() => {
    const questionCards: GameCard[] = [];
    const answerCards: GameCard[] = [];
    
    content.pairs.forEach((pair) => {
      // Question cards
      questionCards.push({
        id: `q-${pair.id}`,
        text: pair.text,
        pairId: pair.id.toString(),
        isSelected: false,
        isMatched: false,
        isHighlighted: false,
        type: 'question',
      });
      
      // Answer cards
      answerCards.push({
        id: `a-${pair.id}`,
        text: pair.match,
        pairId: pair.id.toString(),
        isSelected: false,
        isMatched: false,
        isHighlighted: false,
        type: 'answer',
      });
    });

    // Shuffle cards if enabled
    if (content.shuffleCards !== false) {
      // Shuffle questions and answers separately
      for (let i = questionCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questionCards[i], questionCards[j]] = [questionCards[j], questionCards[i]];
      }
      for (let i = answerCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answerCards[i], answerCards[j]] = [answerCards[j], answerCards[i]];
      }
    }

    setQuestions(questionCards);
    setAnswers(answerCards);
  }, [content]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && !gameCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameCompleted) {
      endGame(false);
    }

    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, timeLeft]);

  // Check for matches when both question and answer are selected
  useEffect(() => {
    if (selectedQuestion && selectedAnswer && !isProcessing) {
      setIsProcessing(true);
      
      // Check if they match
      if (selectedQuestion.pairId === selectedAnswer.pairId) {
        // Match found!
        setTimeout(() => {
          setQuestions(prev => prev.map(card =>
            card.pairId === selectedQuestion.pairId
              ? { ...card, isMatched: true, isSelected: false }
              : card
          ));
          setAnswers(prev => prev.map(card =>
            card.pairId === selectedAnswer.pairId
              ? { ...card, isMatched: true, isSelected: false }
              : card
          ));
          
          setMatchedPairs(prev => new Set([...prev, selectedQuestion.pairId]));
          setSelectedQuestion(null);
          setSelectedAnswer(null);
          setIsProcessing(false);
        }, 1000);
      } else {
        // No match
        setMistakes(prev => prev + 1);
        setTimeout(() => {
          setQuestions(prev => prev.map(card =>
            card.id === selectedQuestion.id
              ? { ...card, isSelected: false }
              : card
          ));
          setAnswers(prev => prev.map(card =>
            card.id === selectedAnswer.id
              ? { ...card, isSelected: false }
              : card
          ));
          setSelectedQuestion(null);
          setSelectedAnswer(null);
          setIsProcessing(false);
        }, 1500);
      }
    }
  }, [selectedQuestion, selectedAnswer, isProcessing]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.size === content.pairs.length && gameStarted) {
      endGame(true);
    }
  }, [matchedPairs, content.pairs.length, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    setShowInstructions(false);
  };

  const resetGame = () => {
    setSelectedQuestion(null);
    setSelectedAnswer(null);
    setMatchedPairs(new Set());
    setTimeLeft(content.timeLimit || 300);
    setGameStarted(false);
    setGameCompleted(false);
    setMistakes(0);
    setHintsUsed(0);
    setShowHint(false);
    setStartTime(null);
    setIsProcessing(false);
    setShowInstructions(true);
    
    // Reset all cards
    setQuestions(prev => prev.map(card => ({
      ...card,
      isSelected: false,
      isMatched: false,
      isHighlighted: false
    })));
    setAnswers(prev => prev.map(card => ({
      ...card,
      isSelected: false,
      isMatched: false,
      isHighlighted: false
    })));
  };

  const endGame = (success: boolean) => {
    setGameCompleted(true);
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    
    let score = 0;
    if (success) {
      const timeBonus = Math.max(0, (content.timeLimit || 300) - timeSpent) / (content.timeLimit || 300);
      const mistakesPenalty = Math.max(0, 1 - (mistakes * 0.1));
      const hintsBonus = Math.max(0, 1 - (hintsUsed * 0.05));
      score = Math.round(100 * timeBonus * mistakesPenalty * hintsBonus);
    }
    
    if (success && isFirstCompletion) {
      setIsFirstCompletion(false);
      onComplete(score, timeSpent, success);
    } else if (!success) {
      onComplete(score, timeSpent, success);
    }
  };

  const handleQuestionClick = (questionId: string) => {
    if (!gameStarted || gameCompleted || isProcessing) return;
    
    const question = questions.find(q => q.id === questionId);
    if (!question || question.isMatched) return;

    // If there's already a selected question, deselect it
    if (selectedQuestion) {
      setQuestions(prev => prev.map(card =>
        card.id === selectedQuestion.id
          ? { ...card, isSelected: false }
          : card
      ));
    }

    // Select the new question
    setQuestions(prev => prev.map(card =>
      card.id === questionId
        ? { ...card, isSelected: true }
        : card
    ));
    setSelectedQuestion(question);
  };

  const handleAnswerClick = (answerId: string) => {
    if (!gameStarted || gameCompleted || isProcessing) return;
    
    const answer = answers.find(a => a.id === answerId);
    if (!answer || answer.isMatched) return;

    // If there's already a selected answer, deselect it
    if (selectedAnswer) {
      setAnswers(prev => prev.map(card =>
        card.id === selectedAnswer.id
          ? { ...card, isSelected: false }
          : card
      ));
    }

    // Select the new answer
    setAnswers(prev => prev.map(card =>
      card.id === answerId
        ? { ...card, isSelected: true }
        : card
    ));
    setSelectedAnswer(answer);
  };

  const useHint = () => {
    if (hintsUsed >= 3 || gameCompleted) return;
    
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
    
    // Show a matching pair for 3 seconds
    const unmatchedQuestions = questions.filter(card => !card.isMatched);
    if (unmatchedQuestions.length > 0) {
      const randomQuestion = unmatchedQuestions[0];
      const matchingAnswer = answers.find(card => 
        card.pairId === randomQuestion.pairId && !card.isMatched
      );
      
      if (matchingAnswer) {
        setQuestions(prev => prev.map(card => 
          card.id === randomQuestion.id 
            ? { ...card, isHighlighted: true }
            : card
        ));
        setAnswers(prev => prev.map(card => 
          card.id === matchingAnswer.id 
            ? { ...card, isHighlighted: true }
            : card
        ));
        
        setTimeout(() => {
          setQuestions(prev => prev.map(card => ({ ...card, isHighlighted: false })));
          setAnswers(prev => prev.map(card => ({ ...card, isHighlighted: false })));
          setShowHint(false);
        }, 3000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Smart Memory Game</h2>
              <p className="text-purple-100">Match questions with their correct answers!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xl font-bold">{formatTime(timeLeft)}</div>
              <div className="text-sm text-purple-200">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{matchedPairs.size}/{content.pairs.length}</div>
              <div className="text-sm text-purple-200">Pairs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 rounded-xl bg-blue-50 border-2 border-blue-200 p-6"
          >
            <div className="flex items-start space-x-4">
              <Target className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Play</h3>
                <div className="text-blue-800 space-y-2">
                  <p>1. <strong>Select a question</strong> from the top section</p>
                  <p>2. <strong>Select an answer</strong> from the bottom section</p>
                  <p>3. If they match, both cards will be marked as completed!</p>
                  <p>4. Continue until all pairs are matched</p>
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm text-blue-700">
                  <span className="flex items-center space-x-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>Questions</span>
                  </span>
                  <ArrowDown className="h-4 w-4" />
                  <span className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Answers</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <X className="h-4 w-4 text-red-500" />
            <span>Mistakes: {mistakes}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Hints: {hintsUsed}/3</span>
          </div>
          {selectedQuestion && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <HelpCircle className="h-4 w-4" />
              <span>Question selected</span>
            </div>
          )}
          {selectedAnswer && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <MessageSquare className="h-4 w-4" />
              <span>Answer selected</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {!gameStarted && !gameCompleted && (
            <button
              onClick={startGame}
              className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              <Star className="h-4 w-4" />
              <span>Start Game</span>
            </button>
          )}
          
          {gameStarted && !gameCompleted && (
            <button
              onClick={useHint}
              disabled={hintsUsed >= 3 || showHint}
              className="flex items-center space-x-2 rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="h-4 w-4" />
              <span>Hint</span>
            </button>
          )}
          
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="space-y-6">
        {/* Questions Section */}
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
          <div className="mb-3 flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Questions</h3>
            <span className="text-sm text-blue-600">
              ({questions.filter(q => !q.isMatched).length} remaining)
            </span>
          </div>
          
          <div className={`grid gap-3 ${
            questions.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' :
            questions.length <= 6 ? 'grid-cols-2 sm:grid-cols-3' :
            'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
          }`}>
            {questions.map((question) => (
              <motion.div
                key={question.id}
                layout
                whileHover={{ scale: gameStarted && !question.isMatched ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className={`relative aspect-video min-h-[80px] ${
                  !gameStarted || question.isMatched || isProcessing
                    ? 'cursor-default opacity-60'
                    : 'cursor-pointer'
                } transition-all duration-200`}
                onClick={() => handleQuestionClick(question.id)}
              >
                <div className={`
                  absolute inset-0 rounded-lg border-2 transition-all duration-300 p-3
                  ${question.isMatched
                    ? 'border-green-400 bg-green-100'
                    : question.isHighlighted
                      ? 'border-yellow-400 bg-yellow-100 shadow-lg ring-2 ring-yellow-300'
                      : question.isSelected
                        ? 'border-blue-500 bg-blue-100 shadow-lg ring-2 ring-blue-300'
                        : 'border-blue-300 bg-white hover:border-blue-500 hover:shadow-md'
                  }
                `}>
                  <div className="flex h-full items-center justify-center">
                    <div className={`text-center font-medium text-sm leading-relaxed ${
                      question.isMatched ? 'text-green-700' :
                      question.isHighlighted ? 'text-yellow-700' :
                      question.isSelected ? 'text-blue-700' :
                      'text-blue-800'
                    }`}>
                      {question.text}
                    </div>
                  </div>
                  
                  {question.isMatched && (
                    <div className="absolute -right-2 -top-2">
                      <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                  
                  {question.isSelected && !question.isMatched && (
                    <div className="absolute -right-2 -top-2">
                      <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Q</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3 text-gray-500">
            <div className="h-px w-20 bg-gray-300"></div>
            <ArrowDown className="h-6 w-6" />
            <div className="h-px w-20 bg-gray-300"></div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
          <div className="mb-3 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Answers</h3>
            <span className="text-sm text-green-600">
              ({answers.filter(a => !a.isMatched).length} remaining)
            </span>
          </div>
          
          <div className={`grid gap-3 ${
            answers.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' :
            answers.length <= 6 ? 'grid-cols-2 sm:grid-cols-3' :
            'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
          }`}>
            {answers.map((answer) => (
              <motion.div
                key={answer.id}
                layout
                whileHover={{ scale: gameStarted && !answer.isMatched ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className={`relative aspect-video min-h-[80px] ${
                  !gameStarted || answer.isMatched || isProcessing
                    ? 'cursor-default opacity-60'
                    : 'cursor-pointer'
                } transition-all duration-200`}
                onClick={() => handleAnswerClick(answer.id)}
              >
                <div className={`
                  absolute inset-0 rounded-lg border-2 transition-all duration-300 p-3
                  ${answer.isMatched
                    ? 'border-green-400 bg-green-100'
                    : answer.isHighlighted
                      ? 'border-yellow-400 bg-yellow-100 shadow-lg ring-2 ring-yellow-300'
                      : answer.isSelected
                        ? 'border-green-500 bg-green-100 shadow-lg ring-2 ring-green-300'
                        : 'border-green-300 bg-white hover:border-green-500 hover:shadow-md'
                  }
                `}>
                  <div className="flex h-full items-center justify-center">
                    <div className={`text-center font-medium text-sm leading-relaxed ${
                      answer.isMatched ? 'text-green-700' :
                      answer.isHighlighted ? 'text-yellow-700' :
                      answer.isSelected ? 'text-green-700' :
                      'text-green-800'
                    }`}>
                      {answer.text}
                    </div>
                  </div>
                  
                  {answer.isMatched && (
                    <div className="absolute -right-2 -top-2">
                      <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                  
                  {answer.isSelected && !answer.isMatched && (
                    <div className="absolute -right-2 -top-2">
                      <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {gameCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="text-center">
                {matchedPairs.size === content.pairs.length ? (
                  <>
                    <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      Perfect! 🎉
                    </h3>
                    <p className="mb-4 text-gray-600">
                      You matched all questions with their answers!
                    </p>
                    
                    <div className="mb-6 rounded-lg bg-gray-50 p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Final Score</div>
                          <div className={`text-xl font-bold ${getScoreColor(
                            Math.round(100 * (1 - mistakes * 0.1) * (1 - hintsUsed * 0.05))
                          )}`}>
                            {Math.round(100 * (1 - mistakes * 0.1) * (1 - hintsUsed * 0.05))}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Time Spent</div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatTime((content.timeLimit || 300) - timeLeft)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Mistakes</div>
                          <div className="text-xl font-bold text-red-600">{mistakes}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Hints Used</div>
                          <div className="text-xl font-bold text-yellow-600">{hintsUsed}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 flex items-center justify-center space-x-6">
                      {isFirstCompletion ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <Diamond className="h-5 w-5 text-yellow-500" />
                            <span className="font-bold text-yellow-600">+{diamondReward}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5 text-purple-500" />
                            <span className="font-bold text-purple-600">+{experienceReward} XP</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Practice completed! No rewards for replay.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="mx-auto mb-4 h-16 w-16 text-red-500" />
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      Time's Up! ⏰
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Don't worry, try again to improve your score!
                    </p>
                  </>
                )}
                
                <button
                  onClick={resetGame}
                  className="w-full rounded-lg bg-purple-600 py-3 text-white hover:bg-purple-700"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImprovedMemoryGame;