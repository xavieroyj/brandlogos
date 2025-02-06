import { NextResponse } from "next/server";
import { generateFaviconPackage } from "@/app/actions/generate-favicon-package";

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const result = await generateFaviconPackage(imageUrl);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating favicon package:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate favicon package" },
      { status: 500 }
    );
  }
}