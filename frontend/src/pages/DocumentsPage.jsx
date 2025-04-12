import React, { useState, useEffect } from 'react';
import { uploadDocument, getDocuments, deleteDocument } from '../services/api';
import './DocumentsPage.css';

const DocumentsPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Function to fetch documents from storage
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setMessage('Failed to load documents');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setMessage('');
      setIsError(false);
    } else if (file) {
      setSelectedFile(null);
      setMessage('Please select a valid PDF file.');
      setIsError(true);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || uploading) return;
   
    setUploading(true);
    setMessage('Uploading...');
    setIsError(false);
   
    try {
      const response = await uploadDocument(selectedFile);
      setMessage(response.message || 'Document uploaded successfully!');
      setIsError(false);
      setSelectedFile(null);
     
      // Reset file input
      document.getElementById('file-upload').value = '';
      
      // Refresh the documents list after successful upload
      fetchDocuments();
     
    } catch (error) {
      setMessage('Failed to upload document. Please try again.');
      setIsError(true);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      await deleteDocument(documentId);
      fetchDocuments();
      setMessage('Document deleted successfully');
      setIsError(false);
    } catch (error) {
      setMessage('Failed to delete document');
      setIsError(true);
      console.error('Delete error:', error);
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="documents-page">
      <h1>Upload Documents</h1>
      <p className="description">
        Upload PDF documents to query their contents using AI.
      </p>
     
      <div className="upload-container">
        <form onSubmit={handleUpload} className="upload-form">
          <div className="file-input-container">
            <label htmlFor="file-upload" className="file-input-label">
              {selectedFile ? selectedFile.name : 'Choose PDF File'}
            </label>
            <input
              type="file"
              id="file-upload"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
         
          <button
            type="submit"
            className="upload-button"
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>
       
        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
     
      <div className="upload-tips">
        <h3>Tips:</h3>
        <ul>
          <li>Upload text-based PDF documents</li>
          <li>Make sure PDF is not password protected</li>
        </ul>
      </div>

      {/* Document List Section */}
      <div className="documents-list-container">
        <h2>Your Documents</h2>
        
        {loading ? (
          <div className="loading">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="no-documents">No documents uploaded yet</div>
        ) : (
          <div className="documents-list">
            {documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-icon">📄</div>
                <div className="document-details">
                  <h3 className="document-name">{doc.name}</h3>
                  <p className="document-date">Uploaded: {formatDate(doc.uploadedAt)}</p>
                  {doc.size && <p className="document-size">Size: {formatFileSize(doc.size)}</p>}
                </div>
                <div className="document-actions">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="document-link">
                    View
                  </a>
                  <button 
                    onClick={() => handleDelete(doc.id)} 
                    className="document-delete"
                    aria-label="Delete document"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;