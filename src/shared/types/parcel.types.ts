import { StatutColis, User } from './api.types';

export interface Zone {
    id: number;
    nom: string;
}

export interface Colis {
    id: number;
    description: string;
    poids: number;
    statut: StatutColis;
    priorite: number;
    villeDestination: string;
    clientExpediteur: User | null;
    destinataire: {
        id: number;
        nom: string;
        telephone: string;
        adresse: string;
    } | null;
    livreur: User | null;
    zone: Zone | null;
}

export interface CreateColisDTO {
    description: string;
    poids: number;
    statut: StatutColis;
    priorite: number;
    villeDestination: string;
    clientExpediteurId: number;
    destinataireId: number;
    zoneId: number;
    livreurId?: number;
}

export interface ParcelState {
    items: Colis[];
    selectedItem: Colis | null;
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
    filters: {
        keyword: string;
        statut: string;
        zoneId: number | null;
    };
}
