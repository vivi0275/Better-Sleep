export type ThemeTokens = {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  border: string;
  input: string;
  ring: string;
};

export type ThemePreset = {
  id: string;
  name: string;
  description: string;
  preview: string[];
  tokens: ThemeTokens;
  isCustom?: boolean;
};

export const baseThemeTokens: ThemeTokens = {
  background: "212 45% 96%",
  foreground: "215 25% 12%",
  card: "0 0% 100%",
  "card-foreground": "215 25% 12%",
  popover: "0 0% 100%",
  "popover-foreground": "215 25% 12%",
  primary: "197 92% 52%",
  "primary-foreground": "0 0% 100%",
  secondary: "195 70% 88%",
  "secondary-foreground": "215 25% 12%",
  muted: "210 25% 92%",
  "muted-foreground": "215 15% 48%",
  accent: "166 85% 60%",
  "accent-foreground": "215 25% 12%",
  border: "210 25% 88%",
  input: "210 25% 88%",
  ring: "197 92% 52%",
};

export const customizableThemeVars = Object.keys(baseThemeTokens);

export const themePresets: ThemePreset[] = [
  {
    id: "ocean",
    name: "Ocean Calm",
    description: "Original Better Sleep palette.",
    preview: ["197 92% 52%", "166 85% 60%", "212 45% 96%"],
    tokens: baseThemeTokens,
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    description: "Warm oranges with twilight violets.",
    preview: ["22 92% 58%", "312 71% 60%", "26 78% 95%"],
    tokens: {
      background: "26 78% 95%",
      foreground: "20 18% 18%",
      card: "0 0% 100%",
      "card-foreground": "20 18% 18%",
      popover: "0 0% 100%",
      "popover-foreground": "20 18% 18%",
      primary: "22 92% 58%",
      "primary-foreground": "0 0% 100%",
      secondary: "312 71% 60%",
      "secondary-foreground": "0 0% 100%",
      muted: "28 44% 88%",
      "muted-foreground": "20 18% 36%",
      accent: "45 95% 55%",
      "accent-foreground": "24 36% 14%",
      border: "28 44% 84%",
      input: "28 44% 84%",
      ring: "22 92% 58%",
    },
  },
  {
    id: "forest",
    name: "Forest Breeze",
    description: "Earthy greens with misty neutrals.",
    preview: ["152 63% 40%", "32 82% 64%", "120 29% 94%"],
    tokens: {
      background: "120 29% 94%",
      foreground: "144 15% 18%",
      card: "0 0% 100%",
      "card-foreground": "144 15% 18%",
      popover: "0 0% 100%",
      "popover-foreground": "144 15% 18%",
      primary: "152 63% 40%",
      "primary-foreground": "120 28% 94%",
      secondary: "90 28% 80%",
      "secondary-foreground": "144 15% 18%",
      muted: "120 20% 88%",
      "muted-foreground": "144 12% 35%",
      accent: "32 82% 64%",
      "accent-foreground": "120 29% 12%",
      border: "120 20% 82%",
      input: "120 20% 82%",
      ring: "152 63% 40%",
    },
  },
  {
    id: "lavender",
    name: "Lavender Dream",
    description: "Soft purples with gentle lilacs.",
    preview: ["270 65% 65%", "300 55% 70%", "270 40% 96%"],
    tokens: {
      background: "270 40% 96%",
      foreground: "270 25% 15%",
      card: "0 0% 100%",
      "card-foreground": "270 25% 15%",
      popover: "0 0% 100%",
      "popover-foreground": "270 25% 15%",
      primary: "270 65% 65%",
      "primary-foreground": "0 0% 100%",
      secondary: "300 55% 70%",
      "secondary-foreground": "270 25% 15%",
      muted: "270 30% 90%",
      "muted-foreground": "270 20% 45%",
      accent: "285 70% 68%",
      "accent-foreground": "270 25% 15%",
      border: "270 30% 85%",
      input: "270 30% 85%",
      ring: "270 65% 65%",
    },
  },
  {
    id: "rose",
    name: "Rose Petal",
    description: "Warm pinks with delicate roses.",
    preview: ["340 75% 65%", "15 85% 70%", "350 50% 97%"],
    tokens: {
      background: "350 50% 97%",
      foreground: "340 20% 18%",
      card: "0 0% 100%",
      "card-foreground": "340 20% 18%",
      popover: "0 0% 100%",
      "popover-foreground": "340 20% 18%",
      primary: "340 75% 65%",
      "primary-foreground": "0 0% 100%",
      secondary: "15 85% 70%",
      "secondary-foreground": "340 20% 18%",
      muted: "350 35% 92%",
      "muted-foreground": "340 15% 48%",
      accent: "355 80% 68%",
      "accent-foreground": "340 20% 18%",
      border: "350 40% 88%",
      input: "350 40% 88%",
      ring: "340 75% 65%",
    },
  },
  {
    id: "custom",
    name: "Custom",
    description: "Create your own palette.",
    preview: ["197 92% 52%", "166 85% 60%", "212 45% 96%"],
    tokens: baseThemeTokens,
    isCustom: true,
  },
];

export const defaultPresetId = themePresets[0].id;

