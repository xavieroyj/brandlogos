import { PromptTemplate } from "../prompt-template";

type IconPromptFormat = {
  brandName: { type: "string"; required: true; description: "Name of the brand" };
  description: { type: "string"; required: true; description: "Description of what the brand does" };
  tags: { type: "string[]"; required: true; description: "Key themes and focus areas" };
  style: { type: "string"; required: true; description: "Style of the icon" };
};

export const iconTemplates = {
  anime: new PromptTemplate<IconPromptFormat>(
    "Create an anime-style icon for a brand called {brandName}. " +
    "The brand focuses on {description}. " +
    "The key themes are: {tags}. " +
    "Use {style} art style with vibrant colors and expressive design elements typical of anime. " +
    "The icon should be simple enough to be recognizable at small sizes.",
    {
      brandName: { type: "string", required: true, description: "Name of the brand" },
      description: { type: "string", required: true, description: "Description of what the brand does" },
      tags: { type: "string[]", required: true, description: "Key themes and focus areas" },
      style: { type: "string", required: true, description: "Style of the icon" }
    }
  ),

  minimalist: new PromptTemplate<IconPromptFormat>(
    "Design a minimalist icon for {brandName}. " +
    "The brand is about {description}. " +
    "Incorporate these themes subtly: {tags}. " +
    "Use {style} principles with clean lines, simple shapes, and minimal colors. " +
    "Focus on essential elements only, removing all unnecessary details.",
    {
      brandName: { type: "string", required: true, description: "Name of the brand" },
      description: { type: "string", required: true, description: "Description of what the brand does" },
      tags: { type: "string[]", required: true, description: "Key themes and focus areas" },
      style: { type: "string", required: true, description: "Style of the icon" }
    }
  ),

  simple: new PromptTemplate<IconPromptFormat>(
    "Create a simple and straightforward icon for {brandName}. " +
    "The brand specializes in {description}. " +
    "Key concepts to represent: {tags}. " +
    "Use {style} approach with basic shapes and clear visual hierarchy. " +
    "The design should be easily recognizable and memorable.",
    {
      brandName: { type: "string", required: true, description: "Name of the brand" },
      description: { type: "string", required: true, description: "Description of what the brand does" },
      tags: { type: "string[]", required: true, description: "Key themes and focus areas" },
      style: { type: "string", required: true, description: "Style of the icon" }
    }
  ),

  words: new PromptTemplate<IconPromptFormat>(
    "Design a typography-based icon for {brandName}. " +
    "The brand provides {description}. " +
    "Incorporate these concepts: {tags}. " +
    "Use {style} with creative typography and letterforms. " +
    "The text should be stylized while maintaining legibility.",
    {
      brandName: { type: "string", required: true, description: "Name of the brand" },
      description: { type: "string", required: true, description: "Description of what the brand does" },
      tags: { type: "string[]", required: true, description: "Key themes and focus areas" },
      style: { type: "string", required: true, description: "Style of the icon" }
    }
  ),
};