<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_phone',
        'start_date',
        'end_date',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(RentalItem::class);
    }
}
