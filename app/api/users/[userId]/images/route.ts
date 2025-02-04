import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        // Verify authentication
        const session = await auth.api.getSession({
            headers: headers(),
        });

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Ensure user can only access their own images
        if (session.user.id !== params.userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Fetch user's generated images
        const images = await prisma.generatedImage.findMany({
            where: {
                userId: params.userId,
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                s3Url: true,
                brandName: true,
                style: true,
                createdAt: true,
            }
        });

        // Transform the data to match the frontend interface
        const transformedImages = images.map(image => ({
            id: image.id,
            url: image.s3Url,
            brandName: image.brandName,
            style: image.style,
            createdAt: image.createdAt.toISOString(),
        }));

        return NextResponse.json(transformedImages);

    } catch (error) {
        console.error("[GET_USER_IMAGES]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
} 