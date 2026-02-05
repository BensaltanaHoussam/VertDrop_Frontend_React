import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchZones, createZone } from '../store/zone.slice';
import type { AppDispatch, RootState } from '../../../app/store';
import {
    MapPin,
    Plus,
    Trash2,
    MoreHorizontal,
    Navigation,
    Loader2
} from 'lucide-react';

export const ZoneManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.zone);
    const [isAdding, setIsAdding] = useState(false);
    const [newZoneName, setNewZoneName] = useState('');

    useEffect(() => {
        dispatch(fetchZones());
    }, [dispatch]);

    const handleAddZone = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newZoneName.trim()) return;

        await dispatch(createZone({ nom: newZoneName }));
        setNewZoneName('');
        setIsAdding(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Zones de Distribution</h1>
                    <p className="mt-4 text-gray-500 font-medium italic text-lg">Définissez et gérez vos secteurs d'intervention logistique.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-3xl font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:translate-y-0"
                >
                    <Plus className="mr-2 h-6 w-6" />
                    Nouvelle Zone
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-[2.5rem] border-4 border-blue-50 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                    <form onSubmit={handleAddZone} className="flex flex-col md:flex-row items-end gap-6">
                        <div className="flex-grow">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Nom de la nouvelle zone</label>
                            <input
                                type="text"
                                autoFocus
                                value={newZoneName}
                                onChange={(e) => setNewZoneName(e.target.value)}
                                placeholder="ex: Zone Grand Casablanca"
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-6 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg border-b-4 border-gray-950 flex items-center"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading && items.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
                        <MapPin className="h-16 w-16 text-gray-200 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-gray-400">Aucune zone n'a été configurée.</h3>
                        <p className="text-gray-400 mt-2">Commencez par en ajouter une pour organiser vos livraisons.</p>
                    </div>
                ) : items.map((zone) => (
                    <div key={zone.id} className="relative group overflow-hidden bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 hover:-translate-y-1">
                        <div className="flex items-start justify-between relative z-10">
                            <div className="h-16 w-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm group-hover:bg-blue-600 group-hover:text-white">
                                <Navigation className="h-8 w-8" />
                            </div>
                            <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                <MoreHorizontal className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{zone.nom}</h3>
                            <div className="flex items-center mt-4 text-gray-400 font-bold text-sm tracking-wide bg-gray-50 w-fit px-4 py-1.5 rounded-full border border-gray-100 uppercase">
                                <MapPin className="h-3.5 w-3.5 mr-2 text-blue-400" />
                                Identifiant: #{zone.id}
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-xl border-2 border-white bg-gray-100" />
                                ))}
                                <div className="h-8 px-2 rounded-xl border-2 border-white bg-blue-50 text-[10px] font-black text-blue-600 flex items-center justify-center">
                                    +12 COLIS
                                </div>
                            </div>
                            <button className="text-gray-300 hover:text-red-500 transition-colors p-2">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -right-16 -bottom-16 h-64 w-64 bg-blue-50 opacity-20 rounded-full blur-3xl group-hover:bg-blue-200 transition-colors duration-500 pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    );
};
