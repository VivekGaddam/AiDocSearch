// File: src/components/SearchResult.jsx
import React from 'react';
import { FaFileAlt, FaExternalLinkAlt } from 'react-icons/fa';
import './SearchResult.css';

function SearchResult({ result }) {
  const { title, content, documentName, score, highlight } = result;
  
  return (
    <div className="search-result">
      <div className="result-header">
        <div className="result-icon">
          <FaFileAlt />
        </div>
        <h3 className="result-title">{title}</h3>
        <div className="result-score">
          {Math.round(score * 100)}% match
        </div>
      </div>
      <div className="result-content">
        <p dangerouslySetInnerHTML={{ __html: highlight || content.substring(0, 200) + '...' }}></p>
      </div>
      <div className="result-footer">
        <span className="document-name">{documentName}</span>
        <button className="view-button">
          <FaExternalLinkAlt />
          <span>View Document</span>
        </button>
      </div>
    </div>
  );
}

export default SearchResult;