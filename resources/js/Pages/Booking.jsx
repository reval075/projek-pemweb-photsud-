import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRight, ArrowLeft, MapPin, Clock, CheckCircle, Loader2, Calendar, Package, User } from 'lucide-react';

const STEPS = ['Branch & Package', 'Schedule', 'Your Details', 'Confirmation'];

function StepIndicator({ current, steps }) {
    return (
        <div className="flex items-center justify-center mb-12">
            {steps.map((label, i) => (
                <div key={i} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${i <= current ? 'bg-primary text-white' : 'bg-beige text-warm-grey'}`}>
                        {i < current ? <CheckCircle size={18} /> : i + 1}
                    </div>
                    <span className={`hidden md:block ml-2 text-sm ${i <= current ? 'text-charcoal' : 'text-warm-grey'}`}>{label}</span>
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

    const [branches, setBranches] = useState([]);
    const [packages, setPackages] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);

    const [form, setForm] = useState({
        branch_id: '', package_id: '', availability_id: '',
        customer_name: '', customer_email: '', customer_phone: '',
        event_date: '', event_location: '', notes: '',
    });

    useEffect(() => {
        Promise.all([
            axios.get('/api/branches'),
            axios.get('/api/packages'),
        ]).then(([branchRes, packageRes]) => {
            setBranches(branchRes.data.data);
            setPackages(packageRes.data.data);
        }).catch(() => setError('Gagal memuat data. Pastikan server backend berjalan.'))
          .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (form.branch_id) {
            const branch = branches.find(b => b.id == form.branch_id);
            if (branch && branch.booths && branch.booths.length > 0) {
                const boothIds = branch.booths.map(b => b.id);
                axios.get('/api/availabilities')
                    .then(res => {
                        const filtered = res.data.data.filter(a => boothIds.includes(a.booth_id));
                        setAvailabilities(filtered);
                    });
            } else {
                setAvailabilities([]);
            }
        }
    }, [form.branch_id, branches]);

    const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const selectedBranch = branches.find(b => b.id == form.branch_id);
    const selectedPackage = packages.find(p => p.id == form.package_id);
    const selectedSlot = availabilities.find(a => a.id == form.availability_id);

    const canNext = () => {
        if (step === 0) return form.branch_id && form.package_id;
        if (step === 1) return form.availability_id;
        if (step === 2) return form.customer_name && form.event_date;
        return true;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            await axios.post('/api/bookings', form);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <GuestLayout>
                <Head title="Book a Session" />
                <div className="min-h-[70vh] flex items-center justify-center">
                    <Loader2 size={40} className="animate-spin text-primary" />
                </div>
            </GuestLayout>
        );
    }

    if (success) {
        return (
            <GuestLayout>
                <Head title="Booking Confirmed" />
                <section className="py-24 px-6 min-h-[70vh] flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg mx-auto bg-white p-12 rounded-3xl shadow-xl">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-3xl font-serif mb-4">Booking Berhasil!</h2>
                        <p className="text-slate font-light mb-2">Terima kasih, <strong>{form.customer_name}</strong>.</p>
                        <p className="text-slate font-light mb-6">Booking Anda sedang diproses. Kami akan menghubungi Anda melalui email atau WhatsApp untuk konfirmasi pembayaran.</p>
                        <a href="/" className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-all">Kembali ke Home</a>
                    </motion.div>
                </section>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Book a Session" />
            <section className="py-24 px-6 max-w-5xl mx-auto min-h-[70vh]">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <p className="text-primary uppercase tracking-widest text-sm mb-4">Reserve Your Spot</p>
                    <h1 className="text-4xl md:text-5xl font-serif mb-4">Book a Session</h1>
                </motion.div>

                <StepIndicator current={step} steps={STEPS} />

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 text-center text-sm">{error}</div>
                )}

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-primary/5 border border-primary-50">
                    <AnimatePresence mode="wait">
                        {/* Step 0: Branch & Package */}
                        {step === 0 && (
                            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h3 className="text-xl font-serif mb-6 flex items-center"><MapPin size={20} className="mr-2 text-primary" /> Pilih Cabang</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                    {branches.map(branch => (
                                        <button key={branch.id} onClick={() => updateForm('branch_id', branch.id)}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all ${form.branch_id == branch.id ? 'border-primary bg-primary-50' : 'border-beige hover:border-primary-200'}`}>
                                            <h4 className="font-medium text-charcoal mb-1">{branch.name}</h4>
                                            <p className="text-sm text-slate">{branch.address || 'Alamat belum tersedia'}</p>
                                            {branch.operating_hours && <p className="text-xs text-warm-grey mt-2 flex items-center"><Clock size={12} className="mr-1" />{branch.operating_hours}</p>}
                                        </button>
                                    ))}
                                    {branches.length === 0 && <p className="text-slate col-span-2 text-center py-8">Belum ada cabang tersedia.</p>}
                                </div>

                                <h3 className="text-xl font-serif mb-6 flex items-center"><Package size={20} className="mr-2 text-primary" /> Pilih Paket</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {packages.map(pkg => (
                                        <button key={pkg.id} onClick={() => updateForm('package_id', pkg.id)}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all ${form.package_id == pkg.id ? 'border-primary bg-primary-50' : 'border-beige hover:border-primary-200'}`}>
                                            <h4 className="font-medium text-charcoal mb-1">{pkg.name}</h4>
                                            <p className="text-2xl font-serif text-primary mt-2">Rp {Number(pkg.price).toLocaleString('id-ID')}</p>
                                            {pkg.duration && <p className="text-xs text-warm-grey mt-2">{pkg.duration}</p>}
                                            {pkg.description && <p className="text-sm text-slate mt-2 line-clamp-2">{pkg.description}</p>}
                                        </button>
                                    ))}
                                    {packages.length === 0 && <p className="text-slate col-span-3 text-center py-8">Belum ada paket tersedia.</p>}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 1: Schedule */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h3 className="text-xl font-serif mb-6 flex items-center"><Calendar size={20} className="mr-2 text-primary" /> Pilih Jadwal</h3>
                                {availabilities.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {availabilities.map(slot => (
                                            <button key={slot.id} onClick={() => { updateForm('availability_id', slot.id); updateForm('event_date', slot.date); }}
                                                className={`p-6 rounded-2xl border-2 text-left transition-all ${form.availability_id == slot.id ? 'border-primary bg-primary-50' : 'border-beige hover:border-primary-200'}`}>
                                                <p className="font-medium text-charcoal">{new Date(slot.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                <p className="text-sm text-primary mt-1">{slot.start_time?.slice(0,5)} — {slot.end_time?.slice(0,5)}</p>
                                                {slot.booth && <p className="text-xs text-warm-grey mt-2">Booth: {slot.booth.name}</p>}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-slate">
                                        <Calendar size={48} className="mx-auto mb-4 text-warm-grey" />
                                        <p className="font-light">Belum ada jadwal tersedia untuk cabang ini.</p>
                                        <p className="text-sm text-warm-grey mt-2">Silakan pilih cabang lain atau hubungi kami.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 2: Customer Details */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h3 className="text-xl font-serif mb-6 flex items-center"><User size={20} className="mr-2 text-primary" /> Data Diri</h3>
                                <div className="space-y-6 max-w-xl">
                                    <div>
                                        <label className="block text-sm text-charcoal mb-2 font-medium">Nama Lengkap *</label>
                                        <input type="text" value={form.customer_name} onChange={e => updateForm('customer_name', e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white" placeholder="Masukkan nama Anda" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-charcoal mb-2 font-medium">Email</label>
                                        <input type="email" value={form.customer_email} onChange={e => updateForm('customer_email', e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white" placeholder="email@contoh.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-charcoal mb-2 font-medium">No. Telepon / WhatsApp</label>
                                        <input type="tel" value={form.customer_phone} onChange={e => updateForm('customer_phone', e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white" placeholder="0812-xxxx-xxxx" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-charcoal mb-2 font-medium">Tanggal Acara *</label>
                                        <input type="date" value={form.event_date} onChange={e => updateForm('event_date', e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-charcoal mb-2 font-medium">Lokasi Acara</label>
                                        <input type="text" value={form.event_location} onChange={e => updateForm('event_location', e.target.value)}
                                            className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white" placeholder="Opsional" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-charcoal mb-2 font-medium">Catatan</label>
                                        <textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)} rows={3}
                                            className="w-full px-5 py-3 rounded-xl border-2 border-beige focus:border-primary focus:outline-none transition-colors bg-off-white resize-none" placeholder="Permintaan khusus..." />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Confirmation */}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h3 className="text-xl font-serif mb-6 flex items-center"><CheckCircle size={20} className="mr-2 text-primary" /> Konfirmasi Booking</h3>
                                <div className="bg-primary-50 rounded-2xl p-8 space-y-4">
                                    <div className="flex justify-between border-b border-primary-100 pb-3"><span className="text-warm-grey">Cabang</span><span className="font-medium">{selectedBranch?.name || '-'}</span></div>
                                    <div className="flex justify-between border-b border-primary-100 pb-3"><span className="text-warm-grey">Paket</span><span className="font-medium">{selectedPackage?.name || '-'}</span></div>
                                    <div className="flex justify-between border-b border-primary-100 pb-3"><span className="text-warm-grey">Jadwal</span><span className="font-medium">{selectedSlot ? `${selectedSlot.date} (${selectedSlot.start_time?.slice(0,5)} - ${selectedSlot.end_time?.slice(0,5)})` : '-'}</span></div>
                                    <div className="flex justify-between border-b border-primary-100 pb-3"><span className="text-warm-grey">Nama</span><span className="font-medium">{form.customer_name}</span></div>
                                    <div className="flex justify-between border-b border-primary-100 pb-3"><span className="text-warm-grey">Tanggal Acara</span><span className="font-medium">{form.event_date}</span></div>
                                    <div className="flex justify-between pt-2"><span className="text-charcoal font-medium text-lg">Total</span><span className="text-2xl font-serif text-primary">Rp {selectedPackage ? Number(selectedPackage.price).toLocaleString('id-ID') : '0'}</span></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-10 pt-8 border-t border-beige">
                        <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${step === 0 ? 'text-warm-grey cursor-not-allowed' : 'text-charcoal hover:bg-beige'}`}>
                            <ArrowLeft size={16} /> <span>Kembali</span>
                        </button>
                        {step < 3 ? (
                            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                                className={`flex items-center space-x-2 px-8 py-3 rounded-full transition-all ${canNext() ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-beige text-warm-grey cursor-not-allowed'}`}>
                                <span>Lanjut</span> <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={submitting}
                                className="flex items-center space-x-2 px-8 py-3 rounded-full bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-50">
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                <span>{submitting ? 'Memproses...' : 'Konfirmasi Booking'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
