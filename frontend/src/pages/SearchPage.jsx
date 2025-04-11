// File: src/pages/SearchPage.jsx
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

    try {
      // In a real app, you'd fetch from your API
      // const response = await fetch('/api/search', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ query }),
      // });
      // const data = await response.json();
      
      // Mock response for demo
      setTimeout(() => {
        const mockResults = [
          {
            id: '1',
            title: 'Financial Report 2023',
            content: 'This document contains financial analysis for Q1 through Q4 of fiscal year 2023. Revenue increased by 12% year over year.',
            documentName: 'Q4_Financial_Report.pdf',
            score: 0.95,
            highlight: 'This document contains <mark>financial analysis</mark> for Q1 through Q4 of fiscal year 2023. Revenue increased by 12% year over year.'
          },
          {
            id: '2',
            title: 'Project Proposal: New Market Entry',
            content: 'Strategic analysis of entering the Southeast Asian market. Key considerations include local regulations, competition landscape, and economic factors.',
            documentName: 'Market_Entry_Strategy.docx',
            score: 0.82,
            highlight: 'Strategic <mark>analysis</mark> of entering the Southeast Asian market. Key considerations include local regulations, competition landscape, and economic factors.'
          },
          {
            id: '3',
            title: 'Employee Handbook 2023',
            content: 'Updated policies and procedures for all employees. Includes benefits, code of conduct, and important contact information.',
            documentName: 'Employee_Handbook_2023.pdf',
            score: 0.75,
            highlight: 'Updated policies and procedures for all employees. Includes benefits, code of conduct, and important contact information.'
          }
        ];
        setResults(mockResults);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Search failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Document Search</h1>
        <p>Ask questions about your documents in natural language</p>
      </div>
      
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your documents..."
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
              <h2>Search Results</h2>
              <div className="results-list">
                {results.map(result => (
                  <SearchResult key={result.id} result={result} />
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <h2>No results found</h2>
              <p>Try using different keywords or phrases.</p>
            </div>
          )
        ) : (
          <div className="search-placeholder">
            <h2>Start searching</h2>
            <p>Enter a question or keywords to search through your documents.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;