"use server";

import { generateText, experimental_generateImage as generateImage } from "ai";
import type { BrandFormValues } from "@/lib/schema";
import { textModel, imageModel } from "@/lib/ai-config";
import { removeThinkTags } from "@/lib/helper";
import { iconTemplates } from "@/lib/templates/icon-templates";

export async function generateIcons(data: BrandFormValues) {
  console.log("Generating icons...");
  try {
    // Step 1: Use text model with template to generate an enhanced prompt
    const templatePrompt = iconTemplates.generateIconPrompt.formatTemplate({
      brandName: data.brandName,
      description: data.description,
      tags: data.tags,
      style: data.style
    });
    console.log("Template Prompt:", templatePrompt);

    const { text: enhancedPrompt } = await generateText({
      model: textModel,
      prompt: templatePrompt
    });
    const iconTextPrompt = removeThinkTags(enhancedPrompt);

    // Step 2: Generate 4 icons using the image model
    const { images } = await generateImage({
      model: imageModel,
      prompt: iconTextPrompt,
      n: 4, // Generate 4 images
      size: "1024x1024", // Square format for icons
    });

    // Return the base64 encoded images
    return images.map(img => img.base64);

  } catch (error) {
    console.error("Error generating icons:", error);
    throw new Error("Failed to generate icons. Please try again.");
  }
}