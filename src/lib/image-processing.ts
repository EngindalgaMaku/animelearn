import sharp from "sharp";
import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";

export interface ImageProcessingOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: "jpg" | "jpeg" | "png" | "webp";
}

export interface ProcessingResult {
  outputPath: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  format: string;
}

export class ImageProcessor {
  private defaultOptions: ImageProcessingOptions = {
    quality: 85,
    format: "jpg",
    width: 800,
    height: 1200,
  };

  async processImage(
    inputBuffer: Buffer,
    outputPath: string,
    options?: ImageProcessingOptions
  ): Promise<ProcessingResult> {
    const opts = { ...this.defaultOptions, ...options };

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    const originalSize = inputBuffer.length;

    // Process image with Sharp
    let sharpInstance = sharp(inputBuffer);

    // Get image metadata
    const metadata = await sharpInstance.metadata();

    // Resize if needed (maintain aspect ratio)
    if (opts.width || opts.height) {
      sharpInstance = sharpInstance.resize(opts.width, opts.height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Convert to JPG format
    if (opts.format === "jpg" || opts.format === "jpeg") {
      sharpInstance = sharpInstance.jpeg({
        quality: opts.quality,
        progressive: true,
        mozjpeg: true,
      });
    }

    // Process and save
    const outputBuffer = await sharpInstance.toBuffer();
    await fs.writeFile(outputPath, outputBuffer);

    const compressedSize = outputBuffer.length;
    const compressionRatio = Math.round(
      ((originalSize - compressedSize) / originalSize) * 100
    );

    return {
      outputPath,
      originalSize,
      compressedSize,
      compressionRatio,
      format: opts.format || "jpg",
    };
  }

  generateSecureFilename(): string {
    // Generate completely random UUID-based filename for security
    const uuid = randomUUID();
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 6);

    // Format: UUID_timestamp_random.jpg
    return `${uuid}_${timestamp}_${randomSuffix}.jpg`;
  }

  generateSecureThumbnailFilename(originalFilename: string): string {
    // Extract UUID from original filename and create thumbnail name
    const baseName = path.parse(originalFilename).name;
    return `thumb_${baseName}.jpg`;
  }

  private sanitizeForFilename(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_") // Replace non-alphanumeric with underscore
      .replace(/_+/g, "_") // Replace multiple underscores with single
      .replace(/^_|_$/g, "") // Remove leading/trailing underscores
      .substring(0, 20); // Limit length
  }

  async createThumbnail(
    inputPath: string,
    outputPath: string,
    size: number = 200
  ): Promise<string> {
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    await sharp(inputPath)
      .resize(size, Math.round(size * 1.5), {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    return outputPath;
  }

  async getImageInfo(inputBuffer: Buffer): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
    aspectRatio: number;
  }> {
    const metadata = await sharp(inputBuffer).metadata();

    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || "unknown",
      size: inputBuffer.length,
      aspectRatio:
        metadata.width && metadata.height
          ? Math.round((metadata.width / metadata.height) * 100) / 100
          : 0,
    };
  }

  async batchProcessImages(
    images: { buffer: Buffer; filename: string; cardInfo?: any }[],
    outputDir: string
  ): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];

    for (const image of images) {
      try {
        const secureFilename = this.generateSecureFilename();
        const outputPath = path.join(outputDir, secureFilename);

        const result = await this.processImage(image.buffer, outputPath);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process image ${image.filename}:`, error);
        // Continue with other images
      }
    }

    return results;
  }
}

// Singleton instance
export const imageProcessor = new ImageProcessor();

// Helper functions for easy use
export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string,
  outputDir: string,
  cardInfo?: {
    series?: string;
    character?: string;
    rarity?: string;
    cardType?: string;
  }
): Promise<{
  filename: string;
  path: string;
  url: string;
  thumbnailFilename: string;
  thumbnailPath: string;
  thumbnailUrl: string;
  processingResult: ProcessingResult;
}> {
  // Generate secure random filename
  const secureFilename = imageProcessor.generateSecureFilename();
  const outputPath = path.join(outputDir, secureFilename);

  // Create thumbnails directory
  const thumbsDir = path.join(outputDir, "thumbs");
  await fs.mkdir(thumbsDir, { recursive: true });

  // Process main image
  const processingResult = await imageProcessor.processImage(
    buffer,
    outputPath
  );

  // Generate thumbnail
  const thumbnailFilename =
    imageProcessor.generateSecureThumbnailFilename(secureFilename);
  const thumbnailPath = path.join(thumbsDir, thumbnailFilename);

  await imageProcessor.createThumbnail(outputPath, thumbnailPath, 300);

  return {
    filename: secureFilename,
    path: outputPath,
    url: `/uploads/${secureFilename}`,
    thumbnailFilename,
    thumbnailPath,
    thumbnailUrl: `/uploads/thumbs/${thumbnailFilename}`,
    processingResult,
  };
}
