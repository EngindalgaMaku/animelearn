'use client';

import { useState, useMemo } from 'react';
import { FileText, BookOpen, Code, TrendingUp, Users, Globe } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
// import { getAllBlogPosts, BlogPost } from '@/lib/blog';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  createdAt: string;
  readTime: string;
  category: string;
  tags: string[];
  author: string;
  featured?: boolean;
  seoKeywords?: string;
}

// Mock data for client-side rendering
const mockBlogPosts: BlogPost[] = [
  {
    id: 'python-basics',
    title: 'Python Programming Fundamentals',
    slug: 'python-basics',
    excerpt: 'Learn the essential concepts of Python programming with practical examples and exercises.',
    content: '',
    createdAt: '2025-01-08',
    readTime: '15 min',
    category: 'Basics',
    tags: ['python', 'programming', 'beginner'],
    author: 'Zumenzu Team',
    featured: true
  },
  {
    id: 'data-structures',
    title: 'Python Data Structures Guide',
    slug: 'data-structures',
    excerpt: 'Master Python lists, dictionaries, sets, and tuples with comprehensive examples.',
    content: '',
    createdAt: '2025-01-07',
    readTime: '20 min',
    category: 'Intermediate',
    tags: ['python', 'data-structures', 'programming'],
    author: 'Zumenzu Team',
    featured: true
  },
  {
    id: 'web-development',
    title: 'Web Development with Python',
    slug: 'web-development',
    excerpt: 'Build web applications using Python frameworks like Django and Flask.',
    content: '',
    createdAt: '2025-01-06',
    readTime: '25 min',
    category: 'Web Development',
    tags: ['python', 'web', 'django', 'flask'],
    author: 'Zumenzu Team',
    featured: true
  }
];

function getAllBlogPosts(): BlogPost[] {
  return mockBlogPosts;
}
import { BlogCategoryFilter } from '@/components/blog/BlogCategoryFilter';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { BreadcrumbSchema, WebSiteSchema } from '@/components/seo/SchemaMarkup';

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Blog statistics
  const stats = useMemo(() => {
    const categories = [...new Set(posts.map(p => p.category))];
    const totalReadTime = posts.reduce((acc, post) => {
      return acc + parseInt(post.readTime.replace(' min', ''));
    }, 0);
    
    return {
      totalPosts: posts.length,
      categories: categories.length,
      totalReadTime,
      featuredPosts: posts.filter(p => p.featured).length
    };
  }, [posts]);

  const featuredPosts = posts.filter(post => post.featured).slice(0, 3);

  const handleFilteredPostsChange = (newFilteredPosts: BlogPost[]) => {
    setFilteredPosts(newFilteredPosts);
  };

  // Get view mode from filter component
  const handleViewModeChange = () => {
    const filterElement = document.querySelector('[data-view-mode]') as HTMLElement;
    if (filterElement) {
      setViewMode(filterElement.dataset.viewMode as 'grid' | 'list');
    }
  };

  return (
    <>
      <Head>
        <title>Python Blog | Programming Guides and Tips - Zumenzu</title>
        <meta name="description" content="Comprehensive Python programming guides, tips and latest content. Learn Python from beginner to advanced level with data analysis, web development and career guides." />
        <meta name="keywords" content="python blog, python tutorial, programming tips, python guide, coding blog, python examples, data analysis, web development, python career, learn python, python programming, coding tutorials" />
        <link rel="canonical" href="/blog" />
        <meta property="og:title" content="Python Blog | Programming Guides - Zumenzu" />
        <meta property="og:description" content="Comprehensive blog articles to guide your Python learning journey. From basic concepts to advanced applications." />
        <meta property="og:image" content="/blog/blog-og-image.jpg" />
        <meta property="og:type" content="website" />
      </Head>

      {/* Schema Markup */}
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' }
      ]} />
      <WebSiteSchema />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16 lg:py-24">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          
          {/* Floating Elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-4 top-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl"></div>
            <div className="absolute -left-4 bottom-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center rounded-full bg-white/20 px-6 py-3 text-sm font-semibold backdrop-blur-sm">
                <BookOpen className="mr-2 h-4 w-4 text-yellow-300" />
                🐍 Python Learning Hub
              </div>

              {/* Main Headlines */}
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block">Zumenzu</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Python Blog
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-lg text-blue-100 sm:text-xl">
                <strong className="text-yellow-300">Comprehensive guides</strong>,
                <strong className="text-pink-300"> practical tips</strong> and <strong className="text-green-300">latest content</strong> to guide your Python programming learning journey
              </p>

              {/* Blog Stats */}
              <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-yellow-300">{stats.totalPosts}</div>
                  <div className="text-sm text-blue-200">Blog Posts</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-green-300">{stats.categories}</div>
                  <div className="text-sm text-blue-200">Categories</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-pink-300">{stats.totalReadTime}</div>
                  <div className="text-sm text-blue-200">Minutes Content</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-purple-300">{stats.featuredPosts}</div>
                  <div className="text-sm text-blue-200">Featured</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
                  ⭐ Featured Articles
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-slate-600">
                  Our most popular and useful Python guides
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {featuredPosts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    viewMode="grid"
                    featured={true}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Blog Section */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
                📚 All Python Guides
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-slate-600">
                Detailed guides, practical examples and real-world applications to support your Python learning journey from beginner to advanced level
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No blog posts yet</h3>
                <p className="text-gray-600">Python learning guides coming soon!</p>
                
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/code-arena"
                    className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600"
                  >
                    <Code className="h-5 w-5" />
                    <span>Practice in Code Arena until then</span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Filter Component */}
                <div className="mb-8" onClick={handleViewModeChange}>
                  <BlogCategoryFilter
                    posts={posts}
                    onFilteredPostsChange={handleFilteredPostsChange}
                  />
                </div>

                {/* Posts Grid/List */}
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found matching your criteria</h3>
                    <p className="text-gray-600">Try changing the filters.</p>
                  </div>
                ) : (
                  <div className={`
                    ${viewMode === 'grid' 
                      ? 'grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3' 
                      : 'space-y-6'
                    }
                  `}>
                    {filteredPosts.map((post) => (
                      <BlogPostCard
                        key={post.id}
                        post={post}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Learning Path CTA */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16 text-white lg:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold lg:text-4xl">
              🚀 Start Your Python Learning Journey
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              After getting theoretical knowledge from blog posts, practice with interactive Python lessons!
            </p>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Link
                href="/code-arena"
                className="group rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Code className="mx-auto mb-4 h-8 w-8 text-yellow-300" />
                <h3 className="mb-2 text-lg font-semibold">Code Arena</h3>
                <p className="text-sm text-blue-100">
                  Improve your coding skills with interactive Python challenges
                </p>
              </Link>
              
              <Link
                href="/shop"
                className="group rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <FileText className="mx-auto mb-4 h-8 w-8 text-green-300" />
                <h3 className="mb-2 text-lg font-semibold">Card Collection</h3>
                <p className="text-sm text-blue-100">
                  Collect anime cards as you learn Python and grow your collection
                </p>
              </Link>

              <Link
                href="/dashboard"
                className="group rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <TrendingUp className="mx-auto mb-4 h-8 w-8 text-pink-300" />
                <h3 className="mb-2 text-lg font-semibold">Progress Dashboard</h3>
                <p className="text-sm text-blue-100">
                  Track your learning progress and earn badges
                </p>
              </Link>
            </div>

            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-semibold transition-all hover:from-yellow-600 hover:to-orange-600"
              >
                <Users className="h-6 w-6" />
                <span>Create Free Account</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              📧 Python Blog Updates
            </h2>
            <p className="mb-8 text-lg text-slate-600">
              Be the first to know about new Python guides and tips!
            </p>
            
            <form className="mx-auto flex max-w-md gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
              >
                Subscribe
              </button>
            </form>
            
            <p className="mt-4 text-sm text-slate-500">
              No spam. You can unsubscribe at any time.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}