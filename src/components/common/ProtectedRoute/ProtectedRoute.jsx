import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#D4A853',
        fontSize: '1.2rem',
        fontWeight: 'bold',
      }}>
        جاري التحقق من الصلاحيات... 🌹
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated visitors to login page and remember where they wanted to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
