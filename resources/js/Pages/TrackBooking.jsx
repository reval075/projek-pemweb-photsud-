import GuestLayout from '@/Layouts/GuestLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Search, ArrowRight } from 'lucide-react';
import { TRACKING_SESSION_KEY } from '../constants/tracking';
import { art } from '@/design/artDirection';
import EditorialStack from '@/components/art/EditorialStack';
import ChunkyButton from '@/components/art/ChunkyButton';
import LayeredCard from '@/components/art/LayeredCard';
import { motionTokens } from '@/motion';

export default function TrackBooking() {
    const [form, setForm] = useState({
        booking_code: '',
        contact: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [codePrefilled, setCodePrefilled] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
            setForm((prev) => ({ ...prev, booking_code: code.trim() }));
            setCodePrefilled(true);
        }
    }, []);

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

    const inputClass = (hasError) =>
        `w-full px-5 py-4 rounded-xl border-2 bg-white font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
            hasError ? 'border-red-400' : 'border-charcoal/15'
        }`;

    return (
        <GuestLayout>
            <Head title="Lacak Booking" />

            <section className={`${art.section.pad} min-h-[85vh] flex items-center pt-28 md:pt-36`}>
                <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: motionTokens.duration.cinematic, ease: motionTokens.ease.out }}
                    className="w-full max-w-xl mx-auto"
                >
                    <div className="mb-10 md:mb-14">
                        <p className={`${art.type.label} mb-4`}>guest tracking</p>
                        <EditorialStack lines={['Lacak', 'Booking']} lineClassName="type-display block" animate={false} />
                        <p className={`${art.type.body} mt-6`}>
                            Masukkan kode booking dan email atau nomor HP yang digunakan saat pengajuan.
                        </p>
                        {codePrefilled && (
                            <p className="text-sm font-bold text-primary mt-4 uppercase tracking-wide">
                                Kode booking sudah terisi — lengkapi kontak Anda.
                            </p>
                        )}
                    </div>

                    <LayeredCard className="p-8 md:p-10">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div>
                                <label htmlFor="booking_code" className={`${art.type.label} block mb-3 text-charcoal`}>
                                    Kode Booking
                                </label>
                                <input
                                    id="booking_code"
                                    type="text"
                                    value={form.booking_code}
                                    onChange={(e) => updateForm('booking_code', e.target.value)}
                                    placeholder="MEMO-20260610-ABC12"
                                    className={inputClass(fieldErrors.booking_code)}
                                    disabled={loading}
                                    autoComplete="off"
                                />
                                {fieldErrors.booking_code && (
                                    <p className="text-red-600 text-xs mt-2 font-medium">{fieldErrors.booking_code}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="contact" className={`${art.type.label} block mb-3 text-charcoal`}>
                                    Email atau Nomor HP
                                </label>
                                <input
                                    id="contact"
                                    type="text"
                                    value={form.contact}
                                    onChange={(e) => updateForm('contact', e.target.value)}
                                    placeholder="email@example.com atau 0812xxxxxxx"
                                    className={inputClass(fieldErrors.contact)}
                                    disabled={loading}
                                    autoComplete="off"
                                />
                                {fieldErrors.contact && (
                                    <p className="text-red-600 text-xs mt-2 font-medium">{fieldErrors.contact}</p>
                                )}
                            </div>

                            <ChunkyButton type="submit" disabled={loading} className="w-full justify-center">
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> Mencari...
                                    </>
                                ) : (
                                    <>
                                        <Search size={20} /> Lacak Booking <ArrowRight size={20} />
                                    </>
                                )}
                            </ChunkyButton>
                        </form>

                        <p className="text-xs text-warm-grey text-center mt-8 leading-relaxed">
                            Data kontak harus sama persis dengan yang digunakan saat mengajukan booking.
                        </p>
                    </LayeredCard>
                </motion.div>
            </section>
        </GuestLayout>
    );
}
