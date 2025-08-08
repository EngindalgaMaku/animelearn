import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import { prisma } from "@/lib/prisma";
import { calculateDiamondPrice } from "@/lib/utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cardId } = await params;

    if (!cardId) {
      return NextResponse.json(
        { error: "Kart ID gereklidir" },
        { status: 400 }
      );
    }

    // Kartı veritabanından getir
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        analytics: true,
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Kart bulunamadı" }, { status: 404 });
    }

    // İlişkili analytics kayıtlarını sil
    await prisma.analytics.deleteMany({
      where: { cardId: cardId },
    });

    // Kartı veritabanından sil
    await prisma.card.delete({
      where: { id: cardId },
    });

    // Dosyayı fiziksel olarak sil
    try {
      if (card.imagePath && existsSync(card.imagePath)) {
        await unlink(card.imagePath);
        console.log(`Deleted file: ${card.imagePath}`);
      }

      // Thumbnail dosyalarını sil (farklı formatları kontrol et)
      if (card.imagePath) {
        // Dosya uzantısını ve adını al
        const pathParts = card.imagePath.split(".");
        const extension = pathParts.pop(); // Son parça uzantı
        const basePath = pathParts.join("."); // Geri kalan dosya yolu

        // Thumbnail formatlarını dene
        const thumbnailFormats = [
          `${basePath}_thumb.${extension}`, // Orjinal uzantı ile
          `${basePath}_thumb.jpg`,
          `${basePath}_thumb.jpeg`,
          `${basePath}_thumb.png`,
          `${basePath}_thumb.webp`,
        ];

        for (const thumbnailPath of thumbnailFormats) {
          try {
            if (existsSync(thumbnailPath)) {
              await unlink(thumbnailPath);
              console.log(`Deleted thumbnail: ${thumbnailPath}`);
            }
          } catch (thumbError) {
            console.warn(
              `Failed to delete thumbnail ${thumbnailPath}:`,
              thumbError
            );
          }
        }
      }
    } catch (fileError) {
      console.warn("File deletion error (non-critical):", fileError);
      // Dosya silinmese bile veritabanından silindi, devam et
    }

    return NextResponse.json({
      message: "Kart başarıyla silindi",
      deletedCard: {
        id: card.id,
        name: card.name,
        fileName: card.fileName,
      },
    });
  } catch (error) {
    console.error("Card deletion error:", error);
    return NextResponse.json(
      { error: "Kart silinirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cardId } = await params;

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        analytics: {
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Kart bulunamadı" }, { status: 404 });
    }

    // AI tags'ı parse et
    let parsedAiTags = null;
    if (card.aiTags) {
      try {
        parsedAiTags = JSON.parse(card.aiTags);
      } catch (e) {
        console.warn("Failed to parse AI tags:", e);
      }
    }

    return NextResponse.json({
      card: {
        ...card,
        aiTags: parsedAiTags,
      },
    });
  } catch (error) {
    console.error("Get card error:", error);
    return NextResponse.json(
      { error: "Kart bilgileri getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cardId } = await params;
    const updates = await request.json();

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        name: updates.name,
        series: updates.series,
        character: updates.character,
        rarity: updates.rarity,
        condition: updates.condition,
        estimatedValue: updates.estimatedValue,
        actualValue: updates.actualValue,
        isVerified: updates.isVerified,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Kart başarıyla güncellendi",
      card: updatedCard,
    });
  } catch (error) {
    console.error("Card update error:", error);
    return NextResponse.json(
      { error: "Kart güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cardId } = await params;
    const body = await request.json();
    const {
      rarity,
      category,
      recalculateDiamonds,
      attackPower,
      defense,
      speed,
      diamondPrice,
      estimatedValue,
      confidence,
      cardTitle,
      character,
      series,
      element,
      specialAbility,
      rarityLevel,
      rating,
      aiTags,
      story,
    } = body;

    if (!cardId) {
      return NextResponse.json(
        { error: "Kart ID gereklidir" },
        { status: 400 }
      );
    }

    // Get current card data
    const existingCard = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Kart bulunamadı" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Update basic fields if provided
    if (rarity !== undefined) updateData.rarity = rarity;
    if (category !== undefined) updateData.category = category;
    if (attackPower !== undefined) updateData.attackPower = attackPower;
    if (defense !== undefined) updateData.defense = defense;
    if (speed !== undefined) updateData.speed = speed;
    if (diamondPrice !== undefined) updateData.diamondPrice = diamondPrice;
    if (estimatedValue !== undefined)
      updateData.estimatedValue = estimatedValue;
    if (confidence !== undefined) updateData.confidence = confidence;
    if (cardTitle !== undefined) updateData.cardTitle = cardTitle;
    if (character !== undefined) updateData.character = character;
    if (series !== undefined) updateData.series = series;
    if (element !== undefined) updateData.element = element;
    if (specialAbility !== undefined)
      updateData.specialAbility = specialAbility;
    if (rarityLevel !== undefined) updateData.rarityLevel = rarityLevel;
    if (rating !== undefined) updateData.rating = rating;
    if (aiTags !== undefined)
      updateData.aiTags =
        typeof aiTags === "string" ? aiTags : JSON.stringify(aiTags);
    if (story !== undefined) updateData.story = story;

    // Recalculate diamond price if requested and rarity is being updated
    if (
      recalculateDiamonds &&
      rarity &&
      (existingCard.estimatedValue || estimatedValue)
    ) {
      const newDiamondPrice = calculateDiamondPrice(
        rarity,
        estimatedValue || existingCard.estimatedValue,
        confidence || existingCard.confidence || 50
      );
      updateData.diamondPrice = newDiamondPrice;
    }

    // Update the card
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: updateData,
    });

    // Create appropriate success message
    let message = "Card updated successfully";
    const updatedFields = Object.keys(body).filter(
      (key) => body[key] !== undefined
    );

    if (
      updatedFields.includes("attackPower") ||
      updatedFields.includes("defense") ||
      updatedFields.includes("speed")
    ) {
      message = "Card power stats updated successfully";
    } else if (updatedFields.includes("diamondPrice")) {
      message = "Card diamond price updated successfully";
    } else if (rarity && category) {
      message = "Card rarity and category updated successfully";
    } else if (rarity) {
      message = "Card rarity updated successfully";
    } else if (category) {
      message = "Card category updated successfully";
    }

    return NextResponse.json({
      message,
      card: updatedCard,
    });
  } catch (error) {
    console.error("Card update error:", error);
    return NextResponse.json(
      { error: "Failed to update card" },
      { status: 500 }
    );
  }
}
