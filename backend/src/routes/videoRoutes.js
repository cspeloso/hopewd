const express = require('express');
const { authenticate } = require('../middleware/auth'); // Import the authentication middleware
const videoService = require('../services/videoService');
const upload = require('../config/multer'); // Import Multer configuration
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const router = express.Router();

// Get paginated video feed
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Parse pagination parameters
    const videos = await videoService.getFeed(page, limit);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user', authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const videos = await videoService.getUserVideos(userId);
      res.json(videos);
    } catch (error) {
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

module.exports = router;