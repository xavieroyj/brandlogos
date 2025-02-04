import { uploadToS3 } from "@/lib/storage/s3-client";

async function testR2Connection() {
    try {
        console.log("Testing R2 connection...");
        
        // Create a test image (1x1 pixel transparent PNG in base64)
        const testImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
        
        // Try to upload
        const testKey = `test-${Date.now()}.png`;
        console.log("Uploading test image...");
        
        const url = await uploadToS3(testImage, testKey);
        console.log("Successfully uploaded test image!");
        console.log("Public URL:", url);
        
        // Try to download
        console.log("Verifying download...");
        const response = await fetch(url);
        if (response.ok) {
            console.log("Successfully downloaded test image!");
            console.log("R2 connection test passed! ✅");
        } else {
            console.error("Failed to download test image");
        }
    } catch (error) {
        console.error("R2 connection test failed:", error);
    }
}

testR2Connection(); 