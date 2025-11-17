import { useState, useEffect } from 'react';
import { figmaService } from '@/services/figma';

/**
 * Hook pour gérer la configuration Figma avec persistance locale
 */
export function useFigmaConfigWithStorage() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifie si un token est déjà stocké
    const storedToken = localStorage.getItem('figma_access_token');
    const envToken = import.meta.env.VITE_FIGMA_ACCESS_TOKEN;

    if (storedToken) {
      figmaService.setAccessToken(storedToken);
      setIsConfigured(true);
    } else if (envToken) {
      figmaService.setAccessToken(envToken);
      setIsConfigured(true);
    }

    setIsLoading(false);
  }, []);

  const setToken = (token: string) => {
    figmaService.setAccessToken(token);
    localStorage.setItem('figma_access_token', token);
    setIsConfigured(true);
  };

  const clearToken = () => {
    figmaService.setAccessToken('');
    localStorage.removeItem('figma_access_token');
    setIsConfigured(false);
  };

  return {
    isConfigured,
    isLoading,
    setToken,
    clearToken,
  };
}

