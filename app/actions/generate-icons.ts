"use server";

import { generateText, experimental_generateImage as generateImage } from "ai";
import type { BrandFormValues } from "@/lib/schema";
import { textModel, imageModel } from "@/lib/ai-config";
import { removeThinkTags } from "@/lib/helper";
import { iconTemplates, getStyleGuide } from "@/lib/prompt/templates/icon-templates";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadToS3 } from "@/lib/storage/s3-client";
import { prisma } from "@/lib/prisma";
import { nanoid } from 'nanoid';

interface GenerateIconsResponse {
    success: boolean;
    error?: string;
    images?: Array<{
        url: string;
        id: string;
    }>;
    creditsRemaining?: number;
}

export async function generateIcons(data: BrandFormValues): Promise<GenerateIconsResponse> {
    try {
        const session = await auth.api.getSession({
            headers: headers()
        });

        if (!session?.user) {
            return {
                success: false,
                error: "You must be logged in to generate icons"
            };
        }

        // Try to deduct credits first
        const deductResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${session.user.id}/credits/deduct`, {
            method: 'POST',
            headers: {
                'Cookie': headers().get('cookie') || ''
            }
        });

        if (!deductResponse.ok) {
            const error = await deductResponse.text();
            return {
                success: false,
                error: error || "Failed to deduct credits"
            };
        }

        const creditData = await deductResponse.json();

        // Step 1: Use text model with template to generate an enhanced prompt
        const styleGuide = getStyleGuide(data.style);
        const templatePrompt = iconTemplates.generateIconPrompt.formatTemplate({
            brandName: data.brandName,
            description: data.description,
            tags: data.tags,
            style: data.style,
            styleGuide
        });

        // Generate using the enhanced prompt
        const { text: enhancedPrompt } = await generateText({
            model: textModel,
            prompt: templatePrompt
        });
        const iconTextPrompt = removeThinkTags(enhancedPrompt);
        console.log("AI Generated prompt:", iconTextPrompt);

        // Step 2: Generate 4 icons using the image model
        const { images } = await generateImage({
            model: imageModel,
            prompt: iconTextPrompt,
            n: 4, // Generate 4 images
            size: "1024x1024", // Square format for icons
        });

        // Process and store each image
        const storedImages = await Promise.all(
            images.map(async (img) => {
                // Clean the base64 string
                const base64Data = img.base64.includes('data:image') 
                    ? img.base64.replace(/^data:image\/\w+;base64,/, '')
                    : img.base64;

                // Generate a unique key for S3
                const imageId = nanoid();
                const s3Key = `${session.user.id}/${data.brandName}/${imageId}.png`;

                // Upload to S3
                const s3Url = await uploadToS3(base64Data, s3Key);

                // Store in database
                const storedImage = await prisma.generatedImage.create({
                    data: {
                        userId: session.user.id,
                        prompt: iconTextPrompt,
                        s3Key,
                        s3Url,
                        style: data.style,
                        brandName: data.brandName,
                        tags: data.tags
                    }
                });

                return {
                    url: s3Url,
                    id: storedImage.id,
                    base64: base64Data // Include base64 for immediate display
                };
            })
        );

        return {
            success: true,
            images: storedImages.map(img => ({
                url: img.url,
                id: img.id
            })),
            creditsRemaining: creditData.remaining
        };

    } catch (error) {
        console.error("[GENERATE_ICONS]", error);
        return {
            success: false,
            error: "Failed to generate icons"
        };
    }
}