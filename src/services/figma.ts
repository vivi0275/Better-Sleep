/**
 * Service pour interagir avec l'API Figma
 * Note: Pour utiliser ce service, vous devez configurer votre token Figma
 * dans les variables d'environnement (VITE_FIGMA_ACCESS_TOKEN)
 */

export interface FigmaFile {
  key: string;
  name: string;
  thumbnail_url?: string;
  last_modified?: string;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

export interface FigmaImage {
  id: string;
  url: string;
}

class FigmaService {
  private baseUrl = 'https://api.figma.com/v1';
  private accessToken: string | null = null;

  constructor() {
    // Récupère le token depuis les variables d'environnement
    this.accessToken = import.meta.env.VITE_FIGMA_ACCESS_TOKEN || null;
  }

  /**
   * Configure le token d'accès Figma
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Vérifie si le service est configuré
   */
  isConfigured(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Récupère les informations d'un fichier Figma
   */
  async getFile(fileKey: string): Promise<FigmaFile> {
    if (!this.accessToken) {
      throw new Error('Figma access token not configured. Please set VITE_FIGMA_ACCESS_TOKEN or use setAccessToken()');
    }

    const response = await fetch(`${this.baseUrl}/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': this.accessToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to fetch Figma file: ${response.statusText}`;
      
      if (response.status === 403) {
        errorMessage = 'Accès refusé. Vérifiez que votre token Figma a les permissions nécessaires.';
      } else if (response.status === 404) {
        errorMessage = 'Fichier Figma introuvable. Vérifiez que la clé du fichier est correcte.';
      } else if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.err || errorMessage;
        } catch {
          // Ignore JSON parse errors
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      key: fileKey,
      name: data.name,
      last_modified: data.last_modified,
    };
  }

  /**
   * Récupère les nœuds d'un fichier Figma
   */
  async getFileNodes(fileKey: string, nodeIds?: string[]): Promise<FigmaNode[]> {
    if (!this.accessToken) {
      throw new Error('Figma access token not configured');
    }

    const nodeIdsParam = nodeIds ? `&ids=${nodeIds.join(',')}` : '';
    const response = await fetch(`${this.baseUrl}/files/${fileKey}/nodes?${nodeIdsParam}`, {
      headers: {
        'X-Figma-Token': this.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Figma nodes: ${response.statusText}`);
    }

    const data = await response.json();
    return Object.values(data.nodes || {}) as FigmaNode[];
  }

  /**
   * Génère des images à partir de nœuds Figma
   */
  async getImages(fileKey: string, nodeIds: string[], options?: {
    format?: 'jpg' | 'png' | 'svg' | 'pdf';
    scale?: number;
  }): Promise<FigmaImage[]> {
    if (!this.accessToken) {
      throw new Error('Figma access token not configured');
    }

    const format = options?.format || 'png';
    const scale = options?.scale || 1;

    const response = await fetch(
      `${this.baseUrl}/images/${fileKey}?ids=${nodeIds.join(',')}&format=${format}&scale=${scale}`,
      {
        headers: {
          'X-Figma-Token': this.accessToken,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to fetch Figma images: ${response.statusText}`;
      
      if (response.status === 403) {
        errorMessage = 'Accès refusé. Vérifiez que votre token Figma a les permissions nécessaires.';
      } else if (response.status === 404) {
        errorMessage = 'Fichier ou nœuds introuvables. Vérifiez que la clé du fichier et les IDs des nœuds sont corrects.';
      } else if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.err || errorMessage;
        } catch {
          // Ignore JSON parse errors
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const images = Object.entries(data.images || {}).map(([id, url]) => ({
      id,
      url: url as string,
    }));

    // Vérifie s'il y a des erreurs dans la réponse
    if (data.err) {
      throw new Error(`Erreur Figma: ${data.err}`);
    }

    return images;
  }

  /**
   * Recherche un fichier par son nom
   */
  async searchFile(fileKey: string, query: string): Promise<FigmaNode[]> {
    if (!this.accessToken) {
      throw new Error('Figma access token not configured');
    }

    // Récupère tous les nœuds et filtre par nom
    const nodes = await this.getFileNodes(fileKey);
    const searchLower = query.toLowerCase();
    
    const filterNodes = (nodeList: FigmaNode[]): FigmaNode[] => {
      const results: FigmaNode[] = [];
      
      for (const node of nodeList) {
        if (node.name.toLowerCase().includes(searchLower)) {
          results.push(node);
        }
        if (node.children) {
          results.push(...filterNodes(node.children));
        }
      }
      
      return results;
    };

    return filterNodes(nodes);
  }
}

export const figmaService = new FigmaService();

