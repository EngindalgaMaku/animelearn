import jwt from "jsonwebtoken";
import crypto from "crypto";

// JWT secret for image authentication
const IMAGE_JWT_SECRET =
  process.env.IMAGE_JWT_SECRET || crypto.randomBytes(64).toString("hex");

// URL expiration time (10 minutes)
const URL_EXPIRATION_TIME = 10 * 60; // 10 minutes in seconds

export interface ImageTokenPayload {
  imageId: string;
  userId?: string;
  iat: number;
  exp: number;
}

/**
 * Generate a temporary signed URL for image access
 */
export function generateImageToken(imageId: string, userId?: string): string {
  const payload: Omit<ImageTokenPayload, "iat" | "exp"> = {
    imageId,
    userId,
  };

  // Create JWT token with expiration
  const token = jwt.sign(payload, IMAGE_JWT_SECRET, {
    expiresIn: URL_EXPIRATION_TIME,
    algorithm: "HS256",
  });

  return token;
}

/**
 * Verify and decode image token
 */
export function verifyImageToken(token: string): ImageTokenPayload | null {
  try {
    const decoded = jwt.verify(token, IMAGE_JWT_SECRET, {
      algorithms: ["HS256"],
    }) as ImageTokenPayload;

    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * Generate secure image URL with temporary token
 */
export function generateSecureImageUrl(
  imageId: string,
  userId?: string
): string {
  const token = generateImageToken(imageId, userId);
  return `/api/images/${imageId}?token=${token}`;
}

/**
 * Extract image ID from original image URL
 */
export function extractImageId(imageUrl: string): string {
  // Extract full filename with extension as ID
  const filename = imageUrl.split("/").pop() || "";
  // Return full filename if it exists, otherwise generate random ID
  return filename || crypto.randomUUID();
}

/**
 * Check if token is about to expire (less than 2 minutes remaining)
 */
export function isTokenExpiringSoon(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as ImageTokenPayload;
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;

    // Return true if less than 2 minutes remaining
    return timeUntilExpiry < 120;
  } catch {
    return true;
  }
}

/**
 * Rate limiting for image requests
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests = 100): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes

  const current = requestCounts.get(identifier);

  if (!current || now > current.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}
