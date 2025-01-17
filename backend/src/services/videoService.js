const db = require('../config/db');

// Fetch all videos
const getAllVideos = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const result = await db.query(
    'SELECT * FROM videos ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
};

// Upload a video
const uploadVideo = async ({ title, url, thumbnail, userId }) => {
    const result = await db.query(
      'INSERT INTO videos (title, url, thumbnail, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, url, thumbnail, userId]
    );
    return result.rows[0];
  };
  

// Get paginated feed
const getFeed = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const result = await db.query(
      `
      SELECT v.id, v.title, v.url, v.thumbnail, v.created_at, u.username AS uploader,
             (SELECT COUNT(*) FROM likes WHERE video_id = v.id) AS like_count,
             (SELECT COUNT(*) FROM comments WHERE video_id = v.id) AS comment_count
      FROM videos v
      JOIN users u ON v.user_id = u.id
      ORDER BY v.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );
    return result.rows;
  };
// Search videos
const searchVideos = async (query) => {
  const result = await db.query(
    'SELECT * FROM videos WHERE title ILIKE $1 ORDER BY created_at DESC',
    [`%${query}%`]
  );
  return result.rows;
};

const getUserVideos = async (userId) => {
    const result = await db.query(
      'SELECT * FROM videos WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  };
  

module.exports = {
  getAllVideos,
  uploadVideo,
  getFeed,
  searchVideos,
  getUserVideos
};