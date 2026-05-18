import { useEffect, useState } from 'react';
import BookingForm from './BookingForm';
import SessionList from './SessionList';
import TransactionSummary from './TransactionSummary';
import { fetchBookings, fetchSessions, fetchTransactions, createBooking } from '../services/api';

const sampleSessions = [
    {
        id: 1,
        booth_name: 'Booth A',
        start_time: '2026-06-01 10:00',
        end_time: '2026-06-01 12:00',
        price: 250000,
        status: 'active',
    },
    {
        id: 2,
        booth_name: 'Booth B',
        start_time: '2026-06-02 14:00',
        end_time: '2026-06-02 15:00',
        price: 175000,
        status: 'completed',
    },
];

const sampleTransactions = [
    {
        id: 1,
        description: 'Pembayaran booking sesi A',
        amount: 250000,
        type: 'income',
        created_at: '2026-05-15 11:50',
    },
    {
        id: 2,
        description: 'Biaya operasional booth B',
        amount: 45000,
        type: 'expense',
        created_at: '2026-05-16 09:30',
    },
];

const sampleBookings = [
    {
        id: 1,
        customer_name: 'Dinda',
        phone: '081234567890',
        event_date: '2026-06-10',
        location: 'Jakarta',
        package: 'Paket Premium',
        status: 'pending',
    },
];

export default function PhotoBoothApp() {
    const [sessions, setSessions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);

        Promise.all([
            fetchSessions().catch(() => sampleSessions),
            fetchTransactions().catch(() => sampleTransactions),
            fetchBookings().catch(() => sampleBookings),
        ])
            .then(([sessionsData, transactionsData, bookingsData]) => {
                setSessions(sessionsData);
                setTransactions(transactionsData);
                setBookings(bookingsData);
            })
            .catch(() => {
                setError('Tidak dapat memuat data API. Menampilkan data contoh.');
            })
            .finally(() => setLoading(false));
    }, []);

    async function handleBookingSubmit(formData) {
        try {
            const newBooking = await createBooking(formData);
            setBookings(current => [newBooking, ...current]);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Gagal menyimpan booking. Silakan coba lagi.');
        }
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif', padding: '24px' }}>
            <header style={{ maxWidth: 1120, margin: '0 auto 32px', padding: '24px', backgroundColor: '#ffffff', borderRadius: 18, boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)' }}>
                <h1 style={{ margin: 0, fontSize: '2rem' }}>Photobooth Management</h1>
                <p style={{ margin: '8px 0 0', color: '#475569' }}>Dashboard Laravel + React untuk booking, sesi, dan transaksi photobooth.</p>
            </header>

            <main style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: '24px' }}>
                <section style={{ display: 'grid', gap: '24px' }}>
                    <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 1fr' }}>
                        <div style={{ padding: '20px', borderRadius: 18, backgroundColor: '#ffffff', boxShadow: '0 12px 25px rgba(15, 23, 42, 0.05)' }}>
                            <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Booking Form</h2>
                            <BookingForm onSubmit={handleBookingSubmit} />
                        </div>

                        <div style={{ padding: '20px', borderRadius: 18, backgroundColor: '#ffffff', boxShadow: '0 12px 25px rgba(15, 23, 42, 0.05)' }}>
                            <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Transaksi Terakhir</h2>
                            <TransactionSummary transactions={transactions} loading={loading} />
                        </div>
                    </div>

                    <div style={{ padding: '20px', borderRadius: 18, backgroundColor: '#ffffff', boxShadow: '0 12px 25px rgba(15, 23, 42, 0.05)' }}>
                        <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Sesi Photobooth</h2>
                        <SessionList sessions={sessions} loading={loading} />
                    </div>
                </section>

                {error ? (
                    <div style={{ padding: '18px', borderRadius: 16, backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</div>
                ) : null}
            </main>
        </div>
    );
}
