const admin = require('firebase-admin');
const serviceAccount = require('./../serviceAccountKeys.json');

// Initialize Firebase Admin SDK if it hasn't been initialized already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
