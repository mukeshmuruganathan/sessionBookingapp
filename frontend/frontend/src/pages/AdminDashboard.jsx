import React, { useState, useEffect } from 'react';
import { Trash2, Search, Calendar, Users, Clock, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { bookingService } from '../services/api';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

export default function AdminDashboard() {
    const [data, setData] = useState({ bookings: [], total: 0, pages: 1 });
    const [stats, setStats] = useState({ total: 0, today: 0, upcoming: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const fetchEverything = async () => {
        setLoading(true);
        try {
            const [{ data: bData }, { data: sData }] = await Promise.all([
                bookingService.get(page, search),
                bookingService.getStats()
            ]);
            setData(bData);
            setStats(sData);
        } catch (e) {
            toast.error('Failed to sync data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounced = setTimeout(fetchEverything, 400);
        return () => clearTimeout(debounced);
    }, [page, search]);

    const deleteItem = async (id) => {
        if (!window.confirm('Delete this booking?')) return;
        try {
            await bookingService.delete(id);
            toast.success('Removed');
            fetchEverything();
        } catch (e) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500">Overview of all appointments</p>
                </div>
                <button onClick={fetchEverything} className="btn-secondary group">
                    <RefreshCw size={18} className="group-active:rotate-180 transition-transform" /> Sync
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Total', value: stats.total, icon: Users, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Today', value: stats.today, icon: Clock, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Upcoming', value: stats.upcoming, icon: Calendar, color: 'text-emerald-600 bg-emerald-50' }
                ].map(s => (
                    <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
                        <div className={`p-4 rounded-2xl ${s.color}`}><s.icon size={24} /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">{s.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <p className="text-sm text-slate-400">Showing {data.bookings.length} of {data.total} records</p>
                </div>

                <div className="overflow-x-auto">
                    {loading ? <div className="p-20 flex justify-center"><Spinner /></div> : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-50">
                                <tr>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.bookings.map(b => (
                                    <tr key={b._id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-700">{b.fullName}</div>
                                            <div className="text-xs text-slate-400">{b.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-600">{format(new Date(b.date), 'MMM dd, yyyy')}</div>
                                            <div className="text-xs text-slate-400">{b.time}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {b.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => deleteItem(b._id)} className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-2 border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold text-slate-500">Page {page} / {data.pages}</span>
                    <button
                        disabled={page === data.pages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
