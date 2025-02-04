import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await auth.api.getSession({
            headers: headers()
        });

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Only allow users to fetch their own credits
        if (session.user.id !== params.userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Get user's credits from database
        const userCredit = await prisma.credit.findUnique({
            where: { userId: params.userId },
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
                    userId: params.userId,
                },
                create: {
                    userId: params.userId,
                    tier: "FREE",
                    monthlyCredits: 500,
                    dailyCredits: 5,
                    usedCredits: 0,
                    resetDate: new Date(),
                },
                update: {} // If it exists, don't update anything
            });

            return NextResponse.json({
                total: newCredit.dailyCredits,
                used: newCredit.usedCredits,
                remaining: newCredit.dailyCredits - newCredit.usedCredits,
                resetDate: newCredit.resetDate,
                tier: newCredit.tier,
                monthlyCredits: newCredit.monthlyCredits,
                subscription: null
            });
        }

        return NextResponse.json({
            total: userCredit.dailyCredits,
            used: userCredit.usedCredits,
            remaining: userCredit.dailyCredits - userCredit.usedCredits,
            resetDate: userCredit.resetDate,
            tier: userCredit.tier,
            monthlyCredits: userCredit.monthlyCredits,
            subscription: userCredit.user.subscriptions[0] || null
        });

    } catch (error) {
        console.error("[CREDITS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
