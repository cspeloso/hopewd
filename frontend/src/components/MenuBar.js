import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const MenuBar = () => {
    const navigate = useNavigate(); // Initialize navigate function

    return (
        <div class='menu-bar'>
            <button onClick={() => navigate('/')} className="menu-button">
                <i className="fa-solid fa-house"></i> Home
            </button>
            <button onClick={() => navigate('/profile')} className="menu-button">
                <i className="fa-solid fa-user"></i> Profile
            </button>
        </div>
    );
}

export default MenuBar;