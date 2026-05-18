<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\RentalEquipmentController;
use App\Http\Controllers\RentalRequestController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public Routes for Frontend
Route::get('/branches', [BranchController::class, 'index']);
Route::get('/branches/{id}', [BranchController::class, 'show']);

Route::get('/packages', [PackageController::class, 'index']);
Route::get('/packages/{id}', [PackageController::class, 'show']);

Route::get('/availabilities', [AvailabilityController::class, 'index']); // Get slots

Route::post('/bookings', [BookingController::class, 'store']); // Guest booking

Route::get('/rental-equipments', [RentalEquipmentController::class, 'index']);
Route::get('/rental-equipments/{id}', [RentalEquipmentController::class, 'show']);

Route::post('/rental-requests', [RentalRequestController::class, 'store']); // Guest rental
