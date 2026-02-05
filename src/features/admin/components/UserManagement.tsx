import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, fetchLivreurs } from '../store/user.slice';
import type { AppDispatch, RootState } from '../../../app/store';
import {
    Users,
    UserPlus,
    Search,
    Mail,
    Phone,
    Shield,
    Edit2,
    Trash2,
    Truck,
    Briefcase
} from 'lucide-react';

export const UserManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { clients, livreurs, loading } = useSelector((state: RootState) => state.user);
    const [activeTab, setActiveTab] = useState<'CLIENT' | 'LIVREUR'>('CLIENT');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchLivreurs());
    }, [dispatch]);

    const usersToDisplay = (activeTab === 'CLIENT' ? clients : livreurs).filter(u =>
        u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Gestion du Personnel & Clients</h1>
                    <p className="text-gray-500 font-medium">Contrôlez les accès et les profils de votre réseau.</p>
                </div>
                <button className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Ajouter un utilisateur
                </button>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('CLIENT')}
                        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'CLIENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Briefcase className="inline-block mr-2 h-4 w-4" />
                        Clients
                    </button>
                    <button
                        onClick={() => setActiveTab('LIVREUR')}
                        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'LIVREUR' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Truck className="inline-block mr-2 h-4 w-4" />
                        Livreurs
                    </button>
                </div>

                <div className="relative group flex-grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder={`Chercher par nom ou email...`}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* User Grid/Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-50">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                            <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Contact</th>
                            <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Rôle</th>
                            <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={4} className="p-20 text-center italic text-gray-400">Chargement des utilisateurs...</td></tr>
                        ) : usersToDisplay.length === 0 ? (
                            <tr><td colSpan={4} className="p-20 text-center text-gray-500 font-medium leading-relaxed">
                                <Users className="mx-auto h-12 w-12 text-gray-200 mb-4" />
                                Aucun utilisateur trouvé.
                            </td></tr>
                        ) : usersToDisplay.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            {u.nom[0]}{u.prenom[0]}
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-gray-900 font-bold text-lg">{u.nom} {u.prenom}</p>
                                            <p className="text-gray-400 text-sm font-medium">ID: #{u.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-gray-600 font-medium">
                                            <Mail className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                            {u.email}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 font-medium">
                                            <Phone className="h-3.5 w-3.5 mr-2 text-gray-400" />
                                            {u.telephone || 'Non renseigné'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${u.role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-100' :
                                            u.role === 'LIVREUR' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        <Shield className="inline-block h-3 w-3 mr-1 -mt-0.5" />
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
