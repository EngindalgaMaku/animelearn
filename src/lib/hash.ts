import { createHash } from "crypto";

/**
 * Buffer'dan MD5 hash hesaplar
 */
export function calculateFileHash(buffer: Buffer): string {
  return createHash("md5").update(buffer).digest("hex");
}

/**
 * Buffer'dan SHA256 image hash hesaplar (benzer görseller için)
 */
export function calculateImageHash(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

/**
 * Dosya içeriği benzerliği kontrolü
 */
export function areFilesIdentical(hash1: string, hash2: string): boolean {
  return hash1 === hash2;
}
