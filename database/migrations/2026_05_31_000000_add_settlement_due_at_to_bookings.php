<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds settlement_due_at to bookings table for settlement deadline tracking.
     * Settlement deadline = event_date + 2 days.
     * Set when booking is confirmed.
     *
     * Backward compatible:
     * - Existing confirmed bookings will have NULL (can be backfilled if needed)
     * - New confirmations will auto-set this field
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->timestamp('settlement_due_at')
                ->nullable()
                ->after('confirmed_at')
                ->comment('Settlement payment deadline = event_date + 2 days');

            // Index for overdue queries: "now() > settlement_due_at AND remaining_amount > 0"
            $table->index('settlement_due_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['settlement_due_at']);
            $table->dropColumn('settlement_due_at');
        });
    }
};
