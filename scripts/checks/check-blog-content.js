const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkBlogContent() {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: "python-web-development-apis-2025" },
    });

    if (!post) {
      console.log("Post not found");
      return;
    }

    console.log("Content type:", typeof post.content);
    console.log("Content length:", post.content?.length);
    console.log("Content preview (first 500 chars):");
    console.log(post.content?.substring(0, 500));
    console.log("\n=== END CONTENT PREVIEW ===");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogContent();
