import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { fetchClients, fetchLivreurs } from '../../admin/store/user.slice';
import { parcelService } from '../services/parcel.service';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

const parcelSchema = z.object({
    description: z.string().min(3, 'La description doit contenir au moins 3 caractères'),
    poids: z.number().min(0.1, 'Le poids doit être supérieur à 0'),
    statut: z.string(),
    priorite: z.number().min(1).max(10),
    villeDestination: z.string().min(2, 'La ville est requise'),
    clientExpediteurId: z.coerce.number().min(1, 'Le client est requis'),
    zoneId: z.coerce.number().min(1, 'La zone est requise'),
    livreurId: z.coerce.number().optional(),
});

type ParcelFormValues = z.infer<typeof parcelSchema>;

export const ParcelForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { clients, livreurs } = useSelector((state: RootState) => state.user);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ParcelFormValues>({
        resolver: zodResolver(parcelSchema),
        defaultValues: {
            statut: 'CREE',
            priorite: 1,
        },
    });

    useEffect(() => {
        dispatch(fetchClients());
        dispatch(fetchLivreurs());

        if (isEdit) {
            const loadParcel = async () => {
                try {
                    const parcel = await parcelService.getParcelById(Number(id));
                    setValue('description', parcel.description);
                    setValue('poids', parcel.poids);
                    setValue('statut', parcel.statut);
                    setValue('priorite', parcel.priorite);
                    setValue('villeDestination', parcel.villeDestination);
                    setValue('clientExpediteurId', parcel.clientExpediteur?.id as number);
                    setValue('zoneId', parcel.zone?.id as number);
                    if (parcel.livreur) setValue('livreurId', parcel.livreur.id);
                } catch (error) {
                    console.error('Failed to load parcel', error);
                    navigate('/admin');
                }
            };
            loadParcel();
        }
    }, [id, isEdit, dispatch, setValue, navigate]);

    const onSubmit = async (data: ParcelFormValues) => {
        setIsSubmitting(true);
        try {
            if (isEdit) {
                await parcelService.updateParcel(Number(id), data as any);
            } else {
                await parcelService.createParcel(data as any);
            }
            navigate('/admin');
        } catch (error) {
            console.error('Save failed', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEdit ? 'Modifier le colis' : 'Nouveau colis'}
                        </h1>
                        <p className="text-gray-500 italic">Remplissez les informations logistiques ci-dessous.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Informations Générales</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Description du contenu</label>
                            <input
                                {...register('description')}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: Appareils électroniques..."
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Poids (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    {...register('poids', { valueAsNumber: true })}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.poids && <p className="text-red-500 text-xs mt-1">{errors.poids.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Priorité (1-10)</label>
                                <input
                                    type="number"
                                    {...register('priorite', { valueAsNumber: true })}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Ville de destination</label>
                            <input
                                {...register('villeDestination')}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: Casablanca"
                            />
                            {errors.villeDestination && <p className="text-red-500 text-xs mt-1">{errors.villeDestination.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-slate-800">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Logistique & Affectation</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Client Expéditeur</label>
                            <select
                                {...register('clientExpediteurId')}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner un client</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
                            </select>
                            {errors.clientExpediteurId && <p className="text-red-500 text-xs mt-1">{errors.clientExpediteurId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Zone de distribution</label>
                            <select
                                {...register('zoneId')}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionner une zone</option>
                                <option value="1">Zone Nord</option>
                                <option value="2">Zone Sud</option>
                                <option value="3">Zone Centre</option>
                            </select>
                            {errors.zoneId && <p className="text-red-500 text-xs mt-1">{errors.zoneId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Livreur Assigné (Optionnel)</label>
                            <select
                                {...register('livreurId')}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Non assigné</option>
                                {livreurs.map(l => <option key={l.id} value={l.id}>{l.nom} {l.prenom}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="pt-8 flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="flex-1 px-6 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] px-6 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center transition-all"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
                            {isEdit ? 'Mettre à jour' : 'Créer le colis'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
