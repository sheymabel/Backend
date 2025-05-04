const express = require('express');
const router = express.Router();

// Import serviceController functions
const serviceController = require('../controllers/serviceController');

// Define routes and map them to controller functions
router.post('/addService', serviceController.addService);  // Add service
router.get('/getService/:businessId/:serviceId', serviceController.getService);  // Get service
router.put('/updateService/:businessId/:serviceId', serviceController.updateService);  // Update service
router.delete('/deleteService/:businessId/:serviceId', serviceController.deleteService);  // Delete service

// Export the router
module.exports = router;
