import { api } from '../../../services/api';
import { User } from '../../../shared/types/api.types';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        // Note: The backend expects { username, password }
        const payload = {
            username: credentials.email,
            password: credentials.password,
        };
        const response = await api.post<AuthResponse>('/auth/login', payload);
        return response.data;
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', credentials);
        return response.data;
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/auth/profile');
        return response.data;
    },
};
