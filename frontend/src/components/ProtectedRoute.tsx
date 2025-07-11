import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user role
    const roleRedirects = {
      ADMIN: '/admin',
      INSTRUCTOR: '/instructor',
      STUDENT: '/dashboard'
    };
    return <Navigate to={roleRedirects[user?.role || 'STUDENT']} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
