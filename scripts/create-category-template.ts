import fs from 'fs';
import path from 'path';

// Tüm kategorilerin listesi (seed-quiz-data.ts'den alınmış)
const allCategories = [
  { name: "Python Basics", slug: "python-basics", sortOrder: 1 },
  { name: "Control Flow", slug: "control-flow", sortOrder: 2 },
  { name: "Basic Data Structures", slug: "basic-data-structures", sortOrder: 3 },
  { name: "Functions and Scope", slug: "functions-scope", sortOrder: 4 },
  { name: "Object-Oriented Programming - Fundamentals", slug: "oop-fundamentals", sortOrder: 5 },
  { name: "File Handling & Serialization", slug: "file-handling", sortOrder: 6 },
  { name: "Error & Exception Handling", slug: "error-handling", sortOrder: 7 },
  { name: "Modules, Packages & Virtual Environments", slug: "modules-packages", sortOrder: 8 },
  { name: "Advanced Data Structures", slug: "advanced-data-structures", sortOrder: 9 },
  { name: "Functional Programming Tools", slug: "functional-programming", sortOrder: 10 },
  { name: "Generators & Decorators", slug: "generators-decorators", sortOrder: 11 },
  { name: "Object-Oriented Programming - Advanced", slug: "oop-advanced", sortOrder: 12 },
  { name: "Test Automation", slug: "test-automation", sortOrder: 13 },
  { name: "Concurrency & Async Programming", slug: "concurrency-async", sortOrder: 14 },
  { name: "Database Interaction", slug: "database-interaction", sortOrder: 15 },
  { name: "Web Frameworks (Flask & Django)", slug: "web-frameworks", sortOrder: 16 },
  { name: "APIs & Web Scraping", slug: "apis-web-scraping", sortOrder: 17 },
  { name: "Data Analysis with Pandas", slug: "pandas-analysis", sortOrder: 18 },
  { name: "Numerical Computing with NumPy", slug: "numpy-computing", sortOrder: 19 },
  { name: "Data Visualization", slug: "data-visualization", sortOrder: 20 },
  { name: "Machine Learning with Scikit-Learn", slug: "machine-learning", sortOrder: 21 },
  { name: "System Automation & Scripting", slug: "system-automation", sortOrder: 22 },
];

function generateCategoryTemplate(categoryName: string, slug: string, sortOrder: number): string {
  const camelCaseName = slug.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/-/g, '');
  
  return `import { QuizQuestion, QuizCategory } from "../types/quiz-types";

export const ${camelCaseName}Categories: QuizCategory[] = [
  {
    name: "${categoryName}",
    description: "TODO: Add description for ${categoryName}",
    color: "#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}", // Random color
    icon: "📚", // TODO: Choose appropriate icon
    sortOrder: ${sortOrder},
  },
];

export const ${camelCaseName}Questions: QuizQuestion[] = [
  // TODO: Add questions for ${categoryName}
  {
    question: "Sample question for ${categoryName}?",
    options: [
      "Option A",
      "Option B", 
      "Option C",
      "Option D"
    ],
    correctAnswer: 0,
    explanation: "TODO: Add explanation for this question.",
    difficulty: "beginner",
    category: "${categoryName}",
  },
  
  // TODO: Add more questions here
  // Recommended structure:
  // - 20-30 beginner level questions
  // - 15-20 intermediate level questions  
  // - 10-15 advanced level questions
  // - 5-10 expert level questions (optional)
];

/*
TODO: Bu kategori için soru ekleme rehberi:

1. Beginner Level (Başlangıç):
   - Temel kavramlar ve tanımlar
   - Basit syntax ve kullanım
   - Yaygın kullanım örnekleri

2. Intermediate Level (Orta):
   - Daha karmaşık senaryolar
   - Farklı yöntemler arası karşılaştırmalar
   - Hata durumları ve çözümleri

3. Advanced Level (İleri):
   - Best practices ve optimization
   - Edge cases ve corner cases
   - Performans ve memory considerations

4. Expert Level (Uzman - Opsiyonel):
   - Internal implementations
   - Very specific use cases
   - Integration with other advanced topics

Her soru için:
- Açık ve net soru metni
- 4 seçenek (A, B, C, D)
- Doğru cevabın index'i (0-3)
- Detaylı açıklama (neden doğru, neden diğerleri yanlış)
- Uygun zorluk seviyesi
- Doğru kategori adı
*/
`;
}

function generateIndexFile(): string {
  const imports = allCategories.map(cat => {
    const camelCase = cat.slug.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/-/g, '');
    return `import { ${camelCase}Categories, ${camelCase}Questions } from "./${cat.slug}";`;
  }).join('\n');

  const categoryExports = allCategories.map(cat => {
    const camelCase = cat.slug.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/-/g, '');
    return `  ...${camelCase}Categories,`;
  }).join('\n');

  const questionExports = allCategories.map(cat => {
    const camelCase = cat.slug.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/-/g, '');
    return `  ...${camelCase}Questions,`;
  }).join('\n');

  return `// Auto-generated index file for all quiz categories
${imports}

// Export all categories
export const allCategories = [
${categoryExports}
];

// Export all questions
export const allQuestions = [
${questionExports}
];

// Export individual category modules for selective importing
export * from "./python-basics";
export * from "./control-flow";
${allCategories.slice(2).map(cat => `export * from "./${cat.slug}";`).join('\n')}
`;
}

async function createAllTemplates() {
  const seedsDir = path.join(__dirname, 'quiz-seeds');
  
  console.log('🚀 Creating category templates...');
  
  for (const category of allCategories) {
    const filePath = path.join(seedsDir, `${category.slug}.ts`);
    
    // Dosya zaten varsa atla
    if (fs.existsSync(filePath)) {
      console.log(`⚠️ Skipping ${category.name} - file already exists`);
      continue;
    }
    
    const template = generateCategoryTemplate(category.name, category.slug, category.sortOrder);
    fs.writeFileSync(filePath, template, 'utf8');
    console.log(`✅ Created template: ${category.slug}.ts`);
  }
  
  // Index dosyasını oluştur
  const indexPath = path.join(seedsDir, 'index.ts');
  const indexContent = generateIndexFile();
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log(`✅ Created index.ts`);
  
  console.log('\n🎉 All templates created successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Her kategori dosyasını açın ve TODO işaretli yerleri doldurun');
  console.log('2. Her kategori için 30-60 soru ekleyin');
  console.log('3. Renk kodlarını ve iconları güncelleyin');
  console.log('4. seed-all-quiz-data.ts dosyasını güncelleyerek yeni kategorileri import edin');
  console.log('5. npx tsx scripts/seed-all-quiz-data.ts ile tüm verileri yükleyin');
}

// Script'i çalıştır
if (require.main === module) {
  createAllTemplates().catch(console.error);
}

export { createAllTemplates, allCategories };