import React from 'react';
import VideoFeed from '../components/videofeed.js'; // Import the VideoFeed component

const Home = () => {
  return (
    <div className="home">
      <VideoFeed /> {/* Embed the video feed */}
    </div>
  );
};

export default Home;