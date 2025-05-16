const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

// Public routes
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);

// Protected route (example)
router.post('/protected', verifyToken, (req, res) => {
  return res.status(200).json({
    message: 'Access granted',
    user: req.user, // contains Firebase UID, email, etc.
  });
});

module.exports = router;
