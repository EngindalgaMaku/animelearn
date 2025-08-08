'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Diamond, Star, Trophy, CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: number;
  explanation?: string;
  userAnswer?: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  date: string;
  diamondReward: number;
  experienceReward: number;
  questions: Question[];
  totalQuestions: number;
}

interface QuizAttempt {
  id: string;
  score: number;
  timeSpent: number;
  diamondsEarned: number;
  experienceEarned: number;
  completedAt: string;
}

interface DailyMiniQuizProps {
  className?: string;
}

const DailyMiniQuiz: React.FC<DailyMiniQuizProps> = ({ className = '' }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAttempt, setUserAttempt] = useState<QuizAttempt | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz çözme durumu
  const [isActive, setIsActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const QUIZ_TIME_LIMIT = 300; // 5 dakika

  useEffect(() => {
    fetchTodayQuiz();
  }, []);

  // Timer effect
  useEffect(() => {
    if (isActive && timeStarted && !showResults) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timeStarted) / 1000);
        const remaining = Math.max(0, QUIZ_TIME_LIMIT - elapsed);
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          handleSubmitQuiz();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, timeStarted, showResults]);

  const fetchTodayQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/daily-mini-quiz');
      const data = await response.json();

      if (data.success) {
        setQuiz(data.quiz);
        setCompleted(data.completed);
        if (data.completed && data.userAttempt) {
          setUserAttempt(data.userAttempt);
          setShowResults(true);
        }
      } else {
        setError(data.error || 'Quiz yüklenirken hata oluştu');
      }
    } catch (err) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setIsActive(true);
    setTimeStarted(Date.now());
    setTimeLeft(QUIZ_TIME_LIMIT);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const selectAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    try {
      const timeSpent = timeStarted ? Math.floor((Date.now() - timeStarted) / 1000) : 0;
      
      const response = await fetch('/api/daily-mini-quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
          timeSpent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setUserAttempt(data.attempt);
        setShowResults(true);
        setIsActive(false);
      } else {
        setError(data.error || 'Quiz gönderilirken hata oluştu');
      }
    } catch (err) {
      setError('Bağlantı hatası');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-600';
    if (difficulty <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Kolay';
    if (difficulty <= 3) return 'Orta';
    return 'Zor';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hata</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTodayQuiz}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Bulunamadı</h3>
          <p className="text-gray-600">Bugün için aktif quiz bulunmuyor.</p>
        </div>
      </div>
    );
  }

  // Quiz tamamlanmışsa sonuçları göster
  if (completed && showResults) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Tamamlandı!</h2>
          <p className="text-gray-600">{quiz.title}</p>
        </div>

        {userAttempt && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6"
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{userAttempt.score}%</div>
                <div className="text-sm text-gray-600">Skor</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatTime(userAttempt.timeSpent)}
                </div>
                <div className="text-sm text-gray-600">Süre</div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <Diamond className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-amber-700">
              +{userAttempt?.diamondsEarned || 0}
            </div>
            <div className="text-sm text-amber-600">Diamond</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-blue-700">
              +{userAttempt?.experienceEarned || 0}
            </div>
            <div className="text-sm text-blue-600">XP</div>
          </div>
        </div>

        {results && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">Soru Detayları:</h3>
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  result.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{result.question}</p>
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Doğru cevap:</span> {result.correctAnswer}
                </div>
                {result.explanation && (
                  <div className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">Açıklama:</span> {result.explanation}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Quiz başlamadan önce
  if (!isActive) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Günlük Mini Quiz</h2>
          <p className="text-gray-600">{quiz.title}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Kategori:</span>
              <span className="ml-2 font-medium">{quiz.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Zorluk:</span>
              <span className={`ml-2 font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                {getDifficultyLabel(quiz.difficulty)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Soru Sayısı:</span>
              <span className="ml-2 font-medium">{quiz.totalQuestions}</span>
            </div>
            <div>
              <span className="text-gray-600">Süre:</span>
              <span className="ml-2 font-medium">{formatTime(QUIZ_TIME_LIMIT)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <Diamond className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-amber-700">+{quiz.diamondReward}</div>
            <div className="text-sm text-amber-600">Diamond</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-blue-700">+{quiz.experienceReward}</div>
            <div className="text-sm text-blue-600">XP</div>
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          Quiz'i Başlat
        </button>
      </div>
    );
  }

  // Quiz aktifken
  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Soru {currentQuestion + 1} / {quiz.questions.length}
          </h2>
          <p className="text-sm text-gray-600">{quiz.title}</p>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
            <Clock className="w-5 h-5 inline mr-1" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentQ.question}
            </h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => selectAnswer(currentQ.id, index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQ.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[currentQ.id] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQ.id] === index && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentQuestion === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Önceki
        </button>

        <div className="text-sm text-gray-600">
          {Object.keys(answers).length} / {quiz.questions.length} cevaplandı
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(answers).length < quiz.questions.length}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              Object.keys(answers).length < quiz.questions.length
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Quiz'i Bitir
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sonraki
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyMiniQuiz;