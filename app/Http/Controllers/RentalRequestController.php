<?php

namespace App\Http\Controllers;

use App\Models\RentalRequest;
use App\Models\RentalItem;
use App\Models\RentalEquipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RentalRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.equipment_id' => 'required|exists:rental_equipments,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $days = $startDate->diffInDays($endDate) + 1; // Minimal hitungan 1 hari

        DB::beginTransaction();
        try {
            $totalPrice = 0;
            
            // Buat request rental
            $rentalRequest = RentalRequest::create([
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'notes' => $validated['notes'],
                'status' => 'pending',
                'total_price' => 0 // Akan diupdate nanti
            ]);

            foreach ($validated['items'] as $item) {
                $equipment = RentalEquipment::findOrFail($item['equipment_id']);
                
                // Cek stock (ini simplifikasi, harusnya cek ketersediaan di rentang tanggal tertentu)
                if ($equipment->stock < $item['qty']) {
                    throw new \Exception("Stock untuk {$equipment->name} tidak mencukupi");
                }

                $itemTotalPrice = $equipment->price_per_day * $item['qty'] * $days;
                $totalPrice += $itemTotalPrice;

                RentalItem::create([
                    'rental_request_id' => $rentalRequest->id,
                    'equipment_id' => $equipment->id,
                    'qty' => $item['qty'],
                    'price' => $itemTotalPrice
                ]);
            }

            $rentalRequest->update(['total_price' => $totalPrice]);

            DB::commit();

            return response()->json([
                'message' => 'Penyewaan perlengkapan berhasil diajukan',
                'data' => $rentalRequest->load('items.equipment')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
