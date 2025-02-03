export function removeThinkTags(text: string): string {
    return text
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .replace(/\s+/g, ' ')                          // Normalize whitespace
        .trim();
}