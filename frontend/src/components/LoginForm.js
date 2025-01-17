import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../components/CustomAlert';
import '../css/LoginForm.css'; // Add CSS for the form styling
import '../css/index.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null); // State for managing alerts
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5001/api/users/login', {
        username,
        password,
      });
      const token = res.data.token;
      localStorage.setItem('token', token); // Store JWT in localStorage
      setAlert({
        title: "You're in!",
        message: 'Redirecting...',
        showSpinner: true, // Show spinner
      });
      setTimeout(() => navigate('/'), 1500); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error logging in:', error);
      setAlert({
        title: 'Error',
        message: 'Login failed. Please try again.',
        onClose: () => setAlert(null), // Clear alert on close
      });
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Welcome Back</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      {alert && <CustomAlert {...alert} />} {/* Render alert if set */}
    </div>
  );
};

export default LoginForm;