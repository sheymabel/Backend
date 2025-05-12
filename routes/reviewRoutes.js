const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Routes for Responding to Reviews
router.post('/:businessId/reviews/:reviewId/respond', reviewController.addReviewResponse);

module.exports = router;
