/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `learning_activities` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."learning_activities" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "learning_activities_slug_key" ON "public"."learning_activities"("slug");

-- CreateIndex
CREATE INDEX "learning_activities_activityType_isActive_sortOrder_idx" ON "public"."learning_activities"("activityType", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "learning_activities_activityType_isActive_category_difficul_idx" ON "public"."learning_activities"("activityType", "isActive", "category", "difficulty");
