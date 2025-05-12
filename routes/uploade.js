const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer'); // Import the multer setup
const cloudinary = require('../config/cloudinary'); // Import Cloudinary for image upload

router.post('/:businessId/services', upload.array('images', 10), async (req, res) => {
  try {
    // Ensure that files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Process each file upload to Cloudinary
    const imageUrls = [];
    for (let i = 0; i < req.files.length; i++) {
      const result = await cloudinary.uploader.upload(req.files[i].path);
      imageUrls.push(result.secure_url);
    }

    // Now handle service creation and save URLs to the database
    const service = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      images: imageUrls, // Store the image URLs from Cloudinary
    };

    // Assuming you save the service to the database here (Firestore, MongoDB, etc.)
    // await saveServiceToDatabase(service);

    res.status(200).json({
      success: true,
      message: "Service created successfully",
      service: service,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error uploading images or creating service",
    });
  }
});

module.exports = router;
