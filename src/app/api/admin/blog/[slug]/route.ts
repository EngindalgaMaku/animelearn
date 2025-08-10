import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface AdminBlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Admin kontrolü
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return false;
  }
  return true;
}

// GET - Belirli bir blog postunu getir (Admin only)
export async function GET(request: NextRequest, context: AdminBlogPageProps) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await context.params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        authorUser: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        interactions: {
          select: {
            hasViewed: true,
            hasLiked: true,
            timeSpent: true,
          },
        },
        _count: {
          select: {
            interactions: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Transform tags from JSON string to array
    const transformedPost = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error("Error fetching admin blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT - Blog postunu güncelle (Admin only)
export async function PUT(request: NextRequest, context: AdminBlogPageProps) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await context.params;
    const body = await request.json();

    const {
      title,
      newSlug,
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

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check if new slug already exists (if slug is being changed)
    if (newSlug && newSlug !== slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: newSlug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data: {
        title: title || existingPost.title,
        slug: newSlug || existingPost.slug,
        description:
          description !== undefined ? description : existingPost.description,
        content: content || existingPost.content,
        excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
        category: category || existingPost.category,
        tags: tags ? JSON.stringify(tags) : existingPost.tags,
        featured: featured !== undefined ? featured : existingPost.featured,
        readTime: readTime || existingPost.readTime,
        estimatedMinutes: estimatedMinutes || existingPost.estimatedMinutes,
        author: author || existingPost.author,
        seoKeywords:
          seoKeywords !== undefined ? seoKeywords : existingPost.seoKeywords,
        metaDescription:
          metaDescription !== undefined
            ? metaDescription
            : existingPost.metaDescription,
        socialImageUrl:
          socialImageUrl !== undefined
            ? socialImageUrl
            : existingPost.socialImageUrl,
        isPublished:
          isPublished !== undefined ? isPublished : existingPost.isPublished,
        publishedAt:
          isPublished && !existingPost.publishedAt
            ? new Date()
            : publishedAt
              ? new Date(publishedAt)
              : existingPost.publishedAt,
        authorId: authorId !== undefined ? authorId : existingPost.authorId,
        language: language || existingPost.language,
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

    // Transform tags from JSON string to array
    const transformedPost = {
      ...updatedPost,
      tags: updatedPost.tags ? JSON.parse(updatedPost.tags) : [],
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error("Error updating admin blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE - Blog postunu sil (Admin only)
export async function DELETE(
  request: NextRequest,
  context: AdminBlogPageProps
) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await context.params;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete all related interactions first
    await prisma.blogPostInteraction.deleteMany({
      where: { postId: existingPost.id },
    });

    // Delete the blog post
    await prisma.blogPost.delete({
      where: { slug },
    });

    return NextResponse.json(
      { message: "Blog post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting admin blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
