const express = require('express');
const { authenticate } = require('../middleware/auth'); // Import the authentication middleware
const videoService = require('../services/videoService');
const upload = require('../config/multer'); // Import Multer configuration
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const jwt = require('jsonwebtoken'); // Add this line

const router = express.Router();

// Get paginated video feed
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    let userId = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        userId = decoded.id; // Attach user ID if token is valid
      } catch (err) {
        console.warn('Invalid or expired token, proceeding as guest.');
        // Optionally log more details, but allow guests to proceed
      }
    }

    // Fetch the feed using userId (null for guests)
    const videos = await videoService.getFeed(page, limit, userId);
    res.json(videos);
  } catch (error) {
    console.error('Error fetching feed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/user', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await videoService.getUserDetails(userId); // Fetch user details
    const videos = await videoService.getUserVideos(userId); // Fetch user's videos

    res.json({
      username: user.username, // Include the username
      videos, // Include the list of videos
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Search videos
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query; // Search query from URL
    const videos = await videoService.searchVideos(q);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Upload a video (protected route)
// router.post('/', authenticate, async (req, res) => {
//   try {
//     const video = await videoService.uploadVideo(req.body, req.user.id);
//     res.status(201).json(video);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

//  For when a user uploads a video
router.post('/upload', authenticate, upload.single('video'), async (req, res) => {
  try {
    const { file } = req;
    const { title } = req.body;
    const userId = req.user.id;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate thumbnail
    const thumbnailPath = `uploads/thumbnails/${Date.now()}-thumbnail.png`;
    ffmpeg(file.path)
      .screenshots({
        count: 1,
        folder: path.join(__dirname, '../../uploads/thumbnails'),
        filename: path.basename(thumbnailPath),
        size: '320x240',
      })
      .on('end', async () => {
        // Save video metadata to the database
        const video = await videoService.uploadVideo({
          title,
          url: `/uploads/${file.filename}`,
          thumbnail: `/${thumbnailPath}`,
          userId,
        });

        res.status(201).json(video);
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).json({ error: 'Error generating thumbnail' });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// For when a user likes a video
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id; // From the authenticated user
    const result = await videoService.likeVideo(videoId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error liking video:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;