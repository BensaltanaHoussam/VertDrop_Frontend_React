import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parcelService } from '../services/parcel.service';
import type { Colis } from '../../../shared/types/parcel.types';
import {
    Package,
    MapPin,
    ArrowLeft,
    Truck,
    CheckCircle2,
    Clock,
    ShieldCheck,
    User as UserIcon
} from 'lucide-react';

export const ParcelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [parcel, setParcel] = useState<Colis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await parcelService.getParcelById(Number(id));
                setParcel(data);
            } catch (error) {
                console.error('Fetch error', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return <div className="p-20 text-center italic text-gray-500">Récupération des données du colis...</div>;
    if (!parcel) return <div className="p-20 text-center font-bold text-red-500">Colis introuvable.</div>;

    const steps = [
        { label: 'Créé', status: 'CREE', icon: Package, date: '01 Fév 2026' },
        { label: 'Collecté', status: 'COLLECTE', icon: ShieldCheck, date: '02 Fév 2026' },
        { label: 'En Stock', status: 'EN_STOCK', icon: MapPin, date: '03 Fév 2026' },
        { label: 'En Transit', status: 'EN_TRANSIT', icon: Truck, date: '04 Fév 2026' },
        { label: 'Livré', status: 'LIVRE', icon: CheckCircle2, date: null },
    ];

    const currentStatusIndex = steps.findIndex(s => s.status === parcel.statut);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-tight">Suivi de l'envoi #{parcel.id}</h1>
                    <p className="text-blue-600 font-bold flex items-center italic">
                        <Clock className="h-4 w-4 mr-2" />
                        Statut actuel: {parcel.statut}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Tracker */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-10">Parcours du colis</h2>
                        <div className="relative">
                            {/* Vertical line helper for mobile, Horizontal for desktop hidden for simplicity here */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-100 hidden md:block"></div>
                            <div className="space-y-12">
                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStatusIndex;
                                    const isCurrent = index === currentStatusIndex;
                                    return (
                                        <div key={step.label} className={`flex items-start relative z-10 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                                            <div className={`h-16 w-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 shadow-lg ${isCurrent ? 'bg-blue-600 text-white scale-110' :
                                                isCompleted ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400'
                                                }`}>
                                                <step.icon className="h-8 w-8" />
                                            </div>
                                            <div className="ml-6 pt-2">
                                                <h4 className={`text-lg font-bold ${isCurrent ? 'text-blue-600' : 'text-gray-900'}`}>{step.label}</h4>
                                                <p className="text-sm text-gray-400 font-medium">{step.date || 'En attente'}</p>
                                            </div>
                                            {isCurrent && (
                                                <div className="ml-auto">
                                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest rounded-full animate-pulse border border-blue-100">
                                                        Dernière étape validée
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold flex items-center">
                                    <Truck className="mr-3 text-blue-400" />
                                    Détails de livraison
                                </h3>
                                <div className="mt-6 flex space-x-8">
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Poids</p>
                                        <p className="text-xl font-bold">{parcel.poids} kg</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-800"></div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Destination</p>
                                        <p className="text-xl font-bold">{parcel.villeDestination}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-3xl border border-gray-700">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Zone</p>
                                <p className="text-sm font-bold text-blue-400">{parcel.zone?.nom || 'Standard'}</p>
                            </div>
                        </div>
                        <Package className="absolute right-0 bottom-0 h-48 w-48 text-white opacity-5 pointer-events-none -mr-12 -mb-12" />
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center border-b border-gray-50 pb-4 uppercase tracking-tighter">
                            <UserIcon className="mr-3 h-5 w-5 text-blue-600" />
                            Contacts
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Expéditeur</p>
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                                        {parcel.clientExpediteur?.nom?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 truncate">{parcel.clientExpediteur?.nom} {parcel.clientExpediteur?.prenom}</p>
                                        <p className="text-sm text-gray-500 font-medium">{parcel.clientExpediteur?.telephone || '06 00 00 00 00'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-px bg-gray-50"></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Destinataire</p>
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                                        {parcel.destinataire?.nom?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 truncate">{parcel.destinataire?.nom}</p>
                                        <p className="text-sm text-gray-500 font-medium">{parcel.destinataire?.telephone}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-start space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" />
                                    {parcel.destinataire?.adresse}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center uppercase tracking-tighter">
                            <ShieldCheck className="mr-3 h-5 w-5 text-green-600" />
                            Personnel
                        </h3>
                        {parcel.livreur ? (
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                                    <UserIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Livreur en charge</p>
                                    <p className="font-bold text-gray-900">{parcel.livreur.nom} {parcel.livreur.prenom}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-600 text-sm font-bold text-center italic">
                                Aucun livreur assigné
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
