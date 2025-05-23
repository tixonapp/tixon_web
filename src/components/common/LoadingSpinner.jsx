import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner">
        <div className="spinner-inner"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 