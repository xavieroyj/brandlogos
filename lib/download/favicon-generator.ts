import JSZip from 'jszip';

export interface FaviconSizes {
  favicon: number[];
  apple: number[];
  manifest: number[];
}

export const FAVICON_SIZES: FaviconSizes = {
  favicon: [16, 32, 48, 64, 128, 256],
  apple: [180],  // Apple touch icon size
  manifest: [192, 512] // Web manifest sizes
};

export async function generateFaviconPackage(base64Image: string): Promise<Blob> {
  const zip = new JSZip();
  
  // Create a folder for the favicons
  const faviconFolder = zip.folder("favicons");
  if (!faviconFolder) throw new Error("Failed to create favicon folder");

  // Convert base64 to blob
  const imageBlob = await fetch(`data:image/png;base64,${base64Image}`).then(res => res.blob());

  // Helper function to resize image and convert to blob
  async function resizeImage(width: number, height: number): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Failed to get canvas context");

    // Create an image element
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(imageBlob);
    });

    // Draw the image at the specified size
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert canvas to blob"));
      }, 'image/png');
    });
  }

  // Add original image
  faviconFolder.file("original.png", imageBlob);

  // Generate standard favicon sizes
  for (const size of FAVICON_SIZES.favicon) {
    const blob = await resizeImage(size, size);
    faviconFolder.file(`favicon-${size}x${size}.png`, blob);
  }

  // Generate apple touch icon
  for (const size of FAVICON_SIZES.apple) {
    const blob = await resizeImage(size, size);
    faviconFolder.file(`apple-touch-icon.png`, blob);
  }

  // Generate web manifest icons
  for (const size of FAVICON_SIZES.manifest) {
    const blob = await resizeImage(size, size);
    faviconFolder.file(`icon-${size}x${size}.png`, blob);
  }

  // Generate ICO file for classic favicon
  const smallestSizes = FAVICON_SIZES.favicon.filter(size => size <= 64);
  const icoBlobs = await Promise.all(smallestSizes.map(size => resizeImage(size, size)));
  // Note: In a real implementation, you'd want to properly create an ICO file
  // For now, we'll just include the 32x32 version as favicon.ico
  faviconFolder.file("favicon.ico", icoBlobs[1]); // Using 32x32 size

  return await zip.generateAsync({ type: "blob" });
}

export function downloadZip(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}