import { prisma } from "@/lib/prisma";

export interface DropRateConfig {
  raritySlug: string;
  rarityName: string;
  dropRate: number;
  level: number;
  minDiamondPrice: number;
  maxDiamondPrice: number;
}

export interface DropRateAnalysis {
  currentDistribution: {
    [raritySlug: string]: {
      count: number;
      percentage: number;
      targetPercentage: number;
      deviation: number;
    };
  };
  totalCards: number;
  isBalanced: boolean;
  recommendations: string[];
}

export class DropRateSystem {
  private dropRateConfig: DropRateConfig[] = [];
  private lastConfigUpdate = 0;
  private CONFIG_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get current drop rate configuration from database
   */
  async getDropRateConfig(): Promise<DropRateConfig[]> {
    if (
      this.dropRateConfig.length === 0 ||
      Date.now() - this.lastConfigUpdate > this.CONFIG_CACHE_DURATION
    ) {
      await this.refreshDropRateConfig();
    }
    return this.dropRateConfig;
  }

  /**
   * Refresh drop rate configuration from database
   */
  private async refreshDropRateConfig(): Promise<void> {
    try {
      const rarities = await prisma.rarity.findMany({
        where: { isActive: true },
        orderBy: { level: "asc" },
      });

      this.dropRateConfig = rarities.map((rarity) => ({
        raritySlug: rarity.slug,
        rarityName: rarity.name,
        dropRate: rarity.dropRate,
        level: rarity.level,
        minDiamondPrice: rarity.minDiamondPrice,
        maxDiamondPrice: rarity.maxDiamondPrice,
      }));

      this.lastConfigUpdate = Date.now();
      console.log(`📊 Drop rate config refreshed: ${rarities.length} rarities`);
      console.log(`📊 Drop rates loaded:`, this.dropRateConfig.map(r => `${r.rarityName}: ${r.dropRate}%`));
    } catch (error) {
      console.error("❌ Failed to refresh drop rate config:", error);
      throw new Error("Database connection required for drop rate configuration");
    }
  }

  /**
   * Assign rarity based on drop rates (probabilistic)
   */
  async assignRarityByDropRate(
    qualityScore?: number,
    cardId?: string
  ): Promise<string> {
    const config = await this.getDropRateConfig();
    console.log(`🎲 assignRarityByDropRate called - cardId: ${cardId}, qualityScore: ${qualityScore}`);

    if (config.length === 0) {
      console.error("❌ No drop rate config available from database");
      throw new Error("Drop rate configuration not found in database");
    }

    // Create cumulative probability distribution
    const cumulativeRates: { slug: string; threshold: number }[] = [];
    let cumulative = 0;

    // Sort by level (lowest to highest) to ensure proper distribution
    const sortedConfig = [...config].sort((a, b) => a.level - b.level);
    console.log(`🎲 Sorted config:`, sortedConfig.map(r => `${r.rarityName}(${r.raritySlug}): ${r.dropRate}%`));

    for (const rarity of sortedConfig) {
      cumulative += rarity.dropRate;
      cumulativeRates.push({
        slug: rarity.raritySlug,
        threshold: cumulative,
      });
    }
    console.log(`🎲 Cumulative thresholds:`, cumulativeRates);

    // Generate purely database-driven random distribution
    // Use true random for proper drop rate distribution
    const random = Math.random() * 100;
    console.log(`🎲 Database-driven random: ${random.toFixed(2)} (true random for fair distribution)`);
    
    // Quality score and cardId are IGNORED - only database drop rates matter
    if (qualityScore !== undefined) {
      console.log(`🎲 Quality score ${qualityScore.toFixed(1)} noted but NOT affecting distribution (database-driven only)`);
    }
    if (cardId) {
      console.log(`🎲 CardId ${cardId} noted but NOT affecting distribution (database-driven only)`);
    }

    // Find which rarity this random number falls into
    for (const rate of cumulativeRates) {
      if (random <= rate.threshold) {
        console.log(
          `🎲 Drop rate assignment: ${rate.slug} (random: ${random.toFixed(2)}, threshold: ${rate.threshold})`
        );
        return rate.slug;
      }
    }

    // Fallback to most common rarity
    const fallback = sortedConfig[0]?.raritySlug || "common";
    console.warn(`⚠️ Drop rate assignment failed, using fallback: ${fallback}`);
    return fallback;
  }

  // Quality bias functions REMOVED - system is now purely database-driven
  // Drop rates are determined solely by database configuration, not quality scores

  /**
   * Generate consistent seed from card ID with proper hash distribution
   */
  private generateCardSeed(cardId: string): number {
    // Simple hash function for better distribution
    let hash = 0;
    for (let i = 0; i < cardId.length; i++) {
      const char = cardId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Ensure positive and normalize to 0-1 range
    const normalized = Math.abs(hash % 2147483647) / 2147483647;
    return normalized;
  }

  /**
   * Analyze current drop rate distribution
   */
  async analyzeCurrentDistribution(): Promise<DropRateAnalysis> {
    const config = await this.getDropRateConfig();
    const totalCards = await prisma.card.count();

    if (totalCards === 0) {
      return {
        currentDistribution: {},
        totalCards: 0,
        isBalanced: true,
        recommendations: ["No cards found in database"],
      };
    }

    // Get current distribution
    const rarityGroups = await prisma.card.groupBy({
      by: ["rarity"],
      _count: {
        rarity: true,
      },
    });

    const currentDistribution: DropRateAnalysis["currentDistribution"] = {};
    const recommendations: string[] = [];
    let totalDeviation = 0;

    // Process each configured rarity
    for (const rarity of config) {
      const currentCount =
        rarityGroups.find((g) => g.rarity === rarity.raritySlug)?._count
          .rarity || 0;
      const currentPercentage = (currentCount / totalCards) * 100;
      const deviation = Math.abs(currentPercentage - rarity.dropRate);

      currentDistribution[rarity.raritySlug] = {
        count: currentCount,
        percentage: currentPercentage,
        targetPercentage: rarity.dropRate,
        deviation,
      };

      totalDeviation += deviation;

      // Generate recommendations
      if (deviation > 5) {
        // Significant deviation (>5%)
        if (currentPercentage > rarity.dropRate) {
          recommendations.push(
            `⚠️ Too many ${rarity.rarityName} cards (${currentPercentage.toFixed(1)}% vs ${rarity.dropRate}% target)`
          );
        } else {
          recommendations.push(
            `⬇️ Too few ${rarity.rarityName} cards (${currentPercentage.toFixed(1)}% vs ${rarity.dropRate}% target)`
          );
        }
      }
    }

    const isBalanced = totalDeviation < 10; // Total deviation under 10%

    if (isBalanced) {
      recommendations.push("✅ Drop rates are well balanced!");
    } else {
      recommendations.push(
        `🎯 Total deviation: ${totalDeviation.toFixed(1)}% (aim for <10%)`
      );
    }

    return {
      currentDistribution,
      totalCards,
      isBalanced,
      recommendations,
    };
  }

  /**
   * Auto-balance rarities by updating cards that deviate most from target
   */
  async autoBalanceRarities(
    dryRun: boolean = true,
    maxUpdates: number = 100
  ): Promise<{
    updatedCards: number;
    changes: Array<{
      cardId: string;
      oldRarity: string;
      newRarity: string;
      reason: string;
    }>;
    dryRun: boolean;
  }> {
    const analysis = await this.analyzeCurrentDistribution();
    const config = await this.getDropRateConfig();
    const changes: Array<{
      cardId: string;
      oldRarity: string;
      newRarity: string;
      reason: string;
    }> = [];

    if (analysis.isBalanced) {
      console.log("✅ System is already balanced, no changes needed");
      return { updatedCards: 0, changes: [], dryRun };
    }

    // Find rarities that need balancing
    const overrepresented: string[] = [];
    const underrepresented: string[] = [];

    for (const [raritySlug, data] of Object.entries(
      analysis.currentDistribution
    )) {
      if (data.deviation > 3) {
        // >3% deviation
        if (data.percentage > data.targetPercentage) {
          overrepresented.push(raritySlug);
        } else {
          underrepresented.push(raritySlug);
        }
      }
    }

    if (overrepresented.length === 0 || underrepresented.length === 0) {
      console.log("🔄 No clear rebalancing path found");
      return { updatedCards: 0, changes: [], dryRun };
    }

    console.log(
      `🎯 Rebalancing: ${overrepresented.length} over, ${underrepresented.length} under`
    );

    let updatesProcessed = 0;

    // Process overrepresented rarities
    for (const sourceRarity of overrepresented) {
      if (updatesProcessed >= maxUpdates) break;

      const sourceConfig = config.find((c) => c.raritySlug === sourceRarity);
      if (!sourceConfig) continue;

      // Find cards to move down
      const candidateCards = await prisma.card.findMany({
        where: { rarity: sourceRarity },
        select: { id: true, name: true, confidence: true },
        orderBy: { confidence: "asc" }, // Start with lowest confidence
        take: 50,
      });

      for (const card of candidateCards) {
        if (updatesProcessed >= maxUpdates) break;

        // Find suitable target rarity (lower level)
        const targetRarity = underrepresented.find((ur) => {
          const targetConfig = config.find((c) => c.raritySlug === ur);
          return targetConfig && targetConfig.level < sourceConfig.level;
        });

        if (targetRarity) {
          changes.push({
            cardId: card.id,
            oldRarity: sourceRarity,
            newRarity: targetRarity,
            reason: `Rebalancing: moving from overrepresented ${sourceRarity} to underrepresented ${targetRarity}`,
          });

          if (!dryRun) {
            await prisma.card.update({
              where: { id: card.id },
              data: { rarity: targetRarity },
            });
          }

          updatesProcessed++;
        }
      }
    }

    console.log(
      `${dryRun ? "🔍 DRY RUN" : "✅ APPLIED"}: ${updatesProcessed} card updates planned`
    );

    return {
      updatedCards: updatesProcessed,
      changes,
      dryRun,
    };
  }

  // Database-driven system - no fallback configuration
  // All drop rate data must come from database
}

// Export singleton instance
export const dropRateSystem = new DropRateSystem();

// Helper functions for easy usage
export async function assignRarityByDropRate(
  qualityScore?: number,
  cardId?: string
): Promise<string> {
  return dropRateSystem.assignRarityByDropRate(qualityScore, cardId);
}

export async function analyzeDropRateDistribution(): Promise<DropRateAnalysis> {
  return dropRateSystem.analyzeCurrentDistribution();
}

export async function autoBalanceDropRates(
  dryRun: boolean = true,
  maxUpdates: number = 100
) {
  return dropRateSystem.autoBalanceRarities(dryRun, maxUpdates);
}
