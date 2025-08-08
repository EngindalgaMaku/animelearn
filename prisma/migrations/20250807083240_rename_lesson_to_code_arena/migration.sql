/*
  Warnings:

  - You are about to drop the column `lessonId` on the `code_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `lessonStreak` on the `user_streaks` table. All the data in the column will be lost.
  - You are about to drop the column `lessonsCompleted` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `lesson_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lessons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."lesson_progress" DROP CONSTRAINT "lesson_progress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."lesson_progress" DROP CONSTRAINT "lesson_progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."quizzes" DROP CONSTRAINT "quizzes_lessonId_fkey";

-- AlterTable
ALTER TABLE "public"."code_submissions" DROP COLUMN "lessonId",
ADD COLUMN     "codeArenaId" TEXT;

-- AlterTable
ALTER TABLE "public"."quizzes" DROP COLUMN "lessonId",
ADD COLUMN     "codeArenaId" TEXT;

-- AlterTable
ALTER TABLE "public"."user_streaks" DROP COLUMN "lessonStreak",
ADD COLUMN     "codeArenaStreak" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "lessonsCompleted",
ADD COLUMN     "codeArenasCompleted" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "public"."lesson_progress";

-- DropTable
DROP TABLE "public"."lessons";

-- CreateTable
CREATE TABLE "public"."code_arenas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "category" TEXT NOT NULL DEFAULT 'basic',
    "hasCodeExercise" BOOLEAN NOT NULL DEFAULT false,
    "starterCode" TEXT,
    "solutionCode" TEXT,
    "testCases" TEXT,
    "hints" TEXT,
    "prerequisites" TEXT,
    "diamondReward" INTEGER NOT NULL DEFAULT 10,
    "experienceReward" INTEGER NOT NULL DEFAULT 50,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "examples" TEXT,
    "learningObjectives" TEXT,
    "resources" TEXT,
    "sections" TEXT,
    "tags" TEXT,

    CONSTRAINT "code_arenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."code_arena_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeArenaId" TEXT NOT NULL,
    "isStarted" BOOLEAN NOT NULL DEFAULT false,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastCode" TEXT,
    "bestCode" TEXT,
    "isCodeCorrect" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_arena_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "code_arenas_slug_key" ON "public"."code_arenas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "code_arena_progress_userId_codeArenaId_key" ON "public"."code_arena_progress"("userId", "codeArenaId");

-- AddForeignKey
ALTER TABLE "public"."code_arena_progress" ADD CONSTRAINT "code_arena_progress_codeArenaId_fkey" FOREIGN KEY ("codeArenaId") REFERENCES "public"."code_arenas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."code_arena_progress" ADD CONSTRAINT "code_arena_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quizzes" ADD CONSTRAINT "quizzes_codeArenaId_fkey" FOREIGN KEY ("codeArenaId") REFERENCES "public"."code_arenas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
