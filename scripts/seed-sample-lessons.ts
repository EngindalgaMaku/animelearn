import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleLessons = [
  // Python Basics
  {
    title: "Python'a Giriş ve İlk Program",
    slug: "python-giris-ilk-program",
    description: "Python programlama diline giriş yapıyoruz ve ilk programımızı yazıyoruz.",
    content: `# Python'a Giriş

Python, öğrenmesi kolay ve güçlü bir programlama dilidir. Bu derste Python'ın temellerini öğreneceğiz.

## Python Nedir?

Python, 1991 yılında Guido van Rossum tarafından geliştirilmiş, yüksek seviyeli bir programlama dilidir.

## İlk Programımız

Geleneksel olarak, her programlama dilinde öğrendiğimiz ilk program "Hello, World!" programıdır.

\`\`\`python
print("Hello, World!")
\`\`\`

Bu basit kod çalıştırıldığında ekrana "Hello, World!" yazısını yazdırır.

## Neden Python?

- Kolay öğrenilebilir syntax
- Geniş kütüphane desteği
- Çok amaçlı kullanım (web, veri analizi, yapay zeka)
- Büyük topluluk desteği`,
    difficulty: 1,
    order: 1,
    duration: 45,
    category: "python-basics",
    hasCodeExercise: true,
    starterCode: `# İlk Python programınızı yazın
# "Merhaba Dünya!" yazdıran bir program oluşturun

`,
    solutionCode: `# İlk Python programınızı yazın
# "Merhaba Dünya!" yazdıran bir program oluşturun

print("Merhaba Dünya!")`,
    testCases: JSON.stringify([
      {
        description: "Program 'Merhaba Dünya!' yazdırmalı",
        expectedOutput: "Merhaba Dünya!"
      }
    ]),
    hints: "Python'da ekrana yazı yazdırmak için print() fonksiyonunu kullanıyoruz.",
    diamondReward: 10,
    experienceReward: 50,
    isPublished: true
  },
  {
    title: "Değişkenler ve Veri Türleri",
    slug: "degiskenler-veri-turleri",
    description: "Python'da değişken tanımlama ve temel veri türlerini öğreniyoruz.",
    content: `# Değişkenler ve Veri Türleri

Python'da değişkenler, verileri saklamamızı sağlayan isimli konteynerlerdir.

## Değişken Tanımlama

Python'da değişken tanımlamak çok basittir:

\`\`\`python
isim = "Ahmet"
yas = 25
boy = 1.75
evli_mi = False
\`\`\`

## Temel Veri Türleri

### String (Metin)
\`\`\`python
mesaj = "Merhaba Python!"
\`\`\`

### Integer (Tam Sayı)
\`\`\`python
sayi = 42
\`\`\`

### Float (Ondalıklı Sayı)
\`\`\`python
pi = 3.14159
\`\`\`

### Boolean (Mantıksal)
\`\`\`python
dogru = True
yanlis = False
\`\`\`

## type() Fonksiyonu

Bir değişkenin türünü öğrenmek için:

\`\`\`python
print(type(isim))  # <class 'str'>
print(type(yas))   # <class 'int'>
\`\`\``,
    difficulty: 1,
    order: 2,
    duration: 60,
    category: "python-basics",
    hasCodeExercise: true,
    starterCode: `# Değişkenler oluşturun
# 1. Adınızı string olarak
# 2. Yaşınızı integer olarak
# 3. Boyunuzu float olarak
# 4. Öğrenci olup olmadığınızı boolean olarak

`,
    solutionCode: `# Değişkenler oluşturun
isim = "Ali"
yas = 20
boy = 1.70
ogrenci_mi = True

print(f"İsim: {isim}")
print(f"Yaş: {yas}")
print(f"Boy: {boy}")
print(f"Öğrenci mi: {ogrenci_mi}")`,
    testCases: JSON.stringify([
      {
        description: "4 farklı türde değişken tanımlanmalı",
        variables: ["isim", "yas", "boy", "ogrenci_mi"]
      }
    ]),
    hints: "Python'da değişken tanımlarken tür belirtmemize gerek yoktur. Python otomatik olarak türü belirler.",
    diamondReward: 15,
    experienceReward: 75,
    isPublished: true
  },
  {
    title: "Koşullu İfadeler (if-elif-else)",
    slug: "kosullu-ifadeler",
    description: "Python'da karar verme yapıları olan if, elif ve else ifadelerini öğreniyoruz.",
    content: `# Koşullu İfadeler

Programlarda farklı durumlara göre farklı işlemler yapmamız gerekir. Bu durumda koşullu ifadeleri kullanırız.

## if İfadesi

\`\`\`python
yas = 18

if yas >= 18:
    print("Ehliyet alabilirsiniz")
\`\`\`

## if-else İfadesi

\`\`\`python
yas = 16

if yas >= 18:
    print("Ehliyet alabilirsiniz")
else:
    print("Ehliyet alamazsınız")
\`\`\`

## if-elif-else İfadesi

\`\`\`python
not_ortalamasi = 85

if not_ortalamasi >= 90:
    print("Pekiyi")
elif not_ortalamasi >= 80:
    print("İyi")
elif not_ortalamasi >= 70:
    print("Orta")
else:
    print("Geçer")
\`\`\`

## Karşılaştırma Operatörleri

- \`==\` : Eşit mi?
- \`!=\` : Eşit değil mi?
- \`>\` : Büyük mü?
- \`<\` : Küçük mü?
- \`>=\` : Büyük eşit mi?
- \`<=\` : Küçük eşit mi?

## Mantıksal Operatörler

- \`and\` : Ve
- \`or\` : Veya
- \`not\` : Değil`,
    difficulty: 2,
    order: 3,
    duration: 75,
    category: "control-flow",
    hasCodeExercise: true,
    starterCode: `# Bir sayının pozitif, negatif veya sıfır olduğunu kontrol eden program yazın
sayi = int(input("Bir sayı girin: "))

# Kodunuzu buraya yazın

`,
    solutionCode: `# Bir sayının pozitif, negatif veya sıfır olduğunu kontrol eden program yazın
sayi = int(input("Bir sayı girin: "))

if sayi > 0:
    print("Sayı pozitif")
elif sayi < 0:
    print("Sayı negatif")
else:
    print("Sayı sıfır")`,
    testCases: JSON.stringify([
      {
        input: "5",
        expectedOutput: "Sayı pozitif"
      },
      {
        input: "-3",
        expectedOutput: "Sayı negatif"
      },
      {
        input: "0",
        expectedOutput: "Sayı sıfır"
      }
    ]),
    hints: "Önce pozitif kontrolü yapın, sonra negatif kontrolü yapın. Kalan durum sıfır olacaktır.",
    diamondReward: 20,
    experienceReward: 100,
    isPublished: true
  },
  {
    title: "Döngüler - for ve while",
    slug: "donguler-for-while",
    description: "Python'da tekrar yapıları olan for ve while döngülerini öğreniyoruz.",
    content: `# Döngüler

Döngüler, aynı kod bloğunu birden fazla kez çalıştırmamızı sağlar.

## for Döngüsü

### Sayı aralığında döngü
\`\`\`python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4
\`\`\`

### Liste üzerinde döngü
\`\`\`python
meyveler = ["elma", "armut", "muz"]
for meyve in meyveler:
    print(meyve)
\`\`\`

### String üzerinde döngü
\`\`\`python
kelime = "Python"
for harf in kelime:
    print(harf)
\`\`\`

## while Döngüsü

\`\`\`python
sayac = 0
while sayac < 5:
    print(sayac)
    sayac += 1
\`\`\`

## range() Fonksiyonu

\`\`\`python
range(5)        # 0, 1, 2, 3, 4
range(1, 6)     # 1, 2, 3, 4, 5
range(0, 10, 2) # 0, 2, 4, 6, 8
\`\`\`

## break ve continue

### break - Döngüden çık
\`\`\`python
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4
\`\`\`

### continue - Bir sonraki iterasyona geç
\`\`\`python
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4
\`\`\``,
    difficulty: 2,
    order: 4,
    duration: 90,
    category: "control-flow",
    hasCodeExercise: true,
    starterCode: `# 1'den 100'e kadar olan sayıların toplamını hesaplayan program yazın
# for döngüsü kullanın

toplam = 0
# Kodunuzu buraya yazın

print(f"1'den 100'e kadar olan sayıların toplamı: {toplam}")`,
    solutionCode: `# 1'den 100'e kadar olan sayıların toplamını hesaplayan program yazın
# for döngüsü kullanın

toplam = 0
for i in range(1, 101):
    toplam += i

print(f"1'den 100'e kadar olan sayıların toplamı: {toplam}")`,
    testCases: JSON.stringify([
      {
        description: "1'den 100'e kadar olan sayıların toplamı 5050 olmalı",
        expectedResult: 5050
      }
    ]),
    hints: "range(1, 101) kullanarak 1'den 100'e kadar (100 dahil) sayıları alabilirsiniz.",
    diamondReward: 25,
    experienceReward: 125,
    isPublished: true
  },
  {
    title: "Fonksiyonlar",
    slug: "fonksiyonlar",
    description: "Python'da fonksiyon tanımlama, parametre kullanma ve değer döndürme işlemlerini öğreniyoruz.",
    content: `# Fonksiyonlar

Fonksiyonlar, belirli bir görevi yerine getiren, yeniden kullanılabilir kod bloklarıdır.

## Basit Fonksiyon

\`\`\`python
def selamla():
    print("Merhaba!")

selamla()  # Fonksiyonu çağır
\`\`\`

## Parametreli Fonksiyon

\`\`\`python
def selamla(isim):
    print(f"Merhaba {isim}!")

selamla("Ali")
\`\`\`

## Varsayılan Parametre

\`\`\`python
def selamla(isim="Dünya"):
    print(f"Merhaba {isim}!")

selamla()        # Merhaba Dünya!
selamla("Ali")   # Merhaba Ali!
\`\`\`

## Değer Döndüren Fonksiyon

\`\`\`python
def topla(a, b):
    return a + b

sonuc = topla(5, 3)
print(sonuc)  # 8
\`\`\`

## Çoklu Değer Döndürme

\`\`\`python
def hesapla(a, b):
    toplam = a + b
    carpim = a * b
    return toplam, carpim

t, c = hesapla(5, 3)
print(t, c)  # 8 15
\`\`\`

## Lambda Fonksiyonları

\`\`\`python
kare = lambda x: x ** 2
print(kare(5))  # 25
\`\`\`

## Docstring

\`\`\`python
def topla(a, b):
    """
    İki sayının toplamını hesaplar.
    
    Args:
        a (int): İlk sayı
        b (int): İkinci sayı
    
    Returns:
        int: İki sayının toplamı
    """
    return a + b
\`\`\``,
    difficulty: 3,
    order: 5,
    duration: 120,
    category: "functions",
    hasCodeExercise: true,
    starterCode: `# Bir sayının faktöriyelini hesaplayan fonksiyon yazın
# Örnek: faktoriyel(5) = 5 * 4 * 3 * 2 * 1 = 120

def faktoriyel(n):
    # Kodunuzu buraya yazın
    pass

# Test
print(faktoriyel(5))  # 120 olmalı`,
    solutionCode: `# Bir sayının faktöriyelini hesaplayan fonksiyon yazın
# Örnek: faktoriyel(5) = 5 * 4 * 3 * 2 * 1 = 120

def faktoriyel(n):
    if n <= 1:
        return 1
    else:
        return n * faktoriyel(n - 1)

# Test
print(faktoriyel(5))  # 120 olmalı`,
    testCases: JSON.stringify([
      {
        input: 5,
        expectedOutput: 120
      },
      {
        input: 3,
        expectedOutput: 6
      },
      {
        input: 0,
        expectedOutput: 1
      }
    ]),
    hints: "Faktöriyel hesaplamak için recursive (özyinelemeli) fonksiyon kullanabilirsiniz.",
    diamondReward: 30,
    experienceReward: 150,
    isPublished: true
  },
  {
    title: "Listeler ve Liste İşlemleri",
    slug: "listeler-liste-islemleri",
    description: "Python'da en önemli veri yapılarından biri olan listeleri ve liste işlemlerini öğreniyoruz.",
    content: `# Listeler

Listeler, Python'da birden fazla öğeyi saklamamızı sağlayan veri yapılarıdır.

## Liste Oluşturma

\`\`\`python
# Boş liste
liste = []

# Sayılarla liste
sayilar = [1, 2, 3, 4, 5]

# Karışık türlerle liste
karisik = [1, "merhaba", 3.14, True]
\`\`\`

## Liste Elemanlarına Erişim

\`\`\`python
meyveler = ["elma", "armut", "muz"]

print(meyveler[0])   # elma (ilk eleman)
print(meyveler[-1])  # muz (son eleman)
print(meyveler[1:3]) # ['armut', 'muz'] (dilim)
\`\`\`

## Liste Metodları

\`\`\`python
liste = [1, 2, 3]

# Eleman ekleme
liste.append(4)        # [1, 2, 3, 4]
liste.insert(0, 0)     # [0, 1, 2, 3, 4]

# Eleman çıkarma
liste.remove(2)        # [0, 1, 3, 4]
son_eleman = liste.pop() # [0, 1, 3], son_eleman = 4

# Diğer işlemler
print(len(liste))      # Liste uzunluğu
print(max(liste))      # En büyük eleman
print(min(liste))      # En küçük eleman
print(sum(liste))      # Elemanların toplamı
\`\`\`

## Liste Comprehension

\`\`\`python
# Normal yöntem
kareler = []
for i in range(10):
    kareler.append(i ** 2)

# Liste comprehension
kareler = [i ** 2 for i in range(10)]

# Koşullu liste comprehension
cift_kareler = [i ** 2 for i in range(10) if i % 2 == 0]
\`\`\``,
    difficulty: 2,
    order: 6,
    duration: 100,
    category: "data-structures",
    hasCodeExercise: true,
    starterCode: `# Bir listede en büyük ve en küçük elemanı bulan fonksiyon yazın
def min_max_bul(liste):
    # Kodunuzu buraya yazın
    # En küçük ve en büyük değeri tuple olarak döndürün
    pass

# Test
sayilar = [3, 7, 2, 9, 1, 5]
minimum, maksimum = min_max_bul(sayilar)
print(f"En küçük: {minimum}, En büyük: {maksimum}")`,
    solutionCode: `# Bir listede en büyük ve en küçük elemanı bulan fonksiyon yazın
def min_max_bul(liste):
    if not liste:  # Boş liste kontrolü
        return None, None
    
    minimum = liste[0]
    maksimum = liste[0]
    
    for sayi in liste:
        if sayi < minimum:
            minimum = sayi
        if sayi > maksimum:
            maksimum = sayi
    
    return minimum, maksimum

# Test
sayilar = [3, 7, 2, 9, 1, 5]
minimum, maksimum = min_max_bul(sayilar)
print(f"En küçük: {minimum}, En büyük: {maksimum}")`,
    testCases: JSON.stringify([
      {
        input: [3, 7, 2, 9, 1, 5],
        expected: [1, 9]
      },
      {
        input: [10],
        expected: [10, 10]
      }
    ]),
    hints: "Liste boş olma durumunu da kontrol etmeyi unutmayın.",
    diamondReward: 25,
    experienceReward: 125,
    isPublished: true
  },
  // Draft lesson
  {
    title: "Sözlükler (Dictionaries) - İleri Seviye",
    slug: "sozlukler-ileri-seviye",
    description: "Python sözlüklerinin ileri seviye kullanımını ve nested dictionary yapılarını öğreniyoruz.",
    content: `# Sözlükler - İleri Seviye

Bu derste Python sözlüklerinin daha karmaşık kullanım alanlarını göreceğiz.

## Nested Dictionaries

\`\`\`python
ogrenciler = {
    "123": {
        "isim": "Ali",
        "yas": 20,
        "notlar": {"matematik": 85, "fizik": 92}
    },
    "124": {
        "isim": "Ayşe", 
        "yas": 19,
        "notlar": {"matematik": 95, "fizik": 87}
    }
}
\`\`\`

Bu ders henüz tamamlanmamıştır ve draft modundadır.`,
    difficulty: 4,
    order: 7,
    duration: 150,
    category: "data-structures",
    hasCodeExercise: false,
    diamondReward: 35,
    experienceReward: 175,
    isPublished: false
  }
]

async function seedLessons() {
  try {
    console.log('🌱 Creating sample Python lessons...')
    
    for (const lesson of sampleLessons) {
      const existingLesson = await prisma.codeArena.findUnique({
        where: { slug: lesson.slug }
      })
      
      if (!existingLesson) {
        await prisma.codeArena.create({
          data: lesson
        })
        console.log(`✅ Created lesson: ${lesson.title}`)
      } else {
        console.log(`⏭️  Lesson already exists: ${lesson.title}`)
      }
    }
    
    const lessonCount = await prisma.codeArena.count()
    console.log(`📚 Total lessons in database: ${lessonCount}`)
    
    console.log('🎉 Sample lessons seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding lessons:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedLessons()