import React from 'react';
import { useNotification } from '../../../context/NotificationContext.jsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export default function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="toast-icon success" size={20} />,
          error: <AlertCircle className="toast-icon error" size={20} />,
          info: <Info className="toast-icon info" size={20} />,
        };

        return (
          <div key={toast.id} className={`toast toast--${toast.type} glass`}>
            <div className="toast-icon-wrap">{icons[toast.type] || icons.info}</div>
            <div className="toast-text">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-msg">{toast.message}</div>
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
