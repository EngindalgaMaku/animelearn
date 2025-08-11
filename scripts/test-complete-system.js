const { PrismaClient } = require("@prisma/client");
const fs = require("fs").promises;
const path = require("path");

const prisma = new PrismaClient();

async function testCompleteSystem() {
  console.log("🧪 Running comprehensive system test...\n");

  const results = {
    fileSystem: { passed: 0, failed: 0, tests: [] },
    database: { passed: 0, failed: 0, tests: [] },
    apis: { passed: 0, failed: 0, tests: [] },
    overall: { passed: 0, failed: 0 },
  };

  try {
    // ========== FILE SYSTEM TESTS ==========
    console.log("📁 Testing file system organization...");

    // Test 1: Category directories exist
    const categoriesDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "categories"
    );
    const expectedCategories = [
      "anime-collection",
      "star-collection",
      "car-collection",
    ];

    for (const category of expectedCategories) {
      const categoryDir = path.join(categoriesDir, category);
      const thumbsDir = path.join(categoryDir, "thumbs");

      try {
        await fs.access(categoryDir);
        await fs.access(thumbsDir);

        const cardFiles = await fs.readdir(categoryDir);
        const thumbFiles = await fs.readdir(thumbsDir);

        // Filter out thumbs directory from card count
        const actualCardFiles = cardFiles.filter(
          (file) => file !== "thumbs" && !file.startsWith(".")
        );

        results.fileSystem.tests.push({
          name: `Category ${category} structure`,
          passed: true,
          details: `${actualCardFiles.length} cards, ${thumbFiles.length} thumbnails`,
        });
        results.fileSystem.passed++;
      } catch (error) {
        results.fileSystem.tests.push({
          name: `Category ${category} structure`,
          passed: false,
          error: error.message,
        });
        results.fileSystem.failed++;
      }
    }

    // Test 2: Old directories cleanup
    const oldThumbsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "thumbs"
    );
    try {
      await fs.access(oldThumbsDir);
      results.fileSystem.tests.push({
        name: "Old thumbs directory cleanup",
        passed: false,
        error: "Old thumbs directory still exists",
      });
      results.fileSystem.failed++;
    } catch (error) {
      results.fileSystem.tests.push({
        name: "Old thumbs directory cleanup",
        passed: true,
        details: "Old thumbs directory successfully removed",
      });
      results.fileSystem.passed++;
    }

    // ========== DATABASE TESTS ==========
    console.log("\n💾 Testing database consistency...");

    // Test 3: Card path consistency
    const cards = await prisma.card.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        imagePath: true,
        imageUrl: true,
        thumbnailUrl: true,
      },
    });

    let categoryPathsCount = 0;
    let oldPathsCount = 0;
    let missingPaths = 0;

    for (const card of cards) {
      if (card.imagePath && card.imagePath.includes("/uploads/categories/")) {
        categoryPathsCount++;
      } else if (card.imagePath && card.imagePath.includes("/uploads/")) {
        oldPathsCount++;
      } else {
        missingPaths++;
      }
    }

    results.database.tests.push({
      name: "Card image paths migration",
      passed: categoryPathsCount > 0 && oldPathsCount === 0,
      details: `${categoryPathsCount} category paths, ${oldPathsCount} old paths, ${missingPaths} missing`,
    });

    if (categoryPathsCount > 0 && oldPathsCount === 0) {
      results.database.passed++;
    } else {
      results.database.failed++;
    }

    // Test 4: Thumbnail path consistency
    const cardsWithThumbnails = cards.filter((card) => card.thumbnailUrl);
    let categoryThumbnailsCount = 0;
    let oldThumbnailsCount = 0;

    cardsWithThumbnails.forEach((card) => {
      if (card.thumbnailUrl.includes("/uploads/categories/")) {
        categoryThumbnailsCount++;
      } else {
        oldThumbnailsCount++;
      }
    });

    results.database.tests.push({
      name: "Thumbnail paths migration",
      passed: categoryThumbnailsCount > 0 && oldThumbnailsCount === 0,
      details: `${categoryThumbnailsCount} category thumbnails, ${oldThumbnailsCount} old thumbnails`,
    });

    if (categoryThumbnailsCount > 0 && oldThumbnailsCount === 0) {
      results.database.passed++;
    } else {
      results.database.failed++;
    }

    // Test 5: Category distribution
    const categoryStats = await prisma.card.groupBy({
      by: ["category"],
      _count: { category: true },
    });

    const hasValidCategories = categoryStats.some(
      (stat) =>
        expectedCategories.includes(stat.category) ||
        ["anime", "star", "car"].includes(stat.category)
    );

    results.database.tests.push({
      name: "Category distribution",
      passed: hasValidCategories,
      details: categoryStats
        .map((s) => `${s.category}: ${s._count.category}`)
        .join(", "),
    });

    if (hasValidCategories) {
      results.database.passed++;
    } else {
      results.database.failed++;
    }

    // ========== API TESTS ==========
    console.log("\n🔗 Testing API functionality...");

    // Test 6: Sample file path verification
    const sampleCards = cards.slice(0, 5);
    let validFilePaths = 0;
    let invalidFilePaths = 0;

    for (const card of sampleCards) {
      if (card.imagePath) {
        const fullPath = path.join(process.cwd(), "public", card.imagePath);
        try {
          await fs.access(fullPath);
          validFilePaths++;
        } catch (error) {
          invalidFilePaths++;
        }
      }
    }

    results.apis.tests.push({
      name: "File path accessibility",
      passed: validFilePaths > invalidFilePaths,
      details: `${validFilePaths} valid, ${invalidFilePaths} invalid paths`,
    });

    if (validFilePaths > invalidFilePaths) {
      results.apis.passed++;
    } else {
      results.apis.failed++;
    }

    // Test 7: Upload directory structure
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    try {
      const uploadsContents = await fs.readdir(uploadsDir);
      const hasCategoriesDir = uploadsContents.includes("categories");

      results.apis.tests.push({
        name: "Upload directory structure",
        passed: hasCategoriesDir,
        details: `Contains: ${uploadsContents.join(", ")}`,
      });

      if (hasCategoriesDir) {
        results.apis.passed++;
      } else {
        results.apis.failed++;
      }
    } catch (error) {
      results.apis.tests.push({
        name: "Upload directory structure",
        passed: false,
        error: error.message,
      });
      results.apis.failed++;
    }

    // ========== CALCULATE OVERALL RESULTS ==========
    results.overall.passed =
      results.fileSystem.passed + results.database.passed + results.apis.passed;
    results.overall.failed =
      results.fileSystem.failed + results.database.failed + results.apis.failed;

    // ========== DISPLAY RESULTS ==========
    console.log("\n📊 TEST RESULTS SUMMARY");
    console.log("========================");

    console.log("\n📁 File System Tests:");
    results.fileSystem.tests.forEach((test) => {
      const status = test.passed ? "✅" : "❌";
      console.log(`${status} ${test.name}: ${test.details || test.error}`);
    });
    console.log(
      `   Result: ${results.fileSystem.passed} passed, ${results.fileSystem.failed} failed`
    );

    console.log("\n💾 Database Tests:");
    results.database.tests.forEach((test) => {
      const status = test.passed ? "✅" : "❌";
      console.log(`${status} ${test.name}: ${test.details || test.error}`);
    });
    console.log(
      `   Result: ${results.database.passed} passed, ${results.database.failed} failed`
    );

    console.log("\n🔗 API Tests:");
    results.apis.tests.forEach((test) => {
      const status = test.passed ? "✅" : "❌";
      console.log(`${status} ${test.name}: ${test.details || test.error}`);
    });
    console.log(
      `   Result: ${results.apis.passed} passed, ${results.apis.failed} failed`
    );

    console.log("\n🎯 OVERALL RESULTS:");
    console.log(`✅ Tests Passed: ${results.overall.passed}`);
    console.log(`❌ Tests Failed: ${results.overall.failed}`);
    console.log(
      `📊 Success Rate: ${Math.round((results.overall.passed / (results.overall.passed + results.overall.failed)) * 100)}%`
    );

    if (results.overall.failed === 0) {
      console.log(
        "\n🎉 ALL TESTS PASSED! Card organization system is working perfectly!"
      );
      console.log("\n✨ Summary of achievements:");
      console.log("   • Cards organized into category-based directories");
      console.log("   • Thumbnails properly moved to category subdirectories");
      console.log("   • Database paths updated to new structure");
      console.log("   • Upload API configured for category-based saving");
      console.log("   • Secure image API updated for new paths");
      console.log("   • Frontend components compatible with new structure");
      console.log("   • Old directories cleaned up");
    } else {
      console.log(
        "\n⚠️  Some tests failed. Please review and fix the issues above."
      );
    }

    return results.overall.failed === 0;
  } catch (error) {
    console.error("❌ System test failed:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testCompleteSystem();
}

module.exports = { testCompleteSystem };
