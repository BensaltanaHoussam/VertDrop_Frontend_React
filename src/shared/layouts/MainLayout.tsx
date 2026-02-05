import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import {
    LayoutDashboard,
    Package,
    Users,
    MapPin,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    ChevronRight
} from 'lucide-react';

export const MainLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Mes Livraisons', href: '/livreur', icon: Package, roles: ['LIVREUR'] },
        { name: 'Mes Colis', href: '/client', icon: Package, roles: ['CLIENT'] },
        { name: 'Utilisateurs', href: '/admin/users', icon: Users, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Zones', href: '/admin/zones', icon: MapPin, roles: ['ADMIN', 'MANAGER'] },
        { name: 'Analytiques', href: '/admin/stats', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER'] },
    ];

    const filteredNavigation = navigation.filter(item =>
        !item.roles || (user && item.roles.includes(user.role))
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
                        {isSidebarOpen && <span className="ml-3 font-bold text-xl text-gray-900 tracking-tight">VertDrop</span>}
                    </div>

                    {/* Nav */}
                    <nav className="flex-grow py-6 px-4 space-y-2">
                        {filteredNavigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    {isSidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                                    {isSidebarOpen && isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center p-2 rounded-xl bg-gray-50">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <UserIcon className="h-6 w-6" />
                            </div>
                            {isSidebarOpen && (
                                <div className="ml-3 overflow-hidden">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.nom} {user?.prenom}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={logout}
                            className="mt-4 flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                        >
                            <LogOut className="h-5 w-5" />
                            {isSidebarOpen && <span className="ml-3 font-medium">Déconnexion</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                    <div className="flex items-center space-y-0 space-x-4">
                        {/* Header actions could go here */}
                    </div>
                </header>

                <main className="flex-grow p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
