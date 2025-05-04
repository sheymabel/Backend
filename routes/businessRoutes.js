const express = require('express');
const router = express.Router();
const { db } = require('./../config/firebase');

// 🔹 CRUD: Business

// Create Business
router.post('/', async (req, res) => {
  try {
    const { name, address, category, description, email, phone, website, profileImage } = req.body;
    const ref = await db.collection('business').add({
      name, 
      address, 
      category, 
      description, 
      email, 
      phone, 
      website, 
      profileImage, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json({ message: 'Business created successfully', id: ref.id });
  } catch (e) {
    res.status(500).json({ error: 'Error creating business: ' + e.message });
  }
});

// Get all businesses
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('business').get();
    const businesses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(businesses);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching businesses: ' + e.message });
  }
});

// Update Business
router.put('/:businessId', async (req, res) => {
  try {
    const { name, address, category, description, email, phone, website, profileImage } = req.body;
    await db.collection('business').doc(req.params.businessId).update({
      name, 
      address, 
      category, 
      description, 
      email, 
      phone, 
      website, 
      profileImage, 
      updatedAt: new Date().toISOString(),
    });
    res.status(200).json({ message: 'Business updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Error updating business: ' + e.message });
  }
});

// Delete Business
router.delete('/:businessId', async (req, res) => {
  try {
    await db.collection('business').doc(req.params.businessId).delete();
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Error deleting business: ' + e.message });
  }
});

// 🔹 CRUD: Services

// Create Service for a Business
router.post('/:businessId/services', async (req, res) => {
  try {
    const { name, description, price, availability } = req.body;
    const ref = await db
      .collection('business')
      .doc(req.params.businessId)
      .collection('services')
      .add({
        name, 
        description, 
        price, 
        availability,
        createdAt: new Date().toISOString(),
      });
    res.status(201).json({ message: 'Service added successfully', id: ref.id });
  } catch (e) {
    res.status(500).json({ error: 'Error adding service: ' + e.message });
  }
});

// Get all services for a business
router.get('/:businessId/services', async (req, res) => {
  try {
    const snapshot = await db
      .collection('business')
      .doc(req.params.businessId)
      .collection('services')
      .get();
    const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(services);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching services: ' + e.message });
  }
});

// Update Service for a Business
router.put('/:businessId/services/:serviceId', async (req, res) => {
  try {
    await db
      .collection('business')
      .doc(req.params.businessId)
      .collection('services')
      .doc(req.params.serviceId)
      .update(req.body);
    res.status(200).json({ message: 'Service updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Error updating service: ' + e.message });
  }
});

// Delete Service for a Business
router.delete('/:businessId/services/:serviceId', async (req, res) => {
  try {
    await db
      .collection('business')
      .doc(req.params.businessId)
      .collection('services')
      .doc(req.params.serviceId)
      .delete();
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Error deleting service: ' + e.message });
  }
});


// 🔹 Add a Review
router.post('/:businessId/services/:serviceId/reviews', async (req, res) => {
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
          createdAt
        });
  
      res.status(201).json({ message: 'Review added successfully', id: reviewRef.id });
    } catch (e) {
      res.status(500).json({ error: 'Error adding review: ' + e.message });
    }
  });
  
  // 🔹 Get All Reviews
  router.get('/:businessId/services/:serviceId/reviews', async (req, res) => {
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
        response: doc.data().response || null, // Include response if it exists
      }));
  
      res.status(200).json(reviews);
    } catch (e) {
      res.status(500).json({ error: 'Error fetching reviews: ' + e.message });
    }
  });
  
// 🔹 Add/Update a Response to a Review
router.put('/:businessId/services/:serviceId/reviews/:reviewId/response', async (req, res) => {
    try {
      const { response, userName } = req.body; // Business response and responder's name
      const updatedAt = new Date().toISOString();
  
      // Check if response and userName are provided
      if (!response || !userName) {
        return res.status(400).json({ error: 'Response and userName are required' });
      }
  
      // Update the review with the business response
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
  });
  
  
  // 🔹 Delete a Review
  router.delete('/:businessId/services/:serviceId/reviews/:reviewId', async (req, res) => {
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
  });
  
  module.exports = router;