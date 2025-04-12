// File: src/pages/SearchPage.jsx
import React, { useState } from 'react';
import { queryDocuments } from '../services/api';
import './SearchPage.css';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult('');
    
    try {
      console.log('Sending query:', query);
      const response = await queryDocuments(query);
      console.log('Search response:', response);
      
      // Handle the response based on your API's structure
      if (response.response) {
        setResult(response.response);
      } else if (response.fallback_response) {
        setResult(response.fallback_response);
        setError('Using fallback response due to an issue with the query.');
      } else {
        setError('Received empty response from server.');
      }
    } catch (err) {
      console.error('Search error:', err);
      
      let errorMessage = 'Failed to search. Please try again later.';
      if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check if the server is running.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h1>Ask Your Documents</h1>
        <p className="description">
          Ask questions about your uploaded documents and get answers powered by AI.
        </p>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask something about your documents..."
              className="search-input"
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={loading || !query.trim()}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}
        
        {result && (
          <div className="search-result">
            <h2>Answer</h2>
            <div className="result-content">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;