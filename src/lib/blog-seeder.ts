import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { prisma } from "./prisma";

interface BlogPostFrontMatter {
  title: string;
  description?: string;
  date: string;
  author?: string;
  category?: string;
  tags?: string[];
  readTime?: string;
  featured?: boolean;
  seoKeywords?: string;
}

interface ParsedBlogPost {
  frontMatter: BlogPostFrontMatter;
  content: string;
  slug: string;
  fileName: string;
}

// Markdown dosyalarını oku ve parse et
export function parseMarkdownFiles(): ParsedBlogPost[] {
  const blogPostsDir = path.join(process.cwd(), "blog-posts");

  if (!fs.existsSync(blogPostsDir)) {
    console.warn("blog-posts directory not found");
    return [];
  }

  const fileNames = fs.readdirSync(blogPostsDir);
  const markdownFiles = fileNames.filter((name) => name.endsWith(".md"));

  console.log(`Found ${markdownFiles.length} markdown files`);

  const posts: ParsedBlogPost[] = [];

  for (const fileName of markdownFiles) {
    try {
      const fullPath = path.join(blogPostsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Parse front matter
      const { data: frontMatter, content } = matter(fileContents);

      // Generate slug from filename
      const slug = fileName.replace(/\.md$/, "");

      // Validate required fields
      if (!frontMatter.title) {
        console.warn(`Skipping ${fileName}: missing title`);
        continue;
      }

      posts.push({
        frontMatter: frontMatter as BlogPostFrontMatter,
        content,
        slug,
        fileName,
      });

      console.log(`Parsed: ${fileName} -> ${slug}`);
    } catch (error) {
      console.error(`Error parsing ${fileName}:`, error);
    }
  }

  return posts;
}

// Markdown içeriğini HTML'e çevir
export function markdownToHtml(markdown: string): string {
  const result = marked(markdown);
  return typeof result === "string" ? result : "";
}

// Excerpt oluştur (ilk paragraf veya 160 karakter)
export function generateExcerpt(
  content: string,
  maxLength: number = 160
): string {
  // HTML etiketlerini kaldır
  const textContent = content.replace(/<[^>]*>/g, "");

  // İlk paragrafı bul
  const firstParagraph = textContent.split("\n\n")[0];

  if (firstParagraph && firstParagraph.length <= maxLength) {
    return firstParagraph.trim();
  }

  // Maksimum uzunlukta kes ve son kelimeyi tamamla
  if (textContent.length <= maxLength) {
    return textContent.trim();
  }

  const truncated = textContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (
    (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "..."
  );
}

// Tahmini okuma süresini hesapla
export function calculateReadingTime(content: string): {
  readTime: string;
  estimatedMinutes: number;
} {
  const wordsPerMinute = 200; // Ortalama okuma hızı
  const textContent = content.replace(/<[^>]*>/g, ""); // HTML etiketlerini kaldır
  const wordCount = textContent.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return {
    readTime: `${minutes} min`,
    estimatedMinutes: minutes,
  };
}

// Slug'ı normalize et
export function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Blog postlarını veritabanına seed et
export async function seedBlogPosts(): Promise<void> {
  try {
    console.log("🌱 Starting blog posts seeding...");

    const parsedPosts = parseMarkdownFiles();

    if (parsedPosts.length === 0) {
      console.log("No blog posts to seed");
      return;
    }

    let seedCount = 0;
    let updateCount = 0;
    let skipCount = 0;

    for (const post of parsedPosts) {
      try {
        const {
          title,
          description,
          date,
          author,
          category,
          tags,
          readTime,
          featured,
          seoKeywords,
        } = post.frontMatter;

        // HTML içeriği oluştur
        const htmlContent = markdownToHtml(post.content);

        // Excerpt oluştur
        const excerpt = description || generateExcerpt(post.content);

        // Okuma süresini hesapla
        const readingTime = calculateReadingTime(post.content);

        // Slug'ı normalize et
        const normalizedSlug = normalizeSlug(post.slug);

        // Mevcut post'u kontrol et
        const existingPost = await prisma.blogPost.findUnique({
          where: { slug: normalizedSlug },
        });

        const postData = {
          title,
          slug: normalizedSlug,
          description,
          content: htmlContent,
          excerpt,
          category: category || "Python Basics",
          tags: JSON.stringify(tags || []),
          featured: featured || false,
          readTime: readTime || readingTime.readTime,
          estimatedMinutes: readingTime.estimatedMinutes,
          author: author || "Zumenzu Programming Team",
          seoKeywords,
          metaDescription: description,
          isPublished: true,
          publishedAt: new Date(date),
          sourceFile: post.fileName,
          sourceFormat: "markdown",
          language: "tr",
        };

        if (existingPost) {
          // Güncelle
          await prisma.blogPost.update({
            where: { slug: normalizedSlug },
            data: postData,
          });
          updateCount++;
          console.log(`✅ Updated: ${title}`);
        } else {
          // Yeni oluştur
          await prisma.blogPost.create({
            data: postData,
          });
          seedCount++;
          console.log(`🆕 Created: ${title}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${post.fileName}:`, error);
        skipCount++;
      }
    }

    console.log("\n🎉 Blog seeding completed!");
    console.log(`📊 Summary:`);
    console.log(`  - Created: ${seedCount} posts`);
    console.log(`  - Updated: ${updateCount} posts`);
    console.log(`  - Skipped: ${skipCount} posts`);
    console.log(
      `  - Total processed: ${seedCount + updateCount + skipCount} posts`
    );
  } catch (error) {
    console.error("❌ Blog seeding failed:", error);
    throw error;
  }
}

// Blog kategorilerini getir
export function getBlogCategories(posts: ParsedBlogPost[]): string[] {
  const categories = new Set<string>();

  posts.forEach((post) => {
    if (post.frontMatter.category) {
      categories.add(post.frontMatter.category);
    }
  });

  return Array.from(categories).sort();
}

// Blog istatistiklerini getir
export function getBlogStats(posts: ParsedBlogPost[]) {
  const stats = {
    totalPosts: posts.length,
    categories: getBlogCategories(posts),
    featuredPosts: posts.filter((p) => p.frontMatter.featured).length,
    totalReadTime: posts.reduce((acc, post) => {
      const readTime = post.frontMatter.readTime || "5 min";
      const minutes = parseInt(readTime.replace(" min", ""));
      return acc + (isNaN(minutes) ? 5 : minutes);
    }, 0),
    authors: Array.from(
      new Set(
        posts.map((p) => p.frontMatter.author || "Zumenzu Programming Team")
      )
    ),
  };

  return stats;
}
