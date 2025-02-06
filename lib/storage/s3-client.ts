import { S3Client as AWSS3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

export class S3Client {
    private static instance: S3Client;
    private client: AWSS3Client;

    private constructor() {
        this.client = new AWSS3Client({
            region: process.env.AWS_REGION!,
            endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
            }
        });
    }

    public static getInstance(): S3Client {
        if (!S3Client.instance) {
            S3Client.instance = new S3Client();
        }
        return S3Client.instance;
    }

    async uploadToS3(
        base64Image: string,
        key: string,
        contentType = 'image/png'
    ): Promise<string> {
        // Convert base64 to buffer
        const buffer = Buffer.from(base64Image, 'base64');

        // Upload to S3
        await this.client.send(
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

    async getObject(url: string): Promise<Buffer> {
        // Extract key from URL
        const key = url.replace(`${process.env.CLOUDFLARE_R2_PUBLIC_URL}/`, '');
        
        // Get object from S3
        const response = await this.client.send(
            new GetObjectCommand({
                Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
                Key: key,
            })
        );

        // Convert stream to buffer
        if (!response.Body) {
            throw new Error('No body in response');
        }

        const chunks: Uint8Array[] = [];
        for await (const chunk of response.Body as any) {
            chunks.push(chunk);
        }
        
        return Buffer.concat(chunks);
    }
}