<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'status',
        'notes',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
