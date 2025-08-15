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

// Basit Python kod validation sistemi
function validatePythonCode(code: string, testCases: any[]): any {
  try {
    // Güvenlik kontrolü - tehlikeli komutları engelle
    const dangerousPatterns = [
      /import\s+os/,
      /import\s+sys/,
      /import\s+subprocess/,
      /exec\s*\(/,
      /eval\s*\(/,
      /open\s*\(/,
      /__import__/,
      /file\s*\(/,
      /input\s*\(/,
      /raw_input\s*\(/,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return {
          success: false,
          error: "Güvenlik nedeniyle bu kod çalıştırılamaz",
          results: [],
        };
      }
    }

    // Test sonuçları
    const results = [];
    let allPassed = true;
    let totalScore = 0;

    // Her test case için kontrol
    for (const testCase of testCases) {
      try {
        // Basit test - çıktı kontrolü
        let testResult = {
          description: testCase.description,
          passed: false,
          expected: testCase.expected || "",
          actual: "",
          error: null,
        };

        // Kod içeriğine göre basit pattern matching
        if (testCase.test) {
          // Test string'ini kontrol et
          const testCondition = testCase.test;

          if (testCondition.includes("assert")) {
            // Assert tabanlı test
            if (testCondition.includes("'Merhaba' in output")) {
              testResult.passed =
                code.includes("Merhaba") || code.includes('"Merhaba"');
              testResult.actual = testResult.passed
                ? "✓ 'Merhaba' found"
                : "✗ 'Merhaba' not found";
            } else if (testCondition.includes("'Python' in output")) {
              testResult.passed =
                code.includes("Python") || code.includes('"Python"');
              testResult.actual = testResult.passed
                ? "✓ 'Python' found"
                : "✗ 'Python' not found";
            } else if (testCondition.includes("len(")) {
              // Liste uzunluğu kontrolü
              const matches = code.match(/(\w+)\s*=\s*\[.*\]/g);
              if (matches && matches.length >= 3) {
                testResult.passed = true;
                testResult.actual = `✓ ${matches.length} variables defined`;
              } else {
                testResult.passed = false;
                testResult.actual = `✗ Expected at least 3 variables, found ${
                  matches ? matches.length : 0
                }`;
              }
            } else if (testCondition.includes("kart_degeri")) {
              // Kart değeri hesaplama kontrolü
              const hasFormula =
                code.includes("**") &&
                code.includes("*") &&
                code.includes("temel_deger");
              testResult.passed = hasFormula;
              testResult.actual = hasFormula
                ? "✓ Formula implemented"
                : "✗ Formula not found";
            } else if (testCondition.includes("print")) {
              // Print kontrolü
              testResult.passed = code.includes("print(");
              testResult.actual = testResult.passed
                ? "✓ Print statement found"
                : "✗ Print statement not found";
            } else {
              // Genel assert kontrolü
              testResult.passed = code.length > 10; // Basit kod uzunluğu kontrolü
              testResult.actual = "Basic code structure check";
            }
          } else {
            // Diğer test tipleri
            testResult.passed = code.length > 5;
            testResult.actual = "Code length check";
          }
        } else {
          // Test case yoksa basit kontrol
          testResult.passed = code.trim().length > 0;
          testResult.actual = "Code exists";
        }

        if (testResult.passed) {
          totalScore += 10; // Her başarılı test için 10 puan
        } else {
          allPassed = false;
        }

        results.push(testResult);
      } catch (error) {
        results.push({
          description: testCase.description,
          passed: false,
          expected: testCase.expected || "",
          actual: "",
          error: `Test error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
        allPassed = false;
      }
    }

    return {
      success: true,
      allPassed,
      totalScore,
      results,
      feedback: allPassed
        ? "🎉 Tebrikler! Tüm testler başarılı!"
        : "💡 Bazı testler başarısız. İpuçlarını kontrol edin.",
    };
  } catch (error) {
    return {
      success: false,
      error: `Validation error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      results: [],
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getUserFromToken(req);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { code, codeArenaId, testCases } = body;

    if (!code || !codeArenaId) {
      return NextResponse.json(
        { error: "Code and codeArenaId are required" },
        { status: 400 }
      );
    }

    // LearningActivity (lesson)'ı kontrol et
    const activity = await prisma.learningActivity.findFirst({
      where: { id: codeArenaId, activityType: "lesson" },
    });

    if (!activity) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Test case'leri parse et
    let parsedTestCases = [];
    try {
      if (testCases) {
        parsedTestCases = Array.isArray(testCases)
          ? testCases
          : JSON.parse(testCases);
      } else {
        // Try to read test cases from activity.settings
        try {
          const settings = activity.settings
            ? JSON.parse(activity.settings)
            : null;
          if (settings?.testCases) {
            parsedTestCases = Array.isArray(settings.testCases)
              ? settings.testCases
              : JSON.parse(settings.testCases);
          }
        } catch {
          // ignore, will default to []
        }
      }
    } catch (error) {
      console.error("Error parsing test cases:", error);
      parsedTestCases = [];
    }

    // Kodu validate et
    const validationResult = validatePythonCode(code, parsedTestCases);

    // Code submission'ı kaydet
    const submission = await prisma.codeSubmission.create({
      data: {
        userId: authUser.userId,
        codeArenaId: codeArenaId,
        code: code,
        language: "python",
        isCorrect: validationResult.allPassed || false,
        testResults: JSON.stringify(validationResult.results),
        score: validationResult.totalScore || 0,
        feedback: validationResult.feedback || "",
        errorMessage: validationResult.error || null,
      },
    });

    // Progress'i güncelle
    if (validationResult.allPassed) {
      // Persist attempt for this lesson with last code and score
      const answers = JSON.stringify({
        lastCode: code,
        updatedAt: new Date().toISOString(),
      });

      await prisma.activityAttempt.upsert({
        where: {
          userId_activityId: {
            userId: authUser.userId,
            activityId: codeArenaId,
          },
        },
        update: {
          answers,
          score: validationResult.totalScore || 0,
        },
        create: {
          userId: authUser.userId,
          activityId: codeArenaId,
          answers,
          score: validationResult.totalScore || 0,
          startedAt: new Date(),
        },
      });

      // Kullanıcı istatistiklerini güncelle
      await prisma.user.update({
        where: { id: authUser.userId },
        data: {
          codeSubmissionCount: { increment: 1 },
        },
      });
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      validation: {
        passed: validationResult.allPassed || false,
        score: validationResult.totalScore || 0,
        results: validationResult.results || [],
        feedback: validationResult.feedback || "",
        error: validationResult.error || null,
      },
    });
  } catch (error) {
    console.error("Error validating exercise:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
