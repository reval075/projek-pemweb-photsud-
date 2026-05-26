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
        Schema::create('photo_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('size')->default('4R'); // e.g. 4R, 2x6 strip
            $table->string('preview_image')->nullable();
            $table->string('frame_type')->nullable(); // e.g. vintage, modern, neon
            $table->string('layout_type')->nullable(); // e.g. 3-grid, 4-grid, single
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photo_templates');
    }
};
