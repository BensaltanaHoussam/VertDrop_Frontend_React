import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard if they try to access unauthorized route
        const defaultRoute = user.role === 'ADMIN' || user.role === 'MANAGER'
            ? '/admin'
            : user.role === 'LIVREUR'
                ? '/livreur'
                : '/client';

        return <Navigate to={defaultRoute} replace />;
    }

    return <Outlet />;
};
