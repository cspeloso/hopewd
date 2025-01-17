import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

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
      const res = await axios.post('http://localhost:5001/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Video uploaded successfully!');
      console.log('Upload response:', res.data);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload a Video</h1>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Enter video title"
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
  );
};

export default Upload;