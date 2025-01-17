import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuBar from '../components/MenuBar';
import CustomAlert from '../components/CustomAlert';
import '../css/UploadForm.css';
import '../css/index.css';

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setAlert({
        title: 'Sign In Required',
        message: 'Please sign in to upload a video. Redirecting...',
        showSpinner: true,
      });

      setTimeout(() => {
          window.location.href = '/profile';
      }, 1500);
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5001/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setAlert({
        title: 'Upload Successful',
        message: 'Your video has been uploaded.',
        onClose: () => setAlert(null),
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      setAlert({
        title: 'Upload Failed',
        message: 'Failed to upload video. Please try again.',
        onClose: () => setAlert(null),
      });
    }
  };

  return (
    <div className="upload-page">
      <div class='upload-container'>
        <form onSubmit={handleUpload} className="upload-form">
          <h2>Upload a Video</h2>
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <button type="submit">Upload</button>
        </form>
      </div>
      <MenuBar />
      {alert && <CustomAlert {...alert} />}
    </div>
  );
};

export default UploadForm;