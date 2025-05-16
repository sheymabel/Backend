const express = require('express');
const app = express();
const businessRoutes = require('./routes/businessRoutes');
const cors = require('cors');
const multer = require('multer');
// Enable CORS
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for business-related endpoints
app.use('/api/business', businessRoutes);
app.use('/api', businessRoutes);  

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
