import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const lessonsData = [
  // =============================================
  // PYTHON 1. DERS - ÇOK DETAYLI VE YENİ ÖZELLİKLER
  // =============================================
  {
    id: "python_lesson_001",
    title: "🐍 Python Dünyasına Hoş Geldiniz! - Kapsamlı Giriş",
    slug: "python-giris-kapsamli",
    description: "🎯 KAPSAMLI ve İNTERAKTİF! Python programlama dilinin derinlemesine tanıtımı. Tarihçe, özellikler, kullanım alanları, kurulum, ilk program ve gelişim yol haritası. Anime temalı örnekler ve gerçek dünya uygulamaları ile öğrenin!",
    content: {
      sections: {
        welcome: {
          title: "🌟 Python Dünyasına Hoş Geldiniz!",
          content: `
🎉 **Tebrikler!** Python öğrenme serüveninize başlıyorsunuz! 

Python sadece bir programlama dili değil - teknoloji dünyasının en güçlü araçlarından biri. Bu derste Python'un büyülü dünyasını keşfedecek, neden milyonlarca geliştirici tarafından tercih edildiğini öğrenecek ve ilk programınızı yazacaksınız!

**🎯 Bu Derste Neler Öğreneceksiniz:**
• Python'un tarihi ve felsefesi
• Gerçek dünyada Python kullanım alanları
• Python'un avantajları ve özellikleri
• Geliştirme ortamı kurulumu
• İlk Python programınız
• Gelecek öğrenme yol haritanız

**🎮 İnteraktif Özellikler:**
• Canlı kod editörü
• Gerçek zamanlı çıktı görüntüleme
• Anime karakterleri ile örnekler
• Mini oyunlar ve challengelar
• İlerleme takip sistemi
          `
        },
        
        python_history: {
          title: "📜 Python'un Büyülü Tarihi",
          content: `
**🕰️ Python'un Doğuş Hikayesi**

Python'un hikayesi 1989 yılında Hollandalı programcı **Guido van Rossum** ile başlar. Guido, Noel tatilinde sıkıldığı için yeni bir programlama dili yaratmaya karar verir. Adını da İngiliz komedi grubu "Monty Python" dan alır!

**⏰ Zaman Çizelgesi:**
• **1989**: Guido van Rossum Python'u yaratmaya başlar
• **1991**: Python 0.9.0 ilk sürümü yayınlanır
• **1994**: Python 1.0 - İlk kararlı sürüm
• **2000**: Python 2.0 - Unicode desteği eklenir
• **2008**: Python 3.0 - Modern Python'un temeli
• **2024**: Python 3.12+ - Günümüz sürümleri

**🐍 Neden "Python" İsmi?**
Guido van Rossum bu ismi seçme sebebini şöyle açıklıyor:
> "Kısa, benzersiz ve biraz gizemli bir isim istiyordum. Ayrıca Monty Python'un Flying Circus'un büyük bir fanıydım."

**🌟 Python Felsefesi - "Zen of Python":**
\`\`\`python
import this  # Bu kodu çalıştırın!
\`\`\`

Python'un temel prensipleri:
• **Güzel, çirkin olanından iyidir**
• **Açık, gizli olanından iyidir**
• **Basit, karmaşık olanından iyidir**
• **Karmaşık, komplike olanından iyidir**
• **Okunabilirlik önemlidir**

**🎌 Anime Karakteri ile Açıklama:**
*Naruto'nun "Hokage olacağım!" hedefi gibi, Python da "Programlamayı herkes için kolay hale getireceğim!" hedefiyle yola çıktı ve bu hedefine ulaştı!*
          `
        },

        why_python: {
          title: "🚀 Neden Python? - Süper Güçler",
          content: `
**⚡ Python'un Süper Güçleri**

**1. 🎯 Kolay Öğrenme**
Python, programlamaya yeni başlayanlar için mükemmel:
\`\`\`python
# Python'da "Merhaba Dünya"
print("Merhaba Dünya!")

# Java'da aynı işlem
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Merhaba Dünya!");
    }
}
\`\`\`

**2. 📚 Okunabilir Kod**
Python kodu neredeyse İngilizce gibi okunur:
\`\`\`python
# Anime karakteri kontrol etme
if character_name == "Goku":
    print("Bu güçlü bir Saiyan!")
elif character_name == "Naruto":
    print("Bu gelecekteki Hokage!")
else:
    print("Bu da harika bir karakter!")
\`\`\`

**3. 🔋 Güçlü Kütüphaneler**
Python'da her şey için hazır kütüphane var:
• **Web Development**: Django, Flask
• **Data Science**: Pandas, NumPy, Matplotlib
• **AI/ML**: TensorFlow, PyTorch, scikit-learn
• **Automation**: Selenium, Beautiful Soup
• **Game Development**: Pygame, Panda3D

**4. 🌍 Platform Bağımsızlığı**
"Write once, run anywhere" - Bir kez yaz, her yerde çalıştır!
• Windows ✅
• Mac ✅  
• Linux ✅
• Mobile ✅
• Web ✅

**5. 👥 Büyük Topluluk**
• 15+ milyon aktif geliştirici
• 300,000+ paket PyPI'da
• Günde 2+ milyon indirme
• Stack Overflow'da en çok sorulan dil

**🎮 Anime Benzetmesi:**
*Python, Goku'nun Kamehameha tekniği gibi - öğrenmesi kolay, kullanması etkili, ve sürekli güçlü hale geliyor!*

**📊 Popülerlik İstatistikleri (2024):**
• GitHub'da #1 en popüler dil
• Stack Overflow anketinde #3 en sevilen dil
• İş ilanlarında #2 en çok aranan dil
• Maaş ortalaması: $95,000-$150,000 (ABD)
          `
        },

        usage_areas: {
          title: "🌐 Python'un Kullanım Alanları - Sınırsız Olasılıklar",
          content: `
**🎯 Python Her Yerde!**

**1. 🌐 Web Geliştirme**
Dünyanın en büyük siteleri Python kullanıyor:
• **Instagram**: 400+ milyon kullanıcı
• **YouTube**: Video işleme ve öneriler
• **Spotify**: Müzik önerileri
• **Netflix**: İçerik önerileri
• **Dropbox**: Dosya senkronizasyonu

\`\`\`python
# Django ile basit web sitesi
from django.http import HttpResponse

def anime_list(request):
    return HttpResponse("En sevilen animeler listesi!")
\`\`\`

**2. 🤖 Yapay Zeka ve Makine Öğrenmesi**
AI devriminin kalbi Python:
• **OpenAI**: ChatGPT ve GPT modelleri
• **Tesla**: Otopilot sistemi
• **Google**: Arama algoritması
• **Facebook**: Görüntü tanıma

\`\`\`python
# Basit AI örneği
import tensorflow as tf

# Anime karakter tanıma modeli
model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(10, activation='softmax')
])
\`\`\`

**3. 📊 Veri Bilimi ve Analitik**
Verilerden değer çıkarma:
• **NASA**: Mars verilerini analiz etme
• **Netflix**: İzleyici davranışları analizi
• **Uber**: Rota optimizasyonu
• **Twitter**: Trend analizi

\`\`\`python
# Anime popülerlik analizi
import pandas as pd
import matplotlib.pyplot as plt

anime_data = pd.read_csv('anime_ratings.csv')
top_anime = anime_data.groupby('name')['rating'].mean().sort_values(ascending=False)
top_anime.head(10).plot(kind='bar')
plt.title('En Yüksek Puanlı Animeler')
plt.show()
\`\`\`

**4. 🎮 Oyun Geliştirme**
Eğlenceli oyunlar yaratma:
• **EVE Online**: Sunucu tarafı
• **Civilization IV**: Oyun motoru
• **Battlefield**: Sunucu araçları

\`\`\`python
# Pygame ile basit anime savaş oyunu
import pygame

# Goku vs Vegeta savaş oyunu
class Character:
    def __init__(self, name, power):
        self.name = name
        self.power = power
    
    def attack(self, enemy):
        damage = self.power * 0.8
        return f"{self.name} {enemy.name}'e {damage} hasar verdi!"

goku = Character("Goku", 9000)
vegeta = Character("Vegeta", 8500)
print(goku.attack(vegeta))
\`\`\`

**5. 🔧 Otomasyon ve Betikler**
Tekrarlayan işleri otomatikleştirme:
• Dosya organizasyonu
• E-posta gönderimi
• Web scraping
• Sistem yönetimi

\`\`\`python
# Anime fotoğraflarını otomatik organize etme
import os
import shutil

def organize_anime_photos():
    for filename in os.listdir('downloads'):
        if 'naruto' in filename.lower():
            shutil.move(f'downloads/{filename}', 'anime/naruto/')
        elif 'onepiece' in filename.lower():
            shutil.move(f'downloads/{filename}', 'anime/onepiece/')
\`\`\`

**6. 🔬 Bilimsel Hesaplama**
Araştırma ve keşif:
• **CERN**: Higgs boson keşfi
• **ESA**: Uzay misyonları
• **Genomik**: DNA analizi

**7. 💰 Fintech ve Kripto**
Finansal çözümler:
• **PayPal**: Ödeme işlemleri
• **Robinhood**: Trading platformu
• **Binance**: Kripto borsası

**🎌 Anime Dünyasında Python:**
Anime endüstrisinde de Python kullanılıyor:
• **Studio Ghibli**: Animasyon pipeline
• **Toei Animation**: Efekt işlemleri
• **MAPPA**: 3D entegrasyonu
• **Madhouse**: Compositing işlemleri

**📈 Gelecek Trendleri:**
• IoT ve akıllı cihazlar
• Blockchain ve Web3
• Quantum computing
• Augmented Reality (AR)
• Virtual Reality (VR)
          `
        },

        python_features: {
          title: "✨ Python'un Benzersiz Özellikleri",
          content: `
**🎯 Python'u Özel Kılan Özellikler**

**1. 🎨 Indentation (Girinti) Sistemi**
Python'da bloklar {} yerine girinti ile belirlenir:

\`\`\`python
# Python - temiz ve okunabilir
if power_level > 9000:
    print("It's over 9000!")
    if character == "Goku":
        print("Incredible Saiyan power!")
        
# C++ - süslü parantezler
if (power_level > 9000) {
    printf("It's over 9000!");
    if (character == "Goku") {
        printf("Incredible Saiyan power!");
    }
}
\`\`\`

**2. 🔄 Dynamic Typing (Dinamik Tipleme)**
Değişken tiplerini önceden belirtmenize gerek yok:

\`\`\`python
# Python - esnek tiplemme
character = "Naruto"        # string
character = 25             # integer
character = 175.5          # float
character = True           # boolean
character = ["Ninja", "Hokage"]  # list

# Java - sabit tipleme
String character = "Naruto";
int age = 25;
double height = 175.5;
boolean isNinja = true;
\`\`\`

**3. 🚀 Interpreted Language (Yorumlanan Dil)**
Kod derleme işlemi olmadan direkt çalıştırılır:

\`\`\`bash
# Python - direkt çalıştır
python anime_game.py

# C++ - önce derle, sonra çalıştır
g++ anime_game.cpp -o anime_game
./anime_game
\`\`\`

**4. 🎁 Comprehensive Standard Library**
"Batteries included" - her şey hazır:

\`\`\`python
# Tarih ve saat
from datetime import datetime
print(f"Bugün: {datetime.now()}")

# JSON işlemleri
import json
anime_data = {"name": "Attack on Titan", "rating": 9.0}
json_string = json.dumps(anime_data)

# HTTP istekleri
import urllib.request
response = urllib.request.urlopen('https://api.myanimelist.net')

# Rastgele sayılar
import random
lucky_number = random.randint(1, 100)

# Dosya işlemleri
import os
files = os.listdir('anime_photos')
\`\`\`

**5. 🧩 Multiple Programming Paradigms**
Farklı programlama stillerini destekler:

\`\`\`python
# 1. Procedural Programming (Prosedürel)
def calculate_power(base, multiplier):
    return base * multiplier

goku_power = calculate_power(9000, 1.5)

# 2. Object-Oriented Programming (Nesne Yönelimli)
class Character:
    def __init__(self, name, power):
        self.name = name
        self.power = power
    
    def power_up(self):
        self.power *= 1.5

goku = Character("Goku", 9000)
goku.power_up()

# 3. Functional Programming (Fonksiyonel)
powers = [1000, 2500, 9000, 8500]
strong_characters = list(filter(lambda x: x > 5000, powers))
powered_up = list(map(lambda x: x * 1.5, powers))
\`\`\`

**6. 🔧 Powerful Built-in Functions**
Çok kullanışlı hazır fonksiyonlar:

\`\`\`python
# Listeleme ve sıralama
anime_list = ["Naruto", "One Piece", "Dragon Ball"]
sorted_anime = sorted(anime_list)
reversed_anime = list(reversed(anime_list))

# Matematiksel işlemler
ratings = [9.0, 8.5, 9.2, 8.8, 9.5]
average_rating = sum(ratings) / len(ratings)
highest_rating = max(ratings)
lowest_rating = min(ratings)

# String işlemleri
character_name = "  MONKEY D. LUFFY  "
clean_name = character_name.strip().title()  # "Monkey D. Luffy"

# Type checking
print(type(ratings))        # <class 'list'>
print(isinstance(9.0, float))  # True
\`\`\`

**7. 🎯 List/Dict Comprehensions**
Tek satırda güçlü işlemler:

\`\`\`python
# Geleneksel yöntem
squares = []
for i in range(10):
    squares.append(i ** 2)

# List comprehension - tek satır!
squares = [i ** 2 for i in range(10)]

# Anime karakterleri örneği
characters = ["Goku", "Vegeta", "Piccolo", "Gohan"]
strong_chars = [char for char in characters if len(char) > 4]
upper_chars = [char.upper() for char in characters]

# Dictionary comprehension
power_levels = {"Goku": 9000, "Vegeta": 8500, "Piccolo": 3000}
strong_fighters = {name: power for name, power in power_levels.items() if power > 5000}
\`\`\`

**8. 🔄 Exception Handling (Hata Yönetimi)**
Zarif hata yakalama:

\`\`\`python
try:
    power_level = int(input("Power level girin: "))
    if power_level > 9000:
        print("It's over 9000!")
except ValueError:
    print("Lütfen sayı girin!")
except Exception as e:
    print(f"Beklenmeyen hata: {e}")
finally:
    print("İşlem tamamlandı!")
\`\`\`

**9. 🎪 Decorators (Dekoratörler)**
Fonksiyonlara süper güçler ekleme:

\`\`\`python
# Zaman ölçme dekoratörü
import time
from functools import wraps

def measure_time(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} {end - start:.2f} saniye sürdü")
        return result
    return wrapper

@measure_time
def calculate_kamehameha():
    # Karmaşık hesaplama simülasyonu
    power = sum(i ** 2 for i in range(10000))
    return power

result = calculate_kamehameha()  # Otomatik zaman ölçümü!
\`\`\`

**10. 🌟 Generator Functions**
Bellek dostu veri üretimi:

\`\`\`python
# Normal liste - tüm veri bellekte
def get_all_episodes():
    return [f"Episode {i}" for i in range(1, 1001)]  # 1000 episode

# Generator - veriyi ihtiyaç halinde üret
def get_episodes():
    for i in range(1, 1001):
        yield f"Episode {i}"

# Kullanım
episodes = get_episodes()
for episode in episodes:
    print(episode)  # Her seferinde bir episode
\`\`\`

**🎌 Anime Benzetmesi:**
*Python'un özellikleri, Dragon Ball'daki farklı dönüşümler gibi - her biri farklı durumlar için özel güçler sağlar!*

**⚡ Performans İpuçları:**
• List comprehension normal döngülerden %30 daha hızlı
• Generator'lar bellekte %90 daha az yer kaplar
• Built-in fonksiyonlar C dilinde yazıldığı için çok hızlı
• Dictionary lookup O(1) kompleksitesinde
          `
        },

        installation_setup: {
          title: "🛠️ Python Kurulumu ve Geliştirme Ortamı",
          content: `
**💻 Python'u Kurma Rehberi**

**1. 🪟 Windows Kurulumu**

**Adım 1: Python İndirme**
• https://python.org/downloads/ adresine gidin
• "Download Python 3.12.x" butonuna tıklayın
• İndirilen dosyayı çalıştırın

**Adım 2: Kurulum**
• ✅ "Add Python to PATH" kutucuğunu işaretleyin (ÖNEMLİ!)
• "Install Now" seçeneğini seçin
• Kurulum tamamlanana kadar bekleyin

**Adım 3: Doğrulama**
\`\`\`cmd
# Command Prompt'u açın ve yazın:
python --version
# Çıktı: Python 3.12.x

pip --version
# Çıktı: pip 23.x.x
\`\`\`

**2. 🍎 macOS Kurulumu**

**Homebrew ile (Önerilen):**
\`\`\`bash
# Homebrew kurulumu (eğer yoksa)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Python kurulumu
brew install python

# Doğrulama
python3 --version
pip3 --version
\`\`\`

**3. 🐧 Linux Kurulumu**

**Ubuntu/Debian:**
\`\`\`bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
python3 --version
\`\`\`

**CentOS/RHEL:**
\`\`\`bash
sudo yum install python3 python3-pip
python3 --version
\`\`\`

**4. 📝 Code Editor Seçimi**

**🥇 Visual Studio Code (En Popüler)**
• Ücretsiz ve güçlü
• Python extension'ı mükemmel
• IntelliSense ve debugging
• Git entegrasyonu

**Kurulum:**
1. https://code.visualstudio.com/ dan indirin
2. Python extension'ı yükleyin
3. Yapılandırma:

\`\`\`json
// settings.json
{
    "python.defaultInterpreterPath": "python",
    "python.linting.enabled": true,
    "python.linting.pylintEnabled": true,
    "python.formatting.provider": "black",
    "editor.formatOnSave": true
}
\`\`\`

**🥈 PyCharm (Profesyonel)**
• JetBrains tarafından geliştirildi
• Güçlü debugging ve profiling
• Django desteği mükemmel
• Community Edition ücretsiz

**🥉 Diğer Seçenekler:**
• **Sublime Text**: Hızlı ve hafif
• **Atom**: GitHub tarafından (artık desteklenmiyor)
• **Vim/Neovim**: Terminal tabanlı
• **Jupyter Notebook**: Data Science için

**5. 🚀 İlk Python Programınız**

**hello_world.py dosyası oluşturun:**
\`\`\`python
# Anime temalı ilk program
print("🐍 Python Dünyasına Hoş Geldiniz! 🐍")
print("=" * 40)

# Anime karakteri tanımlama
character_name = "Monkey D. Luffy"
anime_series = "One Piece"
dream = "Pirate King olmak"

# Karakter bilgilerini yazdırma
print(f"Karakter: {character_name}")
print(f"Anime: {anime_series}")
print(f"Rüyası: {dream}")

# Güç seviyesi hesaplama
base_power = 1000
multiplier = 1.8
final_power = base_power * multiplier

print(f"\\nGüç Seviyesi: {final_power}")

if final_power > 1500:
    print("🔥 Bu çok güçlü bir karakter!")
else:
    print("⭐ Bu iyi bir başlangıç!")

print("\\n🎉 İlk Python programınızı başarıyla çalıştırdınız!")
\`\`\`

**Çalıştırma:**
\`\`\`bash
python hello_world.py
\`\`\`

**6. 📦 Package Management (Paket Yönetimi)**

**pip ile paket kurulumu:**
\`\`\`bash
# Popüler paketleri kurma
pip install requests      # HTTP istekleri
pip install pandas       # Veri analizi
pip install matplotlib   # Grafik çizimi
pip install beautifulsoup4  # Web scraping
pip install django       # Web framework

# Paket listesini görme
pip list

# Paket güncelleme
pip install --upgrade package_name

# Requirements dosyası oluşturma
pip freeze > requirements.txt

# Requirements dosyasından kurulum
pip install -r requirements.txt
\`\`\`

**7. 🌐 Virtual Environment (Sanal Ortam)**

**Neden Virtual Environment?**
• Farklı projeler için farklı paket versiyonları
• Sistem Python'unu karıştırmamak
• Temiz ve organize çalışma

**Oluşturma ve Kullanma:**
\`\`\`bash
# Sanal ortam oluşturma
python -m venv anime_project

# Aktivasyon
# Windows:
anime_project\\Scripts\\activate

# macOS/Linux:
source anime_project/bin/activate

# Paket kurulumu (artık izole ortamda)
pip install requests pandas

# Deaktivasyon
deactivate
\`\`\`

**8. 🔧 Yararlı Araçlar**

**Code Formatting:**
\`\`\`bash
# Black - otomatik kod formatlaması
pip install black
black your_script.py

# isort - import sıralama
pip install isort
isort your_script.py
\`\`\`

**Code Quality:**
\`\`\`bash
# pylint - kod kalitesi kontrolü
pip install pylint
pylint your_script.py

# flake8 - stil kontrolü
pip install flake8
flake8 your_script.py
\`\`\`

**9. 🎮 İnteraktif Python Kullanımı**

**Python Shell:**
\`\`\`bash
python
>>> print("Merhaba Anime Dünyası!")
>>> 9000 + 1500
>>> exit()
\`\`\`

**IPython (Gelişmiş Shell):**
\`\`\`bash
pip install ipython
ipython

In [1]: character = "Goku"
In [2]: character.upper()
Out[2]: 'GOKU'
\`\`\`

**10. 📚 Öğrenme Kaynakları**

**Online Platformlar:**
• **Python.org Tutorial**: Resmi dokümantasyon
• **Codecademy**: İnteraktif dersler
• **freeCodeCamp**: Ücretsiz kurslar
• **Real Python**: Derinlemesine makaleler

**Kitaplar:**
• "Python Crash Course" - Eric Matthes
• "Automate the Boring Stuff" - Al Sweigart
• "Fluent Python" - Luciano Ramalho

**🎌 Anime Fan'ı İçin İpucu:**
Python öğrenirken anime karakterleri ve hikayelerini örnek olarak kullanın. Bu hem eğlenceli hem de akılda kalıcı olur!

**✅ Kurulum Kontrol Listesi:**
- [ ] Python 3.12+ kuruldu
- [ ] pip çalışıyor
- [ ] Code editor seçildi ve yapılandırıldı
- [ ] İlk program yazıldı ve çalıştırıldı
- [ ] Virtual environment oluşturuldu
- [ ] Temel araçlar kuruldu

**🚀 Bir Sonraki Adım:**
Kurulum tamamlandıktan sonra değişkenler konusuna geçebilirsiniz!
          `
        },

        first_program: {
          title: "🎉 İlk Python Programınız - Anime Karakter Yaratıcısı",
          content: `
**🌟 Hayal Gücünüzü Kod ile Birleştirin!**

Şimdi Python'da ilk gerçek programınızı yazacaksınız! Bu sadece "Hello World" değil - kendi anime karakterinizi yaratacağınız interaktif bir program!

**🎯 Program Özellikleri:**
• Kullanıcı girişi alma
• Değişkenler ile veri saklama
• Koşullu mantık kullanımı
• Çıktı formatlaması
• Anime temalı eğlenceli içerik

**📝 Kod Açıklaması:**

\`\`\`python
# 🎮 ANIME KARAKTER YARATICISI
# Bu program ile kendi anime karakterinizi yaratın!

print("🌟 ANIME KARAKTER YARATICISI 🌟")
print("=" * 50)

# 1. Karakter bilgilerini alma
print("\\n📝 Karakterinizin bilgilerini girin:")
character_name = input("🎌 Karakter adı: ")
anime_series = input("📺 Hangi anime evreninden: ")
age = int(input("🎂 Yaşı: "))

# 2. Güç seviyesi belirleme
print(f"\\n⚡ {character_name}'in güç seviyesini belirleyelim:")
base_power = int(input("🔥 Temel güç (1-1000): "))

# 3. Özel yetenek seçimi
print("\\n🎯 Özel yetenek seçin:")
print("1. Ateş Bükücü 🔥")
print("2. Su Bükücü 💧") 
print("3. Hava Bükücü 💨")
print("4. Toprak Bükücü 🌍")

ability_choice = input("Seçiminiz (1-4): ")

# 4. Yetenek adlarını belirleme
abilities = {
    "1": ("Ateş Bükücü", "🔥", 1.5),
    "2": ("Su Bükücü", "💧", 1.3),
    "3": ("Hava Bükücü", "💨", 1.4),
    "4": ("Toprak Bükücü", "🌍", 1.2)
}

if ability_choice in abilities:
    ability_name, ability_icon, power_multiplier = abilities[ability_choice]
    final_power = base_power * power_multiplier
else:
    ability_name, ability_icon, power_multiplier = "Bilinmeyen", "❓", 1.0
    final_power = base_power

# 5. Karakter kartı oluşturma
print("\\n" + "="*60)
print("🎴 KARAKTER KARTI 🎴")
print("="*60)
print(f"👤 Ad: {character_name}")
print(f"📺 Anime: {anime_series}")
print(f"🎂 Yaş: {age}")
print(f"✨ Özel Yetenek: {ability_name} {ability_icon}")
print(f"⚡ Güç Seviyesi: {final_power:.1f}")

# 6. Güç seviyesi değerlendirmesi
print("\\n📊 GÜÇ DEĞERLENDİRMESİ:")
if final_power >= 1000:
    rank = "🏆 Efsanevi"
    comment = "Bu karakter tüm evreni tehdit edebilir!"
elif final_power >= 700:
    rank = "💎 Süper Güçlü"
    comment = "Çok güçlü bir savaşçı!"
elif final_power >= 400:
    rank = "⭐ Güçlü"
    comment = "İyi bir seviyede!"
elif final_power >= 200:
    rank = "🌟 Ortalama"
    comment = "Gelişim potansiyeli var!"
else:
    rank = "🌱 Acemi"
    comment = "Antrenman zamanı!"

print(f"🏅 Seviye: {rank}")
print(f"💬 Yorum: {comment}")

# 7. Özel mesajlar
print("\\n🎊 ÖZEL MESAJLAR:")

if age < 18:
    print("🧒 Genç bir kahraman! Büyük potansiyeli var!")
elif age > 100:
    print("🧙 Yaşlı ve bilge bir savaşçı!")

if character_name.lower() in ["goku", "naruto", "luffy"]:
    print("🌟 Efsanevi bir isim seçtiniz!")

# 8. Karakter hikayesi önerisi
print("\\n📖 KARAKTERİNİZİN HİKAYESİ:")
story_templates = [
    f"{character_name}, {anime_series} evreninin en güçlü {ability_name.lower()}lerinden biridir.",
    f"{age} yaşındaki {character_name}, {ability_icon} gücüyle düşmanlarını alt eder.",
    f"Efsanevi {final_power:.0f} güç seviyesine sahip {character_name}, barışı korur."
]

for story in story_templates:
    print(f"✨ {story}")

# 9. İstatistikler
print("\\n📈 KARAKTER İSTATİSTİKLERİ:")
print(f"💪 Saldırı Gücü: {final_power * 0.8:.0f}")
print(f"🛡️ Savunma: {final_power * 0.6:.0f}")
print(f"⚡ Hız: {final_power * 0.7:.0f}")
print(f"🧠 Zeka: {base_power * 0.9:.0f}")
print(f"❤️ HP: {final_power * 2:.0f}")

# 10. Programın bitişi
print("\\n🎉 TEBRİKLER!")
print(f"'{character_name}' karakteriniz başarıyla yaratıldı!")
print("🚀 Python programlama serüveninize başladınız!")
print("\\n💡 İpucu: Bu kodu değiştirerek daha fazla özellik ekleyebilirsiniz!")

# 11. Bonus: Kod istatistikleri
print("\\n🤓 KOD İSTATİSTİKLERİ:")
print("📄 Kod satırı sayısı: ~100")
print("🔧 Kullanılan kavramlar: değişkenler, input, if-else, dictionary")
print("⏱️ Ortalama çalışma süresi: 30 saniye")
print("🎯 Zorluk seviyesi: Başlangıç")
\`\`\`

**🎮 Program Çıktısı Örneği:**

\`\`\`
🌟 ANIME KARAKTER YARATICISI 🌟
==================================================

📝 Karakterinizin bilgilerini girin:
🎌 Karakter adı: Akira Nakamura
📺 Hangi anime evreninden: My Hero Academia
🎂 Yaşı: 16

⚡ Akira Nakamura'in güç seviyesini belirleyelim:
🔥 Temel güç (1-1000): 650

🎯 Özel yetenek seçin:
1. Ateş Bükücü 🔥
2. Su Bükücü 💧
3. Hava Bükücü 💨
4. Toprak Bükücü 🌍
Seçiminiz (1-4): 1

============================================================
🎴 KARAKTER KARTI 🎴
============================================================
👤 Ad: Akira Nakamura
📺 Anime: My Hero Academia
🎂 Yaş: 16
✨ Özel Yetenek: Ateş Bükücü 🔥
⚡ Güç Seviyesi: 975.0

📊 GÜÇ DEĞERLENDİRMESİ:
🏅 Seviye: 💎 Süper Güçlü
💬 Yorum: Çok güçlü bir savaşçı!

🎊 ÖZEL MESAJLAR:
🧒 Genç bir kahraman! Büyük potansiyeli var!

📖 KARAKTERİNİZİN HİKAYESİ:
✨ Akira Nakamura, My Hero Academia evreninin en güçlü ateş bükücülerinden biridir.
✨ 16 yaşındaki Akira Nakamura, 🔥 gücüyle düşmanlarını alt eder.
✨ Efsanevi 975 güç seviyesine sahip Akira Nakamura, barışı korur.

📈 KARAKTER İSTATİSTİKLERİ:
💪 Saldırı Gücü: 780
🛡️ Savunma: 585
⚡ Hız: 683
🧠 Zeka: 585
❤️ HP: 1950

🎉 TEBRİKLER!
'Akira Nakamura' karakteriniz başarıyla yaratıldı!
🚀 Python programlama serüveninize başladınız!

💡 İpucu: Bu kodu değiştirerek daha fazla özellik ekleyebilirsiniz!
\`\`\`

**🎯 Bu Programdan Öğrenilenler:**

1. **📝 input() fonksiyonu**: Kullanıcıdan veri alma
2. **🔢 int() fonksiyonu**: String'i sayıya çevirme
3. **📊 Değişkenler**: Verileri saklama
4. **🎭 f-string formatlaması**: Güzel çıktılar
5. **🤔 if-elif-else**: Karar verme
6. **📚 Dictionary**: Veri organizasyonu
7. **🎨 String manipulasyonu**: Metin işlemleri
8. **🧮 Matematiksel işlemler**: Hesaplamalar

**🚀 Geliştirme Fikirleri:**

1. **Daha fazla yetenek ekleme**
2. **Karakter resmini ASCII art ile çizme**
3. **Dosyaya kaydetme özelliği**
4. **Karakter karşılaştırması**
5. **Seviye sistemi ekleme**
6. **Random karakter üretici**

**🎌 Anime Kültürü İpucu:**
Bu program anime karakteri yaratma sürecini simüle ediyor. Gerçek anime prodüksiyonunda da karakterler böyle detaylı planlanır!

**💻 Çalıştırma Talimatları:**
1. Kodu bir .py dosyasına kaydedin
2. Terminal/CMD açın
3. "python karakter_yaratici.py" çalıştırın
4. Eğlenin! 🎉

Bu program Python'un temellerini öğretirken aynı zamanda yaratıcılığınızı da geliştiriyor!
          `
        },

        next_steps: {
          title: "🗺️ Python Öğrenme Yol Haritası",
          content: `
**🎯 Python Ustası Olma Rehberi**

**📚 TEMEL SEVİYE (1-3 Ay)**

**1. Hafta 1-2: Temel Kavramlar**
• ✅ Python kurulumu ve ortam ayarları
• ✅ İlk program (Bu dersi tamamladınız!)
• 🔄 Değişkenler ve veri tipleri
• 🔄 Input/Output işlemleri
• 🔄 Temel operatörler

**Praktik Projeler:**
• Basit hesap makinesi
• Anime karakter bilgi sistemi
• Kullanıcı kayıt formu

**2. Hafta 3-4: Kontrol Yapıları**
• if-elif-else koşulları
• Karşılaştırma operatörleri
• Boolean mantığı
• İç içe koşullar

**Praktik Projeler:**
• Anime quiz oyunu
• Not hesaplama sistemi
• Basit metin tabanlı oyun

**3. Hafta 5-6: Döngüler**
• for döngüleri
• while döngüleri
• range() fonksiyonu
• break ve continue
• İç içe döngüler

**Praktik Projeler:**
• Çarpım tablosu
• Anime karakter listesi
• Şifre tahmin oyunu

**4. Hafta 7-8: Veri Yapıları**
• Listeler (append, remove, sort)
• Tuple'lar
• String metodları
• Slicing işlemleri

**Praktik Projeler:**
• Anime watchlist uygulaması
• Basit envanter sistemi
• Metin analiz aracı

**5. Hafta 9-10: Dictionary ve Set**
• Dictionary oluşturma ve kullanımı
• Anahtar-değer çiftleri
• Set işlemleri
• Dictionary comprehensions

**Praktik Projeler:**
• Anime karakter veritabanı
• Kelime sayacı
• Öğrenci not sistemi

**6. Hafta 11-12: Fonksiyonlar**
• Fonksiyon tanımlama
• Parametreler ve return
• Local/Global scope
• Lambda fonksiyonlar

**Praktik Projeler:**
• Güç hesaplayıcı kütüphanesi
• Matematiksel işlem modülü
• Karakter yaratım sistemi

**🚀 ORTA SEVİYE (3-6 Ay)**

**7. Hafta 13-16: İleri Fonksiyonlar**
• *args ve **kwargs
• Decorators
• Generator fonksiyonlar
• Closure kavramı

**8. Hafta 17-20: Nesne Yönelimli Programlama**
• Sınıf (Class) tanımlama
• Nesne (Object) oluşturma
• Inheritance (Kalıtım)
• Polymorphism
• Encapsulation

**Büyük Proje:** Anime Karakter Savaş Oyunu

**9. Hafta 21-24: Hata Yönetimi ve Dosya İşlemleri**
• try-except-finally
• Özel hata tipleri
• Dosya okuma/yazma
• JSON veri formatı
• CSV işlemleri

**Büyük Proje:** Anime Koleksiyon Yönetim Sistemi

**💎 İLERİ SEVİYE (6+ Ay)**

**10. Modüller ve Paketler**
• import sistemi
• Kendi modüllerinizi yaratma
• __init__.py dosyaları
• Paket dağıtımı

**11. Web Scraping**
• requests kütüphanesi
• BeautifulSoup
• Selenium
• Veri toplama

**Proje:** Anime sitelerinden veri toplama

**12. Veri Analizi**
• pandas kütüphanesi
• numpy ile hesaplamalar
• matplotlib ile grafikler
• Excel dosya işlemleri

**Proje:** Anime rating analizi

**13. Web Geliştirme**
• Flask framework
• HTML template'ları
• Database entegrasyonu
• RESTful API

**Büyük Proje:** Anime Öneri Web Sitesi

**14. GUI Geliştirme**
• tkinter (built-in)
• PyQt5/6
• Kivy (mobile)
• Olay tabanlı programlama

**Proje:** Anime koleksiyon masaüstü uygulaması

**🎖️ UZMAN SEVİYE (1+ Yıl)**

**15. Makine Öğrenmesi**
• scikit-learn
• TensorFlow/PyTorch
• Data preprocessing
• Model training

**Proje:** Anime önerme AI sistemi

**16. Otomasyon ve Scripting**
• Sistem yönetimi
• Email gönderimi
• Task scheduling
• API entegrasyonu

**17. Performans Optimizasyonu**
• Profiling ve debugging
• Async/await programlama
• Multiprocessing
• Code optimization

**🎯 HANGİ ALANA ODAKLANMALIYIM?**

**💻 Web Developer olmak istiyorsanız:**
HTML/CSS → JavaScript → Django/Flask → Database → Deploy

**📊 Data Scientist olmak istiyorsanız:**
Statistics → Pandas/NumPy → Matplotlib/Seaborn → Machine Learning → SQL

**🤖 AI Engineer olmak istiyorsanız:**
Mathematics → Machine Learning → Deep Learning → TensorFlow/PyTorch → Research

**🎮 Game Developer olmak istiyorsanız:**
Pygame → 3D Concepts → Game Engines → Graphics Programming

**🔧 Automation Engineer olmak istiyorsanız:**
Scripting → System Administration → DevOps Tools → Cloud Platforms

**📱 Mobile Developer olmak istiyorsanız:**
Kivy → Flutter (Dart) → React Native → Mobile Concepts

**📅 HAFTALIK ÇALIŞMA PROGRAMI**

**Pazartesi:** 1 saat teori + kod okuma
**Salı:** 1.5 saat hands-on coding
**Çarşamba:** 30 dk review + debug
**Perşembe:** 1 saat yeni konsept
**Cuma:** 1.5 saat proje çalışması
**Cumartesi:** 2 saat büyük proje
**Pazar:** 30 dk community + blog okuma

**TOPLAM:** 8 saat/hafta

**🎌 ANIME-TEMATIK PROJE ÖNERİLERİ**

**Başlangıç Seviyesi:**
• Anime karakter bilgi kartları
• Basit anime quiz oyunu
• Episode tracker
• Anime rating hesaplayıcı

**Orta Seviye:**
• Web scraping ile anime veritabanı
• Anime öneri sistemi
• Discord botu
• Anime wallpaper downloader

**İleri Seviye:**
• AI-powered anime karakter üretici
• Web-based anime streaming organizer
• Mobile anime tracker app
• Blockchain-based anime NFT sistem

**🏆 BAŞARI İÇİN İPUÇLARI**

**1. 📅 Düzenli Çalışın**
Her gün en az 30 dakika kod yazın

**2. 🛠️ Pratik Yapın**
Öğrendiğiniz her şeyi kod ile uygulayın

**3. 🐛 Hatalardan Korkmayın**
Her hata bir öğrenme fırsatıdır

**4. 👥 Toplulukla Bağlantı Kurun**
• r/Python (Reddit)
• Python Discord serverleri
• Local Python meetup'ları
• Stack Overflow

**5. 📚 Sürekli Öğrenin**
• Güncel blog'ları takip edin
• YouTube kanallarını izleyin
• Podcast'leri dinleyin
• Open source projelere katkı yapın

**6. 🎯 Projeli Öğrenin**
Teoriyi direkt pratiğe dökün

**🌟 MOTIVASYON İÇİN**

Python öğrenmek, anime izlemek gibidir:
• **İlk başta karmaşık gelir** (ilk episod)
• **Sabırla devam ederseniz eğlenceli hale gelir** 
• **Her yeni kavram bir power-up gibidir**
• **Sonunda amazing şeyler yapabilirsiniz!**

**🎖️ 6 AY SONRA YAPABİLECEKLERİNİZ:**
• Web siteleri geliştirmek
• Veri analizi yapmak
• Otomatik scriptler yazmak
• API'lar oluşturmak
• Basit AI modelleri eğitmek
• Discord botları yapmak

**🚀 1 YIL SONRA YAPABİLECEKLERİNİZ:**
• Professional web applications
• Machine learning projeleri
• Mobile app backend'leri
• Data science projeleri
• Automation frameworks
• Open source katkıları

**Remember:** *"Hokage olmak bir günde olmuyor, Python ustası olmak da!" - Naruto Uzumaki (Probably)* 😄

**📈 İlerleme Takibi:**
Bu rehberi takip ederek büyük rüyalarınızı gerçeğe dönüştürebilirsiniz!
          `
        },

        community_resources: {
          title: "🌐 Python Topluluğu ve Kaynaklar",
          content: `
**👥 PYTHON TOPLULUĞUNA KATILYIN!**

Python'un en büyük avantajlarından biri güçlü ve destekleyici topluluğudur. Milyonlarca geliştirici aynı hedefle bir araya gelmiş!

**🌍 KÜRESEL TOPLULUKLAR**

**1. 📱 Reddit Communities**
• **r/Python** (900k+ üye)
  - Günlük Python haberleri
  - Başlangıç dostu sorular
  - Proje paylaşımları
  
• **r/learnpython** (400k+ üye)
  - Sadece öğrenenler için
  - Homework help yasak değil!
  - Çok sabırlı ve yardımsever

• **r/MachineLearning** (2M+ üye)
  - AI/ML odaklı
  - Research papers
  - İleri seviye konular

**2. 💬 Discord Sunucuları**
• **Python Discord** (200k+ üye)
  - Canlı chat
  - Kod review
  - Career advice
  - Homework help kanalları

• **Programming Discord**
  - Çok dilli programlama
  - Code challenges
  - Portfolio review

**3. 🐦 Twitter'da Takip Edilecekler**
• **@gvanrossum** - Python'un yaratıcısı
• **@pypi** - Python Package Index
• **@realpython** - Öğrenme kaynakları
• **@planetpython** - Python haberleri
• **@pydanny** - Django uzmanı
• **@treyhunner** - Python trainer

**4. 📺 YouTube Kanalları**

**Türkçe:**
• **BilgisayarKavramları** - Python serisi
• **Kodland** - Python dersleri
• **Mert Mekatronik** - Proje tabanlı
• **Python Türkiye** - Community kanalı

**İngilizce:**
• **Corey Schafer** - En iyi Python channel
• **Tech With Tim** - Genç ve dinamik
• **Real Python** - Professional content
• **sentdex** - ML ve automation
• **Programming with Mosh** - Temiz anlatım

**📚 ÜCRETSİZ ÖĞRENME KAYNAKLARI**

**1. 📖 Online Kitaplar**
• **"Automate the Boring Stuff"** - Al Sweigart
  - Tamamen ücretsiz online
  - Pratiğe odaklı
  - Otomasyon projeleri

• **"Python for Everybody"** - Charles Severance
  - Coursera kursunun kitabı
  - PDF ücretsiz
  - Başlangıç dostu

• **"Dive Into Python 3"** - Mark Pilgrim
  - İleri seviye konular
  - Derinlemesine anlatım

**2. 🎓 Online Kurslar**

**Türkçe:**
• **BTK Akademi** - Ücretsiz Python kursu
• **Udemy Türkçe** - İndirimli kurslar
• **YouTube'da Atıl Samancıoğlu**
• **CodeCademy Türkçe** 

**İngilizce:**
• **freeCodeCamp** - Tamamen ücretsiz
• **Coursera** - Üniversite kursları
• **edX** - MIT, Harvard kursları
• **Python.org Tutorial** - Resmi dokümantasyon

**3. 🏁 İnteraktif Platformlar**
• **Codecademy** - Hands-on learning
• **HackerRank** - Coding challenges
• **LeetCode** - Algorithm problems
• **Codewars** - Kata challenges
• **Python Challenge** - Puzzle solving

**🇹🇷 TÜRK PYTHON TOPLULUĞU**

**1. 🌆 Şehir Toplulukları**
• **Python İstanbul** 
  - Aylık meetup'lar
  - Workshop'lar
  - Networking events

• **Ankara Python**
  - Akademik odaklı
  - Üniversite işbirlikleri

• **İzmir Python**
  - Genç ve dinamik topluluk

• **Python Türkiye**
  - Online topluluk
  - Telegram grubu aktif

**2. 📅 Etkinlikler**
• **PyCon Turkey** - Yıllık konferans
• **Django meetup'ları**
• **Machine Learning meetup'ları**
• **Open Source Saturday'ler**

**3. 💼 İş İmkanları**
• **Kariyer.net** - Python developer
• **LinkedIn** - Networking
• **Toptal** - Freelance
• **Remote Year** - Uzaktan çalışma

**🛠️ GELİŞTİRME ARAÇLARI**

**1. 💻 Online Code Editors**
• **Repl.it** - Instant coding
• **Trinket** - Educational focus
• **CodePen** - Web development
• **Jupyter Notebook** - Data science
• **Google Colab** - Free GPU for ML

**2. 📱 Mobile Apps**
• **SoloLearn** - Gamified learning
• **Programming Hero** - Interactive
• **Encode** - Bite-sized lessons
• **Grasshopper** - Google'ın uygulaması

**3. 🎮 Coding Games**
• **CodeCombat** - RPG style learning
• **CheckiO** - Python challenges
• **CodinGame** - Game-based problems
• **Screeps** - Programming game

**📊 VERİ BİLİMİ KAYNAKLARI**

**1. 📈 Datasets**
• **Kaggle** - Competitions + datasets
• **UCI ML Repository** - Classic datasets
• **Google Dataset Search** - Arama motoru
• **AWS Open Data** - Public datasets

**2. 📓 Jupyter Resources**
• **Jupyter.org** - Resmi site
• **nbviewer** - Notebook görüntüleyici
• **JupyterLab** - Next-gen interface
• **Binder** - Share interactive notebooks

**🤖 YAPAY ZEKA KAYNAKLARI**

**1. 🧠 ML/AI Courses**
• **Fast.ai** - Practical deep learning
• **Andrew Ng's ML Course** - Theoretical
• **Deep Learning Specialization**
• **CS231n Stanford** - Computer vision

**2. 🔬 Research Papers**
• **arXiv.org** - Latest research
• **Papers With Code** - Implementation
• **Google Scholar** - Academic search
• **Towards Data Science** - Medium publication

**🎌 ANIME TEMASLI PROJELER**

**1. 🗃️ Anime Datasets**
• **MyAnimeList API** - Anime bilgileri
• **AniDB** - Comprehensive database
• **Anime News Network** - News API
• **Kitsu API** - Modern anime API

**2. 🎨 Creative Projects**
• **Anime face generator** (GAN)
• **Style transfer** (Neural style)
• **Subtitle translator**
• **Episode tracker**
• **Recommendation engine**

**💡 PROJE FİKİRLERİ**

**Başlangıç Seviyesi:**
• Anime karakter quiz'i
• Episode tracker
• Simple recommendation
• Character stats calculator

**Orta Seviye:**
• Web scraping anime sites
• Discord bot for anime
• Mobile app for tracking
• Data visualization

**İleri Seviye:**
• AI-powered recommender
• Real-time subtitle translation
• Anime style transfer
• Character generation with AI

**🏆 PORTFOLIO GELİŞTİRME**

**1. 📂 GitHub Profile**
• Pinned repositories
• README.md optimization
• Contribution graph
• Open source contributions

**2. 🌐 Personal Website**
• Portfolio projelerinizi sergileyin
• Blog yazıları yazın
• CV/Resume ekleyin
• Contact form

**3. 📝 Technical Writing**
• Medium'da makale yazın
• Dev.to'da paylaşımlar yapın
• Kendi blog'unuzu başlatın
• Tutorial'lar hazırlayın

**🎯 KARİYER HEDEFLERİ**

**6 Ay Sonra:**
• Junior Developer başvuruları
• Freelance projeler
• Open source katkıları
• Personal projects

**1 Yıl Sonra:**
• Mid-level developer pozisyonları
• Specialized roles (ML, Web, etc.)
• Tech lead aspirations
• Conference talks

**🔗 ÖNEMLİ LİNKLER**

• **Python.org** - python.org
• **PyPI** - pypi.org
• **Real Python** - realpython.com
• **Planet Python** - planetpython.org
• **Python Weekly** - pythonweekly.com
• **Talk Python Podcast** - talkpython.fm

**📞 ACİL YARDIM**

**Stack Overflow'da soru sorarken:**
1. Problemi açık açık belirtin
2. Minimal kod örneği verin
3. Ne denediğinizi açıklayın
4. Beklenen vs gerçek sonuç
5. Tag'leri doğru kullanın

**🌟 TOPLULUK KURALLARI**

1. **Saygılı olun** - Herkes öğreniyor
2. **Arama yapın** - Belki daha önce sorulmuş
3. **Kod paylaşın** - Text olarak, screenshot değil
4. **Teşekkür edin** - Yardım edenler gönüllü
5. **Geri verin** - Öğrendikçe başkalarına yardım edin

**💪 MOTİVASYON**

*"Programlama öğrenmek anime izlemek gibi - ilk başta karmaşık gelir, ama sonra bağımlılık yapar!"*

Python topluluğu sizi bekliyor! Katılın, öğrenin, paylaşın ve birlikte büyüyün! 🚀
          `
        }
      }
    },
    difficulty: 1,
    duration: 90,
    category: "comprehensive",
    type: "theory_interactive",
    diamondReward: 100,
    experienceReward: 200,
    order: 1,
    isPublished: true,
    learningObjectives: [
      "🐍 Python'un tarihini ve felsefesini anlama",
      "🎯 Python'un kullanım alanlarını keşfetme", 
      "⚡ Python'un avantajlarını ve özelliklerini öğrenme",
      "💻 Geliştirme ortamını kurma ve yapılandırma",
      "🎮 İlk interaktif Python programını yazma",
      "🗺️ Python öğrenme yol haritasını planlama",
      "👥 Python topluluğuna katılma ve kaynaklara erişim",
      "🚀 Programlama kariyeri için temel atma"
    ],
    practicalExercise: {
      description: "🎮 Kendi Anime Evreninizi Yaratın! - Kapsamlı Python Uygulaması",
      starterCode: `# 🌟 ANIME EVRENİ YARATICISI 🌟
# Bu proje ile Python'un temellerini öğrenirken kendi anime evreninizi yaratacaksınız!

print("🌟 ANIME EVRENİ YARATICISI 🌟")
print("=" * 50)

# TODO 1: Evren bilgilerini alalım
print("\\n🌍 Anime evreninizin bilgilerini girin:")
universe_name = input("🎌 Evren adı: ")
universe_type = input("🎭 Evren türü (fantasy/sci-fi/modern/historical): ")
main_power = input("⚡ Ana güç sistemi (chakra/magic/technology/martial arts): ")

# TODO 2: Ana karakteri oluşturalım
print(f"\\n👤 {universe_name} evreninin ana karakterini oluşturun:")
hero_name = input("🦸 Kahraman adı: ")
hero_age = int(input("🎂 Yaşı: "))
hero_goal = input("🎯 Ana hedefi: ")

# TODO 3: Güç seviyesi sistemi
print(f"\\n⚡ {hero_name}'in başlangıç güçlerini belirleyin:")
strength = int(input("💪 Fiziksel güç (1-100): "))
intelligence = int(input("🧠 Zeka (1-100): "))
speed = int(input("⚡ Hız (1-100): "))
magic = int(input("✨ Büyü/Özel güç (1-100): "))

# TODO 4: Rakip karakter oluşturma
print("\\n😈 Ana kötü karakteri oluşturun:")
villain_name = input("👹 Kötü karakter adı: ")
villain_power = int(input("🔥 Güç seviyesi (1-1000): "))

# TODO 5: Destekçi karakterleri ekleme
print("\\n👥 Destekçi karakterleri ekleyin:")
ally_count = int(input("👫 Kaç tane destekçi karakter? (1-5): "))

allies = []
for i in range(ally_count):
    ally_name = input(f"👤 {i+1}. destekçi karakterin adı: ")
    ally_specialty = input(f"🎯 {ally_name}'in özelliği: ")
    allies.append({"name": ally_name, "specialty": ally_specialty})

# TODO 6: Evren kurallarını oluşturma
print("\\n📜 Evren kurallarını belirleyin:")
power_source = input("🔋 Güç nereden geliyor: ")
weakness = input("😰 Ana zayıflık/kısıtlama: ")
special_rule = input("🌟 Özel kural/sistem: ")

# TODO 7: Hikaye öğeleri
print("\\n📚 Hikaye öğeleri:")
main_location = input("🏰 Ana mekan: ")
sacred_object = input("💎 Kutsal/önemli obje: ")
prophecy = input("🔮 Kehanet/gelecek vizyonu: ")

# TODO 8: Hesaplamalar ve analizler
hero_total_power = strength + intelligence + speed + magic
power_balance = hero_total_power / villain_power if villain_power > 0 else 1

# TODO 9: Sonuç raporu oluşturma
print("\\n" + "="*60)
print("🎊 ANIME EVRENİNİZ YARATILDI! 🎊")
print("="*60)

print(f"\\n🌍 EVREN BİLGİLERİ:")
print(f"📖 Evren Adı: {universe_name}")
print(f"🎭 Tür: {universe_type.title()}")
print(f"⚡ Güç Sistemi: {main_power.title()}")
print(f"🔋 Güç Kaynağı: {power_source}")
print(f"😰 Ana Zayıflık: {weakness}")
print(f"🌟 Özel Kural: {special_rule}")

print(f"\\n👤 ANA KARAKTER:")
print(f"🦸 Ad: {hero_name}")
print(f"🎂 Yaş: {hero_age}")
print(f"🎯 Hedef: {hero_goal}")
print(f"💪 Fiziksel Güç: {strength}/100")
print(f"🧠 Zeka: {intelligence}/100")
print(f"⚡ Hız: {speed}/100")
print(f"✨ Özel Güç: {magic}/100")
print(f"📊 Toplam Güç: {hero_total_power}/400")

# Güç seviyesi değerlendirmesi
if hero_total_power >= 350:
    power_rank = "🏆 Efsanevi"
elif hero_total_power >= 280:
    power_rank = "💎 Çok Güçlü"
elif hero_total_power >= 200:
    power_rank = "⭐ Güçlü"
elif hero_total_power >= 120:
    power_rank = "🌟 Ortalama"
else:
    power_rank = "🌱 Gelişim Aşamasında"

print(f"🏅 Güç Derecesi: {power_rank}")

print(f"\\n😈 ANA KÖTÜ KARAKTER:")
print(f"👹 Ad: {villain_name}")
print(f"🔥 Güç Seviyesi: {villain_power}/1000")

# Savaş analizi
if power_balance > 1.2:
    battle_prediction = "🎉 Kahraman kolay kazanır!"
elif power_balance > 0.8:
    battle_prediction = "��️ Dengeli bir savaş olacak!"
else:
    battle_prediction = "😰 Kahraman daha güçlü olmalı!"

print(f"⚔️ Savaş Tahmini: {battle_prediction}")

print(f"\\n👥 DESTEKÇİ KARAKTERLER:")
for i, ally in enumerate(allies, 1):
    print(f"  {i}. {ally['name']} - {ally['specialty']}")

print(f"\\n🗺️ EVREN DETAYLARI:")
print(f"🏰 Ana Mekan: {main_location}")
print(f"💎 Önemli Obje: {sacred_object}")
print(f"🔮 Kehanet: {prophecy}")

# TODO 10: Hikaye önerisi oluşturma
print(f"\\n📖 HİKAYE ÖNERİSİ:")
story_template = f'''
🌟 {universe_name} evreninde, {hero_age} yaşındaki {hero_name} "{hero_goal}" hedefi için mücadele ediyor.

⚡ {main_power} gücünü kullanarak, {strength} fiziksel güç, {intelligence} zeka, {speed} hız ve {magic} özel güç ile donanmış olan {hero_name}, 
{villain_name} adlı kötü karakterle karşı karşıya geliyor.

👥 {len(allies)} tane sadık arkadaşı ile birlikte, {main_location} bölgesinde maceraya atılıyor.

💎 Efsanevi {sacred_object} nesnesini bularak, "{prophecy}" kehanetini gerçekleştirmeye çalışıyor.

⚠️ Ancak {weakness} zayıflığı ve {special_rule} kuralı nedeniyle işler hiç de kolay değil!
'''

print(story_template)

# TODO 11: İstatistikler
print(f"\\n📊 PROJE İSTATİSTİKLERİ:")
print(f"📝 Yaratılan Karakter Sayısı: {len(allies) + 2}")
print(f"🎯 Kullanılan Python Kavramları: input(), int(), print(), f-string, list, dict, for loop, if-else")
print(f"⏱️ Tahmini Tamamlanma Süresi: 5-10 dakika")
print(f"🎮 Eğlence Seviyesi: 10/10!")

# TODO 12: Gelecek geliştirme önerileri
print(f"\\n🚀 GELİŞTİRME ÖNERİLERİ:")
print("1. 💾 Karakterleri dosyaya kaydetme")
print("2. 🎲 Rastgele event üretimi")
print("3. ⚔️ Savaş simulasyonu")
print("4. 🎨 ASCII art karakterler")
print("5. 🌐 Web arayüzü ekleme")

print(f"\\n🎉 TEBRİKLER!")
print(f"Python ile ilk büyük projenizi tamamladınız!")
print(f"🐍 Python serüveniniz başladı! 🚀")

# Bonus: Kodlama istatistikleri
total_lines = "~150"
concepts_used = ["Variables", "Input/Output", "Data Types", "Lists", "Dictionaries", "Loops", "Conditionals", "String Formatting"]

print(f"\\n🤓 KOD ANALİZİ:")
print(f"📄 Kod Satır Sayısı: {total_lines}")
print(f"🔧 Kullanılan Kavramlar: {', '.join(concepts_used)}")
print(f"⭐ Zorluk Seviyesi: Başlangıç-Orta")
print(f"🎓 Öğrenme Değeri: Çok Yüksek!")`,
      solution: `# 🌟 ANIME EVRENİ YARATICISI - ÇÖZÜM 🌟

print("🌟 ANIME EVRENİ YARATICISI 🌟")
print("=" * 50)

# 1. Evren bilgilerini alma
print("\\n🌍 Anime evreninizin bilgilerini girin:")
universe_name = input("🎌 Evren adı: ") or "My Hero Academia"
universe_type = input("🎭 Evren türü (fantasy/sci-fi/modern/historical): ") or "modern"
main_power = input("⚡ Ana güç sistemi (chakra/magic/technology/martial arts): ") or "quirks"

# 2. Ana karakter oluşturma
print(f"\\n👤 {universe_name} evreninin ana karakterini oluşturun:")
hero_name = input("🦸 Kahraman adı: ") or "Deku"
hero_age = int(input("🎂 Yaşı: ") or "16")
hero_goal = input("🎯 Ana hedefi: ") or "Number 1 Hero olmak"

# 3. Güç seviyesi sistemi
print(f"\\n⚡ {hero_name}'in başlangıç güçlerini belirleyin:")
strength = int(input("💪 Fiziksel güç (1-100): ") or "75")
intelligence = int(input("🧠 Zeka (1-100): ") or "90")
speed = int(input("⚡ Hız (1-100): ") or "70")
magic = int(input("✨ Büyü/Özel güç (1-100): ") or "85")

# 4. Rakip karakter
print("\\n😈 Ana kötü karakteri oluşturun:")
villain_name = input("👹 Kötü karakter adı: ") or "All For One"
villain_power = int(input("🔥 Güç seviyesi (1-1000): ") or "950")

# 5. Destekçi karakterleri
print("\\n👥 Destekçi karakterleri ekleyin:")
ally_count = int(input("👫 Kaç tane destekçi karakter? (1-5): ") or "3")

allies = []
default_allies = [
    {"name": "Bakugo", "specialty": "Explosion Quirk"},
    {"name": "Todoroki", "specialty": "Ice and Fire"},
    {"name": "Iida", "specialty": "Super Speed"}
]

for i in range(ally_count):
    if i < len(default_allies):
        ally_name = input(f"👤 {i+1}. destekçi karakterin adı: ") or default_allies[i]["name"]
        ally_specialty = input(f"🎯 {ally_name}'in özelliği: ") or default_allies[i]["specialty"]
    else:
        ally_name = input(f"👤 {i+1}. destekçi karakterin adı: ") or f"Ally {i+1}"
        ally_specialty = input(f"🎯 {ally_name}'in özelliği: ") or "Special Ability"
    
    allies.append({"name": ally_name, "specialty": ally_specialty})

# 6. Evren kuralları
print("\\n📜 Evren kurallarını belirleyin:")
power_source = input("🔋 Güç nereden geliyor: ") or "Doğuştan gelen quirk"
weakness = input("😰 Ana zayıflık/kısıtlama: ") or "Aşırı kullanımda vücut zarar görür"
special_rule = input("🌟 Özel kural/sistem: ") or "Quirk toplumda %80 oranında var"

# 7. Hikaye öğeleri
print("\\n📚 Hikaye öğeleri:")
main_location = input("🏰 Ana mekan: ") or "UA High School"
sacred_object = input("💎 Kutsal/önemli obje: ") or "One For All"
prophecy = input("🔮 Kehanet/gelecek vizyonu: ") or "Yeni nesil en güçlü kahramanlar olacak"

# 8. Hesaplamalar
hero_total_power = strength + intelligence + speed + magic
power_balance = hero_total_power / villain_power if villain_power > 0 else 1

# 9. Sonuç raporu
print("\\n" + "="*60)
print("🎊 ANIME EVRENİNİZ YARATILDI! 🎊")
print("="*60)

print(f"\\n🌍 EVREN BİLGİLERİ:")
print(f"📖 Evren Adı: {universe_name}")
print(f"🎭 Tür: {universe_type.title()}")
print(f"⚡ Güç Sistemi: {main_power.title()}")
print(f"🔋 Güç Kaynağı: {power_source}")
print(f"😰 Ana Zayıflık: {weakness}")
print(f"🌟 Özel Kural: {special_rule}")

print(f"\\n👤 ANA KARAKTER:")
print(f"🦸 Ad: {hero_name}")
print(f"🎂 Yaş: {hero_age}")
print(f"🎯 Hedef: {hero_goal}")
print(f"💪 Fiziksel Güç: {strength}/100")
print(f"🧠 Zeka: {intelligence}/100")
print(f"⚡ Hız: {speed}/100")
print(f"✨ Özel Güç: {magic}/100")
print(f"📊 Toplam Güç: {hero_total_power}/400")

# Güç derecesi
if hero_total_power >= 350:
    power_rank = "🏆 Efsanevi"
    power_comment = "Bu karakter evreni kurtarabilir!"
elif hero_total_power >= 280:
    power_rank = "💎 Çok Güçlü"
    power_comment = "Professional hero seviyesinde!"
elif hero_total_power >= 200:
    power_rank = "⭐ Güçlü"
    power_comment = "İyi bir hero adayı!"
elif hero_total_power >= 120:
    power_rank = "🌟 Ortalama"
    power_comment = "Antrenmanla gelişebilir!"
else:
    power_rank = "🌱 Gelişim Aşamasında"
    power_comment = "Çok çalışması gerekiyor!"

print(f"🏅 Güç Derecesi: {power_rank}")
print(f"💬 Değerlendirme: {power_comment}")

print(f"\\n😈 ANA KÖTÜ KARAKTER:")
print(f"👹 Ad: {villain_name}")
print(f"🔥 Güç Seviyesi: {villain_power}/1000")

# Savaş analizi
if power_balance > 1.2:
    battle_prediction = "🎉 Kahraman kolay kazanır!"
    battle_advice = "Güvenle savaşabilir!"
elif power_balance > 0.8:
    battle_prediction = "⚔️ Dengeli bir savaş olacak!"
    battle_advice = "Stratejik düşünmeli!"
else:
    battle_prediction = "😰 Kahraman daha güçlü olmalı!"
    battle_advice = "Daha fazla antrenman gerekli!"

print(f"⚔️ Savaş Tahmini: {battle_prediction}")
print(f"💡 Tavsiye: {battle_advice}")

print(f"\\n👥 DESTEKÇİ KARAKTERLER:")
for i, ally in enumerate(allies, 1):
    print(f"  {i}. {ally['name']} - {ally['specialty']}")

print(f"\\n🗺️ EVREN DETAYLARI:")
print(f"🏰 Ana Mekan: {main_location}")
print(f"💎 Önemli Obje: {sacred_object}")
print(f"🔮 Kehanet: {prophecy}")

# 10. Hikaye önerisi
print(f"\\n📖 HİKAYE ÖNERİSİ:")
story_template = f'''
🌟 {universe_name} evreninde, {hero_age} yaşındaki {hero_name} "{hero_goal}" hedefi için mücadele ediyor.

⚡ {main_power} gücünü kullanarak, {strength} fiziksel güç, {intelligence} zeka, {speed} hız ve {magic} özel güç ile donanmış olan {hero_name}, 
{villain_name} adlı kötü karakterle karşı karşıya geliyor.

👥 {len(allies)} tane sadık arkadaşı ile birlikte, {main_location} bölgesinde maceraya atılıyor.

💎 Efsanevi {sacred_object} nesnesini bularak, "{prophecy}" kehanetini gerçekleştirmeye çalışıyor.

⚠️ Ancak {weakness} zayıflığı ve {special_rule} kuralı nedeniyle işler hiç de kolay değil!

🎬 İlk bölümde {hero_name}, arkadaşları {', '.join([ally['name'] for ally in allies[:2]])} ile tanışıyor.
Onların {allies[0]['specialty'] if allies else 'özel güçleri'} sayesinde ilk zorlukları aşıyor.

⚔️ Orta sezonlarda {villain_name} ile ilk karşılaşma gerçekleşiyor. 
Güç farkı: {power_balance:.2f} - {battle_advice}

🏆 Final sezonunda, {sacred_object} gücüyle birleşen {hero_name}, 
"{prophecy}" kehanetini gerçekleştirerek evreni kurtarıyor!
'''

print(story_template)

# 11. Detaylı analiz
print(f"\\n📊 DETAYLI ANALİZ:")
print(f"📝 Toplam Karakter: {len(allies) + 2}")
print(f"🎯 Evren Kompleksitesi: {'Yüksek' if len(allies) > 3 else 'Orta' if len(allies) > 1 else 'Basit'}")
print(f"⚔️ Güç Dengesi: {'Dengeli' if 0.8 <= power_balance <= 1.2 else 'Dengesiz'}")
print(f"🎭 Hikaye Potansiyeli: {'Çok Yüksek' if hero_total_power > 250 and len(allies) > 2 else 'Yüksek'}")

# 12. Karakter gelişim önerisi
print(f"\\n📈 KARAKTER GELİŞİM ÖNERİSİ:")
if strength < 60:
    print("💪 Fiziksel antrenman yapmalı")
if intelligence < 70:
    print("🧠 Strateji ve taktik geliştirmeli")
if speed < 65:
    print("⚡ Hız antrenmanı yapmalı")
if magic < 75:
    print("✨ Özel gücünü daha iyi kontrol etmeli")

# 13. Yan karakter önerileri
print(f"\\n👥 YAN KARAKTER ÖNERİLERİ:")
suggested_characters = [
    "🧙 Mentor karakter (tecrübeli eski hero)",
    "🤝 Rakip arkadaş (friendly competition)",
    "😈 Ara boss (ana kötüden önce)",
    "💕 Romantic interest",
    "🤖 Comic relief karakter"
]

for suggestion in suggested_characters:
    print(f"  • {suggestion}")

# 14. Episode planı
print(f"\\n📺 EPISODE PLAN ÖNERİSİ:")
episodes = [
    f"1. {hero_name}'in Başlangıcı - Güçlerini keşfediyor",
    f"2. İlk Arkadaşlık - {allies[0]['name'] if allies else 'Ilk arkadaş'} ile tanışma",
    f"3. {main_location} Keşfi - Ana mekana varış",
    f"4. İlk Sınav - Yetenekleri test etme",
    f"5. {sacred_object} Efsanesi - Önemli obje hakkında bilgi",
    f"6-10. Antrenman Arkı - Güçleri geliştirme",
    f"11-15. {villain_name} Tehdidi - Ana kötü ortaya çıkıyor",
    f"16-20. Final Savaşı - Büyük karşılaşma",
    f"21-25. Yeni Başlangıç - {prophecy} gerçekleşiyor"
]

for episode in episodes:
    print(f"  📺 {episode}")

# 15. Final istatistikler
print(f"\\n🎉 TEBRİKLER! PROJE TAMAMLANDI!")
print(f"🐍 Python Kavramları Kullanıldı:")
concepts = ["✅ Variables", "✅ Input/Output", "✅ Data Types", "✅ Lists", "✅ Dictionaries", 
           "✅ Loops", "✅ Conditionals", "✅ String Formatting", "✅ Mathematical Operations"]
for concept in concepts:
    print(f"  {concept}")

print(f"\\n📊 PROJE İSTATİSTİKLERİ:")
print(f"📄 Kod Satırı: ~200")
print(f"⏱️ Çalışma Süresi: 10-15 dakika")
print(f"🎓 Öğrenme Seviyesi: Başlangıç ✅")
print(f"🎮 Eğlence Faktörü: 10/10 🌟")
print(f"🚀 Python Yolculuğu: Başarıyla Başladı! 🎊")`,
      testCases: [
        {
          description: "🌍 Evren bilgileri doğru şekilde alınmalı",
          test: "assert 'universe_name' in locals() and universe_name.strip() != ''",
        },
        {
          description: "👤 Ana karakter özellikleri tanımlanmalı",
          test: "assert 'hero_name' in locals() and 'hero_age' in locals() and isinstance(hero_age, int)",
        },
        {
          description: "⚡ Güç sistemi hesaplamaları yapılmalı",
          test: "assert 'hero_total_power' in locals() and hero_total_power > 0",
        },
        {
          description: "👥 Destekçi karakterler listesi oluşturulmalı",
          test: "assert 'allies' in locals() and isinstance(allies, list) and len(allies) > 0",
        },
        {
          description: "📊 Güç analizi ve karşılaştırma yapılmalı",
          test: "assert 'power_balance' in locals() and 'battle_prediction' in locals()",
        },
        {
          description: "📖 Hikaye önerisi oluşturulmalı",
          test: "assert 'story_template' in locals() and len(story_template) > 100",
        },
        {
          description: "🎊 Tebrik mesajı gösterilmeli",
          test: "assert 'TEBRİKLER' in output and 'YARATILDI' in output",
        },
        {
          description: "🤓 Kod analizi bilgileri verilmeli",
          test: "assert 'İSTATİSTİK' in output or 'ANALİZ' in output",
        }
      ]
    },
    hints: [
      "🎮 Default değerler kullanarak test etmeyi kolaylaştırın",
      "💡 F-string formatlaması ile güzel çıktılar oluşturun",
      "🎯 Kullanıcı girdilerini kontrol edin (boş değer durumları)",
      "🎨 Emoji kullanarak çıktıları daha görsel hale getirin",
      "📊 Hesaplamalarda matematiksel operatörleri kullanın",
      "🎭 Koşullu ifadelerle farklı senaryolar oluşturun",
      "📚 List ve dictionary yapılarını etkin kullanın",
      "🔄 Loop'lar ile tekrarlayan işlemleri otomatikleştirin"
    ]
  }
];

// =============================================
// QUİZ SORULARI - HER DERS İÇİN 10+ SORU
// =============================================

const quizData = [
  {
    lessonId: "python_lesson_001",
    questions: [
      // Temel Python Tarihi ve Felsefe Soruları
      {
        type: "multiple_choice",
        question: "Python programlama dili ne zaman yaratılmaya başlandı?",
        options: ["1987", "1989", "1991", "1995"],
        correctAnswer: "1989",
        explanation: "Python, 1989 yılında Guido van Rossum tarafından Noel tatilinde yaratılmaya başlandı.",
        points: 10,
        difficulty: "easy",
        category: "history"
      },
      
      {
        type: "multiple_choice", 
        question: "Python'un yaratıcısı kimdir?",
        options: ["Linus Torvalds", "Guido van Rossum", "Dennis Ritchie", "Bjarne Stroustrup"],
        correctAnswer: "Guido van Rossum",
        explanation: "Python'un yaratıcısı Hollandalı programcı Guido van Rossum'dur.",
        points: 10,
        difficulty: "easy",
        category: "history"
      },

      {
        type: "multiple_choice",
        question: "Python isminin geldiği kaynak nedir?",
        options: ["Piton yılanı", "Monty Python comedy grubu", "Python mitolojisi", "Pythagoras teoremi"],
        correctAnswer: "Monty Python comedy grubu",
        explanation: "Guido van Rossum, Python ismini İngiliz komedi grubu 'Monty Python's Flying Circus'tan almıştır.",
        points: 15,
        difficulty: "medium",
        category: "history"
      },

      {
        type: "true_false",
        question: "Python 3.0, Python 2.0 ile tamamen uyumludur.",
        correctAnswer: false,
        explanation: "Python 3.0, Python 2.0 ile geriye dönük uyumlu değildir. Bu büyük bir değişiklikti.",
        points: 10,
        difficulty: "medium",
        category: "versions"
      },

      {
        type: "multiple_choice",
        question: "Python'un 'Zen of Python' felsefesine göre, hangisi en önemli prensiptir?",
        options: ["Hız her şeyden önemlidir", "Okunabilirlik önemlidir", "Kısa kod her zaman iyidir", "Karmaşık çözümler daha güçlüdür"],
        correctAnswer: "Okunabilirlik önemlidir",
        explanation: "'Readability counts' - Okunabilirlik Python felsefesinin temel taşlarından biridir.",
        points: 10,
        difficulty: "easy",
        category: "philosophy"
      },

      // Python Özellikleri ve Avantajları
      {
        type: "multiple_choice",
        question: "Python'un en büyük avantajlarından biri nedir?",
        options: ["En hızlı programlama dilidir", "Kolay öğrenilir ve okunabilir", "Sadece web geliştirme için kullanılır", "Compile edilmeden çalışamaz"],
        correctAnswer: "Kolay öğrenilir ve okunabilir",
        explanation: "Python'un basit syntax'ı ve okunabilirliği onu öğrenmeyi kolay hale getirir.",
        points: 10,
        difficulty: "easy",
        category: "features"
      },

      {
        type: "true_false",
        question: "Python interpreted (yorumlanan) bir dildir.",
        correctAnswer: true,
        explanation: "Python interpreted bir dildir, yani kod satır satır yorumlanarak çalıştırılır.",
        points: 10,
        difficulty: "easy",
        category: "features"
      },

      {
        type: "multiple_choice",
        question: "Python'da kod blokları nasıl belirlenir?",
        options: ["Süslü parantezler {}", "Girinti (indentation)", "BEGIN/END anahtar kelimeleri", "Noktalı virgül"],
        correctAnswer: "Girinti (indentation)",
        explanation: "Python'da kod blokları girinti (indentation) ile belirlenir, bu da kodu daha okunabilir yapar.",
        points: 15,
        difficulty: "medium",
        category: "syntax"
      },

      {
        type: "multiple_choice",
        question: "Aşağıdakilerden hangisi Python'un kullanım alanlarından BİRİ DEĞİLDİR?",
        options: ["Web Development", "Data Science", "Machine Learning", "Real-time embedded systems"],
        correctAnswer: "Real-time embedded systems",
        explanation: "Python interpreted yapısı nedeniyle gerçek zamanlı embedded sistemler için uygun değildir.",
        points: 15,
        difficulty: "hard",
        category: "usage"
      },

      // Kurulum ve Geliştirme Ortamı
      {
        type: "multiple_choice",
        question: "Python kurulumunda PATH'e ekleme neden önemlidir?",
        options: ["Daha hızlı çalışır", "Herhangi bir dizinden python komutunu çalıştırabilmek için", "Daha az bellek kullanır", "Daha güvenli olur"],
        correctAnswer: "Herhangi bir dizinden python komutunu çalıştırabilmek için",
        explanation: "PATH'e eklenmezse, Python'u sadece kurulduğu dizinden çalıştırabilirsiniz.",
        points: 10,
        difficulty: "medium",
        category: "installation"
      },

      {
        type: "multiple_choice",
        question: "pip nedir?",
        options: ["Python interpreter", "Package installer for Python", "Python IDE", "Python compiler"],
        correctAnswer: "Package installer for Python",
        explanation: "pip, Python paketlerini yüklemek ve yönetmek için kullanılan araçtır.",
        points: 10,
        difficulty: "easy",
        category: "tools"
      },

      {
        type: "true_false",
        question: "Virtual environment (sanal ortam) kullanmak Python projelerinde önerilir.",
        correctAnswer: true,
        explanation: "Virtual environment farklı projeler için farklı paket versiyonları kullanmanızı sağlar.",
        points: 10,
        difficulty: "medium",
        category: "best_practices"
      },

      // İlk Program ve Temel Kavramlar
      {
        type: "multiple_choice",
        question: "Python'da ekrana yazı yazdırmak için hangi fonksiyon kullanılır?",
        options: ["write()", "display()", "print()", "output()"],
        correctAnswer: "print()",
        explanation: "print() fonksiyonu Python'da ekrana yazı yazdırmak için kullanılır.",
        points: 5,
        difficulty: "easy",
        category: "basic_syntax"
      },

      {
        type: "multiple_choice",
        question: "Aşağıdaki Python kodunun çıktısı nedir?\n\nprint('Merhaba ' + 'Dünya!')",
        options: ["Merhaba + Dünya!", "Merhaba Dünya!", "Syntax Error", "Merhaba  Dünya!"],
        correctAnswer: "Merhaba Dünya!",
        explanation: "String concatenation ile 'Merhaba ' ve 'Dünya!' birleşerek 'Merhaba Dünya!' çıktısını verir.",
        points: 10,
        difficulty: "easy",
        category: "basic_syntax"
      },

      {
        type: "multiple_choice",
        question: "Python'da yorum (comment) satırı nasıl yazılır?",
        options: ["// yorum", "/* yorum */", "# yorum", "<!-- yorum -->"],
        correctAnswer: "# yorum",
        explanation: "Python'da tek satır yorumlar # işareti ile başlar.",
        points: 10,
        difficulty: "easy",
        category: "basic_syntax"
      },

      // Gelecek ve Kariyer
      {
        type: "multiple_choice",
        question: "2024 yılı itibarıyla Python'un en popüler kullanım alanı hangisidir?",
        options: ["Game Development", "Data Science & AI", "Mobile Development", "System Programming"],
        correctAnswer: "Data Science & AI",
        explanation: "Python, AI/ML kütüphanelerinin zenginliği sayesinde veri bilimi alanında lider konumdadır.",
        points: 10,
        difficulty: "medium",
        category: "trends"
      },

      {
        type: "true_false",
        question: "Python öğrenmek, programlama kariyeri için iyi bir başlangıçtır.",
        correctAnswer: true,
        explanation: "Python'un kolay syntax'ı ve geniş kullanım alanları onu mükemmel bir başlangıç dili yapar.",
        points: 5,
        difficulty: "easy",
        category: "career"
      },

      {
        type: "multiple_choice",
        question: "Hangi büyük teknoloji şirketi Python'u yoğun olarak kullanır?",
        options: ["Sadece startuplar", "Google, Instagram, Spotify", "Hiçbir büyük şirket", "Sadece üniversiteler"],
        correctAnswer: "Google, Instagram, Spotify",
        explanation: "Google, Instagram, Spotify gibi büyük şirketler Python'u yoğun olarak kullanır.",
        points: 10,
        difficulty: "medium",
        category: "industry"
      },

      // Bonus sorular - toplam 20+ soru için
      {
        type: "multiple_choice",
        question: "Python'da 'import this' komutu ne yapar?",
        options: ["Hata verir", "Zen of Python'u gösterir", "Python versiyonunu gösterir", "Yardım menüsünü açar"],
        correctAnswer: "Zen of Python'u gösterir",
        explanation: "'import this' komutu Python'un tasarım felsefesi olan Zen of Python'u görüntüler.",
        points: 15,
        difficulty: "medium",
        category: "easter_egg"
      },

      {
        type: "multiple_choice",
        question: "REPL nedir?",
        options: ["Python IDE", "Read-Eval-Print Loop", "Python framework", "Debugging tool"],
        correctAnswer: "Read-Eval-Print Loop",
        explanation: "REPL (Read-Eval-Print Loop) interaktif Python shell'idir.",
        points: 10,
        difficulty: "medium",
        category: "tools"
      },

      {
        type: "true_false",
        question: "Python kodu .py uzantısı ile kaydedilir.",
        correctAnswer: true,
        explanation: "Python dosyaları geleneksel olarak .py uzantısı ile kaydedilir.",
        points: 5,
        difficulty: "easy",
        category: "basic"
      }
    ]
  }
];

// Seeding fonksiyonu
export async function seedEnhancedLessons() {
  console.log("🌱 Enhanced lessons seeding başlıyor...");

  try {
    // Mevcut dersleri ve quizleri temizle
    console.log("🗑️ Mevcut verileri temizleniyor...");
    await prisma.quiz.deleteMany({});
    await prisma.codeArena.deleteMany({});
    console.log("✅ Mevcut veriler temizlendi");
  } catch (error) {
    console.log("⚠️ Temizlenecek veri bulunamadı");
  }

  // Dersleri oluştur
  for (const lessonData of lessonsData) {
    await prisma.codeArena.create({
      data: {
        id: lessonData.id,
        title: lessonData.title,
        slug: lessonData.slug,
        description: lessonData.description,
        content: JSON.stringify(lessonData.content),
        difficulty: lessonData.difficulty,
        duration: lessonData.duration,
        category: lessonData.category,
        diamondReward: lessonData.diamondReward,
        experienceReward: lessonData.experienceReward,
        order: lessonData.order,
        isPublished: lessonData.isPublished,
        hasCodeExercise: !!lessonData.practicalExercise,
        starterCode: lessonData.practicalExercise?.starterCode,
        solutionCode: lessonData.practicalExercise?.solution,
        testCases: JSON.stringify(lessonData.practicalExercise?.testCases || []),
        hints: JSON.stringify(lessonData.hints || []),
        prerequisites: JSON.stringify([]),
        learningObjectives: JSON.stringify(lessonData.learningObjectives || []),
      },
    });
  }

  // Quizleri oluştur
  for (const quiz of quizData) {
    await prisma.quiz.create({
      data: {
        codeArenaId: quiz.lessonId,
        title: `${quiz.lessonId} Quiz - Kapsamlı Test`,
        description: "Python temelleri ve kavramları üzerine kapsamlı quiz",
        questions: JSON.stringify(quiz.questions),
        timeLimit: 600, // 10 dakika
        diamondReward: 50,
        experienceReward: 100,
        difficulty: 1,
        passingScore: 70,
      },
    });
  }

  console.log("✅ Enhanced lessons başarıyla seed edildi!");
  console.log(`📊 Oluşturulan:
  - ${lessonsData.length} detaylı ders
  - ${quizData.length} quiz (${quizData[0]?.questions?.length || 0}+ soru/quiz)
  - Toplam ${quizData.reduce((total, quiz) => total + (quiz.questions?.length || 0), 0)} quiz sorusu`);
}

if (require.main === module) {
  seedEnhancedLessons()
    .catch((e) => {
      console.error("❌ Seeding hatası:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}