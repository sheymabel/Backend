const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const storage = multer.memoryStorage(); // or diskStorage if you're saving to disk
const upload = multer({ storage });

const businessController = require('../controllers/businessController');
const serviceController = require('../controllers/serviceController');
const reviewController = require('../controllers/reviewController');

// 🔸 Business routes
router.put('/business/:businessId', upload.single('image'), businessController.updateBusiness);
router.post('/business', upload.single('profileImage'), businessController.createBusiness);
router.delete('/business/:businessId', businessController.deleteBusiness);
router.get('/business', businessController.getAllBusinesses);
router.get('/business/:businessId', businessController.getBusinessById);

// 🔸 Service routes
router.get('/business/:businessId/services', serviceController.getAllServices);
router.get('/business/:businessId/services/:serviceId', serviceController.getService);
router.post(
  '/business/:businessId/services',
  upload.fields([
    { name: 'profileImage', maxCount: 1 }, // Single profile image
    { name: 'media', maxCount: 10 } // Multiple media files
  ]), 
  serviceController.createService
);

router.put(
  '/business/:businessId/services/:serviceId',
  upload.fields([
    { name: 'profileImage', maxCount: 1 }, // Single profile image
    { name: 'media', maxCount: 10 } // Multiple media files
  ]), 
  serviceController.updateService
);

router.delete('/business/:businessId/services/:serviceId', serviceController.deleteService);

// 🔸 Review routes
router.post('/business/:businessId/services/:serviceId/reviews', reviewController.addReview);
router.get('/business/:businessId/services/:serviceId/reviews', reviewController.getReviews);
router.put('/business/:businessId/services/:serviceId/reviews/:reviewId/response', reviewController.respondToReview);

module.exports = router;
