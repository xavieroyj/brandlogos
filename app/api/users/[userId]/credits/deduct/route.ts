import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(
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

        // Only allow users to deduct their own credits
        if (session.user.id !== params.userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Get user's current credits
        const userCredit = await prisma.credit.findUnique({
            where: { userId: params.userId }
        });

        if (!userCredit) {
            return new NextResponse("No credits found", { status: 404 });
        }

        // Check if user has enough credits
        if (userCredit.usedCredits >= userCredit.dailyCredits) {
            return new NextResponse("Daily credit limit reached", { status: 403 });
        }

        // Deduct one credit
        const updatedCredit = await prisma.credit.update({
            where: { userId: params.userId },
            data: {
                usedCredits: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({
            success: true,
            remaining: userCredit.dailyCredits - (updatedCredit.usedCredits),
            used: updatedCredit.usedCredits,
            total: userCredit.dailyCredits
        });

    } catch (error) {
        console.error("[CREDITS_DEDUCT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
} 