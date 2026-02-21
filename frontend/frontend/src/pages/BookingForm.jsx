import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Clock, Check } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { bookingService } from '../services/api';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function BookingForm() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: ''
    });

    const [booked, setBooked] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await bookingService.getSlots(form.date);
                setBooked(data);
                if (data.includes(form.time)) setForm(f => ({ ...f, time: '' }));
            } catch (e) {
                toast.error('Error loading slots');
            } finally {
                setLoading(false);
            }
        })();
    }, [form.date]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.time) return toast.error('Pick a time slot');

        setSubmitting(true);
        try {
            await bookingService.create(form);
            toast.success('Booking confirmed!');
            setForm({ ...form, time: '' }); // keep name/email for convenience if user wants? no, clear it.
            setForm({ fullName: '', email: '', phone: '', date: format(new Date(), 'yyyy-MM-dd'), time: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-12 px-4">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-primary p-8 text-white text-center">
                    <h1 className="text-3xl font-bold">Book a Session</h1>
                    <p className="mt-2 text-primary-foreground/80">Fill in the details below to secure your spot</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="input-field pl-12"
                                required
                                value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="input-field pl-12"
                                    required
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    className="input-field pl-12"
                                    required
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="date"
                                className="input-field pl-12"
                                min={format(new Date(), 'yyyy-MM-dd')}
                                max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                                required
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                            <Clock size={16} /> Choose a Time
                        </p>
                        {loading ? <Spinner /> : (
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {SLOTS.map(s => {
                                    const isBooked = booked.includes(s);
                                    const active = form.time === s;
                                    return (
                                        <button
                                            key={s}
                                            type="button"
                                            disabled={isBooked}
                                            onClick={() => setForm({ ...form, time: s })}
                                            className={`py-2 rounded-lg text-sm font-medium border transition-all 
                        ${isBooked ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' :
                                                    active ? 'bg-primary text-white border-primary shadow-md' :
                                                        'bg-white text-slate-600 border-slate-200 hover:border-primary'}`}
                                        >
                                            {s}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full py-4 rounded-2xl shadow-lg transition-transform active:scale-95"
                    >
                        {submitting ? <Spinner size="sm" /> : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
