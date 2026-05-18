<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            // Relasi ke branch, package, dan slot ketersediaan
            $table->foreignId('branch_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('package_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('availability_id')->nullable()->constrained('availabilities')->onDelete('set null');

            // Data customer (guest booking, tidak perlu login)
            $table->string('customer_name');
            $table->string('customer_email')->nullable();
            $table->string('customer_phone')->nullable();

            // Detail event
            $table->date('event_date');
            $table->string('event_location')->nullable();
            $table->decimal('total_price', 12, 2)->default(0);
            $table->text('notes')->nullable();

            $table->enum('status', [
                'pending',
                'confirmed',
                'done',
                'cancelled'
            ])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
