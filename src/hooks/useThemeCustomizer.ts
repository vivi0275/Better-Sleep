import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { baseThemeTokens, customizableThemeVars, defaultPresetId, themePresets, ThemePreset, ThemeTokens } from "@/config/theme-presets";
import { generateDarkModeTokens } from "@/lib/color";

const PRESET_STORAGE_KEY = "better-sleep:preset";
const CUSTOM_STORAGE_KEY = "better-sleep:custom-tokens";
const FAVORITES_STORAGE_KEY = "better-sleep:favorites";

export type FavoritePalette = {
  id: string;
  name: string;
  tokens: ThemeTokens;
  preview: string[];
};

const MAX_FAVORITES = 5;

const applyTokens = (tokens: ThemeTokens) => {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([token, value]) => {
    root.style.setProperty(`--${token}`, value);
  });
};

const clearTokens = () => {
  const root = document.documentElement;
  customizableThemeVars.forEach((token) => {
    root.style.removeProperty(`--${token}`);
  });
};

const getInitialPresetId = () => {
  if (typeof window === "undefined") {
    return defaultPresetId;
  }
  return localStorage.getItem(PRESET_STORAGE_KEY) ?? defaultPresetId;
};

const getInitialCustomTokens = (): ThemeTokens => {
  if (typeof window === "undefined") {
    return baseThemeTokens;
  }

  const stored = localStorage.getItem(CUSTOM_STORAGE_KEY);
  if (!stored) {
    return baseThemeTokens;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<ThemeTokens>;
    return { ...baseThemeTokens, ...parsed };
  } catch {
    return baseThemeTokens;
  }
};

const getInitialFavorites = (): FavoritePalette[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as FavoritePalette[];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites: FavoritePalette[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
};

const generatePreview = (tokens: ThemeTokens): string[] => {
  return [tokens.primary, tokens.accent, tokens.background];
};

export const useThemeCustomizer = () => {
  const { theme } = useTheme();
  const [currentPresetId, setCurrentPresetId] = useState<string>(getInitialPresetId);
  const [customTokens, setCustomTokens] = useState<ThemeTokens>(getInitialCustomTokens);
  const [favorites, setFavorites] = useState<FavoritePalette[]>(getInitialFavorites);
  const isDark = theme === "dark";

  // Get current preview colors for custom section
  const currentPreview = useMemo(() => {
    return generatePreview(customTokens);
  }, [customTokens]);

  // Combine built-in presets with favorites, updating Custom preset with live preview
  const allPresets = useMemo(() => {
    const favoritePresets: ThemePreset[] = favorites.map((fav) => ({
      id: fav.id,
      name: fav.name,
      description: "Your saved favorite",
      preview: fav.preview,
      tokens: fav.tokens,
    }));
    
    // Update Custom preset with current preview colors
    const updatedPresets = themePresets.map((preset) => {
      if (preset.id === "custom") {
        return {
          ...preset,
          preview: currentPreview,
        };
      }
      return preset;
    });
    
    return [...updatedPresets, ...favoritePresets];
  }, [favorites, currentPreview]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(PRESET_STORAGE_KEY, currentPresetId);
  }, [currentPresetId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customTokens));
  }, [customTokens]);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    const preset = allPresets.find((p) => p.id === currentPresetId) ?? allPresets[0];
    const isDefault = preset.id === defaultPresetId && !preset.isCustom;

    if (isDefault) {
      clearTokens();
      return;
    }

    let tokensToApply: ThemeTokens;
    
    if (preset.isCustom) {
      tokensToApply = customTokens;
    } else {
      tokensToApply = preset.tokens;
    }

    // Generate dark mode variants if dark mode is active
    if (isDark) {
      tokensToApply = generateDarkModeTokens(tokensToApply) as ThemeTokens;
    }

    applyTokens(tokensToApply);
  }, [currentPresetId, customTokens, isDark, allPresets]);

  const updateCustomToken = (token: keyof ThemeTokens, value: string) => {
    setCustomTokens((prev) => ({
      ...prev,
      [token]: value,
    }));
    setCurrentPresetId("custom");
  };

  const resetToDefault = () => {
    clearTokens();
    setCurrentPresetId(defaultPresetId);
    setCustomTokens(baseThemeTokens);
  };

  const saveAsFavorite = (name: string) => {
    if (favorites.length >= MAX_FAVORITES) {
      return { success: false, error: `Maximum ${MAX_FAVORITES} favorites allowed` };
    }

    const newFavorite: FavoritePalette = {
      id: `favorite-${Date.now()}`,
      name,
      tokens: customTokens,
      preview: generatePreview(customTokens),
    };

    setFavorites((prev) => [...prev, newFavorite]);
    return { success: true };
  };

  const deleteFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    // If the deleted favorite was active, switch to custom
    if (currentPresetId === id) {
      setCurrentPresetId("custom");
    }
  };

  const loadFavorite = (id: string) => {
    const favorite = favorites.find((fav) => fav.id === id);
    if (favorite) {
      setCustomTokens(favorite.tokens);
      setCurrentPresetId(id);
    }
  };

  return {
    presets: allPresets,
    currentPresetId,
    setPreset: setCurrentPresetId,
    isCustomSelected: currentPresetId === "custom",
    customTokens,
    updateCustomToken,
    resetToDefault,
    defaultPresetId,
    favorites,
    saveAsFavorite,
    deleteFavorite,
    loadFavorite,
    currentPreview,
    canSaveFavorite: favorites.length < MAX_FAVORITES,
  };
};

