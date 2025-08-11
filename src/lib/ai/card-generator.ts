// Anime card property generator
export interface GeneratedCardProperties {
  cardTitle: string;
  attackPower: number;
  defense: number;
  speed: number;
  specialAbility: string;
  element: string;
  rarityLevel: number;
  rating: number;
}

// Wide variety of anime-themed prefixes (200+ options)
const titlePrefixes = [
  // Basic elements
  "Dragon",
  "Fire",
  "Ice",
  "Shadow",
  "Light",
  "Storm",
  "Lightning",
  "Crystal",
  "Golden",
  "Silver",
  "Dark",
  "Bright",
  "Wind",
  "Earth",
  "Water",
  "Air",

  // Automotive elements
  "Turbo",
  "Nitro",
  "Speed",
  "Racing",
  "Super",
  "Hyper",
  "Ultra",
  "Mega",
  "Power",
  "Boost",
  "Drift",
  "Street",
  "Track",
  "Highway",
  "Road",
  "Motor",
  "Engine",
  "Velocity",
  "Acceleration",
  "Performance",
  "Elite",
  "Premium",
  "Sport",
  "Grand",
  "Royal",
  "Imperial",
  "Supreme",
  "Ultimate",
  "Extreme",
  "Wild",
  "Beast",
  "Phantom",
  "Shadow",
  "Ghost",
  "Stealth",
  "Thunder",
  "Lightning",
  "Blaze",
  "Inferno",
  "Crimson",
  "Midnight",
  "Chrome",
  "Carbon",
  "Titanium",
  "Steel",

  // Warrior types
  "Warrior",
  "Guardian",
  "Hunter",
  "Mage",
  "Knight",
  "Ninja",
  "Samurai",
  "Monk",
  "Gladiator",
  "Berserker",
  "Champion",
  "Hero",
  "Attacker",
  "Defender",

  // Ranks
  "Prince",
  "Princess",
  "King",
  "Queen",
  "Emperor",
  "Master",
  "Expert",
  "Genius",
  "Lord",
  "Lady",
  "Duke",
  "Sultan",
  "Vizier",
  "General",
  "Captain",
  "Commander",

  // Mystical elements
  "Legendary",
  "Mythical",
  "Sacred",
  "Cursed",
  "Mysterious",
  "Magical",
  "Enchanted",
  "Arcane",
  "Ancient",
  "Elder",
  "Old",
  "New",
  "Future",
  "Past",
  "Eternal",
  "Infinite",

  // Nature elements
  "Forest",
  "Ocean",
  "Mountain",
  "Lake",
  "River",
  "Desert",
  "Glacier",
  "Volcano",
  "Flower",
  "Tree",
  "Leaf",
  "Root",
  "Branch",
  "Fruit",
  "Seed",
  "Petal",

  // Time and space
  "Time",
  "Space",
  "Dimension",
  "Portal",
  "Gate",
  "Bridge",
  "Path",
  "Trail",
  "Future",
  "Past",
  "Present",
  "Eternity",
  "Minute",
  "Second",
  "Century",
  "Era",

  // Powers
  "Power",
  "Energy",
  "Mana",
  "Chi",
  "Aura",
  "Spirit",
  "Soul",
  "Breath",
  "Heart",
  "Mind",
  "Body",
  "Life",
  "Death",
  "Birth",

  // Weapons and equipment
  "Sword",
  "Shield",
  "Spear",
  "Arrow",
  "Bow",
  "Axe",
  "Hammer",
  "Dagger",
  "Staff",
  "Rod",
  "Wand",
  "Armor",
  "Helmet",
  "Boot",
  "Glove",
  "Cloak",

  // Colors and light
  "White",
  "Black",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Orange",
  "Pink",
  "Gray",
  "Brown",
  "Golden",
  "Silver",
  "Bronze",
  "Platinum",
  "Crystal",

  // Animals and mythological creatures
  "Lion",
  "Tiger",
  "Wolf",
  "Eagle",
  "Hawk",
  "Snake",
  "Dragon",
  "Phoenix",
  "Unicorn",
  "Griffin",
  "Pegasus",
  "Hydra",
  "Kraken",
  "Sphinx",
  "Minotaur",
  "Centaur",

  // Emotional states
  "Brave",
  "Fear",
  "Rage",
  "Joy",
  "Sorrow",
  "Love",
  "Hate",
  "Hope",
  "Dream",
  "Nightmare",
  "Peace",
  "War",
  "Victory",
  "Defeat",
  "Honor",

  // Technology and future
  "Cyber",
  "Mecha",
  "Robot",
  "Android",
  "Hologram",
  "Laser",
  "Plasma",
  "Fusion",
  "Quantum",
  "Digital",
  "Virtual",
  "Matrix",
  "Code",
  "Data",
  "Signal",
  "Wave",

  // Music and art
  "Melody",
  "Rhythm",
  "Note",
  "Sound",
  "Music",
  "Song",
  "Dance",
  "Paint",
  "Poem",
  "Story",
  "Tale",
  "Epic",
  "Work",
  "Art",
  "Beauty",
  "Grace",

  // Seasons and weather
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
  "Sun",
  "Moon",
  "Star",
  "Meteor",
  "Dawn",
  "Sunrise",
  "Sunset",
  "Night",
  "Morning",
  "Noon",
  "Evening",
  "Twilight",
];

// English suffixes (150+ options)
const titleSuffixes = [
  // Body parts
  "Soul",
  "Heart",
  "Eye",
  "Breath",
  "Power",
  "Hand",
  "Foot",
  "Head",
  "Hair",
  "Skin",
  "Bone",
  "Blood",
  "Tear",
  "Voice",
  "Pulse",

  // Automotive suffixes
  "Engine",
  "Motor",
  "Turbo",
  "Boost",
  "Drive",
  "Gear",
  "Wheel",
  "Tire",
  "Brake",
  "Clutch",
  "Throttle",
  "Exhaust",
  "Intake",
  "Piston",
  "Cylinder",
  "Valve",
  "Cam",
  "Crank",
  "Transmission",
  "Differential",
  "Suspension",
  "Chassis",
  "Frame",
  "Body",
  "Hood",
  "Trunk",
  "Door",
  "Window",
  "Mirror",
  "Bumper",
  "Spoiler",
  "Wing",
  "Fin",
  "Vent",
  "Scoop",
  "Grille",
  "Headlight",
  "Taillight",
  "Dashboard",
  "Cockpit",
  "Cabin",
  "Seat",
  "Steering",
  "Pedal",
  "Shifter",
  "Gauge",
  "Speedometer",
  "Tachometer",
  "Fuel",
  "Oil",
  "Coolant",
  "Radiator",
  "Filter",
  "Spark",
  "Ignition",
  "Starter",
  "Alternator",
  "Battery",
  "ECU",
  "Computer",
  "Sensor",
  "Injector",
  "Manifold",
  "Header",
  "Catalytic",
  "Muffler",
  "Pipe",
  "System",
  "Kit",
  "Package",
  "Edition",
  "Series",
  "Model",
  "Version",
  "Spec",
  "Tune",
  "Mod",
  "Upgrade",
  "Performance",
  "Racing",
  "Street",
  "Track",
  "Drift",
  "Drag",
  "Circuit",
  "Rally",
  "Endurance",
  "Sprint",
  "Time",
  "Attack",
  "Challenge",
  "Championship",
  "Trophy",
  "Winner",
  "Champion",
  "Legend",
  "Icon",
  "Classic",
  "Vintage",
  "Retro",
  "Modern",
  "Future",
  "Concept",
  "Prototype",
  "Custom",
  "Special",
  "Limited",
  "Exclusive",
  "Rare",
  "Unique",
  "One",
  "Elite",
  "Premium",
  "Luxury",
  "Sport",
  "Super",
  "Hyper",
  "Ultra",
  "Mega",
  "Extreme",
  "Wild",
  "Beast",
  "Monster",
  "Demon",
  "Devil",
  "Angel",
  "Ghost",
  "Phantom",
  "Shadow",
  "Stealth",
  "Thunder",
  "Lightning",
  "Storm",
  "Hurricane",
  "Tornado",
  "Cyclone",
  "Typhoon",
  "Blizzard",
  "Inferno",
  "Blaze",
  "Fire",
  "Flame",
  "Burn",
  "Heat",
  "Ice",
  "Freeze",
  "Chill",
  "Cool",
  "Cold",

  // Weapons and equipment
  "Sword",
  "Shield",
  "Fist",
  "Spear",
  "Arrow",
  "Bow",
  "Axe",
  "Hammer",
  "Dagger",
  "Staff",
  "Rod",
  "Wand",
  "Armor",
  "Helmet",
  "Boot",
  "Glove",

  // Animal features
  "Wing",
  "Claw",
  "Fang",
  "Tail",
  "Mane",
  "Nail",
  "Beak",
  "Nose",
  "Ear",
  "Paw",
  "Hide",
  "Feather",
  "Scale",
  "Horn",
  "Antenna",
  "Jaw",

  // Light and shadow
  "Shadow",
  "Light",
  "Glow",
  "Flame",
  "Ice",
  "Lightning",
  "Radiance",
  "Brightness",
  "Ray",
  "Beam",
  "Flash",
  "Vibration",
  "Wave",
  "Energy",

  // Roles and professions
  "Hunter",
  "Guardian",
  "Master",
  "Expert",
  "Warrior",
  "Mage",
  "Knight",
  "Ninja",
  "Samurai",
  "Monk",
  "Gladiator",
  "Berserker",
  "Champion",
  "Hero",

  // Hierarchy
  "Prince",
  "Princess",
  "King",
  "Queen",
  "Emperor",
  "Lady",
  "Lord",
  "Judge",
  "Leader",
  "Commander",
  "General",
  "Captain",
  "Chief",
  "Guide",

  // Nature elements
  "Wind",
  "Storm",
  "Rain",
  "Snow",
  "Ice",
  "Fire",
  "Lava",
  "Magma",
  "Earth",
  "Rock",
  "Crystal",
  "Diamond",
  "Pearl",
  "Coral",
  "Shell",
  "Ruby",

  // Time and space
  "Time",
  "Space",
  "Dimension",
  "Portal",
  "Gate",
  "Bridge",
  "Path",
  "Trail",
  "Future",
  "Past",
  "Present",
  "Eternity",
  "Minute",
  "Second",
  "Century",
  "Era",

  // Emotions
  "Courage",
  "Fear",
  "Rage",
  "Joy",
  "Sorrow",
  "Love",
  "Hate",
  "Hope",
  "Dream",
  "Nightmare",
  "Peace",
  "War",
  "Victory",
  "Defeat",
  "Honor",

  // Powers and abilities
  "Magic",
  "Spell",
  "Power",
  "Might",
  "Energy",
  "Mana",
  "Aura",
  "Chi",
  "Skill",
  "Ability",
  "Mastery",
  "Experience",
  "Knowledge",
  "Wisdom",
  "Intelligence",
  "Mind",

  // Aesthetic qualities
  "Beauty",
  "Grace",
  "Majesty",
  "Glory",
  "Dignity",
  "Nobility",
  "Elegance",
  "Charm",
  "Appeal",
  "Allure",
  "Attraction",
  "Style",
];

// Character names (300+ options)
const characterNames = [
  // Japanese-themed names
  "Akira",
  "Yuki",
  "Sakura",
  "Hiro",
  "Rei",
  "Sora",
  "Kyo",
  "Rin",
  "Ryu",
  "Yoko",
  "Kage",
  "Shiro",
  "Kuro",
  "Aoi",
  "Midori",
  "Aka",
  "Ki",
  "Momo",
  "Hana",
  "Tsuki",
  "Hoshi",
  "Ame",
  "Kaze",
  "Yama",
  "Umi",
  "Mori",
  "Tani",
  "Kawa",
  "Ishi",
  "Tetsu",
  "Gin",
  "Kin",
  "Mizu",
  "Hi",
  "Kori",
  "Kaminari",
  "Niji",
  "Kumo",
  "Taiyou",
  "Getsu",

  // Additional Japanese names
  "Takeshi",
  "Kenji",
  "Naoki",
  "Hiroshi",
  "Satoshi",
  "Masato",
  "Kazuki",
  "Ryouta",
  "Shingo",
  "Daiki",
  "Yuuki",
  "Kouki",
  "Shougo",
  "Takumi",
  "Riku",
  "Haruto",
  "Ami",
  "Yui",
  "Eri",
  "Miki",
  "Nana",
  "Kana",
  "Aya",
  "Mai",
  "Saki",
  "Risa",
  "Mao",
  "Rio",
  "Ai",
  "Yu",
  "An",
  "Ran",
  "Nao",
  "Kao",
  "Rei",
  "Sae",

  // Fantasy names
  "Zephyr",
  "Nova",
  "Orion",
  "Luna",
  "Stella",
  "Aurora",
  "Phoenix",
  "Atlas",
  "Iris",
  "Echo",
  "Sage",
  "River",
  "Storm",
  "Raven",
  "Wolf",
  "Bear",
  "Fox",
  "Hawk",
  "Eagle",
  "Lion",
  "Tiger",
  "Dragon",
  "Serpent",
  "Panther",

  // English fantasy names
  "Blaze",
  "Storm",
  "Sea",
  "River",
  "Vale",
  "Stone",
  "Steel",
  "Sage",
  "Dawn",
  "Dusk",
  "Light",
  "Shadow",
  "Frost",
  "Ember",
  "Spark",
  "Flame",
  "Wind",
  "Rain",
  "Snow",
  "Thunder",
  "Spirit",
  "Ghost",
  "Angel",
  "Demon",

  // Mystical names
  "Ardor",
  "Blaze",
  "Cipher",
  "Dusk",
  "Ember",
  "Frost",
  "Gale",
  "Haven",
  "Inferno",
  "Jade",
  "Karma",
  "Lumen",
  "Mystic",
  "Nexus",
  "Onyx",
  "Prism",
  "Quartz",
  "Radiance",
  "Shadow",
  "Titan",
  "Unity",
  "Vortex",
  "Whisper",
  "Xenon",

  // Anime character style names
  "Aizen",
  "Byakuya",
  "Ichigo",
  "Kakashi",
  "Naruto",
  "Sasuke",
  "Goku",
  "Vegeta",
  "Gohan",
  "Piccolo",
  "Luffy",
  "Zoro",
  "Sanji",
  "Nami",
  "Robin",
  "Chopper",
  "Edward",
  "Alphonse",
  "Roy",
  "Winry",
  "Izuku",
  "Bakugo",
  "Todoroki",
  "Ochaco",

  // More options
  "Akane",
  "Chiaki",
  "Emiko",
  "Fumiko",
  "Hanako",
  "Ikuko",
  "Junko",
  "Kimiko",
  "Machiko",
  "Noriko",
  "Reiko",
  "Sachiko",
  "Tomoko",
  "Yasuko",
  "Yukiko",
  "Sumiko",
  "Daichi",
  "Eiji",
  "Goro",
  "Hideki",
  "Isamu",
  "Jiro",
  "Katsu",
  "Mamoru",
  "Noboru",
  "Osamu",
  "Shinji",
  "Tadashi",
  "Yasuo",
  "Makoto",
  "Minoru",
  "Yoshio",

  // Additional names
  "Asuka",
  "Shinji",
  "Gendo",
  "Misato",
  "Toji",
  "Kensuke",
  "Kaworu",
  "Kaji",
  "Natsu",
  "Gray",
  "Erza",
  "Lucy",
  "Wendy",
  "Gajeel",
  "Levy",
  "Juvia",
  "Levi",
  "Mikasa",
  "Armin",
  "Eren",
  "Historia",
  "Ymir",
  "Jean",
  "Connie",
  "Tanjiro",
  "Nezuko",
  "Zenitsu",
  "Inosuke",
  "Giyu",
  "Shinobu",
  "Rengoku",
  "Tengen",

  // Western fantasy names
  "Alexander",
  "Arthur",
  "Marcus",
  "Victor",
  "Gabriel",
  "Michael",
  "Raphael",
  "Sebastian",
  "Vincent",
  "Adrian",
  "Damien",
  "Lucian",
  "Valerian",
  "Maximilian",
  "Constantine",
  "Theodore",
  "Isabella",
  "Victoria",
  "Catherine",
  "Elizabeth",
  "Anastasia",
  "Seraphina",
  "Evangeline",
  "Valentina",
  "Liliana",
  "Arabella",
  "Celestine",
  "Aurelia",
  "Cordelia",
  "Ophelia",
];

// Element types
const elements = ["Fire", "Water", "Air", "Earth", "Dark", "Light"];

// Special abilities
const specialAbilities = [
  "Fire Storm - Surrounds enemies with burning flames",
  "Ice Shield - Creates freezing defense that blocks attacks",
  "Lightning Strike - Attacks at lightning speed",
  "Shadow Jump - Becomes invisible in darkness and attacks",
  "Light Burst - Blinds enemies with dazzling light",
  "Wind Circle - Creates hurricane-force winds",
  "Earth Armor - Forms protective armor from rocks",
  "Water Wave - Attacks with powerful water waves",
  "Crystal Prison - Traps enemies in crystal cage",
  "Golden Ray - Turns everything it touches to gold",
  "Silver Shield - Reflects magical attacks",
  "Dragon Breath - Burns and scorches with fire breath",
  "Tiger Claw - Fast attack with sharp claws",
  "Eagle Dive - Sudden attack from above",
  "Wolf Howl - Strengthens nearby allies",
  "Lion Roar - Frightens and scares away enemies",
  "Phoenix Rebirth - Returns stronger when defeated",
  "Time Stop - Stops time for a short period",
  "Dimension Jump - Leaps to different dimensions",
  "Soul Drain - Steals enemy energy",
  "Mind Reader - Learns enemy plans",
  "Invisibility - Becomes completely invisible",
  "Multiplication - Creates copies of itself",
  "Giant Growth - Grows to massive size",
  "Shrinking - Reduces enemies to tiny size",
  "Freezing Gaze - Freezes what it looks at",
  "Hypnosis - Charms and controls enemies",
  "Sound Wave - Attacks with powerful sound waves",
  "Magnetic Field - Controls metal objects",
  "Reflection - Reflects attacks back",
];

// Element color coding
export const getElementColor = (element: string): string => {
  const colors: { [key: string]: string } = {
    Fire: "bg-red-100 text-red-800",
    Water: "bg-blue-100 text-blue-800",
    Air: "bg-green-100 text-green-800",
    Earth: "bg-yellow-100 text-yellow-800",
    Dark: "bg-gray-100 text-gray-800",
    Light: "bg-orange-100 text-orange-800",
  };
  return colors[element] || "bg-gray-100 text-gray-800";
};

// Power statistic colors
export const getPowerColor = (power: number): string => {
  if (power >= 80) return "text-red-600";
  if (power >= 60) return "text-orange-600";
  if (power >= 40) return "text-yellow-600";
  return "text-green-600";
};

// Star rating
export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const emptyStars = 10 - Math.ceil(rating);
  return "★".repeat(fullStars) + "☆".repeat(emptyStars);
};

// Unique name generator function
export async function generateUniqueCardTitle(): Promise<string> {
  const { prisma } = await import("../prisma");

  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const prefix =
      titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
    const suffix =
      titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)];
    const character =
      characterNames[Math.floor(Math.random() * characterNames.length)];

    // Try 3 different formats
    const formats = [
      `${prefix} ${character}`,
      `${character} ${suffix}`,
      `${prefix} ${suffix} ${character}`,
    ];

    const cardTitle = formats[Math.floor(Math.random() * formats.length)];

    // Check if this name has been used in database
    const existingName = await prisma.usedCardNames.findUnique({
      where: { cardTitle },
    });

    if (!existingName) {
      return cardTitle;
    }

    attempts++;
  }

  // If no unique name found after 100 attempts, add timestamp
  const timestamp = Date.now().toString().slice(-4);
  const prefix =
    titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
  const character =
    characterNames[Math.floor(Math.random() * characterNames.length)];
  return `${prefix} ${character} ${timestamp}`;
}

// Main card property generator function
export async function generateRandomCardProperties(
  estimatedValue: number = 0
): Promise<GeneratedCardProperties> {
  // Generate unique name
  const cardTitle = await generateUniqueCardTitle();

  // Determine power levels based on value
  const valueTier = Math.min(Math.floor(estimatedValue / 10) + 1, 10);

  // Power statistics (based on value)
  const baseLevel = Math.max(20, valueTier * 8);
  const attackPower = Math.min(
    100,
    baseLevel + Math.floor(Math.random() * 20) - 10
  );
  const defense = Math.min(
    100,
    baseLevel + Math.floor(Math.random() * 20) - 10
  );
  const speed = Math.min(100, baseLevel + Math.floor(Math.random() * 20) - 10);

  // Element selection
  const element = elements[Math.floor(Math.random() * elements.length)];

  // Special ability selection
  const specialAbility =
    specialAbilities[Math.floor(Math.random() * specialAbilities.length)];

  // Rarity level (based on value)
  const rarityLevel = Math.min(
    10,
    Math.max(1, Math.floor(estimatedValue / 15) + 1)
  );

  // Overall rating calculation (power stats + value + rarity level)
  const averagePower = (attackPower + defense + speed) / 3;
  const rating = Math.min(
    10,
    Math.max(
      1,
      (averagePower * 0.4 + estimatedValue * 0.3 + rarityLevel * 0.3) / 10
    )
  );

  return {
    cardTitle,
    attackPower,
    defense,
    speed,
    specialAbility,
    element,
    rarityLevel,
    rating: Math.round(rating * 10) / 10,
  };
}

// Save used name
export async function saveUsedCardName(
  cardId: string,
  cardTitle: string
): Promise<void> {
  const { prisma } = await import("../prisma");

  try {
    console.log(`💾 Saving card name: ${cardTitle} for cardId: ${cardId}`);

    // First check if this cardId already has a record
    const existingRecord = await prisma.usedCardNames.findUnique({
      where: { cardId },
    });

    if (existingRecord) {
      // If record exists, only update if the cardTitle is different and doesn't conflict
      if (existingRecord.cardTitle !== cardTitle) {
        // Check if the new cardTitle is already used by another record
        const conflictingRecord = await prisma.usedCardNames.findUnique({
          where: { cardTitle },
        });

        if (conflictingRecord && conflictingRecord.cardId !== cardId) {
          // The new cardTitle conflicts with another record, so keep the existing one
          console.log(
            `⚠️ Card title "${cardTitle}" conflicts with existing record. Keeping existing title: ${existingRecord.cardTitle} for cardId: ${cardId}`
          );
          return; // Don't update, keep existing
        } else {
          // Safe to update
          await prisma.usedCardNames.update({
            where: { cardId },
            data: { cardTitle },
          });
          console.log(
            `✅ Updated existing card name record for cardId: ${cardId}`
          );
        }
      } else {
        console.log(
          `✅ Card name already exists and matches for cardId: ${cardId}`
        );
      }
    } else {
      // Create new record, but handle potential cardTitle conflicts
      let finalCardTitle = cardTitle;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        try {
          await prisma.usedCardNames.create({
            data: {
              cardTitle: finalCardTitle,
              cardId,
            },
          });
          console.log(
            `✅ Created new card name record: ${finalCardTitle} for cardId: ${cardId}`
          );
          break;
        } catch (createError) {
          // Check if it's a unique constraint error on cardTitle
          if (
            createError &&
            typeof createError === "object" &&
            "code" in createError &&
            createError.code === "P2002"
          ) {
            attempts++;
            const timestamp = Date.now().toString().slice(-4);
            const randomSuffix = Math.random().toString(36).substring(2, 6);
            finalCardTitle = `${cardTitle}_${timestamp}_${randomSuffix}`;
            console.log(
              `⚠️ Card title conflict, retrying with: ${finalCardTitle} (attempt ${attempts})`
            );
          } else {
            throw createError;
          }
        }
      }

      if (attempts >= maxAttempts) {
        console.error(
          `❌ Failed to create unique card title after ${maxAttempts} attempts for cardId: ${cardId}`
        );
        throw new Error(
          `Failed to create unique card title for cardId: ${cardId}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Failed to save card name:", error);
    // Don't throw the error, just log it and continue - this shouldn't stop the analysis
    console.warn(
      `⚠️ Continuing analysis despite card name save failure for cardId: ${cardId}`
    );
  }
}
