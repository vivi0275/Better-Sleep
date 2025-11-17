# Configuration Figma - Guide de démarrage rapide

## ✅ Configuration déjà effectuée

Le design Figma a été intégré dans votre application ! Voici ce qui a été configuré :

- **Fichier Figma** : `J9R3XX8NaokTuWtknxni12`
- **Node ID** : `1:3` (converti depuis `1-3` de l'URL)
- **Intégration** : Ajoutée dans la page Dashboard

## 🔑 Étape 1 : Obtenir votre token Figma

1. Allez sur https://www.figma.com/developers/api#access-tokens
2. Connectez-vous à votre compte Figma
3. Cliquez sur "Generate new token"
4. Donnez un nom au token (ex: "Zenith Wake Sync")
5. **Copiez le token** (vous ne pourrez plus le voir après !)

## ⚙️ Étape 2 : Configurer le token

### Option A : Via l'interface (recommandé pour tester)

1. Lancez l'application : `npm run dev`
2. Allez dans **Settings** (icône en bas à droite)
3. Scroll jusqu'à la section **Figma Integration**
4. Cliquez sur "Configurer le token"
5. Collez votre token et enregistrez

### Option B : Via variable d'environnement (pour la production)

Créez un fichier `.env` à la racine du projet :

```env
VITE_FIGMA_ACCESS_TOKEN=votre-token-ici
```

Puis redémarrez l'application.

## 🎨 Étape 3 : Voir vos designs

Une fois le token configuré :

1. Allez sur la page **Dashboard** (page d'accueil)
2. Scroll jusqu'en bas de la page
3. Vous devriez voir la section "Design Figma" avec vos designs
4. Cliquez sur une image pour la voir en grand

## 📝 Ajouter d'autres designs

Pour ajouter d'autres nœuds Figma à afficher, modifiez `src/config/figma.ts` :

```typescript
export const FIGMA_CONFIG = {
  fileKey: 'J9R3XX8NaokTuWtknxni12',
  nodeIds: [
    convertNodeId('1-3'),  // Votre design actuel
    convertNodeId('1-4'), // Ajoutez d'autres IDs ici
    convertNodeId('2-5'), // etc.
  ],
  // ...
};
```

## 🔍 Trouver les IDs des nœuds

1. Ouvrez votre fichier Figma dans le navigateur
2. Sélectionnez un élément (frame, composant, etc.)
3. Regardez l'URL : `?node-id=1-3` → utilisez `1-3`
4. Ou dans le panneau de droite de Figma, trouvez l'ID du nœud

## 🐛 Dépannage

### Les designs ne s'affichent pas

1. **Vérifiez le token** : Allez dans Settings > Figma Integration et vérifiez que le token est bien configuré
2. **Vérifiez la console** : Ouvrez les outils de développement (F12) et regardez les erreurs
3. **Vérifiez les permissions** : Assurez-vous que votre token a accès au fichier Figma

### Erreur "Figma access token not configured"

- Configurez le token via Settings ou la variable d'environnement
- Vérifiez que le token est valide et n'a pas expiré

### Erreur 403 ou 404

- Vérifiez que la clé du fichier est correcte
- Vérifiez que les IDs des nœuds existent dans le fichier
- Vérifiez que vous avez les permissions d'accès au fichier Figma

## 📚 Documentation complète

Pour plus d'informations, consultez :
- `FIGMA_INTEGRATION.md` - Documentation complète de l'API
- `QUICK_START_FIGMA.md` - Guide rapide détaillé

## ✨ Fonctionnalités

- ✅ Affichage des designs Figma dans l'application
- ✅ Conservation du design system existant (glass-card, gradients, etc.)
- ✅ Visualisation en grand format (clic sur les images)
- ✅ Configuration via l'interface ou variables d'environnement
- ✅ Support de plusieurs nœuds Figma
- ✅ Gestion des erreurs et états de chargement

