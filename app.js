const express = require('express');
const cors = require('cors');
const { db } = require('./config/firebase'); // Import Firebase connection

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Services ---
app.post('/api/business/:businessId/services', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { name, description, price, imageUrl } = req.body;

    // Reference to the services sub-collection of the given business document
    const serviceRef = db.collection('business').doc(businessId).collection('services');
    const timestamp = new Date().toISOString();

    // Add new service to the sub-collection
    const newService = await serviceRef.add({
      name,
      description,
      price,
      imageUrl: imageUrl || '',
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    res.status(201).json({ id: newService.id, message: 'Service created successfully' });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/business/:businessId/services', async (req, res) => {
  try {
    const { businessId } = req.params;

    // Reference to the services sub-collection of the given business document
    const serviceRef = db.collection('business').doc(businessId).collection('services');
    const snapshot = await serviceRef.get();
    const services = [];

    snapshot.forEach(doc => services.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- Respond to Reviews ---
app.post('/api/business/:businessId/services/:serviceId/respondToReviews/:reviewId', async (req, res) => {
  try {
    const { businessId, serviceId, reviewId } = req.params;
    const { response, reviewerId } = req.body;
    const timestamp = new Date().toISOString();

    // Reference to the respondToReviews sub-collection of the given service document
    const respondToReviewRef = db.collection('business')
      .doc(businessId)
      .collection('services')
      .doc(serviceId)
      .collection('respondToReviews');

    // Add a response to the review
    const newResponse = await respondToReviewRef.add({
      response,
      date: timestamp,
      reviewerId,
    });

    res.status(201).json({ id: newResponse.id, message: 'Response added successfully' });
  } catch (error) {
    console.error('Error responding to review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/business/:businessId/services/:serviceId/respondToReviews', async (req, res) => {
  try {
    const { businessId, serviceId } = req.params;

    // Reference to the respondToReviews sub-collection of the given service document
    const respondToReviewRef = db.collection('business')
      .doc(businessId)
      .collection('services')
      .doc(serviceId)
      .collection('respondToReviews');

    const snapshot = await respondToReviewRef.get();
    const responses = [];

    snapshot.forEach(doc => responses.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(responses);
  } catch (error) {
    console.error('Error fetching review responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
