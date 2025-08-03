import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if the current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/calendar') ||
    location.pathname.startsWith('/tasks') ||
    location.pathname.startsWith('/settings') ||
    location.pathname.startsWith('/ai-assistant') ||
    location.pathname.startsWith('/goals');

  if (!isAuthenticated) {
    // Only include warning message for dashboard routes
    return <Navigate 
      to="/login" 
      state={{ 
        from: location.pathname,
        message: isDashboardRoute ? 'Bu sayfaya erişmek için giriş yapmalısınız.' : undefined 
      }} 
      replace 
    />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 