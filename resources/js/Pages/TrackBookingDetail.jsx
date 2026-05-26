import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
    Loader2,
    Calendar,
    MapPin,
    Package,
    CreditCard,
    RefreshCw,
    AlertCircle,
    Clock,
    User,
} from 'lucide-react';
import { TRACKING_SESSION_KEY } from '../constants/tracking';
import PaymentProofUpload from '../components/PaymentProofUpload';
import {
    formatCurrency,
    formatDateTime,
    getPaymentStatusLabel,
    getPaymentVerificationStyle,
    getStatusLabel,
    getStatusMessage,
    getStatusStyle,
} from '../utils/bookingDisplay';

function SectionCard({ title, icon: Icon, children }) {
    return (
        <div className="bg-white rounded-2xl border border-beige p-6 md:p-8 shadow-sm">
            <h3 className="font-serif text-lg text-charcoal mb-5 flex items-center border-b border-beige pb-3">
                {Icon && <Icon size={20} className="mr-2 text-primary shrink-0" />}
                {title}
            </h3>
            {children}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 py-2 border-b border-beige/50 last:border-0">
            <span className="text-sm text-warm-grey">{label}</span>
            <span className="text-sm text-charcoal font-medium text-left sm:text-right break-words">{value || '-'}</span>
        </div>
    );
}

function StatusBadge({ label, styleClass }) {
    return (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase border ${styleClass}`}>
            {label}
        </span>
    );
}

export default function TrackBookingDetail() {
    const [session, setSession] = useState(null);
    const [checking, setChecking] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [fetchError, setFetchError] = useState('');

    const loadSession = useCallback(() => {
        const raw = sessionStorage.getItem(TRACKING_SESSION_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        if (!parsed?.booking_code || !parsed?.data) {
            sessionStorage.removeItem(TRACKING_SESSION_KEY);
            return null;
        }

        return parsed;
    }, []);

    useEffect(() => {
        try {
            const parsed = loadSession();
            if (!parsed) {
                router.visit('/track-booking');
                return;
            }
            setSession(parsed);
        } catch {
            sessionStorage.removeItem(TRACKING_SESSION_KEY);
            router.visit('/track-booking');
        } finally {
            setChecking(false);
        }
    }, [loadSession]);

    const refreshTrackingData = useCallback(async () => {
        if (!session?.booking_code || !session?.contact) {
            return false;
        }

        const response = await axios.post('/api/bookings/track', {
            booking_code: session.booking_code,
            contact: session.contact,
        });

        if (response.data?.success && response.data?.data) {
            const updated = {
                booking_code: session.booking_code,
                contact: session.contact,
                data: response.data.data,
                fetchedAt: Date.now(),
            };
            sessionStorage.setItem(TRACKING_SESSION_KEY, JSON.stringify(updated));
            setSession(updated);
            return true;
        }

        return false;
    }, [session?.booking_code, session?.contact]);

    const handleRefresh = async () => {
        setRefreshing(true);
        setFetchError('');

        try {
            const ok = await refreshTrackingData();
            if (!ok) {
                setFetchError('Gagal memperbarui data booking.');
            }
        } catch {
            setFetchError('Gagal memperbarui data booking. Silakan coba lagi.');
        } finally {
            setRefreshing(false);
        }
    };

    if (checking) {
        return (
            <GuestLayout>
                <Head title="Memuat Detail Booking" />
                <div className="min-h-[70vh] flex items-center justify-center">
                    <Loader2 size={40} className="animate-spin text-primary" />
                </div>
            </GuestLayout>
        );
    }

    if (!session?.data) {
        return null;
    }

    const booking = session.data;
    const statusMessage = getStatusMessage(booking);
    const addons = booking.addons || [];
    const payments = booking.payments || [];

    const addonsTotal = addons.reduce(
        (sum, addon) => sum + Number(addon.price || 0) * Number(addon.quantity || 0),
        0
    );
    const packageSubtotal = booking.package_variant?.price
        ? Number(booking.package_variant.price)
        : Math.max(Number(booking.total_price || 0) - addonsTotal, 0);

    const canShowUploadSection =
        booking.can_upload_proof &&
        !booking.is_dp_expired &&
        !['expired', 'cancelled', 'rejected', 'completed'].includes(booking.status);

    const hasPendingPayment = payments.some((p) => p.status === 'pending');

    return (
        <GuestLayout>
            <Head title={`Detail Booking ${booking.booking_code}`} />

            <section className="py-20 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto min-h-[70vh]">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-10">
                        <p className="text-primary uppercase tracking-widest text-sm mb-3">Detail Tracking</p>
                        <h1 className="text-3xl md:text-4xl font-serif text-charcoal font-medium mb-2">
                            Status Booking Anda
                        </h1>
                        <p className="text-primary font-semibold text-lg">{booking.booking_code}</p>
                    </div>

                    {fetchError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 text-sm text-center">
                            {fetchError}
                        </div>
                    )}

                    {/* Status overview */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 border border-primary-50 p-6 md:p-8 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge
                                    label={getStatusLabel(booking.status)}
                                    styleClass={getStatusStyle(booking.status)}
                                />
                                <StatusBadge
                                    label={getPaymentStatusLabel(booking.payment_status)}
                                    styleClass="bg-off-white text-charcoal border-beige"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="inline-flex items-center justify-center gap-2 text-sm text-primary hover:text-primary-dark border border-beige px-4 py-2 rounded-full transition-colors disabled:opacity-60"
                            >
                                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                                {refreshing ? 'Memperbarui...' : 'Perbarui Data'}
                            </button>
                        </div>

                        {statusMessage && (
                            <p className="text-sm text-slate font-light leading-relaxed border-t border-beige pt-4">
                                {statusMessage}
                            </p>
                        )}

                        {booking.status === 'waiting_dp' && booking.dp_expired_at && (
                            <p className="text-xs font-semibold text-blue-600 mt-3 flex items-center gap-1">
                                <Clock size={14} />
                                Batas pembayaran DP: {formatDateTime(booking.dp_expired_at)}
                            </p>
                        )}

                        {booking.status === 'expired' && (
                            <p className="text-xs font-semibold text-orange-600 mt-3 flex items-center gap-1">
                                <AlertCircle size={14} />
                                Booking ini telah kedaluwarsa karena batas waktu DP terlewati.
                            </p>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Booking & customer info */}
                        <SectionCard title="Informasi Booking" icon={User}>
                            <InfoRow label="Nama Pelanggan" value={booking.customer_name} />
                            <InfoRow label="Email" value={booking.customer_email} />
                            <InfoRow label="Nomor HP" value={booking.customer_phone} />
                            <InfoRow label="Diajukan Pada" value={formatDateTime(booking.created_at)} />
                            {booking.approved_at && (
                                <InfoRow label="Disetujui Pada" value={formatDateTime(booking.approved_at)} />
                            )}
                            {booking.confirmed_at && (
                                <InfoRow label="Dikonfirmasi Pada" value={formatDateTime(booking.confirmed_at)} />
                            )}
                            {booking.cancelled_at && (
                                <InfoRow label="Dibatalkan / Expired Pada" value={formatDateTime(booking.cancelled_at)} />
                            )}
                        </SectionCard>

                        {/* Event */}
                        <SectionCard title="Detail Event" icon={Calendar}>
                            <InfoRow label="Nama Event" value={booking.event_name} />
                            <InfoRow label="Lokasi" value={booking.event_location} />
                            <InfoRow label="Tanggal & Waktu" value={formatDateTime(booking.event_datetime)} />
                        </SectionCard>

                        {/* Package */}
                        <SectionCard title="Paket & Layanan" icon={Package}>
                            <InfoRow label="Paket Jasa" value={booking.service_package?.name} />
                            <InfoRow label="Varian" value={booking.package_variant?.name} />
                            {booking.package_variant?.duration_hours != null && (
                                <InfoRow
                                    label="Durasi Operasional"
                                    value={`${booking.package_variant.duration_hours} Jam`}
                                />
                            )}
                            {booking.package_variant?.is_unlimited ? (
                                <InfoRow label="Batas Cetak" value="Unlimited" />
                            ) : booking.package_variant?.print_limit != null ? (
                                <InfoRow
                                    label="Batas Cetak"
                                    value={`${booking.package_variant.print_limit} Lembar`}
                                />
                            ) : null}
                            <InfoRow
                                label="Template Frame"
                                value={
                                    booking.selected_template
                                        ? `${booking.selected_template.name} (${booking.selected_template.size})`
                                        : '-'
                                }
                            />

                            {addons.length > 0 ? (
                                <div className="mt-4 bg-off-white rounded-xl p-4 border border-beige/60">
                                    <strong className="block text-primary text-sm mb-3">Addons Terpilih</strong>
                                    <ul className="space-y-2 text-sm text-slate">
                                        {addons.map((addon) => (
                                            <li
                                                key={addon.id}
                                                className="flex flex-col sm:flex-row sm:justify-between gap-1"
                                            >
                                                <span>
                                                    {addon.name} × {addon.quantity}
                                                </span>
                                                <span className="font-medium text-charcoal">
                                                    {formatCurrency(
                                                        Number(addon.price) * Number(addon.quantity)
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-sm text-warm-grey mt-4">Tidak ada addon tambahan.</p>
                            )}
                        </SectionCard>

                        {canShowUploadSection && (
                            <PaymentProofUpload
                                bookingCode={session.booking_code}
                                contact={session.contact}
                                booking={booking}
                                onUploadSuccess={refreshTrackingData}
                            />
                        )}

                        {!canShowUploadSection && hasPendingPayment && (
                            <div className="bg-blue-50 border border-blue-100 text-blue-700 px-5 py-4 rounded-2xl text-sm">
                                Bukti pembayaran Anda sedang menunggu verifikasi admin.
                            </div>
                        )}

                        {/* Payment summary */}
                        <SectionCard title="Ringkasan Pembayaran" icon={CreditCard}>
                            <InfoRow label="Subtotal Paket" value={formatCurrency(packageSubtotal)} />
                            <InfoRow label="Total Addons" value={formatCurrency(addonsTotal)} />
                            <InfoRow
                                label="Total Pembayaran"
                                value={formatCurrency(booking.total_price)}
                            />

                            <div className="mt-6">
                                <h4 className="text-sm font-semibold text-charcoal mb-3">Riwayat Pembayaran</h4>
                                {payments.length === 0 ? (
                                    <p className="text-sm text-warm-grey bg-off-white rounded-xl p-4 border border-beige/60">
                                        Belum ada riwayat pembayaran.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {payments.map((payment) => (
                                            <div
                                                key={payment.id}
                                                className="bg-off-white rounded-xl p-4 border border-beige/60 text-sm"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                    <span className="font-medium text-charcoal uppercase text-xs">
                                                        {payment.payment_type?.replace('_', ' ')}
                                                    </span>
                                                    <StatusBadge
                                                        label={payment.status}
                                                        styleClass={getPaymentVerificationStyle(payment.status)}
                                                    />
                                                </div>
                                                <p className="text-charcoal font-semibold mb-1">
                                                    {formatCurrency(payment.amount)}
                                                </p>
                                                <p className="text-warm-grey text-xs">
                                                    Metode: {payment.payment_method || '-'}
                                                </p>
                                                <p className="text-warm-grey text-xs mt-1">
                                                    Diajukan: {formatDateTime(payment.created_at)}
                                                </p>
                                                {payment.verified_at && (
                                                    <p className="text-warm-grey text-xs">
                                                        Diverifikasi: {formatDateTime(payment.verified_at)}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </SectionCard>

                        {booking.notes && (
                            <SectionCard title="Catatan" icon={MapPin}>
                                <p className="text-sm text-slate leading-relaxed whitespace-pre-wrap">
                                    {booking.notes}
                                </p>
                            </SectionCard>
                        )}
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/track-booking"
                            className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 text-center w-full sm:w-auto"
                        >
                            Lacak Booking Lain
                        </Link>
                        <Link
                            href="/booking"
                            className="inline-block border border-beige text-charcoal px-8 py-3 rounded-full hover:bg-beige transition-all text-center w-full sm:w-auto"
                        >
                            Buat Booking Baru
                        </Link>
                    </div>
                </motion.div>
            </section>
        </GuestLayout>
    );
}
