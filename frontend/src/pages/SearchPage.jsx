import React, { useState } from 'react';
import SearchResult from '../components/SearchResult';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import './SearchPage.css';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Ask Your Documents</h1>
        <p>Use natural language to find relevant information inside your files</p>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. What is the refund policy?"
            className="search-input"
          />
          <button type="submit" className="search-button">
            {isLoading ? <FaSpinner className="spinner" /> : <FaSearch />}
          </button>
        </div>
      </form>

      <div className="search-results">
        {isLoading ? (
          <div className="loading-container">
            <FaSpinner className="spinner large" />
            <p>Searching your documents...</p>
          </div>
        ) : hasSearched ? (
          results.length > 0 ? (
            <>
              <h2>Relevant Matches</h2>
              <div className="results-list">
                {results.map(result => (
                  <SearchResult key={result.id} result={result} />
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <h2>No results found</h2>
              <p>Try rephrasing your question or using different keywords.</p>
            </div>
          )
        ) : (
          <div className="search-placeholder">
            <h2>Start with a question</h2>
            <p>Example: “What are the employee leave policies?”</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
