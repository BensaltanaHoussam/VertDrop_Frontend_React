import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { Login } from '../features/auth/components/Login';
import { ProtectedRoute } from '../shared/layouts/ProtectedRoute';
import { MainLayout } from '../shared/layouts/MainLayout';
import { AdminDashboard } from '../features/admin/components/AdminDashboard';
import { ClientDashboard } from '../features/client/components/ClientDashboard';
import { LivreurDashboard } from '../features/livreur/components/LivreurDashboard';

// Placeholder components for more specific views
const UserManagement = () => <div className="p-8"><h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1><p className="text-gray-500">Coming soon...</p></div>;
const ZoneManagement = () => <div className="p-8"><h1 className="text-2xl font-bold">Gestion des Zones</h1><p className="text-gray-500">Coming soon...</p></div>;

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
                // Protected App Area with MainLayout
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <MainLayout />,
                        children: [
                            {
                                // Protected Admin Routes
                                element: <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />,
                                children: [
                                    {
                                        path: 'admin',
                                        element: <AdminDashboard />,
                                    },
                                    {
                                        path: 'admin/users',
                                        element: <UserManagement />,
                                    },
                                    {
                                        path: 'admin/zones',
                                        element: <ZoneManagement />,
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
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);
