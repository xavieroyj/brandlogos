import { PromptTemplate } from "../prompt-template";
import { type IconStyle } from "../styles";

// Style-specific guidance for each icon style
const styleGuides: Record<IconStyle, string> = {
  anime: "Create using distinctive anime visual language: bold, confident line work with variable thickness (2-4px), dynamic shapes suggesting movement, and iconic simplification that maintains brand sophistication. Use dramatic angles (15-45 degrees) for energy, incorporate subtle gradient transitions, and ensure a balance between kawaii appeal and professional credibility. Pay special attention to eye-catching focal points and negative space usage.",
  minimalist: "Exercise radical simplicity through strategic reduction: utilize foundational geometric shapes (circles, squares, triangles) with perfect proportions (golden ratio 1.618), maintain a strict monochromatic or maximum two-color palette, and ensure 50% negative space minimum. Every element must serve both functional and aesthetic purposes. Consider the icon's silhouette and ensure recognizability at 16x16px.",
  simple: "Design with intuitive visual clarity: employ basic shapes with purposeful hierarchy (dominant element 60%, supporting elements 40%), use clear-cut positive/negative space relationships, and stick to pure, unambiguous color combinations (maximum 3 colors with clear contrast ratios 4.5:1 minimum). Focus on instant recognition within 3 seconds and maintain equal effectiveness in both color and monochrome.",
  words: "Craft typography with artistic precision: manipulate letterforms to create distinctive visual rhythm, maintain consistent stroke weights or deliberate weight contrast (ratio 1:2 or 1:3), utilize negative space between letters as active design elements (minimum 25% of total space), and ensure legibility at both 32px and 512px sizes. Consider the emotional qualities of font choices and letter spacing."
};

// Helper to get style guidance
export const getStyleGuide = (style: IconStyle): string => styleGuides[style];

// Main icon generation prompt template
export const iconTemplates = {
  generateIconPrompt: new PromptTemplate(
    [
      "You are an expert brand identity designer with deep understanding of visual semiotics and brand psychology. Create a distinctive icon for '{brandName}' that embodies its core essence.",
      "Brand Context: {description}",
      "Emotional Themes: {tags}",
      "Technical & Creative Requirements:",
      "1. Conceptual Foundation:",
      "   - Translate brand essence into visual metaphors",
      "   - Consider cultural symbolism and universal interpretation",
      "   - Ensure design evokes intended emotional response",
      "2. Technical Specifications:",
      "   - Design must scale seamlessly from 16x16px to 512x512px",
      "   - Maintain clear silhouette recognition at small sizes",
      "   - Consider reproduction across digital and print mediums",
      "3. Visual Hierarchy:",
      "   - Create focal point using size, position, or contrast",
      "   - Balance positive and negative space effectively",
      "   - Ensure proper figure-ground relationship",
      "4. Style Implementation: {style} style - {styleGuide}",
      "5. Color Psychology:",
      "   - Select colors that reinforce themes: {tags}",
      "   - Consider color symbolism across cultures",
      "   - Ensure accessibility with proper contrast ratios",
      "Please provide a detailed icon description including:",
      "- Core concept and symbolism",
      "- Composition and layout specifics",
      "- Color palette with rationale",
      "- Key visual elements and their significance",
      "DO NOT include any of your thoughts such as 'I think' or 'I believe'.",
    ].join('\n'),
    {
      brandName: { type: "string", required: true, description: "Brand name (max 50 chars)" },
      description: { type: "string", required: true, description: "Brand description (10-500 chars)" },
      tags: { type: "string[]", required: true, description: "Emotional and thematic keywords (1-10 items)" },
      style: { type: "string", required: true, description: "Icon style category" },
      styleGuide: { type: "string", required: true, description: "Detailed style-specific guidance" }
    }
  )
};