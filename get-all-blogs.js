const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllBlogs() {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${blogs.length} blog posts:`);

    blogs.forEach((blog) => {
      console.log(`\n=== ${blog.title} ===`);
      console.log(`Slug: ${blog.slug}`);
      console.log(`Category: ${blog.category}`);
      console.log(`Author: ${blog.author}`);
      console.log(`Published: ${blog.isPublished}`);
      console.log(`Tags: ${blog.tags}`);
      console.log(`Content length: ${blog.content?.length} chars`);
      console.log(`Created: ${blog.createdAt}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

getAllBlogs();
