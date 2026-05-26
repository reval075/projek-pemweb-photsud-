<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Addon extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'is_active',
    ];

    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_addons')
            ->withPivot('quantity', 'price')
            ->withTimestamps();
    }
}
