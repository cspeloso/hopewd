import React from 'react';
import VideoFeed from '../components/video/videofeed.js'; // Import the VideoFeed component
import MenuBar from '../components/layout/MenuBar.js' // Import Menu Bar

const Home = () => {

  return (
    <div className="home">
      <VideoFeed /> {/* Embed the video feed */}
      <MenuBar /> {/*Embed the menu bar */}
    </div>
  );
};

export default Home;