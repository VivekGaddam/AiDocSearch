// File: src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout, toggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <span className="menu-icon">≡</span>
        </button>
        <Link to="/" className="logo">DocQuery AI</Link>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <span className="username">{user?.username || 'User'}</span>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
