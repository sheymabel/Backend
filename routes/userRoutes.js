const express = require('express');
const userController = require('../controllers/usercontroller');

const router = express.Router();

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);

module.exports = router;
