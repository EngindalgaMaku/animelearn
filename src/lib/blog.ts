import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { parseMarkdown, stripMarkdown, estimateReadingTime } from './markdown';

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

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  featured?: boolean;
  seoKeywords?: string;
}

const BLOG_POSTS_PATH = path.join(process.cwd(), 'blog-posts');

export function getAllBlogPosts(): BlogPost[] {
  try {
    const files = fs.readdirSync(BLOG_POSTS_PATH);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const posts = markdownFiles.map(file => {
      const filePath = path.join(BLOG_POSTS_PATH, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      const slug = file.replace('.md', '');
      const meta = data as BlogPostMeta;
      
      // Excerpt oluştur - description yoksa content'ten al
      const excerpt = meta.description || stripMarkdown(content).substring(0, 200) + '...';
      
      return {
        id: slug,
        slug,
        title: meta.title,
        excerpt,
        content: content, // Raw markdown olarak sakla, render sırasında parse et
        createdAt: meta.date,
        readTime: meta.readTime || `${estimateReadingTime(content)} dk`,
        category: meta.category,
        tags: meta.tags || [],
        author: meta.author,
        featured: meta.featured || false,
        seoKeywords: meta.seoKeywords
      };
    });
    
    // Tarihe göre sırala (en yeni önce)
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Blog posts loading error:', error);
    return [];
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const filePath = path.join(BLOG_POSTS_PATH, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const meta = data as BlogPostMeta;
    
    // Content'i HTML'e çevir
    const htmlContent = parseMarkdown(content);
    const excerpt = meta.description || stripMarkdown(content).substring(0, 200) + '...';
    
    return {
      id: slug,
      slug,
      title: meta.title,
      excerpt,
      content: htmlContent, // HTML olarak döndür
      createdAt: meta.date,
      readTime: meta.readTime || `${estimateReadingTime(content)} dk`,
      category: meta.category,
      tags: meta.tags || [],
      author: meta.author,
      featured: meta.featured || false,
      seoKeywords: meta.seoKeywords
    };
  } catch (error) {
    console.error('Blog post loading error:', error);
    return null;
  }
}

export function getFeaturedBlogPosts(): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.featured);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.category === category);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
  const allPosts = getAllBlogPosts();
  const categories = allPosts.map(post => post.category);
  return [...new Set(categories)];
}

export function getAllTags(): string[] {
  const allPosts = getAllBlogPosts();
  const tags = allPosts.flatMap(post => post.tags);
  return [...new Set(tags)];
}