console.log('Starting server.js...');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE']
}));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const videoRoutes = require('./routes/videoRoutes');
app.use('/api/videos', videoRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Serve static files from the uploads folder
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});