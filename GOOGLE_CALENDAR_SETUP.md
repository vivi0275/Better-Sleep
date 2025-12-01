# Configuration Google Calendar - Guide Complet

## Problème : "Not a valid origin"

L'erreur `idpiframe_initialization_failed` avec le message "Not a valid origin" signifie que l'origine de votre application n'est pas autorisée dans Google Cloud Console.

## Solution : Configurer les origines autorisées

### Étape 1 : Accéder à Google Cloud Console

1. Allez sur : **https://console.cloud.google.com/apis/credentials**
2. Assurez-vous que le projet **"Better Sleep"** (ou votre projet) est sélectionné
3. Dans la liste des **"ID client OAuth 2.0"**, trouvez et cliquez sur votre client :
   - `814343363476-qnftr3q1mtd3b7ibv1mn6qk8571eoh20.apps.googleusercontent.com`

### Étape 2 : Ajouter les origines JavaScript autorisées

1. Dans la section **"Origines JavaScript autorisées"**, cliquez sur **"+ Ajouter un URI"**
2. Ajoutez **TOUS** les ports que vous pourriez utiliser :
   - `http://localhost:8080`
   - `http://localhost:8081`
   - `http://localhost:3000` (si vous utilisez d'autres outils)
   - `http://localhost:5173` (port par défaut Vite)

   ⚠️ **IMPORTANT pour chaque URI** :
   - Pas de slash final (`/`)
   - Pas d'espaces avant ou après
   - Protocole `http://` (pas `https://` pour le développement local)
   - Port inclus explicitement

### Étape 3 : Ajouter les URI de redirection (optionnel pour l'instant)

Pour le moment, vous n'avez pas besoin d'URI de redirection car vous utilisez `gapi.auth2` côté client. Mais si vous en ajoutez plus tard, utilisez :
- `http://localhost:8080/oauth2callback`
- `http://localhost:8081/oauth2callback`

### Étape 4 : Sauvegarder

1. Cliquez sur **"ENREGISTRER"** (bouton bleu en bas de la page)
2. **Attendez 2-5 minutes** pour la propagation des changements dans les serveurs Google

### Étape 5 : Tester

1. Videz le cache de votre navigateur (Cmd+Shift+Delete sur Mac, Ctrl+Shift+Delete sur Windows)
2. Fermez toutes les fenêtres du navigateur
3. Rouvrez le navigateur et allez sur votre application
4. Appuyez sur **Cmd+Shift+R** (Mac) ou **Ctrl+F5** (Windows) pour un hard refresh

## Vérification

Pour vérifier que tout est correct :

1. L'erreur "Not a valid origin" devrait disparaître
2. Le bouton "Connect Google Calendar" devrait être cliquable
3. En cliquant dessus, une popup Google devrait s'ouvrir pour l'authentification

## Ports courants à ajouter

Selon votre configuration, ajoutez ces origines :
- `http://localhost:8080` (port configuré dans vite.config.ts)
- `http://localhost:8081` (port utilisé actuellement)
- `http://localhost:5173` (port par défaut Vite si 8080 est occupé)

## Note importante

Si vous changez de port, vous devrez :
1. Ajouter le nouveau port dans Google Cloud Console
2. Attendre 2-5 minutes
3. Recharger l'application

