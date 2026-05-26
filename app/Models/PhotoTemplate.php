<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'size',
        'preview_image',
        'frame_type',
        'layout_type',
        'is_active',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'selected_template_id');
    }
}
