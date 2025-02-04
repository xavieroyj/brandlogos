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

    // Get user's credits from database
    const userCredit = await prisma.credit.findUnique({
        where: { userId },
        include: {
            user: {
                include: {
                    subscriptions: {
                        where: {
                            status: "active"
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                        take: 1
                    }
                }
            }
        }
    });

    if (!userCredit) {
        // Create or update credits for users
        const newCredit = await prisma.credit.upsert({
            where: {
                userId,
            },
            create: {
                userId,
                tier: "FREE",
                monthlyCredits: 500,
                dailyCredits: 5,
                usedCredits: 0,
                resetDate: new Date(),
            },
            update: {} // If it exists, don't update anything
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

    // Get current credits
    const userCredit = await prisma.credit.findUnique({
        where: { userId }
    });

    if (!userCredit) {
        throw new Error("No credits found");
    }

    const remaining = userCredit.dailyCredits - userCredit.usedCredits;
    if (remaining <= 0) {
        throw new Error("No credits remaining");
    }

    // Deduct one credit
    const updatedCredit = await prisma.credit.update({
        where: { userId },
        data: {
            usedCredits: userCredit.usedCredits + 1
        }
    });

    return {
        remaining: updatedCredit.dailyCredits - updatedCredit.usedCredits
    };
}
