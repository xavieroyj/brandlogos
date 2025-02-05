import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    }
});

export async function uploadToS3(
    base64Image: string,
    key: string,
    contentType = 'image/png'
): Promise<string> {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Image, 'base64');

    // Upload to S3
    await s3Client.send(
        new PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            ACL: 'public-read',
        })
    );

    // Return the public URL
    return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
}