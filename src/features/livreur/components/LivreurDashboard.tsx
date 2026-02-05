import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParcels } from '../store/parcel.slice';
import { useAuth } from '../../auth/hooks/useAuth';
import { AppDispatch, RootState } from '../../../app/store';
import {
    Package,
    MapPin,
    Map,
    ChevronRight,
    TrendingUp,
    CheckCircle2,
    Navigation
} from 'lucide-react';

export const LivreurDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const { items, loading } = useSelector((state: RootState) => state.parcel);

    useEffect(() => {
        // For production, the API should filter by current user id
        // Here we'll just fetch all or simulate the filter
        dispatch(fetchParcels());
    }, [dispatch]);

    const deliveryStats = [
        { label: 'Mes Courses', value: items.length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Complétées', value: 3, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Distance Prob.', value: '12km', icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold">Bonjour, {user?.prenom} ! 👋</h1>
                    <p className="text-blue-100 mt-2">Vous avez {items.length} livraisons prévues pour votre tournée aujourd'hui.</p>
                    <button className="mt-6 px-6 py-2.5 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center">
                        <Map className="mr-2 h-5 w-5" />
                        Voir ma tournée sur la carte
                    </button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <Truck className="h-64 w-64 -mb-16 -mr-16" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {deliveryStats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className={`${stat.bg} p-3 rounded-2xl`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Ma liste de livraison</h2>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">En cours</button>
                        <button className="px-4 py-2 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-100">Historique</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500 italic">Chargement de votre tournée...</div>
                    ) : items.length === 0 ? (
                        <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Aucun colis assigné pour le moment.</p>
                        </div>
                    ) : items.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        #{item.id}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-bold text-gray-900">{item.description}</h4>
                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                            {item.villeDestination} • {item.zone?.nom || 'Zone Locale'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="text-right mr-4 hidden md:block">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Statut</p>
                                        <p className="text-sm font-bold text-blue-600">{item.statut}</p>
                                    </div>
                                    <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                                        Mettre à jour
                                    </button>
                                    <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Truck = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
);
