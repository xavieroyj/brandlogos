"use server";

import { generateText, experimental_generateImage as generateImage } from "ai";
import type { BrandFormValues } from "@/lib/schema";
import { textModel, imageModel } from "@/lib/ai-config";
import { removeThinkTags } from "@/lib/helper";

export async function generateIcons(data: BrandFormValues) {
  console.log("Generating icons...");
  try {
    // Step 1: Use text model to generate an enhanced prompt
    const { text: enhancedPrompt } = await generateText({
      model: textModel,
      prompt: `
      Create a detailed prompt for generating a brand icon based on the following information:
      Brand name: ${data.brandName}
      Description: ${data.description}
      Tags: ${data.tags.join(", ")}
      Style: ${data.style}

      The prompt should include specific visual details about colors, shapes, style, and composition that would help in generating a professional and distinctive brand icon. 
      Make the prompt detailed but concise.

      The final output should be a single paragraph format.
      You DO NOT need to include the word "prompt" in the final output. Be straight to the point and clear in your instructions.
      DO NOT SAY ANYTHING SUCH AS "Here is a detailed prompt for generating a brand icon" OR "This is the prompt".
      The prompt should be in plain text and in a paragraph format and have AT MOST 2000 characters.
      `,
    });
    const iconTextPrompt = removeThinkTags(enhancedPrompt);
    console.log("Enhanced Prompt:", iconTextPrompt);

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