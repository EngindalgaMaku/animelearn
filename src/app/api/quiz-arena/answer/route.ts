import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { checkAndAwardBadges } from '@/lib/badges';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, questionId, answerIndex, timeSpent } = body;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // In a real implementation, you'd retrieve session data from Redis/cache
    // For now, we'll work with the data provided and validate the answer
    
    // Get the quiz and attempt (we'd need the quiz ID from session)
    // For this demo, we'll work with the latest quiz attempt for the user
    const latestAttempt = await prisma.quizAttempt.findFirst({
      where: { 
        userId: user.id,
        isCompleted: false
      },
      orderBy: { startedAt: 'desc' },
      include: { quiz: true }
    });

    if (!latestAttempt) {
      return NextResponse.json({ error: 'No active quiz session found' }, { status: 404 });
    }

    // Parse questions from quiz
    const questions = JSON.parse(latestAttempt.quiz.questions);
    const currentQuestionIndex = JSON.parse(latestAttempt.answers || '[]').length;
    const currentQuestion = questions.find((q: any) => q.id === questionId);

    if (!currentQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    // Update answers array
    const currentAnswers = JSON.parse(latestAttempt.answers || '[]');
    currentAnswers.push({
      questionId,
      answerIndex,
      isCorrect,
      timeSpent
    });

    // Check if this is a wrong answer (game over) or end of questions
    const gameOver = !isCorrect || currentAnswers.length >= questions.length;
    const finalStreak = currentAnswers.filter((a: any) => a.isCorrect).length;

    // Calculate rewards based on streak
    let rewards: {
      diamonds: number;
      experience: number;
      cards: any[];
      cardPack: any;
    } = {
      diamonds: 0,
      experience: 0,
      cards: [],
      cardPack: null
    };

    if (gameOver) {
      // Base rewards
      rewards.diamonds = Math.max(1, finalStreak * 2);
      rewards.experience = Math.max(5, finalStreak * 5);

      // Card rewards based on streak milestones
      let cardPack = null;
      if (finalStreak >= 25) {
        cardPack = await getOrCreateCardPack('legendary');
        rewards.cards = await generateCardsFromPack(cardPack, 1);
      } else if (finalStreak >= 15) {
        cardPack = await getOrCreateCardPack('epic');
        rewards.cards = await generateCardsFromPack(cardPack, 1);
      } else if (finalStreak >= 10) {
        cardPack = await getOrCreateCardPack('rare');
        rewards.cards = await generateCardsFromPack(cardPack, 1);
      } else if (finalStreak >= 5) {
        cardPack = await getOrCreateCardPack('common');
        rewards.cards = await generateCardsFromPack(cardPack, 1);
      }

      if (cardPack) {
        rewards.cardPack = cardPack;
      }
    }

    // Update quiz attempt first (simple update, no transaction needed)
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: latestAttempt.id },
      data: {
        answers: JSON.stringify(currentAnswers),
        score: finalStreak * 10,
        correctAnswers: currentAnswers.filter((a: any) => a.isCorrect).length,
        timeSpent: latestAttempt.timeSpent + timeSpent,
        isCompleted: gameOver,
        completedAt: gameOver ? new Date() : undefined
      }
    });

    // If game over, award rewards in a simplified transaction
    if (gameOver && rewards.diamonds > 0) {
      try {
        await prisma.$transaction(async (tx) => {
          // Update user experience and diamonds
          await tx.user.update({
            where: { id: user.id },
            data: {
              currentDiamonds: { increment: rewards.diamonds },
              totalDiamonds: { increment: rewards.diamonds },
              experience: { increment: rewards.experience },
              quizzesCompleted: { increment: 1 }
            }
          });

          // Create diamond transaction record
          await tx.diamondTransaction.create({
            data: {
              userId: user.id,
              amount: rewards.diamonds,
              type: 'QUIZ_COMPLETION',
              description: `Quiz Arena Streak: ${finalStreak} questions`,
              relatedType: 'QUIZ',
              relatedId: latestAttempt.quizId
            }
          });
        }, {
          timeout: 10000 // 10 second timeout
        });

        // Award cards separately to avoid transaction complexity
        if (rewards.cards.length > 0) {
          for (const card of rewards.cards) {
            try {
              await prisma.userCard.upsert({
                where: {
                  userId_cardId: {
                    userId: user.id,
                    cardId: card.id
                  }
                },
                update: {},
                create: {
                  userId: user.id,
                  cardId: card.id,
                  purchasePrice: 0,
                  purchaseDate: new Date()
                }
              });
            } catch (cardError) {
              console.error('Card award error:', cardError);
              // Continue with other cards
            }
          }

          // Create card pack opening record
          if (rewards.cardPack) {
            try {
              await prisma.cardPackOpening.create({
                data: {
                  userId: user.id,
                  packId: rewards.cardPack.id,
                  cardsReceived: JSON.stringify(rewards.cards.map(c => c.id)),
                  sourceType: 'QUIZ_REWARD',
                  sourceId: latestAttempt.id
                }
              });
            } catch (packError) {
              console.error('Card pack opening error:', packError);
              // Not critical, continue
            }
          }
        }
      } catch (rewardError) {
        console.error('Reward transaction error:', rewardError);
        // Don't fail the whole request, just log the error
      }
    }

    // Check for new badges after quiz completion
    let newBadges: any[] = [];
    if (gameOver) {
      try {
        newBadges = await checkAndAwardBadges(user.id);
        if (newBadges.length > 0) {
          console.log(`🏆 User ${user.id} earned ${newBadges.length} new badges from quiz completion!`);
        }
      } catch (badgeError) {
        console.error('Badge check error:', badgeError);
        // Don't fail the request, just log the error
      }
    }

    // Prepare response
    const response: any = {
      isCorrect,
      gameOver,
      finalStreak
    };

    if (!gameOver && isCorrect && currentQuestionIndex + 1 < questions.length) {
      response.nextQuestion = questions[currentQuestionIndex + 1];
    }

    if (gameOver) {
      response.rewards = rewards;
      // Add new badges to response if any were earned
      if (newBadges.length > 0) {
        response.newBadges = newBadges;
        response.badgeMessage = `🎉 Tebrikler! ${newBadges.length} yeni rozet kazandınız!`;
      }
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Quiz answer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
async function getOrCreateCardPack(rarity: string) {
  let pack = await prisma.cardPack.findFirst({
    where: { 
      packType: `${rarity}_reward`,
      isActive: true 
    }
  });

  if (!pack) {
    const cardCounts = {
      common: 1,
      rare: 1,
      epic: 1,
      legendary: 1
    };

    pack = await prisma.cardPack.create({
      data: {
        name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Reward Pack`,
        description: `Contains a guaranteed ${rarity} card`,
        packType: `${rarity}_reward`,
        cardCount: cardCounts[rarity as keyof typeof cardCounts] || 1,
        guaranteedRarity: rarity,
        rarity: rarity,
        isActive: true
      }
    });
  }

  return pack;
}

async function generateCardsFromPack(cardPack: any, count: number = 1) {
  const whereClause: any = {
    isPublic: true,
    isPurchasable: true
  };

  // Apply rarity filter if pack has guaranteed rarity
  if (cardPack.guaranteedRarity) {
    whereClause.rarity = cardPack.guaranteedRarity;
  }

  const availableCards = await prisma.card.findMany({
    where: whereClause,
    take: count * 5 // Get more cards to randomize selection
  });

  if (availableCards.length === 0) {
    // Fallback: get any available cards
    const fallbackCards = await prisma.card.findMany({
      where: {
        isPublic: true,
        isPurchasable: true
      },
      take: count * 3
    });
    
    if (fallbackCards.length === 0) {
      return [];
    }
    
    availableCards.push(...fallbackCards);
  }

  // Randomly select cards
  const selectedCards = [];
  const cardCount = Math.min(count, availableCards.length);
  
  for (let i = 0; i < cardCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCard = availableCards.splice(randomIndex, 1)[0];
    selectedCards.push(selectedCard);
  }

  return selectedCards;
}