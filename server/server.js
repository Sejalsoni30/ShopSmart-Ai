const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const paymentRoutes = require('./routes/payment');
const authRoutes = require('./routes/auth');

// Load env vars
dotenv.config({ path: '../.env' }); // Adjust if .env is in root
// Also try local directory if not found in root
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShopSmart AI backend is running.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Demo Mode: ${!process.env.GEMINI_API_KEY ? 'Active (No API key found)' : 'Inactive (Gemini available)'}`);
});
