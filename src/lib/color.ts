const toHex = (value: number) => {
  const clamped = Math.round(Math.min(Math.max(value, 0), 255));
  return clamped.toString(16).padStart(2, "0");
};

const hslToRgb = (h: number, s: number, l: number) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;

  if (hp >= 0 && hp < 1) {
    r = c;
    g = x;
  } else if (hp >= 1 && hp < 2) {
    r = x;
    g = c;
  } else if (hp >= 2 && hp < 3) {
    g = c;
    b = x;
  } else if (hp >= 3 && hp < 4) {
    g = x;
    b = c;
  } else if (hp >= 4 && hp < 5) {
    r = x;
    b = c;
  } else if (hp >= 5 && hp <= 6) {
    r = c;
    b = x;
  }

  const m = l - c / 2;
  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255,
  };
};

const hexToRgb = (hex: string) => {
  let normalized = hex.replace("#", "").trim();
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  return { r, g, b };
};

export const hslStringToHex = (value: string) => {
  const parts = value.trim().split(/\s+/);
  if (parts.length < 3) {
    return "#000000";
  }

  const [h, s, l] = parts;
  const hue = Number.parseFloat(h);
  const sat = Number.parseFloat(s.replace("%", "")) / 100;
  const light = Number.parseFloat(l.replace("%", "")) / 100;
  const { r, g, b } = hslToRgb(hue, sat, light);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const hexToHslString = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  const normalizedHue = (h + 360) % 360;
  return `${Math.round(normalizedHue)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const parseHsl = (hslString: string): { h: number; s: number; l: number } => {
  const parts = hslString.trim().split(/\s+/);
  if (parts.length < 3) {
    return { h: 0, s: 0, l: 0.5 };
  }
  const h = Number.parseFloat(parts[0]);
  const s = Number.parseFloat(parts[1].replace("%", "")) / 100;
  const l = Number.parseFloat(parts[2].replace("%", "")) / 100;
  return { h, s, l };
};

const formatHsl = (h: number, s: number, l: number): string => {
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const generateDarkModeTokens = (lightTokens: Record<string, string>): Record<string, string> => {
  const darkTokens: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(lightTokens)) {
    const { h, s, l } = parseHsl(value);
    
    if (key === "background") {
      // Dark backgrounds: very low lightness
      darkTokens[key] = formatHsl(h, Math.max(0, s - 0.1), Math.min(0.15, l * 0.15));
    } else if (key === "foreground") {
      // Light foregrounds: high lightness
      darkTokens[key] = formatHsl(h, Math.max(0, s - 0.1), Math.max(0.9, 0.9 + (1 - l) * 0.1));
    } else if (key === "card" || key === "popover") {
      // Dark cards: slightly lighter than background
      darkTokens[key] = formatHsl(h, Math.max(0, s - 0.1), Math.min(0.2, l * 0.2));
    } else if (key === "card-foreground" || key === "popover-foreground") {
      // Light card foregrounds
      darkTokens[key] = formatHsl(h, Math.max(0, s - 0.1), Math.max(0.9, 0.9 + (1 - l) * 0.1));
    } else if (key === "primary" || key === "accent") {
      // Brighter primary/accent colors for dark mode
      darkTokens[key] = formatHsl(h, s, Math.min(0.65, l + 0.1));
    } else if (key === "primary-foreground" || key === "accent-foreground") {
      // Dark foregrounds for bright colors
      darkTokens[key] = formatHsl(h, Math.max(0, s - 0.1), Math.min(0.15, l * 0.15));
    } else if (key === "secondary") {
      // Darker secondary
      darkTokens[key] = formatHsl(h, Math.max(0, s - 0.2), Math.min(0.2, l * 0.25));
    } else if (key === "secondary-foreground") {
      // Light secondary foreground
      darkTokens[key] = formatHsl(h, Math.max(0, s - 0.1), Math.max(0.9, 0.9 + (1 - l) * 0.1));
    } else if (key === "muted") {
      // Dark muted backgrounds
      darkTokens[key] = formatHsl(h, Math.max(0, s - 0.2), Math.min(0.2, l * 0.2));
    } else if (key === "muted-foreground") {
      // Lighter muted text
      darkTokens[key] = formatHsl(h, Math.max(0, s - 0.1), Math.min(0.7, l + 0.2));
    } else if (key === "border" || key === "input") {
      // Dark borders/inputs
      darkTokens[key] = formatHsl(h, Math.max(0, s - 0.2), Math.min(0.2, l * 0.2));
    } else if (key === "ring") {
      // Bright ring color
      darkTokens[key] = formatHsl(h, s, Math.min(0.65, l + 0.1));
    } else {
      // Default: make darker
      darkTokens[key] = formatHsl(h, s, Math.max(0.1, l * 0.3));
    }
  }
  
  return darkTokens;
};

