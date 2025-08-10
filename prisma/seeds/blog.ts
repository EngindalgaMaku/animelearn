import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const prisma = new PrismaClient();

export async function seedBlogPosts() {
  console.log("📝 Seeding Blog Posts...");

  const blogPostsDir = path.join(process.cwd(), "blog-posts");

  try {
    const files = fs.readdirSync(blogPostsDir);
    const markdownFiles = files.filter((file) => file.endsWith(".md"));

    console.log(`Found ${markdownFiles.length} blog posts to seed`);

    for (const filename of markdownFiles) {
      const filePath = path.join(blogPostsDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data: frontMatter, content } = matter(fileContent);

      // Generate slug from filename
      const slug = filename.replace(".md", "");

      // Extract basic info from frontMatter and content
      const title =
        frontMatter.title ||
        slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      const description =
        frontMatter.description || content.substring(0, 200) + "...";
      const author = frontMatter.author || "Zumenzu Team";
      const tags = frontMatter.tags || ["Python", "Programming"];
      const publishedAt = frontMatter.publishedAt
        ? new Date(frontMatter.publishedAt)
        : new Date();
      const readingTime = Math.ceil(content.split(" ").length / 200); // ~200 words per minute

      const blogPost = {
        title,
        slug,
        description,
        content,
        author,
        category: frontMatter.category || "Python Programming",
        tags: JSON.stringify(Array.isArray(tags) ? tags : [tags]),
        isPublished: true,
        featured: frontMatter.featured || false,
        readTime: `${readingTime} min`,
        publishedAt,
        viewCount: 0,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await prisma.blogPost.upsert({
        where: { slug },
        update: blogPost,
        create: blogPost,
      });

      console.log(`✅ Seeded blog post: ${title}`);
    }

    console.log("🎉 Blog posts seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding blog posts:", error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await seedBlogPosts();
    console.log("✅ Blog seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding blog:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
