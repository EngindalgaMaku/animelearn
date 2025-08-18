import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    // Allow anonymous users to view categories
    try {
      // Get all categories that have active questions
      const categories = await (prisma as any).quizQuestion.groupBy({
        by: ["category"],
        where: {
          isActive: true,
        },
        _count: {
          id: true,
        },
      });

      const categoriesWithCounts = categories
        .filter((cat: any) => (cat._count?.id ?? 0) >= 100)
        .map((cat: any) => ({
          name: cat.category,
          questionCount: cat._count.id,
        }))
        .sort((a: any, b: any) => b.questionCount - a.questionCount);

      return NextResponse.json({
        success: true,
        categories: categoriesWithCounts,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Fallback categories for anonymous users when database is unavailable
      return NextResponse.json({
        success: true,
        categories: [],
      });
    }
  } catch (error) {
    console.error("Error fetching quiz categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
