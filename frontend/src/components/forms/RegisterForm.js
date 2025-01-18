import React, { useState } from 'react';
import axios from 'axios';
import CustomAlert from '../alerts/CustomAlert'; // Adjust the path to your alert component
import '../../css/RegisterForm.css'; // Add CSS for styling
import '../../assets/styles/index.css';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        username,
        password,
      });
      setAlert({
        title: 'Success',
        message: 'Registration successful! Redirecting...',
        showSpinner: true,
      });
      console.log('Registration response:', res.data);
      setTimeout(() => setAlert(null), 1500); // Clear alert after 1.5 seconds
    } catch (error) {
      console.error('Error registering user:', error);
      setAlert({
        title: 'Error',
        message: 'Registration failed. Please try again.',
        onClose: () => setAlert(null), // Close alert manually
      });
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Create Your Account</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
          required
        />
        <button type="submit" className="register-button">Register</button>
      </form>
      {alert && <CustomAlert {...alert} />}
    </div>
  );
};

export default RegisterForm;