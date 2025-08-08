import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// GET - Fetch all settings
export async function GET() {
  try {
    const settings = await db.settings.findMany({
      orderBy: { key: 'asc' },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    console.log("Starting settings update...");
    
    // Test database connection first
    try {
      await db.$connect();
      console.log("Database connected successfully");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    const body = await request.json();
    console.log("Request body:", body);
    
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: "Settings must be an array" },
        { status: 400 }
      );
    }

    console.log(`Processing ${settings.length} settings...`);

    // Use transaction to ensure all updates succeed or fail together
    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const results = [];
      
      for (const setting of settings) {
        const { key, value, type, description } = setting;
        
        console.log(`Processing setting: ${key} = ${value} (${type})`);

        if (!key || value === undefined) {
          throw new Error(`Invalid setting: key="${key}", value="${value}"`);
        }

        // Validate value based on type
        if (type === 'number' && value !== '' && isNaN(Number(value))) {
          throw new Error(`Invalid number value for ${key}: ${value}`);
        }

        if (type === 'boolean' && value !== '' && !['true', 'false', true, false].includes(value)) {
          throw new Error(`Invalid boolean value for ${key}: ${value}`);
        }

        if (type === 'email' && value && !isValidEmail(String(value))) {
          throw new Error(`Invalid email value for ${key}: ${value}`);
        }

        if (type === 'url' && value && !isValidUrl(String(value))) {
          throw new Error(`Invalid URL value for ${key}: ${value}`);
        }

        // Convert boolean values properly
        let finalValue = value;
        if (type === 'boolean') {
          finalValue = value === true || value === 'true' ? 'true' : 'false';
        }

        // Upsert the setting
        const upsertResult = await tx.settings.upsert({
          where: { key },
          update: {
            value: String(finalValue),
            type: type || 'string',
            description: description || null,
            updatedAt: new Date(),
          },
          create: {
            key,
            value: String(finalValue),
            type: type || 'string',
            description: description || null,
          },
        });
        
        results.push(upsertResult);
        console.log(`Successfully processed setting: ${key}`);
      }
      
      return results;
    }, {
      timeout: 10000, // 10 second timeout
    });

    console.log("Transaction completed successfully");

    // Fetch updated settings
    const updatedSettings = await db.settings.findMany({
      orderBy: { key: 'asc' },
    });

    console.log(`Returning ${updatedSettings.length} updated settings`);

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    
    // More detailed error information
    if (error && typeof error === 'object' && 'code' in error) {
      console.error("Prisma error code:", error.code);
      console.error("Prisma error meta:", (error as any).meta);
    }
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update settings",
        details: error && typeof error === 'object' && 'code' in error ? {
          code: (error as any).code,
          meta: (error as any).meta
        } : undefined
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

// POST - Create individual setting
export async function POST(request: NextRequest) {
  try {
    const { key, value, type, description } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    // Check if setting already exists
    const existingSetting = await db.settings.findUnique({
      where: { key },
    });

    if (existingSetting) {
      return NextResponse.json(
        { error: "Setting already exists" },
        { status: 409 }
      );
    }

    const setting = await db.settings.create({
      data: {
        key,
        value: String(value),
        type: type || 'string',
        description: description || null,
      },
    });

    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    console.error("Failed to create setting:", error);
    return NextResponse.json(
      { error: "Failed to create setting" },
      { status: 500 }
    );
  }
}

// DELETE - Delete individual setting
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: "Key parameter is required" },
        { status: 400 }
      );
    }

    const deletedSetting = await db.settings.delete({
      where: { key },
    });

    return NextResponse.json({
      message: "Setting deleted successfully",
      setting: deletedSetting,
    });
  } catch (error) {
    console.error("Failed to delete setting:", error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: "Setting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete setting" },
      { status: 500 }
    );
  }
}

// Utility functions for validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
