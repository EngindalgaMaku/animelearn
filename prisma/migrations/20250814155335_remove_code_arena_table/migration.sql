/*
  Warnings:

  - You are about to drop the column `codeArenaId` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the `code_arena_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `code_arenas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."code_arena_progress" DROP CONSTRAINT "code_arena_progress_codeArenaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."code_arena_progress" DROP CONSTRAINT "code_arena_progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."quizzes" DROP CONSTRAINT "quizzes_codeArenaId_fkey";

-- AlterTable
ALTER TABLE "public"."quizzes" DROP COLUMN "codeArenaId";

-- DropTable
DROP TABLE "public"."code_arena_progress";

-- DropTable
DROP TABLE "public"."code_arenas";
