import GuestLayout from '@/Layouts/GuestLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';
import { Loader2, Search, ArrowRight } from 'lucide-react';
import { TRACKING_SESSION_KEY } from '../constants/tracking';

export default function TrackBooking() {
    const [form, setForm] = useState({
        booking_code: '',
        contact: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (fieldErrors[key]) {
            setFieldErrors((prev) => ({ ...prev, [key]: null }));
        }
        if (error) {
            setError('');
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!form.booking_code.trim()) {
            errors.booking_code = 'Kode booking wajib diisi.';
        }

        if (!form.contact.trim()) {
            errors.contact = 'Email atau nomor HP wajib diisi.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        const bookingCode = form.booking_code.trim();
        const contact = form.contact.trim();

        try {
            const response = await axios.post('/api/bookings/track', {
                booking_code: bookingCode,
                contact,
            });

            if (response.data?.success && response.data?.data) {
                sessionStorage.setItem(
                    TRACKING_SESSION_KEY,
                    JSON.stringify({
                        booking_code: bookingCode,
                        contact,
                        data: response.data.data,
                        fetchedAt: Date.now(),
                    })
                );

                router.visit('/track-booking/detail');
                return;
            }

            setError('Kode booking atau kontak tidak sesuai.');
        } catch (err) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const apiErrors = err.response.data.errors;
                setFieldErrors({
                    booking_code: apiErrors.booking_code?.[0] || null,
                    contact: apiErrors.contact?.[0] || null,
                });
            }

            setError(
                err.response?.data?.message ||
                    'Data booking tidak ditemukan. Periksa kembali kode booking dan kontak Anda.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestLayout>
            <Head title="Lacak Booking" />

            <section className="py-24 px-6 min-h-[70vh] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg"
                >
                    <div className="text-center mb-10">
                        <p className="text-primary uppercase tracking-widest text-sm mb-4">Guest Tracking</p>
                        <h1 className="text-4xl font-serif text-charcoal font-medium mb-3">Lacak Booking Anda</h1>
                        <p className="text-slate font-light text-sm leading-relaxed">
                            Masukkan kode booking dan email atau nomor HP yang digunakan saat pengajuan booking.
                        </p>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-primary/5 border border-primary-50">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div>
                                <label htmlFor="booking_code" className="block text-sm font-medium text-charcoal mb-2">
                                    Kode Booking
                                </label>
                                <input
                                    id="booking_code"
                                    type="text"
                                    value={form.booking_code}
                                    onChange={(e) => updateForm('booking_code', e.target.value)}
                                    placeholder="Contoh: MEMO-20260610-ABC12"
                                    className={`w-full px-4 py-3 rounded-xl border bg-off-white/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                                        fieldErrors.booking_code ? 'border-red-300' : 'border-beige'
                                    }`}
                                    disabled={loading}
                                    autoComplete="off"
                                />
                                {fieldErrors.booking_code && (
                                    <p className="text-red-600 text-xs mt-2">{fieldErrors.booking_code}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-charcoal mb-2">
                                    Email atau Nomor HP
                                </label>
                                <input
                                    id="contact"
                                    type="text"
                                    value={form.contact}
                                    onChange={(e) => updateForm('contact', e.target.value)}
                                    placeholder="email@example.com atau 0812xxxxxxx"
                                    className={`w-full px-4 py-3 rounded-xl border bg-off-white/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                                        fieldErrors.contact ? 'border-red-300' : 'border-beige'
                                    }`}
                                    disabled={loading}
                                    autoComplete="off"
                                />
                                {fieldErrors.contact && (
                                    <p className="text-red-600 text-xs mt-2">{fieldErrors.contact}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center space-x-2 bg-primary text-white px-8 py-3.5 rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Mencari booking...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search size={18} />
                                        <span>Lacak Booking</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-xs text-warm-grey text-center mt-6 leading-relaxed">
                            Data kontak harus sama persis dengan yang Anda gunakan saat mengajukan booking.
                        </p>
                    </div>
                </motion.div>
            </section>
        </GuestLayout>
    );
}
