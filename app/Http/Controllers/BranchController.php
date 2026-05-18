<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        $branches = Branch::where('is_active', true)->with('booths')->get();
        return response()->json(['data' => $branches]);
    }

    public function show($id)
    {
        $branch = Branch::with('booths')->findOrFail($id);
        return response()->json(['data' => $branch]);
    }
}
