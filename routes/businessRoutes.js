const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const storage = multer.memoryStorage();
const upload = multer({ storage });

const businessController = require('../controllers/businessController');
const serviceController = require('../controllers/serviceController');
const reviewController = require('../controllers/reviewController');

// 🔸 Business routes
router.put('/business/:businessId',upload.single('image'),businessController.updateBusiness);
router.post('/business', upload.single('profileImage'), businessController.createBusiness);
router.delete('/business/:businessId', businessController.deleteBusiness);
router.get('/business', businessController.getAllBusinesses);
router.get('/business/:businessId', businessController.getBusinessById);

// 🔸 Service routes
router.get('/business/:businessId/services', serviceController.getAllServices);
router.post('/business/:businessId/services', upload.array('images', 10), serviceController.createService);
router.delete('/business/:businessId/services/:serviceId', serviceController.deleteService);

// 🔸 Review routes
router.post('/business/:businessId/services/:serviceId/reviews', reviewController.addReview);
router.get('/business/:businessId/services/:serviceId/reviews', reviewController.getReviews);
router.put('/business/:businessId/services/:serviceId/reviews/:reviewId/response', reviewController.respondToReview);

module.exports = router;
