const { db } = require('../config/firebase');
const upload = require('../middlewares/multer'); // For handling file uploads
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');



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

   const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'business_profile' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);  // Log the error
          return reject(error);
        }
        console.log('Cloudinary upload result:', result);  // Log the result
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);  // Upload the buffer to Cloudinary
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

    const updatedData = {};

    // Check the presence of body data and update fields
    if (req.body.name) updatedData.name = req.body.name;
    if (req.body.email) updatedData.email = req.body.email;
    if (req.body.phone) updatedData.phone = req.body.phone;
    if (req.body.address) updatedData.address = req.body.address;
    if (req.body.category) updatedData.category = req.body.category;
    if (req.body.description) updatedData.description = req.body.description;
    if (req.body.website) updatedData.website = req.body.website;

    updatedData.updatedAt = new Date().toISOString();

    // Handle file upload
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        console.log('Cloudinary result for file:', result);  // Log the result of the upload
        imageUrls.push(result.secure_url);  // Push the Cloudinary URL to the imageUrls array
      }

      // Log imageUrls to check if URLs are being populated correctly
      console.log('Uploaded image URLs:', imageUrls);

      // Add images to updated data (check if multiple images are uploaded)
      updatedData.profileImages = imageUrls;

      console.log('Final updatedData:', updatedData);  // Log the final updated data object
    }

    // Update Firestore document with the new data
    await businessRef.update(updatedData);

    return res.status(200).json({
      message: 'Business profile updated successfully',
      updatedData: updatedData,
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

// ✅ GET BUSINESS ID BY USER UID
const getBusinessIdByUID = async (uid) => {
  const snapshot = await db.collection('business')
    .where('userId', '==', uid)
    .limit(1)
    .get();

  if (snapshot.empty) {
    throw new Error('No business found for this user');
  }

  return snapshot.docs[0].id;
};

module.exports = {
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getAllBusinesses,
  getBusinessIdByUID,
};
