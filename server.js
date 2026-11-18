require('dotenv').config();
const express = require('express');

const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware

app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Shoes Inventory API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});