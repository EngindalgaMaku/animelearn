import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Aktif diamond packages listele (Store için)
export async function GET(request: NextRequest) {
  try {
    const packages = await prisma.diamondPackage.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { level: "asc" },
      ],
    });

    // Features string'ini parse et
    const packagesWithParsedFeatures = packages.map(pkg => ({
      ...pkg,
      features: JSON.parse(pkg.features || "[]"),
    }));

    return NextResponse.json({
      success: true,
      packages: packagesWithParsedFeatures,
    });
  } catch (error) {
    console.error("Diamond packages GET error:", error);
    return NextResponse.json(
      { error: "Diamond packages getirilirken hata oluştu" },
      { status: 500 }
    );
  }
}
