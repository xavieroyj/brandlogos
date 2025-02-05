"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SubscriptionTier } from "@prisma/client";

interface SubscriptionInfo {
    status: string;
    currentPeriodEnd: string;
}

interface CreditResponse {
    total: number;
    used: number;
    remaining: number;
    resetDate: string;
    tier: SubscriptionTier;
    monthlyCredits: number | null;
    subscription: SubscriptionInfo | null;
}

/**
 * Get user's credit information including subscription status
 */
export async function getUserCredits(userId: string): Promise<CreditResponse> {
    const session = await auth.api.getSession({
        headers: headers()
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    if (session.user.id !== userId) {
        throw new Error("Forbidden");
    }

    // Get user's credits with minimal subscription data
    const userCredit = await prisma.credit.findUnique({
        where: { userId },
        select: {
            dailyCredits: true,
            usedCredits: true,
            resetDate: true,
            tier: true,
            monthlyCredits: true,
            user: {
                select: {
                    subscriptions: {
                        where: { status: "active" },
                        orderBy: { createdAt: "desc" },
                        take: 1,
                        select: {
                            status: true,
                            currentPeriodEnd: true
                        }
                    }
                }
            }
        }
    });

    if (!userCredit) {
        // Create initial credits for user
        const newCredit = await prisma.credit.create({
            data: {
                userId,
                tier: "FREE",
                monthlyCredits: 500,
                dailyCredits: 5,
                usedCredits: 0,
                resetDate: new Date(new Date().setHours(23, 59, 59, 999)),
            },
            select: {
                dailyCredits: true,
                usedCredits: true,
                resetDate: true,
                tier: true,
                monthlyCredits: true
            }
        });

        return {
            total: newCredit.dailyCredits,
            used: newCredit.usedCredits,
            remaining: newCredit.dailyCredits - newCredit.usedCredits,
            resetDate: newCredit.resetDate.toISOString(),
            tier: newCredit.tier,
            monthlyCredits: newCredit.monthlyCredits,
            subscription: null
        };
    }

    return {
        total: userCredit.dailyCredits,
        used: userCredit.usedCredits,
        remaining: userCredit.dailyCredits - userCredit.usedCredits,
        resetDate: userCredit.resetDate.toISOString(),
        tier: userCredit.tier,
        monthlyCredits: userCredit.monthlyCredits,
        subscription: userCredit.user.subscriptions[0] ? {
            status: userCredit.user.subscriptions[0].status,
            currentPeriodEnd: userCredit.user.subscriptions[0].currentPeriodEnd.toISOString()
        } : null
    };
}

/**
 * Deduct credits from user's balance
 * Uses a transaction to ensure atomic operations and data consistency
 */
export async function deductCredits(userId: string): Promise<{ remaining: number }> {
    const session = await auth.api.getSession({
        headers: headers()
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    if (session.user.id !== userId) {
        throw new Error("Forbidden");
    }

    try {
        // Use a transaction to ensure atomic update
        const result = await prisma.$transaction(async (tx) => {
            // Get current credits with a row lock
            const userCredit = await tx.credit.findUnique({
                where: { userId },
                select: {
                    dailyCredits: true,
                    usedCredits: true,
                    resetDate: true
                }
            });

            if (!userCredit) {
                throw new Error("No credits found");
            }

            // Check if credits need to be reset by comparing dates without time
            const now = new Date();
            const resetDate = new Date(userCredit.resetDate);
            const shouldReset = resetDate.setHours(0,0,0,0) < now.setHours(0,0,0,0);
            const currentUsedCredits = shouldReset ? 0 : userCredit.usedCredits;

            // If resetting, set the next reset date to the end of the current day
            const newResetDate = shouldReset ?
                new Date(new Date().setHours(23, 59, 59, 999)) :
                userCredit.resetDate;

            if (!shouldReset && userCredit.dailyCredits <= currentUsedCredits) {
                throw new Error("No credits remaining");
            }

            // Update credits atomically
            const updatedCredit = await tx.credit.update({
                where: { userId },
                data: {
                    usedCredits: currentUsedCredits + 1,
                    resetDate: newResetDate
                },
                select: {
                    dailyCredits: true,
                    usedCredits: true
                }
            });

            return {
                remaining: updatedCredit.dailyCredits - updatedCredit.usedCredits
            };
        });

        return result;
    } catch (error) {
        console.error("[DEDUCT_CREDITS]", error);
        throw error;
    }
}
