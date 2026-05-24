<?php

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/booking', function () {
    return Inertia::render('Booking');
});

Route::get('/rentals', function () {
    return Inertia::render('Rentals');
});

Route::get('/pricelist', function () {
    return Inertia::render('Pricelist');
});

Route::get('/branches', function () {
    return Inertia::render('Branches');
});
