---
title: "Python Data Analysis: From Zero to Advanced with Pandas 2025 Guide"
description: "Learn data analysis in Python with the Pandas library. Comprehensive guide supported with real projects, examples and best practices."
date: "2025-08-08"
author: "Zumenzu Data Science Team"
category: "Data Analysis"
tags: ["python", "pandas", "data analysis", "data science", "csv", "excel", "matplotlib", "numpy"]
readTime: "12 min"
featured: true
seoKeywords: "python data analysis, pandas tutorial, python pandas examples, data science python"
---

# Python Data Analysis: From Zero to Advanced with Pandas 2025 Guide

Today, data is one of the most valuable assets of businesses. Python's **Pandas** library is one of the most powerful tools for analyzing this data and extracting meaningful insights. In this comprehensive guide, you'll learn data analysis with Pandas from scratch.

## 🐼 What is Pandas and Why is it Important?

Pandas (Python Data Analysis Library) is an open-source data manipulation and analysis library developed for the Python programming language. You can think of it as the programming world's equivalent of Excel, but much more powerful!

### Advantages of Pandas:
- ✅ **Fast and Efficient**: Can work with large datasets
- ✅ **Flexible Data Structures**: DataFrame and Series
- ✅ **Easy Data Cleaning**: Handling missing data
- ✅ **Powerful Import/Export**: CSV, Excel, JSON, SQL support
- ✅ **Statistical Analysis**: Descriptive statistics

## 🚀 Pandas Installation and First Steps

### Installation
```bash
# Installation with pip
pip install pandas

# If using Anaconda
conda install pandas

# Additional libraries for visualization
pip install matplotlib seaborn
```

### First Pandas Code
```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Check Pandas version
print(f"Pandas version: {pd.__version__}")

# Creating a simple DataFrame
data = {
    'name': ['John', 'Sarah', 'Michael', 'Emma', 'David'],
    'age': [25, 30, 35, 28, 32],
    'salary': [5000, 6500, 7200, 5800, 6800],
    'city': ['New York', 'Boston', 'Chicago', 'New York', 'Boston']
}

df = pd.DataFrame(data)
print(df)
```

**Output:**
```
      name  age  salary      city
0     John   25    5000  New York
1    Sarah   30    6500    Boston
2  Michael   35    7200   Chicago
3     Emma   28    5800  New York
4    David   32    6800    Boston
```

## 📊 Pandas Basic Data Structures

### 1. Series
One-dimensional data structure, similar to a column in Excel.

```python
# Creating Series
ages = pd.Series([25, 30, 35, 28, 32], name='ages')
print(ages)

# Series with index
temperatures = pd.Series(
    [22, 25, 19, 30, 27],
    index=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    name='temperature'
)
print(temperatures)
```

### 2. DataFrame
İki boyutlu veri yapısıdır, Excel tablosuna benzer.

```python
# DataFrame oluşturmanın farklı yolları

# 1. Dictionary'den
sales_data = {
    'tarih': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04'],
    'urun': ['Laptop', 'Mouse', 'Klavye', 'Monitor'],
    'fiyat': [15000, 250, 800, 5200],
    'adet': [2, 10, 5, 3]
}
df_sales = pd.DataFrame(sales_data)

# 2. Liste listelerinden
data_list = [
    ['Laptop', 15000, 2],
    ['Mouse', 250, 10], 
    ['Klavye', 800, 5],
    ['Monitor', 5200, 3]
]
df_list = pd.DataFrame(data_list, columns=['urun', 'fiyat', 'adet'])

print("Satış Verileri:")
print(df_sales)
```

## 📁 Veri Okuma ve Yazma

### CSV Dosyaları
```python
# CSV okuma
df = pd.read_csv('sales_data.csv')

# Gelişmiş CSV okuma
df = pd.read_csv(
    'sales_data.csv',
    sep=';',                    # Ayırıcı
    encoding='utf-8',           # Karakter kodlaması
    parse_dates=['tarih'],      # Tarih sütununu datetime'a çevir
    index_col='id',             # Index sütunu
    na_values=['', 'NULL', 'N/A']  # Boş değer tanımları
)

# CSV yazma
df.to_csv('output.csv', index=False, encoding='utf-8')
```

### Excel Dosyaları
```python
# Excel okuma
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# Birden fazla sheet okuma
all_sheets = pd.read_excel('data.xlsx', sheet_name=None)

# Excel yazma
df.to_excel('output.xlsx', sheet_name='Satış_Verileri', index=False)

# Birden fazla sheet'e yazma
with pd.ExcelWriter('multi_sheet.xlsx') as writer:
    df1.to_excel(writer, sheet_name='Sheet1')
    df2.to_excel(writer, sheet_name='Sheet2')
```

## 🔍 Veri Keşfi ve İnceleme

### Temel Bilgi Alma
```python
# DataFrame hakkında genel bilgi
print("DataFrame şekli:", df.shape)  # (satır, sütun)
print("Sütun isimleri:", df.columns.tolist())
print("Veri tipleri:")
print(df.dtypes)

# İlk ve son satırlar
print("İlk 5 satır:")
print(df.head())
print("Son 3 satır:")
print(df.tail(3))

# Detaylı bilgi
print(df.info())

# Tanımlayıcı istatistikler
print(df.describe())

# Boş değer kontrolü
print("Boş değerler:")
print(df.isnull().sum())
```

### Gerçek Dünya Örneği: E-ticaret Veri Analizi
```python
# Örnek e-ticaret verisi oluşturalım
import random
from datetime import datetime, timedelta

# Rastgele veri oluşturma
np.random.seed(42)
products = ['Laptop', 'Mouse', 'Klavye', 'Monitor', 'Kulaklık', 'Webcam']
cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya']

data = []
for i in range(1000):
    date = datetime(2023, 1, 1) + timedelta(days=random.randint(0, 364))
    product = random.choice(products)
    price = random.randint(100, 5000)
    quantity = random.randint(1, 5)
    city = random.choice(cities)
    
    data.append({
        'tarih': date,
        'urun': product,
        'fiyat': price,
        'adet': quantity,
        'sehir': city,
        'toplam': price * quantity
    })

ecommerce_df = pd.DataFrame(data)
print("E-ticaret veri seti oluşturuldu:")
print(ecommerce_df.head())
```

## 🎯 Veri Seçme ve Filtreleme

### Sütun Seçimi
```python
# Tek sütun seçme
products = df['urun']  # Series döner
products = df[['urun']]  # DataFrame döner

# Birden fazla sütun
selected_cols = df[['urun', 'fiyat', 'toplam']]

# Sütun isimlerini kullanarak
numeric_cols = df.select_dtypes(include=[np.number])
text_cols = df.select_dtypes(include=['object'])
```

### Satır Seçimi
```python
# Index ile seçim
first_row = df.iloc[0]  # İlk satır
first_five = df.iloc[:5]  # İlk 5 satır
last_three = df.iloc[-3:]  # Son 3 satır

# Koşullu seçim
expensive_products = df[df['fiyat'] > 1000]
istanbul_sales = df[df['sehir'] == 'İstanbul']

# Birden fazla koşul
high_value_istanbul = df[
    (df['fiyat'] > 1000) & 
    (df['sehir'] == 'İstanbul')
]

# isin() metodu
big_cities = df[df['sehir'].isin(['İstanbul', 'Ankara', 'İzmir'])]
```

## 🧹 Veri Temizleme

### Eksik Verilerle Başa Çıkma
```python
# Eksik veri kontrol
print(df.isnull().sum())

# Eksik verileri doldurma
df['fiyat'].fillna(df['fiyat'].mean(), inplace=True)  # Ortalama ile
df['sehir'].fillna('Bilinmiyor', inplace=True)        # Sabit değer ile

# Eksik satırları silme
df_clean = df.dropna()  # Tüm eksik satırları sil
df_clean = df.dropna(subset=['fiyat', 'adet'])  # Belirli sütunlardaki eksikler
```

### Duplikasyon Kontrolü
```python
# Duplikat kontrol
print(f"Duplikat satır sayısı: {df.duplicated().sum()}")

# Duplikatları silme
df_unique = df.drop_duplicates()
df_unique = df.drop_duplicates(subset=['urun'], keep='first')
```

## 📈 Veri Manipülasyonu

### Yeni Sütunlar Oluşturma
```python
# Basit hesaplamalar
df['kar_marji'] = df['fiyat'] * 0.2
df['toplam_kar'] = df['kar_marji'] * df['adet']

# Koşullu sütun oluşturma
df['fiyat_kategorisi'] = df['fiyat'].apply(
    lambda x: 'Ucuz' if x < 500 else 'Orta' if x < 2000 else 'Pahalı'
)

# Tarih bilgilerini çıkarma
df['tarih'] = pd.to_datetime(df['tarih'])
df['yil'] = df['tarih'].dt.year
df['ay'] = df['tarih'].dt.month
df['haftanin_gunu'] = df['tarih'].dt.day_name()
```

## 📊 Gruplama ve Agregasyon

### Temel Gruplama
```python
# Tek sütuna göre gruplama
city_sales = df.groupby('sehir')['toplam'].sum()
print("Şehirlere göre toplam satış:")
print(city_sales.sort_values(ascending=False))

# Birden fazla sütuna göre gruplama
monthly_category_sales = df.groupby(['ay', 'urun'])['toplam'].sum()

# Farklı agregasyon fonksiyonları
city_stats = df.groupby('sehir').agg({
    'toplam': ['sum', 'mean', 'count'],
    'fiyat': ['min', 'max'],
    'adet': 'sum'
})
print(city_stats)
```

### Pivot Tablolar
```python
# Basit pivot tablo
monthly_sales = df.pivot_table(
    index='ay',
    columns='urun',
    values='toplam',
    aggfunc='sum',
    fill_value=0
)
print(monthly_sales)

# Çoklu agregasyon
detailed_pivot = df.pivot_table(
    index='sehir',
    columns='urun',
    values=['toplam', 'adet'],
    aggfunc={'toplam': 'sum', 'adet': 'mean'},
    fill_value=0
)
```

## 📊 Veri Görselleştirme

### Matplotlib ile Temel Grafikler
```python
import matplotlib.pyplot as plt

# Aylık satış trendi
monthly_sales = df.groupby('ay')['toplam'].sum()

fig, axes = plt.subplots(2, 2, figsize=(15, 12))

# Line plot - Aylık satış trendi
axes[0,0].plot(monthly_sales.index, monthly_sales.values, marker='o')
axes[0,0].set_title('Aylık Satış Trendi')
axes[0,0].set_xlabel('Ay')
axes[0,0].set_ylabel('Toplam Satış (TL)')

# Bar plot - Şehirlere göre satış
city_sales = df.groupby('sehir')['toplam'].sum().sort_values(ascending=False)
axes[0,1].bar(city_sales.index, city_sales.values)
axes[0,1].set_title('Şehirlere Göre Toplam Satış')
axes[0,1].tick_params(axis='x', rotation=45)

# Histogram - Fiyat dağılımı
axes[1,0].hist(df['fiyat'], bins=30, alpha=0.7)
axes[1,0].set_title('Fiyat Dağılımı')
axes[1,0].set_xlabel('Fiyat (TL)')

# Pie chart - Ürün payları
product_sales = df.groupby('urun')['toplam'].sum()
axes[1,1].pie(product_sales.values, labels=product_sales.index, autopct='%1.1f%%')
axes[1,1].set_title('Ürünlere Göre Satış Payı')

plt.tight_layout()
plt.show()
```

## 🔄 İleri Seviye Teknikleri

### Apply ve Transform
```python
# Apply ile satır bazlı işlemler
def calculate_profit_margin(row):
    if row['urun'] == 'Laptop':
        return row['fiyat'] * 0.15
    else:
        return row['fiyat'] * 0.25

df['kar_marji'] = df.apply(calculate_profit_margin, axis=1)

# Transform ile grup bazlı işlemler
df['sehir_ortalama'] = df.groupby('sehir')['fiyat'].transform('mean')
df['sehir_siralaması'] = df.groupby('sehir')['toplam'].transform(
    lambda x: x.rank(ascending=False)
)
```

### Window Functions
```python
# Rolling window hesaplamaları
df_sorted = df.sort_values('tarih')
df_sorted['7gun_ortalama'] = df_sorted['toplam'].rolling(window=7).mean()
df_sorted['30gun_toplam'] = df_sorted['toplam'].rolling(window=30).sum()

# Shift işlemleri
df_sorted['onceki_gun'] = df_sorted['toplam'].shift(1)
df_sorted['degisim'] = df_sorted['toplam'] - df_sorted['onceki_gun']
```

## 💼 Gerçek Proje Örneği

### E-ticaret Satış Analizi
```python
class ECommerceAnalyzer:
    def __init__(self, data_path):
        self.df = pd.read_csv(data_path)
        self.prepare_data()
    
    def prepare_data(self):
        """Veriyi analiz için hazırla"""
        self.df['tarih'] = pd.to_datetime(self.df['tarih'])
        self.df['yil'] = self.df['tarih'].dt.year
        self.df['ay'] = self.df['tarih'].dt.month
        self.df['sehir'] = self.df['sehir'].astype('category')
    
    def sales_summary(self):
        """Satış özeti"""
        return {
            'toplam_satis': self.df['toplam'].sum(),
            'ortalama_satis': self.df['toplam'].mean(),
            'satis_adedi': len(self.df),
            'benzersiz_urun': self.df['urun'].nunique()
        }
    
    def top_products(self, n=10):
        """En çok satan ürünler"""
        return self.df.groupby('urun').agg({
            'toplam': 'sum',
            'adet': 'sum'
        }).sort_values('toplam', ascending=False).head(n)
    
    def city_analysis(self):
        """Şehir bazlı analiz"""
        return self.df.groupby('sehir').agg({
            'toplam': ['sum', 'mean', 'count'],
            'fiyat': ['min', 'max']
        })
    
    def generate_report(self):
        """Kapsamlı rapor oluştur"""
        print("=== E-TİCARET SATIŞ ANALİZİ ===\n")
        
        summary = self.sales_summary()
        print("GENEL ÖZET:")
        for key, value in summary.items():
            if isinstance(value, float):
                print(f"  {key}: {value:,.2f}")
            else:
                print(f"  {key}: {value:,}")
        
        print("\nEN ÇOK SATAN ÜRÜNLER:")
        top_products = self.top_products(5)
        for product, data in top_products.iterrows():
            print(f"  {product}: {data['toplam']:,.0f} TL")

# Kullanım
# analyzer = ECommerceAnalyzer('data.csv')
# analyzer.generate_report()
```

## 🎯 Performans İpuçları

### Hızlı Pandas Kullanımı
```python
# Vectorized işlemler kullanın
# Yavaş:
# df['expensive'] = df['fiyat'].apply(lambda x: x > 1000)

# Hızlı:
df['expensive'] = df['fiyat'] > 1000

# Categorical veri kullanın
df['sehir'] = df['sehir'].astype('category')

# Memory usage kontrol edin
print(df.memory_usage(deep=True))

# Büyük dosyalar için chunk okuma
for chunk in pd.read_csv('big_file.csv', chunksize=10000):
    # Her chunk'ı işle
    processed = chunk[chunk['toplam'] > 1000]
```

## 📈 Sonuç ve Kariyer Fırsatları

Pandas ile veri analizi öğrenmek size şu fırsatları açar:

### 💰 **Kariyer Yolları:**
- **Veri Analisti**: 40,000-70,000 TL
- **Veri Bilimci**: 60,000-120,000 TL  
- **Business Intelligence**: 45,000-85,000 TL
- **Finans Analisti**: 50,000-90,000 TL

### 🚀 **Sonraki Adımlar:**
1. **İstatistik**: Scipy, Statsmodels
2. **Görselleştirme**: Seaborn, Plotly
3. **Makine Öğrenmesi**: Scikit-learn
4. **Big Data**: Dask, PySpark

### 📊 **Önemli Resim Promptları:**

1. **"Pandas DataFrame structure visualization with rows, columns and data types"**
2. **"Data analysis workflow diagram from raw data to insights"**
3. **"Python data science ecosystem infographic with pandas, numpy, matplotlib"**
4. **"Data cleaning process flowchart showing missing values handling"**
5. **"Business intelligence dashboard showing sales analytics charts"**

## 💡 Practical Tips

### Daily Data Analysis Routine:
1. **Data Exploration** (15 min): `.head()`, `.info()`, `.describe()`
2. **Data Cleaning** (30 min): Missing values, duplicates
3. **Analysis** (45 min): Grouping, aggregation, pivot
4. **Visualization** (30 min): Charts and tables
5. **Reporting** (30 min): Summarizing findings

With this guide, you've discovered the power of Pandas. Now you can work with real datasets and perform professional analyses!

---

*This article was prepared by the Zumenzu data science team. Visit the [Zumenzu platform](/) for interactive Pandas lessons.*