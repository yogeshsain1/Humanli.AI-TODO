const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Note: You need to download your Firebase service account key and save it as serviceAccountKey.json
// Or use environment variables
let serviceAccount;
let firebaseInitialized = false;

try {
  // Try to load from file first
  try {
    serviceAccount = require('../serviceAccountKey.json');
    console.log('Firebase Admin: using serviceAccountKey.json');
  } catch (fileError) {
    // Fall back to environment variables
    if (process.env.FIREBASE_PROJECT_ID && 
        process.env.FIREBASE_PRIVATE_KEY && 
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PROJECT_ID !== 'your-project-id') {
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };
      console.log('Firebase Admin: using environment variables');
    } else {
      throw new Error('Firebase credentials not configured');
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  firebaseInitialized = true;
  console.log('Firebase Admin initialized');
} catch (error) {
  console.error('Firebase Admin not initialized:', error.message);
  console.error('Configure Firebase Admin via backend/.env (see backend/.env.example).');
}

module.exports = admin;
