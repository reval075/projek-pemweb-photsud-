<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'customer_name',
        'customer_email',
        'customer_phone',
        'event_name',
        'event_location',
        'event_date',
        'service_package_id',
        'notes',
        'status',
        'approved_by',
        'approved_at',
        'payment_status',
        'cancelled_at',
        'total_price',
        'package_id',
        'branch_id',
        'availability_id',
    ];

    public function servicePackage()
    {
        return $this->belongsTo(ServicePackage::class, 'service_package_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function availability()
    {
        return $this->belongsTo(Availability::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
