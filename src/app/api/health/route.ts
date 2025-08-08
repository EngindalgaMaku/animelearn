import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        build: "success",
        environment: process.env.NODE_ENV || "development"
      },
      version: "1.0.0",
      uptime: process.uptime()
    };

    return NextResponse.json(healthData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Database connection failed",
        services: {
          database: "disconnected",
          build: "success",
          environment: process.env.NODE_ENV || "development"
        }
      },
      { status: 503 }
    );
  }
}