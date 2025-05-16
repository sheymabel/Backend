const express = require('express');
const app = express();
const businessRoutes = require('./routes/businessRoutes');
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prefix the route
app.use('/api/business', businessRoutes);  // ✅ Important


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
