import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  jsonLd?: Record<string, any>;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = 'https://zumenzu.com';
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: config.canonical ? `${baseUrl}${config.canonical}` : undefined,
    },
    openGraph: {
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
      url: config.canonical ? `${baseUrl}${config.canonical}` : baseUrl,
      siteName: 'Zumenzu',
      images: [
        {
          url: config.openGraph?.image || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: config.openGraph?.title || config.title,
        },
      ],
      locale: 'tr_TR',
      type: (config.openGraph?.type as any) || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
      site: '@zumenzu',
      creator: '@zumenzu',
      images: [config.openGraph?.image || '/twitter-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Pre-defined metadata templates
export const seoTemplates = {
  home: {
    title: 'Python Öğrenin | Kart Toplama ile Gamification Eğitim - Zumenzu',
    description: 'Python programlamayı anime kartları toplayarak, rozetler kazanarak öğrenin. Türkiye\'nin en eğlenceli online Python kursu. Ücretsiz başlayın! 💎🎌🏆',
    keywords: [
      'python öğrenme',
      'python kursu',
      'kodlama öğrenme',
      'programlama eğitimi',
      'gamification',
      'anime kartları',
      'python tutorial',
      'online python eğitimi',
      'python başlangıç',
      'interactive coding'
    ],
    canonical: '/',
  },
  
  blog: {
    title: 'Python Blog | Programlama Rehberleri ve İpuçları - Zumenzu',
    description: 'Python programlama dili hakkında detaylı rehberler, ipuçları ve en güncel içerikler. Başlangıçtan ileri seviyeye Python öğrenme kaynakları.',
    keywords: [
      'python blog',
      'python rehberi',
      'programlama ipuçları',
      'python tutorial',
      'kodlama blog',
      'python örnekleri'
    ],
    canonical: '/blog',
  },
  
  shop: {
    title: 'Python Kart Koleksiyonu | Anime & Star Cards - Zumenzu Shop',
    description: 'Python öğrenerek anime kartları ve star kartları toplayın. 250+ unique kart, nadir kartlar ve efsanevi koleksiyonlar sizi bekliyor!',
    keywords: [
      'python kartları',
      'anime kart koleksiyonu',
      'star cards',
      'nadir kartlar',
      'kart toplama oyunu',
      'python shop'
    ],
    canonical: '/shop',
  },
  
  codeArena: {
    title: 'Code Arena | Python Pratik Alanları - Zumenzu',
    description: 'İnteraktif Python challenges ile kodlama becerilerinizi geliştirin. Memory games, quizler ve pratik alıştırmalarla Python ustası olun!',
    keywords: [
      'python pratik',
      'code arena',
      'python challenges',
      'kodlama alıştırmaları',
      'python quiz',
      'interactive coding'
    ],
    canonical: '/code-arena',
  },
  
  quizArena: {
    title: 'Quiz Arena | Python Quiz Yarışması - Zumenzu',
    description: 'Python bilginizi test edin! Daily quizler, weekly challenges ve interaktif sorularla Python knowledge\'ınızı geliştirin.',
    keywords: [
      'python quiz',
      'quiz arena',
      'python test',
      'kodlama quizi',
      'python yarışması',
      'python sorular'
    ],
    canonical: '/quiz-arena',
  },
  
  pythonCourse: {
    title: 'Ücretsiz Python Kursu | Sıfırdan İleri Seviyeye - Zumenzu',
    description: 'Gamification ile Python öğrenin! Temel seviyeden ileri seviyeye kadar comprehensive Python course. Anime kartları toplayarak öğrenin.',
    keywords: [
      'ücretsiz python kursu',
      'python eğitimi',
      'sıfırdan python',
      'python öğrenme',
      'online python course',
      'python certification'
    ],
    canonical: '/python-kursu',
  },
  
  cardCollection: {
    title: 'Kart Koleksiyonu | Python Öğrendikçe Anime & Star Kartları Topla',
    description: 'Her Python dersi tamamladığınızda yeni kartlar kazanın! Anime collection, star collection ve nadir kartlarla koleksiyonunuzu büyütün.',
    keywords: [
      'kart koleksiyonu',
      'anime kartlar',
      'star kartlar',
      'python kartları',
      'koleksiyon oyunu',
      'nadir kartlar'
    ],
    canonical: '/kart-koleksiyonu',
  },
  
  achievements: {
    title: 'Python Rozetleri & Başarımlar | Öğrenme Motivasyonunuzu Artırın',
    description: 'Python öğrenme journey\'inizde rozetler kazanın! Achievement system ile motivasyonunuzu yüksek tutun ve progress\'inizi takip edin.',
    keywords: [
      'python rozetleri',
      'achievements',
      'başarımlar',
      'python badges',
      'learning motivation',
      'progress tracking'
    ],
    canonical: '/rozetler-basarimlar',
  },
  
  dailyQuests: {
    title: 'Günlük Python Görevleri | Sürekli Pratik ile Ustalaşın',
    description: 'Her gün yeni Python challenges! Daily quests ile sürekli pratik yapın, diamonds kazanın ve coding skills\'lerinizi gelişstirin.',
    keywords: [
      'günlük python görevleri',
      'daily quests',
      'python pratik',
      'daily challenges',
      'continuous learning',
      'python exercises'
    ],
    canonical: '/gunluk-gorevler',
  },
};

// Blog post metadata generator
export function generateBlogMetadata(
  title: string,
  description: string,
  slug: string,
  publishDate?: string,
  tags?: string[]
): Metadata {
  const fullTitle = `${title} | Python Blog - Zumenzu`;
  const keywords = [
    'python',
    'programlama',
    'coding',
    'tutorial',
    ...(tags || [])
  ];
  
  return generateMetadata({
    title: fullTitle,
    description,
    keywords,
    canonical: `/blog/${slug}`,
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      image: `/blog/images/${slug}-og.jpg`,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      author: {
        '@type': 'Organization',
        name: 'Zumenzu Team',
        url: 'https://zumenzu.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Zumenzu',
        logo: {
          '@type': 'ImageObject',
          url: 'https://zumenzu.com/logo.png'
        }
      },
      datePublished: publishDate,
      dateModified: publishDate,
      image: `https://zumenzu.com/blog/images/${slug}-og.jpg`,
      url: `https://zumenzu.com/blog/${slug}`,
      keywords: keywords.join(', '),
      articleSection: 'Python Programming',
      inLanguage: 'tr-TR'
    }
  });
}

// Card metadata generator
export function generateCardMetadata(
  cardName: string,
  cardId: string,
  rarity: string,
  category: string,
  diamondCost: number
): Metadata {
  const title = `${cardName} - ${rarity} ${category} Card | Zumenzu Collection`;
  const description = `${cardName} kartını koleksiyonunuza ekleyin! ${rarity} rarity ${category} kategorisi. Sadece ${diamondCost} diamonds ile satın alın.`;
  
  return generateMetadata({
    title,
    description,
    keywords: [
      cardName.toLowerCase(),
      rarity.toLowerCase(),
      category.toLowerCase(),
      'python kart',
      'anime kart',
      'kart koleksiyonu'
    ],
    canonical: `/cards/${cardId}`,
    openGraph: {
      title,
      description,
      type: 'product',
      image: `/api/secure-image?cardId=${cardId}`,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: cardName,
      description,
      category: `${category} Cards`,
      brand: {
        '@type': 'Brand',
        name: 'Zumenzu'
      },
      offers: {
        '@type': 'Offer',
        price: diamondCost,
        priceCurrency: 'DIAMONDS',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Zumenzu'
        }
      },
      image: `https://zumenzu.com/api/secure-image?cardId=${cardId}`,
      url: `https://zumenzu.com/cards/${cardId}`
    }
  });
}