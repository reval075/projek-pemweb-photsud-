<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Package;
use App\Models\Availability;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'event_date' => 'required|date',
            'event_location' => 'nullable|string|max:255',
            'branch_id' => 'required|exists:branches,id',
            'package_id' => 'required|exists:packages,id',
            'availability_id' => 'required|exists:availabilities,id',
            'notes' => 'nullable|string',
        ]);

        $package = Package::findOrFail($validated['package_id']);
        
        // Cek ketersediaan slot
        $availability = Availability::findOrFail($validated['availability_id']);
        if ($availability->status !== 'available') {
            return response()->json(['message' => 'Slot waktu ini sudah dibooking atau tidak tersedia'], 422);
        }

        $validated['total_price'] = $package->price;
        $validated['status'] = 'pending';

        $booking = Booking::create($validated);

        // Update slot menjadi booked
        $availability->update(['status' => 'booked']);

        return response()->json([
            'message' => 'Booking berhasil dibuat',
            'data' => $booking
        ], 201);
    }
}
