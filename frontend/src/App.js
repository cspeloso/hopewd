import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Upload from './pages/Upload';
import Profile from './pages/Profile';

import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import UploadForm from './components/UploadForm';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/upload" element={<Upload />} /> */}

        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/upload" element={<UploadForm />} />

        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
};

export default App;