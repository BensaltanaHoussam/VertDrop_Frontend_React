import { api } from '../../../services/api';

export interface DashboardStats {
    totalParcels: number;
    deliveredToday: number;
    inTransit: number;
    toAssign: number;
    revenue: number;
    zoneDistribution: { name: string; value: number }[];
    monthlyTrend: { name: string; total: number }[];
}

export const statsService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get<DashboardStats>('/api/stats/summary');
        return response.data;
    },
};
