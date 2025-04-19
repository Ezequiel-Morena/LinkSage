// src/components/LoadingSpinner.tsx
import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

export default LoadingSpinner;