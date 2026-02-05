import type { User } from './api.types';

export interface UserState {
    users: User[];
    clients: User[];
    livreurs: User[];
    loading: boolean;
    error: string | null;
}

export interface UserFilters {
    role?: string;
    keyword?: string;
}
