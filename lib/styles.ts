export const iconStyles = {
  anime: {
    label: "Anime Style",
    icon: "🎨",
    description: "Stylized anime-inspired artwork",
  },
  minimalist: {
    label: "Minimalist",
    icon: "◾",
    description: "Clean and simple geometric designs",
  },
  simple: {
    label: "Simple",
    icon: "○",
    description: "Basic shapes and straightforward elements",
  },
  words: {
    label: "Words",
    icon: "Aa",
    description: "Typography-based logo design",
  },
} as const;

export type IconStyle = keyof typeof iconStyles;