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
