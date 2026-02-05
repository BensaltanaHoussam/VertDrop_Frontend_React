import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { Login } from '../features/auth/components/Login';
import { ProtectedRoute } from '../shared/layouts/ProtectedRoute';
import { MainLayout } from '../shared/layouts/MainLayout';
import { AdminDashboard } from '../features/admin/components/AdminDashboard';
import { ClientDashboard } from '../features/client/components/ClientDashboard';
import { LivreurDashboard } from '../features/livreur/components/LivreurDashboard';

import { ParcelForm } from '../features/admin/components/ParcelForm';
import { ParcelDetails } from '../features/admin/components/ParcelDetails';
import { UserManagement } from '../features/admin/components/UserManagement';
import { ZoneManagement } from '../features/admin/components/ZoneManagement';
import { StatsDashboard } from '../features/admin/components/StatsDashboard';

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
                                        path: 'admin/parcels/new',
                                        element: <ParcelForm />,
                                    },
                                    {
                                        path: 'admin/parcels/:id',
                                        element: <ParcelDetails />,
                                    },
                                    {
                                        path: 'admin/parcels/:id/edit',
                                        element: <ParcelForm />,
                                    },
                                    {
                                        path: 'admin/users',
                                        element: <UserManagement />,
                                    },
                                    {
                                        path: 'admin/zones',
                                        element: <ZoneManagement />,
                                    },
                                    {
                                        path: 'admin/stats',
                                        element: <StatsDashboard />,
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
