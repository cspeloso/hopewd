import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MenuBar from '../components/layout/MenuBar';
import LoginForm from '../components/forms/LoginForm';
import CustomAlert from '../components/alerts/CustomAlert';
import '../css/profile.css';
import '../assets/styles/index.css';
import defaultProfilePic from '../assets/images/default-profile-pic.jpg';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [videos, setVideos] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [showLogoutAlert, setShowLogoutAlert] = useState(false); // Manage logout alert visibility
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false); // User is not authenticated
            return;
        }

        const fetchProfileData = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/videos/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsername(res.data.username);
                setVideos(res.data.videos);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setIsAuthenticated(false); // User is not authenticated
            }
        };

        fetchProfileData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/'); // Redirect to homepage or login page after logout
    };

    return (
        <div className="profile">
            {isAuthenticated ? (
                <div className="inner-profile-container">
                    <div className="profile-header">
                        <div className="profile-image">
                            <img src={defaultProfilePic} className="profile-header-pic" alt="Profile" />
                        </div>
                        <h1>@{username}</h1>
                        <button
                            className="logout-button"
                            onClick={() => setShowLogoutAlert(true)} // Show alert on click
                        >
                            Log Out
                        </button>
                    </div>
                    <div className="video-grid">
                        {videos.map((video) => (
                            <div key={video.id} className="video-grid-item">
                                <img
                                    src={`http://localhost:5001${video.thumbnail}`}
                                    alt={video.title}
                                    className="video-thumbnail"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <LoginForm />
            )}
            <MenuBar /> {/* Always show the MenuBar */}
            {showLogoutAlert && (
                <CustomAlert
                    title="Log Out"
                    message="Are you sure you want to log out?"
                    onClose={() => setShowLogoutAlert(false)} // Close the alert
                    onConfirm={handleLogout} // Log out on confirmation
                    confirmText="Yes"
                    cancelText="No"
                />
            )}
        </div>
    );
};

export default Profile;