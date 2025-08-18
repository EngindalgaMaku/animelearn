-- CreateTable
CREATE TABLE "public"."badge_rules" (
    "id" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "target" INTEGER,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "definition" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badge_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."skills" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."skill_edges" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isPrerequisite" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_skills" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_skill_mastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "mastery" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "proficiency" INTEGER NOT NULL DEFAULT 0,
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "incorrectCount" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "decayFactor" DOUBLE PRECISION NOT NULL DEFAULT 0.99,
    "lastPracticedAt" TIMESTAMP(3),
    "lastDecayAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_skill_mastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recommendation_queues" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "recommendation_queues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "badge_rules_badgeId_idx" ON "public"."badge_rules"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "skills_key_key" ON "public"."skills"("key");

-- CreateIndex
CREATE INDEX "skill_edges_childId_idx" ON "public"."skill_edges"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "skill_edges_parentId_childId_key" ON "public"."skill_edges"("parentId", "childId");

-- CreateIndex
CREATE INDEX "activity_skills_skillId_idx" ON "public"."activity_skills"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "activity_skills_activityId_skillId_key" ON "public"."activity_skills"("activityId", "skillId");

-- CreateIndex
CREATE INDEX "user_skill_mastery_skillId_idx" ON "public"."user_skill_mastery"("skillId");

-- CreateIndex
CREATE INDEX "user_skill_mastery_userId_idx" ON "public"."user_skill_mastery"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_skill_mastery_userId_skillId_key" ON "public"."user_skill_mastery"("userId", "skillId");

-- CreateIndex
CREATE INDEX "recommendation_queues_userId_generatedAt_idx" ON "public"."recommendation_queues"("userId", "generatedAt");

-- AddForeignKey
ALTER TABLE "public"."badge_rules" ADD CONSTRAINT "badge_rules_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."skill_edges" ADD CONSTRAINT "skill_edges_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."skill_edges" ADD CONSTRAINT "skill_edges_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_skills" ADD CONSTRAINT "activity_skills_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."learning_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_skills" ADD CONSTRAINT "activity_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_skill_mastery" ADD CONSTRAINT "user_skill_mastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_skill_mastery" ADD CONSTRAINT "user_skill_mastery_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommendation_queues" ADD CONSTRAINT "recommendation_queues_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
