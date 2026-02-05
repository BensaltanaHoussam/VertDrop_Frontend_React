import { api } from '../../../services/api';
import type { Zone } from '../../../shared/types/parcel.types';

export const zoneService = {
    getZones: async (): Promise<Zone[]> => {
        const response = await api.get<Zone[]>('/zones');
        return response.data;
    },

    getZoneById: async (id: number): Promise<Zone> => {
        const response = await api.get<Zone>(`/zones/${id}`);
        return response.data;
    },

    createZone: async (zone: Partial<Zone>): Promise<Zone> => {
        const response = await api.post<Zone>('/zones', zone);
        return response.data;
    },

    updateZone: async (id: number, zone: Partial<Zone>): Promise<Zone> => {
        const response = await api.put<Zone>(`/zones/${id}`, zone);
        return response.data;
    },

    deleteZone: async (id: number): Promise<void> => {
        await api.delete(`/zones/${id}`);
    },
};
