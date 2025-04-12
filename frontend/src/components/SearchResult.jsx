// File: src/components/SearchResult.jsx
import React, { useEffect, useState } from "react";
import './SearchResult.css';

const SearchResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="search-results">
      {results.length > 0 ? (
        results.map((result, index) => (
          <div key={index} className="result-card">
            <h3>{result.title}</h3>
            <p>{result.description}</p>
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResult;