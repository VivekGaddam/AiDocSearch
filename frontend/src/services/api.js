import axios from 'axios';

// Axios instance for your backend
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'aidocsearch'; // Replace with your upload preset
const CLOUDINARY_CLOUD_NAME = 'dqiwbnayj'; // Replace with your cloud name
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

// Local storage key for document tracking
const DOCUMENTS_STORAGE_KEY = 'uploaded_documents';

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Upload document to Cloudinary and then notify your backend
export const uploadDocument = async (file) => {
  try {
    // First upload to Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    cloudinaryFormData.append('resource_type', 'raw'); // For PDF files
    
    const cloudinaryResponse = await axios.post(CLOUDINARY_API_URL, cloudinaryFormData);
    
    if (!cloudinaryResponse.data || !cloudinaryResponse.data.secure_url) {
      throw new Error('Failed to upload to Cloudinary');
    }
    
    // Create document metadata
    const documentMetadata = {
      id: cloudinaryResponse.data.public_id,
      name: file.name,
      url: cloudinaryResponse.data.secure_url,
      uploadedAt: new Date().getTime(),
      size: file.size,
      format: cloudinaryResponse.data.format || 'pdf'
    };
    
    // Save document metadata to local storage
    saveDocumentToStorage(documentMetadata);
    
    // Option 1: Just return the Cloudinary response
    // return { success: true, message: 'Document uploaded successfully!', fileData: documentMetadata };
    
    // Option 2: Also notify your backend about the uploaded file
    // This lets your backend process the file (e.g., for AI analysis)
    const backendFormData = new FormData();
    backendFormData.append('fileUrl', documentMetadata.url);
    backendFormData.append('fileName', documentMetadata.name);
    backendFormData.append('fileId', documentMetadata.id);
    
    const backendResponse = await api.post('/upload', backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return backendResponse.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

// Get all documents from local storage
export const getDocuments = async () => {
  try {
    return getDocumentsFromStorage();
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

// Delete a document from Cloudinary and local storage
export const deleteDocument = async (documentId) => {
  try {
    // Option 1: Just remove from local storage
    removeDocumentFromStorage(documentId);
    
    // Option 2: Also notify your backend about deletion
    // await api.delete(`/documents/${documentId}`);
    
    return { success: true, message: 'Document deleted successfully!' };
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Helper function to save document to local storage
const saveDocumentToStorage = (document) => {
  const documents = getDocumentsFromStorage();
  documents.unshift(document); // Add new document at the beginning
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
};

// Helper function to get documents from local storage
const getDocumentsFromStorage = () => {
  const storedDocuments = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
  return storedDocuments ? JSON.parse(storedDocuments) : [];
};

// Helper function to remove document from local storage
const removeDocumentFromStorage = (documentId) => {
  const documents = getDocumentsFromStorage();
  const updatedDocuments = documents.filter(doc => doc.id !== documentId);
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updatedDocuments));
};

// Existing API functions
export const queryDocuments = async (query) => {
  try {
    const response = await api.post('/query', { query });
    return response.data;
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};

export const testQuery = async (query) => {
  try {
    const response = await api.post(`/testquery/${query}`);
    return response.data;
  } catch (error) {
    console.error('Error in test query:', error);
    throw error;
  }
};

export const checkServerStatus = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error checking server status:', error);
    throw error;
  }
};

export default api;     