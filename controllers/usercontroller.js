// controllers/user.controller.js
const admin = require('./../config/firebase'); // Import Firebase Admin
const User = require('../models/usermodel'); // Optional, if you're storing extra user data in your DB

const getUsers = async (req, res) => {
  try {
    // List all users in Firebase Authentication
    const users = await admin.auth().listUsers();
    res.status(200).json(users.users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, displayName, role } = req.body;

    // Create the user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Optionally, save additional user info (e.g., role) in your own database
    const newUser = new User({
      firebaseUid: userRecord.uid,
      displayName,
      email,
      role,
    });
    await newUser.save();

    res.status(201).json({ userId: userRecord.uid, displayName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, email } = req.body;

    // Update user in Firebase Authentication
    const updatedUser = await admin.auth().updateUser(id, {
      displayName,
      email,
    });

    // Optionally, update your own database
    const user = await User.findOneAndUpdate({ firebaseUid: id }, { displayName, email });
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    res.status(200).json({ updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
};
