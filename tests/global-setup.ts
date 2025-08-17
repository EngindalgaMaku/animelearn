import { FullConfig, chromium } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function ensureTestUser(prismaClient: PrismaClient) {
  const email = "testuser@example.com";
  const baseUsername = "testuser";
  const password = "TestPass123!";

  let user = await prismaClient.user.findUnique({ where: { email } });
  if (user) {
    if (!user.passwordHash) {
      const hash = await bcrypt.hash(password, 10);
      user = await prismaClient.user.update({
        where: { id: user.id },
        data: { passwordHash: hash, isActive: true },
      });
    } else if (!user.isActive) {
      user = await prismaClient.user.update({
        where: { id: user.id },
        data: { isActive: true },
      });
    }
    return { id: user.id, email, username: user.username, password };
  }

  // find unique username
  let finalUsername = baseUsername;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (
    await prismaClient.user.findUnique({ where: { username: finalUsername } })
  ) {
    finalUsername = `${baseUsername}_${counter++}`;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  user = await prismaClient.user.create({
    data: {
      email,
      username: finalUsername,
      passwordHash,
      isActive: true,
      role: "user",
      currentDiamonds: 100,
      totalDiamonds: 100,
      level: 1,
      experience: 0,
    },
  });

  return { id: user.id, email, username: finalUsername, password };
}

async function ensureLesson(prismaClient: PrismaClient) {
  const slug = "python-basics-first-program";

  // Check by settings.slug match
  const existing = await prismaClient.learningActivity.findFirst({
    where: {
      activityType: "lesson",
      isActive: true,
      settings: { contains: `"slug":"${slug}"` },
    },
  });
  if (existing) return { id: existing.id, slug };

  const settings = JSON.stringify({ slug, hasCodeExercise: true });
  const content = JSON.stringify({
    introduction: "Seeded test lesson for E2E code-complete.",
    syntax: "",
    examples: "",
  });

  const lesson = await prismaClient.learningActivity.create({
    data: {
      title: "Python Basics & Your First Program",
      description: "Seeded lesson for E2E tests",
      activityType: "lesson",
      category: "Python Fundamentals",
      difficulty: 1,
      diamondReward: 25,
      experienceReward: 50,
      content,
      settings,
      isActive: true,
      estimatedMinutes: 10,
      sortOrder: 1,
    },
  });

  return { id: lesson.id, slug };
}

async function loginAndSaveStorage(
  baseURL: string,
  email: string,
  password: string,
  storagePath: string
) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Get CSRF token from NextAuth
  const csrfRes = await page.request.get(`${baseURL}/api/auth/csrf`);
  if (!csrfRes.ok()) {
    throw new Error(
      `Failed to fetch CSRF token: ${csrfRes.status()} ${csrfRes.statusText()}`
    );
  }
  const csrfJson = await csrfRes.json();
  const csrfToken: string = csrfJson?.csrfToken;
  if (!csrfToken) {
    throw new Error("CSRF token not found in response");
  }

  // Credentials sign-in via NextAuth
  const form = new URLSearchParams();
  form.set("csrfToken", csrfToken);
  form.set("usernameOrEmail", email);
  form.set("password", password);
  form.set("callbackUrl", baseURL);

  const loginRes = await page.request.post(
    `${baseURL}/api/auth/callback/credentials`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*",
      },
      data: form.toString(),
    }
  );

  // NextAuth often responds with 302; cookie should still be set
  if (![200, 302].includes(loginRes.status())) {
    throw new Error(
      `Login failed: ${loginRes.status()} ${loginRes.statusText()}`
    );
  }

  // Verify session
  const sessionRes = await page.request.get(`${baseURL}/api/auth/session`);
  if (!sessionRes.ok()) {
    throw new Error(
      `Failed to verify session: ${sessionRes.status()} ${sessionRes.statusText()}`
    );
  }
  const sessionJson = await sessionRes.json();
  if (!sessionJson?.user?.id) {
    throw new Error("Session verification failed: missing user id");
  }

  // Ensure directory and persist storage state
  const dir = path.dirname(storagePath);
  await fs.promises.mkdir(dir, { recursive: true });
  await context.storageState({ path: storagePath });

  await browser.close();
}

async function globalSetup(config: FullConfig) {
  try {
    // Prefer configured baseURL if present
    const fromProject = config.projects?.[0]?.use?.baseURL as
      | string
      | undefined;
    const baseURL =
      process.env.BASE_URL ||
      process.env.NEXTAUTH_URL ||
      fromProject ||
      "http://localhost:3000";

    // Seed test user and a lesson
    const user = await ensureTestUser(prisma);
    await ensureLesson(prisma);

    // Prepare authenticated storage state for tests
    const storagePath = path.join("tests", ".auth", "user.json");
    await loginAndSaveStorage(baseURL, user.email, user.password, storagePath);
  } finally {
    await prisma.$disconnect();
  }
}

export default globalSetup;
