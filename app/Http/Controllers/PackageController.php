<?php

namespace App\Http\Controllers;

use App\Models\ServicePackage;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource (Public).
     */
    public function index()
    {
        $packages = ServicePackage::all();
        return response()->json(['data' => $packages]);
    }

    /**
     * Display the specified resource (Public).
     */
    public function show($id)
    {
        $package = ServicePackage::findOrFail($id);
        return response()->json(['data' => $package]);
    }

    /**
     * Display a listing of the resource for Admin.
     */
    public function adminIndex()
    {
        $packages = ServicePackage::latest()->get();
        return response()->json(['data' => $packages]);
    }

    /**
     * Store a newly created resource in storage (Admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
        ]);

        $package = ServicePackage::create($validated);

        return response()->json([
            'message' => 'Paket jasa berhasil dibuat.',
            'data' => $package
        ], 201);
    }

    /**
     * Update the specified resource in storage (Admin).
     */
    public function update(Request $request, $id)
    {
        $package = ServicePackage::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
        ]);

        $package->update($validated);

        return response()->json([
            'message' => 'Paket jasa berhasil diperbarui.',
            'data' => $package
        ]);
    }

    /**
     * Remove the specified resource from storage (Admin).
     */
    public function destroy($id)
    {
        $package = ServicePackage::findOrFail($id);
        $package->delete();

        return response()->json([
            'message' => 'Paket jasa berhasil dihapus.'
        ]);
    }
}
