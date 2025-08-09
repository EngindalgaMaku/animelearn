'use client';

interface SchemaMarkupProps {
  schema: Record<string, any>;
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

// Educational Organization Schema
export function EducationalOrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Zumenzu",
    description: "Learn Python programming while collecting anime cards, earning badges, and completing daily quests. The world's most engaging gamified Python learning platform.",
    url: "https://zumenzu.com",
    logo: "https://zumenzu.com/logo.png",
    image: "https://zumenzu.com/og-image.jpg",
    sameAs: [
      "https://twitter.com/zumenzu",
      "https://instagram.com/zumenzu",
      "https://linkedin.com/company/zumenzu",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
      addressLocality: "Turkey",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@zumenzu.com",
    },
    offers: {
      "@type": "Offer",
      category: "Educational Course",
      name: "Python Programming with Gamification",
      description: "Learn Python programming with anime card collection and gamification",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    educationalCredentialAwarded: "Certificate of Completion",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Programming Certificate",
      name: "Python Programming Certificate",
    },
  };

  return <SchemaMarkup schema={schema} />;
}

// Course Schema for Code Arena
export function CourseSchema({ 
  title, 
  description, 
  slug,
  difficulty,
  duration,
  category 
}: {
  title: string;
  description: string;
  slug: string;
  difficulty: number;
  duration: number;
  category: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description,
    provider: {
      "@type": "EducationalOrganization",
      name: "Zumenzu",
      url: "https://zumenzu.com"
    },
    educationalLevel: difficulty <= 2 ? "Beginner" : difficulty <= 4 ? "Intermediate" : "Advanced",
    timeRequired: `PT${duration}M`,
    inLanguage: "tr-TR",
    courseCode: slug,
    url: `https://zumenzu.com/code-arena/${slug}`,
    teaches: [
      "Python Programming",
      "Programming Fundamentals",
      "Problem Solving",
      "Algorithm Thinking"
    ],
    coursePrerequisites: difficulty > 2 ? "Basic Python Knowledge" : "None",
    educationalUse: "Interactive Learning",
    interactivityType: "Active",
    learningResourceType: "Interactive Exercise",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "Student"
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseSchedule: {
        "@type": "Schedule",
        duration: `PT${duration}M`
      }
    }
  };

  return <SchemaMarkup schema={schema} />;
}

// Article Schema for Blog Posts
export function ArticleSchema({
  title,
  description,
  slug,
  publishDate,
  modifiedDate,
  author = "Zumenzu Team",
  tags = []
}: {
  title: string;
  description: string;
  slug: string;
  publishDate: string;
  modifiedDate?: string;
  author?: string;
  tags?: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Organization",
      name: author,
      url: "https://zumenzu.com"
    },
    publisher: {
      "@type": "Organization",
      name: "Zumenzu",
      logo: {
        "@type": "ImageObject",
        url: "https://zumenzu.com/logo.png"
      }
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    image: `https://zumenzu.com/blog/images/${slug}-og.jpg`,
    url: `https://zumenzu.com/blog/${slug}`,
    keywords: tags.join(', '),
    articleSection: "Python Programming",
    inLanguage: "tr-TR",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://zumenzu.com/blog/${slug}`
    },
    about: [
      {
        "@type": "Thing",
        name: "Python Programming",
        sameAs: "https://en.wikipedia.org/wiki/Python_(programming_language)"
      },
      {
        "@type": "Thing", 
        name: "Programming Education",
        sameAs: "https://en.wikipedia.org/wiki/Computer_programming"
      }
    ]
  };

  return <SchemaMarkup schema={schema} />;
}

// Product Schema for Cards
export function ProductSchema({
  name,
  description,
  cardId,
  rarity,
  category,
  diamondCost,
  imageUrl
}: {
  name: string;
  description: string;
  cardId: string;
  rarity: string;
  category: string;
  diamondCost: number;
  imageUrl: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    category: `${category} Cards`,
    brand: {
      "@type": "Brand",
      name: "Zumenzu"
    },
    image: imageUrl,
    url: `https://zumenzu.com/cards/${cardId}`,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Rarity",
        value: rarity
      },
      {
        "@type": "PropertyValue", 
        name: "Category",
        value: category
      }
    ],
    offers: {
      "@type": "Offer",
      price: diamondCost,
      priceCurrency: "DIAMONDS",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Zumenzu",
        url: "https://zumenzu.com"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1"
    }
  };

  return <SchemaMarkup schema={schema} />;
}

// FAQ Schema for FAQ Pages
export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return <SchemaMarkup schema={schema} />;
}

// Quiz Schema
export function QuizSchema({
  title,
  description,
  questions,
  timeLimit,
  diamondReward
}: {
  title: string;
  description: string;
  questions: number;
  timeLimit: number;
  diamondReward: number;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: title,
    description,
    educationalLevel: "All Levels",
    timeRequired: `PT${timeLimit}S`,
    numberOfQuestions: questions,
    about: {
      "@type": "Thing",
      name: "Python Programming",
      sameAs: "https://en.wikipedia.org/wiki/Python_(programming_language)"
    },
    publisher: {
      "@type": "Organization",
      name: "Zumenzu",
      url: "https://zumenzu.com"
    },
    inLanguage: "tr-TR",
    learningResourceType: "Interactive Quiz",
    interactivityType: "Active",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "Student"
    }
  };

  return <SchemaMarkup schema={schema} />;
}

// WebSite Schema with SearchAction
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zumenzu",
    alternateName: "Zumenzu Python Learning Platform",
    url: "https://zumenzu.com",
    description: "Learn Python programming while collecting anime cards, earning badges, and completing daily quests. The world's most engaging gamified Python learning platform.",
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://zumenzu.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    publisher: {
      "@type": "Organization",
      name: "Zumenzu",
      logo: {
        "@type": "ImageObject",
        url: "https://zumenzu.com/logo.png"
      }
    }
  };

  return <SchemaMarkup schema={schema} />;
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }: { 
  items: Array<{ name: string; url: string }> 
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://zumenzu.com${item.url}`
    }))
  };

  return <SchemaMarkup schema={schema} />;
}