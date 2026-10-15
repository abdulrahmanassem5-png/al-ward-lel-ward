import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  return (
    <div className={`loading-spinner-wrapper loading-spinner--${size}`}>
      <div className="spinner-ring">
        <span className="spinner-petal petal-1" />
        <span className="spinner-petal petal-2" />
        <span className="spinner-petal petal-3" />
        <span className="spinner-petal petal-4" />
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
