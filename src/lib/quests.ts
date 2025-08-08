import { prisma } from "@/lib/prisma";

// Update quest progress
export async function updateQuestProgress(
  userId: string,
  questType: string,
  increment: number = 1
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const quest = await prisma.dailyQuest.findFirst({
    where: {
      userId,
      questType,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
      isCompleted: false,
    },
  });

  if (!quest) return;

  const newProgress = Math.min(quest.progress + increment, quest.target);
  const isCompleted = newProgress >= quest.target;

  await prisma.dailyQuest.update({
    where: { id: quest.id },
    data: {
      progress: newProgress,
      isCompleted,
    },
  });

  // Give reward if quest completed
  if (isCompleted && !quest.isCompleted) {
    await completeQuest(quest.id, userId);
  }
}

// Quest completion
async function completeQuest(questId: string, userId: string): Promise<any> {
  const quest = await prisma.dailyQuest.findUnique({
    where: { id: questId },
  });

  if (!quest || quest.isCompleted) {
    return null;
  }

  // Complete quest
  const completedQuest = await prisma.dailyQuest.update({
    where: { id: questId },
    data: { isCompleted: true },
  });

  // Give reward
  await prisma.user.update({
    where: { id: userId },
    data: {
      currentDiamonds: { increment: quest.diamondReward },
      totalDiamonds: { increment: quest.diamondReward },
      experience: { increment: quest.experienceReward },
    },
  });

  // Transaction record
  await prisma.diamondTransaction.create({
    data: {
      userId,
      amount: quest.diamondReward,
      type: "DAILY_QUEST",
      description: `Daily quest completed: ${quest.questType}`,
      relatedId: questId,
      relatedType: "daily_quest",
    },
  });

  return completedQuest;
}
