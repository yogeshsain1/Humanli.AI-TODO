# Quick Setup Guide

Follow these steps to get the app running quickly:

## Step 1: Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Step 2: Firebase Setup

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Email/Password authentication
4. Get your web app config (for frontend .env)
5. Download a service account key for local development only (do not commit or submit it)
   - Use env vars in `backend/.env` (from `backend/.env.example`) or reference `backend/serviceAccountKey.example.json`

## Step 3: MongoDB Setup

### Option A: Local MongoDB

- Install MongoDB and start the service

### Option B: MongoDB Atlas

- Create free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string

## Step 4: Configure Environment Variables

### Backend (.env)

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and Firebase credentials
```

### Frontend (.env)

```bash
cd frontend
cp .env.example .env
# Edit .env with your Firebase web app config
```

## Step 5: Run the Application

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

## Step 6: Access the App

Open http://localhost:3000 in your browser

## First Time Use

1. Click "Sign up" and create an account
2. Check your email for verification link
3. Click the link and return to the app
4. Click "I've Verified - Refresh"
5. Start creating boards and todos!

## Need Help?

Check the main README.md for detailed setup instructions and troubleshooting.
