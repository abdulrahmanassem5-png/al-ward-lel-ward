import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

let toastId = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'info', duration = 3500 }) => {
    const id = ++toastId;
    const newToast = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message, title = '') => {
    showToast({ title, message, type: 'success' });
  }, [showToast]);

  const error = useCallback((message, title = '') => {
    showToast({ title, message, type: 'error' });
  }, [showToast]);

  const info = useCallback((message, title = '') => {
    showToast({ title, message, type: 'info' });
  }, [showToast]);

  return (
    <NotificationContext.Provider
      value={{
        showToast,
        success,
        error,
        info,
        showSuccess: success,
        showError: error,
        showInfo: info,
        toasts,
        removeToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
