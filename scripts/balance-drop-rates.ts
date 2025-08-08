import { prisma } from "../src/lib/prisma";

async function balanceDropRates() {
  console.log("🎯 Starting drop rate balancing...");

  try {
    // Get all rarities
    const rarities = await prisma.rarity.findMany({
      orderBy: { level: "asc" },
    });

    console.log(`📊 Found ${rarities.length} rarities`);

    if (rarities.length === 0) {
      console.log("❌ No rarities found to balance");
      return;
    }

    // Show current drop rates
    console.log("\n📈 Current Drop Rates:");
    let totalCurrent = 0;
    rarities.forEach((rarity) => {
      console.log(`  ${rarity.name}: ${rarity.dropRate}%`);
      totalCurrent += rarity.dropRate;
    });
    console.log(`  Total: ${totalCurrent}%`);

    // Calculate balanced drop rates (inversely proportional to rarity level)
    // Higher level (rarer) = lower drop rate
    const weights = rarities.map((r) => 1 / Math.pow(r.level, 1.5)); // Exponential decrease
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    // Suggested balanced drop rates
    const balancedRates = weights.map((weight) => (weight / totalWeight) * 100);

    console.log("\n💡 Suggested Balanced Drop Rates:");
    let totalSuggested = 0;
    rarities.forEach((rarity, index) => {
      const rate = Math.round(balancedRates[index] * 10) / 10; // Round to 1 decimal
      console.log(`  ${rarity.name} (Level ${rarity.level}): ${rate}%`);
      totalSuggested += rate;
    });
    console.log(`  Total: ${totalSuggested.toFixed(1)}%`);

    // Ask for confirmation (in real scenario)
    console.log("\n🔄 Applying balanced drop rates...");

    // Update each rarity with balanced drop rate
    for (let i = 0; i < rarities.length; i++) {
      const rarity = rarities[i];
      const newRate = Math.round(balancedRates[i] * 10) / 10;

      await prisma.rarity.update({
        where: { id: rarity.id },
        data: { dropRate: newRate },
      });

      console.log(
        `✅ Updated ${rarity.name}: ${rarity.dropRate}% → ${newRate}%`
      );
    }

    // Verify final totals
    const updatedRarities = await prisma.rarity.findMany({
      orderBy: { level: "asc" },
    });

    let finalTotal = 0;
    console.log("\n🎉 Final Drop Rates:");
    updatedRarities.forEach((rarity) => {
      console.log(`  ${rarity.name}: ${rarity.dropRate}%`);
      finalTotal += rarity.dropRate;
    });
    console.log(`  Total: ${finalTotal.toFixed(1)}%`);

    console.log("\n✅ Drop rate balancing completed!");
  } catch (error) {
    console.error("💥 Error balancing drop rates:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
balanceDropRates().catch(console.error);
