const admin = require('../config/firebase'); // Ensure this exports initialized admin SDK
const User = require('../models/usermodel'); // Your Mongoose model or DB schema

// Get all Firebase Auth users
const getUsers = async (req, res) => {
  try {
    const users = await admin.auth().listUsers();
    res.status(200).json(users.users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new Firebase Auth user
const createUser = async (req, res) => {
  try {
    const { email, password, displayName, role } = req.body;

    if (!email || !password || !displayName || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Save to Firestore or MongoDB
    const newUser = new User({
      firebaseUid: userRecord.uid,
      displayName,
      email,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      userId: userRecord.uid,
      displayName,
      email,
      role,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update Firebase user info
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, email } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const updatedUser = await admin.auth().updateUser(id, {
      ...(displayName && { displayName }),
      ...(email && { email }),
    });

    const dbUser = await User.findOneAndUpdate(
      { firebaseUid: id },
      { displayName, email },
      { new: true }
    );

    if (!dbUser) {
      return res.status(404).json({ message: 'User not found in DB' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      firebaseUser: updatedUser,
      dbUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
};
