import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateUserCredits } from '@/lib/stripe';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Get failed credits and their recent logs
        const creditsWithLogs = await prisma.$transaction(async (tx) => {
            // First get failed credits from last 24 hours
            const failedCredits = await tx.credit.findMany({
                where: {
                    updateStatus: 'FAILED',
                    updatedAt: {
                        gte: oneDayAgo
                    }
                }
            });

            // For each failed credit, get their recent logs
            const creditsWithLogs = await Promise.all(
                failedCredits.map(async (credit) => {
                    const recentLogs = await tx.creditUpdateLog.findMany({
                        where: {
                            creditId: credit.id,
                            createdAt: {
                                gte: oneDayAgo
                            }
                        },
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 3 // Check last 3 attempts
                    });

                    return {
                        ...credit,
                        recentLogs
                    };
                })
            );

            // Filter credits with less than 3 attempts
            return creditsWithLogs.filter(credit => credit.recentLogs.length < 3);
        });

        console.log('[RETRY_CREDIT_UPDATES] Found recent failed credits:', creditsWithLogs.length);

        for (const credit of creditsWithLogs) {
            const lastLog = credit.recentLogs[0];

            // Only retry if enough time has passed since last attempt (15 min cooldown)
            if (lastLog && Date.now() - lastLog.createdAt.getTime() < 15 * 60 * 1000) {
                console.log('[RETRY_CREDIT_UPDATES] Skipping recent retry for user:', credit.userId);
                continue;
            }

            try {
                await updateUserCredits(credit.userId, credit.tier);
                console.log('[RETRY_CREDIT_UPDATES] Successfully updated credits for user:', credit.userId);
            } catch (error) {
                console.error('[RETRY_CREDIT_UPDATES] Failed to update credits for user:', credit.userId, error);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${creditsWithLogs.length} eligible failed credit updates`
        });
    } catch (error) {
        console.error('[RETRY_CREDIT_UPDATES] Error:', error);
        return NextResponse.json(
            { error: 'Failed to process credit update retries' },
            { status: 500 }
        );
    }
}
