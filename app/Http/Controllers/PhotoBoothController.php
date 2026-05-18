<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Session;
use App\Models\Transaction;
use Illuminate\Http\Request;

class PhotoBoothController extends Controller
{
    public function sessions()
    {
        $sessions = Session::with('booth')->get()->map(function ($session) {
            return [
                'id' => $session->id,
                'booth_name' => $session->booth?->name ?? 'Booth',
                'start_time' => $session->start_time->format('Y-m-d H:i'),
                'end_time' => $session->end_time?->format('Y-m-d H:i'),
                'price' => $session->price,
                'status' => $session->status,
            ];
        });

        return response()->json(['sessions' => $sessions]);
    }

    public function bookings()
    {
        $bookings = Booking::latest()->take(10)->get();
        return response()->json(['bookings' => $bookings]);
    }

    public function storeBooking(Request $request)
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'event_date' => ['required', 'date'],
            'location' => ['required', 'string', 'max:255'],
            'package' => ['required', 'string', 'max:255'],
        ]);

        $booking = Booking::create($data);

        return response()->json($booking, 201);
    }

    public function transactions()
    {
        $transactions = Transaction::latest()->take(10)->get();
        return response()->json(['transactions' => $transactions]);
    }
}
