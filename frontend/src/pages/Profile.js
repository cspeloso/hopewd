import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuBar from '../components/MenuBar'; // Import Menu Bar
import '../css/profile.css'; // Add CSS for styling the profile page
import '../css/index.css'; // Add CSS for styling the profile page
import defaultProfilePic from '../images/default-profile-pic.jpg'

const Profile = () => {
    const [username, setUsername] = useState(''); // Store the user's username
    const [videos, setVideos] = useState([]); // Store the user's uploaded videos

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from localStorage
                const res = await axios.get('http://localhost:5001/api/videos/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsername(res.data.username); // Assuming the username is part of the response
                setVideos(res.data.videos); // Assuming the videos are part of the response
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <div className="profile">
            <div class='inner-profile-container'>
                <div className="profile-header">
                    <div class='profile-image'>
                        <img src={defaultProfilePic} class='profile-header-pic' />
                    </div>
                    <h1>@{username}</h1> {/* Display the username */}
                </div>
                <div className="video-grid">
                    {videos.map((video) => (
                        <div key={video.id} className="video-grid-item">
                            <img
                                src={`http://localhost:5001${video.thumbnail}`} // Use the video's thumbnail
                                alt={video.title}
                                className="video-thumbnail"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <MenuBar />
        </div>
    );
};

export default Profile;