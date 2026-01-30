# Humanli.AI-TODO

A simple task manager where you can create boards and manage todos inside each board.

- Frontend: React (Create React App)
- Backend: Node.js + Express
- Database: MongoDB
- Auth: Firebase Email/Password (frontend) + Firebase Admin token verification (backend)

## What you need installed

- Node.js (18+ recommended)
- npm (comes with Node)
- MongoDB (local) OR a MongoDB Atlas connection string
- A Firebase project with Email/Password auth enabled

## Project layout

- `frontend/` React app
- `backend/` Express API

## Setup (first time)

### 1) Backend environment

1. Open a terminal in `backend/`:

   ```bash
   cd backend
   npm install
   ```

2. Create your environment file:

   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env
   ```

3. Edit `backend/.env` and set values:

- `MONGODB_URI` (example: `mongodb://localhost:27017/todo-app`)
- `PORT` (default `5000`)
- `FRONTEND_URL` (example: `http://localhost:3000`)
- Firebase Admin credentials (recommended via env vars):
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY` (keep the `\n` newlines as shown in `.env.example`)

> Security: do not commit or share `.env` or any Firebase service account keys.

### 2) Frontend environment

1. Open a terminal in `frontend/`:

   ```bash
   cd frontend
   npm install
   ```

2. Create your environment file:

   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env
   ```

3. Edit `frontend/.env` and set values:

- `REACT_APP_FIREBASE_*` values from Firebase Console → Project settings → Your apps
- `REACT_APP_API_URL=http://localhost:5000/api`

## Run the project

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

API health check:

- `http://localhost:5000/api/health`

### Terminal 2 — Frontend

```bash
cd frontend
npm start
```

Open:

- `http://localhost:3000`

## Notes

- Authenticated API routes expect a Firebase ID token:
  - `Authorization: Bearer <firebase_id_token>`
- If Firebase Admin is not configured, the backend will return a `503` for protected routes.

## Build (frontend)

```bash
cd frontend
npm run build
```

This creates a production build in `frontend/build`.
