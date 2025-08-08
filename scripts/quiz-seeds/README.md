# Quiz Seeds Modüler Yapısı

Bu klasör, quiz kategorileri ve sorularını organize etmek için modüler bir yapı sunar.

## 📁 Dosya Yapısı

```
quiz-seeds/
├── index.ts                    # Ana index - tüm kategorileri export eder
├── types/
│   └── quiz-types.ts          # TypeScript tip tanımları
├── python-basics.ts           # Python Basics kategorisi ve soruları
├── control-flow.ts           # Control Flow kategorisi ve soruları
├── basic-data-structures.ts  # Basic Data Structures kategorisi
├── functions-scope.ts        # Functions and Scope kategorisi
├── oop-fundamentals.ts       # OOP Fundamentals kategorisi
├── file-handling.ts          # File Handling kategorisi
├── error-handling.ts         # Error Handling kategorisi
├── modules-packages.ts       # Modules & Packages kategorisi
├── advanced-data-structures.ts # Advanced Data Structures
├── functional-programming.ts  # Functional Programming Tools
├── generators-decorators.ts   # Generators & Decorators
├── oop-advanced.ts           # OOP Advanced kategorisi
├── test-automation.ts        # Test Automation kategorisi
├── concurrency-async.ts      # Concurrency & Async kategorisi
├── database-interaction.ts   # Database Interaction kategorisi
├── web-frameworks.ts         # Web Frameworks kategorisi
├── apis-web-scraping.ts      # APIs & Web Scraping kategorisi
├── pandas-analysis.ts        # Data Analysis with Pandas
├── numpy-computing.ts        # Numerical Computing with NumPy
├── data-visualization.ts     # Data Visualization kategorisi
├── machine-learning.ts       # Machine Learning kategorisi
└── system-automation.ts      # System Automation kategorisi
```

## 🚀 Kullanım

### 1. Tüm Kategorileri Yüklemek
```bash
npx tsx scripts/seed-all-quiz-data.ts
```

### 2. Sadece Belirli Kategorileri Yüklemek
```typescript
import { pythonBasicsCategories, pythonBasicsQuestions } from "./quiz-seeds/python-basics";
// Sadece Python Basics verilerini kullan
```

### 3. Yeni Kategori Eklemek
1. `scripts/quiz-seeds/` klasöründe yeni dosya oluşturun
2. Template yapısını takip edin:
```typescript
import { QuizQuestion, QuizCategory } from "../types/quiz-types";

export const yourCategoryCategories: QuizCategory[] = [
  // Kategori tanımları
];

export const yourCategoryQuestions: QuizQuestion[] = [
  // Soru tanımları
];
```
3. `index.ts` dosyasını güncelleyin

## 📝 Soru Ekleme Rehberi

Her kategori için önerilen soru dağılımı:
- **Beginner (20-30 soru)**: Temel kavramlar, basit syntax
- **Intermediate (15-20 soru)**: Karmaşık senaryolar, karşılaştırmalar
- **Advanced (10-15 soru)**: Best practices, optimization, edge cases
- **Expert (5-10 soru - Opsiyonel)**: Internal implementations, çok özel durumlar

### Soru Formatı
```typescript
{
  question: "Açık ve net soru metni?",
  options: [
    "Seçenek A",
    "Seçenek B",
    "Seçenek C", 
    "Seçenek D"
  ],
  correctAnswer: 0, // 0-3 arası index
  explanation: "Detaylı açıklama - neden bu doğru, diğerleri neden yanlış",
  difficulty: "beginner" | "intermediate" | "advanced" | "expert",
  category: "Kategori Adı", // Tam olarak kategori adıyla eşleşmeli
}
```

## 🎨 Kategori Renkleri ve İkonları

Her kategori için uygun renk ve ikon seçin:
- **Python Basics**: #4A90E2, 📚
- **Control Flow**: #50E3C2, 🔄
- **Data Structures**: #7ED321, 📊
- **Functions**: #F5A623, ⚡
- **OOP**: #BD10E0, 🏗️
- **File Handling**: #9013FE, 📁
- **Error Handling**: #D0021B, ⚠️
- **Modules**: #417505, 📦
- **Advanced DS**: #F8E71C, 🔬
- **Functional**: #B8E986, 🧩
- **Generators**: #2E4756, 🔄
- **OOP Advanced**: #8B572A, 🏛️
- **Testing**: #EA5E11, 🧪
- **Async**: #0B5345, ⚡
- **Database**: #7D6608, 🗄️
- **Web**: #154360, 🌐
- **APIs**: #641E16, 🔌
- **Pandas**: #1A5276, 📈
- **NumPy**: #4A235A, 🔢
- **Visualization**: #943126, 📊
- **ML**: #515A5A, 🤖
- **Automation**: #17202A, 🤖

## 🔧 Maintenance

### Template Güncelleme
Yeni kategoriler için otomatik template oluşturmak:
```bash
npx tsx scripts/create-category-template.ts
```

### Index Yenileme
`index.ts` dosyası otomatik oluşturuluyor, manuel değişiklik gerektirmez.

## ✅ TODO Kontrol Listesi

Template oluşturduktan sonra her kategori için:

- [ ] Kategori açıklamasını güncelle
- [ ] Uygun renk kodu seç (#hex format)
- [ ] Uygun emoji/ikon seç
- [ ] En az 30 soru ekle
- [ ] Zorluk seviyelerini dengele
- [ ] Açıklamaları detaylandır
- [ ] Test et (seed script ile yükle)

## 📊 İstatistikler

- **Toplam Kategori**: 22
- **Hedef Soru Sayısı**: ~1500-2000
- **Şu Anki Durum**: Python Basics tamamlandı (79 soru)
- **Kalan**: 21 kategori (template oluşturuldu)

## 🎯 Hedefler

1. **Kısa Vadeli**: Her kategori için minimum 30 soru
2. **Orta Vadeli**: Zorluk seviyelerini dengeleme
3. **Uzun Vadeli**: Kategori bazında 50-100 soru standardı
4. **Gelecek**: Dinamik zorluk ayarlama sistemi