<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'maps_link',
        'image',
        'operating_hours',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function booths()
    {
        return $this->hasMany(Booth::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
