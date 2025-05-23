// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');
const adminController = require('../controllers/adminController');


// Admin Routes
router.get('/getAllUsers', adminController.getAllUsers);
router.put('/updateProfile', adminController.updateAdminProfile);
router.post('/createTraveler', adminController.createTraveler); // Check if this is defined correctly
router.post('/createBusiness', adminController.createBusiness); 
router.get('/getTravelerByUid/:uid', adminController.getTravelerByUid);
router.get('/getBusinessByUid/:uid', adminController.getBusinessByUid);
router.put('/updateTraveler/:uid', adminController.updateTraveler);
router.put('/updateBusiness/:uid', adminController.updateBusiness);
router.delete('/deleteTraveler/:uid', adminController.deleteTraveler);
router.delete('/deleteBusiness/:uid', adminController.deleteBusiness);
router.get('/travelers', adminController.getAllTravelers);
router.get('/businesses', adminController.getAllBusinesses);
module.exports = router;
