const { db } = require('../config/firebase');

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment, userId, userName } = req.body;
    const createdAt = new Date().toISOString();

    const reviewRef = await db
      .collection('business')
      .doc(req.params.businessId)
      .collection('services')
      .doc(req.params.serviceId)
      .collection('reviews')
      .add({
        rating,
        comment,
        userId,
        userName,
        createdAt,
      });

    res.status(201).json({ message: 'Review added successfully', id: reviewRef.id });
  } catch (e) {
    res.status(500).json({ error: 'Error adding review: ' + e.message });
  }
};

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviewsSnapshot = await db
      .collection('business')
      .doc(req.params.businessId)
      .collection('services')
      .doc(req.params.serviceId)
      .collection('reviews')
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      response: doc.data().response || null,
    }));

    res.status(200).json(reviews);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching reviews: ' + e.message });
  }
};

// Add or update a response
exports.respondToReview = async (req, res) => {
  try {
    const { response, userName } = req.body;
    const updatedAt = new Date().toISOString();

    if (!response || !userName) {
      return res.status(400).json({ error: 'Response and userName are required' });
    }

    await db
      .collection('business')
      .doc(req.params.businessId)
      .collection('services')
      .doc(req.params.serviceId)
      .collection('reviews')
      .doc(req.params.reviewId)
      .update({
        response: {
          userName,
          response,
          updatedAt,
        },
      });

    res.status(200).json({ message: 'Response added successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Error adding response: ' + e.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    await db
      .collection('business')
      .doc(req.params.businessId)
      .collection('services')
      .doc(req.params.serviceId)
      .collection('reviews')
      .doc(req.params.reviewId)
      .delete();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Error deleting review: ' + e.message });
  }
};
