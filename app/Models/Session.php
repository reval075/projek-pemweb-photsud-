<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $table = 'photo_sessions';

    protected $fillable = [
        'booth_id',
        'start_time',
        'end_time',
        'price',
        'status',
    ];

    public function booth()
    {
        return $this->belongsTo(Booth::class);
    }
}
