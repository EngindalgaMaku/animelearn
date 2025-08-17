import { test, expect, request as pwRequest } from "@playwright/test";
import type { APIRequestContext, TestInfo } from "@playwright/test";

// Utilities to branch per project
const isAuthProject = (projectName: string) => projectName === "auth";
const isUnauthProject = (projectName: string) => projectName === "unauth";

// Create an API client that carries NextAuth cookies for "auth" project
async function apiFor(
  defaultRequest: APIRequestContext,
  testInfo: TestInfo
): Promise<APIRequestContext> {
  if (isAuthProject(testInfo.project.name)) {
    const baseURL = (testInfo.project.use as any)?.baseURL as
      | string
      | undefined;
    return await pwRequest.newContext({
      baseURL,
      storageState: "tests/.auth/user.json",
    });
  }
  return defaultRequest;
}

test.describe("Lessons API", () => {
  test("GET /api/lessons returns 401 when unauthenticated", async ({
    request,
  }, testInfo) => {
    if (!isUnauthProject(testInfo.project.name)) test.skip();

    const res = await request.get("/api/lessons");
    expect(res.status(), "Unauthenticated lessons should be 401").toBe(401);
  });

  test("GET /api/lessons returns 200 and lessons when authenticated", async ({
    request,
  }, testInfo) => {
    if (!isAuthProject(testInfo.project.name)) test.skip();

    const api = await apiFor(request, testInfo);
    try {
      const res = await api.get("/api/lessons");
      expect(res.status()).toBe(200);
      const json = await res.json();
      expect(json).toBeTruthy();
      // Accept either canonical "lessons" or legacy alias "codeArenas"
      expect(
        Array.isArray(json.lessons) || Array.isArray(json.codeArenas)
      ).toBeTruthy();
    } finally {
      if (api !== request) await api.dispose();
    }
  });
});

test.describe("Daily Login API", () => {
  test("GET /api/daily-login returns 401 when unauthenticated", async ({
    request,
  }, testInfo) => {
    if (!isUnauthProject(testInfo.project.name)) test.skip();

    const res = await request.get("/api/daily-login");
    expect(res.status(), "Unauthenticated daily-login should be 401").toBe(401);
  });

  test("GET /api/daily-login returns status when authenticated", async ({
    request,
  }, testInfo) => {
    if (!isAuthProject(testInfo.project.name)) test.skip();

    const api = await apiFor(request, testInfo);
    try {
      const res = await api.get("/api/daily-login");
      expect(res.status()).toBe(200);
      const json = await res.json();
      expect(json.success).toBeTruthy();
      expect(json.loginStatus).toBeTruthy();
    } finally {
      if (api !== request) await api.dispose();
    }
  });

  test("POST /api/daily-login claims bonus (idempotent)", async ({
    request,
  }, testInfo) => {
    if (!isAuthProject(testInfo.project.name)) test.skip();

    const api = await apiFor(request, testInfo);
    try {
      // Ensure record exists by calling GET first
      await api.get("/api/daily-login");

      const res = await api.post("/api/daily-login", { data: {} });
      const status = res.status();
      const json = await res.json();

      // Accept either successful claim (200) or already claimed for today (400)
      if (status === 200) {
        expect(json.success).toBeTruthy();
        expect(json.rewards).toBeTruthy();
      } else if (status === 400) {
        // Already claimed today is acceptable
        expect(json.error).toBeTruthy();
      } else {
        throw new Error(
          `Unexpected status for daily-login POST: ${status} / ${JSON.stringify(json)}`
        );
      }
    } finally {
      if (api !== request) await api.dispose();
    }
  });
});

test.describe("Daily Quests API", () => {
  test("GET /api/daily-quests returns 401 when unauthenticated", async ({
    request,
  }, testInfo) => {
    if (!isUnauthProject(testInfo.project.name)) test.skip();

    const res = await request.get("/api/daily-quests");
    expect(res.status(), "Unauthenticated daily-quests should be 401").toBe(
      401
    );
  });

  test("GET /api/daily-quests returns quests when authenticated", async ({
    request,
  }, testInfo) => {
    if (!isAuthProject(testInfo.project.name)) test.skip();

    const api = await apiFor(request, testInfo);
    try {
      const res = await api.get("/api/daily-quests");
      expect(res.status()).toBe(200);
      const json = await res.json();

      expect(json.success).toBeTruthy();
      expect(Array.isArray(json.quests)).toBeTruthy();
    } finally {
      if (api !== request) await api.dispose();
    }
  });

  test("POST /api/daily-quests update_progress on an incomplete quest", async ({
    request,
  }, testInfo) => {
    if (!isAuthProject(testInfo.project.name)) test.skip();

    const api = await apiFor(request, testInfo);
    try {
      // Load today's quests
      const res = await api.get("/api/daily-quests");
      expect(res.status()).toBe(200);
      const json = await res.json();

      const quests: any[] = json.quests || [];
      // pick any non-completed quest excluding "daily_login"
      const target = quests.find(
        (q) => !q.isCompleted && q.questType !== "daily_login"
      );
      if (!target) test.skip(); // nothing to update today

      const updateRes = await api.post("/api/daily-quests", {
        data: {
          action: "update_progress",
          questType: target.questType,
          increment: 1,
        },
      });
      expect(updateRes.status()).toBe(200);
      const updateJson = await updateRes.json();
      expect(updateJson.success).toBeTruthy();
    } finally {
      if (api !== request) await api.dispose();
    }
  });

  test("POST /api/daily-quests complete_quest on an incomplete quest", async ({
    request,
  }, testInfo) => {
    if (!isAuthProject(testInfo.project.name)) test.skip();

    const api = await apiFor(request, testInfo);
    try {
      // Load today's quests
      const res = await api.get("/api/daily-quests");
      expect(res.status()).toBe(200);
      const json = await res.json();

      const quests: any[] = json.quests || [];
      const target = quests.find(
        (q) => !q.isCompleted && q.questType !== "daily_login"
      );
      if (!target) test.skip(); // nothing to complete today

      const completeRes = await api.post("/api/daily-quests", {
        data: {
          action: "complete_quest",
          questId: target.id,
        },
      });
      const status = completeRes.status();
      if (status === 200) {
        const completeJson = await completeRes.json();
        expect(completeJson.success).toBeTruthy();
        expect(completeJson.quest).toBeTruthy();
      } else if (status === 400) {
        // Accept "already completed" or not found
        const completeJson = await completeRes.json();
        expect(completeJson.error).toBeTruthy();
      } else {
        throw new Error(`Unexpected status for complete_quest: ${status}`);
      }
    } finally {
      if (api !== request) await api.dispose();
    }
  });
});

test.describe("Code Complete API", () => {
  test("POST /api/code-arena/[slug]/code-complete awards or acknowledges completion", async ({
    request,
  }, testInfo) => {
    if (!isAuthProject(testInfo.project.name)) test.skip();

    const api = await apiFor(request, testInfo);
    try {
      const slug = "python-basics-first-program";

      const res = await api.post(`/api/code-arena/${slug}/code-complete`, {
        data: {
          code: 'print("hello, world")',
          score: 95,
          rewards: {
            diamonds: 25,
            experience: 50,
          },
        },
      });

      expect(res.status()).toBe(200);
      const json = await res.json();

      // Accept both new completion and already earned cases
      expect(json.success).toBeTruthy();
      expect(typeof json.message).toBe("string");
      expect(typeof json.score).toBe("number");
    } finally {
      if (api !== request) await api.dispose();
    }
  });
});
