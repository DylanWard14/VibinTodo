import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
