const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function exportBlogs() {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log(`Exporting ${blogs.length} blog posts...`);

    const blogData = blogs.map((blog) => ({
      title: blog.title,
      slug: blog.slug,
      description: blog.description,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      tags: blog.tags,
      featured: blog.featured,
      readTime: blog.readTime,
      estimatedMinutes: blog.estimatedMinutes,
      author: blog.author,
      seoKeywords: blog.seoKeywords,
      metaDescription: blog.metaDescription,
      socialImageUrl: blog.socialImageUrl,
      isPublished: blog.isPublished,
      publishedAt: blog.publishedAt,
      language: blog.language || "tr",
    }));

    // Write to file for easy copy-paste
    fs.writeFileSync(
      "blog-data-export.json",
      JSON.stringify(blogData, null, 2)
    );
    console.log("✅ Blog data exported to blog-data-export.json");

    return blogData;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

exportBlogs();
