import React, { useRef, useEffect } from 'react';

const VideoCard = ({ video, isCurrent }) => {
  const videoRef = useRef();

  // Dynamically add "http://localhost:5001" to the video URL
  const videoUrl = `http://localhost:5001${video.url}`;

  useEffect(() => {
    if (isCurrent) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isCurrent]);

  return (
    <div className="video-card">
      <video
        ref={videoRef}
        src={videoUrl} // Use the modified video URL
        muted
        loop
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      >
        Your browser does not support the video tag.
      </video>
      <div className="video-info">
        <h3>{video.title}</h3>
        <p>{video.like_count} Likes</p>
        <p>{video.comment_count} Comments</p>
      </div>
    </div>
  );
};

export default VideoCard;