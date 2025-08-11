import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthUser {
  userId: string;
  username: string;
}

// Get user from token
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    const { code, score, rewards } = body;

    // Validate required fields
    if (!code || score === undefined || !rewards) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the code arena
    const codeArena = await prisma.codeArena.findUnique({
      where: { slug, isPublished: true },
    });

    if (!codeArena) {
      return NextResponse.json(
        { error: "Code Arena not found" },
        { status: 404 }
      );
    }

    // Check if user has already completed this code exercise
    const existingProgress = await prisma.codeArenaProgress.findUnique({
      where: {
        userId_codeArenaId: {
          userId: authUser.userId,
          codeArenaId: codeArena.id,
        },
      },
    });

    // Only award rewards if this is the first successful completion
    const shouldAwardRewards = !existingProgress?.isCodeCorrect && score >= 90; // 90% or higher for rewards

    if (shouldAwardRewards) {
      try {
        // Update user stats
        await prisma.user.update({
          where: { id: authUser.userId },
          data: {
            currentDiamonds: { increment: rewards.diamonds },
            totalDiamonds: { increment: rewards.diamonds },
            experience: { increment: rewards.experience },
            codeSubmissionCount: { increment: 1 },
          },
        });

        // Create diamond transaction
        await prisma.diamondTransaction.create({
          data: {
            userId: authUser.userId,
            amount: rewards.diamonds,
            type: "CODE_COMPLETE",
            description: `Code exercise completed: ${codeArena.title} (${score}%)`,
            relatedType: "code_arena",
            relatedId: codeArena.id,
          },
        });

        // Create code submission record
        await prisma.codeSubmission.create({
          data: {
            userId: authUser.userId,
            codeArenaId: codeArena.id,
            code: code,
            language: "python",
            isCorrect: score >= 90,
            score: score,
            feedback:
              score >= 90 ? "Excellent work!" : "Good effort, try for 100%!",
          },
        });

        // Update code arena progress
        if (existingProgress) {
          await prisma.codeArenaProgress.update({
            where: { id: existingProgress.id },
            data: {
              lastCode: code,
              bestCode:
                score > (existingProgress.score || 0)
                  ? code
                  : existingProgress.bestCode,
              isCodeCorrect: score >= 90,
              score: Math.max(score, existingProgress.score || 0),
              lastVisit: new Date(),
              attempts: { increment: 1 },
            },
          });
        } else {
          await prisma.codeArenaProgress.create({
            data: {
              userId: authUser.userId,
              codeArenaId: codeArena.id,
              isStarted: true,
              lastCode: code,
              bestCode: code,
              isCodeCorrect: score >= 90,
              score: score,
              startedAt: new Date(),
              lastVisit: new Date(),
              attempts: 1,
            },
          });
        }

        return NextResponse.json({
          success: true,
          message: `🎉 Code exercise completed! +${rewards.diamonds} diamonds, +${rewards.experience} XP`,
          rewards: {
            diamonds: rewards.diamonds,
            experience: rewards.experience,
          },
          animations: [
            {
              type: "experience",
              amount: rewards.experience,
              icon: "⭐",
              color: "#FFD700",
              delay: 0,
            },
            {
              type: "diamonds",
              amount: rewards.diamonds,
              icon: "💎",
              color: "#00D4FF",
              delay: 500,
            },
          ],
          score,
          newCompletion: true,
        });
      } catch (error) {
        console.error("Error awarding code completion rewards:", error);
        return NextResponse.json(
          { error: "Failed to award rewards" },
          { status: 500 }
        );
      }
    } else {
      // Update progress but don't award rewards
      if (existingProgress) {
        await prisma.codeArenaProgress.update({
          where: { id: existingProgress.id },
          data: {
            lastCode: code,
            bestCode:
              score > (existingProgress.score || 0)
                ? code
                : existingProgress.bestCode,
            score: Math.max(score, existingProgress.score || 0),
            lastVisit: new Date(),
            attempts: { increment: 1 },
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: existingProgress?.isCodeCorrect
          ? `Code exercise completed with ${score}% score! (Rewards already earned)`
          : `Code exercise completed with ${score}% score! Get 90%+ for rewards.`,
        rewards: { diamonds: 0, experience: 0 },
        score,
        newCompletion: false,
      });
    }
  } catch (error) {
    console.error("Error processing code completion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
