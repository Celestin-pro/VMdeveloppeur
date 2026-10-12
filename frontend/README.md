# Frontend

Cette partie contiendra l'interface utilisateur.

Structure prévue :

- `src/` : code source de l'application
- `public/` : ressources statiques

## Configuration Bureau (Electron)

Pour transformer cette application en application de bureau, nous utilisons **Electron**.

### Installation
```bash
npm install --save-dev electron
# Pour initialiser la configuration Electron
npx electron-forge import
```

### Lancement
Pour démarrer l'application en mode bureau :
```bash
npm run electron-dev
```

### Notes spécifiques
- L'accès aux API natives du système est autorisé via le processus principal.
- La fenêtre principale est configurée dans `electron/main.js`.
