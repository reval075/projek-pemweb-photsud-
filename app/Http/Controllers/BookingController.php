<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\ServicePackage;
use App\Models\UnavailableDate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Store a newly created booking in storage (Guest).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:30',
            'event_name' => 'required|string|max:255',
            'event_location' => 'required|string|max:255',
            'event_date' => 'required|date|after_or_equal:today',
            'service_package_id' => 'required|exists:service_packages,id',
            'notes' => 'nullable|string',
        ]);

        $eventDate = Carbon::parse($validated['event_date'])->toDateString();

        // 1. Check if date is manually blocked by admin
        $isBlocked = UnavailableDate::where('date', $eventDate)->exists();
        if ($isBlocked) {
            return response()->json(['message' => 'Tanggal ini tidak tersedia untuk dibooking.'], 422);
        }

        // 2. Check if date has already been booked (approved, confirmed, completed)
        $isBooked = Booking::where('event_date', $eventDate)
            ->whereIn('status', ['approved', 'confirmed', 'completed'])
            ->exists();
        if ($isBooked) {
            return response()->json(['message' => 'Tanggal ini sudah dibooking oleh event lain.'], 422);
        }

        // Fetch service package to get price
        $package = ServicePackage::findOrFail($validated['service_package_id']);
        
        // Generate booking code
        $datePart = Carbon::parse($validated['event_date'])->format('Ymd');
        $randomPart = strtoupper(Str::random(5));
        $bookingCode = "MEMO-{$datePart}-{$randomPart}";

        $booking = Booking::create([
            'booking_code' => $bookingCode,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'event_name' => $validated['event_name'],
            'event_location' => $validated['event_location'],
            'event_date' => $eventDate,
            'service_package_id' => $validated['service_package_id'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending_approval',
            'payment_status' => 'unpaid',
            'total_price' => $package->price,
        ]);

        return response()->json([
            'message' => 'Booking berhasil diajukan, menunggu approval admin.',
            'data' => $booking
        ], 201);
    }

    /**
     * List all bookings for admin.
     */
    public function adminIndex(Request $request)
    {
        $query = Booking::with(['servicePackage', 'payment']);

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $bookings = $query->latest()->get();

        return response()->json(['data' => $bookings]);
    }

    /**
     * Approve a booking.
     */
    public function approve(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->status !== 'pending_approval') {
            return response()->json(['message' => 'Booking tidak berstatus pending approval.'], 422);
        }

        // Double check if date was booked in the meantime
        $isAlreadyBooked = Booking::where('event_date', $booking->event_date)
            ->where('id', '!=', $booking->id)
            ->whereIn('status', ['approved', 'confirmed', 'completed'])
            ->exists();

        if ($isAlreadyBooked) {
            return response()->json(['message' => 'Tanggal ini sudah dibooking oleh event lain yang disetujui.'], 422);
        }

        $booking->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'payment_status' => 'pending',
        ]);

        // Auto-reject other pending bookings on the same date
        Booking::where('event_date', $booking->event_date)
            ->where('id', '!=', $booking->id)
            ->where('status', 'pending_approval')
            ->update([
                'status' => 'rejected',
                'notes' => 'Otomatis ditolak karena tanggal ini telah disetujui untuk booking lain.'
            ]);

        return response()->json([
            'message' => 'Booking berhasil disetujui.',
            'data' => $booking
        ]);
    }

    /**
     * Reject a booking.
     */
    public function reject(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->status !== 'pending_approval') {
            return response()->json(['message' => 'Hanya booking pending yang dapat direject.'], 422);
        }

        $booking->update([
            'status' => 'rejected',
            'notes' => $request->input('notes') ?? $booking->notes
        ]);

        return response()->json([
            'message' => 'Booking berhasil ditolak.',
            'data' => $booking
        ]);
    }

    /**
     * Update booking status.
     */
    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending_approval,approved,confirmed,completed,rejected,cancelled',
            'payment_status' => 'nullable|string',
        ]);

        $updateData = ['status' => $validated['status']];

        if ($validated['status'] === 'cancelled') {
            $updateData['cancelled_at'] = now();
        }

        if (isset($validated['payment_status'])) {
            $updateData['payment_status'] = $validated['payment_status'];
        }

        $booking->update($updateData);

        return response()->json([
            'message' => 'Status booking berhasil diubah.',
            'data' => $booking
        ]);
    }
}
