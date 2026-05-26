<?php

namespace App\Http\Controllers;

use App\Models\UnavailableDate;
use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class AvailabilityController extends Controller
{
    /**
     * Get unavailable and booked dates for the calendar.
     */
    public function index(Request $request)
    {
        $start = Carbon::today();
        $end = Carbon::today()->addMonths(3)->endOfMonth();

        if ($request->has('start_date')) {
            $start = Carbon::parse($request->start_date);
        }
        if ($request->has('end_date')) {
            $end = Carbon::parse($request->end_date);
        }

        // Get manually blocked dates
        $unavailables = UnavailableDate::whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->pluck('date')
            ->toArray();

        // Get booked dates (approved, confirmed, completed bookings)
        $booked = Booking::whereBetween('event_date', [$start->toDateString(), $end->toDateString()])
            ->whereIn('status', ['approved', 'confirmed', 'completed'])
            ->pluck('event_date')
            ->toArray();

        return response()->json([
            'unavailable_dates' => $unavailables,
            'booked_dates' => $booked,
        ]);
    }

    /**
     * List all unavailable dates (Admin).
     */
    public function adminUnavailableIndex()
    {
        $dates = UnavailableDate::with('creator')->orderBy('date', 'desc')->get();
        return response()->json(['data' => $dates]);
    }

    /**
     * Block a specific date (Admin).
     */
    public function storeUnavailableDate(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date|unique:unavailable_dates,date',
            'reason' => 'nullable|string|max:255',
        ]);

        $eventDate = Carbon::parse($validated['date'])->toDateString();

        // Double check if there is an approved event on this date
        $hasApprovedEvent = Booking::where('event_date', $eventDate)
            ->whereIn('status', ['approved', 'confirmed', 'completed'])
            ->exists();

        if ($hasApprovedEvent) {
            return response()->json(['message' => 'Tanggal ini sudah ditempati oleh event aktif dan tidak bisa diblok.'], 422);
        }

        $blockedDate = UnavailableDate::create([
            'date' => $eventDate,
            'reason' => $validated['reason'] ?? 'Manual block by admin',
            'created_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Tanggal berhasil diblok.',
            'data' => $blockedDate
        ], 201);
    }

    /**
     * Unblock a specific date (Admin).
     */
    public function deleteUnavailableDate($date)
    {
        $blockedDate = UnavailableDate::where('date', $date)->first();

        if (!$blockedDate) {
            return response()->json(['message' => 'Tanggal tidak ditemukan dalam daftar blok.'], 404);
        }

        $blockedDate->delete();

        return response()->json([
            'message' => 'Tanggal berhasil dibuka kembali.'
        ]);
    }
}
