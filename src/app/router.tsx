import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { Login } from '../features/auth/components/Login';
import { ProtectedRoute } from '../shared/layouts/ProtectedRoute';

// Placeholder components for routing (will be implemented in later epics)
const AdminDashboard = () => <div className="p-8">Admin Dashboard (Coming Soon)</div>;
const ClientDashboard = () => <div className="p-8">Client Dashboard (Coming Soon)</div>;
const LivreurDashboard = () => <div className="p-8">Livreur Dashboard (Coming Soon)</div>;

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/login" replace />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                // Protected Admin Routes
                element: <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />,
                children: [
                    {
                        path: 'admin',
                        element: <AdminDashboard />,
                    },
                ],
            },
            {
                // Protected Client Routes
                element: <ProtectedRoute allowedRoles={['CLIENT']} />,
                children: [
                    {
                        path: 'client',
                        element: <ClientDashboard />,
                    },
                ],
            },
            {
                // Protected Livreur Routes
                element: <ProtectedRoute allowedRoles={['LIVREUR']} />,
                children: [
                    {
                        path: 'livreur',
                        element: <LivreurDashboard />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);
