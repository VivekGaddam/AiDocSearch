// File: src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import SearchPage from './pages/SearchPage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="app">
            <div className="main-container">
              <Sidebar isOpen={sidebarOpen} />
              <main className={`content ${!sidebarOpen ? 'content-expanded' : ''}`}>
                <Routes>
                  <Route path="/" element={<SearchPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  {/* <Route path="/settings" element={<SettingsPage user={user} />} /> */}
                </Routes>
              </main>
            </div>
      </div>
    </Router>
  );
}

export default App;