import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Trang đăng nhập/đăng ký: người đã đăng nhập được đưa về trang định vào (mặc định trang chủ) */
export default function GuestRoute() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (!initializing && isAuthenticated) return <Navigate to={location.state?.from?.pathname ?? '/'} replace />;
  return <Outlet />;
}
