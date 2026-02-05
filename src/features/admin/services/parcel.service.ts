import { api } from '../../../services/api';
import type { Page } from '../../../shared/types/api.types';
import type { Colis, CreateColisDTO } from '../../../shared/types/parcel.types';

export const parcelService = {
    getParcels: async (params: any): Promise<Page<Colis>> => {
        const response = await api.get<Page<Colis>>('/api/colis', { params });
        return response.data;
    },

    getParcelById: async (id: number): Promise<Colis> => {
        const response = await api.get<Colis>(`/api/colis/${id}`);
        return response.data;
    },

    createParcel: async (data: CreateColisDTO): Promise<Colis> => {
        const response = await api.post<Colis>('/api/colis', data);
        return response.data;
    },

    updateParcel: async (id: number, data: Partial<Colis>): Promise<Colis> => {
        const response = await api.put<Colis>(`/api/colis/${id}`, data);
        return response.data;
    },

    deleteParcel: async (id: number): Promise<void> => {
        await api.delete(`/api/colis/${id}`);
    },

    updateStatus: async (id: number, statut: string, commentaire?: string): Promise<Colis> => {
        const response = await api.put<Colis>(`/api/colis/${id}/status`, { statut, commentaire });
        return response.data;
    },

    assignLivreur: async (colisId: number, livreurId: number): Promise<Colis> => {
        const response = await api.put<Colis>(`/api/colis/${colisId}/assign/${livreurId}`);
        return response.data;
    },
};
