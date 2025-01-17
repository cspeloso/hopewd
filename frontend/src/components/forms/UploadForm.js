import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuBar from '../layout/MenuBar';
import CustomAlert from '../alerts/CustomAlert';
import '../../css/UploadForm.css';
import '../../assets/styles/index.css';

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
      setAlert({
        title: 'Error',
        message: 'Please select a file to upload!',
        onClose: () => setAlert(null),
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/videos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setAlert({
        title: 'Upload Successful',
        message: 'Your video has been uploaded successfully!',
        onClose: () => {
          setAlert(null);
          setTitle(''); // Clear form fields
          setFile(null);
        },
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
      <div className="upload-container">
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