<?php

namespace App\Http\Controllers;

use App\Models\RentalEquipment;
use Illuminate\Http\Request;

class RentalEquipmentController extends Controller
{
    public function index()
    {
        $equipments = RentalEquipment::where('status', 'available')->get();
        return response()->json(['data' => $equipments]);
    }

    public function show($id)
    {
        $equipment = RentalEquipment::findOrFail($id);
        return response()->json(['data' => $equipment]);
    }
}
