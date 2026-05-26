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
        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_type')->default('dp')->after('amount'); // dp, settlement, full_payment
            $table->foreignId('verified_by')->nullable()->after('status')->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable()->after('verified_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['verified_by']);
            $table->dropColumn(['payment_type', 'verified_by', 'verified_at']);
        });
    }
};
