export const getStatusStyle = (status) => {
    switch (status) {
        case 'pending_approval':
            return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'waiting_dp':
            return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'confirmed':
            return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'completed':
            return 'bg-slate-100 text-slate-800 border-slate-200';
        case 'expired':
            return 'bg-orange-50 text-orange-700 border-orange-100';
        case 'rejected':
        case 'cancelled':
            return 'bg-red-50 text-red-700 border-red-100';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-100';
    }
};

export const getStatusLabel = (status) => {
    const labels = {
        pending_approval: 'Menunggu Persetujuan',
        waiting_dp: 'Menunggu Pembayaran DP',
        confirmed: 'Terkonfirmasi',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
        expired: 'Kedaluwarsa',
        rejected: 'Ditolak',
    };

    return labels[status] || status?.replace(/_/g, ' ') || '-';
};

export const getPaymentStatusLabel = (status) => {
    const labels = {
        unpaid: 'Belum Dibayar',
        partially_paid: 'DP Terbayar',
        paid: 'Lunas',
    };

    return labels[status] || status?.replace(/_/g, ' ') || '-';
};

export const getPaymentVerificationStyle = (status) => {
    switch (status) {
        case 'verified':
            return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'rejected':
            return 'bg-red-50 text-red-700 border-red-100';
        case 'pending':
        default:
            return 'bg-amber-50 text-amber-700 border-amber-100';
    }
};

export const formatCurrency = (amount) => {
    const value = Number(amount) || 0;
    return `Rp ${value.toLocaleString('id-ID')}`;
};

export const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export const getStatusMessage = (booking) => {
    switch (booking?.status) {
        case 'pending_approval':
            return 'Pengajuan booking Anda sedang ditinjau oleh tim admin.';
        case 'waiting_dp':
            return booking.dp_expired_at
                ? `Silakan lakukan pembayaran DP sebelum ${formatDateTime(booking.dp_expired_at)}.`
                : 'Silakan lakukan pembayaran DP untuk melanjutkan konfirmasi jadwal.';
        case 'confirmed':
            return 'Booking Anda telah dikonfirmasi. Jadwal event telah terkunci.';
        case 'completed':
            return 'Event telah selesai. Terima kasih telah menggunakan layanan Memoforia.';
        case 'cancelled':
            return 'Booking ini telah dibatalkan.';
        case 'expired':
            return 'Batas waktu pembayaran DP telah habis. Booking tidak lagi aktif.';
        case 'rejected':
            return 'Pengajuan booking ditolak oleh admin.';
        default:
            return null;
    }
};
