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

        // Reset all users' daily credits
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        // Update all credits that haven't been reset today
        const result = await prisma.credit.updateMany({
            where: {
                resetDate: {
                    lt: new Date(now.setHours(0, 0, 0, 0)) // Start of today
                }
            },
            data: {
                usedCredits: 0,
                resetDate: now
            }
        });

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