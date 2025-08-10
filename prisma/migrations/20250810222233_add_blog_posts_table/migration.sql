/*
  Warnings:

  - Added the required column `conditionType` to the `badges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user_badges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."badges" ADD COLUMN     "averageProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "conditionType" TEXT NOT NULL,
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prerequisiteBadgeId" TEXT,
ADD COLUMN     "rewardCardPack" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "specialReward" TEXT,
ADD COLUMN     "targetValue" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "totalProgress" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."user_badges" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isUnlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "progressData" TEXT,
ADD COLUMN     "unlockedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "earnedAt" DROP NOT NULL,
ALTER COLUMN "earnedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."quiz_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" INTEGER NOT NULL,
    "explanation" TEXT,
    "difficulty" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quiz_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "icon" TEXT,
    "questionCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."weekly_challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "challengeType" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'intermediate',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requirements" TEXT NOT NULL,
    "targetValue" INTEGER NOT NULL,
    "diamondReward" INTEGER NOT NULL DEFAULT 100,
    "experienceReward" INTEGER NOT NULL DEFAULT 200,
    "cardPackReward" TEXT,
    "badgeReward" TEXT,
    "specialReward" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "tags" TEXT,
    "imageUrl" TEXT,
    "icon" TEXT NOT NULL DEFAULT '🏆',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "participantCount" INTEGER NOT NULL DEFAULT 0,
    "completionCount" INTEGER NOT NULL DEFAULT 0,
    "averageProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_challenge_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "currentValue" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "rewardsClaimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastProgressAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progressData" TEXT,

    CONSTRAINT "user_challenge_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."card_rarities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "glowColor" TEXT,
    "borderColor" TEXT,
    "bgGradient" TEXT,
    "baseDropRate" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "packDropRate" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "rewardDropRate" DOUBLE PRECISION NOT NULL DEFAULT 25.0,
    "minDiamondValue" INTEGER NOT NULL DEFAULT 50,
    "maxDiamondValue" INTEGER NOT NULL DEFAULT 200,
    "xpMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "hasGlow" BOOLEAN NOT NULL DEFAULT false,
    "hasAnimation" BOOLEAN NOT NULL DEFAULT false,
    "hasParticles" BOOLEAN NOT NULL DEFAULT false,
    "animationType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_rarities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."card_distribution_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ruleType" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "commonWeight" DOUBLE PRECISION NOT NULL DEFAULT 70.0,
    "rareWeight" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "epicWeight" DOUBLE PRECISION NOT NULL DEFAULT 8.0,
    "legendaryWeight" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "mythicWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "guaranteedRarity" TEXT,
    "guaranteeCount" INTEGER NOT NULL DEFAULT 10,
    "luckBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "premiumBonus" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "eventMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_distribution_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."card_distribution_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "cardId" TEXT,
    "rarityReceived" TEXT NOT NULL,
    "wasGuaranteed" BOOLEAN NOT NULL DEFAULT false,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "rollValue" DOUBLE PRECISION NOT NULL,
    "appliedWeights" TEXT NOT NULL,
    "modifiersApplied" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_distribution_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_rarity_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commonCards" INTEGER NOT NULL DEFAULT 0,
    "rareCards" INTEGER NOT NULL DEFAULT 0,
    "epicCards" INTEGER NOT NULL DEFAULT 0,
    "legendaryCards" INTEGER NOT NULL DEFAULT 0,
    "mythicCards" INTEGER NOT NULL DEFAULT 0,
    "packsOpened" INTEGER NOT NULL DEFAULT 0,
    "totalCardsDrawn" INTEGER NOT NULL DEFAULT 0,
    "luckScore" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "averageRarity" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "guaranteePity" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "firstLegendary" TIMESTAMP(3),
    "firstMythic" TIMESTAMP(3),
    "totalValueDrawn" INTEGER NOT NULL DEFAULT 0,
    "lastCardDrawn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_rarity_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."login_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginDate" DATE NOT NULL,
    "loginTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "streakCount" INTEGER NOT NULL DEFAULT 1,
    "isConsecutive" BOOLEAN NOT NULL DEFAULT true,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "platform" TEXT,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."login_streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 1,
    "longestStreak" INTEGER NOT NULL DEFAULT 1,
    "lastLoginDate" DATE NOT NULL,
    "streakStartDate" DATE NOT NULL,
    "totalLogins" INTEGER NOT NULL DEFAULT 1,
    "streakRewards" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "login_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."python_tip_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "python_tip_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."python_tips" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "codeExample" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'beginner',
    "categoryId" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishDate" TIMESTAMP(3),
    "tags" TEXT,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 2,
    "prerequisites" TEXT,
    "relatedTips" TEXT,
    "slug" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "socialImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "python_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_python_tip_interactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipId" TEXT NOT NULL,
    "hasViewed" BOOLEAN NOT NULL DEFAULT false,
    "hasLiked" BOOLEAN NOT NULL DEFAULT false,
    "hasShared" BOOLEAN NOT NULL DEFAULT false,
    "hasCompleted" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "completionScore" INTEGER,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "diamondsEarned" INTEGER NOT NULL DEFAULT 0,
    "badgeEarned" TEXT,
    "firstViewedAt" TIMESTAMP(3),
    "lastViewedAt" TIMESTAMP(3),
    "likedAt" TIMESTAMP(3),
    "sharedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "deviceType" TEXT,
    "sourceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_python_tip_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."python_tip_streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastTipDate" DATE,
    "streakStartDate" DATE,
    "totalTipsViewed" INTEGER NOT NULL DEFAULT 0,
    "totalTipsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalXPEarned" INTEGER NOT NULL DEFAULT 0,
    "totalDiamondsEarned" INTEGER NOT NULL DEFAULT 0,
    "streakMilestones" TEXT NOT NULL DEFAULT '[]',
    "nextMilestone" INTEGER NOT NULL DEFAULT 7,
    "categoriesCompleted" TEXT NOT NULL DEFAULT '{}',
    "beginnerCompleted" INTEGER NOT NULL DEFAULT 0,
    "intermediateCompleted" INTEGER NOT NULL DEFAULT 0,
    "advancedCompleted" INTEGER NOT NULL DEFAULT 0,
    "weeklyGoal" INTEGER NOT NULL DEFAULT 7,
    "weeklyProgress" INTEGER NOT NULL DEFAULT 0,
    "monthlyGoal" INTEGER NOT NULL DEFAULT 30,
    "monthlyProgress" INTEGER NOT NULL DEFAULT 0,
    "lastWeeklyReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMonthlyReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "python_tip_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_python_tips" (
    "id" TEXT NOT NULL,
    "tipId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "variant" TEXT,
    "testingActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_python_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."python_tip_feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipId" TEXT NOT NULL,
    "rating" INTEGER,
    "difficulty" TEXT,
    "helpfulness" INTEGER,
    "clarity" INTEGER,
    "comment" TEXT,
    "suggestion" TEXT,
    "reportReason" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "adminResponse" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "python_tip_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "seoKeywords" TEXT,
    "metaDescription" TEXT,
    "socialImageUrl" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "readTime" TEXT NOT NULL DEFAULT '5 min',
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 5,
    "author" TEXT NOT NULL DEFAULT 'Zumenzu Programming Team',
    "authorId" TEXT,
    "authorBio" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "language" TEXT NOT NULL DEFAULT 'tr',
    "sourceFile" TEXT,
    "sourceFormat" TEXT NOT NULL DEFAULT 'markdown',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_post_interactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "hasViewed" BOOLEAN NOT NULL DEFAULT false,
    "hasLiked" BOOLEAN NOT NULL DEFAULT false,
    "hasShared" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "deviceType" TEXT,
    "sourceType" TEXT,
    "firstViewedAt" TIMESTAMP(3),
    "lastViewedAt" TIMESTAMP(3),
    "likedAt" TIMESTAMP(3),
    "sharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_post_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quiz_categories_name_key" ON "public"."quiz_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_challenge_progress_userId_challengeId_key" ON "public"."user_challenge_progress"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "card_rarities_name_key" ON "public"."card_rarities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "card_rarities_level_key" ON "public"."card_rarities"("level");

-- CreateIndex
CREATE UNIQUE INDEX "card_distribution_rules_name_key" ON "public"."card_distribution_rules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_rarity_stats_userId_key" ON "public"."user_rarity_stats"("userId");

-- CreateIndex
CREATE INDEX "login_history_userId_loginDate_idx" ON "public"."login_history"("userId", "loginDate");

-- CreateIndex
CREATE INDEX "login_history_loginDate_idx" ON "public"."login_history"("loginDate");

-- CreateIndex
CREATE UNIQUE INDEX "login_history_userId_loginDate_key" ON "public"."login_history"("userId", "loginDate");

-- CreateIndex
CREATE UNIQUE INDEX "login_streaks_userId_key" ON "public"."login_streaks"("userId");

-- CreateIndex
CREATE INDEX "login_streaks_userId_idx" ON "public"."login_streaks"("userId");

-- CreateIndex
CREATE INDEX "login_streaks_lastLoginDate_idx" ON "public"."login_streaks"("lastLoginDate");

-- CreateIndex
CREATE UNIQUE INDEX "python_tip_categories_name_key" ON "public"."python_tip_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "python_tip_categories_slug_key" ON "public"."python_tip_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "python_tips_slug_key" ON "public"."python_tips"("slug");

-- CreateIndex
CREATE INDEX "python_tips_publishDate_idx" ON "public"."python_tips"("publishDate");

-- CreateIndex
CREATE INDEX "python_tips_difficulty_idx" ON "public"."python_tips"("difficulty");

-- CreateIndex
CREATE INDEX "python_tips_categoryId_idx" ON "public"."python_tips"("categoryId");

-- CreateIndex
CREATE INDEX "python_tips_isActive_idx" ON "public"."python_tips"("isActive");

-- CreateIndex
CREATE INDEX "user_python_tip_interactions_userId_idx" ON "public"."user_python_tip_interactions"("userId");

-- CreateIndex
CREATE INDEX "user_python_tip_interactions_tipId_idx" ON "public"."user_python_tip_interactions"("tipId");

-- CreateIndex
CREATE INDEX "user_python_tip_interactions_hasViewed_idx" ON "public"."user_python_tip_interactions"("hasViewed");

-- CreateIndex
CREATE INDEX "user_python_tip_interactions_hasCompleted_idx" ON "public"."user_python_tip_interactions"("hasCompleted");

-- CreateIndex
CREATE UNIQUE INDEX "user_python_tip_interactions_userId_tipId_key" ON "public"."user_python_tip_interactions"("userId", "tipId");

-- CreateIndex
CREATE UNIQUE INDEX "python_tip_streaks_userId_key" ON "public"."python_tip_streaks"("userId");

-- CreateIndex
CREATE INDEX "python_tip_streaks_userId_idx" ON "public"."python_tip_streaks"("userId");

-- CreateIndex
CREATE INDEX "python_tip_streaks_currentStreak_idx" ON "public"."python_tip_streaks"("currentStreak");

-- CreateIndex
CREATE INDEX "python_tip_streaks_lastTipDate_idx" ON "public"."python_tip_streaks"("lastTipDate");

-- CreateIndex
CREATE INDEX "daily_python_tips_date_idx" ON "public"."daily_python_tips"("date");

-- CreateIndex
CREATE INDEX "daily_python_tips_isActive_idx" ON "public"."daily_python_tips"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "daily_python_tips_date_variant_key" ON "public"."daily_python_tips"("date", "variant");

-- CreateIndex
CREATE INDEX "python_tip_feedback_tipId_idx" ON "public"."python_tip_feedback"("tipId");

-- CreateIndex
CREATE INDEX "python_tip_feedback_rating_idx" ON "public"."python_tip_feedback"("rating");

-- CreateIndex
CREATE INDEX "python_tip_feedback_isPublic_idx" ON "public"."python_tip_feedback"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "python_tip_feedback_userId_tipId_key" ON "public"."python_tip_feedback"("userId", "tipId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "public"."blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_isPublished_idx" ON "public"."blog_posts"("isPublished");

-- CreateIndex
CREATE INDEX "blog_posts_featured_idx" ON "public"."blog_posts"("featured");

-- CreateIndex
CREATE INDEX "blog_posts_category_idx" ON "public"."blog_posts"("category");

-- CreateIndex
CREATE INDEX "blog_posts_publishedAt_idx" ON "public"."blog_posts"("publishedAt");

-- CreateIndex
CREATE INDEX "blog_posts_slug_idx" ON "public"."blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_post_interactions_userId_idx" ON "public"."blog_post_interactions"("userId");

-- CreateIndex
CREATE INDEX "blog_post_interactions_postId_idx" ON "public"."blog_post_interactions"("postId");

-- CreateIndex
CREATE INDEX "blog_post_interactions_hasViewed_idx" ON "public"."blog_post_interactions"("hasViewed");

-- CreateIndex
CREATE INDEX "blog_post_interactions_hasLiked_idx" ON "public"."blog_post_interactions"("hasLiked");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_interactions_userId_postId_key" ON "public"."blog_post_interactions"("userId", "postId");

-- AddForeignKey
ALTER TABLE "public"."badges" ADD CONSTRAINT "badges_prerequisiteBadgeId_fkey" FOREIGN KEY ("prerequisiteBadgeId") REFERENCES "public"."badges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."weekly_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."card_distribution_logs" ADD CONSTRAINT "card_distribution_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."card_distribution_logs" ADD CONSTRAINT "card_distribution_logs_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "public"."card_distribution_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_rarity_stats" ADD CONSTRAINT "user_rarity_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."login_history" ADD CONSTRAINT "login_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."login_streaks" ADD CONSTRAINT "login_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."python_tips" ADD CONSTRAINT "python_tips_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."python_tip_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_python_tip_interactions" ADD CONSTRAINT "user_python_tip_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_python_tip_interactions" ADD CONSTRAINT "user_python_tip_interactions_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "public"."python_tips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."python_tip_streaks" ADD CONSTRAINT "python_tip_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_python_tips" ADD CONSTRAINT "daily_python_tips_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "public"."python_tips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."python_tip_feedback" ADD CONSTRAINT "python_tip_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."python_tip_feedback" ADD CONSTRAINT "python_tip_feedback_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "public"."python_tips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_interactions" ADD CONSTRAINT "blog_post_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_interactions" ADD CONSTRAINT "blog_post_interactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
