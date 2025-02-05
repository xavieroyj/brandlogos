import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// This endpoint should be called by a CRON job service (e.g., Vercel Cron)
export async function POST() {
    try {
        // Verify CRON secret to ensure this is called by our CRON service
        const headersList = headers();
        const cronSecret = headersList.get('x-cron-secret');
        
        if (cronSecret !== process.env.CRON_SECRET) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Reset all users' daily credits based on their tier
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));

        // Get all credits that need reset
        const creditsToReset = await prisma.credit.findMany({
            where: {
                resetDate: {
                    lt: startOfToday
                }
            },
            select: {
                id: true,
                userId: true,
                tier: true
            }
        });

        // Update each user's credits based on their tier
        const updates = await Promise.all(
            creditsToReset.map(credit =>
                prisma.credit.update({
                    where: { id: credit.id },
                    data: {
                        usedCredits: 0,
                        resetDate: now,
                        // Keep existing tier and dailyCredits
                    }
                })
            )
        );

        const result = {
            count: updates.length
        };

        return NextResponse.json({
            success: true,
            message: `Reset ${result.count} users' credits`,
            timestamp: now.toISOString()
        });

    } catch (error) {
        console.error("[CRON_RESET_CREDITS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
} 