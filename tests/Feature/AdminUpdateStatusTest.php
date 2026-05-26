<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ServicePackage;
use App\Models\PackageVariant;
use App\Models\PhotoTemplate;
use App\Models\UnavailableDate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUpdateStatusTest extends TestCase
{
    use RefreshDatabase;

    private function createBooking(): Booking
    {
        $package = ServicePackage::create([
            'name' => 'Wedding Pack',
            'category' => 'unlimited_print',
        ]);

        $variant = PackageVariant::create([
            'service_package_id' => $package->id,
            'name' => '3 Hours',
            'duration_hours' => 3,
            'print_limit' => 100,
            'price' => 3500000,
            'extra_hour_price' => 0,
            'is_unlimited' => false,
        ]);

        $template = PhotoTemplate::create([
            'name' => 'Classic Strip',
            'size' => '2x6',
        ]);

        return Booking::create([
            'booking_code' => 'MEMO-20260602-USTTS',
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '08123456789',
            'event_name' => 'Wedding John & Jane',
            'event_location' => 'Jakarta',
            'event_date' => '2026-06-02',
            'event_datetime' => '2026-06-02 18:00:00',
            'service_package_id' => $package->id,
            'package_variant_id' => $variant->id,
            'selected_template_id' => $template->id,
            'status' => 'pending_approval',
            'payment_status' => 'unpaid',
            'total_price' => 3500000,
        ]);
    }

    public function test_admin_can_call_update_status_route(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $booking = $this->createBooking();

        $response = $this->actingAs($admin)->postJson("/admin/api/bookings/{$booking->id}/status", [
            'status' => 'cancelled',
            'notes' => 'Manual cancel by admin',
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['success' => true]);

        $this->assertEquals('cancelled', $booking->fresh()->status);
        $this->assertNotNull($booking->fresh()->cancelled_at);
    }
}

