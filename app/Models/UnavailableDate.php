<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnavailableDate extends Model
{
    use HasFactory;

    protected $table = 'unavailable_dates';

    protected $fillable = [
        'date',
        'reason',
        'created_by',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
