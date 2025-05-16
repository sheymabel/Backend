const { db } = require('../config/firebase'); // Firebase Admin SDK
const upload = require('../middlewares/multer'); // For handling file uploads
const cloudinary = require('../config/cloudinary'); // Cloudinary configuration
const streamifier = require('streamifier'); // Streamify buffer for Cloudinary

// Helper function to upload image buffer to Cloudinary with folder path
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: '/images',  // Specify the folder path on Cloudinary
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);  // Pipe the buffer to Cloudinary
  });
};



// Keep only ONE version of this function:
exports.getAllServices = async (req, res) => {
  const { businessId } = req.params;

  try {
    const snapshot = await db
      .collection('business')
      .doc(businessId)
      .collection('services')
      .get();

    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services: ' + error.message });
  }
};


exports.createService = async (req, res) => {
  const { name, description, price, businessId } = req.body;

  try {
    // Check if businessId is valid
    if (!businessId) {
      return res.status(400).json({ success: false, message: "Business ID is required" });
    }

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const imageUrls = []; // Array to store URLs of uploaded images

    // Upload each file to Cloudinary and store the URLs
    for (let file of req.files) {
      const result = await uploadToCloudinary(file.buffer); // Upload file as buffer
      imageUrls.push(result.secure_url); // Store the URL of uploaded image
    }

    // Create the service object from request body
    const service = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      images: imageUrls, // Attach image URLs
    };

    // Fetch the business document from Firestore to ensure it exists
    const businessDoc = await db.collection('business').doc(businessId).get();
    if (!businessDoc.exists) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    // Add the service to the Firestore 'services' collection under the specific business
    const docRef = await db
      .collection('business')
      .doc(businessId)
      .collection('services')
      .add(service); // Add service document to Firestore

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Service created successfully",
      service: {
        id: docRef.id, // Include document ID
        businessId: businessId, // Include businessId in response
        ...service, // Spread the service details
      },
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: "Error creating service" });
  }
};


// Get all services for a specific business
exports.getAllServices = async (req, res) => {
  try {
    const { businessId } = req.params;
    const snapshot = await db
      .collection('business')
      .doc(businessId)
      .collection('services')
      .get(); // Fetch all services for the given business

    // Format the response data
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(services); // Return the list of services
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services: ' + error.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const { businessId, serviceId } = req.params;

    // Update service document in Firestore
    await db
      .collection('business')
      .doc(businessId)
      .collection('services')
      .doc(serviceId)
      .update({
        ...req.body, // Update service fields with request body
        updatedAt: new Date().toISOString(), // Add an updated timestamp
      });

    res.status(200).json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating service: ' + error.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const { businessId, serviceId } = req.params;

    // Delete service document from Firestore
    await db
      .collection('business')
      .doc(businessId)
      .collection('services')
      .doc(serviceId)
      .delete();

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting service: ' + error.message });
  }
};
