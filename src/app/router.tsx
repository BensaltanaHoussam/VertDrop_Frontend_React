import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';

// Placeholder components for routing
const Login = () => <div className="p-8">Login Page (Coming Soon)</div>;
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
                path: 'admin',
                element: <AdminDashboard />,
            },
            {
                path: 'client',
                element: <ClientDashboard />,
            },
            {
                path: 'livreur',
                element: <LivreurDashboard />,
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);
