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
            $table->timestamp('dp_expired_at')->nullable()->after('confirmed_at');

            // Performance indexes for scheduler query + status filtering
            $table->index('status');
            $table->index('dp_expired_at');
            $table->index('event_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['dp_expired_at']);
            $table->dropIndex(['event_date']);
            $table->dropColumn('dp_expired_at');
        });
    }
};
