---
title: "Introduction to Python Programming: From Zero to First Project 2025 Guide"
description: "Learn Python programming language from scratch! Step-by-step guide from installation to your first project. Supported with examples, exercises and projects."
date: "2025-08-08"
author: "Zumenzu Programming Team"
category: "Python Basics"
tags: ["python", "programming introduction", "learn python", "beginner", "tutorial", "start coding"]
readTime: "15 min"
featured: true
seoKeywords: "learn python, python programming introduction, how to learn python, python installation, start programming"
---

# Introduction to Python Programming: From Zero to First Project 2025 Guide

Do you want to learn Python? You're in the right place! In this comprehensive guide, you'll learn Python programming language from scratch, write your first codes, and develop real projects. Even if you have no programming experience, you can master Python by following this guide.

## 🐍 What is Python and Why Choose It?

Python is a **readable**, **easy to learn** and **powerful** programming language developed by Guido van Rossum in 1991. It has become one of the world's most popular programming languages.

### Advantages of Python:
- ✅ **Simple Syntax**: English-like structure
- ✅ **Multi-Purpose**: Web, data analysis, AI, automation
- ✅ **Large Community**: Support from millions of developers
- ✅ **Rich Libraries**: Ready solutions for every need
- ✅ **Platform Independent**: Works on Windows, Mac, Linux
- ✅ **High Salary**: Good job opportunities for Python developers

### What Can You Do with Python?
- 🌐 **Websites**: With Django, Flask
- 📊 **Data Analysis**: With Pandas, NumPy
- 🤖 **Artificial Intelligence**: With TensorFlow, PyTorch
- 🎮 **Games**: With Pygame
- 📱 **Mobile Applications**: With Kivy
- 🔧 **Automation Scripts**: Automating daily tasks

## 🚀 Python Installation

### Windows Installation
1. Go to [python.org](https://python.org)
2. Click "Download Python 3.12" button
3. Run the downloaded `.exe` file
4. Check **"Add Python to PATH"** checkbox ⚠️ IMPORTANT
5. Click "Install Now" button

### Mac Installation
```bash
# With Homebrew (recommended)
brew install python

# or download and install from python.org
```

### Linux Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip
```

### Installation Check
```bash
# Run in Terminal/Command Prompt
python --version
# or
python3 --version

# Output: Python 3.12.0 (or similar)
```

## 💻 Geliştirme Ortamı Hazırlığı

### 1. Python IDE/Editor Seçimi

**Yeni başlayanlar için öneriler:**
- **VS Code** (Ücretsiz, popüler)
- **PyCharm Community** (Ücretsiz, güçlü)
- **IDLE** (Python ile gelir)
- **Jupyter Notebook** (Veri analizi için)

### 2. VS Code Kurulumu ve Ayarları
```bash
# VS Code'u indirin: https://code.visualstudio.com/
# Python extension'ını kurun
```

**Gerekli Extension'lar:**
- Python (Microsoft)
- Python Docstring Generator
- Code Runner
- Python Indent

### 3. İlk Python Dosyanız
1. VS Code'u açın
2. Yeni dosya oluşturun: `ilk_program.py`
3. Aşağıdaki kodu yazın:

```python
print("Hello, Python World!")
print("I'm learning Python 🐍")
```

4. `Ctrl+F5` ile çalıştırın

## 📚 Python Basic Concepts

### 1. Variables
Variables are used to store data in memory.

```python
# Variable definition
name = "John"
age = 25
height = 1.75
is_student = True

# Printing variables
print("Name:", name)
print("Age:", age)
print("Height:", height)
print("Is student?", is_student)

# Learning variable types
print(type(name))    # <class 'str'>
print(type(age))     # <class 'int'>
print(type(height))     # <class 'float'>
print(type(is_student))  # <class 'bool'>
```

### 2. Data Types

#### String (Text)
```python
# String definition
first_name = "Python"
last_name = 'Programmer'
message = """This is a
multi-line
string."""

# String operations
full_name = first_name + " " + last_name  # Concatenation
print(full_name.upper())      # PYTHON PROGRAMMER
print(full_name.lower())      # python programmer
print(len(full_name))         # String length

# String formatting
print(f"Hello, I am {full_name}")
print("My age is {} and height is {}".format(age, height))
```

#### Number (Numbers)
```python
# Integer (Whole number)
num1 = 42
num2 = -17

# Float (Decimal number)
pi = 3.14159
temperature = -5.5

# Mathematical operations
sum_result = num1 + num2       # Addition
difference = num1 - num2       # Subtraction
product = num1 * num2          # Multiplication
division = num1 / num2         # Division
remainder = num1 % num2        # Modulo (remainder)
power = num1 ** 2              # Exponentiation

print(f"Sum: {sum_result}")
print(f"Product: {product}")
print(f"42 squared: {power}")
```

#### Boolean (True/False)
```python
# Boolean values
true_val = True
false_val = False

# Boolean operations
result1 = 5 > 3        # True
result2 = 10 == 5      # False
result3 = "python" in "python programming"  # True

print(f"5 > 3: {result1}")
print(f"10 == 5: {result2}")
```

### 3. Lists
Lists are used to store multiple items.

```python
# Creating lists
fruits = ["apple", "pear", "banana", "grape"]
numbers = [1, 2, 3, 4, 5]
mixed = ["Python", 42, True, 3.14]

# Accessing list elements
print(fruits[0])    # apple (first element)
print(fruits[-1])   # grape (last element)
print(fruits[1:3])  # ['pear', 'banana'] (slice)

# List operations
fruits.append("cherry")        # Adding element
fruits.remove("pear")          # Removing element
fruits.insert(1, "orange")     # Adding to specific position

print("Current fruit list:", fruits)
print("List length:", len(fruits))

# Looping through list
for fruit in fruits:
    print(f"My favorite fruit: {fruit}")
```

### 4. Sözlükler (Dictionaries)
Sözlükler, key-value çiftlerini saklar.

```python
# Sözlük oluşturma
ogrenci = {
    "ad": "Ayşe",
    "soyad": "Yılmaz", 
    "yas": 22,
    "bolum": "Bilgisayar Mühendisliği",
    "notlar": [85, 92, 78, 95]
}

# Sözlük elemanlarına erişim
print(ogrenci["ad"])           # Ayşe
print(ogrenci["notlar"][0])    # 85

# Yeni eleman ekleme/güncelleme
ogrenci["sehir"] = "İstanbul"
ogrenci["yas"] = 23

# Sözlük metodları
print(ogrenci.keys())      # Anahtarları göster
print(ogrenci.values())    # Değerleri göster
print(ogrenci.items())     # Key-value çiftleri

# Sözlük üzerinde döngü
for anahtar, deger in ogrenci.items():
    print(f"{anahtar}: {deger}")
```

## 🎯 Kontrol Yapıları

### 1. If-Else Koşulları
```python
# Basit if-else
yas = int(input("Yaşınızı girin: "))

if yas >= 18:
    print("Yetişkinsiniz!")
else:
    print("Henüz reşit değilsiniz.")

# Çoklu koşullar
not_ortalamasi = float(input("Not ortalamanızı girin: "))

if not_ortalamasi >= 90:
    harf_notu = "AA"
elif not_ortalamasi >= 80:
    harf_notu = "BA"
elif not_ortalamasi >= 70:
    harf_notu = "BB"
elif not_ortalamasi >= 60:
    harf_notu = "CB"
else:
    harf_notu = "FF"

print(f"Harf notunuz: {harf_notu}")

# Mantıksal operatörler
kullanici_adi = input("Kullanıcı adı: ")
sifre = input("Şifre: ")

if kullanici_adi == "admin" and sifre == "123456":
    print("Giriş başarılı!")
elif kullanici_adi == "admin" or sifre == "123456":
    print("Kullanıcı adı veya şifre hatalı!")
else:
    print("Geçersiz giriş!")
```

### 2. Döngüler (Loops)

#### For Döngüsü
```python
# Sayı dizisi üzerinde döngü
for i in range(1, 6):  # 1, 2, 3, 4, 5
    print(f"Sayı: {i}")

# Liste üzerinde döngü
programlama_dilleri = ["Python", "JavaScript", "Java", "C++"]

for dil in programlama_dilleri:
    print(f"Öğrenmek istediğim dil: {dil}")

# Enumerate ile index ve değer
for index, dil in enumerate(programlama_dilleri):
    print(f"{index + 1}. {dil}")

# Çarpım tablosu örneği
sayi = int(input("Hangi sayının çarpım tablosunu istersiniz? "))

for i in range(1, 11):
    sonuc = sayi * i
    print(f"{sayi} x {i} = {sonuc}")
```

#### While Döngüsü
```python
# Basit while döngüsü
sayac = 1
while sayac <= 5:
    print(f"Sayaç: {sayac}")
    sayac += 1

# Kullanıcı girişi ile while
toplam = 0
while True:
    sayi = input("Bir sayı girin (çıkmak için 'q'): ")
    
    if sayi.lower() == 'q':
        break
    
    try:
        toplam += int(sayi)
        print(f"Şu anki toplam: {toplam}")
    except ValueError:
        print("Lütfen geçerli bir sayı girin!")

print(f"Final toplam: {toplam}")
```

## 🔧 Fonksiyonlar (Functions)

### Temel Fonksiyon Yazımı
```python
# Basit fonksiyon
def selamla():
    print("Merhaba! Python öğreniyorum!")

# Fonksiyonu çağırma
selamla()

# Parametreli fonksiyon
def selamla_kisisel(isim):
    print(f"Merhaba {isim}! Python'a hoş geldin!")

selamla_kisisel("Ahmet")
selamla_kisisel("Fatma")

# Değer döndüren fonksiyon
def kare_al(sayi):
    return sayi ** 2

sonuc = kare_al(5)
print(f"5'in karesi: {sonuc}")

# Çoklu parametre
def toplama(a, b):
    return a + b

def carpma(a, b):
    return a * b

print(f"8 + 3 = {toplama(8, 3)}")
print(f"8 x 3 = {carpma(8, 3)}")
```

### Gelişmiş Fonksiyon Örnekleri
```python
# Default parametre
def tanit(isim, yas=18, sehir="Bilinmiyor"):
    return f"Adım {isim}, {yas} yaşındayım ve {sehir}'de yaşıyorum."

print(tanit("Ali"))
print(tanit("Ayşe", 25))
print(tanit("Mehmet", 30, "İstanbul"))

# Çoklu değer döndürme
def hesapla(a, b):
    toplam = a + b
    fark = a - b
    carpim = a * b
    return toplam, fark, carpim

t, f, c = hesapla(10, 3)
print(f"Toplam: {t}, Fark: {f}, Çarpım: {c}")

# Liste ile çalışan fonksiyon
def liste_istatistikleri(sayilar):
    toplam = sum(sayilar)
    ortalama = toplam / len(sayilar)
    en_buyuk = max(sayilar)
    en_kucuk = min(sayilar)
    
    return {
        "toplam": toplam,
        "ortalama": ortalama,
        "en_buyuk": en_buyuk,
        "en_kucuk": en_kucuk
    }

notlar = [85, 92, 78, 95, 88]
istatistikler = liste_istatistikleri(notlar)

for anahtar, deger in istatistikler.items():
    print(f"{anahtar}: {deger}")
```

## 🛠️ Pratik Projeler

### Proje 1: Hesap Makinesi
```python
def hesap_makinesi():
    print("=== PYTHON HESAP MAKİNESİ ===")
    print("İşlemler: +, -, *, /, ** (üs), % (mod)")
    
    while True:
        try:
            sayi1 = float(input("\nBirinci sayıyı girin: "))
            islem = input("İşlemi girin (+, -, *, /, **, %): ")
            sayi2 = float(input("İkinci sayıyı girin: "))
            
            if islem == '+':
                sonuc = sayi1 + sayi2
            elif islem == '-':
                sonuc = sayi1 - sayi2
            elif islem == '*':
                sonuc = sayi1 * sayi2
            elif islem == '/':
                if sayi2 == 0:
                    print("Hata: Sıfıra bölme!")
                    continue
                sonuc = sayi1 / sayi2
            elif islem == '**':
                sonuc = sayi1 ** sayi2
            elif islem == '%':
                sonuc = sayi1 % sayi2
            else:
                print("Geçersiz işlem!")
                continue
            
            print(f"Sonuç: {sayi1} {islem} {sayi2} = {sonuc}")
            
            devam = input("\nBaşka işlem yapmak ister misiniz? (e/h): ")
            if devam.lower() != 'e':
                print("Hesap makinesi kapatılıyor...")
                break
                
        except ValueError:
            print("Hata: Lütfen geçerli bir sayı girin!")

# Programı çalıştır
hesap_makinesi()
```

### Proje 2: Kelime Tahmin Oyunu
```python
import random

def kelime_tahmin_oyunu():
    kelimeler = [
        "python", "programlama", "bilgisayar", "yazilim", 
        "teknoloji", "internet", "yapay", "veri", "algoritma"
    ]
    
    kelime = random.choice(kelimeler)
    tahmin_edilen = ['_'] * len(kelime)
    yanlis_tahminler = []
    max_yanlis = 6
    
    print("=== KELİME TAHMİN OYUNU ===")
    print(f"Kelime {len(kelime)} harflidir.")
    print("Tahmin edilen kelime:", ' '.join(tahmin_edilen))
    
    while True:
        # Mevcut durumu göster
        print(f"\nTahmin edilen: {' '.join(tahmin_edilen)}")
        print(f"Yanlış tahminler: {', '.join(yanlis_tahminler)}")
        print(f"Kalan hak: {max_yanlis - len(yanlis_tahminler)}")
        
        # Kazanma kontrolü
        if '_' not in tahmin_edilen:
            print(f"\n🎉 Tebrikler! Kelimeyi buldunuz: {kelime}")
            break
        
        # Kaybetme kontrolü
        if len(yanlis_tahminler) >= max_yanlis:
            print(f"\n😞 Kaybettiniz! Kelime: {kelime}")
            break
        
        # Harf tahmin al
        harf = input("Bir harf tahmin edin: ").lower()
        
        if len(harf) != 1 or not harf.isalpha():
            print("Lütfen tek bir harf girin!")
            continue
        
        if harf in tahmin_edilen or harf in yanlis_tahminler:
            print("Bu harfi zaten tahmin ettiniz!")
            continue
        
        # Harf kontrolü
        if harf in kelime:
            print(f"✅ Doğru! '{harf}' harfi kelimede var.")
            for i, char in enumerate(kelime):
                if char == harf:
                    tahmin_edilen[i] = harf
        else:
            print(f"❌ Yanlış! '{harf}' harfi kelimede yok.")
            yanlis_tahminler.append(harf)

# Oyunu başlat
kelime_tahmin_oyunu()
```

### Proje 3: Öğrenci Not Sistemi
```python
class OgrenciNotSistemi:
    def __init__(self):
        self.ogrenciler = {}
    
    def ogrenci_ekle(self, ad, soyad):
        ogrenci_id = len(self.ogrenciler) + 1
        self.ogrenciler[ogrenci_id] = {
            'ad': ad,
            'soyad': soyad,
            'notlar': []
        }
        print(f"✅ {ad} {soyad} başarıyla eklendi. ID: {ogrenci_id}")
        return ogrenci_id
    
    def not_ekle(self, ogrenci_id, ders, not_degeri):
        if ogrenci_id in self.ogrenciler:
            if 0 <= not_degeri <= 100:
                self.ogrenciler[ogrenci_id]['notlar'].append({
                    'ders': ders,
                    'not': not_degeri
                })
                print(f"✅ Not eklendi: {ders} - {not_degeri}")
            else:
                print("❌ Not 0-100 arasında olmalıdır!")
        else:
            print("❌ Öğrenci bulunamadı!")
    
    def ortalama_hesapla(self, ogrenci_id):
        if ogrenci_id in self.ogrenciler:
            notlar = self.ogrenciler[ogrenci_id]['notlar']
            if notlar:
                toplam = sum([n['not'] for n in notlar])
                ortalama = toplam / len(notlar)
                return ortalama
            else:
                return 0
        return None
    
    def ogrenci_raporu(self, ogrenci_id):
        if ogrenci_id in self.ogrenciler:
            ogrenci = self.ogrenciler[ogrenci_id]
            print(f"\n=== {ogrenci['ad']} {ogrenci['soyad']} RAPORU ===")
            
            if ogrenci['notlar']:
                for not_bilgisi in ogrenci['notlar']:
                    print(f"{not_bilgisi['ders']}: {not_bilgisi['not']}")
                
                ortalama = self.ortalama_hesapla(ogrenci_id)
                print(f"\nOrtalama: {ortalama:.2f}")
                
                if ortalama >= 85:
                    print("Başarı Durumu: Pekiyi 🌟")
                elif ortalama >= 70:
                    print("Başarı Durumu: İyi 👍")
                elif ortalama >= 60:
                    print("Başarı Durumu: Orta 📚")
                else:
                    print("Başarı Durumu: Geçersiz ❌")
            else:
                print("Henüz not girilmemiş.")
        else:
            print("❌ Öğrenci bulunamadı!")
    
    def tum_ogrenciler(self):
        print("\n=== TÜM ÖĞRENCİLER ===")
        for ogrenci_id, bilgi in self.ogrenciler.items():
            ortalama = self.ortalama_hesapla(ogrenci_id)
            print(f"ID: {ogrenci_id} - {bilgi['ad']} {bilgi['soyad']} - Ortalama: {ortalama:.2f}")

# Sistem kullanımı örneği
def not_sistemi_demo():
    sistem = OgrenciNotSistemi()
    
    # Örnek öğrenciler ekle
    id1 = sistem.ogrenci_ekle("Ahmet", "Yılmaz")
    id2 = sistem.ogrenci_ekle("Ayşe", "Kaya")
    
    # Notlar ekle
    sistem.not_ekle(id1, "Matematik", 85)
    sistem.not_ekle(id1, "Fizik", 92)
    sistem.not_ekle(id1, "Kimya", 78)
    
    sistem.not_ekle(id2, "Matematik", 95)
    sistem.not_ekle(id2, "Fizik", 88)
    sistem.not_ekle(id2, "Kimya", 91)
    
    # Raporları göster
    sistem.ogrenci_raporu(id1)
    sistem.ogrenci_raporu(id2)
    sistem.tum_ogrenciler()

# Demo'yu çalıştır
not_sistemi_demo()
```

## 📁 Dosya İşlemleri

### Dosya Okuma ve Yazma
```python
# Dosyaya yazma
def dosya_yaz():
    with open('notlar.txt', 'w', encoding='utf-8') as dosya:
        dosya.write("Python öğreniyorum!\n")
        dosya.write("Dosya işlemleri çok faydalı.\n")
        dosya.write("Bu benim ilk dosya yazma deneyimim.\n")
    print("✅ Dosya başarıyla oluşturuldu!")

# Dosya okuma
def dosya_oku():
    try:
        with open('notlar.txt', 'r', encoding='utf-8') as dosya:
            icerik = dosya.read()
            print("📄 Dosya içeriği:")
            print(icerik)
    except FileNotFoundError:
        print("❌ Dosya bulunamadı!")

# Satır satır okuma
def dosya_satirlar():
    try:
        with open('notlar.txt', 'r', encoding='utf-8') as dosya:
            for satir_no, satir in enumerate(dosya, 1):
                print(f"{satir_no}: {satir.strip()}")
    except FileNotFoundError:
        print("❌ Dosya bulunamadı!")

# CSV benzeri veri işleme
def ogrenci_kayit_sistemi():
    def kayit_ekle(ad, soyad, yas, bolum):
        with open('ogrenciler.txt', 'a', encoding='utf-8') as dosya:
            dosya.write(f"{ad},{soyad},{yas},{bolum}\n")
        print(f"✅ {ad} {soyad} kaydedildi!")
    
    def kayitlari_goster():
        try:
            with open('ogrenciler.txt', 'r', encoding='utf-8') as dosya:
                print("\n=== ÖĞRENCİ KAYITLARI ===")
                for satir_no, satir in enumerate(dosya, 1):
                    bilgiler = satir.strip().split(',')
                    if len(bilgiler) == 4:
                        print(f"{satir_no}. {bilgiler[0]} {bilgiler[1]} - {bilgiler[2]} yaş - {bilgiler[3]}")
        except FileNotFoundError:
            print("❌ Henüz kayıt yok!")
    
    # Örnek kullanım
    kayit_ekle("Ahmet", "Yılmaz", "22", "Bilgisayar Mühendisliği")
    kayit_ekle("Ayşe", "Kaya", "21", "Matematik")
    kayitlari_goster()

# Fonksiyonları test et
dosya_yaz()
dosya_oku()
ogrenci_kayit_sistemi()
```

## 🐛 Hata Yönetimi (Error Handling)

### Try-Except Kullanımı
```python
# Basit hata yakalama
def guvenli_bolme():
    try:
        sayi1 = float(input("Birinci sayı: "))
        sayi2 = float(input("İkinci sayı: "))
        sonuc = sayi1 / sayi2
        print(f"Sonuç: {sonuc}")
    except ZeroDivisionError:
        print("❌ Hata: Sıfıra bölme yapılamaz!")
    except ValueError:
        print("❌ Hata: Lütfen geçerli bir sayı girin!")
    except Exception as e:
        print(f"❌ Beklenmeyen hata: {e}")

# Çoklu hata türü
def dosya_islemleri():
    dosya_adi = input("Dosya adını girin: ")
    
    try:
        with open(dosya_adi, 'r', encoding='utf-8') as dosya:
            icerik = dosya.read()
            print(f"Dosya uzunluğu: {len(icerik)} karakter")
            
    except FileNotFoundError:
        print(f"❌ '{dosya_adi}' dosyası bulunamadı!")
        
        # Dosya oluştur
        cevap = input("Dosyayı oluşturmak ister misiniz? (e/h): ")
        if cevap.lower() == 'e':
            with open(dosya_adi, 'w', encoding='utf-8') as yeni_dosya:
                yeni_dosya.write("Bu dosya Python tarafından oluşturuldu.\n")
            print(f"✅ '{dosya_adi}' dosyası oluşturuldu!")
            
    except PermissionError:
        print("❌ Dosyaya erişim izniniz yok!")
    except Exception as e:
        print(f"❌ Hata: {e}")

# Finally bloğu
def temizlik_ornegi():
    dosya = None
    try:
        dosya = open('test.txt', 'w')
        dosya.write("Test verisi")
        # Burada bir hata olabilir
        
    except Exception as e:
        print(f"Hata oluştu: {e}")
        
    finally:
        # Her durumda çalışır
        if dosya:
            dosya.close()
            print("Dosya kapatıldı.")

guvenli_bolme()
```

## 🎯 En İyi Uygulamalar ve İpuçları

### Kod Yazım Kuralları
```python
# İyi kod yazım örnekleri

# 1. Anlamlı değişken isimleri
# Kötü
a = 25
b = "Ahmet"

# İyi
yas = 25
ogrenci_adi = "Ahmet"

# 2. Fonksiyon dokümantasyonu
def hesapla_ortalama(notlar):
    """
    Verilen notların ortalamasını hesaplar.
    
    Args:
        notlar (list): Not listesi
        
    Returns:
        float: Ortalama değer
    """
    if not notlar:
        return 0
    return sum(notlar) / len(notlar)

# 3. Sabitler büyük harfle
PI = 3.14159
MAX_DENEME = 3
VARSAYILAN_PORT = 8080

# 4. Liste comprehension
# Geleneksel yöntem
kareler = []
for i in range(1, 6):
    kareler.append(i ** 2)

# Pythonic yöntem
kareler = [i ** 2 for i in range(1, 6)]

# 5. Koşullu liste comprehension
cift_sayilar = [x for x in range(1, 21) if x % 2 == 0]
print(cift_sayilar)  # [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
```

### Performans İpuçları
```python
# 1. String birleştirme
# Yavaş
metin = ""
for i in range(1000):
    metin += str(i)

# Hızlı
metin = "".join(str(i) for i in range(1000))

# 2. Listede arama
# Yavaş (liste)
buyuk_liste = list(range(10000))
if 5000 in buyuk_liste:
    print("Bulundu")

# Hızlı (set)
buyuk_set = set(range(10000))
if 5000 in buyuk_set:
    print("Bulundu")

# 3. Enumerate kullanımı
kelimeler = ["python", "java", "javascript"]

# Geleneksel
for i in range(len(kelimeler)):
    print(f"{i}: {kelimeler[i]}")

# Pythonic
for i, kelime in enumerate(kelimeler):
    print(f"{i}: {kelime}")
```

## 🚀 Sonraki Adımlar

### Python'da Uzmanlaşma Yolları

#### 1. Web Geliştirme
```python
# Flask ile basit web uygulaması
from flask import Flask

app = Flask(__name__)

@app.route('/')
def anasayfa():
    return '<h1>Python Web Uygulamam!</h1>'

@app.route('/hakkinda')
def hakkinda():
    return '<h2>Bu uygulama Python Flask ile yapıldı.</h2>'

if __name__ == '__main__':
    app.run(debug=True)
```

#### 2. Veri Analizi
```python
# Pandas ile basit veri analizi
import pandas as pd

# CSV dosyası okuma
# df = pd.read_csv('veriler.csv')

# Örnek veri oluşturma
veriler = {
    'isim': ['Ahmet', 'Ayşe', 'Mehmet', 'Fatma'],
    'yas': [25, 30, 35, 28],
    'maas': [5000, 6500, 7200, 5800]
}

df = pd.DataFrame(veriler)
print("Veri seti:")
print(df)

print("\nTemel istatistikler:")
print(df.describe())
```

#### 3. Otomasyon
```python
# Dosya organizasyonu scripti
import os
import shutil

def dosyalari_organize_et(kaynak_klasor):
    """Dosyaları uzantılarına göre organize eder"""
    
    uzanti_klasorleri = {
        '.jpg': 'Resimler',
        '.png': 'Resimler',
        '.pdf': 'Belgeler',
        '.txt': 'Belgeler',
        '.mp3': 'Muzik',
        '.mp4': 'Videolar'
    }
    
    for dosya in os.listdir(kaynak_klasor):
        if os.path.isfile(os.path.join(kaynak_klasor, dosya)):
            uzanti = os.path.splitext(dosya)[1].lower()
            
            if uzanti in uzanti_klasorleri:
                hedef_klasor = uzanti_klasorleri[uzanti]
                hedef_yol = os.path.join(kaynak_klasor, hedef_klasor)
                
                # Klasör yoksa oluştur
                os.makedirs(hedef_yol, exist_ok=True)
                
                # Dosyayı taşı
                kaynak = os.path.join(kaynak_klasor, dosya)
                hedef = os.path.join(hedef_yol, dosya)
                shutil.move(kaynak, hedef)
                
                print(f"{dosya} -> {hedef_klasor}")

# Kullanım: dosyalari_organize_et("/path/to/folder")
```

### 📚 Öğrenmeye Devam Etmek İçin Kaynaklar

#### Kütüphaneler
- **Web**: Django, Flask, FastAPI
- **Veri**: Pandas, NumPy, Matplotlib
- **AI/ML**: Scikit-learn, TensorFlow, PyTorch
- **Otomasyon**: Selenium, BeautifulSoup, Requests

#### Proje Fikirleri
1. **Kişisel Blog**: Django ile
2. **Hava Durumu Uygulaması**: API kullanarak
3. **Finans Takipçisi**: Excel verileri analizi
4. **Web Scraper**: Haber sitelerinden veri çekme
5. **Chatbot**: Basit soru-cevap sistemi

### 💼 Kariyer Fırsatları

Python öğrendikten sonra şu pozisyonlara başvurabilirsiniz:

- **Junior Python Developer**: 35,000-50,000 TL
- **Data Analyst**: 40,000-65,000 TL
- **Backend Developer**: 45,000-70,000 TL
- **DevOps Engineer**: 50,000-80,000 TL
- **Machine Learning Engineer**: 60,000-100,000 TL

## 🎯 Özet ve Son Tavsiyeler

### Python Öğrenme Yol Haritası:
1. **Temel Syntax** (1-2 hafta): Değişkenler, veri tipleri, kontrol yapıları
2. **Fonksiyonlar ve Modüller** (1 hafta): Kod organizasyonu
3. **OOP Temelleri** (1-2 hafta): Class ve object kavramları
4. **Projeler** (sürekli): Öğrendiklerinizi uygulayın
5. **Uzmanlaşma** (3-6 ay): Web, veri analizi veya AI seçin

### 🔥 Başarı İçin Altın Kurallar:
- **Her gün kod yazın** (en az 30 dakika)
- **Projeler yapın** (tutorial'dan öte)
- **Hata yapmaktan korkmayın**
- **Toplulukla etkileşim kurun** (GitHub, Stack Overflow)
- **Sürekli öğrenin** (yeni kütüphaneler, teknolojiler)

### 📊 Önemli Resim Promptları:

1. **"Python programming roadmap infographic from beginner to expert"**
2. **"Python code editor setup with VS Code and extensions"**
3. **"Python data structures visualization: lists, dictionaries, sets"**
4. **"Python career paths diagram showing web dev, data science, AI paths"**
5. **"Python programming concepts flowchart with variables, functions, loops"**

## 🎉 Tebrikler!

Bu rehberi tamamladığınız için tebrikler! Artık Python'un temellerini biliyorsunuz ve ilk projelerinizi geliştirebilirsiniz. Unutmayın, programlama öğrenmek bir maraton, sprint değil. Sabırlı olun, pratik yapın ve asla vazgeçmeyin!

**Bir sonraki adımınız:** Zumenzu platformunda interaktif Python quiz'lerini çözerek bilginizi pekiştirin ve badge'ler kazanın!

---

*Bu makale Zumenzu programlama ekibi tarafından Python öğrenmek isteyenler için hazırlanmıştır. Interaktif Python dersleri ve projeler için [Zumenzu platformunu](/) ziyaret edin.*