# VMdeveloppeur

Application pour préparer et créer des machines virtuelles.

## Stack

- `backend/` : API `FastAPI`
- `frontend/` : interface `React + Vite`

## Démarrage

Backend :

```bash
cd backend
pip install -r requirements.txt
python -m backend.app.main
```

Frontend :

```bash
cd frontend
npm install
npm run dev
```

## Fonctionnalités de base

- création d'une VM via un formulaire
- liste des VM enregistrées
- préparation à l'intégration d'un hyperviseur réel
