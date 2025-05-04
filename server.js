const express = require('express');
const app = express();
const businessRoutes = require('./routes/businessRoutes');

app.use(express.json());
app.use('/api/business', businessRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
