/**
 * Configuration Figma pour l'application
 * Mettez à jour ces valeurs avec vos informations Figma
 */

/**
 * Convertit un node-id au format URL (1-3) en format API Figma (1:3)
 */
export function convertNodeId(urlNodeId: string): string {
  return urlNodeId.replace('-', ':');
}

export const FIGMA_CONFIG = {
  // Clé du fichier Figma (trouvée dans l'URL : figma.com/design/[FILE_KEY]/...)
  fileKey: 'J9R3XX8NaokTuWtknxni12',
  
  // IDs des nœuds à afficher (format: "pageId:nodeId")
  // Pour node-id=1-3 dans l'URL, converti automatiquement en "1:3"
  // Design 1: Dashboard (node-id=1-3)
  // Design 2: Alarm Setup (node-id=1-383)
  dashboardNodeIds: [convertNodeId('1-3')],
  alarmSetupNodeIds: [convertNodeId('1-383')],
  
  // Tous les node IDs combinés (pour référence)
  nodeIds: [convertNodeId('1-3'), convertNodeId('1-383')],
  
  // Options d'export des images
  imageOptions: {
    format: 'png' as const,
    scale: 2, // 2x pour une meilleure qualité
  },
  
  // URLs complètes du fichier Figma (pour référence)
  figmaUrls: {
    dashboard: 'https://www.figma.com/design/J9R3XX8NaokTuWtknxni12/Sans-titre?node-id=1-3&m=dev',
    alarmSetup: 'https://www.figma.com/design/J9R3XX8NaokTuWtknxni12/Sans-titre?node-id=1-383&m=dev',
  },
};

