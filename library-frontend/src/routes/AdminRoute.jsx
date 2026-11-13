import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/StateViews';

/**
 * Chặn giao diện Admin với người không phải ADMIN.
 * LƯU Ý: đây chỉ là lớp bảo vệ giao diện. Bảo vệ thật nằm ở backend —
 * mọi API /admin, POST/PUT/DELETE sách... đều phải kiểm tra quyền ADMIN từ JWT.
 */
export default function AdminRoute() {
  const { isAuthenticated, isAdmin, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isAdmin) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Bạn không có quyền truy cập"
        description="Khu vực này chỉ dành cho quản trị viên thư viện."
      />
    );
  }
  return <Outlet />;
}
