import { QuizQuestion, QuizCategory } from "../types/quiz-types";

export const modulesPackagesCategories: QuizCategory[] = [
  {
    name: "Modules, Packages & Virtual Environments",
    description: "TODO: Add description for Modules, Packages & Virtual Environments",
    color: "#871b30", // Random color
    icon: "📚", // TODO: Choose appropriate icon
    sortOrder: 8,
  },
];

export const modulesPackagesQuestions: QuizQuestion[] = [
  // TODO: Add questions for Modules, Packages & Virtual Environments
  {
    question: "Sample question for Modules, Packages & Virtual Environments?",
    options: [
      "Option A",
      "Option B", 
      "Option C",
      "Option D"
    ],
    correctAnswer: 0,
    explanation: "TODO: Add explanation for this question.",
    difficulty: "beginner",
    category: "Modules, Packages & Virtual Environments",
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
