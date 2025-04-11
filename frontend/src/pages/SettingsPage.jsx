// File: src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';
import './SettingsPage.css';

function SettingsPage({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    apiKey: user?.apiKey || '',
    theme: user?.theme || 'light',
    notificationsEnabled: user?.notificationsEnabled !== false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // In a real app, you'd save to your API
      // const response = await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // const data = await response.json();
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Profile Settings</h2>
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>API Settings</h2>
          
          <div className="form-group">
            <label htmlFor="apiKey">API Key</label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
            />
            <small>Used for integrating with external services</small>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Preferences</h2>
          
          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select id="theme" name="theme" value={formData.theme} onChange={handleChange}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="notificationsEnabled"
              name="notificationsEnabled"
              checked={formData.notificationsEnabled}
              onChange={handleChange}
            />
            <label htmlFor="notificationsEnabled">Enable notifications</label>
          </div>
        </div>
        
        <div className="form-actions">
          {saveMessage && (
            <div className={`save-message ${saveMessage.type}`}>
              {saveMessage.text}
            </div>
          )}
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? (
              <>
                <FaSpinner className="spinner" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;