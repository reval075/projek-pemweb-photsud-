export default function TransactionSummary({ transactions, loading }) {
    if (loading) {
        return <p>Memuat transaksi...</p>;
    }

    if (!transactions || transactions.length === 0) {
        return <p>Tidak ada transaksi untuk ditampilkan.</p>;
    }

    return (
        <div style={{ display: 'grid', gap: '12px' }}>
            {transactions.map(item => (
                <div key={item.id} style={{ padding: '14px', borderRadius: 16, backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: 600 }}>{item.description}</p>
                    <p style={{ margin: 0 }}><strong>Jumlah:</strong> Rp{item.amount?.toLocaleString()}</p>
                    <p style={{ margin: '6px 0 0', color: '#475569' }}><strong>Tipe:</strong> {item.type}</p>
                    <p style={{ margin: '4px 0 0', color: '#475569' }}><small>{item.created_at}</small></p>
                </div>
            ))}
        </div>
    );
}
