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
    Schema::create('bookings', function (Blueprint $table) {
        $table->id();
        $table->string('customer_name');
        $table->string('customer_email')->nullable();
        $table->string('customer_phone')->nullable();
        $table->date('event_date')->nullable();
        $table->text('event_location')->nullable();
        $table->text('notes')->nullable();

        $table->enum('status', [
            'pending',
            'approved',
            'rejected',
            'confirmed',
            'completed',
            'cancelled'
        ])->default('pending');

        $table->foreignId('package_id')->nullable()->constrained('packages')->onDelete('set null');
        $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
        $table->foreignId('availability_id')->nullable()->constrained('availabilities')->onDelete('set null');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
