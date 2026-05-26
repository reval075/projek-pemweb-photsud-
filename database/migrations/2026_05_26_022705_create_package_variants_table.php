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
        Schema::create('package_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_package_id')->constrained('service_packages')->onDelete('cascade');
            $table->string('name'); // e.g. 1 Jam, 2 Jam, 100 Prints
            $table->integer('duration_hours')->nullable();
            $table->integer('print_limit')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->decimal('extra_hour_price', 12, 2)->nullable();
            $table->boolean('is_unlimited')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_variants');
    }
};
