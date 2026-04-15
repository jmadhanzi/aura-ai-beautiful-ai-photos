import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePro?: boolean;
}

const ProtectedRoute = ({ children, requirePro = false }: ProtectedRouteProps) => {
  const { currentUser, isProUser } = useAppStore();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requirePro && !isProUser) {
    return <Navigate to="/paywall/1" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
