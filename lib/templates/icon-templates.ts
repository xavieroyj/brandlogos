import { PromptTemplate } from "../prompt-template";
import { type IconStyle } from "../styles";

// Style-specific guidance for each icon style
const styleGuides: Record<IconStyle, string> = {
  anime: "Use anime aesthetics with bold outlines, dynamic shapes, and iconic simplification. Emphasize expressive elements and vibrant energy while maintaining professional appeal.",
  minimalist: "Design with absolute minimalism - use negative space, essential geometric shapes, and limited color palette. Remove all unnecessary elements. Each line and shape must have purpose.",
  simple: "Create a straightforward, easily recognizable icon using basic shapes and clear visual hierarchy. Focus on immediate understanding and universal appeal. Use simple color combinations.",
  words: "Focus on typography as the main design element. Create a distinctive letterform treatment that's both artistic and legible. Consider negative space and letter relationships."
};

// Helper to get style guidance
export const getStyleGuide = (style: IconStyle): string => styleGuides[style];

// Main icon generation prompt template
export const iconTemplates = {
  generateIconPrompt: new PromptTemplate(
    [
      "You are a professional brand icon designer. Create a distinctive icon for '{brandName}'.",
      "Context: {description}",
      "Key themes: {tags}",
      "Instructions:",
      "1. Focus on brand essence, avoiding literal representations.",
      "2. Ensure icon works at small sizes (favicon) and large sizes.",
      "3. Keep design clear and impactful.",
      "4. Style guidance: {style} style - {styleGuide}",
      "5. Use colors and shapes that reflect the themes: {tags}",
      "Please provide a detailed, professionally composed icon description."
    ].join('\n'),
    {
      brandName: { type: "string", required: true, description: "Brand name (max 50 chars)" },
      description: { type: "string", required: true, description: "Brand description (10-500 chars)" },
      tags: { type: "string[]", required: true, description: "Key themes (1-10 items)" },
      style: { type: "string", required: true, description: "Icon style" },
      styleGuide: { type: "string", required: true, description: "Style-specific guidance" }
    }
  )
};