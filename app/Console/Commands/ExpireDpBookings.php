<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Illuminate\Console\Command;

class ExpireDpBookings extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'bookings:expire-dp';

    /**
     * The console command description.
     */
    protected $description = 'Expire waiting_dp bookings that have passed their DP payment deadline';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $expiredCount = Booking::where('status', 'waiting_dp')
            ->whereNotNull('dp_expired_at')
            ->where('dp_expired_at', '<=', now())
            ->update([
                'status' => 'expired',
                'cancelled_at' => now(),
                'notes' => 'Otomatis expired karena batas waktu pembayaran DP telah habis.',
            ]);

        $this->info("✓ {$expiredCount} booking(s) expired due to DP deadline.");

        return self::SUCCESS;
    }
}
