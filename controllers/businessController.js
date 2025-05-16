const { db } = require('../config/firebase');
const upload = require('../middlewares/multer'); // For handling file uploads
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const multer = require('multer');


// 🔎 Validation helper
const validateBusinessData = (data) => {
  const { name, email, phone, description, website } = data;
  const errors = [];

  if (!name || name.trim() === '') errors.push('Business name is required.');
  if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) errors.push('Invalid email format.');
  if (!phone || !/^\+?[1-9]\d{1,14}$/.test(phone)) errors.push('Invalid phone number format.');
  if (!description || description.trim() === '') errors.push('Business description is required.');
  if (website && !/^(https?:\/\/)?([a-z0-9]+\.)+[a-z]{2,6}(\/[\w-]*)*$/.test(website)) errors.push('Invalid website URL format.');

  return errors;
};

// ✅ CREATE BUSINESS
const createBusiness = async (req, res) => {
  try {
    const { name, address, category, description, email, phone, website, userId } = req.body;

    const validationErrors = validateBusinessData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    let profileImageUrl = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      profileImageUrl = result.secure_url;
    }

    const ref = await db.collection('business').add({
      name,
      address,
      category,
      description,
      email,
      phone,
      website,
      profileImage: profileImageUrl,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Business created successfully', id: ref.id });
  } catch (e) {
    res.status(500).json({ error: 'Error creating business: ' + e.message });
  }
};

  const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'business_profiles' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};


   const updateBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const businessRef = db.collection('business').doc(businessId);
    const businessSnap = await businessRef.get();

    if (!businessSnap.exists) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Prepare updated fields
    const fields = ['name', 'email', 'phone', 'address', 'category', 'description', 'website'];
    const updatedData = {};

    fields.forEach(field => {
      if (req.body[field]) updatedData[field] = req.body[field];
    });

    // Timestamp
    updatedData.updatedAt = new Date().toISOString();

    // ✅ Handle single image upload
    if (req.file) {
      console.log('Uploading image to Cloudinary...');
      const result = await uploadToCloudinary(req.file.buffer);
      console.log('Cloudinary upload result:', result);

      if (result && result.secure_url) {
        updatedData.profileImages = [result.secure_url]; // Store as array
      }
    }

    // ✅ Update document in Firestore
    await businessRef.update(updatedData);

    return res.status(200).json({
      message: 'Business profile updated successfully',
      updatedData,
    });

  } catch (error) {
    console.error('Error updating business profile:', error);
    return res.status(500).json({ error: 'Error updating business profile: ' + error.message });
  }
};


// ✅ DELETE BUSINESS
const deleteBusiness = async (req, res) => {
  try {
    const businessRef = db.collection('business').doc(req.params.businessId);
    const businessSnap = await businessRef.get();

    if (!businessSnap.exists) {
      return res.status(404).json({ error: 'Business not found' });
    }

    await businessRef.delete();
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Error deleting business: ' + e.message });
  }
};

// ✅ GET ALL BUSINESSES
const getAllBusinesses = async (req, res) => {
  try {
    const snapshot = await db.collection('business').get();
    const businesses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(businesses);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching businesses: ' + e.message });
  }
};

// ✅ GET BUSINESS BY ID
const getBusinessById = async (req, res) => {
  try {
    const { businessId } = req.params;
    const businessRef = db.collection('business').doc(businessId);
    const businessSnap = await businessRef.get();

    if (!businessSnap.exists) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const businessData = {
      id: businessSnap.id,
      ...businessSnap.data()
    };

    res.status(200).json(businessData);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching business: ' + e.message });
  }
};

module.exports = {
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getAllBusinesses,
  getBusinessById
};
