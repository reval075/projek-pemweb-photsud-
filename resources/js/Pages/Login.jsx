import { useForm, Link } from '@inertiajs/react';

export default function Login() {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();
        form.post('/login');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: 420, padding: '32px', borderRadius: 20, boxShadow: '0 18px 45px rgba(15, 23, 42, 0.1)', backgroundColor: '#ffffff' }}>
                <h1 style={{ margin: 0, marginBottom: 20, fontSize: '1.9rem', color: '#111827' }}>Masuk Admin</h1>
                <p style={{ margin: '0 0 24px', color: '#475569' }}>Silakan masuk untuk mengelola dashboard.</p>

                <form onSubmit={submit}>
                    <label style={{ display: 'block', marginBottom: 8, color: '#334155' }}>Email</label>
                    <input
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        type="email"
                        autoComplete="username"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #cbd5e1', marginBottom: 16 }}
                    />
                    {form.errors.email ? <div style={{ color: '#b91c1c', marginBottom: 16 }}>{form.errors.email}</div> : null}

                    <label style={{ display: 'block', marginBottom: 8, color: '#334155' }}>Kata Sandi</label>
                    <input
                        value={form.data.password}
                        onChange={(e) => form.setData('password', e.target.value)}
                        type="password"
                        autoComplete="current-password"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #cbd5e1', marginBottom: 16 }}
                    />
                    {form.errors.password ? <div style={{ color: '#b91c1c', marginBottom: 16 }}>{form.errors.password}</div> : null}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                            <input
                                type="checkbox"
                                checked={form.data.remember}
                                onChange={(e) => form.setData('remember', e.target.checked)}
                                style={{ width: 16, height: 16 }}
                            />
                            Ingat saya
                        </label>
                    </div>

                    <button type="submit" disabled={form.processing} style={{ width: '100%', padding: '14px 18px', borderRadius: 14, border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}>
                        Masuk
                    </button>
                </form>

                <p style={{ marginTop: 24, color: '#64748b' }}>
                    Kembali ke halaman publik?{' '}
                    <Link href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                        Home
                    </Link>
                </p>
            </div>
        </div>
    );
}
