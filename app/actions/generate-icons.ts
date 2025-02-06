"use server";

import { generateText, experimental_generateImage as generateImage } from "ai";
import type { BrandFormValues } from "@/lib/schema";
import { textModel, imageModel } from "@/lib/ai-config";
import { removeThinkTags } from "@/lib/helper";
import { iconTemplates, getStyleGuide } from "@/lib/prompt/templates/icon-templates";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { S3Client } from "@/lib/storage/s3-client";
import { prisma } from "@/lib/prisma";
import { nanoid } from 'nanoid';
import { deductCredits } from "./manage-credits";

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
            size: "512x512", // Square format for icons
        });

        const s3Client = S3Client.getInstance();

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
                const s3Url = await s3Client.uploadToS3(base64Data, s3Key);
                console.log("S3 URL:", s3Url);

                return {
                    s3Key,
                    s3Url,
                    base64: base64Data // Include base64 for immediate display
                };
            })
        );

        // Create a generation session
        const generationSession = await prisma.generationSession.create({
            data: {
                userId: session.user.id,
                prompt: iconTextPrompt,
                style: data.style,
                brandName: data.brandName,
                tags: data.tags,
                images: {
                    create: storedImages.map(img => ({
                        userId: session.user.id,
                        s3Key: img.s3Key,
                        s3Url: img.s3Url
                    }))
                }
            },
            include: {
                images: true
            }
        });

        // Deduct credits only after successful generation
        let creditsRemaining: number;
        try {
            const creditData = await deductCredits(session.user.id);
            creditsRemaining = creditData.remaining;
        } catch (error) {
            // Even if credit deduction fails, we return the generated images
            console.error("[DEDUCT_CREDITS]", error);
            return {
                success: true,
                images: generationSession.images.map(img => ({
                    url: img.s3Url,
                    id: img.id
                })),
                error: error instanceof Error ? error.message : "Failed to deduct credits"
            };
        }

        return {
            success: true,
            images: generationSession.images.map(img => ({
                url: img.s3Url,
                id: img.id
            })),
            creditsRemaining
        };

    } catch (error) {
        console.error("[GENERATE_ICONS]", error);
        return {
            success: false,
            error: "Failed to generate icons"
        };
    }
}
