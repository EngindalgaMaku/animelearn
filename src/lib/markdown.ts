import { marked } from 'marked';

// Basit markdown parsing yapacağız
export function parseMarkdown(markdown: string): string {
  try {
    // Marked'ı basit şekilde kullan
    const html = marked(markdown, {
      gfm: true,
      breaks: true,
    });
    
    // Promise ise string'e çevir
    if (typeof html === 'string') {
      return addTailwindClasses(html);
    } else {
      // Promise ise default content döndür
      return '<p class="text-red-600">Markdown yükleniyor...</p>';
    }
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return `<p class="text-red-600">Markdown işlenirken hata oluştu</p>`;
  }
}

function addTailwindClasses(html: string): string {
  // HTML'e Tailwind CSS sınıfları ekle
  return html
    // Headings
    .replace(/<h1>/g, '<h1 class="text-3xl font-bold mt-8 mb-4 text-slate-900">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-6 mb-3 text-slate-800">')
    .replace(/<h3>/g, '<h3 class="text-xl font-semibold mt-5 mb-3 text-slate-800">')
    .replace(/<h4>/g, '<h4 class="text-lg font-semibold mt-4 mb-2 text-slate-700">')
    .replace(/<h5>/g, '<h5 class="text-base font-semibold mt-3 mb-2 text-slate-700">')
    .replace(/<h6>/g, '<h6 class="text-sm font-semibold mt-2 mb-2 text-slate-600">')
    
    // Paragraphs
    .replace(/<p>/g, '<p class="mb-4 text-slate-700 leading-relaxed">')
    
    // Lists
    .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-2">')
    .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-2">')
    .replace(/<li>/g, '<li class="text-slate-700 ml-4">')
    
    // Links
    .replace(/<a /g, '<a class="text-blue-600 hover:text-blue-800 underline font-medium" ')
    
    // Code blocks
    .replace(/<pre><code/g, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4"><code')
    .replace(/<code>/g, '<code class="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">')
    
    // Blockquotes
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 italic text-slate-600 bg-blue-50 py-2">')
    
    // Tables
    .replace(/<table>/g, '<div class="overflow-x-auto my-6"><table class="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<thead>/g, '<thead class="bg-gray-50">')
    .replace(/<tbody>/g, '<tbody class="bg-white divide-y divide-gray-200">')
    .replace(/<tr>/g, '<tr class="hover:bg-gray-50">')
    .replace(/<th>/g, '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">')
    .replace(/<td>/g, '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">');
}

export function stripMarkdown(markdown: string): string {
  try {
    // Markdown'dan basit HTML çıkar
    const html = marked(markdown);
    
    if (typeof html === 'string') {
      const withoutTags = html.replace(/<[^>]*>/g, '');
      return withoutTags.substring(0, 300) + '...';
    } else {
      return markdown.substring(0, 300) + '...';
    }
  } catch (error) {
    console.error('Markdown stripping error:', error);
    return markdown.substring(0, 300) + '...';
  }
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}