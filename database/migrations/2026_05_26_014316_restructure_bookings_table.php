<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Drop old status column (using separate blocks for SQLite support if needed)
            $table->dropColumn('status');
        });

        Schema::table('bookings', function (Blueprint $table) {
            // Add new columns
            $table->string('booking_code')->nullable()->unique();
            $table->string('event_name')->nullable();
            $table->foreignId('service_package_id')->nullable()->constrained('service_packages')->onDelete('set null');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('payment_status')->default('unpaid');
            $table->string('status')->default('pending_approval');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'booking_code',
                'event_name',
                'service_package_id',
                'approved_by',
                'approved_at',
                'cancelled_at',
                'payment_status',
                'status'
            ]);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->enum('status', ['pending', 'confirmed', 'done', 'cancelled'])->default('pending');
        });
    }
};
