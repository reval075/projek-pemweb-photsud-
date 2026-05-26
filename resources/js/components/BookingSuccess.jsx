import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Check, Search, Home } from 'lucide-react';
import {
    formatCurrency,
    formatDateTime,
    getStatusLabel,
    getStatusStyle,
    getPaymentStatusLabel,
} from '../utils/bookingDisplay';

export default function BookingSuccess({ booking, customerName }) {
    const [copied, setCopied] = useState(false);

    if (!booking?.booking_code) {
        return (
            <section className="py-24 px-6 min-h-[70vh] flex items-center justify-center">
                <div className="text-center max-w-lg mx-auto bg-white p-12 rounded-3xl shadow-xl border border-primary-50">
                    <p className="text-slate font-light mb-6 text-sm">
                        Booking berhasil, tetapi data kode tidak tersedia. Silakan hubungi admin atau coba lacak dengan data kontak Anda.
                    </p>
                    <Link
                        href="/track-booking"
                        className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                    >
                        Lacak Booking
                    </Link>
                </div>
            </section>
        );
    }

    const trackUrl = `/track-booking?code=${encodeURIComponent(booking.booking_code)}`;

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(booking.booking_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = booking.booking_code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const eventDisplay = booking.event_datetime
        ? formatDateTime(booking.event_datetime)
        : booking.event_date || '-';

    return (
        <section className="py-20 md:py-24 px-4 sm:px-6 min-h-[70vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl mx-auto"
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <p className="text-primary uppercase tracking-widest text-sm mb-3">Booking Submitted</p>
                    <h2 className="text-3xl md:text-4xl font-serif text-charcoal font-medium mb-2">
                        Booking Berhasil Diajukan!
                    </h2>
                    <p className="text-slate font-light text-sm">
                        Terima kasih, <strong className="text-charcoal">{customerName}</strong>.
                    </p>
                </div>

                {/* Booking code highlight */}
                <div className="bg-gradient-to-br from-primary/5 to-primary-50 border-2 border-primary/20 rounded-3xl p-6 md:p-8 mb-6 text-center shadow-lg shadow-primary/10">
                    <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                        Kode Booking Anda
                    </p>
                    <p className="text-2xl md:text-3xl font-mono font-bold text-charcoal tracking-wide break-all mb-4">
                        {booking.booking_code}
                    </p>
                    <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
                    >
                        {copied ? (
                            <>
                                <Check size={16} />
                                <span>Tersalin!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={16} />
                                <span>Salin Kode Booking</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Tracking instructions */}
                <div className="bg-white rounded-2xl border border-beige p-6 mb-6 shadow-sm">
                    <h3 className="font-serif text-lg text-charcoal mb-4">Langkah Selanjutnya</h3>
                    <ol className="text-sm text-slate font-light space-y-3 list-decimal list-inside leading-relaxed">
                        <li>
                            <strong className="text-charcoal">Simpan kode booking</strong> di atas — ini identitas utama untuk melacak pesanan Anda.
                        </li>
                        <li>
                            Gunakan halaman <strong className="text-charcoal">Lacak Booking</strong> dengan kode booking dan email atau nomor HP yang sama saat pengajuan.
                        </li>
                        <li>
                            Setelah admin menyetujui, Anda dapat memantau status dan mengunggah bukti pembayaran DP melalui halaman tracking.
                        </li>
                    </ol>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl border border-beige p-6 mb-8 shadow-sm">
                    <h3 className="font-serif text-lg text-charcoal mb-4 border-b border-beige pb-3">
                        Ringkasan Booking
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-warm-grey">Status</span>
                            <span
                                className={`inline-flex self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusStyle(booking.status)}`}
                            >
                                {getStatusLabel(booking.status)}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-warm-grey">Pembayaran</span>
                            <span className="text-charcoal font-medium">
                                {getPaymentStatusLabel(booking.payment_status)}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-warm-grey">Event</span>
                            <span className="text-charcoal font-medium text-right">{booking.event_name}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-warm-grey">Tanggal</span>
                            <span className="text-charcoal font-medium text-right">{eventDisplay}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-warm-grey">Paket</span>
                            <span className="text-charcoal font-medium text-right">
                                {booking.service_package?.name}
                                {booking.package_variant?.name ? ` — ${booking.package_variant.name}` : ''}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pt-2 border-t border-beige">
                            <span className="text-warm-grey font-medium">Total</span>
                            <span className="text-primary font-semibold text-right">
                                {formatCurrency(booking.total_price)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href={trackUrl}
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 text-center w-full sm:w-auto"
                    >
                        <Search size={18} />
                        Lacak Booking
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 border border-beige text-charcoal px-8 py-3.5 rounded-full hover:bg-beige transition-all text-center w-full sm:w-auto"
                    >
                        <Home size={18} />
                        Kembali ke Beranda
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
