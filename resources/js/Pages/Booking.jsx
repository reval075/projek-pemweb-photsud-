import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, ArrowLeft, MapPin, CheckCircle, Loader2, Calendar, Package, User, ChevronLeft, ChevronRight } from 'lucide-react';

const STEPS = ['Select Date', 'Choose Package', 'Event Details', 'Confirmation'];

function StepIndicator({ current, steps }) {
    return (
        <div className="flex items-center justify-center mb-12">
            {steps.map((label, i) => (
                <div key={i} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${i <= current ? 'bg-primary text-white' : 'bg-beige text-warm-grey'}`}>
                        {i < current ? <CheckCircle size={18} /> : i + 1}
                    </div>
                    <span className={`hidden md:block ml-2 text-sm ${i <= current ? 'text-charcoal font-medium' : 'text-warm-grey font-light'}`}>{label}</span>
                    {i < steps.length - 1 && <div className={`w-8 md:w-16 h-px mx-3 ${i < current ? 'bg-primary' : 'bg-beige'}`} />}
                </div>
            ))}
        </div>
    );
}

export default function Booking() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [packages, setPackages] = useState([]);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const [form, setForm] = useState({
        service_package_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        event_name: '',
        event_location: '',
        event_date: '',
        notes: '',
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Fetch calendar availability whenever month/year changes
    useEffect(() => {
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);

        // Format dates as YYYY-MM-DD
        const formatDateStr = (d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        const startStr = formatDateStr(startOfMonth);
        const endStr = formatDateStr(endOfMonth);

        axios.get(`/api/availabilities?start_date=${startStr}&end_date=${endStr}`)
            .then(res => {
                setUnavailableDates(res.data.unavailable_dates || []);
                setBookedDates(res.data.booked_dates || []);
            })
            .catch(() => setError('Gagal memuat jadwal ketersediaan.'));
    }, [year, month]);

    // Fetch packages on mount
    useEffect(() => {
        setLoading(true);
        axios.get('/api/packages')
            .then(res => {
                setPackages(res.data.data);
            })
            .catch(() => setError('Gagal memuat data paket jasa.'))
            .finally(() => setLoading(false));
    }, []);

    const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const selectedPackage = packages.find(p => p.id == form.service_package_id);

    // Helpers to calculate calendar grid
    const getDaysInMonth = () => {
        const firstDayIndex = new Date(year, month, 1).getDay();
        const numDays = new Date(year, month + 1, 0).getDate();
        const days = [];

        // Padding for previous month days
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(null);
        }

        // Days of current month
        for (let i = 1; i <= numDays; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getDateStatus = (date) => {
        if (!date) return 'empty';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dCopy = new Date(date);
        dCopy.setHours(0, 0, 0, 0);

        if (dCopy < today) {
            return 'unavailable'; // Past dates are unavailable
        }

        const yyyy = dCopy.getFullYear();
        const mm = String(dCopy.getMonth() + 1).padStart(2, '0');
        const dd = String(dCopy.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        if (unavailableDates.includes(dateStr)) return 'unavailable';
        if (bookedDates.includes(dateStr)) return 'booked';

        return 'available';
    };

    const handleDateClick = (date) => {
        const status = getDateStatus(date);
        if (status === 'available') {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            setSelectedDate(date);
            updateForm('event_date', dateStr);
            setStep(1); // Advance to package selection
        }
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const prevMonth = () => {
        const today = new Date();
        if (year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth())) {
            setCurrentDate(new Date(year, month - 1, 1));
        }
    };

    const canNext = () => {
        if (step === 0) return form.event_date !== '';
        if (step === 1) return form.service_package_id !== '';
        if (step === 2) return form.customer_name && form.customer_email && form.customer_phone && form.event_name && form.event_location;
        return true;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            await axios.post('/api/bookings', form);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat memproses booking.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <GuestLayout>
                <Head title="Book a Photographer" />
                <div className="min-h-[70vh] flex items-center justify-center">
                    <Loader2 size={40} className="animate-spin text-primary" />
                </div>
            </GuestLayout>
        );
    }

    if (success) {
        return (
            <GuestLayout>
                <Head title="Booking Submitted" />
                <section className="py-24 px-6 min-h-[70vh] flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg mx-auto bg-white p-12 rounded-3xl shadow-xl border border-primary-50">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-3xl font-serif mb-4 text-charcoal">Booking Berhasil Diajukan!</h2>
                        <p className="text-slate font-light mb-2">Terima kasih, <strong>{form.customer_name}</strong>.</p>
                        <p className="text-slate font-light mb-6 text-sm">
                            Pengajuan booking Anda untuk tanggal <strong>{form.event_date}</strong> sedang dalam proses review admin. Kami akan mengirimkan notifikasi persetujuan beserta link pembayaran ke email atau WhatsApp Anda.
                        </p>
                        <a href="/" className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">Kembali ke Home</a>
                    </motion.div>
                </section>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Book a Photobooth Vendor" />
            <section className="py-24 px-6 max-w-5xl mx-auto min-h-[70vh]">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <p className="text-primary uppercase tracking-widest text-sm mb-4">Vendor Event Booking</p>
                    <h1 className="text-4xl md:text-5xl font-serif mb-4 text-charcoal">Book Our Services</h1>
                </motion.div>

                <StepIndicator current={step} steps={STEPS} />

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 text-center text-sm">{error}</div>
                )}

                <div className="bg-white p-6 md:p-12 rounded-3xl shadow-xl shadow-primary/5 border border-primary-50">
                    <AnimatePresence mode="wait">
                        {/* Step 0: Availability Calendar */}
                        {step === 0 && (
                            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h3 className="text-xl font-serif mb-6 flex items-center"><Calendar size={20} className="mr-2 text-primary" /> 1. Pilih Tanggal Acara Anda</h3>
                                
                                <div className="max-w-2xl mx-auto border border-beige rounded-2xl p-6 bg-off-white/50">
                                    <div className="flex items-center justify-between mb-8">
                                        <h4 className="font-serif text-lg text-charcoal">
                                            {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                        </h4>
                                        <div className="flex space-x-2">
                                            <button onClick={prevMonth} className="p-2 rounded-full border border-beige hover:bg-beige text-charcoal transition-colors">
                                                <ChevronLeft size={18} />
                                            </button>
                                            <button onClick={nextMonth} className="p-2 rounded-full border border-beige hover:bg-beige text-charcoal transition-colors">
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Days of week */}
                                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-warm-grey uppercase mb-4">
                                        <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
                                    </div>

                                    {/* Days grid */}
                                    <div className="grid grid-cols-7 gap-2">
                                        {getDaysInMonth().map((date, idx) => {
                                            if (!date) return <div key={`empty-${idx}`} />;
                                            const status = getDateStatus(date);
                                            const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

                                            let btnClasses = "aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all ";
                                            if (status === 'unavailable') {
                                                btnClasses += "bg-beige/40 text-warm-grey/50 line-through cursor-not-allowed";
                                            } else if (status === 'booked') {
                                                btnClasses += "bg-red-50 text-red-400 border border-red-100 cursor-not-allowed";
                                            } else {
                                                btnClasses += "bg-white border border-beige text-charcoal hover:border-primary hover:text-primary cursor-pointer ";
                                                if (isSelected) {
                                                    btnClasses += "ring-2 ring-primary bg-primary-50 border-primary text-primary font-semibold";
                                                }
                                            }

                                            return (
                                                <button key={idx} onClick={() => handleDateClick(date)} disabled={status !== 'available'} className={btnClasses}>
                                                    <span>{date.getDate()}</span>
                                                    {status === 'booked' && <span className="text-[9px] uppercase tracking-tighter text-red-500 font-medium scale-90">Booked</span>}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex justify-center space-x-6 mt-8 pt-6 border-t border-beige text-xs">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full border border-beige bg-white"></div>
                                            <span className="text-slate font-light">Available</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-red-50 border border-red-100"></div>
                                            <span className="text-slate font-light">Booked</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-beige/40"></div>
                                            <span className="text-slate font-light">Unavailable</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 1: Package Selection */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h3 className="text-xl font-serif mb-6 flex items-center"><Package size={20} className="mr-2 text-primary" /> 2. Pilih Jenis Jasa / Paket</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {packages.map(pkg => (
                                        <button key={pkg.id} onClick={() => updateForm('service_package_id', pkg.id)}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${form.service_package_id == pkg.id ? 'border-primary bg-primary-50/50' : 'border-beige hover:border-primary-200 bg-white'}`}>
                                            <h4 className="font-serif text-lg text-charcoal mb-1">{pkg.name}</h4>
                                            <p className="text-2xl font-serif text-primary mt-2">Rp {Number(pkg.price).toLocaleString('id-ID')}</p>
                                            {pkg.duration && <p className="text-xs text-warm-grey mt-2 font-medium uppercase tracking-wider">Durasi: {pkg.duration}</p>}
                                            {pkg.description && <p className="text-sm text-slate mt-2 line-clamp-3 font-light leading-relaxed">{pkg.description}</p>}
                                        </button>
                                    ))}
                                    {packages.length === 0 && <p className="text-slate col-span-2 text-center py-8">Belum ada paket tersedia.</p>}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Event Details & Customer Data */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h3 className="text-xl font-serif mb-6 flex items-center"><User size={20} className="mr-2 text-primary" /> 3. Lengkapi Data Booking & Acara</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <h4 className="font-serif text-md text-primary uppercase tracking-wider border-b border-beige pb-2">Informasi Kontak</h4>
                                        <div>
                                            <label className="block text-sm text-charcoal mb-2 font-medium">Nama Lengkap *</label>
                                            <input type="text" value={form.customer_name} onChange={e => updateForm('customer_name', e.target.value)}
                                                className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white" placeholder="Nama Anda" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-charcoal mb-2 font-medium">Email *</label>
                                            <input type="email" value={form.customer_email} onChange={e => updateForm('customer_email', e.target.value)}
                                                className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white" placeholder="email@contoh.com" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-charcoal mb-2 font-medium">No. Telepon / WhatsApp *</label>
                                            <input type="tel" value={form.customer_phone} onChange={e => updateForm('customer_phone', e.target.value)}
                                                className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white" placeholder="0812-xxxx-xxxx" />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="font-serif text-md text-primary uppercase tracking-wider border-b border-beige pb-2">Informasi Acara</h4>
                                        <div>
                                            <label className="block text-sm text-charcoal mb-2 font-medium">Nama Event *</label>
                                            <input type="text" value={form.event_name} onChange={e => updateForm('event_name', e.target.value)}
                                                className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white" placeholder="Contoh: Wedding John & Jane" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-charcoal mb-2 font-medium">Lokasi Event / Detail Alamat *</label>
                                            <input type="text" value={form.event_location} onChange={e => updateForm('event_location', e.target.value)}
                                                className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white" placeholder="Alamat lengkap lokasi acara" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-charcoal mb-2 font-medium">Catatan Tambahan</label>
                                            <textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)} rows={3}
                                                className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white resize-none" placeholder="Permintaan khusus / instruksi vendor..." />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Confirmation Summary */}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h3 className="text-xl font-serif mb-6 flex items-center"><CheckCircle size={20} className="mr-2 text-primary" /> 4. Konfirmasi Detail Pengajuan</h3>
                                
                                <div className="bg-primary-50/50 rounded-2xl p-8 space-y-4 border border-primary-50 max-w-2xl mx-auto">
                                    <div className="flex justify-between border-b border-primary-100/50 pb-3">
                                        <span className="text-warm-grey font-light">Tanggal Acara</span>
                                        <span className="font-semibold text-charcoal">{form.event_date}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-primary-100/50 pb-3">
                                        <span className="text-warm-grey font-light">Jenis Jasa / Paket</span>
                                        <span className="font-semibold text-charcoal">{selectedPackage?.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-primary-100/50 pb-3">
                                        <span className="text-warm-grey font-light">Nama Event</span>
                                        <span className="font-semibold text-charcoal">{form.event_name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-primary-100/50 pb-3">
                                        <span className="text-warm-grey font-light">Lokasi Acara</span>
                                        <span className="font-semibold text-charcoal">{form.event_location}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-primary-100/50 pb-3">
                                        <span className="text-warm-grey font-light">Nama Pemesan</span>
                                        <span className="font-semibold text-charcoal">{form.customer_name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-primary-100/50 pb-3">
                                        <span className="text-warm-grey font-light">WhatsApp</span>
                                        <span className="font-semibold text-charcoal">{form.customer_phone}</span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span className="text-charcoal font-semibold text-lg">Estimasi Biaya Jasa</span>
                                        <span className="text-2xl font-serif text-primary font-semibold">Rp {selectedPackage ? Number(selectedPackage.price).toLocaleString('id-ID') : '0'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-10 pt-8 border-t border-beige">
                        <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${step === 0 ? 'text-warm-grey cursor-not-allowed opacity-50' : 'text-charcoal hover:bg-beige'}`}>
                            <ArrowLeft size={16} /> <span>Kembali</span>
                        </button>
                        {step < 3 ? (
                            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                                className={`flex items-center space-x-2 px-8 py-3 rounded-full transition-all ${canNext() ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20' : 'bg-beige text-warm-grey cursor-not-allowed'}`}>
                                <span>Lanjut</span> <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={submitting}
                                className="flex items-center space-x-2 px-8 py-3 rounded-full bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-50 shadow-lg shadow-primary/20">
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                <span>{submitting ? 'Memproses...' : 'Ajukan Booking Vendor'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
