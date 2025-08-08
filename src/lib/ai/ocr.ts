import fs from "fs";
import path from "path";
import sharp from "sharp";

export interface CardAnalysisResult {
  ocrText: string; // Bu alan backward compatibility için kalıyor ama artık kullanılmayacak
  cardInfo: {
    name?: string;
    series?: string;
    character?: string;
    rarity?: string;
    stats?: {
      attack: number;
      defense: number;
      speed: number;
      hp: number;
    };
  };
  confidence: number;
  imageQuality?: ImageQualityMetrics;
  story?: string; // AI-generated story based on card image
}

export interface ImageQualityMetrics {
  resolution: {
    width: number;
    height: number;
    megapixels: number;
    aspectRatio: number;
  };
  quality: {
    sharpnessScore: number;
    colorComplexity: number;
    brightnessVariance: number;
    qualityScore: number; // 0-100 arası genel kalite skoru
  };
  fileInfo: {
    sizeBytes: number;
    sizeMB: number;
    format: string;
    density?: number;
  };
  rarityIndicators: {
    highResolution: boolean;
    excellentQuality: boolean;
    richColors: boolean;
    perfectAspectRatio: boolean;
    largeFileSize: boolean;
  };
}

// Quality-based card analysis system
export async function processCardImage(
  imagePath: string,
  category?: string
): Promise<CardAnalysisResult> {
  try {
    console.log(
      "🔍 Starting card analysis for:",
      path.basename(imagePath),
      category ? `(Category: ${category})` : ""
    );

    // Dosya varlığını kontrol et
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    // Quality-based analysis system
    console.log("📊 Using intelligent quality-based analysis system");
    return await qualityBasedAnalysis(imagePath, category);
  } catch (error) {
    console.error("❌ Complete image analysis failed:", error);

    // Son çare: dosya ismine dayalı analiz
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const fallbackCardInfo = generateFallbackCardInfo(fileName);

    return {
      ocrText: `Analysis failed: ${fileName} - ${(error as Error).message}`,
      cardInfo: fallbackCardInfo,
      confidence: 0.1,
    };
  }
}

// Quality-based analysis function
async function qualityBasedAnalysis(
  imagePath: string,
  category?: string
): Promise<CardAnalysisResult> {
  try {
    console.log(
      "Using quality-based analysis for:",
      imagePath,
      category ? `(Category: ${category})` : ""
    );

    // Görsel kalite analizi
    const imageQuality = await analyzeImageQuality(imagePath);

    // Dosya adından temel bilgi çıkarımı
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const cardInfo = await generateSmartCardInfo(
      fileName,
      imageQuality,
      category
    );

    // Kalite skoruna dayalı güven seviyesi
    const confidence = calculateConfidenceFromQuality(imageQuality);

    // Kategori-bazlı fallback hikaye oluştur
    const story = generateCategoryAwareFallbackStory(
      cardInfo,
      imageQuality,
      category
    );

    console.log(
      `Quality analysis completed with score: ${imageQuality.quality.qualityScore}/100 for category: ${category || "anime-collection"}`
    );

    return {
      ocrText: `Image quality analysis: ${imageQuality.quality.qualityScore}/100 points`,
      cardInfo,
      confidence: confidence * 0.8, // Good confidence for quality analysis
      imageQuality,
      story,
    };
  } catch (error) {
    console.error("Quality analysis error:", error);

    // En son çare
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const fallbackCardInfo = generateCategoryAwareFallbackCardInfo(
      fileName,
      category
    );
    const fallbackStory = generateCategoryAwareFallbackStory(
      fallbackCardInfo,
      undefined,
      category
    );

    return {
      ocrText: `All analyses failed: ${fileName}`,
      cardInfo: fallbackCardInfo,
      confidence: 0.2,
      story: fallbackStory,
    };
  }
}

// Görsel kalite analizi
async function analyzeImageQuality(
  imagePath: string
): Promise<ImageQualityMetrics> {
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  const stats = await image.stats();
  const fileStats = fs.statSync(imagePath);

  // Çözünürlük analizi
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const megapixels = (width * height) / 1000000;
  const aspectRatio = width / height;

  // Kalite metrikleri hesaplama
  const sharpnessScore = await calculateSharpness(image);
  const colorComplexity = calculateColorComplexity(stats);
  const brightnessVariance = calculateBrightnessVariance(stats);

  // Genel kalite skoru (0-100)
  const qualityScore = calculateOverallQuality({
    resolution: { width, height, megapixels },
    sharpness: sharpnessScore,
    colorComplexity,
    brightnessVariance,
    fileSize: fileStats.size,
  });

  // Rarity göstergeleri
  const rarityIndicators = {
    highResolution: megapixels >= 2.0, // 2MP+
    excellentQuality: qualityScore >= 80,
    richColors: colorComplexity >= 70,
    perfectAspectRatio: Math.abs(aspectRatio - 0.7) < 0.1, // Kart oranına yakın
    largeFileSize: fileStats.size > 500000, // 500KB+
  };

  return {
    resolution: {
      width,
      height,
      megapixels,
      aspectRatio,
    },
    quality: {
      sharpnessScore,
      colorComplexity,
      brightnessVariance,
      qualityScore,
    },
    fileInfo: {
      sizeBytes: fileStats.size,
      sizeMB: fileStats.size / (1024 * 1024),
      format: metadata.format || "unknown",
      density: metadata.density,
    },
    rarityIndicators,
  };
}

// Keskinlik skoru hesaplama
async function calculateSharpness(image: sharp.Sharp): Promise<number> {
  try {
    // Laplacian filtresi ile edge detection
    const { data, info } = await image
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let edgeSum = 0;
    const { width, height } = info;

    // Basit Laplacian kernel uygulaması
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const center = data[idx];
        const top = data[(y - 1) * width + x];
        const bottom = data[(y + 1) * width + x];
        const left = data[y * width + (x - 1)];
        const right = data[y * width + (x + 1)];

        const edge = Math.abs(4 * center - top - bottom - left - right);
        edgeSum += edge;
      }
    }

    // Normalize to 0-100 scale
    const avgEdge = edgeSum / ((width - 2) * (height - 2));
    return Math.min(100, (avgEdge / 255) * 100);
  } catch (error) {
    console.warn("Sharpness calculation failed:", error);
    return 50; // Default orta değer
  }
}

// Renk karmaşıklığı hesaplama
function calculateColorComplexity(stats: sharp.Stats): number {
  const channels = stats.channels;
  let complexity = 0;

  channels.forEach((channel) => {
    // Standart sapma ve min-max aralığına dayalı karmaşıklık
    const range = channel.max - channel.min;
    const variance = channel.stdev;
    complexity += (range / 255) * 50 + (variance / 255) * 50;
  });

  return Math.min(100, complexity / channels.length);
}

// Parlaklık varyasyonu hesaplama
function calculateBrightnessVariance(stats: sharp.Stats): number {
  // İlk kanalın (genellikle kırmızı veya gri) varyansını kullan
  const firstChannel = stats.channels[0];
  return Math.min(100, (firstChannel.stdev / 255) * 100);
}

// Genel kalite skoru hesaplama
function calculateOverallQuality(metrics: {
  resolution: { width: number; height: number; megapixels: number };
  sharpness: number;
  colorComplexity: number;
  brightnessVariance: number;
  fileSize: number;
}): number {
  const {
    resolution,
    sharpness,
    colorComplexity,
    brightnessVariance,
    fileSize,
  } = metrics;

  // Ağırlıklı kalite hesaplaması
  const resolutionScore = Math.min(100, (resolution.megapixels / 5) * 100); // 5MP = 100 puan
  const fileSizeScore = Math.min(100, (fileSize / 1000000) * 100); // 1MB = 100 puan

  const qualityScore =
    resolutionScore * 0.3 + // %30 çözünürlük
    sharpness * 0.25 + // %25 keskinlik
    colorComplexity * 0.2 + // %20 renk karmaşıklığı
    brightnessVariance * 0.15 + // %15 parlaklık varyasyonu
    fileSizeScore * 0.1; // %10 dosya boyutu

  return Math.round(qualityScore);
}

// Kaliteden güven seviyesi hesaplama
function calculateConfidenceFromQuality(quality: ImageQualityMetrics): number {
  const { qualityScore } = quality.quality;
  const { rarityIndicators } = quality;

  // Temel güven skoru kalite skorundan
  let confidence = qualityScore / 100;

  // Rarity göstergelerine dayalı bonus
  const bonusCount = Object.values(rarityIndicators).filter(Boolean).length;
  const bonus = bonusCount * 0.05; // Her gösterge %5 bonus

  confidence = Math.min(1.0, confidence + bonus);
  confidence = Math.max(0.1, confidence); // Minimum %10 güven

  return confidence;
}

// Kaliteye dayalı akıllı kart bilgi üretimi
async function generateSmartCardInfo(
  fileName: string,
  imageQuality: ImageQualityMetrics,
  category?: string
): Promise<{
  name: string;
  series: string;
  character: string;
  rarity: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    hp: number;
  };
}> {
  // Kalite skoruna dayalı rarity tespiti
  const qualityScore = imageQuality.quality.qualityScore;
  const rarityCount = Object.values(imageQuality.rarityIndicators).filter(
    Boolean
  ).length;

  let detectedRarity = "Common";

  if (qualityScore >= 90 && rarityCount >= 4) {
    detectedRarity = "Legendary";
  } else if (qualityScore >= 80 && rarityCount >= 3) {
    detectedRarity = "Secret Rare";
  } else if (qualityScore >= 70 && rarityCount >= 2) {
    detectedRarity = "Ultra Rare";
  } else if (qualityScore >= 60 && rarityCount >= 2) {
    detectedRarity = "Super Rare";
  } else if (qualityScore >= 50) {
    detectedRarity = "Rare";
  } else if (qualityScore >= 40) {
    detectedRarity = "Uncommon";
  }

  // Kategori-bazlı seri ve karakter tespiti
  const detectedSeries = detectSeriesFromFilename(fileName, category);
  const detectedCharacter = generateCharacterForSeries(
    detectedSeries,
    category
  );

  // Kaliteye dayalı istatistikler
  const baseStats = 50;
  const qualityMultiplier = qualityScore / 100;

  return {
    name: fileName,
    series: detectedSeries,
    character: detectedCharacter,
    rarity: detectedRarity,
    stats: {
      attack: Math.round(baseStats + qualityMultiplier * 50),
      defense: Math.round(baseStats + qualityMultiplier * 50),
      speed: Math.round(baseStats + qualityMultiplier * 50),
      hp: Math.round((baseStats + qualityMultiplier * 50) * 2),
    },
  };
}

// Kategori-bazlı seri tespiti
function detectSeriesFromFilename(fileName: string, category?: string): string {
  const lowerFileName = fileName.toLowerCase();
  const categoryLower = (category || "anime-collection").toLowerCase();

  // Kategori-bazlı seri haritalama
  if (categoryLower === "movies") {
    const movieSeriesMap = {
      marvel: "Marvel Cinematic Universe",
      iron: "Marvel Studios",
      spider: "Marvel Studios",
      avengers: "Marvel Cinematic Universe",
      dc: "DC Extended Universe",
      batman: "DC Comics",
      superman: "DC Comics",
      wonder: "DC Extended Universe",
      star: "Star Wars",
      wars: "Star Wars",
      harry: "Harry Potter",
      potter: "Harry Potter",
      lord: "Lord of the Rings",
      rings: "Lord of the Rings",
      fast: "Fast & Furious",
      furious: "Fast & Furious",
      mission: "Mission Impossible",
      impossible: "Mission Impossible",
      transformer: "Transformers",
      terminator: "Terminator",
      matrix: "The Matrix",
      alien: "Alien Franchise",
      predator: "Predator Franchise",
    };

    for (const [keyword, series] of Object.entries(movieSeriesMap)) {
      if (lowerFileName.includes(keyword)) {
        return series;
      }
    }
    return "Action Movie Collection";
  }

  if (categoryLower === "car" || categoryLower === "cars") {
    const carSeriesMap = {
      ferrari: "Ferrari Collection",
      lamborghini: "Lamborghini Collection",
      porsche: "Porsche Collection",
      mercedes: "Mercedes-Benz Collection",
      bmw: "BMW Collection",
      audi: "Audi Collection",
      toyota: "Toyota Collection",
      honda: "Honda Collection",
      nissan: "Nissan Collection",
      mazda: "Mazda Collection",
      subaru: "Subaru Collection",
      mitsubishi: "Mitsubishi Collection",
      ford: "Ford Collection",
      chevrolet: "Chevrolet Collection",
      dodge: "Dodge Collection",
      mustang: "Ford Mustang Series",
      corvette: "Chevrolet Corvette Series",
      camaro: "Chevrolet Camaro Series",
      challenger: "Dodge Challenger Series",
      viper: "Dodge Viper Series",
      gtr: "Nissan GT-R Series",
      skyline: "Nissan Skyline Series",
      supra: "Toyota Supra Series",
      civic: "Honda Civic Series",
      accord: "Honda Accord Series",
      impreza: "Subaru Impreza Series",
      wrx: "Subaru WRX Series",
      evo: "Mitsubishi Evolution Series",
      lancer: "Mitsubishi Lancer Series",
      rx7: "Mazda RX-7 Series",
      miata: "Mazda MX-5 Series",
      911: "Porsche 911 Series",
      cayman: "Porsche Cayman Series",
      boxster: "Porsche Boxster Series",
      gallardo: "Lamborghini Gallardo Series",
      huracan: "Lamborghini Huracan Series",
      aventador: "Lamborghini Aventador Series",
      f40: "Ferrari F40 Series",
      f50: "Ferrari F50 Series",
      enzo: "Ferrari Enzo Series",
      laferrari: "Ferrari LaFerrari Series",
      testarossa: "Ferrari Testarossa Series",
      m3: "BMW M3 Series",
      m5: "BMW M5 Series",
      rs4: "Audi RS4 Series",
      rs6: "Audi RS6 Series",
      amg: "Mercedes-AMG Series",
      cls: "Mercedes CLS Series",
      s_class: "Mercedes S-Class Series",
      e_class: "Mercedes E-Class Series",
      c_class: "Mercedes C-Class Series",
    };

    for (const [keyword, series] of Object.entries(carSeriesMap)) {
      if (lowerFileName.includes(keyword)) {
        return series;
      }
    }
    return "Automotive Collection";
  }

  if (categoryLower === "games") {
    const gameSeriesMap = {
      pokemon: "Pokemon",
      final: "Final Fantasy",
      fantasy: "Final Fantasy",
      league: "League of Legends",
      legends: "League of Legends",
      warcraft: "World of Warcraft",
      zelda: "The Legend of Zelda",
      mario: "Super Mario",
      sonic: "Sonic the Hedgehog",
      street: "Street Fighter",
      fighter: "Street Fighter",
      tekken: "Tekken",
      mortal: "Mortal Kombat",
      kombat: "Mortal Kombat",
    };

    for (const [keyword, series] of Object.entries(gameSeriesMap)) {
      if (lowerFileName.includes(keyword)) {
        return series;
      }
    }
    return "Gaming Collection";
  }

  if (categoryLower === "sports") {
    const sportsSeriesMap = {
      nba: "NBA",
      nfl: "NFL",
      fifa: "FIFA",
      uefa: "UEFA",
      premier: "Premier League",
      league: "Sports League",
      baseball: "MLB",
      mlb: "MLB",
      hockey: "NHL",
      nhl: "NHL",
    };

    for (const [keyword, series] of Object.entries(sportsSeriesMap)) {
      if (lowerFileName.includes(keyword)) {
        return series;
      }
    }
    return "Sports Collection";
  }

  // Default anime detection
  const animeSeriesMap = {
    naruto: "Naruto",
    dragon: "Dragon Ball",
    ball: "Dragon Ball",
    pokemon: "Pokemon",
    yugioh: "Yu-Gi-Oh!",
    onepiece: "One Piece",
    piece: "One Piece",
    bleach: "Bleach",
    attack: "Attack on Titan",
    titan: "Attack on Titan",
    demon: "Demon Slayer",
    slayer: "Demon Slayer",
    jujutsu: "Jujutsu Kaisen",
    kaisen: "Jujutsu Kaisen",
    hero: "My Hero Academia",
    academia: "My Hero Academia",
    hunter: "Hunter x Hunter",
    death: "Death Note",
    note: "Death Note",
    evangelion: "Evangelion",
    sailor: "Sailor Moon",
    moon: "Sailor Moon",
  };

  for (const [keyword, series] of Object.entries(animeSeriesMap)) {
    if (lowerFileName.includes(keyword)) {
      return series;
    }
  }

  // Kategori-bazlı default return
  if (categoryLower === "movies") {
    return "Action Movie Collection";
  } else if (categoryLower === "games") {
    return "Gaming Collection";
  } else if (categoryLower === "sports") {
    return "Sports Collection";
  } else if (categoryLower === "car" || categoryLower === "cars") {
    return "Automotive Collection";
  } else {
    return "Anime Collection";
  }
}

// Kategori-bazlı karakter üretimi
function generateCharacterForSeries(series: string, category?: string): string {
  const categoryLower = (category || "anime-collection").toLowerCase();

  if (categoryLower === "movies") {
    const movieCharacterMap: Record<string, string[]> = {
      "Marvel Cinematic Universe": [
        "Iron Man",
        "Captain America",
        "Thor",
        "Black Widow",
        "Hulk",
      ],
      "Marvel Studios": [
        "Tony Stark",
        "Peter Parker",
        "Steve Rogers",
        "Natasha Romanoff",
      ],
      "DC Extended Universe": [
        "Wonder Woman",
        "Batman",
        "Superman",
        "Aquaman",
        "Flash",
      ],
      "DC Comics": ["Bruce Wayne", "Clark Kent", "Diana Prince", "Barry Allen"],
      "Star Wars": [
        "Luke Skywalker",
        "Darth Vader",
        "Princess Leia",
        "Han Solo",
        "Yoda",
      ],
      "Harry Potter": [
        "Harry Potter",
        "Hermione Granger",
        "Ron Weasley",
        "Albus Dumbledore",
      ],
      "Lord of the Rings": ["Aragorn", "Legolas", "Gimli", "Gandalf", "Frodo"],
      "Fast & Furious": [
        "Dominic Toretto",
        "Brian O'Conner",
        "Letty Ortiz",
        "Roman Pearce",
      ],
      "Mission Impossible": [
        "Ethan Hunt",
        "Luther Stickell",
        "Benji Dunn",
        "Ilsa Faust",
      ],
      Transformers: ["Optimus Prime", "Bumblebee", "Megatron", "Starscream"],
      Terminator: ["Sarah Connor", "John Connor", "T-800", "T-1000"],
      "The Matrix": ["Neo", "Morpheus", "Trinity", "Agent Smith"],
      "Action Movie Collection": [
        "Action Hero",
        "Elite Agent",
        "Special Forces",
        "Combat Specialist",
      ],
    };

    const characters = movieCharacterMap[series] || [
      "Movie Hero",
      "Action Star",
      "Film Character",
      "Leading Actor",
    ];
    return characters[Math.floor(Math.random() * characters.length)];
  }

  if (categoryLower === "car" || categoryLower === "cars") {
    const carCharacterMap: Record<string, string[]> = {
      "Ferrari Collection": [
        "Ferrari F40",
        "Ferrari F50",
        "Ferrari Enzo",
        "Ferrari LaFerrari",
        "Ferrari 458 Italia",
      ],
      "Lamborghini Collection": [
        "Lamborghini Gallardo",
        "Lamborghini Huracan",
        "Lamborghini Aventador",
        "Lamborghini Murcielago",
        "Lamborghini Diablo",
      ],
      "Porsche Collection": [
        "Porsche 911 Turbo",
        "Porsche Cayman GT4",
        "Porsche Boxster S",
        "Porsche Panamera",
        "Porsche Macan Turbo",
      ],
      "Mercedes-Benz Collection": [
        "Mercedes AMG GT",
        "Mercedes S-Class",
        "Mercedes E-Class AMG",
        "Mercedes CLS 63",
        "Mercedes G-Wagon",
      ],
      "BMW Collection": [
        "BMW M3 Competition",
        "BMW M5 CS",
        "BMW i8",
        "BMW X6 M",
        "BMW Z4 M40i",
      ],
      "Audi Collection": [
        "Audi RS6 Avant",
        "Audi R8 V10",
        "Audi RS4",
        "Audi Q8 RS",
        "Audi TT RS",
      ],
      "Toyota Collection": [
        "Toyota Supra MK4",
        "Toyota AE86",
        "Toyota Celica GT-Four",
        "Toyota MR2 Turbo",
        "Toyota Prius Prime",
      ],
      "Honda Collection": [
        "Honda NSX Type-R",
        "Honda Civic Type-R",
        "Honda S2000",
        "Honda Accord Euro-R",
        "Honda Integra DC5",
      ],
      "Nissan Collection": [
        "Nissan GT-R R35",
        "Nissan Skyline R34",
        "Nissan 370Z Nismo",
        "Nissan Silvia S15",
        "Nissan 240SX",
      ],
      "Ford Collection": [
        "Ford Mustang GT",
        "Ford GT40",
        "Ford Focus RS",
        "Ford Fiesta ST",
        "Ford Raptor",
      ],
      "Chevrolet Collection": [
        "Chevrolet Corvette Z06",
        "Chevrolet Camaro ZL1",
        "Chevrolet Impala SS",
        "Chevrolet Silverado",
        "Chevrolet Tahoe",
      ],
      "Dodge Collection": [
        "Dodge Challenger SRT",
        "Dodge Charger Hellcat",
        "Dodge Viper ACR",
        "Dodge Ram TRX",
        "Dodge Durango SRT",
      ],
      "Mazda Collection": [
        "Mazda RX-7 FD",
        "Mazda MX-5 Miata",
        "Mazda RX-8",
        "Mazda CX-5 Turbo",
        "Mazda 3 MPS",
      ],
      "Subaru Collection": [
        "Subaru WRX STI",
        "Subaru Impreza 22B",
        "Subaru BRZ tS",
        "Subaru Forester XT",
        "Subaru Legacy GT",
      ],
      "Mitsubishi Collection": [
        "Mitsubishi Lancer Evo X",
        "Mitsubishi 3000GT VR4",
        "Mitsubishi Eclipse GSX",
        "Mitsubishi Pajero Evo",
        "Mitsubishi Outlander",
      ],
      "Automotive Collection": [
        "Super Car",
        "Race Car",
        "Sports Car",
        "Muscle Car",
        "Luxury Vehicle",
        "Street Racer",
        "Track Monster",
        "Speed Demon",
      ],
    };

    const characters = carCharacterMap[series] || [
      "Classic Car",
      "Performance Vehicle",
      "Racing Machine",
      "Street Car",
    ];
    return characters[Math.floor(Math.random() * characters.length)];
  }

  if (categoryLower === "games") {
    const gameCharacterMap: Record<string, string[]> = {
      Pokemon: ["Pikachu", "Charizard", "Blastoise", "Venusaur", "Mew"],
      "Final Fantasy": [
        "Cloud Strife",
        "Sephiroth",
        "Tifa Lockhart",
        "Lightning",
      ],
      "League of Legends": ["Ahri", "Yasuo", "Jinx", "Ezreal", "Lux"],
      "World of Warcraft": ["Thrall", "Jaina Proudmoore", "Arthas", "Illidan"],
      "The Legend of Zelda": ["Link", "Princess Zelda", "Ganondorf", "Midna"],
      "Super Mario": ["Mario", "Luigi", "Princess Peach", "Bowser"],
      "Sonic the Hedgehog": ["Sonic", "Tails", "Knuckles", "Shadow"],
      "Street Fighter": ["Ryu", "Chun-Li", "Ken", "Akuma"],
      Tekken: ["Jin Kazama", "Kazuya Mishima", "Nina Williams", "King"],
      "Mortal Kombat": ["Scorpion", "Sub-Zero", "Liu Kang", "Raiden"],
      "Gaming Collection": [
        "Game Hero",
        "Player Character",
        "Gaming Champion",
        "Digital Warrior",
      ],
    };

    const characters = gameCharacterMap[series] || [
      "Gamer",
      "Player One",
      "Digital Hero",
      "Game Character",
    ];
    return characters[Math.floor(Math.random() * characters.length)];
  }

  if (categoryLower === "sports") {
    const sportsCharacterMap: Record<string, string[]> = {
      NBA: ["LeBron James", "Stephen Curry", "Michael Jordan", "Kobe Bryant"],
      NFL: ["Tom Brady", "Aaron Rodgers", "Patrick Mahomes", "Peyton Manning"],
      FIFA: ["Lionel Messi", "Cristiano Ronaldo", "Neymar Jr", "Kylian Mbappé"],
      "Premier League": [
        "Harry Kane",
        "Mohamed Salah",
        "Kevin De Bruyne",
        "Virgil van Dijk",
      ],
      MLB: ["Babe Ruth", "Derek Jeter", "Mike Trout", "Shohei Ohtani"],
      NHL: [
        "Wayne Gretzky",
        "Connor McDavid",
        "Sidney Crosby",
        "Alexander Ovechkin",
      ],
      "Sports Collection": [
        "All-Star Player",
        "MVP Athlete",
        "Championship Winner",
        "Sports Legend",
      ],
    };

    const characters = sportsCharacterMap[series] || [
      "Athlete",
      "Sports Star",
      "Champion",
      "Professional Player",
    ];
    return characters[Math.floor(Math.random() * characters.length)];
  }

  // Default anime characters
  const characterMap: Record<string, string[]> = {
    Naruto: [
      "Naruto Uzumaki",
      "Sasuke Uchiha",
      "Sakura Haruno",
      "Kakashi Hatake",
    ],
    "Dragon Ball": ["Goku", "Vegeta", "Gohan", "Piccolo", "Frieza"],
    Pokemon: ["Pikachu", "Charizard", "Blastoise", "Venusaur", "Mew"],
    "One Piece": ["Luffy", "Zoro", "Sanji", "Nami", "Robin"],
    "Attack on Titan": [
      "Eren Yeager",
      "Mikasa Ackerman",
      "Levi Ackerman",
      "Armin Arlert",
    ],
    "Demon Slayer": [
      "Tanjiro Kamado",
      "Nezuko Kamado",
      "Zenitsu Agatsuma",
      "Inosuke Hashibira",
    ],
    "Jujutsu Kaisen": [
      "Yuji Itadori",
      "Megumi Fushiguro",
      "Nobara Kugisaki",
      "Satoru Gojo",
    ],
    "My Hero Academia": [
      "Izuku Midoriya",
      "Katsuki Bakugo",
      "Shoto Todoroki",
      "Ochaco Uraraka",
    ],
  };

  const characters = characterMap[series] || [
    "Anime Character",
    "Mystery Hero",
    "Unknown Fighter",
  ];
  return characters[Math.floor(Math.random() * characters.length)];
}

// Kategori-bazlı fallback hikaye oluşturma
function generateCategoryAwareFallbackStory(
  cardInfo: any,
  imageQuality?: ImageQualityMetrics,
  category?: string
): string {
  const { character, series, rarity } = cardInfo;
  const qualityScore = imageQuality?.quality?.qualityScore || 50;
  const categoryLower = (category || "anime-collection").toLowerCase();

  const powerLevel =
    rarity === "Legendary"
      ? "ultimate"
      : rarity === "Secret Rare"
        ? "extraordinary"
        : rarity === "Ultra Rare"
          ? "incredible"
          : rarity === "Super Rare"
            ? "powerful"
            : rarity === "Rare"
              ? "notable"
              : "emerging";

  // Kategori-bazlı hikaye şablonları
  if (categoryLower === "movies") {
    const movieStories = [
      `In the cinematic universe of ${series}, ${character} emerges as an ${powerLevel} hero. This ${rarity.toLowerCase()} card showcases their legendary status in Hollywood history. With blockbuster performances and unforgettable scenes, they have captivated audiences worldwide. The card's ${qualityScore > 70 ? "premium" : "standard"} quality reflects their box office impact and cultural significance in the film industry.`,

      `${character} takes center stage in the epic saga of ${series}, delivering ${powerLevel} performances that define modern cinema. This ${rarity.toLowerCase()} collectible represents their journey from rising star to Hollywood legend. Through dramatic scenes and action-packed sequences, they have earned their place among the greatest film icons. The ${qualityScore > 70 ? "pristine" : "classic"} condition of this card mirrors their timeless appeal.`,

      `From the silver screen comes ${character}, the ${powerLevel} star of ${series}. This ${rarity.toLowerCase()} card captures the essence of their most memorable film moments and career-defining roles. With each performance, they have pushed the boundaries of storytelling and entertainment. The card's ${qualityScore > 70 ? "excellent" : "vintage"} preservation speaks to their enduring legacy in cinema history.`,
    ];
    return movieStories[Math.floor(Math.random() * movieStories.length)];
  }

  if (categoryLower === "games") {
    const gameStories = [
      `In the digital realm of ${series}, ${character} stands as an ${powerLevel} player character. This ${rarity.toLowerCase()} card represents their journey through countless levels, quests, and challenges. With gaming skills honed through endless hours of play, they have mastered every technique and strategy. The card's ${qualityScore > 70 ? "mint" : "played"} condition reflects their status as a legendary gaming icon.`,

      `${character} emerges from the virtual world of ${series} as an ${powerLevel} gaming legend. This ${rarity.toLowerCase()} collectible showcases their most epic gaming moments and high-score achievements. Through boss battles and competitive matches, they have proven their dominance in the gaming universe. The ${qualityScore > 70 ? "perfect" : "well-loved"} state of this card tells the story of their gaming prowess.`,

      `Born in the pixels of ${series}, ${character} has become an ${powerLevel} gaming champion. This ${rarity.toLowerCase()} card captures their evolution from rookie player to esports legend. With controller mastery and strategic thinking, they have conquered every challenge the gaming world offers. The card's ${qualityScore > 70 ? "flawless" : "battle-tested"} appearance represents their dedication to gaming excellence.`,
    ];
    return gameStories[Math.floor(Math.random() * gameStories.length)];
  }

  if (categoryLower === "sports") {
    const sportsStories = [
      `On the field of ${series}, ${character} performs as an ${powerLevel} athlete. This ${rarity.toLowerCase()} card commemorates their greatest sporting achievements and record-breaking performances. With dedication, training, and natural talent, they have reached the pinnacle of athletic excellence. The card's ${qualityScore > 70 ? "championship" : "season"} quality reflects their professional status and sporting legacy.`,

      `${character} dominates the arena of ${series} as an ${powerLevel} sports legend. This ${rarity.toLowerCase()} collectible represents years of intense training, competition, and victory. Through championships and memorable matches, they have inspired fans and fellow athletes alike. The ${qualityScore > 70 ? "hall-of-fame" : "rookie"} condition of this card speaks to their impact on sports history.`,

      `From the stadium lights of ${series} emerges ${character}, the ${powerLevel} athlete who redefined their sport. This ${rarity.toLowerCase()} card captures the intensity of their competitive spirit and unwavering determination. With each game, match, and season, they have pushed the boundaries of athletic achievement. The card's ${qualityScore > 70 ? "MVP" : "draft"} preservation honors their contribution to sports excellence.`,
    ];
    return sportsStories[Math.floor(Math.random() * sportsStories.length)];
  }

  if (categoryLower === "car" || categoryLower === "cars") {
    const carStories = [
      `On the asphalt of ${series}, ${character} roars as an ${powerLevel} automotive legend. This ${rarity.toLowerCase()} card represents the pinnacle of engineering excellence and speed mastery. With horsepower thundering through its engine and precision handling that defies physics, this machine has conquered racetracks and city streets alike. The card's ${qualityScore > 70 ? "showroom" : "garage"} condition reflects its status as a collector's dream and automotive masterpiece.`,

      `${character} dominates the racing world of ${series} as an ${powerLevel} speed demon. This ${rarity.toLowerCase()} collectible showcases years of automotive innovation, from wind tunnel testing to track victories. Through countless miles of rubber-burning acceleration and corner-carving precision, this vehicle has earned its place among automotive royalty. The ${qualityScore > 70 ? "concours" : "street"} quality of this card mirrors the machine's legendary performance heritage.`,

      `From the garage of ${series} emerges ${character}, the ${powerLevel} machine that redefined automotive excellence. This ${rarity.toLowerCase()} card captures the essence of pure mechanical perfection and driving passion. With each rev of its engine and shift of its transmission, it has pushed the boundaries of what's possible on four wheels. The card's ${qualityScore > 70 ? "pristine" : "well-driven"} preservation honors the legacy of automotive craftsmanship and speed.`,

      `In the world of ${series}, ${character} stands as an ${powerLevel} automotive icon that represents the perfect fusion of power, beauty, and engineering excellence. This ${rarity.toLowerCase()} card tells the story of countless hours of design, testing, and refinement that created a machine capable of stirring souls and quickening pulses. The ${qualityScore > 70 ? "museum-quality" : "enthusiast-owned"} condition speaks to its status as both a mechanical marvel and an object of desire.`,

      `${character} blazes across the highways of ${series} as an ${powerLevel} automotive legend born from passion and precision. This ${rarity.toLowerCase()} collectible represents the ultimate expression of speed, style, and technological innovation. From the drawing board to the finish line, every component has been crafted for maximum performance and visual impact. The card's ${qualityScore > 70 ? "collector-grade" : "daily-driven"} appearance tells the tale of a machine that lives to be driven and loved.`,
    ];
    return carStories[Math.floor(Math.random() * carStories.length)];
  }

  // Default anime stories
  const animeStories = [
    `In the mystical world of ${series}, ${character} stands as an ${powerLevel} warrior. Their ${rarity.toLowerCase()} abilities have been awakened through countless battles and training. With determination burning in their eyes, they face each challenge with unwavering courage. The card's ${qualityScore > 70 ? "exceptional" : "decent"} quality reflects the intensity of their power, ready to unleash devastating attacks against any opponent who dares to challenge them.`,

    `${character} emerges from the shadows of ${series} as an ${powerLevel} fighter. This ${rarity.toLowerCase()} card represents years of hard-fought victories and painful defeats that shaped their character. Their special techniques, honed through rigorous training, can turn the tide of any battle. The ${qualityScore > 70 ? "pristine" : "weathered"} appearance of this card tells the story of a hero who never gives up, no matter how impossible the odds may seem.`,

    `Born into the legendary world of ${series}, ${character} has earned their place among the ${powerLevel} warriors. This ${rarity.toLowerCase()} card captures the essence of their fighting spirit and unbreakable will. Through countless adventures and fierce battles, they have mastered abilities that strike fear into the hearts of their enemies. The card's ${qualityScore > 70 ? "magnificent" : "battle-worn"} condition speaks to the epic journey that brought them to this moment of ultimate power.`,
  ];

  return animeStories[Math.floor(Math.random() * animeStories.length)];
}

// Fallback hikaye oluşturma (geriye uyumluluk için)
function generateFallbackStory(
  cardInfo: any,
  imageQuality: ImageQualityMetrics
): string {
  return generateCategoryAwareFallbackStory(cardInfo, imageQuality, "anime");
}

// En basit hikaye (son çare)
function generateBasicFallbackStory(fileName: string): string {
  return `This mysterious card from the anime world holds untold power within its frame. Known simply as "${fileName}", this warrior has emerged from the depths of countless adventures to showcase their incredible abilities. Though their true origins remain shrouded in mystery, their determination and fighting spirit shine through every battle. This card represents the embodiment of courage, strength, and the unbreakable will that defines true heroes in the anime universe.`;
}

// Kategori-bazlı fallback kart bilgisi
function generateCategoryAwareFallbackCardInfo(
  fileName: string,
  category?: string
) {
  const categoryLower = (category || "anime-collection").toLowerCase();

  let defaultSeries = "Unknown Series";
  let defaultCharacter = "Unknown Character";

  if (categoryLower === "car-collection") {
    defaultSeries = "Car Collection";
    defaultCharacter = "Performance Vehicle";
  } else if (categoryLower === "star-collection") {
    defaultSeries = "Star Collection";
    defaultCharacter = "Celebrity Star";
  } else {
    defaultSeries = "Anime Collection";
    defaultCharacter = "Anime Character";
  }

  return {
    name: fileName,
    series: defaultSeries,
    character: defaultCharacter,
    rarity: "Common",
    stats: {
      attack: 30,
      defense: 30,
      speed: 30,
      hp: 60,
    },
  };
}

// Fallback kart bilgisi (geriye uyumluluk için)
function generateFallbackCardInfo(fileName: string) {
  return generateCategoryAwareFallbackCardInfo(fileName, "anime");
}

// OCR Service class - artık görsel kalite analizi yapıyor
export class OCRService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    console.log("Image Quality Analysis Service initialized");
    this.isInitialized = true;
  }

  async extractText(imageFile: File | string) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const fileName =
      typeof imageFile === "string"
        ? path.basename(imageFile, path.extname(imageFile))
        : imageFile.name;

    // Artık gerçek text değil, kalite analizi sonucu
    return {
      text: `Image quality analysis: ${fileName}`,
      confidence: 0.8,
      words: [],
    };
  }

  async extractCardInfo(imageFile: File | string) {
    const imagePath =
      typeof imageFile === "string" ? imageFile : imageFile.name;

    try {
      const result = await processCardImage(imagePath);
      return {
        ...result.cardInfo,
        confidence: result.confidence,
        imageQuality: result.imageQuality,
      };
    } catch (error) {
      const fileName =
        typeof imageFile === "string"
          ? path.basename(imageFile, path.extname(imageFile))
          : imageFile.name;

      return generateFallbackCardInfo(fileName);
    }
  }

  async terminate() {
    this.isInitialized = false;
    console.log("Image Quality Analysis Service terminated");
  }
}

// Singleton instance
export const ocrService = new OCRService();
