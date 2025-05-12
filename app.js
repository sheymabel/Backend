const express = require('express');
const app = express();
const adminRouter = require('./routes/adminRoutes');  // Import the admin routes

const cors = require('cors');
app.use(cors());  // Enable CORS

// Middleware to parse JSON bodies
app.use(express.json());  // <-- Assurez-vous d'ajouter ceci avant la définition des routes
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded
app.use('/api/admin', adminRouter);

// Example of a fallback route
app.get('/', (req, res) => {
  res.send('Welcome to the Admin API');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
