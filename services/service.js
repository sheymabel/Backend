const admin = require('firebase-admin');
const db = admin.firestore(); // Initialize Firestore

// Create a new service
const createService = async (businessId, name, description, price) => {
    const serviceRef = db.collection('business').doc(businessId).collection('services').doc();
    await serviceRef.set({
        name,
        description,
        price,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    return serviceRef.id;
};

// Retrieve a service by businessId and serviceId
const getService = async (businessId, serviceId) => {
    const serviceDoc = await db.collection('business').doc(businessId).collection('services').doc(serviceId).get();
    if (!serviceDoc.exists) {
        throw new Error('Service not found');
    }
    return serviceDoc.data();
};

// Update a service
const updateService = async (businessId, serviceId, name, description, price) => {
    const serviceRef = db.collection('business').doc(businessId).collection('services').doc(serviceId);
    await serviceRef.update({
        name,
        description,
        price,
        updatedAt: new Date().toISOString(),
    });
};

// Delete a service
const deleteService = async (businessId, serviceId) => {
    const serviceRef = db.collection('business').doc(businessId).collection('services').doc(serviceId);
    await serviceRef.delete();
};

module.exports = {
    createService,
    getService,
    updateService,
    deleteService,
};
