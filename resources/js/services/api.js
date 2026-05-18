import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || '',
    headers: {
        'Accept': 'application/json',
    },
});

export async function fetchSessions() {
    const response = await api.get('/api/sessions');
    return response.data.sessions || [];
}

export async function fetchBookings() {
    const response = await api.get('/api/bookings');
    return response.data.bookings || [];
}

export async function fetchTransactions() {
    const response = await api.get('/api/transactions');
    return response.data.transactions || [];
}

export async function createBooking(payload) {
    const response = await api.post('/api/bookings', payload);
    return response.data;
}
