<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalEquipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'stock',
        'price_per_day',
        'description',
        'image',
        'status',
    ];

    public function rentalItems()
    {
        return $this->hasMany(RentalItem::class, 'equipment_id');
    }
}
