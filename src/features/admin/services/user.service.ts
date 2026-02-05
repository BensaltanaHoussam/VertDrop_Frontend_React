import { api } from '../../../services/api';
import type { User } from '../../../shared/types/api.types';

export const userService = {
    getUsers: async (role?: string): Promise<User[]> => {
        const url = role ? `/api/users?role=${role}` : '/api/users';
        const response = await api.get<User[]>(url);
        return response.data;
    },

    getClients: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/api/users/clients');
        return response.data;
    },

    getLivreurs: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/api/users/livreurs');
        return response.data;
    },

    createUser: async (user: Partial<User>): Promise<User> => {
        const response = await api.post<User>('/api/users', user);
        return response.data;
    },

    updateUser: async (id: number, user: Partial<User>): Promise<User> => {
        const response = await api.put<User>(`/api/users/${id}`, user);
        return response.data;
    },

    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`/api/users/${id}`);
    },
};
