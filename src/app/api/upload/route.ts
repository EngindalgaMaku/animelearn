import { NextRequest, NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { validateImageFile, extractCardInfoFromFilename } from "@/lib/utils";
import { processAndSaveImage } from "@/lib/image-processing";
import { calculateFileHash, calculateImageHash } from "@/lib/hash";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const category = formData.get("category") as string; // Get category from form data

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // Validate category if provided
    let categorySlug = "anime-collection"; // Default category
    if (category) {
      // Check if category exists in database
      const categoryExists = await prisma.category.findFirst({
        where: { slug: category },
      });
      if (categoryExists) {
        categorySlug = category;
      }
    }

    // Upload klasörünü oluştur
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedCards = [];
    const duplicateCards = [];

    for (const file of files) {
      // Dosya validasyonu
      const validationError = validateImageFile(file);
      if (validationError) {
        continue; // Skip invalid files
      }

      // Hash hesaplama
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileHash = calculateFileHash(buffer);
      const imageHash = calculateImageHash(buffer);

      // Benzersizlik kontrolü - fileHash ile tam eşleşme
      const existingCard = await prisma.card.findFirst({
        where: { fileHash: fileHash },
        select: {
          id: true,
          name: true,
          cardTitle: true,
          imageUrl: true,
          uploadDate: true,
          series: true,
          character: true,
          estimatedValue: true,
        },
      });

      if (existingCard) {
        // Bu kart daha önce yüklenmiş
        duplicateCards.push({
          fileName: file.name,
          existingCard: {
            id: existingCard.id,
            name: existingCard.cardTitle || existingCard.name,
            imageUrl: existingCard.imageUrl,
            uploadDate: existingCard.uploadDate,
            series: existingCard.series,
            character: existingCard.character,
            estimatedValue: existingCard.estimatedValue,
          },
          message: "Bu kart daha önce sisteme yüklenmiş",
        });
        continue; // Skip this file
      }

      // Dosya adından temel kart bilgilerini çıkar (AI analizi öncesi)
      const basicCardInfo = extractCardInfoFromFilename(file.name);

      // Add category to card info
      const cardInfoWithCategory = {
        ...basicCardInfo,
        category: categorySlug,
      };

      // Dosyayı işle: JPG'ye çevir, optimizasyon yap, akıllı isimlendirme
      const processedImage = await processAndSaveImage(
        buffer,
        file.name,
        uploadDir,
        cardInfoWithCategory
      );

      // Veritabanına kaydet - tamamen güvenli random isim
      const randomCardName = `card_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const card = await prisma.card.create({
        data: {
          name: randomCardName,
          series: basicCardInfo.series,
          character: basicCardInfo.character,
          rarity: basicCardInfo.rarity,
          category: categorySlug, // Use the determined category
          imagePath: processedImage.path,
          imageUrl: processedImage.url,
          thumbnailUrl: processedImage.thumbnailUrl,
          fileName: processedImage.filename,
          fileSize: file.size, // Original file size
          fileHash: fileHash,
          imageHash: imageHash,
          isAnalyzed: false, // Analiz yapılmasın, admin sonra yapacak
          isVerified: false,
          // AI analizi sonra yapılacağı için bu alanları boş bırakıyoruz
          cardTitle: null,
          story: null,
          attackPower: null,
          defense: null,
          specialAbility: null,
          element: null,
          estimatedValue: null,
          confidence: null,
          diamondPrice: 50, // Default fiyat, analiz sonrası güncellenecek
        },
      });

      uploadedCards.push({
        id: card.id,
        name: card.name,
        imageUrl: card.imageUrl,
        fileName: card.fileName,
        fileSize: card.fileSize,
        processingInfo: {
          originalSize: processedImage.processingResult.originalSize,
          compressedSize: processedImage.processingResult.compressedSize,
          compressionRatio: processedImage.processingResult.compressionRatio,
          format: processedImage.processingResult.format,
        },
      });
    }

    // Sonuç mesajını oluştur
    let message = "";
    if (uploadedCards.length > 0 && duplicateCards.length > 0) {
      message = `${uploadedCards.length} yeni kart yüklendi, ${duplicateCards.length} kart zaten sistemde mevcut`;
    } else if (uploadedCards.length > 0) {
      message = `${uploadedCards.length} kart başarıyla yüklendi`;
    } else if (duplicateCards.length > 0) {
      message = `${duplicateCards.length} kart zaten sistemde mevcut`;
    } else {
      message = "Yüklenecek geçerli kart bulunamadı";
    }

    return NextResponse.json({
      message,
      cards: uploadedCards,
      duplicates: duplicateCards,
      summary: {
        uploaded: uploadedCards.length,
        duplicates: duplicateCards.length,
        total: uploadedCards.length + duplicateCards.length,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Dosya yükleme sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Filtreleme parametreleri
    const search = searchParams.get("search") || "";
    const series = searchParams.get("series") || "";
    const rarity = searchParams.get("rarity") || "";
    const category = searchParams.get("category") || "";
    const element = searchParams.get("element") || "";
    const analyzed = searchParams.get("analyzed") || "";
    const sortBy = searchParams.get("sortBy") || "date";

    // Where koşulları oluştur
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { cardTitle: { contains: search, mode: "insensitive" } },
        { series: { contains: search, mode: "insensitive" } },
        { character: { contains: search, mode: "insensitive" } },
        { specialAbility: { contains: search, mode: "insensitive" } },
      ];
    }

    if (series) where.series = series;
    if (rarity) where.rarity = rarity;
    if (category) where.category = category;
    if (element) where.element = element;
    if (analyzed === "analyzed") where.isAnalyzed = true;
    if (analyzed === "pending") where.isAnalyzed = false;

    // Sıralama
    let orderBy: any = { uploadDate: "desc" };
    switch (sortBy) {
      case "name":
        orderBy = { name: "asc" };
        break;
      case "value":
        orderBy = { estimatedValue: "desc" };
        break;
      case "series":
        orderBy = { series: "asc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "power":
        orderBy = { attackPower: "desc" };
        break;
    }

    // Toplam sayı ve kartları al (collection bilgisi dahil)
    const [totalCards, cards] = await Promise.all([
      prisma.card.count({ where }),
      prisma.card.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          collection: {
            select: {
              id: true,
              name: true,
              description: true,
              totalCards: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCards / limit);

    return NextResponse.json({
      cards,
      pagination: {
        page,
        limit,
        totalCards,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get cards error:", error);
    return NextResponse.json(
      { error: "Kartlar getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}
