"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getUserImages(userId: string) {
    try {
        const session = await auth.api.getSession({
            headers: headers()
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        // Ensure user can only access their own images
        if (session?.user.id !== userId) {
            throw new Error("Forbidden");
        }

        // Fetch user's generation sessions with their images
        const sessions = await prisma.generationSession.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                images: {
                    select: {
                        id: true,
                        s3Url: true,
                        createdAt: true,
                    }
                }
            }
        });

        // Transform the data to match the frontend interface
        return sessions.map(session => ({
            id: session.id,
            brandName: session.brandName,
            style: session.style,
            prompt: session.prompt,
            tags: session.tags,
            createdAt: session.createdAt.toISOString(),
            images: session.images.map(image => ({
                id: image.id,
                url: image.s3Url,
                createdAt: image.createdAt.toISOString()
            }))
        }));

    } catch (error) {
        console.error("[GET_USER_IMAGES]", error);
        throw error;
    }
}
