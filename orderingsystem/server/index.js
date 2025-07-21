const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const productsRoutes = require('./routes/products');

app.use(cors());
app.use(express.json());
app.use('/api/products', productsRoutes);

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
