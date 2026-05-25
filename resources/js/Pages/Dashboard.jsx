import { useForm, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const form = useForm();

    const logout = (event) => {
        event.preventDefault();
        form.post('/logout');
    };

    return (
        <div style={{ minHeight: '100vh', padding: '40px 20px', backgroundColor: '#f8fafc' }}>
            <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gap: '24px' }}>
                <div style={{ padding: '28px', borderRadius: 24, backgroundColor: '#ffffff', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '2rem', color: '#111827' }}>Dashboard Admin</h1>
                            <p style={{ margin: '12px 0 0', color: '#475569' }}>
                                Selamat datang{auth?.user?.name ? `, ${auth.user.name}` : ''}. Kelola data booking dan kalender dari sini.
                            </p>
                        </div>
                        <button onClick={logout} style={{ padding: '12px 18px', borderRadius: 14, border: 'none', backgroundColor: '#ef4444', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}>
                            Logout
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '18px' }}>
                    <div style={{ padding: '24px', borderRadius: 20, backgroundColor: '#ffffff' }}>
                        <h2 style={{ marginTop: 0, color: '#111827' }}>Ringkasan</h2>
                        <p style={{ color: '#475569' }}>Gunakan menu admin untuk mengelola kalender, booking, dan konten web.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
