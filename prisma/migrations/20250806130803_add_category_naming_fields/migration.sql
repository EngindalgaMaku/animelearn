-- AlterTable
ALTER TABLE "public"."categories" ADD COLUMN     "namingFormats" TEXT,
ADD COLUMN     "namingNames" TEXT,
ADD COLUMN     "namingPrefixes" TEXT,
ADD COLUMN     "namingSuffixes" TEXT;

-- AlterTable
ALTER TABLE "public"."lessons" ADD COLUMN     "examples" TEXT,
ADD COLUMN     "learningObjectives" TEXT,
ADD COLUMN     "resources" TEXT,
ADD COLUMN     "sections" TEXT,
ADD COLUMN     "tags" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "public"."diamond_purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "diamonds" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "shopierOrderId" TEXT,
    "shopierPaymentId" TEXT,
    "paymentMethod" TEXT,
    "failureReason" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diamond_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."diamond_packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "packageType" TEXT NOT NULL,
    "diamonds" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "bonus" INTEGER,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "bestValue" BOOLEAN NOT NULL DEFAULT false,
    "level" INTEGER NOT NULL,
    "badge" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "glow" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diamond_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_activities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "activityType" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "diamondReward" INTEGER NOT NULL DEFAULT 10,
    "experienceReward" INTEGER NOT NULL DEFAULT 25,
    "content" TEXT NOT NULL,
    "settings" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 5,
    "tags" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "prerequisiteId" TEXT,
    "topicOrder" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "answers" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "mistakes" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "activity_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "diamond_purchases_shopierOrderId_key" ON "public"."diamond_purchases"("shopierOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "diamond_packages_packageType_key" ON "public"."diamond_packages"("packageType");

-- CreateIndex
CREATE UNIQUE INDEX "activity_attempts_userId_activityId_key" ON "public"."activity_attempts"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "public"."diamond_purchases" ADD CONSTRAINT "diamond_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_activities" ADD CONSTRAINT "learning_activities_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "public"."learning_activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_attempts" ADD CONSTRAINT "activity_attempts_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."learning_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_attempts" ADD CONSTRAINT "activity_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
