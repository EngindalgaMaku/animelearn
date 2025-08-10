import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { seedBlogPosts } from "@/lib/blog-seeder";

// Admin kontrolü
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

// POST - Blog postlarını seed et (Admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🚀 Starting blog seeding process...");

    await seedBlogPosts();

    return NextResponse.json(
      {
        message: "Blog posts seeded successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Blog seeding failed:", error);
    return NextResponse.json(
      {
        error: "Failed to seed blog posts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET - Seed durumunu kontrol et (Admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { parseMarkdownFiles, getBlogStats } = await import(
      "@/lib/blog-seeder"
    );
    const { prisma } = await import("@/lib/prisma");

    // Markdown dosyalarını analiz et
    const markdownPosts = parseMarkdownFiles();
    const markdownStats = getBlogStats(markdownPosts);

    // Veritabanındaki blog sayısını getir
    const dbPostCount = await prisma.blogPost.count();
    const dbPosts = await prisma.blogPost.findMany({
      select: {
        slug: true,
        title: true,
        sourceFile: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      markdown: {
        totalFiles: markdownStats.totalPosts,
        categories: markdownStats.categories,
        featuredPosts: markdownStats.featuredPosts,
        totalReadTime: markdownStats.totalReadTime,
        files: markdownPosts.map((p) => ({
          fileName: p.fileName,
          slug: p.slug,
          title: p.frontMatter.title,
          category: p.frontMatter.category,
          featured: p.frontMatter.featured,
        })),
      },
      database: {
        totalPosts: dbPostCount,
        posts: dbPosts,
      },
      needsSeeding: markdownStats.totalPosts > dbPostCount,
    });
  } catch (error) {
    console.error("Error checking seed status:", error);
    return NextResponse.json(
      {
        error: "Failed to check seed status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
