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
            $table->dateTime('event_datetime')->nullable()->after('event_date');
            $table->foreignId('package_variant_id')->nullable()->after('service_package_id')->constrained('package_variants')->onDelete('set null');
            $table->foreignId('selected_template_id')->nullable()->after('package_variant_id')->constrained('photo_templates')->onDelete('set null');
            $table->timestamp('confirmed_at')->nullable()->after('approved_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['package_variant_id']);
            $table->dropForeign(['selected_template_id']);
            $table->dropColumn(['event_datetime', 'package_variant_id', 'selected_template_id', 'confirmed_at']);
        });
    }
};
