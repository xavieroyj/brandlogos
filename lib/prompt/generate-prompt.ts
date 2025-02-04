import { PromptTemplate, type TemplateFormat } from "@/lib/prompt/prompt-template";
import { iconTemplates } from "./templates/icon-templates";

// Generic type for any template values
export type PromptValues<T extends TemplateFormat> = {
  [K in keyof T]: T[K]["type"] extends "string" ? string
    : T[K]["type"] extends "number" ? number
    : T[K]["type"] extends "boolean" ? boolean
    : T[K]["type"] extends "string[]" ? string[]
    : never;
};

// Helper type to extract expected values type from a template
type ExtractTemplateValues<T extends PromptTemplate<TemplateFormat>> = Parameters<T['formatTemplate']>[0];

// Template registry type with better typing
type TemplateRegistry = {
  [K: string]: {
    [SubK: string]: PromptTemplate<TemplateFormat>;
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
  values: ExtractTemplateValues<(typeof templateRegistry)[T][SubTemplateType<T>]>;
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