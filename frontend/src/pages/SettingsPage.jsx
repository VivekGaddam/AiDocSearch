// File: src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { checkServerStatus } from '../services/api';
import './SettingsPage.css';

const SettingsPage = ({ user }) => {
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [statusColor, setStatusColor] = useState('gray');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkServerStatus();
        if (status && status.status === 'Ready') {
          setServerStatus('Online');
          setStatusColor('green');
        } else {
          setServerStatus('Offline');
          setStatusColor('red');
        }
      } catch (error) {
        setServerStatus('Offline');
        setStatusColor('red');
        console.error('Error checking server status:', error);
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      <div className="settings-container">
        <section className="user-section">
          <h2>User Information</h2>
          <div className="user-info">
            <div className="info-group">
              <label>Username:</label>
              <span>{user?.username || 'N/A'}</span>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <span>{user?.email || 'N/A'}</span>
            </div>
          </div>
        </section>

        <section className="system-section">
          <h2>System Status</h2>
          <div className="status-info">
            <div className="status-item">
              <span>API Server:</span>
              <span className={`status-badge ${statusColor}`}>{serverStatus}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;