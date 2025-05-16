const { db } = require('../config/firebase');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
// Helper: Upload media to Cloudinary
const uploadMedia = async (files, existingMedia = []) => {
  const mediaUrls = [...existingMedia];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'services',
      resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
    });
    mediaUrls.push(result.secure_url);
  }

  return mediaUrls;
};

// CRUD Operations
module.exports = {
  // Get all services for a business
  getAllServices: async (req, res) => {
    try {
      const snapshot = await db
        .collection('business')
        .doc(req.params.businessId)
        .collection('services')
        .get();

      const services = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get single service
  getService: async (req, res) => {
    try {
      const doc = await db
        .collection('business')
        .doc(req.params.businessId)
        .collection('services')
        .doc(req.params.serviceId)
        .get();

      if (!doc.exists) return res.status(404).json({ error: 'Service not found' });
      res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create service
  createService: async (req, res) => {
    try {
      const { name, description = '', price } = req.body;
      let mediaUrls = [];

      // Upload files to Cloudinary if provided
      if (req.files?.length > 0) {
        mediaUrls = await uploadMedia(req.files);
      } else if (req.body.mediaUrls) {
        mediaUrls = Array.isArray(req.body.mediaUrls) ? req.body.mediaUrls : [req.body.mediaUrls];
      }

      const priceValue = price ? parseFloat(price) : 0;

      const serviceData = {
        name,
        description,
        price: priceValue,
        mediaUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db
        .collection('business')
        .doc(req.params.businessId)
        .collection('services')
        .add(serviceData);

      res.status(201).json({ id: docRef.id, ...serviceData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update service
  updateService: async (req, res) => {
    try {
      const docRef = db
        .collection('business')
        .doc(req.params.businessId)
        .collection('services')
        .doc(req.params.serviceId);

      const doc = await docRef.get();
      if (!doc.exists) return res.status(404).json({ error: 'Service not found' });

      const updates = {
        ...req.body,
        updatedAt: new Date(),
      };

      // Handle file uploads and merging with existing media
      if (req.files?.length > 0) {
        const existingMedia = doc.data().mediaUrls || [];
        updates.mediaUrls = await uploadMedia(req.files, existingMedia);
      }

      if (req.body.price) updates.price = parseFloat(req.body.price); // Ensure price is a valid number

      await docRef.update(updates);
      res.status(200).json({ id: doc.id, ...updates });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete service
  deleteService: async (req, res) => {
    try {
      const docRef = db
        .collection('business')
        .doc(req.params.businessId)
        .collection('services')
        .doc(req.params.serviceId);

      const doc = await docRef.get();
      if (!doc.exists) return res.status(404).json({ error: 'Service not found' });

      // Optional: Delete media from Cloudinary
      const { mediaUrls } = doc.data();
      if (mediaUrls?.length > 0) {
        await Promise.all(
          mediaUrls.map((url) => {
            const publicId = url.split('/').pop().split('.')[0];
            return cloudinary.uploader.destroy(`services/${publicId}`);
          })
        );
      }

      await docRef.delete();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
