<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Booking;
use App\Models\ServicePackage;
use App\Models\PackageVariant;
use App\Models\Addon;
use App\Models\PhotoTemplate;
use App\Models\UnavailableDate;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test guest can retrieve calendar availability data.
     */
    public function test_guest_can_retrieve_calendar_availability(): void
    {
        $blocked = UnavailableDate::create([
            'date' => '2026-06-01',
            'reason' => 'Vendor off day'
        ]);

        $package = ServicePackage::create([
            'name' => 'Wedding Pack',
            'category' => 'unlimited_print',
        ]);

        $variant = PackageVariant::create([
            'service_package_id' => $package->id,
            'name' => '3 Hours',
            'price' => 3500000,
        ]);

        $template = PhotoTemplate::create([
            'name' => 'Classic Strip',
            'size' => '2x6',
        ]);

        // Unconfirmed booking -> should NOT lock the calendar
        Booking::create([
            'booking_code' => 'MEMO-20260602-AAAAA',
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
            'status' => 'waiting_dp',
            'total_price' => 3500000,
        ]);

        // Confirmed booking -> should lock the calendar
        Booking::create([
            'booking_code' => 'MEMO-20260603-BBBBB',
            'customer_name' => 'Jane Doe',
            'customer_email' => 'jane@example.com',
            'customer_phone' => '08123456789',
            'event_name' => 'Birthday Jane',
            'event_location' => 'Jakarta',
            'event_date' => '2026-06-03',
            'event_datetime' => '2026-06-03 15:00:00',
            'service_package_id' => $package->id,
            'package_variant_id' => $variant->id,
            'selected_template_id' => $template->id,
            'status' => 'confirmed',
            'total_price' => 3500000,
        ]);

        $response = $this->getJson('/api/availabilities?start_date=2026-06-01&end_date=2026-06-05');

        $response->assertStatus(200);
        $response->assertJson([
            'unavailable_dates' => ['2026-06-01'],
            'booked_dates' => ['2026-06-03'], // only locked dates
        ]);
    }

    /**
     * Test guest can submit booking request on available date with variants and addons.
     */
    public function test_guest_can_submit_booking_request_on_available_date(): void
    {
        $package = ServicePackage::create([
            'name' => 'Wedding Pack',
            'category' => 'unlimited_print',
        ]);

        $variant = PackageVariant::create([
            'service_package_id' => $package->id,
            'name' => '3 Hours',
            'price' => 3500000,
        ]);

        $template = PhotoTemplate::create([
            'name' => 'Classic Strip',
            'size' => '2x6',
        ]);

        $addon1 = Addon::create([
            'name' => 'Keychain',
            'price' => 10000,
        ]);

        $response = $this->postJson('/api/bookings', [
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '08123456789',
            'event_name' => 'Wedding John & Jane',
            'event_location' => 'Jakarta',
            'event_datetime' => '2026-06-10 17:30:00',
            'service_package_id' => $package->id,
            'package_variant_id' => $variant->id,
            'selected_template_id' => $template->id,
            'notes' => 'Some special instructions',
            'addons' => [
                ['id' => $addon1->id, 'quantity' => 10] // + 100k
            ]
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('bookings', [
            'customer_name' => 'John Doe',
            'event_date' => '2026-06-10',
            'status' => 'pending_approval',
            'payment_status' => 'unpaid',
            'total_price' => 3600000, // 3.5m + 10k * 10
        ]);

        $booking = Booking::first();
        $this->assertNotNull($booking->booking_code);
        $this->assertCount(1, $booking->addons);
        $this->assertEquals(10, $booking->addons->first()->pivot->quantity);
    }

    /**
     * Test guest cannot submit booking on blocked/unavailable date.
     */
    public function test_guest_cannot_submit_booking_on_blocked_date(): void
    {
        $package = ServicePackage::create([
            'name' => 'Wedding Pack',
            'category' => 'unlimited_print',
        ]);

        $variant = PackageVariant::create([
            'service_package_id' => $package->id,
            'name' => '3 Hours',
            'price' => 3500000,
        ]);

        $template = PhotoTemplate::create([
            'name' => 'Classic Strip',
            'size' => '2x6',
        ]);

        UnavailableDate::create([
            'date' => '2026-06-01',
            'reason' => 'Off day'
        ]);

        $response = $this->postJson('/api/bookings', [
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '08123456789',
            'event_name' => 'Wedding John & Jane',
            'event_location' => 'Jakarta',
            'event_datetime' => '2026-06-01 10:00:00',
            'service_package_id' => $package->id,
            'package_variant_id' => $variant->id,
            'selected_template_id' => $template->id,
        ]);

        $response->assertStatus(422);
    }

    /**
     * Test admin verifies DP payment which auto-cancels competing bookings on the same date.
     */
    public function test_admin_verifies_dp_payment_which_locks_date_and_auto_cancels_competing_bookings(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $package = ServicePackage::create([
            'name' => 'Wedding Pack',
            'category' => 'unlimited_print',
        ]);

        $variant = PackageVariant::create([
            'service_package_id' => $package->id,
            'name' => '3 Hours',
            'price' => 3500000,
        ]);

        $template = PhotoTemplate::create([
            'name' => 'Classic Strip',
            'size' => '2x6',
        ]);

        // Booking A (gets approved and pays DP)
        $bookingA = Booking::create([
            'booking_code' => 'MEMO-20260602-AAAAA',
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '08123456789',
            'event_name' => 'Wedding John & Jane',
            'event_location' => 'Jakarta',
            'event_date' => '2026-06-02',
            'event_datetime' => '2026-06-02 10:00:00',
            'service_package_id' => $package->id,
            'package_variant_id' => $variant->id,
            'selected_template_id' => $template->id,
            'status' => 'waiting_dp',
            'total_price' => 3500000,
        ]);

        // Booking B (gets approved but loses the race to pay DP)
        $bookingB = Booking::create([
            'booking_code' => 'MEMO-20260602-BBBBB',
            'customer_name' => 'Alice',
            'customer_email' => 'alice@example.com',
            'customer_phone' => '08123456789',
            'event_name' => 'Alice Birthday',
            'event_location' => 'Jakarta',
            'event_date' => '2026-06-02',
            'event_datetime' => '2026-06-02 15:00:00',
            'service_package_id' => $package->id,
            'package_variant_id' => $variant->id,
            'selected_template_id' => $template->id,
            'status' => 'waiting_dp',
            'total_price' => 3500000,
        ]);

        // Payment proof for Booking A
        $payment = Payment::create([
            'booking_id' => $bookingA->id,
            'amount' => 1000000, // DP amount
            'payment_type' => 'dp',
            'payment_method' => 'Bank Transfer',
            'proof_image' => 'dp_proof.png',
            'status' => 'pending',
        ]);

        // Admin verifies Booking A payment
        $response = $this->actingAs($admin)->postJson("/admin/api/payments/{$payment->id}/verify", [
            'status' => 'verified',
        ]);

        $response->assertStatus(200);

        // Booking A should be confirmed (Locked calendar!)
        $this->assertEquals('confirmed', $bookingA->fresh()->status);
        $this->assertEquals('partially_paid', $bookingA->fresh()->payment_status);

        // Booking B should be auto-cancelled due to date locked
        $this->assertEquals('cancelled', $bookingB->fresh()->status);
        $this->assertStringContainsString('Otomatis dibatalkan', $bookingB->fresh()->notes);
    }
}
