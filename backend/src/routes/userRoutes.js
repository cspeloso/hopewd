console.log('userRoutes.js is loaded');

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported
const userService = require('../services/userService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new user
router.post('/register', async (req, res) => {
  console.log('Received request to /register'); // Log the route hit
  try {
    const user = await userService.createUser(req.body);
    console.log('User created:', user); // Log the created user
    res.status(201).json(user);
  } catch (error) {
    console.error('Error in /register:', error.message); // Log errors
    res.status(500).json({ error: error.message });
  }
});

// Log in a user
router.post('/login', async (req, res) => {
  console.log('Received request to /login'); // Log the route hit
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username); // Log the username

    const user = await userService.findUserByUsername(username);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isPasswordMatch); // Log password comparison result
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Token generated:', token); // Log the token

    res.json({ token });
  } catch (error) {
    console.error('Error in /login:', error.message); // Log errors
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;