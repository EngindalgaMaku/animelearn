import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Rastgele bir aktif quiz sorusu al
    let randomQuestion = null;
    
    try {
      // Tüm beginner ve intermediate sorular arasından rastgele seç
      const allQuestions = await (prisma as any).quizQuestion?.findMany({
        where: {
          isActive: true,
          difficulty: {
            in: ['beginner', 'intermediate']
          }
        }
      });

      if (allQuestions && allQuestions.length > 0) {
        // Gerçek rastgele seçim
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        const selectedQuestion = allQuestions[randomIndex];
        
        // Şıkları karıştır (Fisher-Yates algoritması)
        const originalOptions = [...selectedQuestion.options];
        const shuffledOptions = [...originalOptions];
        const originalCorrectAnswer = selectedQuestion.correctAnswer;
        
        // Şıkları karıştır
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        
        // Yeni doğru cevap indeksini bul
        const correctAnswerText = originalOptions[originalCorrectAnswer];
        const newCorrectAnswer = shuffledOptions.findIndex(option => option === correctAnswerText);
        
        randomQuestion = {
          ...selectedQuestion,
          options: shuffledOptions,
          correctAnswer: newCorrectAnswer
        };
      }
    } catch (dbError) {
      console.log('Quiz questions table not yet available, using fallback');
    }

    if (randomQuestion) {
      return NextResponse.json({
        id: randomQuestion.id,
        question: randomQuestion.question,
        options: randomQuestion.options,
        correctAnswer: randomQuestion.correctAnswer,
        explanation: randomQuestion.explanation,
        difficulty: randomQuestion.difficulty,
        category: randomQuestion.category,
        diamondReward: 50 // Base reward
      });
    }

    // Fallback hardcoded question eğer veritabanında soru yoksa (şıkları karıştırılmış)
    const fallbackOptions = [
      'function myFunc(): pass',
      'def myFunc(): pass',
      'func myFunc(): pass',
      'define myFunc(): pass'
    ];
    
    // Fallback için de şıkları karıştır
    const shuffledFallback = [...fallbackOptions];
    for (let i = shuffledFallback.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledFallback[i], shuffledFallback[j]] = [shuffledFallback[j], shuffledFallback[i]];
    }
    
    // Doğru cevap "def myFunc(): pass" - yeni indeksini bul
    const correctText = 'def myFunc(): pass';
    const newCorrectIndex = shuffledFallback.findIndex(option => option === correctText);
    
    return NextResponse.json({
      id: 'fallback-1',
      question: 'What is the correct way to define a function in Python?',
      options: shuffledFallback,
      correctAnswer: newCorrectIndex,
      explanation: 'In Python, functions are defined using the "def" keyword followed by the function name and parentheses.',
      difficulty: 'beginner',
      category: 'Python Basics',
      diamondReward: 50
    });
    
  } catch (error) {
    console.error('Sample quiz fetch error:', error);
    
    // Error fallback - aynı karıştırma algoritması
    const errorFallbackOptions = [
      'function myFunc(): pass',
      'def myFunc(): pass',
      'func myFunc(): pass',
      'define myFunc(): pass'
    ];
    
    const shuffledErrorFallback = [...errorFallbackOptions];
    for (let i = shuffledErrorFallback.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledErrorFallback[i], shuffledErrorFallback[j]] = [shuffledErrorFallback[j], shuffledErrorFallback[i]];
    }
    
    const errorCorrectText = 'def myFunc(): pass';
    const errorNewCorrectIndex = shuffledErrorFallback.findIndex(option => option === errorCorrectText);
    
    return NextResponse.json({
      id: 'fallback-1',
      question: 'What is the correct way to define a function in Python?',
      options: shuffledErrorFallback,
      correctAnswer: errorNewCorrectIndex,
      explanation: 'In Python, functions are defined using the "def" keyword followed by the function name and parentheses.',
      difficulty: 'beginner',
      category: 'Python Basics',
      diamondReward: 50
    });
  }
}