import { useMemo } from 'react';

function getCalendarMatrix(month) {
    const [year, monthIndex] = month.split('-').map(Number);
    const firstOfMonth = new Date(year, monthIndex - 1, 1);
    const startDay = new Date(firstOfMonth);
    startDay.setDate(1 - startDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i += 1) {
        const date = new Date(startDay);
        date.setDate(startDay.getDate() + i);
        days.push({
            date,
            string: date.toISOString().slice(0, 10),
            isCurrentMonth: date.getMonth() === firstOfMonth.getMonth(),
        });
    }

    return days;
}

function monthLabel(month) {
    const [year, monthIndex] = month.split('-').map(Number);
    const date = new Date(year, monthIndex - 1, 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

export default function CalendarBooking({ dates = [], month, onMonthChange, onDateSelect, selectedDate }) {
    const statusMap = useMemo(() => {
        return dates.reduce((map, item) => {
            map[item.date] = item.status;
            return map;
        }, {});
    }, [dates]);

    const days = useMemo(() => getCalendarMatrix(month), [month]);

    const handlePrevious = () => {
        const [year, monthIndex] = month.split('-').map(Number);
        const prev = new Date(year, monthIndex - 2, 1);
        onMonthChange(`${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`);
    };

    const handleNext = () => {
        const [year, monthIndex] = month.split('-').map(Number);
        const next = new Date(year, monthIndex, 1);
        onMonthChange(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
    };

    return (
        <div style={{ padding: '20px', borderRadius: 18, backgroundColor: '#ffffff', boxShadow: '0 12px 25px rgba(15, 23, 42, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Kalender Booking</h2>
                    <p style={{ margin: '8px 0 0', color: '#475569' }}>Pilih tanggal untuk melihat apakah tersedia.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={handlePrevious} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}>
                        Sebelumnya
                    </button>
                    <button type="button" onClick={handleNext} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}>
                        Selanjutnya
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '4px', marginBottom: '12px' }}>
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(label => (
                    <div key={label} style={{ padding: '10px 0', textAlign: 'center', color: '#475569', fontWeight: 600 }}>{label}</div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '4px' }}>
                {days.map(day => {
                    const status = statusMap[day.string] || 'available';
                    const isSelected = selectedDate === day.string;
                    const isInactive = !day.isCurrentMonth;
                    const isBlocked = status !== 'available';
                    const label = status === 'booked' ? 'Booked' : status === 'unavailable' ? 'Unavailable' : status === 'pending' ? 'Pending' : '';
                    return (
                        <button
                            key={day.string}
                            type="button"
                            onClick={() => status === 'available' && day.isCurrentMonth && onDateSelect(day.string)}
                            style={{
                                minHeight: 68,
                                padding: '10px',
                                borderRadius: 14,
                                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                                backgroundColor: status === 'booked' ? '#fee2e2' : status === 'unavailable' ? '#f8fafc' : status === 'pending' ? '#fef3c7' : isInactive ? '#f8fafc' : '#ffffff',
                                color: isInactive ? '#94a3b8' : '#0f172a',
                                cursor: status === 'available' && day.isCurrentMonth ? 'pointer' : 'not-allowed',
                                opacity: isInactive ? 0.65 : 1,
                                textAlign: 'left',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{day.date.getDate()}</span>
                                {label ? (
                                    <span style={{ fontSize: '0.7rem', color: status === 'booked' ? '#b91c1c' : '#92400e' }}>{label}</span>
                                ) : null}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div style={{ marginTop: '18px', display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ flex: 1, padding: '12px', borderRadius: 14, backgroundColor: '#ecfccb', color: '#365314' }}>
                        Available
                    </div>
                    <div style={{ flex: 1, padding: '12px', borderRadius: 14, backgroundColor: '#fee2e2', color: '#881337' }}>
                        Booked
                    </div>
                </div>
                <div style={{ padding: '12px', borderRadius: 14, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    Pilih tanggal berwarna putih di bulan ini untuk melakukan booking.
                </div>
            </div>
        </div>
    );
}
