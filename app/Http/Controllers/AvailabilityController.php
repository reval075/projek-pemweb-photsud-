<?php

namespace App\Http\Controllers;

use App\Models\Availability;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $query = Availability::with('booth.branch');

        if ($request->has('date')) {
            $query->where('date', $request->date);
        }

        if ($request->has('booth_id')) {
            $query->where('booth_id', $request->booth_id);
        }
        
        $availabilities = $query->where('status', 'available')->orderBy('date')->orderBy('start_time')->get();

        return response()->json(['data' => $availabilities]);
    }
}
