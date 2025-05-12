// services/userservice.js
const admin = require('firebase-admin');

// Path to your Firebase Service Account Key JSON
const serviceAccount = require('../config/serviceAccountKey.json'); // Make sure path is correct

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const getAllUsers = async (role) => {
  const listUsersResult = await admin.auth().listUsers();
  
  const users = listUsersResult.users.map(userRecord => ({
    uid: userRecord.uid,
    email: userRecord.email,
    displayName: userRecord.displayName,
    role: userRecord.customClaims?.role || null, // customClaims must be set in Firebase
  }));

  if (role) {
    return users.filter(user => user.role === role);
  }

  return users;
};

module.exports = {
  getAllUsers,
};
