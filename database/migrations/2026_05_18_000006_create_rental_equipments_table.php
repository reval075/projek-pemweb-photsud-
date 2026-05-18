<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_equipments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->nullable();
            $table->integer('stock')->default(0);
            $table->decimal('price_per_day', 12, 2)->default(0);
            $table->text('description')->nullable();
            $table->text('image')->nullable();
            $table->enum('status', ['available','unavailable'])->default('available');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_equipments');
    }
};
