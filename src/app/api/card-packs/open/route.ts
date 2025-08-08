import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthUser {
  userId: string;
  username: string;
}

function getUserFromToken(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Rarity weights for card drop rates
const RARITY_WEIGHTS = {
  common: 60,     // %60
  uncommon: 25,   // %25
  rare: 10,       // %10
  epic: 4,        // %4
  legendary: 1,   // %1
};

// POST - Kart paketi aç
export async function POST(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { packId, sourceType, sourceId } = body;

    // Validation
    if (!packId) {
      return NextResponse.json(
        { error: "Pack ID gerekli" },
        { status: 400 }
      );
    }

    // Kullanıcı bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Kart paketi bilgilerini al
    const cardPack = await prisma.cardPack.findUnique({
      where: {
        id: packId,
        isActive: true,
      },
    });

    if (!cardPack) {
      return NextResponse.json({ error: "Kart paketi bulunamadı" }, { status: 404 });
    }

    // Seviye kontrolü
    if (user.level < cardPack.requiredLevel) {
      return NextResponse.json({
        error: `Bu paketi açmak için ${cardPack.requiredLevel}. seviye gerekli`
      }, { status: 400 });
    }

    // Diamond kontrolü (eğer paket ücretliyse)
    if (cardPack.diamondPrice && user.currentDiamonds < cardPack.diamondPrice) {
      return NextResponse.json({
        error: `Yetersiz diamond. ${cardPack.diamondPrice} diamond gerekli`
      }, { status: 400 });
    }

    // Mevcut kartları al (rastgele seçim için)
    const availableCards = await prisma.card.findMany();

    if (availableCards.length === 0) {
      return NextResponse.json({
        error: "Hiç kart bulunamadı"
      }, { status: 500 });
    }

    // Kart çek
    const drawnCards = await drawCards(cardPack, availableCards);

    // Kullanıcıya kartları ver
    const userCards = [];
    for (const card of drawnCards) {
      // Kullanıcının bu kartı var mı kontrol et
      let userCard = await prisma.userCard.findUnique({
        where: {
          userId_cardId: {
            userId: user.id,
            cardId: card.id,
          },
        },
      });

      if (userCard) {
        // Kart zaten var, sadece tarih güncelle
        userCard = await prisma.userCard.update({
          where: { id: userCard.id },
          data: {
            purchaseDate: new Date(),
          },
        });
        
        userCards.push({
          ...card,
          isNew: false,
          alreadyOwned: true,
        });
      } else {
        // Yeni kart ekle
        userCard = await prisma.userCard.create({
          data: {
            userId: user.id,
            cardId: card.id,
            purchasePrice: 0, // Pack'ten çıkan kartlar için fiyat 0
            purchaseDate: new Date(),
          },
        });
        
        userCards.push({
          ...card,
          isNew: true,
          alreadyOwned: false,
        });
      }
    }

    // Diamond ödemesi (eğer gerekiyorsa)
    if (cardPack.diamondPrice) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          currentDiamonds: { decrement: cardPack.diamondPrice },
        },
      });

      // Diamond transaction kaydet
      await prisma.diamondTransaction.create({
        data: {
          userId: user.id,
          amount: -cardPack.diamondPrice,
          type: "CARD_PACK_PURCHASE",
          description: `Kart paketi satın alındı: ${cardPack.name}`,
          relatedType: "card_pack",
          relatedId: cardPack.id,
        },
      });
    }

    // Pack opening kaydet
    await prisma.cardPackOpening.create({
      data: {
        userId: user.id,
        packId: cardPack.id,
        cardsReceived: JSON.stringify(drawnCards.map(c => c.id)),
        sourceType: sourceType || "purchase",
        sourceId: sourceId,
      },
    });

    // İstatistik güncellemesi için şimdilik geçiyoruz
    // Gelecekte User modeline istatistik alanları eklenebilir

    return NextResponse.json({
      success: true,
      message: `${cardPack.name} başarıyla açıldı!`,
      cards: userCards,
      packInfo: {
        id: cardPack.id,
        name: cardPack.name,
        cardCount: cardPack.cardCount,
        cost: cardPack.diamondPrice,
      },
      userInfo: {
        remainingDiamonds: user.currentDiamonds - (cardPack.diamondPrice || 0),
      },
    });

  } catch (error) {
    console.error("Error opening card pack:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Kart çekme algoritması
async function drawCards(cardPack: any, availableCards: any[]) {
  const drawnCards = [];
  
  for (let i = 0; i < cardPack.cardCount; i++) {
    let targetRarity = null;
    
    // Guaranteed rarity kontrolü (sadece ilk kart için)
    if (i === 0 && cardPack.guaranteedRarity) {
      targetRarity = cardPack.guaranteedRarity;
    } else {
      // Rastgele rarity seç
      targetRarity = selectRandomRarity();
    }
    
    // Hedef rarity'ye uygun kartları filtrele
    const eligibleCards = availableCards.filter(card => 
      card.rarity.toLowerCase() === targetRarity.toLowerCase()
    );
    
    if (eligibleCards.length === 0) {
      // Eğer hedef rarity'de kart yoksa, rastgele bir kart seç
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      drawnCards.push(randomCard);
    } else {
      // Rastgele eligible kart seç
      const randomCard = eligibleCards[Math.floor(Math.random() * eligibleCards.length)];
      drawnCards.push(randomCard);
    }
  }
  
  return drawnCards;
}

// Weighted random rarity selection
function selectRandomRarity(): string {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;
  
  let currentWeight = 0;
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    currentWeight += weight;
    if (random <= currentWeight) {
      return rarity;
    }
  }
  
  return 'common'; // fallback
}
