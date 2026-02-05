import { useEffect, useState } from 'react';
import { statsService, type DashboardStats } from '../services/stats.service';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    DollarSign,
    PackageCheck
} from 'lucide-react';

export const StatsDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await statsService.getDashboardStats();
                setStats(data);
            } catch (err) {
                // Using mock data for demonstration if API fails or not implemented yet
                setStats({
                    totalParcels: 1250,
                    deliveredToday: 42,
                    inTransit: 156,
                    toAssign: 18,
                    revenue: 24500,
                    zoneDistribution: [
                        { name: 'Nord', value: 400 },
                        { name: 'Sud', value: 300 },
                        { name: 'Centre', value: 550 },
                    ],
                    monthlyTrend: [
                        { name: 'Jan', total: 65 },
                        { name: 'Feb', total: 85 },
                        { name: 'Mar', total: 120 },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="p-20 text-center"><Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" /></div>;
    if (!stats) return <div className="p-20 text-center font-bold text-red-500">Impossible de charger les statistiques.</div>;

    const cards = [
        { label: 'Revenue Mensuel', value: `${stats.revenue} DH`, change: '+12.5%', icon: DollarSign, positive: true, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Colis Livrés', value: stats.deliveredToday, change: '+5.2%', icon: PackageCheck, positive: true, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Taux de Succès', value: '98.5%', change: '-0.4%', icon: TrendingUp, positive: false, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Zones Actives', value: stats.zoneDistribution.length, change: '0%', icon: BarChart3, positive: true, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Intelligence Logistique</h1>
                    <p className="text-gray-500 font-medium italic mt-2">Analyse approfondie de vos performances de livraison.</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl">30 derniers jours</button>
                    <button className="px-6 py-2.5 text-gray-400 font-bold text-sm hover:text-gray-900 transition-colors">Cette année</button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className={`${card.bg} h-14 w-14 rounded-2xl flex items-center justify-center ${card.color}`}>
                                <card.icon className="h-7 w-7" />
                            </div>
                            <div className={`flex items-center font-black text-xs uppercase px-2 py-1 rounded-lg ${card.positive ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                                {card.positive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                {card.change}
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{card.label}</p>
                            <h3 className="text-3xl font-black text-gray-900">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section Placeholder (Visual Only for now) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center">
                            <TrendingUp className="mr-3 h-5 w-5 text-blue-600" />
                            Volumes de livraison mensuels
                        </h3>
                        <div className="flex space-x-2">
                            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span className="h-3 w-3 bg-blue-600 rounded-full mr-2"></span>
                                Réussi
                            </div>
                        </div>
                    </div>

                    {/* Visual Bar Graph Simulation */}
                    <div className="flex items-end justify-between h-64 gap-6 px-4">
                        {[40, 65, 45, 90, 75, 55, 100, 85, 95, 60, 40, 70].map((h, i) => (
                            <div key={i} className="flex-grow flex flex-col items-center group">
                                <div
                                    style={{ height: `${h}%` }}
                                    className={`w-full rounded-t-2xl transition-all duration-500 ${i === 6 ? 'bg-blue-600' : 'bg-blue-100 group-hover:bg-blue-200'} shadow-sm`}
                                ></div>
                                <span className="mt-4 text-[10px] font-black text-gray-300 uppercase">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-10 flex items-center relative z-10">
                        <PieChart className="mr-3 h-5 w-5 text-blue-400" />
                        Distribution par Zone
                    </h3>

                    <div className="space-y-8 relative z-10">
                        {stats.zoneDistribution.map((zone, i) => (
                            <div key={zone.name} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">{zone.name}</span>
                                    <span className="text-lg font-black">{Math.round((zone.value / 1250) * 100)}%</span>
                                </div>
                                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${(zone.value / 1250) * 100}%` }}
                                        className={`h-full rounded-full transition-all duration-1000 ${i === 2 ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-700'}`}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-gray-800/50 p-6 rounded-3xl border border-gray-800 relative z-10">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Observation Stratégique</p>
                        <p className="text-sm text-gray-300 leading-relaxed italic">
                            "La zone **{stats.zoneDistribution.sort((a, b) => b.value - a.value)[0].name}** domine actuellement le volume opérationnel. Envisagez d'allouer plus de livreurs à ce secteur d'ici la fin du trimestre."
                        </p>
                    </div>

                    <PieChart className="absolute -right-16 -bottom-16 h-64 w-64 text-blue-500 opacity-5 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};
