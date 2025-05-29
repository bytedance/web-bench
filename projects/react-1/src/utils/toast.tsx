import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 2000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 2000,
      fontSize: '12px'
    }}>
      {message}
    </div>
  );
};

let toastContainer: HTMLDivElement | null = null;
let currentToast: { unmount: () => void } | null = null;

export const toast = (message: string, duration = 2000) => {
  // Remove existing toast if present
  if (currentToast) {
    currentToast.unmount();
    currentToast = null;
  }

  // Create container if it doesn't exist
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const handleClose = () => {
    if (toastContainer && currentToast) {
      currentToast.unmount();
      currentToast = null;
    }
  };

  // Render the toast
  const toastRoot = ReactDOM.createRoot(toastContainer);
  toastRoot.render(
    <Toast message={message} duration={duration} onClose={handleClose} />
  );

  currentToast = {
    unmount: () => {
      toastRoot.unmount();
    }
  };
};