const { db } = require('../config/firebase');

// Create a service
exports.createService = async (req, res) => {
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
};

// Get all services
exports.getServices = async (req, res) => {
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
};

// Update a service
exports.updateService = async (req, res) => {
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
};

// Delete a service
exports.deleteService = async (req, res) => {
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
};
