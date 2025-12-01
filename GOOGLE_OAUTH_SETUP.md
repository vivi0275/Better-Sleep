# Configuration Google OAuth - Correction de l'erreur redirect_uri_mismatch

## Problème
L'erreur `redirect_uri_mismatch` se produit lorsque l'URI de redirection utilisé par l'application ne correspond pas à celui configuré dans Google Cloud Console.

## Solution

### Étape 1 : Accéder à Google Cloud Console
1. Allez sur https://console.cloud.google.com/apis/credentials
2. Assurez-vous que le projet **"igneous-effort-479522-g4"** est sélectionné
3. Dans la liste des "ID client OAuth 2.0", trouvez et cliquez sur votre client :
   - `814343363476-qnftr3q1mtd3b7ibv1mn6qk8571eoh20.apps.googleusercontent.com`

### Étape 2 : Ajouter l'URI de redirection
1. Dans la section **"URI de redirection autorisés"**, cliquez sur **"+ Ajouter un URI"**
2. Ajoutez exactement cet URI (copiez-collez) :
   ```
   http://localhost:3000/oauth2callback
   ```
   ⚠️ **IMPORTANT** :
   - Pas de slash final
   - Pas d'espaces
   - Protocole `http://` (pas `https://`)
   - Port `3000` (pas 8080)
   - Chemin `/oauth2callback` exactement comme indiqué

### Étape 3 : Sauvegarder
1. Cliquez sur **"ENREGISTRER"** (bouton en bas de la page)
2. Attendez **2-3 minutes** pour la propagation des changements

### Étape 4 : Tester à nouveau
```bash
npm run test-calendar
```

## URI de redirection utilisé
Le package `@google-cloud/local-auth` utilise par défaut :
- **URI** : `http://localhost:3000/oauth2callback`
- **Port** : 3000 (pas le port 8080 de votre serveur Vite)

## Note importante
Si vous voulez utiliser un port différent, vous devrez :
1. Modifier le fichier `credentials.json` pour changer le `redirect_uris`
2. Mettre à jour la configuration dans Google Cloud Console
3. Ou configurer `@google-cloud/local-auth` pour utiliser un port personnalisé

