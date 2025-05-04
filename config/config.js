const admin = require('firebase-admin');

// Import service account
const serviceAccount = require('./../serviceAccountKeys.json');  // Si le fichier est dans config/

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com'
});

// Export Firestore and Auth
const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
