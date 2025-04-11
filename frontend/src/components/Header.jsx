// File: src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaSearch, FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';
import './Header.css';

function Header({ user, onLogout, toggleSidebar }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <Link to="/" className="logo">
          <span className="logo-text">DocuSearch</span>
        </Link>
      </div>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Quick search across documents..."
        />
      </div>
      <div className="header-right">
        <div className="user-menu-container">
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <FaUserCircle className="user-avatar" />
          </div>
          <div className="user-menu">
            <Link to="/settings" className="user-menu-item">
              <FaCog />
              <span>Settings</span>
            </Link>
            <button onClick={onLogout} className="user-menu-item logout">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;