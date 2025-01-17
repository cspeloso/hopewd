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
const getFeed = async (page = 1, limit = 10, userId = null) => {
  const offset = (page - 1) * limit;

  console.log('Fetching feed for userId:', userId || 'Guest'); // Debug log

  const result = await db.query(
    `
    SELECT v.id, v.title, v.url, v.thumbnail, v.created_at, u.username AS uploader,
           (SELECT COUNT(*) FROM likes WHERE video_id = v.id) AS like_count,
           (SELECT COUNT(*) FROM comments WHERE video_id = v.id) AS comment_count,
           CASE
             WHEN $3::INTEGER IS NULL THEN false
             ELSE (SELECT COUNT(*) > 0 FROM likes WHERE video_id = v.id AND user_id = $3::INTEGER)
           END AS liked_by_user
    FROM videos v
    JOIN users u ON v.user_id = u.id
    ORDER BY v.created_at DESC
    LIMIT $1 OFFSET $2
    `,
    [limit, offset, userId]
  );

  console.log('Fetched videos:', result.rows); // Debug log
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

const getUserDetails = async (userId) => {
  const result = await db.query('SELECT username FROM users WHERE id = $1', [userId]);
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  return result.rows[0];
};

const getUserVideos = async (userId) => {
  const result = await db.query(
    'SELECT * FROM videos WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

const likeVideo = async (videoId, userId) => {
  // Check if the user already liked the video
  const existingLike = await db.query(
    'SELECT * FROM likes WHERE video_id = $1 AND user_id = $2',
    [videoId, userId]
  );

  if (existingLike.rows.length > 0) {
    // Unlike the video
    await db.query('DELETE FROM likes WHERE video_id = $1 AND user_id = $2', [
      videoId,
      userId,
    ]);
    return { liked: false };
  }

  // Like the video
  await db.query('INSERT INTO likes (video_id, user_id) VALUES ($1, $2)', [
    videoId,
    userId,
  ]);
  return { liked: true };
};

module.exports = {
  getAllVideos,
  uploadVideo,
  getFeed,
  searchVideos,
  getUserVideos,
  likeVideo,
  getUserDetails
};