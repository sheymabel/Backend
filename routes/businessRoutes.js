const express = require('express');
const router = express.Router();


const multer = require('multer');
const businessController = require('../controllers/businessController');
const serviceController = require('../controllers/serviceController');
const reviewController = require('../controllers/reviewController');

// Multer setup for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory (buffer)
const upload = multer({ storage: storage }); // Initialize multer with memory storage

// 🔸 Business routes
//router.get('/:businessId', businessController.getBusinessById);
router.put('/:businessId', businessController.updateBusiness);
router.delete('/:businessId', businessController.deleteBusiness);

// 🔸 Service routes

router.get('/:businessId/services', serviceController.getAllServices);
router.get('/my-business-id', authMiddleware, serviceController.getMyBusinessId);
router.post('/:businessId/services', upload.array('images', 10), serviceController.createService);
router.delete('/:businessId/services/:serviceId', serviceController.deleteService);

// 🔸 Review routes
router.post('/:businessId/services/:serviceId/reviews', reviewController.addReview);
router.get('/:businessId/services/:serviceId/reviews', reviewController.getReviews);
router.put('/:businessId/services/:serviceId/reviews/:reviewId/response', reviewController.respondToReview);

module.exports = router;
