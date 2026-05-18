<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::all();
        return response()->json(['data' => $packages]);
    }

    public function show($id)
    {
        $package = Package::findOrFail($id);
        return response()->json(['data' => $package]);
    }
}
