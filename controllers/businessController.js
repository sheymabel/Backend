const { db } = require('../config/firebase');

// Create Business
const createBusiness = async (req, res) => {
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
};

// Get All Businesses
const getAllBusinesses = async (req, res) => {
  try {
    const snapshot = await db.collection('business').get();
    const businesses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(businesses);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching businesses: ' + e.message });
  }
};

// Update Business
const updateBusiness = async (req, res) => {
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
};

// Delete Business
const deleteBusiness = async (req, res) => {
  try {
    await db.collection('business').doc(req.params.businessId).delete();
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Error deleting business: ' + e.message });
  }
};

module.exports = {
  createBusiness,
  getAllBusinesses,
  updateBusiness,
  deleteBusiness,
};
