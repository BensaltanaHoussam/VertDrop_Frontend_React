import { api } from '../../../services/api';
import { Page } from '../../../shared/types/api.types';
import { Colis, CreateColisDTO } from '../../../shared/types/parcel.types';

export const parcelService = {
    getParcels: async (params: any): Promise<Page<Colis>> => {
        const response = await api.get<Page<Colis>>('/colis', { params });
        return response.data;
    },

    getParcelById: async (id: number): Promise<Colis> => {
        const response = await api.get<Colis>(`/colis/${id}`);
        return response.data;
    },

    createParcel: async (data: CreateColisDTO): Promise<Colis> => {
        const response = await api.post<Colis>('/colis', data);
        return response.data;
    },

    updateParcel: async (id: number, data: Partial<Colis>): Promise<Colis> => {
        const response = await api.put<Colis>(`/colis/${id}`, data);
        return response.data;
    },

    deleteParcel: async (id: number): Promise<void> => {
        await api.delete(`/colis/${id}`);
    },

    updateStatus: async (id: number, statut: string, commentaire?: string): Promise<Colis> => {
        const response = await api.put<Colis>(`/colis/${id}/status`, { statut, commentaire });
        return response.data;
    },

    assignLivreur: async (colisId: number, livreurId: number): Promise<Colis> => {
        const response = await api.put<Colis>(`/colis/${colisId}/assign/${livreurId}`);
        return response.data;
    },
};
