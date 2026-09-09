import { Navigate } from 'react-router-dom';
import useAdminAuth from './useAdminAuth';
import AdminDashboard from './AdminDashboard';

const AdminRoute = () => {
  const { status, admin } = useAdminAuth();

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-dim)] text-sm">
        Checking session…
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminDashboard admin={admin} />;
};

export default AdminRoute;
