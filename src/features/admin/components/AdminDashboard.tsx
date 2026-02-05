import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParcels, setFilters, setPage } from '../store/parcel.slice';
import { AppDispatch, RootState } from '../../../app/store';
import {
    Package,
    Clock,
    CheckCircle2,
    Truck,
    Search,
    Filter,
    Plus,
    RefreshCw,
    MoreVertical
} from 'lucide-react';

export const AdminDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, pagination, filters } = useSelector((state: RootState) => state.parcel);

    useEffect(() => {
        dispatch(fetchParcels());
    }, [dispatch, pagination.page, filters]);

    const stats = [
        { label: 'Total Colis', value: pagination.totalElements, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'En Transit', value: 12, icon: Truck, color: 'text-yellow-600', bg: 'bg-yellow-50' }, // Placeholder for dynamic stats
        { label: 'Livrés Today', value: 8, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'A affecter', value: 5, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble de la logistique</h1>
                    <p className="text-gray-500">Gérez et suivez toutes les livraisons en temps réel.</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200">
                    <Plus className="h-5 w-5 mr-2" />
                    Nouveau Colis
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div className={`${stat.bg} p-3 rounded-xl`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Actions */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-grow items-center bg-gray-50 rounded-xl px-3 py-2 max-w-md">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un colis ou client..."
                        className="bg-transparent border-none focus:ring-0 ml-2 w-full text-sm"
                        value={filters.keyword}
                        onChange={(e) => dispatch(setFilters({ keyword: e.target.value }))}
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <select
                        className="bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                        value={filters.statut}
                        onChange={(e) => dispatch(setFilters({ statut: e.target.value }))}
                    >
                        <option value="">Tous les statuts</option>
                        <option value="CREE">Créé</option>
                        <option value="EN_TRANSIT">En Transit</option>
                        <option value="LIVRE">Livré</option>
                    </select>
                    <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Colis</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client / Zone</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priorité</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-8">Chargement en cours...</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8">Aucun colis trouvé</td></tr>
                        ) : items.map((parcel) => (
                            <tr key={parcel.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                            #{parcel.id}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-semibold text-gray-900">{parcel.description}</div>
                                            <div className="text-xs text-gray-500">{parcel.poids} kg • {parcel.villeDestination}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${parcel.statut === 'LIVRE' ? 'bg-green-100 text-green-800' :
                                            parcel.statut === 'EN_TRANSIT' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {parcel.statut}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{parcel.clientExpediteur?.nom || 'N/A'}</div>
                                    <div className="text-xs text-gray-500">{parcel.zone?.nom || 'Zone non définie'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm font-medium ${parcel.priorite > 5 ? 'text-red-600' : 'text-gray-600'}`}>
                                        Priorité {parcel.priorite}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Affichage de <span className="font-medium">1</span> à <span className="font-medium">{items.length}</span> sur <span className="font-medium">{pagination.totalElements}</span> résultats
                    </div>
                    <div className="flex space-x-2">
                        <button
                            disabled={pagination.page === 0}
                            onClick={() => dispatch(setPage(pagination.page - 1))}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <button
                            disabled={pagination.page >= pagination.totalPages - 1}
                            onClick={() => dispatch(setPage(pagination.page + 1))}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
