/*
  Warnings:

  - You are about to drop the column `priceMultiplier` on the `rarities` table. All the data in the column will be lost.
  - You are about to drop the `pricing_rules` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."rarities" DROP COLUMN "priceMultiplier",
ADD COLUMN     "maxDiamondPrice" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "minDiamondPrice" INTEGER NOT NULL DEFAULT 50;

-- DropTable
DROP TABLE "public"."pricing_rules";
