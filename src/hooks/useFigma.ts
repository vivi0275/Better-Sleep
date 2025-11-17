import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { figmaService, type FigmaFile, type FigmaNode, type FigmaImage } from '@/services/figma';

// Vérifie la configuration au chargement
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('figma_access_token');
  const envToken = import.meta.env.VITE_FIGMA_ACCESS_TOKEN;
  
  if (storedToken && !figmaService.isConfigured()) {
    figmaService.setAccessToken(storedToken);
  } else if (envToken && !figmaService.isConfigured()) {
    figmaService.setAccessToken(envToken);
  }
}

interface UseFigmaFileOptions {
  enabled?: boolean;
}

interface UseFigmaImagesOptions {
  format?: 'jpg' | 'png' | 'svg' | 'pdf';
  scale?: number;
}

/**
 * Hook pour récupérer les informations d'un fichier Figma
 */
export function useFigmaFile(fileKey: string | null, options?: UseFigmaFileOptions) {
  return useQuery<FigmaFile>({
    queryKey: ['figma', 'file', fileKey],
    queryFn: () => {
      if (!fileKey) throw new Error('File key is required');
      return figmaService.getFile(fileKey);
    },
    enabled: options?.enabled !== false && !!fileKey && figmaService.isConfigured(),
  });
}

/**
 * Hook pour récupérer les nœuds d'un fichier Figma
 */
export function useFigmaNodes(fileKey: string | null, nodeIds?: string[]) {
  return useQuery<FigmaNode[]>({
    queryKey: ['figma', 'nodes', fileKey, nodeIds],
    queryFn: () => {
      if (!fileKey) throw new Error('File key is required');
      return figmaService.getFileNodes(fileKey, nodeIds);
    },
    enabled: !!fileKey && figmaService.isConfigured(),
  });
}

/**
 * Hook pour récupérer des images depuis Figma
 */
export function useFigmaImages(fileKey: string | null, nodeIds: string[] = [], options?: UseFigmaImagesOptions) {
  return useQuery<FigmaImage[]>({
    queryKey: ['figma', 'images', fileKey, nodeIds, options],
    queryFn: () => {
      if (!fileKey) throw new Error('File key is required');
      if (nodeIds.length === 0) throw new Error('At least one node ID is required');
      return figmaService.getImages(fileKey, nodeIds, options);
    },
    enabled: !!fileKey && nodeIds.length > 0 && figmaService.isConfigured(),
  });
}

/**
 * Hook pour rechercher des nœuds dans un fichier Figma
 */
export function useFigmaSearch() {
  const queryClient = useQueryClient();
  const [isSearching, setIsSearching] = useState(false);

  const searchMutation = useMutation({
    mutationFn: ({ fileKey, query }: { fileKey: string; query: string }) =>
      figmaService.searchFile(fileKey, query),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['figma', 'search', variables.fileKey, variables.query], data);
    },
  });

  const search = useCallback(
    async (fileKey: string, query: string) => {
      setIsSearching(true);
      try {
        await searchMutation.mutateAsync({ fileKey, query });
      } finally {
        setIsSearching(false);
      }
    },
    [searchMutation]
  );

  return {
    search,
    results: searchMutation.data || [],
    isSearching,
    error: searchMutation.error,
  };
}

/**
 * Hook pour configurer le token Figma avec persistance
 */
export function useFigmaConfig() {
  const [isConfigured, setIsConfigured] = useState(figmaService.isConfigured());
  const queryClient = useQueryClient();

  useEffect(() => {
    // Vérifie le token stocké au chargement
    const storedToken = localStorage.getItem('figma_access_token');
    const envToken = import.meta.env.VITE_FIGMA_ACCESS_TOKEN;
    
    if (storedToken && !figmaService.isConfigured()) {
      figmaService.setAccessToken(storedToken);
      setIsConfigured(true);
    } else if (envToken && !figmaService.isConfigured()) {
      figmaService.setAccessToken(envToken);
      setIsConfigured(true);
    }
  }, []);

  const setToken = useCallback((token: string) => {
    figmaService.setAccessToken(token);
    localStorage.setItem('figma_access_token', token);
    setIsConfigured(true);
    // Invalide toutes les queries Figma pour forcer le rechargement
    queryClient.invalidateQueries({ queryKey: ['figma'] });
  }, [queryClient]);

  const clearToken = useCallback(() => {
    figmaService.setAccessToken('');
    localStorage.removeItem('figma_access_token');
    setIsConfigured(false);
    queryClient.invalidateQueries({ queryKey: ['figma'] });
  }, [queryClient]);

  return {
    isConfigured,
    setToken,
    clearToken,
  };
}

