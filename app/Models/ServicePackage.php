<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicePackage extends Model
{
    use HasFactory;

    protected $table = 'service_packages';

    protected $fillable = [
        'name',
        'price',
        'duration',
        'description',
        'image',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'service_package_id');
    }
}
