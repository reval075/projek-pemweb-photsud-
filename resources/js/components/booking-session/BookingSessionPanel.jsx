import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, ChevronLeft, ChevronRight, Camera, Sparkles } from 'lucide-react';

function MiniCalendar({ onDateSelect, selectedDate }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);
        const fmt = (d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };
        axios
            .get(`/api/availabilities?start_date=${fmt(startOfMonth)}&end_date=${fmt(endOfMonth)}`)
            .then((res) => {
                setUnavailableDates(res.data.unavailable_dates || []);
                setBookedDates(res.data.booked_dates || []);
            })
            .catch(() => {});
    }, [year, month]);

    const getDateStatus = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dCopy = new Date(date);
        dCopy.setHours(0, 0, 0, 0);
        if (dCopy < today) return 'unavailable';
        const dateStr = `${dCopy.getFullYear()}-${String(dCopy.getMonth() + 1).padStart(2, '0')}-${String(dCopy.getDate()).padStart(2, '0')}`;
        if (unavailableDates.includes(dateStr)) return 'unavailable';
        if (bookedDates.includes(dateStr)) return 'booked';
        return 'available';
    };

    const days = () => {
        const firstDayIndex = new Date(year, month, 1).getDay();
        const numDays = new Date(year, month + 1, 0).getDate();
        const result = [];
        for (let i = 0; i < firstDayIndex; i++) result.push(null);
        for (let i = 1; i <= numDays; i++) result.push(new Date(year, month, i));
        return result;
    };

    const handleClick = (date) => {
        if (getDateStatus(date) !== 'available') return;
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        onDateSelect(dateStr);
    };

    return (
        <div className="border border-beige rounded-2xl p-4 bg-off-white/80">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-serif text-sm text-charcoal">
                    {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                        className="p-1.5 rounded-lg border border-beige hover:bg-beige text-warm-grey transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                        className="p-1.5 rounded-lg border border-beige hover:bg-beige text-warm-grey transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-warm-grey uppercase mb-2">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                    <span key={d}>{d}</span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days().map((date, idx) => {
                    if (!date) return <div key={`e-${idx}`} />;
                    const status = getDateStatus(date);
                    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    const isSelected = selectedDate === dateStr;
                    return (
                        <button
                            key={idx}
                            type="button"
                            disabled={status !== 'available'}
                            onClick={() => handleClick(date)}
                            className={`aspect-square text-xs rounded-lg transition-all ${
                                status === 'available'
                                    ? isSelected
                                        ? 'bg-primary text-white font-semibold ring-2 ring-primary-light'
                                        : 'bg-white border border-beige text-charcoal hover:border-primary hover:text-primary-dark'
                                    : status === 'booked'
                                      ? 'bg-red-50 text-red-400 cursor-not-allowed'
                                      : 'bg-beige/40 text-warm-grey cursor-not-allowed'
                            }`}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function BookingSessionPanel() {
    const [selectedDate, setSelectedDate] = useState('');
    const bookingUrl = selectedDate ? `/booking?date=${selectedDate}` : '/booking';

    return (
        <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="relative rounded-3xl border border-primary-50 bg-white shadow-xl shadow-primary/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-transparent to-accent/5 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="relative p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 mb-4">
                            <Camera size={24} className="text-primary-dark" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-2 flex items-center justify-center gap-1">
                            <Sparkles size={10} className="text-accent" /> Studio Access
                        </p>
                        <h2 className="text-2xl md:text-3xl font-serif text-charcoal tracking-tight">Booking Session</h2>
                        <p className="text-sm text-slate mt-2 font-light">Pilih tanggal untuk memulai reservasi sesi studio</p>
                    </div>

                    <div className="space-y-6">
                        <p className="text-sm text-slate font-light leading-relaxed">
                            Pilih tanggal tersedia untuk memulai sesi photobooth atau studio. Lanjutkan ke formulir lengkap setelah memilih tanggal.
                        </p>
                        <MiniCalendar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
                        {selectedDate && (
                            <motion.p
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-primary-dark text-center"
                            >
                                Tanggal dipilih: <strong>{selectedDate}</strong>
                            </motion.p>
                        )}
                        <Link
                            href={bookingUrl}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-medium tracking-wide hover:bg-primary-dark transition-all shadow-lg shadow-primary/25"
                        >
                            <span>{selectedDate ? 'Lanjutkan Booking' : 'Buka Formulir Booking'}</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            <p className="text-center mt-6">
                <Link href="/" className="text-xs text-warm-grey hover:text-primary-dark transition-colors uppercase tracking-widest">
                    ← Kembali ke beranda
                </Link>
            </p>
        </motion.div>
    );
}
