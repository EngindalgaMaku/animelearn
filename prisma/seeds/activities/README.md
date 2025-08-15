# Activities Seed Files

Bu klasörde öğrenme aktivitelerini organize etmek için dosyalar bulunur.

## Dosya Yapısı

- `index.ts` - Ana export dosyası ve kategori tanımları
- `python-basics.ts` - Python temel konuları aktiviteleri
- Diğer kategori dosyaları buraya eklenebilir

## Yeni Aktivite Ekleme

### 1. Kategori Dosyası Oluşturma

Yeni bir kategori için dosya oluşturun (örnek: `data-structures.ts`)

### 2. Aktivite Yapısı

```typescript
{
  title: "Aktivite Başlığı",
  description: "Aktivite açıklaması",
  activityType: "quiz", // quiz, theory_interactive, coding_challenge, etc.
  category: "kategori_adi",
  difficulty: 1, // 1-5 arası
  diamondReward: 10,
  experienceReward: 25,
  estimatedMinutes: 5,
  tags: ["tag1", "tag2"],
  content: {
    // Aktivite içeriği
  },
  isActive: true,
  sortOrder: 1
}
```

### 3. Aktivite Türleri

- `quiz` - Çoktan seçmeli sorular
- `theory_interactive` - Etkileşimli teori
- `coding_challenge` - Kod yazma alıştırması
- `memory_game` - Hafıza oyunu
- `matching` - Eşleştirme oyunu
- `drag_drop` - Sürükle bırak
- `fill_blanks` - Boşluk doldurma
- `interactive_coding` - Etkileşimli kodlama

### 4. Seed Çalıştırma

```bash
npx tsx prisma/seeds/activities/python-basics.ts
```

## Örnek Kullanım

1. `python-basics.ts` dosyasındaki `pythonBasicsActivities` dizisine aktivite ekleyin
2. `seedPythonBasicsActivities()` fonksiyonunu çalıştırın
3. Aktiviteler veritabanına eklenecektir

## Notlar

- Her aktivite kategorisi için ayrı dosya oluşturun
- `index.ts` dosyasına yeni kategorileri export edin
- Aktivite içerikleri JSON formatında saklanır

---

## Algorithm Visualization — Core Algorithms (EN)

A curated set of 30 most-used algorithms are provided as "algorithm_visualization" activities.

- Seed file: `prisma/seeds/activities/algorithm-visualization-core-algorithms.ts`
- Function: seed runner [seedAlgorithmVisualizationCoreAlgorithmsActivities()](prisma/seeds/activities/algorithm-visualization-core-algorithms.ts:836)
- Integrated in main seeder [prisma/seed.ts](prisma/seed.ts:1) and runs automatically on `npm run db:seed`

### Run only the 30 core algorithm visualizations

```bash
# Using npm script
npm run db:seed-algorithms-core

# Or directly with tsx
npx tsx prisma/seeds/activities/algorithm-visualization-core-algorithms.ts
```

### Included algorithms (30)

- Searching: Linear Search, Binary Search
- Sorting: Selection, Insertion, Merge, Quick, Heap, Counting, Radix, Bucket
- Graphs: BFS, DFS, Dijkstra, Bellman–Ford, Floyd–Warshall, Kruskal (MST), Prim (MST), Topological Sort (Kahn)
- Data structures/algorithms: Union-Find (Disjoint Set), Trie, BST operations (insert/search/delete), AVL rotations, Hash Table operations
- Greedy & DP: Activity Selection, 0/1 Knapsack, Coin Change (min coins), LCS, LIS

Each activity:

- activityType: `"algorithm_visualization"`
- category: `"Algorithms"`
- difficulty: 1–5 (diamond ≈ difficulty×10, XP ≈ difficulty×20)
- content includes algorithm metadata, steps, optional visualizations, and code excerpt
- idempotent seeding with duplicate protection via [seedActivitiesWithDuplicateCheck()](prisma/seeds/activities/seed-utils.ts:114)
