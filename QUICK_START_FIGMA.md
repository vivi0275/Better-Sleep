# Guide rapide : Intégrer vos designs Figma

## Étape 1 : Obtenir votre token Figma

1. Allez sur https://www.figma.com/developers/api#access-tokens
2. Connectez-vous à votre compte Figma
3. Générez un nouveau token d'accès personnel
4. Copiez le token (vous ne pourrez plus le voir après)

## Étape 2 : Configurer le token dans l'application

### Option A : Via l'interface (recommandé pour tester)

1. Ouvrez l'application
2. Allez dans **Settings** > **Figma Integration**
3. Cliquez sur "Configurer le token"
4. Collez votre token et enregistrez

### Option B : Via variable d'environnement (pour la production)

Créez un fichier `.env` à la racine du projet :

```env
VITE_FIGMA_ACCESS_TOKEN=votre-token-ici
```

## Étape 3 : Obtenir la clé de votre fichier Figma

1. Ouvrez votre fichier Figma dans le navigateur
2. Regardez l'URL : `https://www.figma.com/file/[FILE_KEY]/nom-du-fichier`
3. Copiez la `FILE_KEY` (ex: `abc123def456`)

## Étape 4 : Obtenir les IDs des nœuds à afficher

### Méthode 1 : Via l'interface Figma

1. Ouvrez votre fichier Figma
2. Sélectionnez un élément (frame, composant, etc.)
3. Dans le panneau de droite, trouvez l'ID du nœud (ex: `1:23`)
4. Notez cet ID

### Méthode 2 : Via l'API Figma

Vous pouvez utiliser l'outil de recherche dans le composant pour trouver des nœuds par nom.

## Étape 5 : Intégrer dans votre page

```tsx
import FigmaIntegration from '@/components/FigmaIntegration';

function MyPage() {
  return (
    <FigmaIntegration
      defaultFileKey="VOTRE_FILE_KEY_ICI"
      defaultNodeIds={["1:23", "1:24"]} // IDs des nœuds à afficher
      title="Mes Designs Figma"
    />
  );
}
```

## Exemple complet

Supposons que vous avez un fichier Figma avec l'URL :
```
https://www.figma.com/file/abc123def456/MyApp-Design
```

Et vous voulez afficher les frames avec les IDs `1:23` et `1:24` :

```tsx
import FigmaIntegration from '@/components/FigmaIntegration';

function Dashboard() {
  return (
    <div>
      {/* Vos autres composants */}
      
      <FigmaIntegration
        defaultFileKey="abc123def456"
        defaultNodeIds={["1:23", "1:24"]}
        title="Designs de l'application"
      />
    </div>
  );
}
```

## Personnalisation

Les composants Figma s'intègrent automatiquement avec le design system existant :
- Utilisent les mêmes styles (`glass-card`, `border-0`, etc.)
- Respectent les couleurs et gradients de l'application
- S'adaptent au thème (light/dark)
- Animations et transitions cohérentes

## Dépannage

### Les designs ne s'affichent pas

1. Vérifiez que le token est bien configuré
2. Vérifiez que la clé du fichier est correcte
3. Vérifiez que les IDs des nœuds sont corrects
4. Ouvrez la console du navigateur pour voir les erreurs

### Erreur "Figma access token not configured"

- Assurez-vous d'avoir configuré le token via l'interface ou la variable d'environnement
- Vérifiez que le token est valide et n'a pas expiré

### Les images ne se chargent pas

- Vérifiez que les IDs des nœuds existent dans le fichier Figma
- Vérifiez que vous avez les permissions d'accès au fichier Figma

