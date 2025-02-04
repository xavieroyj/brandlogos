export type TemplateVariable = string | number | boolean | string[];

export type TemplateFormat = {
  [key: string]: {
    type: "string" | "number" | "boolean" | "string[]";
    required?: boolean;
    description?: string;
  };
};

export class PromptTemplate<T extends TemplateFormat> {
  private template: string;
  private format: T;

  constructor(template: string, format: T) {
    this.template = template;
    this.format = format;
  }

  /**
   * Validate input against the template format
   */
  private validateInput(input: { [K in keyof T]: TemplateVariable }): void {
    for (const [key, value] of Object.entries(this.format)) {
      // Check required fields
      if (value.required && !(key in input)) {
        throw new Error(`Missing required variable: ${key}`);
      }

      // Type checking
      if (key in input) {
        const inputValue = input[key as keyof T];
        switch (value.type) {
          case "string":
            if (typeof inputValue !== "string") {
              throw new Error(`${key} must be a string`);
            }
            break;
          case "number":
            if (typeof inputValue !== "number") {
              throw new Error(`${key} must be a number`);
            }
            break;
          case "boolean":
            if (typeof inputValue !== "boolean") {
              throw new Error(`${key} must be a boolean`);
            }
            break;
          case "string[]":
            if (!Array.isArray(inputValue) || !inputValue.every(item => typeof item === "string")) {
              throw new Error(`${key} must be an array of strings`);
            }
            break;
        }
      }
    }
  }

  /**
   * Format the template with the provided variables
   */
  formatTemplate(variables: { [K in keyof T]: TemplateVariable }): string {
    // Validate input
    this.validateInput(variables);

    // Replace variables in template
    let result = this.template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{${key}}`, "g");
      result = result.replace(regex, this.formatValue(value));
    }

    return result;
  }

  /**
   * Format a value based on its type
   */
  private formatValue(value: TemplateVariable): string {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return String(value);
  }

  /**
   * Get the template format
   */
  getFormat(): T {
    return this.format;
  }

  /**
   * Get the raw template string
   */
  getTemplate(): string {
    return this.template;
  }
}

// Example usage:
// const iconPrompt = new PromptTemplate(
//   "Create a {style} icon for {brandName}. The brand is about {description}. Key themes: {tags}",
//   {
//     style: { type: "string", required: true },
//     brandName: { type: "string", required: true },
//     description: { type: "string", required: true },
//     tags: { type: "string[]", required: true }
//   }
// );
// 
// const result = iconPrompt.formatTemplate({
//   style: "minimalist",
//   brandName: "TechCo",
//   description: "A software company",
//   tags: ["technology", "innovation"]
// });