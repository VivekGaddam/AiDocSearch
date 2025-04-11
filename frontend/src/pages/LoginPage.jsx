// File: src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you would authenticate with your backend
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });
      // const data = await response.json();
      
      // Mock successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if demo credentials were used
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        const userData = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          theme: 'light',
          notificationsEnabled: true
        };
        const token = 'demo-jwt-token';
        
        onLogin(userData, token);
      } else {
        setError('Invalid email or password. Try demo@example.com / password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="app-logo">DocuSearch</h1>
          <p className="app-description">
            Search your documents using natural language
          </p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Log In</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <FaSignInAlt />
                <span>Log In</span>
              </>
            )}
          </button>
          
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;