import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { formatDate, formatNumber } from './utils';

const VideoCard = ({ video, isCurrent }) => {
  const videoRef = useRef();
  const [likeCount, setLikeCount] = useState(Number(video.like_count)); // Ensure likeCount is a number
  const [liked, setLiked] = useState(video.liked_by_user); // Initialize from backend

  const videoUrl = `http://localhost:5001${video.url}`;

  useEffect(() => {
    if (isCurrent) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isCurrent]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token'); // Get JWT from localStorage
      const res = await axios.post(
        `http://localhost:5001/api/videos/${video.id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLiked(res.data.liked); // Update the liked state
      setLikeCount((prev) => (res.data.liked ? prev + 1 : prev - 1)); // Increment or decrement as a number
    } catch (error) {
      console.error('Error liking video:', error);
      alert('Failed to like the video.');
    }
  };

  return (
    <div className="video-card">
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      >
        Your browser does not support the video tag.
      </video>
      <div className="video-likes-comments-container">
        <div className="video-like-count" onClick={handleLike}>
          <i className={`fa-solid fa-heart ${liked ? 'liked' : 'not-liked'}`}></i>
          <p>{formatNumber(likeCount)}</p>
        </div>
        <div className="video-comment-count">
          <i className="fa-solid fa-comment-dots"></i>
          <p>{formatNumber(video.comment_count)}</p>
        </div>
      </div>
      <div className="video-info-container">
        <div className="video-uploader-time-container">
          <h3>{video.uploader}</h3>
          <i className="fa-solid fa-circle"></i>
          <h4>{formatDate(video.created_at)}</h4>
        </div>
        <p>{video.title}</p>
      </div>
    </div>
  );
};

export default VideoCard;