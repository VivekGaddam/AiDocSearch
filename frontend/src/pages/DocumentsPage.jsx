// File: src/pages/DocumentsPage.jsx
import React, { useState, useEffect } from 'react';
import DocumentCard from '../components/DocumentCard';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import './DocumentsPage.css';

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(null);

  useEffect(() => {
    // Fetch documents from API in a real app
    // In this example, we'll use mock data
    setTimeout(() => {
      const mockDocuments = [
        {
          id: '1',
          name: 'Q4_Financial_Report.pdf',
          uploadDate: '2023-12-15T10:30:00Z',
          size: 2457600, // 2.4 MB
          type: 'application/pdf'
        },
        {
          id: '2',
          name: 'Market_Entry_Strategy.docx',
          uploadDate: '2023-11-22T14:15:00Z',
          size: 1843200, // 1.8 MB
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        },
        {
          id: '3',
          name: 'Employee_Handbook_2023.pdf',
          uploadDate: '2023-10-05T09:45:00Z',
          size: 3276800, // 3.2 MB
          type: 'application/pdf'
        },
        {
          id: '4',
          name: 'Product_Roadmap_2024.pptx',
          uploadDate: '2023-12-20T16:30:00Z',
          size: 4915200, // 4.8 MB
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        }
      ];
      setDocuments(mockDocuments);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingFile(file);
      // In a real app, you'd upload the file to your server here
      setTimeout(() => {
        const newDocument = {
          id: Date.now().toString(),
          name: file.name,
          uploadDate: new Date().toISOString(),
          size: file.size,
          type: file.type
        };
        setDocuments([newDocument, ...documents]);
        setUploadingFile(null);
        e.target.value = null; // Reset input
      }, 2000);
    }
  };

  const handleDelete = (id) => {
    // In a real app, you'd call an API to delete the document
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleView = (id) => {
    // In a real app, this would open the document
    console.log(`Viewing document ${id}`);
  };

  return (
    <div className="documents-page">
      <div className="documents-header">
        <h1>My Documents</h1>
        <div className="upload-container">
          <input
            type="file"
            id="file-upload"
            className="file-input"
            onChange={handleFileChange}
            disabled={!!uploadingFile}
          />
          <label htmlFor="file-upload" className="upload-button">
            {uploadingFile ? (
              <>
                <FaSpinner className="spinner" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FaUpload />
                <span>Upload Document</span>
              </>
            )}
          </label>
          {uploadingFile && (
            <div className="upload-progress">
              <span className="file-name">{uploadingFile.name}</span>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="documents-list">
        {isLoading ? (
          <div className="loading-container">
            <FaSpinner className="spinner large" />
            <p>Loading your documents...</p>
          </div>
        ) : documents.length > 0 ? (
          documents.map(document => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))
        ) : (
          <div className="no-documents">
            <h2>No documents found</h2>
            <p>Upload your first document to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentsPage;