export function removeThinkTags(text: String): string {
    return text
        .replace(/<think>[\s\S]*?<\/think>/g, '')
        .replace(/\s+/g, ' ')                          // Normalize whitespace
        .trim();
}