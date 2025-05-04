const express = require('express');
const router = express.Router();
const { 
  createTraveler, 
  createBusiness, 
  getTravelerByUid, 
  getBusinessByUid, 
  updateTraveler, 
  updateBusiness, 
  deleteTraveler, 
  deleteBusiness 
} = require('../controllers/adminController');

// Admin Create Traveler
router.post('/traveler/create', createTraveler);

// Admin Create Business
router.post('/business/create', createBusiness);

// Admin Get Traveler by UID
router.get('/traveler/:uid', getTravelerByUid);

// Admin Get Business by UID
router.get('/business/:uid', getBusinessByUid);

// Admin Update Traveler
router.put('/traveler/:uid', updateTraveler);

// Admin Update Business
router.put('/business/:uid', updateBusiness);

// Admin Delete Traveler
router.delete('/traveler/:uid', deleteTraveler);

// Admin Delete Business
router.delete('/business/:uid', deleteBusiness);

module.exports = router;
