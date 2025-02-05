"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

interface PaginationParams {
    cursor?: string;
    limit?: number;
}

export async function getUserImages(userId: string, pagination?: PaginationParams) {
    try {
        const session = await auth.api.getSession({
            headers: headers()
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        if (session?.user.id !== userId) {
            throw new Error("Forbidden");
        }

        // Default to 10 items per page if not specified
        const limit = pagination?.limit || 10;
        const cursor = pagination?.cursor;

        // Fetch user's generation sessions with their images using cursor pagination
        const sessions = await prisma.generationSession.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            ...(cursor && {
                skip: 1, // Skip the cursor
                cursor: {
                    id: cursor
                }
            }),
            select: {
                id: true,
                brandName: true,
                style: true,
                prompt: true,
                tags: true,
                createdAt: true,
                images: {
                    select: {
                        id: true,
                        s3Url: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        // Get the total count (only on first page request)
        const total = !cursor ? await prisma.generationSession.count({
            where: { userId }
        }) : undefined;

        // Get the next cursor
        const nextCursor = sessions.length === limit ? sessions[sessions.length - 1].id : undefined;

        // Transform the data to match the frontend interface
        const transformedSessions = sessions.map(session => ({
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

        return {
            sessions: transformedSessions,
            pagination: {
                nextCursor,
                total
            }
        };

    } catch (error) {
        console.error("[GET_USER_IMAGES]", error);
        throw error;
    }
}
