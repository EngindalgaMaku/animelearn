import { dailyTipAutomation } from "./daily-tip-automation";

// Initialize automation when the app starts
let isInitialized = false;

export async function initializeDailyTipAutomation() {
  if (isInitialized) {
    return;
  }

  try {
    console.log("Initializing Daily Tip Automation...");
    await dailyTipAutomation.startAutomation();
    isInitialized = true;
    console.log("Daily Tip Automation initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Daily Tip Automation:", error);
  }
}

// Auto-initialize in production
if (process.env.NODE_ENV === "production") {
  initializeDailyTipAutomation();
}
