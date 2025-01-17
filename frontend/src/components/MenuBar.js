import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MenuBar.css'

const MenuBar = () => {
    const navigate = useNavigate();

    return (
        <div className="menu-bar">
            <button onClick={() => navigate('/')} className="menu-button">
                <i className="fa-solid fa-house"></i> Home
            </button>
            <button onClick={() => navigate('/upload')} className="menu-button menu-add-button">
                <i className="fa-solid fa-plus"></i>
            </button>
            <button onClick={() => navigate('/profile')} className="menu-button">
                <i className="fa-solid fa-user"></i> Profile
            </button>
        </div>
    );
};

export default MenuBar;