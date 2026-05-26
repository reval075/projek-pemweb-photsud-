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
        'event_datetime',
        'service_package_id',
        'package_variant_id',
        'selected_template_id',
        'notes',
        'status',
        'approved_by',
        'approved_at',
        'confirmed_at',
        'dp_expired_at',
        'payment_status',
        'cancelled_at',
        'total_price',
        'package_id',
        'branch_id',
        'availability_id',
    ];

    protected $casts = [
        'event_datetime' => 'datetime',
        'approved_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'dp_expired_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    /**
     * Scope: bookings that have passed their DP payment deadline.
     */
    public function scopeExpiredDp($query)
    {
        return $query->where('status', 'waiting_dp')
                     ->whereNotNull('dp_expired_at')
                     ->where('dp_expired_at', '<=', now());
    }

    /**
     * Source of truth: a booking is DP-expired when it is still waiting_dp
     * and the deadline has passed.
     */
    public function isDpExpired(): bool
    {
        return $this->status === 'waiting_dp'
            && $this->dp_expired_at !== null
            && now()->gt($this->dp_expired_at);
    }

    /**
     * Synchronize status when a booking is already expired by time.
     * Returns true when status is changed in this call.
     */
    public function markAsExpiredIfDpElapsed(): bool
    {
        if (! $this->isDpExpired()) {
            return false;
        }

        $this->update([
            'status' => 'expired',
            'cancelled_at' => $this->cancelled_at ?? now(),
            'notes' => 'Otomatis expired karena batas waktu pembayaran DP telah habis.',
        ]);

        return true;
    }

    /**
     * Normalize phone numbers for consistent comparison (e.g. 08xx vs 628xx).
     */
    public static function normalizePhone(?string $phone): string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone);

        if ($digits === '') {
            return '';
        }

        if (str_starts_with($digits, '62')) {
            return $digits;
        }

        if (str_starts_with($digits, '0')) {
            return '62'.substr($digits, 1);
        }

        return $digits;
    }

    /**
     * Verify guest contact matches booking email or phone.
     */
    public function contactMatches(string $contact): bool
    {
        $contact = trim($contact);

        if ($contact === '') {
            return false;
        }

        if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
            return strcasecmp((string) $this->customer_email, $contact) === 0;
        }

        $normalizedContact = self::normalizePhone($contact);
        $normalizedBooking = self::normalizePhone($this->customer_phone);

        return $normalizedContact !== '' && $normalizedContact === $normalizedBooking;
    }

    public function servicePackage()
    {
        return $this->belongsTo(ServicePackage::class, 'service_package_id');
    }

    public function packageVariant()
    {
        return $this->belongsTo(PackageVariant::class, 'package_variant_id');
    }

    public function selectedTemplate()
    {
        return $this->belongsTo(PhotoTemplate::class, 'selected_template_id');
    }

    public function addons()
    {
        return $this->belongsToMany(Addon::class, 'booking_addons')
            ->withPivot('quantity', 'price')
            ->withTimestamps();
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

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
