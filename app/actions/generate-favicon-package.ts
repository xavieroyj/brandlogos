"use server";

import { S3Client } from "@/lib/storage/s3-client";
import JSZip from "jszip";
import sharp from "sharp";

const FAVICON_SIZES = {
  favicon: [16, 32, 48, 64, 128, 256],
  apple: [180],  // Apple touch icon size
  manifest: [192, 512] // Web manifest sizes
};

// Helper function to convert Buffer to Base64
function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

export async function generateFaviconPackage(s3Url: string): Promise<{ base64Zip: string }> {
  const zip = new JSZip();
  const faviconFolder = zip.folder("favicons");
  if (!faviconFolder) throw new Error("Failed to create favicon folder");

  try {
    // Download the original image from S3
    const s3Client = S3Client.getInstance();
    const imageData = await s3Client.getObject(s3Url);

    // Add original image
    faviconFolder.file("original.png", imageData);

    // Generate standard favicon sizes
    for (const size of FAVICON_SIZES.favicon) {
      const resized = await sharp(imageData)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();
      
      faviconFolder.file(`favicon-${size}x${size}.png`, resized);
    }

    // Generate apple touch icon
    for (const size of FAVICON_SIZES.apple) {
      const resized = await sharp(imageData)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();
      
      faviconFolder.file(`apple-touch-icon.png`, resized);
    }

    // Generate web manifest icons
    for (const size of FAVICON_SIZES.manifest) {
      const resized = await sharp(imageData)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();
      
      faviconFolder.file(`icon-${size}x${size}.png`, resized);
    }

    // Generate ICO file for classic favicon (32x32)
    const icoData = await sharp(imageData)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    
    faviconFolder.file("favicon.ico", icoData);

    // Generate the zip file as a buffer
    const zipBuffer = await zip.generateAsync({ 
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    });

    // Convert to base64 for safe transport
    return {
      base64Zip: bufferToBase64(zipBuffer)
    };

  } catch (error) {
    console.error('Error generating favicon package:', error);
    throw new Error(`Failed to generate favicon package: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}