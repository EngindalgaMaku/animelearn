import Link from "next/link";
import { FileText, Calendar, Clock, ArrowRight, BookOpen, Code, Brain, Zap } from "lucide-react";
import { getAllBlogPosts, BlogPost } from "@/lib/blog";

export default function BlogPage() {
  // Server component olarak blog postlarını direkt yükle
  const posts = getAllBlogPosts();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Python Basics":
      case "Python Temelleri":
        return <Code className="h-5 w-5 text-blue-500" />;
      case "Python Applications":
        return <Zap className="h-5 w-5 text-purple-500" />;
      case "Data Analysis":
      case "Veri Analizi":
        return <Brain className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16 lg:py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="mb-6 inline-flex items-center rounded-full bg-white/20 px-6 py-3 text-sm font-semibold backdrop-blur-sm">
              <BookOpen className="mr-2 h-4 w-4 text-yellow-300" />
              Python Learning Guides
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block">Zumenzu</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Python Blog
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg text-blue-100 sm:text-xl">
              All the guides, tips and best practices you need while learning Python programming language are here.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
              📚 Python Learning Guides
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Comprehensive guides we've prepared for you to master Python programming from beginner to advanced level
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts found yet</h3>
              <p className="text-gray-600">Python learning guides will be published soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-slate-300"
                >
                  {/* Category Badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`inline-flex items-center space-x-2 rounded-full border px-3 py-1 text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {getCategoryIcon(post.category)}
                      <span>{post.category}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mb-4 text-slate-600 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">
            🚀 Start Your Python Journey
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            After reading blog posts, practice with interactive Python lessons on Zumenzu!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/code-arena"
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-semibold transition-all hover:from-yellow-600 hover:to-orange-600"
            >
              <Code className="h-5 w-5" />
              <span>Start Code Arena</span>
            </Link>
            
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <FileText className="h-5 w-5" />
              <span>Card Collection</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}