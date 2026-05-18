export default function SessionList({ sessions, loading }) {
    if (loading) {
        return <p>Memuat sesi...</p>;
    }

    if (!sessions || sessions.length === 0) {
        return <p>Tidak ada sesi photobooth untuk ditampilkan.</p>;
    }

    return (
        <div style={{ display: 'grid', gap: '16px' }}>
            {sessions.map(session => (
                <div key={session.id} style={{ padding: '16px', borderRadius: 16, border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{session.booth_name || session.booth?.name || 'Booth'}</h3>
                    <p style={{ margin: '0 0 4px' }}><strong>Mulai:</strong> {session.start_time}</p>
                    <p style={{ margin: '0 0 4px' }}><strong>Selesai:</strong> {session.end_time ?? 'Dalam proses'}</p>
                    <p style={{ margin: '0 0 4px' }}><strong>Harga:</strong> Rp{session.price?.toLocaleString()}</p>
                    <p style={{ margin: 0 }}><strong>Status:</strong> {session.status}</p>
                </div>
            ))}
        </div>
    );
}
