import { useState } from 'react';

const packages = ['Paket Basic', 'Paket Premium', 'Paket Enterprise'];

export default function BookingForm({ onSubmit }) {
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');
    const [packageName, setPackageName] = useState(packages[0]);

    function handleSubmit(event) {
        event.preventDefault();
        onSubmit({ customer_name: customerName, phone, event_date: eventDate, location, package: packageName });
        setCustomerName('');
        setPhone('');
        setEventDate('');
        setLocation('');
        setPackageName(packages[0]);
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
            <label style={{ display: 'grid', gap: '6px' }}>
                Nama Pemesan
                <input type="text" value={customerName} onChange={event => setCustomerName(event.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #cbd5e1' }} />
            </label>
            <label style={{ display: 'grid', gap: '6px' }}>
                No. Telepon
                <input type="tel" value={phone} onChange={event => setPhone(event.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #cbd5e1' }} />
            </label>
            <label style={{ display: 'grid', gap: '6px' }}>
                Tanggal Event
                <input type="date" value={eventDate} onChange={event => setEventDate(event.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #cbd5e1' }} />
            </label>
            <label style={{ display: 'grid', gap: '6px' }}>
                Lokasi
                <input type="text" value={location} onChange={event => setLocation(event.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #cbd5e1' }} />
            </label>
            <label style={{ display: 'grid', gap: '6px' }}>
                Paket
                <select value={packageName} onChange={event => setPackageName(event.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #cbd5e1' }}>
                    {packages.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </label>
            <button type="submit" style={{ marginTop: '10px', padding: '12px 18px', borderRadius: 10, border: 'none', backgroundColor: '#2563eb', color: '#ffffff', cursor: 'pointer' }}>
                Simpan Booking
            </button>
        </form>
    );
}
