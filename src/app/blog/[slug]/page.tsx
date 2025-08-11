import Link from "next/link";
import { ArrowLeft, Calendar, Clock, FileText, User, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { marked } from "marked";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Get blog post from database directly
  let post;
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        authorUser: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (!blogPost) {
      notFound();
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: blogPost.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    // Transform tags from JSON string to array and convert markdown to HTML
    post = {
      ...blogPost,
      tags: blogPost.tags ? JSON.parse(blogPost.tags) : [],
      content: marked(blogPost.content || ""),
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }

  // Post bulunamazsa 404 sayfasına yönlendir
  if (!post) {
    notFound();
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Python Basics":
      case "Python Temelleri":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Python Applications":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Data Analysis":
      case "Veri Analizi":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>
          </div>

          <div className="text-white">
            <div
              className={`mb-4 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium ${getCategoryColor(post.category)} bg-white`}
            >
              <FileText className="mr-2 h-4 w-4" />
              {post.category}
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-5xl">
              {post.title}
            </h1>

            <p className="mb-8 text-lg text-blue-100 lg:text-xl">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(
                    post.publishedAt || post.createdAt
                  ).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-xl lg:p-12">
            {/* Tags */}
            <div className="mb-8 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                >
                  <Tag className="h-3 w-3" />
                  <span>#{tag}</span>
                </span>
              ))}
            </div>

            {/* Article Content - Rendered HTML */}
            <div className="blog-content">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                🚀 Continue Learning Python!
              </h3>
              <p className="mb-6 text-slate-600">
                You've read the blog post, now it's time to practice with
                interactive lessons!
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/code-arena"
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600"
                >
                  <FileText className="h-5 w-5" />
                  <span>Start Code Arena</span>
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center space-x-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Other Blog Posts</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
