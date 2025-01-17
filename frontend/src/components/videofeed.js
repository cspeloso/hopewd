import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import VideoCard from './VideoCard';

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]); // Array of refs for video containers

  const fetchVideos = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/videos?page=1&limit=10');
      console.log('Fetched videos:', res.data);

      const updatedVideos = res.data.map((video) => ({
        ...video,
        url: `${video.url}`,
      }));

      setVideos(updatedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    // Scroll the current video into view
    if (videoRefs.current[currentVideoIndex]) {
      videoRefs.current[currentVideoIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [currentVideoIndex]);

  const handleScroll = (() => {
    let isScrolling = false; // Track if scrolling is already in progress
  
    return (e) => {
      if (isScrolling) return; // Skip if a scroll is already being processed
  
      isScrolling = true; // Mark scrolling as in progress
      const direction = e.deltaY > 0 ? 1 : -1; // Determine scroll direction
  
      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => {
          const newIndex = Math.max(0, Math.min(prevIndex + direction, videos.length - 1)); // Clamp index
          console.log('Previous Index:', prevIndex, 'New Index:', newIndex); // Debug log
          return newIndex;
        });
        isScrolling = false; // Allow next scroll after debounce ends
      }, 300); // Debounce interval (300ms)
    };
  })();

  return (
    <div
      className="video-feed"
      onWheel={handleScroll}
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {videos.length === 0 && <h3>Loading...</h3>}
      {videos.map((video, index) => (
        <div
          key={video.id}
          ref={(el) => (videoRefs.current[index] = el)} // Set ref for each video container
          className="video-container"
          style={{
            height: '100vh',
          }}
        >
          <VideoCard video={video} isCurrent={index === currentVideoIndex} />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;