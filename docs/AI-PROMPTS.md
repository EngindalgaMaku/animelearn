# 🤖 AI Prompts for Quiz Content Generation

Bu dosya, quiz kategorileri ve sorularını hızlıca üretmek için kullanabileceğiniz AI prompt'larını içerir.

## 📝 Quiz Kategorileri Üretme Prompt'u

```
Lütfen Python programlama için quiz kategorileri oluştur. Her kategori için aşağıdaki JSON formatını kullan:

{
  "name": "Kategori Adı",
  "description": "Kategori açıklaması",
  "color": "#HEX_COLOR",
  "icon": "📚", 
  "sortOrder": 1
}

Şu konularda kategoriler oluştur:
- Python Basics (Temel Python)
- Data Structures (Veri Yapıları) 
- Functions & Control Flow (Fonksiyonlar ve Kontrol Akışı)
- Object-Oriented Programming (Nesne Yönelimli Programlama)
- File Operations (Dosya İşlemleri)
- Error Handling (Hata Yönetimi)
- Libraries & Modules (Kütüphaneler ve Modüller)
- Advanced Topics (İleri Konular)
- Web Development (Web Geliştirme)
- Data Science (Veri Bilimi)

Her kategori için uygun renk kodu ve emoji ikonu ekle. JSON array formatında çıktı ver.
```

## ❓ Quiz Soruları Üretme Prompt'u

```
Lütfen Python programlama için quiz soruları oluştur. Her soru için aşağıdaki JSON formatını kullan:

{
  "question": "Soru metni buraya",
  "options": ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"],
  "correctAnswer": 1,
  "explanation": "Doğru cevabın açıklaması",
  "difficulty": "beginner",
  "category": "Python Basics"
}

Zorunlu gereksinimler:
- Her soru 4 seçenekli olmalı
- correctAnswer: 0-3 arası index numarası (0=A, 1=B, 2=C, 3=D)
- difficulty: "beginner", "intermediate", "advanced", "expert"
- category: Mevcut kategori adlarından birini kullan
- explanation: Detaylı ve eğitici açıklama

Konu alanları:
1. **Python Basics**: print, değişkenler, veri tipleri, operatörler
2. **Data Structures**: list, dict, tuple, set işlemleri
3. **Functions**: def, return, parametreler, scope
4. **Control Flow**: if/else, loops, break/continue
5. **OOP**: class, self, inheritance, methods
6. **File Operations**: open, read, write, with statement
7. **Error Handling**: try/except, raise, custom exceptions
8. **Libraries**: import, pip, popular libraries

Her kategoriden minimum 5 soru oluştur. JSON array formatında çıktı ver.
```

## 🎯 Spesifik Konu Prompt'u

```
[KONU_ADI] konusu için Python quiz soruları oluştur.

Örnek kullanım:
"List Operations konusu için Python quiz soruları oluştur."

Gereksinimler:
- Minimum 10 soru
- Zorluk seviyesi karışık (beginner-intermediate-advanced)
- Pratik kod örnekleri içeren sorular
- Gerçek dünya senaryoları
- JSON formatında çıktı

Format:
```json
[
  {
    "question": "What will be the output of: my_list = [1, 2, 3]; my_list.append([4, 5]); print(len(my_list))",
    "options": ["3", "4", "5", "Error"],
    "correctAnswer": 1,
    "explanation": "append() adds the entire list [4, 5] as a single element, making the length 4.",
    "difficulty": "intermediate",
    "category": "Data Structures"
  }
]
```
```

## 🔧 Bulk Quiz Generation Prompt'u

```
Lütfen aşağıdaki Python konuları için toplu quiz soruları oluştur. Her konu için 5 soru, toplam 50 soru:

1. Variables and Data Types
2. String Operations
3. List Methods
4. Dictionary Operations
5. Function Definitions
6. Loop Structures
7. Conditional Statements
8. Exception Handling
9. File I/O
10. Class and Objects

Her soru şu formatta olmalı:
```json
{
  "question": "Soru metni",
  "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
  "correctAnswer": 0,
  "explanation": "Detaylı açıklama",
  "difficulty": "beginner|intermediate|advanced",
  "category": "Uygun kategori adı"
}
```

Çıktıyı tek bir JSON array'i olarak ver.
```

## 🌟 Advanced Quiz Generation

```
Python için ileri seviye quiz soruları oluştur:

**Konu alanları:**
- Decorators (@property, @staticmethod, custom decorators)
- Generators (yield, generator expressions)
- Context Managers (with statement, __enter__, __exit__)
- Metaclasses (type, __new__, __init_subclass__)
- Async Programming (async/await, asyncio)
- Memory Management (garbage collection, weak references)
- Performance Optimization (profiling, caching)
- Design Patterns (singleton, factory, observer)

**Gereksinimler:**
- Minimum 20 soru
- Difficulty: "advanced" veya "expert"
- Kod analizi gerektiren sorular
- Performans ve best practice odaklı
- JSON formatında çıktı

**Örnek soru yapısı:**
```json
{
  "question": "What is the main advantage of using __slots__ in a Python class?",
  "options": [
    "Improves code readability",
    "Reduces memory usage and prevents dynamic attribute creation", 
    "Makes inheritance faster",
    "Enables multiple inheritance"
  ],
  "correctAnswer": 1,
  "explanation": "__slots__ reduces memory usage by preventing the creation of __dict__ for each instance and restricts dynamic attribute creation.",
  "difficulty": "advanced",
  "category": "Advanced Topics"
}
```
```

## 🚀 Quick Start Usage

1. **Kategori oluşturmak için:**
   - İlk prompt'u AI'ya ver
   - JSON çıktısını kopyala
   - `scripts/seed-quiz-data.ts` dosyasında categories array'ine ekle

2. **Soru oluşturmak için:**
   - İkinci prompt'u AI'ya ver  
   - JSON çıktısını kopyala
   - `scripts/seed-quiz-data.ts` dosyasında questions array'ine ekle

3. **Seeding işlemi:**
   ```bash
   npm run seed:quiz
   # veya
   npx ts-node scripts/seed-quiz-data.ts
   ```

## 📊 JSON Validation

Oluşturulan JSON'ların doğruluğunu kontrol etmek için:

```javascript
// Kategori validation
const isValidCategory = (cat) => {
  return cat.name && cat.description && cat.color && cat.icon && typeof cat.sortOrder === 'number';
};

// Soru validation  
const isValidQuestion = (q) => {
  return q.question && 
         Array.isArray(q.options) && q.options.length === 4 &&
         typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 &&
         q.explanation && q.difficulty && q.category;
};
```

Bu prompt'ları kullanarak hızlıca yüzlerce quiz sorusu ve kategorisi oluşturabilirsiniz! 🎉