// File: src/components/DocumentCard.jsx
import React from 'react';
import { FaFileAlt, FaTrash, FaEye } from 'react-icons/fa';
import './DocumentCard.css';

function DocumentCard({ document, onDelete, onView }) {
  const { id, name, uploadDate, size } = document;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="document-card">
      <div className="document-icon">
        <FaFileAlt />
      </div>
      <div className="document-info">
        <h3 className="document-name">{name}</h3>
        <div className="document-meta">
          <span>Uploaded: {formatDate(uploadDate)}</span>
          <span className="document-size">{formatSize(size)}</span>
        </div>
      </div>
      <div className="document-actions">
        <button className="document-action view" onClick={() => onView(id)}>
          <FaEye />
        </button>
        <button className="document-action delete" onClick={() => onDelete(id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default DocumentCard;