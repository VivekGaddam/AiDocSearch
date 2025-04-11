// File: src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaSearch, FaFileAlt, FaCog, FaPlus } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaSearch />
              <span>Search</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/documents" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaFileAlt />
              <span>Documents</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaCog />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="upload-button-container">
        <button className="upload-button">
          <FaPlus />
          <span>Upload Document</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;