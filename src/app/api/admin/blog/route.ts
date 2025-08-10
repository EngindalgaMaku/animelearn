import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Admin kontrolü
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

// GET - Tüm blog postlarını getir (Admin only)
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const published = searchParams.get("published");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const search = searchParams.get("search");

    const where: any = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (published === "true") {
      where.isPublished = true;
    } else if (published === "false") {
      where.isPublished = false;
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
      include: {
        authorUser: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            interactions: true,
          },
        },
      },
    });

    // Transform tags from JSON string to array
    const transformedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    }));

    // Get total count for pagination
    const totalCount = await prisma.blogPost.count({ where });

    return NextResponse.json({
      posts: transformedPosts,
      totalCount,
      pagination: {
        limit: limit ? parseInt(limit) : posts.length,
        offset: offset ? parseInt(offset) : 0,
        hasMore: totalCount > (offset ? parseInt(offset) : 0) + posts.length,
      },
    });
  } catch (error) {
    console.error("Error fetching admin blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST - Yeni blog post oluştur (Admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      content,
      excerpt,
      category,
      tags,
      featured,
      readTime,
      estimatedMinutes,
      author,
      seoKeywords,
      metaDescription,
      socialImageUrl,
      isPublished,
      publishedAt,
      authorId,
      language,
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        description,
        content,
        excerpt,
        category: category || "General",
        tags: JSON.stringify(tags || []),
        featured: featured || false,
        readTime: readTime || "5 min",
        estimatedMinutes: estimatedMinutes || 5,
        author: author || "Zumenzu Programming Team",
        seoKeywords,
        metaDescription,
        socialImageUrl,
        isPublished: isPublished || false,
        publishedAt: isPublished ? publishedAt || new Date() : null,
        authorId,
        language: language || "tr",
      },
      include: {
        authorUser: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
