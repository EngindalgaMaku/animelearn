import { prisma } from "@/lib/prisma";

export interface AutomationSettings {
  isEnabled: boolean;
  rotationTime: string; // HH:MM format, e.g., "09:00"
  avoidRecentDays: number; // Days to avoid repeating tips
  preferredDifficulties: string[]; // ["beginner", "intermediate", "advanced"]
  categoryWeights: Record<string, number>; // Category ID -> weight
  maxConsecutiveSameDifficulty: number;
  maxConsecutiveSameCategory: number;
}

export class DailyTipAutomationService {
  private static instance: DailyTipAutomationService;
  private automationInterval: NodeJS.Timeout | null = null;
  private settings: AutomationSettings | null = null;

  private constructor() {}

  public static getInstance(): DailyTipAutomationService {
    if (!DailyTipAutomationService.instance) {
      DailyTipAutomationService.instance = new DailyTipAutomationService();
    }
    return DailyTipAutomationService.instance;
  }

  async getSettings(): Promise<AutomationSettings> {
    if (this.settings) {
      return this.settings;
    }

    try {
      const settingsRecord = await prisma.settings.findUnique({
        where: { key: "daily_tip_automation" },
      });

      if (settingsRecord) {
        this.settings = JSON.parse(settingsRecord.value);
      } else {
        // Default settings
        this.settings = {
          isEnabled: true,
          rotationTime: "09:00",
          avoidRecentDays: 30,
          preferredDifficulties: ["beginner", "intermediate", "advanced"],
          categoryWeights: {},
          maxConsecutiveSameDifficulty: 3,
          maxConsecutiveSameCategory: 2,
        };
        await this.saveSettings(this.settings);
      }

      return this.settings!;
    } catch (error) {
      console.error("Error loading automation settings:", error);
      // Return default settings on error
      return {
        isEnabled: false,
        rotationTime: "09:00",
        avoidRecentDays: 30,
        preferredDifficulties: ["beginner", "intermediate", "advanced"],
        categoryWeights: {},
        maxConsecutiveSameDifficulty: 3,
        maxConsecutiveSameCategory: 2,
      };
    }
  }

  async saveSettings(settings: AutomationSettings): Promise<void> {
    try {
      await prisma.settings.upsert({
        where: { key: "daily_tip_automation" },
        update: {
          value: JSON.stringify(settings),
          type: "json",
        },
        create: {
          key: "daily_tip_automation",
          value: JSON.stringify(settings),
          type: "json",
          description: "Daily Python tip automation settings",
        },
      });
      this.settings = settings;
    } catch (error) {
      console.error("Error saving automation settings:", error);
      throw error;
    }
  }

  async selectNextTip(): Promise<any> {
    const settings = await this.getSettings();

    // Get tomorrow's date properly
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to start of day

    console.log(`Current date: ${new Date().toISOString().split("T")[0]}`);
    console.log(`Tomorrow's date: ${tomorrow.toISOString().split("T")[0]}`);

    // Check if tomorrow already has a daily tip (any variant)
    const existingDailyTip = await prisma.dailyPythonTip.findFirst({
      where: {
        date: tomorrow,
      },
    });

    if (existingDailyTip) {
      console.log(
        `Daily tip already exists for ${tomorrow.toISOString().split("T")[0]}`
      );
      throw new Error(
        `Daily tip already exists for ${tomorrow.toISOString().split("T")[0]}`
      );
    }

    // Get recently used tips to avoid repetition
    const avoidDate = new Date();
    avoidDate.setDate(avoidDate.getDate() - settings.avoidRecentDays);

    const recentlyUsedTips = await prisma.dailyPythonTip.findMany({
      where: {
        date: {
          gte: avoidDate,
        },
      },
      include: {
        tip: {
          select: {
            id: true,
            difficulty: true,
            categoryId: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    const usedTipIds = recentlyUsedTips.map((dt) => dt.tipId);

    // Get available tips that haven't been used recently
    let availableTips = await prisma.pythonTip.findMany({
      where: {
        isActive: true,
        id: {
          notIn: usedTipIds,
        },
      },
      include: {
        category: true,
      },
    });

    // If no tips available, use all active tips
    if (availableTips.length === 0) {
      availableTips = await prisma.pythonTip.findMany({
        where: {
          isActive: true,
        },
        include: {
          category: true,
        },
      });

      if (availableTips.length === 0) {
        throw new Error("No active tips available for rotation");
      }
    }

    // Apply smart selection logic
    const selectedTip = await this.smartTipSelection(
      availableTips,
      recentlyUsedTips,
      settings
    );

    // Create the daily tip entry
    const newDailyTip = await prisma.dailyPythonTip.create({
      data: {
        tipId: selectedTip.id,
        date: tomorrow,
        variant: "A",
        isActive: true,
      },
      include: {
        tip: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            estimatedMinutes: true,
            category: {
              select: {
                name: true,
                color: true,
                icon: true,
              },
            },
          },
        },
      },
    });

    return newDailyTip;
  }

  private async smartTipSelection(
    availableTips: any[],
    recentTips: any[],
    settings: AutomationSettings
  ): Promise<any> {
    // Filter by preferred difficulties
    let filteredTips = availableTips;

    if (settings.preferredDifficulties.length > 0) {
      filteredTips = availableTips.filter((tip) =>
        settings.preferredDifficulties.includes(tip.difficulty)
      );

      // If no tips match preferred difficulties, use all available
      if (filteredTips.length === 0) {
        filteredTips = availableTips;
      }
    }

    // Avoid consecutive same difficulty/category
    if (recentTips.length > 0) {
      const recentDifficulties = recentTips
        .slice(0, settings.maxConsecutiveSameDifficulty)
        .map((rt) => rt.tip?.difficulty)
        .filter(Boolean);
      const recentCategories = recentTips
        .slice(0, settings.maxConsecutiveSameCategory)
        .map((rt) => rt.tip?.categoryId)
        .filter(Boolean);

      // Check for consecutive same difficulty
      if (recentDifficulties.length >= settings.maxConsecutiveSameDifficulty) {
        const lastDifficulty = recentDifficulties[0];
        const allSameDifficulty = recentDifficulties.every(
          (d) => d === lastDifficulty
        );

        if (allSameDifficulty) {
          const differentDifficultyTips = filteredTips.filter(
            (tip) => tip.difficulty !== lastDifficulty
          );
          if (differentDifficultyTips.length > 0) {
            filteredTips = differentDifficultyTips;
          }
        }
      }

      // Check for consecutive same category
      if (recentCategories.length >= settings.maxConsecutiveSameCategory) {
        const lastCategory = recentCategories[0];
        const allSameCategory = recentCategories.every(
          (c) => c === lastCategory
        );

        if (allSameCategory) {
          const differentCategoryTips = filteredTips.filter(
            (tip) => tip.categoryId !== lastCategory
          );
          if (differentCategoryTips.length > 0) {
            filteredTips = differentCategoryTips;
          }
        }
      }
    }

    // Apply category weights
    if (Object.keys(settings.categoryWeights).length > 0) {
      const weightedTips: { tip: any; weight: number }[] = [];

      filteredTips.forEach((tip) => {
        const weight = settings.categoryWeights[tip.categoryId] || 1;
        for (let i = 0; i < weight; i++) {
          weightedTips.push({ tip, weight });
        }
      });

      if (weightedTips.length > 0) {
        const randomIndex = Math.floor(Math.random() * weightedTips.length);
        return weightedTips[randomIndex].tip;
      }
    }

    // Fallback to random selection
    return filteredTips[Math.floor(Math.random() * filteredTips.length)];
  }

  async startAutomation(): Promise<void> {
    const settings = await this.getSettings();

    if (!settings.isEnabled) {
      console.log("Daily tip automation is disabled");
      return;
    }

    // Stop existing automation if running
    this.stopAutomation();

    console.log(`Starting daily tip automation at ${settings.rotationTime}`);

    // Schedule daily execution
    this.scheduleNextRotation();
  }

  private scheduleNextRotation(): void {
    const settings = this.settings;
    if (!settings) return;

    const [hours, minutes] = settings.rotationTime.split(":").map(Number);

    const now = new Date();
    const nextRotation = new Date();
    nextRotation.setHours(hours, minutes, 0, 0);

    // If today's rotation time has passed, schedule for tomorrow
    if (nextRotation <= now) {
      nextRotation.setDate(nextRotation.getDate() + 1);
    }

    const timeUntilRotation = nextRotation.getTime() - now.getTime();

    console.log(
      `Next daily tip rotation scheduled for: ${nextRotation.toISOString()}`
    );

    this.automationInterval = setTimeout(async () => {
      try {
        console.log("Executing daily tip rotation...");
        const newTip = await this.selectNextTip();
        console.log(`Successfully assigned daily tip: ${newTip.tip.title}`);

        // Schedule next rotation
        this.scheduleNextRotation();
      } catch (error) {
        console.error("Error during daily tip rotation:", error);
        // Reschedule even if there's an error
        this.scheduleNextRotation();
      }
    }, timeUntilRotation);
  }

  stopAutomation(): void {
    if (this.automationInterval) {
      clearTimeout(this.automationInterval);
      this.automationInterval = null;
      console.log("Daily tip automation stopped");
    }
  }

  async getStatus(): Promise<{
    isRunning: boolean;
    settings: AutomationSettings;
    nextRotation?: Date;
  }> {
    const settings = await this.getSettings();

    let nextRotation: Date | undefined;
    if (settings.isEnabled) {
      const [hours, minutes] = settings.rotationTime.split(":").map(Number);
      nextRotation = new Date();
      nextRotation.setHours(hours, minutes, 0, 0);

      if (nextRotation <= new Date()) {
        nextRotation.setDate(nextRotation.getDate() + 1);
      }
    }

    return {
      isRunning: settings.isEnabled && this.automationInterval !== null,
      settings,
      nextRotation,
    };
  }
}

// Global instance
export const dailyTipAutomation = DailyTipAutomationService.getInstance();
