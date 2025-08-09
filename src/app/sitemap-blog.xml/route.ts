import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  const baseUrl = 'https://zumenzu.com';
  
  try {
    // Get blog posts from the blog-posts directory
    const blogPostsDirectory = path.join(process.cwd(), 'blog-posts');
    
    let blogPosts: Array<{
      slug: string;
      lastModified: string;
      changeFrequency: string;
      priority: string;
    }> = [];

    // Check if blog-posts directory exists
    if (fs.existsSync(blogPostsDirectory)) {
      const fileNames = fs.readdirSync(blogPostsDirectory);
      
      blogPosts = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
          const slug = fileName.replace(/\.md$/, '');
          const fullPath = path.join(blogPostsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);
          
          return {
            slug,
            lastModified: data.updatedAt || data.date || new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: '0.7'
          };
        });
    }

    // Add some default blog posts for SEO even if directory doesn't exist
    const defaultBlogPosts = [
      {
        slug: 'python-programlamaya-giris-rehberi',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.9'
      },
      {
        slug: 'python-ile-neler-yapilir-2025-rehberi',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.8'
      },
      {
        slug: 'python-veri-analizi-pandas-rehberi',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.8'
      },
      {
        slug: 'oyunlastirma-ile-programlama-ogrenme-faydalar',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.7'
      },
      {
        slug: 'python-vs-javascript-karsilastirma-2025',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.7'
      },
      {
        slug: 'rozetler-basarimlar-motivasyon-psikolojisi',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.6'
      },
      {
        slug: 'python-web-gelistirme-django-flask-karsilastirma',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.7'
      },
      {
        slug: 'zumenzu-basari-hikayeleri-python-ogrenme',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: '0.6'
      }
    ];

    // Combine actual blog posts with defaults (remove duplicates)
    const allBlogPosts = [...blogPosts];
    defaultBlogPosts.forEach(defaultPost => {
      if (!allBlogPosts.find(post => post.slug === defaultPost.slug)) {
        allBlogPosts.push(defaultPost);
      }
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allBlogPosts.map(post => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.lastModified}</lastmod>
    <changefreq>${post.changeFrequency}</changefreq>
    <priority>${post.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    
    // Return minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}