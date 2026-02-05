import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParcels } from '../../../features/admin/store/parcel.slice';
import type { AppDispatch, RootState } from '../../../app/store';
import {
    Package,
    Search,
    MapPin,
    Plus,
    History,
    Box,
    TrendingUp,
    Clock
} from 'lucide-react';

export const ClientDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.parcel);

    useEffect(() => {
        dispatch(fetchParcels());
    }, [dispatch]);

    const stats = [
        { label: 'Mes Colis', value: items.length, icon: Box, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'En Livraison', value: 2, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Dépenses', value: '450€', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Espace Client</h1>
                    <p className="text-gray-500 mt-1 italic">Bienvenue dans votre gestionnaire de livraisons personnel.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105 transform">
                        <Plus className="mr-2 h-5 w-5" />
                        Envoyer un colis
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className={`${stat.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon className={`h-7 w-7 ${stat.color}`} />
                        </div>
                        <p className="text-gray-500 font-medium">{stat.label}</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* My Parcels Section */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <History className="mr-3 text-blue-600" />
                        Suivi des envois récents
                    </h2>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="N° de suivi..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                </div>

                <div className="divide-y divide-gray-50">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 italic">Synchronisation de vos données...</div>
                    ) : items.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package className="h-10 w-10 text-gray-300" />
                            </div>
                            <p className="text-gray-500 text-lg font-medium">Vous n'avez pas encore d'envois.</p>
                            <button className="mt-4 text-blue-600 font-bold hover:underline">Commencer mon premier envoi</button>
                        </div>
                    ) : items.map((item) => (
                        <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-center space-x-4">
                                    <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Package className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Suivi #{item.id}</span>
                                        <h4 className="font-bold text-gray-900 text-lg">{item.description}</h4>
                                        <p className="text-sm text-gray-400 flex items-center font-medium">
                                            <MapPin className="h-3.5 w-3.5 mr-1" />
                                            Destinataire: {item.destinataire?.nom || 'Non spécifié'} • {item.villeDestination}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar Placeholder */}
                                <div className="flex-grow max-w-md mx-auto hidden xl:block">
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                                                    {item.statut}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-blue-600">
                                                    {item.statut === 'LIVRE' ? '100%' : '40%'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-blue-100">
                                            <div style={{ width: item.statut === 'LIVRE' ? '100%' : '40%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0">
                                    <button className="px-5 py-2.5 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-all">
                                        Détails
                                    </button>
                                    <button className="px-5 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all">
                                        Ticket de suivi
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 text-center">
                    <button className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
                        Voir tout l'historique des envois
                    </button>
                </div>
            </div>
        </div>
    );
};
