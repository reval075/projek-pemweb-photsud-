<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_request_id',
        'equipment_id',
        'qty',
        'price',
    ];

    public function request()
    {
        return $this->belongsTo(RentalRequest::class, 'rental_request_id');
    }

    public function equipment()
    {
        return $this->belongsTo(RentalEquipment::class, 'equipment_id');
    }
}
