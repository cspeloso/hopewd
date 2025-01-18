import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from './VideoCard';

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve JWT from localStorage if available
      const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Include Authorization header only if token exists

      // Log the API URL for debugging
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/videos?page=1&limit=10`;
      console.log('API URL:', apiUrl);

      const res = await axios.get(apiUrl, {
        headers,
      });

      // Log the response status and data
      console.log('Response status:', res.status);
      console.log('Response data:', res.data);

      setVideos(res.data);
    } catch (error) {
      // Log the error details
      console.error('Error fetching videos:', error.message);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight } = event.target;
    const nextIndex = Math.round(scrollTop / clientHeight);
    if (nextIndex !== currentVideoIndex) {
      setCurrentVideoIndex(nextIndex);
    }
  };

  return (
    <div className="video-feed" onScroll={handleScroll}>
      {videos.length === 0 && <h3>Loading...</h3>}
      {videos.map((video, index) => (
        <div
          key={video.id}
          className={`video-container ${index === currentVideoIndex ? 'active' : ''}`}
        >
          <VideoCard video={video} isCurrent={index === currentVideoIndex} />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;