export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export type StatutColis = 'CREE' | 'COLLECTE' | 'EN_STOCK' | 'EN_TRANSIT' | 'LIVRE';

export interface User {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    role: 'ADMIN' | 'MANAGER' | 'LIVREUR' | 'CLIENT';
    telephone?: string;
}

export interface DecodedToken {
    sub: string;
    roles: string[];
    exp: number;
    iat: number;
}
