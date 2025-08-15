#!/usr/bin/env npx tsx

/**
 * Activity Seed Files Validation Script
 * Tests and validates JSON format, structure, and content quality for all activity seed files
 */

import * as fs from "fs";
import * as path from "path";

// Interface definitions for validation
interface ActivityContent {
  [key: string]: any;
}

interface Activity {
  title: string;
  description: string;
  activityType: string;
  category: string;
  difficulty: number;
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  tags: string[];
  content: ActivityContent;
  settings?: any;
  isActive: boolean;
  sortOrder: number;
}

interface ValidationResult {
  filename: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  activityCount: number;
  activities?: Activity[];
}

// Expected activity types
const EXPECTED_ACTIVITY_TYPES = [
  "drag_drop",
  "memory_game",
  "quiz",
  "fill_blanks",
  "interactive_coding",
  "matching",
  "code_builder",
  "interactive_demo",
  "algorithm_visualization",
  "class_builder",
  "data_exploration",
];

// Required fields for all activities
const REQUIRED_FIELDS = [
  "title",
  "description",
  "activityType",
  "category",
  "difficulty",
  "diamondReward",
  "experienceReward",
  "estimatedMinutes",
  "tags",
  "content",
  "isActive",
  "sortOrder",
];

class ActivityValidator {
  private results: ValidationResult[] = [];

  /**
   * Validate a single activity object
   */
  private validateActivity(
    activity: any,
    index: number
  ): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!(field in activity)) {
        errors.push(`Activity ${index + 1}: Missing required field '${field}'`);
      }
    }

    if (activity.title) {
      // Validate title
      if (typeof activity.title !== "string" || activity.title.length < 10) {
        warnings.push(
          `Activity ${index + 1}: Title should be descriptive (min 10 chars)`
        );
      }
    }

    if (activity.description) {
      // Validate description
      if (
        typeof activity.description !== "string" ||
        activity.description.length < 20
      ) {
        warnings.push(
          `Activity ${index + 1}: Description should be detailed (min 20 chars)`
        );
      }
    }

    if (activity.activityType) {
      // Validate activity type
      if (!EXPECTED_ACTIVITY_TYPES.includes(activity.activityType)) {
        errors.push(
          `Activity ${index + 1}: Invalid activityType '${activity.activityType}'`
        );
      }
    }

    if (activity.difficulty !== undefined) {
      // Validate difficulty range
      if (
        typeof activity.difficulty !== "number" ||
        activity.difficulty < 1 ||
        activity.difficulty > 5
      ) {
        errors.push(
          `Activity ${index + 1}: Difficulty must be number between 1-5`
        );
      }
    }

    if (activity.diamondReward !== undefined) {
      // Validate diamond reward
      if (
        typeof activity.diamondReward !== "number" ||
        activity.diamondReward < 5
      ) {
        warnings.push(`Activity ${index + 1}: Diamond reward seems low (< 5)`);
      }
    }

    if (activity.experienceReward !== undefined) {
      // Validate experience reward
      if (
        typeof activity.experienceReward !== "number" ||
        activity.experienceReward < 10
      ) {
        warnings.push(
          `Activity ${index + 1}: Experience reward seems low (< 10)`
        );
      }
    }

    if (activity.estimatedMinutes !== undefined) {
      // Validate estimated time
      if (
        typeof activity.estimatedMinutes !== "number" ||
        activity.estimatedMinutes < 5 ||
        activity.estimatedMinutes > 60
      ) {
        warnings.push(
          `Activity ${index + 1}: Estimated time should be realistic (5-60 minutes)`
        );
      }
    }

    if (activity.tags) {
      // Validate tags
      if (!Array.isArray(activity.tags) || activity.tags.length === 0) {
        warnings.push(`Activity ${index + 1}: Should have meaningful tags`);
      }
    }

    if (activity.content) {
      // Validate content structure
      if (typeof activity.content !== "object") {
        errors.push(`Activity ${index + 1}: Content must be an object`);
      } else {
        // Type-specific content validation
        this.validateContentByType(
          activity.activityType,
          activity.content,
          index,
          errors,
          warnings
        );
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate content structure based on activity type
   */
  private validateContentByType(
    activityType: string,
    content: any,
    index: number,
    errors: string[],
    warnings: string[]
  ): void {
    switch (activityType) {
      case "quiz":
        if (!content.questions || !Array.isArray(content.questions)) {
          errors.push(`Activity ${index + 1}: Quiz must have questions array`);
        }
        break;

      case "drag_drop":
        if (!content.items || !content.categories) {
          errors.push(
            `Activity ${index + 1}: Drag-drop must have items and categories`
          );
        }
        break;

      case "memory_game":
        if (!content.pairs || !Array.isArray(content.pairs)) {
          errors.push(
            `Activity ${index + 1}: Memory game must have pairs array`
          );
        }
        break;

      case "fill_blanks":
        if (!content.exercises || !Array.isArray(content.exercises)) {
          errors.push(
            `Activity ${index + 1}: Fill blanks must have exercises array`
          );
        }
        break;

      case "interactive_coding":
        if (!content.problem || !content.solution) {
          warnings.push(
            `Activity ${index + 1}: Interactive coding should have problem and solution`
          );
        }
        break;

      case "matching":
        if (!content.pairs || !Array.isArray(content.pairs)) {
          errors.push(`Activity ${index + 1}: Matching must have pairs array`);
        }
        break;

      case "code_builder":
        if (!content.availableBlocks || !content.solution) {
          errors.push(
            `Activity ${index + 1}: Code builder must have availableBlocks and solution`
          );
        }
        break;

      case "interactive_demo":
        if (!content.steps || !Array.isArray(content.steps)) {
          errors.push(
            `Activity ${index + 1}: Interactive demo must have steps array`
          );
        }
        break;

      case "algorithm_visualization":
        if (!content.algorithm || !content.steps) {
          warnings.push(
            `Activity ${index + 1}: Algorithm visualization should have algorithm and steps`
          );
        }
        break;

      case "class_builder":
        if (!content.className || !content.requiredMethods) {
          errors.push(
            `Activity ${index + 1}: Class builder must have className and requiredMethods`
          );
        }
        break;

      case "data_exploration":
        if (!content.dataset || !content.questions) {
          errors.push(
            `Activity ${index + 1}: Data exploration must have dataset and questions`
          );
        }
        break;
    }
  }

  /**
   * Validate a single seed file
   */
  async validateSeedFile(filePath: string): Promise<ValidationResult> {
    const filename = path.basename(filePath);
    const result: ValidationResult = {
      filename,
      isValid: false,
      errors: [],
      warnings: [],
      activityCount: 0,
    };

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        result.errors.push(`File does not exist: ${filename}`);
        return result;
      }

      // Read and parse the file
      const fileContent = fs.readFileSync(filePath, "utf-8");

      // Check for syntax errors by attempting to import
      try {
        const module = await import(filePath);
        const exportKeys = Object.keys(module);

        // Find the activities array
        let activitiesArray: Activity[] | null = null;
        for (const key of exportKeys) {
          if (
            key.toLowerCase().includes("activities") &&
            Array.isArray(module[key])
          ) {
            activitiesArray = module[key];
            break;
          }
        }

        if (!activitiesArray) {
          result.errors.push(`No activities array found in ${filename}`);
          return result;
        }

        result.activityCount = activitiesArray.length;
        result.activities = activitiesArray;

        // Validate each activity
        activitiesArray.forEach((activity, index) => {
          const validation = this.validateActivity(activity, index);
          result.errors.push(...validation.errors);
          result.warnings.push(...validation.warnings);
        });

        // Check for expected number of activities (should be 10)
        if (activitiesArray.length !== 10) {
          result.warnings.push(
            `Expected 10 activities, found ${activitiesArray.length}`
          );
        }

        // Check for duplicate titles
        const titles = activitiesArray.map((a) => a.title);
        const duplicates = titles.filter(
          (title, index) => titles.indexOf(title) !== index
        );
        if (duplicates.length > 0) {
          result.errors.push(
            `Duplicate titles found: ${duplicates.join(", ")}`
          );
        }

        // Check for proper sort order
        const sortOrders = activitiesArray.map((a) => a.sortOrder);
        const expectedOrder = Array.from(
          { length: activitiesArray.length },
          (_, i) => i + 1
        );
        if (
          JSON.stringify(sortOrders.sort()) !== JSON.stringify(expectedOrder)
        ) {
          result.warnings.push(
            "Sort orders should be sequential starting from 1"
          );
        }

        result.isValid = result.errors.length === 0;
      } catch (importError: any) {
        result.errors.push(
          `Import error: ${importError?.message || String(importError)}`
        );
      }
    } catch (error: any) {
      result.errors.push(
        `File validation error: ${error?.message || String(error)}`
      );
    }

    return result;
  }

  /**
   * Validate all seed files in the activities directory
   */
  async validateAllFiles(): Promise<ValidationResult[]> {
    const activitiesDir = path.resolve(__dirname);
    const files = fs
      .readdirSync(activitiesDir)
      .filter((file) => file.endsWith("-python-fundamentals.ts"))
      .map((file) => path.join(activitiesDir, file));

    this.results = [];

    for (const file of files) {
      const result = await this.validateSeedFile(file);
      this.results.push(result);
    }

    return this.results;
  }

  /**
   * Generate validation report
   */
  generateReport(): string {
    let report = "\n=== ACTIVITY SEED FILES VALIDATION REPORT ===\n\n";

    const totalFiles = this.results.length;
    const validFiles = this.results.filter((r) => r.isValid).length;
    const totalActivities = this.results.reduce(
      (sum, r) => sum + r.activityCount,
      0
    );
    const totalErrors = this.results.reduce(
      (sum, r) => sum + r.errors.length,
      0
    );
    const totalWarnings = this.results.reduce(
      (sum, r) => sum + r.warnings.length,
      0
    );

    report += `📊 SUMMARY:\n`;
    report += `  Files Processed: ${totalFiles}\n`;
    report += `  Valid Files: ${validFiles}/${totalFiles}\n`;
    report += `  Total Activities: ${totalActivities}\n`;
    report += `  Total Errors: ${totalErrors}\n`;
    report += `  Total Warnings: ${totalWarnings}\n\n`;

    // Expected activity types coverage
    const foundTypes = new Set<string>();
    this.results.forEach((result) => {
      if (result.activities) {
        result.activities.forEach((activity) => {
          foundTypes.add(activity.activityType);
        });
      }
    });

    report += `🎯 ACTIVITY TYPE COVERAGE:\n`;
    EXPECTED_ACTIVITY_TYPES.forEach((type) => {
      const status = foundTypes.has(type) ? "✅" : "❌";
      report += `  ${status} ${type}\n`;
    });
    report += "\n";

    // Detailed file results
    report += `📋 DETAILED RESULTS:\n\n`;

    this.results.forEach((result) => {
      const status = result.isValid ? "✅" : "❌";
      report += `${status} ${result.filename} (${result.activityCount} activities)\n`;

      if (result.errors.length > 0) {
        report += `  ❌ ERRORS:\n`;
        result.errors.forEach((error) => (report += `     - ${error}\n`));
      }

      if (result.warnings.length > 0) {
        report += `  ⚠️  WARNINGS:\n`;
        result.warnings.forEach((warning) => (report += `     - ${warning}\n`));
      }

      report += "\n";
    });

    // Recommendations
    if (totalErrors > 0 || totalWarnings > 0) {
      report += `💡 RECOMMENDATIONS:\n`;
      if (totalErrors > 0) {
        report += `  - Fix all ${totalErrors} errors before proceeding with seeding\n`;
      }
      if (totalWarnings > 0) {
        report += `  - Review ${totalWarnings} warnings for quality improvements\n`;
      }
      report += `  - Ensure all activity types are represented\n`;
      report += `  - Verify educational value and content quality\n\n`;
    } else {
      report += `🎉 ALL VALIDATIONS PASSED! Files are ready for seeding.\n\n`;
    }

    return report;
  }
}

// Main execution
async function main() {
  console.log("🔍 Starting Activity Seed Files Validation...\n");

  const validator = new ActivityValidator();

  try {
    await validator.validateAllFiles();
    const report = validator.generateReport();

    console.log(report);

    // Write report to file
    const reportPath = path.join(__dirname, "validation-report.txt");
    fs.writeFileSync(reportPath, report);
    console.log(`📝 Full report saved to: ${reportPath}`);
  } catch (error) {
    console.error("❌ Validation failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { ActivityValidator, type ValidationResult };
