# Intégration Figma MCP

Ce document explique comment utiliser l'intégration Figma MCP dans cette application pour charger et afficher vos designs Figma tout en conservant le design system existant.

## Configuration

### 1. Configuration MCP (pour Cursor)

Le serveur MCP Figma est configuré dans `/Users/vivi0/.cursor/mcp.json`. Pour utiliser le serveur MCP Figma, vous devez :

1. Obtenir un token d'accès Figma depuis [les paramètres de votre compte Figma](https://www.figma.com/developers/api#access-tokens)
2. Ajouter le token dans la configuration MCP :

```json
{
  "mcpServers": {
    "Figma": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-figma"
      ],
      "env": {
        "FIGMA_ACCESS_TOKEN": "votre-token-ici"
      }
    }
  }
}
```

### 2. Configuration dans l'application React

Pour utiliser l'intégration Figma dans l'application React, vous avez deux options :

#### Option A : Variable d'environnement (recommandé)

Créez un fichier `.env` à la racine du projet :

```env
VITE_FIGMA_ACCESS_TOKEN=votre-token-figma
```

#### Option B : Configuration via l'interface

Vous pouvez configurer le token directement depuis l'interface dans la page Settings > Figma Integration.

## Utilisation

### Dans les composants React

```tsx
import FigmaDesign from '@/components/FigmaDesign';

// Exemple basique
<FigmaDesign 
  fileKey="abc123def456" 
  nodeIds={["1:23", "1:24"]}
  title="Mon Design"
/>

// Avec configuration interactive
<FigmaDesign 
  fileKey="" 
  showConfig={true}
/>
```

### Utilisation des hooks

```tsx
import { useFigmaFile, useFigmaImages } from '@/hooks/useFigma';

function MyComponent() {
  const { data: file, isLoading } = useFigmaFile('abc123def456');
  const { data: images } = useFigmaImages('abc123def456', ['1:23', '1:24']);

  // Utiliser les données...
}
```

### Obtenir la clé d'un fichier Figma

La clé du fichier se trouve dans l'URL Figma :
```
https://www.figma.com/file/[FILE_KEY]/nom-du-fichier
```

Par exemple, si l'URL est `https://www.figma.com/file/abc123def456/MyDesign`, alors `abc123def456` est la clé du fichier.

### Obtenir les IDs des nœuds

1. Ouvrez votre fichier Figma
2. Sélectionnez un élément (frame, composant, etc.)
3. Dans le panneau de droite, vous trouverez l'ID du nœud (ex: `1:23`)
4. Vous pouvez également utiliser l'outil de recherche dans le composant pour trouver des nœuds par nom

## API du service Figma

Le service `figmaService` expose plusieurs méthodes :

- `getFile(fileKey: string)`: Récupère les informations d'un fichier
- `getFileNodes(fileKey: string, nodeIds?: string[])`: Récupère les nœuds d'un fichier
- `getImages(fileKey: string, nodeIds: string[], options?)`: Génère des images à partir de nœuds
- `searchFile(fileKey: string, query: string)`: Recherche des nœuds par nom

## Hooks disponibles

- `useFigmaFile(fileKey, options)`: Hook pour récupérer un fichier
- `useFigmaNodes(fileKey, nodeIds)`: Hook pour récupérer des nœuds
- `useFigmaImages(fileKey, nodeIds, options)`: Hook pour récupérer des images
- `useFigmaSearch()`: Hook pour rechercher des nœuds
- `useFigmaConfig()`: Hook pour gérer la configuration du token

## Composants disponibles

### FigmaIntegration (Recommandé)

Composant complet avec configuration intégrée :

```tsx
import FigmaIntegration from '@/components/FigmaIntegration';

function MyPage() {
  return (
    <FigmaIntegration
      defaultFileKey="abc123def456"
      defaultNodeIds={["1:23", "1:24"]}
      title="Mes Designs"
      onDesignsLoaded={(fileKey, nodeIds) => {
        console.log('Designs chargés:', fileKey, nodeIds);
      }}
    />
  );
}
```

### FigmaViewer

Composant simple pour afficher des designs déjà configurés :

```tsx
import FigmaViewer from '@/components/FigmaViewer';

function MyPage() {
  return (
    <FigmaViewer
      fileKey="abc123def456"
      nodeIds={["1:23", "1:24"]}
      title="Designs Figma"
    />
  );
}
```

### FigmaDesign

Composant avec configuration avancée :

```tsx
import FigmaDesign from '@/components/FigmaDesign';

function DesignPage() {
  return (
    <FigmaDesign 
      fileKey="abc123def456"
      nodeIds={["1:23", "1:24"]}
      showConfig={true}
    />
  );
}
```

## Exemple d'intégration dans une page

```tsx
import FigmaIntegration from '@/components/FigmaIntegration';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 pb-20">
      {/* Vos autres composants */}
      
      {/* Section Figma */}
      <div className="max-w-2xl mx-auto px-6 py-6">
        <FigmaIntegration
          defaultFileKey="VOTRE_FILE_KEY"
          defaultNodeIds={["1:23", "1:24"]}
          title="Designs de l'application"
        />
      </div>
    </div>
  );
}
```

## Notes importantes

- Le token Figma doit être gardé secret et ne doit jamais être commité dans le dépôt Git
- Les images générées sont mises en cache par React Query
- L'API Figma a des limites de taux, soyez prudent avec les appels fréquents
- Les formats d'image supportés sont : `jpg`, `png`, `svg`, `pdf`

