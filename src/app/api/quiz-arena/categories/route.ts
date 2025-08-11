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

      const categoriesWithCounts = categories.map((cat: any) => ({
        name: cat.category,
        questionCount: cat._count.id,
      }));

      return NextResponse.json({
        success: true,
        categories: categoriesWithCounts,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Fallback categories for anonymous users when database is unavailable
      return NextResponse.json({
        success: true,
        categories: [
          { name: "Python Basics", questionCount: 50 },
          { name: "Data Structures", questionCount: 30 },
          { name: "Algorithms", questionCount: 25 },
          { name: "Object-Oriented Programming", questionCount: 20 },
          { name: "Web Development", questionCount: 15 },
        ],
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
