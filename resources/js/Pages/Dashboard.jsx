import { useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Package, Check, X, Trash2, Edit2, Plus, LogOut, Loader2, ListCollapse } from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const form = useForm();

    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [packages, setPackages] = useState([]);
    const [blockedDates, setBlockedDates] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Block Date Form State
    const [blockForm, setBlockForm] = useState({ date: '', reason: '' });

    // Package Form State
    const [packageForm, setPackageForm] = useState({ id: null, name: '', price: '', duration: '', description: '' });
    const [isEditingPackage, setIsEditingPackage] = useState(false);

    // Status Filter for Bookings
    const [statusFilter, setStatusFilter] = useState('');

    const logout = (event) => {
        event.preventDefault();
        form.post('/logout');
    };

    // Load all data
    const loadBookings = () => {
        setLoading(true);
        axios.get(`/admin/api/bookings?status=${statusFilter}`)
            .then(res => setBookings(res.data.data))
            .catch(() => showMsg('Gagal memuat bookings.', 'error'))
            .finally(() => setLoading(false));
    };

    const loadPackages = () => {
        axios.get('/admin/api/service-packages')
            .then(res => setPackages(res.data.data))
            .catch(() => showMsg('Gagal memuat paket jasa.', 'error'));
    };

    const loadBlockedDates = () => {
        axios.get('/admin/api/unavailable-dates')
            .then(res => setBlockedDates(res.data.data))
            .catch(() => showMsg('Gagal memuat tanggal blok.', 'error'));
    };

    useEffect(() => {
        loadBookings();
    }, [statusFilter]);

    useEffect(() => {
        loadPackages();
        loadBlockedDates();
    }, []);

    const showMsg = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    // Booking Actions
    const handleApprove = (id) => {
        axios.post(`/admin/api/bookings/${id}/approve`)
            .then(res => {
                showMsg(res.data.message);
                loadBookings();
                loadBlockedDates(); // approved booking blocks date
            })
            .catch(err => showMsg(err.response?.data?.message || 'Gagal menyetujui booking.', 'error'));
    };

    const handleReject = (id) => {
        const reason = prompt('Masukkan alasan penolakan (opsional):');
        axios.post(`/admin/api/bookings/${id}/reject`, { notes: reason })
            .then(res => {
                showMsg(res.data.message);
                loadBookings();
            })
            .catch(err => showMsg(err.response?.data?.message || 'Gagal menolak booking.', 'error'));
    };

    const handleStatusChange = (id, newStatus, payStatus = null) => {
        axios.post(`/admin/api/bookings/${id}/status`, { status: newStatus, payment_status: payStatus })
            .then(res => {
                showMsg(res.data.message);
                loadBookings();
            })
            .catch(err => showMsg(err.response?.data?.message || 'Gagal mengubah status.', 'error'));
    };

    // Block Calendar Actions
    const handleBlockDateSubmit = (e) => {
        e.preventDefault();
        axios.post('/admin/api/unavailable-dates', blockForm)
            .then(res => {
                showMsg(res.data.message);
                setBlockForm({ date: '', reason: '' });
                loadBlockedDates();
            })
            .catch(err => showMsg(err.response?.data?.message || 'Gagal memblok tanggal.', 'error'));
    };

    const handleUnblockDate = (date) => {
        if (confirm(`Buka blokir untuk tanggal ${date}?`)) {
            axios.delete(`/admin/api/unavailable-dates/${date}`)
                .then(res => {
                    showMsg(res.data.message);
                    loadBlockedDates();
                })
                .catch(err => showMsg(err.response?.data?.message || 'Gagal membuka blok.', 'error'));
        }
    };

    // Package Actions
    const handlePackageSubmit = (e) => {
        e.preventDefault();
        if (isEditingPackage) {
            axios.put(`/admin/api/service-packages/${packageForm.id}`, packageForm)
                .then(res => {
                    showMsg(res.data.message);
                    resetPackageForm();
                    loadPackages();
                })
                .catch(err => showMsg(err.response?.data?.message || 'Gagal memperbarui paket.', 'error'));
        } else {
            axios.post('/admin/api/service-packages', packageForm)
                .then(res => {
                    showMsg(res.data.message);
                    resetPackageForm();
                    loadPackages();
                })
                .catch(err => showMsg(err.response?.data?.message || 'Gagal membuat paket.', 'error'));
        }
    };

    const handleEditPackage = (pkg) => {
        setPackageForm({ id: pkg.id, name: pkg.name, price: pkg.price, duration: pkg.duration || '', description: pkg.description || '' });
        setIsEditingPackage(true);
    };

    const handleDeletePackage = (id) => {
        if (confirm('Hapus paket jasa ini?')) {
            axios.delete(`/admin/api/service-packages/${id}`)
                .then(res => {
                    showMsg(res.data.message);
                    loadPackages();
                })
                .catch(err => showMsg(err.response?.data?.message || 'Gagal menghapus paket.', 'error'));
        }
    };

    const resetPackageForm = () => {
        setPackageForm({ id: null, name: '', price: '', duration: '', description: '' });
        setIsEditingPackage(false);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending_approval':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'approved':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'confirmed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'completed':
                return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'rejected':
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans antialiased text-charcoal">
            {/* Header */}
            <header className="sticky top-0 bg-white border-b border-beige z-30 px-6 py-4 shadow-sm shadow-primary/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src="/images/logo.png" alt="Memforia Admin" className="w-10 h-10 rounded-full" onError={(e) => e.target.style.display = 'none'} />
                        <div>
                            <h1 className="font-serif text-xl md:text-2xl font-medium tracking-tight text-charcoal">Memoforia Admin Console</h1>
                            <p className="text-xs text-warm-grey">Event Photobooth Vendor Booking Manager</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden sm:inline text-sm text-slate">Welcome, <strong className="font-medium text-charcoal">{auth?.user?.name || 'Administrator'}</strong></span>
                        <button onClick={logout} className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors">
                            <LogOut size={14} /> <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Notification Toast */}
            {message.text && (
                <div className={`fixed top-20 right-6 z-50 px-6 py-3 rounded-xl border text-sm shadow-lg transition-all ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    <button onClick={() => setActiveTab('bookings')}
                        className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-left font-medium transition-all ${activeTab === 'bookings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white hover:bg-beige text-charcoal'}`}>
                        <ListCollapse size={18} />
                        <span>Bookings approval</span>
                    </button>
                    <button onClick={() => setActiveTab('calendar')}
                        className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-left font-medium transition-all ${activeTab === 'calendar' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white hover:bg-beige text-charcoal'}`}>
                        <Calendar size={18} />
                        <span>Calendar blocks</span>
                    </button>
                    <button onClick={() => setActiveTab('packages')}
                        className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl text-left font-medium transition-all ${activeTab === 'packages' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white hover:bg-beige text-charcoal'}`}>
                        <Package size={18} />
                        <span>Service Packages</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {/* BOOKINGS APPROVAL TAB */}
                    {activeTab === 'bookings' && (
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 border border-primary-50">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-beige">
                                <div>
                                    <h2 className="font-serif text-2xl text-charcoal">Booking Requests</h2>
                                    <p className="text-xs text-warm-grey">Verify customer requests and update booking states</p>
                                </div>
                                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="mt-4 sm:mt-0 px-4 py-2 border border-beige rounded-xl bg-off-white text-sm focus:outline-none focus:border-primary">
                                    <option value="">Semua Status</option>
                                    <option value="pending_approval">Pending Approval</option>
                                    <option value="approved">Approved / Payment Pending</option>
                                    <option value="confirmed">Confirmed / Paid</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {bookings.map(booking => (
                                        <div key={booking.id} className="border border-beige rounded-2xl p-6 hover:shadow-md transition-shadow">
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-beige pb-3 mb-4">
                                                <div>
                                                    <span className="text-xs font-semibold text-primary">{booking.booking_code}</span>
                                                    <h3 className="font-serif text-lg text-charcoal">{booking.event_name}</h3>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusStyle(booking.status)}`}>
                                                    {booking.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate mb-6">
                                                <div>
                                                    <p>👤 <strong>Customer:</strong> {booking.customer_name} ({booking.customer_phone})</p>
                                                    <p>✉️ <strong>Email:</strong> {booking.customer_email}</p>
                                                    <p>📍 <strong>Location:</strong> {booking.event_location}</p>
                                                </div>
                                                <div>
                                                    <p>📅 <strong>Date:</strong> {booking.event_date}</p>
                                                    <p>📦 <strong>Package:</strong> {booking.service_package?.name || 'Custom Package'}</p>
                                                    <p>💵 <strong>Price:</strong> Rp {Number(booking.total_price).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>

                                            {booking.notes && (
                                                <div className="bg-off-white rounded-xl p-4 text-xs italic mb-6">
                                                    <strong>Catatan:</strong> {booking.notes}
                                                </div>
                                            )}

                                            {/* Action Buttons based on status */}
                                            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-beige">
                                                {booking.status === 'pending_approval' && (
                                                    <>
                                                        <button onClick={() => handleApprove(booking.id)} className="flex items-center space-x-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors shadow-md shadow-primary/10">
                                                            <Check size={14} /> <span>Approve</span>
                                                        </button>
                                                        <button onClick={() => handleReject(booking.id)} className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-semibold transition-colors">
                                                            <X size={14} /> <span>Reject</span>
                                                        </button>
                                                    </>
                                                )}

                                                {booking.status === 'approved' && (
                                                    <>
                                                        <button onClick={() => handleStatusChange(booking.id, 'confirmed', 'paid')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors">
                                                            Verify & Confirm Payment
                                                        </button>
                                                        <button onClick={() => handleStatusChange(booking.id, 'cancelled')} className="bg-gray-100 hover:bg-gray-200 text-slate px-4 py-2 rounded-full text-xs font-semibold transition-colors">
                                                            Cancel Booking
                                                        </button>
                                                    </>
                                                )}

                                                {booking.status === 'confirmed' && (
                                                    <button onClick={() => handleStatusChange(booking.id, 'completed')} className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors">
                                                        Mark as Completed
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {bookings.length === 0 && (
                                        <div className="text-center py-16 text-warm-grey">
                                            <ListCollapse size={40} className="mx-auto mb-2 opacity-50" />
                                            <p className="font-light">Tidak ada data booking dengan filter status ini.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* CALENDAR BLOCKS TAB */}
                    {activeTab === 'calendar' && (
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 border border-primary-50">
                            <h2 className="font-serif text-2xl text-charcoal mb-2">Block Calendar Dates</h2>
                            <p className="text-xs text-warm-grey mb-8 pb-4 border-b border-beige">Manage vendor off-days or maintenance blocks</p>

                            <form onSubmit={handleBlockDateSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8 bg-off-white/50 p-6 rounded-2xl border border-beige">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">Select Date</label>
                                    <input type="date" required value={blockForm.date} onChange={e => setBlockForm({ ...blockForm, date: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-beige bg-white focus:outline-none focus:border-primary text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">Block Reason</label>
                                    <input type="text" placeholder="e.g. Maintenance, Vendor off" value={blockForm.reason} onChange={e => setBlockForm({ ...blockForm, reason: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-beige bg-white focus:outline-none focus:border-primary text-sm" />
                                </div>
                                <div>
                                    <button type="submit" className="w-full flex items-center justify-center space-x-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-xs font-semibold transition-colors uppercase tracking-wider shadow-md shadow-primary/10">
                                        <Plus size={16} /> <span>Block Date</span>
                                    </button>
                                </div>
                            </form>

                            <h3 className="font-serif text-lg text-charcoal mb-4">Blocked Calendar Dates</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-beige text-xs text-warm-grey font-semibold uppercase">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Reason</th>
                                            <th className="py-3 px-4">Created By</th>
                                            <th className="py-3 px-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-beige text-sm">
                                        {blockedDates.map(bd => (
                                            <tr key={bd.id} className="hover:bg-off-white/50">
                                                <td className="py-4 px-4 font-semibold text-charcoal">{bd.date}</td>
                                                <td className="py-4 px-4 font-light text-slate">{bd.reason}</td>
                                                <td className="py-4 px-4 text-xs font-medium text-slate">{bd.creator?.name || 'Admin'}</td>
                                                <td className="py-4 px-4 text-right">
                                                    <button onClick={() => handleUnblockDate(bd.date)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {blockedDates.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center py-8 text-warm-grey font-light">Belum ada tanggal diblokir.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* SERVICE PACKAGES TAB */}
                    {activeTab === 'packages' && (
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 border border-primary-50">
                            <h2 className="font-serif text-2xl text-charcoal mb-2">Service Packages CRUD</h2>
                            <p className="text-xs text-warm-grey mb-8 pb-4 border-b border-beige">Create or update photo services offered to customers</p>

                            <form onSubmit={handlePackageSubmit} className="space-y-4 mb-10 bg-off-white/50 p-6 rounded-2xl border border-beige">
                                <h3 className="font-serif text-md text-charcoal mb-2">{isEditingPackage ? 'Edit Paket Jasa' : 'Tambah Paket Jasa Baru'}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-charcoal mb-1">Package Name</label>
                                        <input type="text" required placeholder="e.g. Wedding Package" value={packageForm.name} onChange={e => setPackageForm({ ...packageForm, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-beige bg-white rounded-xl focus:outline-none focus:border-primary text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-charcoal mb-1">Price (IDR)</label>
                                        <input type="number" required placeholder="e.g. 3500000" value={packageForm.price} onChange={e => setPackageForm({ ...packageForm, price: e.target.value })}
                                            className="w-full px-4 py-2 border border-beige bg-white rounded-xl focus:outline-none focus:border-primary text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-charcoal mb-1">Duration</label>
                                        <input type="text" placeholder="e.g. 6 Hours" value={packageForm.duration} onChange={e => setPackageForm({ ...packageForm, duration: e.target.value })}
                                            className="w-full px-4 py-2 border border-beige bg-white rounded-xl focus:outline-none focus:border-primary text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-charcoal mb-1">Description</label>
                                    <textarea placeholder="List details separated by commas or sentences..." value={packageForm.description} onChange={e => setPackageForm({ ...packageForm, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-beige bg-white rounded-xl focus:outline-none focus:border-primary text-sm resize-none" rows="2" />
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    {isEditingPackage && (
                                        <button type="button" onClick={resetPackageForm} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate rounded-lg text-xs font-semibold transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                    <button type="submit" className="flex items-center space-x-1 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-xs font-semibold transition-colors shadow-md shadow-primary/10">
                                        {isEditingPackage ? <Check size={14} /> : <Plus size={14} />}
                                        <span>{isEditingPackage ? 'Update Paket' : 'Simpan Paket'}</span>
                                    </button>
                                </div>
                            </form>

                            <h3 className="font-serif text-lg text-charcoal mb-4">Daftar Paket Jasa</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {packages.map(pkg => (
                                    <div key={pkg.id} className="border border-beige rounded-2xl p-6 bg-white flex flex-col justify-between hover:shadow-sm">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-serif text-md text-charcoal">{pkg.name}</h4>
                                                <span className="text-xs text-warm-grey tracking-wider font-semibold uppercase">{pkg.duration || '-'}</span>
                                            </div>
                                            <p className="text-lg font-serif text-primary mb-2">Rp {Number(pkg.price).toLocaleString('id-ID')}</p>
                                            <p className="text-xs text-slate font-light leading-relaxed mb-4">{pkg.description || 'Tidak ada deskripsi.'}</p>
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4 border-t border-beige">
                                            <button onClick={() => handleEditPackage(pkg)} className="p-2 text-primary hover:bg-primary-50 rounded-full transition-colors">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeletePackage(pkg.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {packages.length === 0 && (
                                    <div className="text-center py-8 col-span-2 text-warm-grey font-light">Belum ada paket jasa terdaftar.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
