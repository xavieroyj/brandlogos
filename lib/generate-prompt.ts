import { PromptTemplate, type TemplateFormat } from "@/lib/prompt-template";
import { iconTemplates } from "./templates/icon-templates";
import { IconStyle } from "./styles";
import type { BrandFormValues } from "./schema";

// Generic type for any template values
export type PromptValues<T extends TemplateFormat> = {
  [K in keyof T]: T[K]["type"] extends "string" ? string
    : T[K]["type"] extends "number" ? number
    : T[K]["type"] extends "boolean" ? boolean
    : T[K]["type"] extends "string[]" ? string[]
    : never;
};

// Template registry type
type TemplateRegistry = {
  [K: string]: {
    [SubK: string]: PromptTemplate<any>;
  };
};

// Central template registry
const templateRegistry: TemplateRegistry = {
  icon: iconTemplates,
};

export type TemplateType = keyof typeof templateRegistry;
export type SubTemplateType<T extends TemplateType> = keyof typeof templateRegistry[T];

export interface GeneratePromptOptions<T extends TemplateType> {
  type: T;
  subType: SubTemplateType<T>;
  values: any; // Type will be inferred from the template
}

export function generatePrompt<T extends TemplateType>({ 
  type, 
  subType, 
  values 
}: GeneratePromptOptions<T>): string {
  const templateGroup = templateRegistry[type];
  if (!templateGroup) {
    throw new Error(`No template group found for type: ${type}`);
  }

  const template = templateGroup[String(subType)];
  if (!template) {
    throw new Error(`No template found for subType: ${String(subType)} in group: ${type}`);
  }

  return template.formatTemplate(values);
}

// Example usage:
// Icon template:
// const iconPrompt = generatePrompt({
//   type: "icon",
//   subType: "minimalist",
//   values: {
//     brandName: "TechCo",
//     description: "A software development company",
//     tags: ["technology", "innovation"],
//     style: "minimalist"
//   }
// });

// Fruit template:
// const fruitPrompt = generatePrompt({
//   type: "fruit",
//   subType: "describe",
//   values: {
//     fruit: "apple",
//     color: "red",
//     quantity: 5
//   }
// });

// Adding new templates is as simple as:
// 1. Create a new template file with your templates
// 2. Add them to the templateRegistry
// 3. Use them with generatePrompt