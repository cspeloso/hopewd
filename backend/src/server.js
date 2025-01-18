console.log('Starting server.js...');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config();

console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const allowedOrigins = ['http://localhost:3000', 'https://hopewd.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const videoRoutes = require('./routes/videoRoutes');
app.use('/api/videos', videoRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});