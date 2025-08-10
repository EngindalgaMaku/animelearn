import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Sample cards data with all required fields (categories are seeded in main seed.ts)
export const cardsData = [
  {
    id: "cme07bm0n0010wcmww1qbsgfd",
    imagePath:
      "/uploads/6b3eafaa-0a3f-43ce-ac17-31002f38facd_1754498861789_d63v.jpg",
    fileName: "6b3eafaa-0a3f-43ce-ac17-31002f38facd_1754498861789_d63v.jpg",
    imageUrl:
      "/uploads/6b3eafaa-0a3f-43ce-ac17-31002f38facd_1754498861789_d63v.jpg",
    thumbnailUrl:
      "/uploads/thumbs/thumb_6b3eafaa-0a3f-43ce-ac17-31002f38facd_1754498861789_d63v.jpg",
    name: "Celebrity Star Card",
    series: "Star Collection",
    character: "Famous Celebrity",
    category: "star",
    rarity: "rare",
    condition: "Mint",
    estimatedValue: 150.0,
    diamondPrice: 150,
    element: "light",
    isAnalyzed: true,
    isVerified: true,
    confidence: 95.0,
    fileHash: "f2a397726cd56055dad25f1f126acee3",
    uploadDate: new Date("2025-08-07T11:26:16.711Z"),
    updatedAt: new Date("2025-08-07T11:26:16.711Z"),
  },
  {
    id: "cme014gi30006wc6o5te8v80z",
    imagePath:
      "/uploads/96101c28-b7e8-4bcf-93a4-b946c623fdf7_1754488450341_v4wc.jpg",
    fileName: "96101c28-b7e8-4bcf-93a4-b946c623fdf7_1754488450341_v4wc.jpg",
    imageUrl:
      "/uploads/96101c28-b7e8-4bcf-93a4-b946c623fdf7_1754488450341_v4wc.jpg",
    thumbnailUrl:
      "/uploads/thumbs/thumb_96101c28-b7e8-4bcf-93a4-b946c623fdf7_1754488450341_v4wc.jpg",
    name: "Rising Star",
    series: "Star Collection",
    character: "Popular Celebrity",
    category: "star",
    rarity: "uncommon",
    condition: "Good",
    estimatedValue: 100.0,
    diamondPrice: 100,
    element: "light",
    isAnalyzed: true,
    isVerified: true,
    confidence: 85.0,
    fileHash: "659cfaa5415dd7ac7c2441a451bf6f3e",
    uploadDate: new Date("2025-08-06T23:50:54.923Z"),
    updatedAt: new Date("2025-08-06T23:50:54.923Z"),
  },
  {
    id: "cme07bgqm000bwcmwrzt702c0",
    imagePath:
      "/uploads/cc51cb2b-1d55-4c35-80bb-4bbd30251371_1754498854936_ngnn.jpg",
    fileName: "cc51cb2b-1d55-4c35-80bb-4bbd30251371_1754498854936_ngnn.jpg",
    imageUrl:
      "/uploads/cc51cb2b-1d55-4c35-80bb-4bbd30251371_1754498854936_ngnn.jpg",
    thumbnailUrl:
      "/uploads/thumbs/thumb_cc51cb2b-1d55-4c35-80bb-4bbd30251371_1754498854936_ngnn.jpg",
    name: "Celebrity Icon",
    series: "Star Collection",
    character: "Media Personality",
    category: "star",
    rarity: "uncommon",
    condition: "Good",
    estimatedValue: 110.0,
    diamondPrice: 110,
    element: "light",
    isAnalyzed: true,
    isVerified: true,
    confidence: 90.0,
    fileHash: "5617d2897391912be26301937818cf5a",
    uploadDate: new Date("2025-08-06T23:50:55.832Z"),
    updatedAt: new Date("2025-08-06T23:50:55.832Z"),
  },
  {
    id: "cme0n1bbd004cwcdklpd2dro1",
    imagePath:
      "/uploads/8a9d0c77-14dc-4783-92fa-beabf0b424ee_1754525255204_q0mx.jpg",
    fileName: "8a9d0c77-14dc-4783-92fa-beabf0b424ee_1754525255204_q0mx.jpg",
    imageUrl:
      "/uploads/8a9d0c77-14dc-4783-92fa-beabf0b424ee_1754525255204_q0mx.jpg",
    thumbnailUrl:
      "/uploads/thumbs/thumb_8a9d0c77-14dc-4783-92fa-beabf0b424ee_1754525255204_q0mx.jpg",
    name: "Anime Hero",
    series: "Popular Anime",
    character: "Main Character",
    category: "anime",
    rarity: "rare",
    condition: "Mint",
    estimatedValue: 200.0,
    diamondPrice: 200,
    element: "fire",
    attackPower: 850,
    defense: 750,
    speed: 900,
    specialAbility: "Fire Blast Attack",
    isAnalyzed: true,
    isVerified: true,
    confidence: 95.0,
    fileHash: "f6df659f07f13aaed5a3f75e7e1c003f",
    uploadDate: new Date("2025-08-07T11:12:47.889Z"),
    updatedAt: new Date("2025-08-07T11:12:47.889Z"),
  },
  {
    id: "cme1farfo0008wcykmsaaviu5",
    imagePath:
      "/uploads/f49ed2f7-8b49-4502-9432-4fb3ec6dfe25_1754572725200_608i.jpg",
    fileName: "f49ed2f7-8b49-4502-9432-4fb3ec6dfe25_1754572725200_608i.jpg",
    imageUrl:
      "/uploads/f49ed2f7-8b49-4502-9432-4fb3ec6dfe25_1754572725200_608i.jpg",
    thumbnailUrl:
      "/uploads/thumbs/thumb_f49ed2f7-8b49-4502-9432-4fb3ec6dfe25_1754572725200_608i.jpg",
    name: "Anime Warrior",
    series: "Action Anime",
    character: "Side Character",
    category: "anime",
    rarity: "uncommon",
    condition: "Good",
    estimatedValue: 120.0,
    diamondPrice: 120,
    element: "water",
    attackPower: 650,
    defense: 600,
    speed: 700,
    specialAbility: "Water Shield",
    isAnalyzed: true,
    isVerified: true,
    confidence: 85.0,
    fileHash: "49eaf2d9947a7c67ad64f124646b11d8",
    uploadDate: new Date("2025-08-07T13:32:36.644Z"),
    updatedAt: new Date("2025-08-07T13:32:36.644Z"),
  },
  {
    id: "cme169igx0000wc3c7shmzfby",
    imagePath:
      "/uploads/43cdc543-7833-408e-a730-a0a6a96ab81b_1754557550369_rurt.jpg",
    fileName: "43cdc543-7833-408e-a730-a0a6a96ab81b_1754557550369_rurt.jpg",
    imageUrl:
      "/uploads/43cdc543-7833-408e-a730-a0a6a96ab81b_1754557550369_rurt.jpg",
    thumbnailUrl:
      "/uploads/thumbs/thumb_43cdc543-7833-408e-a730-a0a6a96ab81b_1754557550369_rurt.jpg",
    name: "Sports Car",
    series: "Car Collection",
    character: "Ferrari",
    category: "car",
    rarity: "common",
    condition: "Good",
    estimatedValue: 80.0,
    diamondPrice: 80,
    element: "speed",
    isAnalyzed: true,
    isVerified: true,
    confidence: 85.0,
    fileHash: "df152a76e0574b8da780d6d51eb87b0c",
    uploadDate: new Date("2025-08-07T10:53:51.370Z"),
    updatedAt: new Date("2025-08-07T10:53:51.370Z"),
  },
  {
    id: "cme169irr0001wc3c3ihhy99o",
    imagePath:
      "/uploads/1f2e7d93-daee-46d0-8de1-441e2e816f3a_1754557550816_7o5l.jpg",
    fileName: "1f2e7d93-daee-46d0-8de1-441e2e816f3a_1754557550816_7o5l.jpg",
    imageUrl:
      "/uploads/1f2e7d93-daee-46d0-8de1-441e2e816f3a_1754557550816_7o5l.jpg",
    thumbnailUrl:
      "/uploads/thumbs/thumb_1f2e7d93-daee-46d0-8de1-441e2e816f3a_1754557550816_7o5l.jpg",
    name: "Luxury Supercar",
    series: "Car Collection",
    character: "Lamborghini",
    category: "car",
    rarity: "epic",
    condition: "Mint",
    estimatedValue: 300.0,
    diamondPrice: 300,
    element: "speed",
    isAnalyzed: true,
    isVerified: true,
    confidence: 75.0,
    fileHash: "c7ea5185be65b01ab0f05f3fa0d645d7",
    uploadDate: new Date("2025-08-07T10:54:02.710Z"),
    updatedAt: new Date("2025-08-07T10:54:02.710Z"),
  },
  {
    id: "cme07bncf0015wcmwqdrglo4f",
    imagePath:
      "/uploads/b43d6b02-ced9-4242-af67-59d2fa232de7_1754498863392_fphm.jpg",
    fileName: "b43d6b02-ced9-4242-af67-59d2fa232de7_1754498863392_fphm.jpg",
    imageUrl:
      "/uploads/b43d6b02-ced9-4242-af67-59d2fa232de7_1754498863392_fphm.jpg",
    thumbnailUrl:
      "/uploads/thumbs/thumb_b43d6b02-ced9-4242-af67-59d2fa232de7_1754498863392_fphm.jpg",
    name: "Hollywood Star",
    series: "Star Collection",
    character: "A-List Celebrity",
    category: "star",
    rarity: "ultra-rare",
    condition: "Mint",
    estimatedValue: 500.0,
    diamondPrice: 500,
    element: "light",
    isAnalyzed: true,
    isVerified: true,
    confidence: 75.0,
    fileHash: "8613c1c30dd5f015b7bd7899cca69082",
    uploadDate: new Date("2025-08-07T11:26:16.701Z"),
    updatedAt: new Date("2025-08-07T11:26:16.701Z"),
  },
  {
    id: "cme07bio2000kwcmwymz6gd2s",
    imagePath:
      "/uploads/92a16e76-93e0-4c09-a58a-b9813e30fe65_1754498857475_7agx.jpg",
    fileName: "92a16e76-93e0-4c09-a58a-b9813e30fe65_1754498857475_7agx.jpg",
    imageUrl:
      "/uploads/92a16e76-93e0-4c09-a58a-b9813e30fe65_1754498857475_7agx.jpg",
    thumbnailUrl:
      "/uploads/thumbs/thumb_92a16e76-93e0-4c09-a58a-b9813e30fe65_1754498857475_7agx.jpg",
    name: "Music Star",
    series: "Star Collection",
    character: "Pop Icon",
    category: "star",
    rarity: "ultra-rare",
    condition: "Mint",
    estimatedValue: 450.0,
    diamondPrice: 450,
    element: "light",
    isAnalyzed: true,
    isVerified: true,
    confidence: 85.0,
    fileHash: "eb2ce2f4e3fd6c3753713af07465c2c6",
    uploadDate: new Date("2025-08-06T23:51:00.712Z"),
    updatedAt: new Date("2025-08-06T23:51:00.712Z"),
  },
  {
    id: "cme07byyu002fwcmwpfqp5qn2",
    imagePath:
      "/uploads/95e992e4-00f2-49a4-bee1-a7041d2b2fe4_1754498878591_9c6k.jpg",
    fileName: "95e992e4-00f2-49a4-bee1-a7041d2b2fe4_1754498878591_9c6k.jpg",
    imageUrl:
      "/uploads/95e992e4-00f2-49a4-bee1-a7041d2b2fe4_1754498878591_9c6k.jpg",
    thumbnailUrl:
      "/uploads/thumbs/thumb_95e992e4-00f2-49a4-bee1-a7041d2b2fe4_1754498878591_9c6k.jpg",
    name: "Movie Star",
    series: "Star Collection",
    character: "Leading Actor",
    category: "star",
    rarity: "super-rare",
    condition: "Good",
    estimatedValue: 350.0,
    diamondPrice: 350,
    element: "light",
    isAnalyzed: true,
    isVerified: true,
    confidence: 85.0,
    fileHash: "3f0bbbfaaf44979b9143c30707af60b9",
    uploadDate: new Date("2025-08-06T23:51:03.551Z"),
    updatedAt: new Date("2025-08-06T23:51:03.551Z"),
  },
];

export async function seedCards() {
  console.log("🎴 Seeding sample cards...");

  // Seed cards only (categories are already seeded in main seed.ts)
  for (const card of cardsData) {
    const existingCard = await prisma.card.findUnique({
      where: { id: card.id },
    });

    if (!existingCard) {
      await prisma.card.create({
        data: card,
      });
      console.log(`✅ Created card: ${card.name} (${card.rarity})`);
    } else {
      console.log(`⏭️ Card already exists: ${card.name}`);
    }
  }

  console.log(`🎯 Card seeding completed! Cards: ${cardsData.length}`);
}
