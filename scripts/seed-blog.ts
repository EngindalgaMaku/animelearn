import { seedBlogPosts } from "../src/lib/blog-seeder";

async function main() {
  console.log("🚀 Starting blog seeding process...");

  try {
    await seedBlogPosts();
    console.log("✅ Blog seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Blog seeding failed:", error);
    process.exit(1);
  }
}

main();
