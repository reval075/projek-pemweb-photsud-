<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Booking;
use App\Models\ServicePackage;
use App\Models\UnavailableDate;
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
            'price' => 3000000,
        ]);

        $booking = Booking::create([
            'booking_code' => 'MEMO-20260602-ABCDE',
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '08123456789',
            'event_name' => 'Wedding John & Jane',
            'event_location' => 'Jakarta',
            'event_date' => '2026-06-02',
            'service_package_id' => $package->id,
            'status' => 'approved',
            'total_price' => $package->price,
        ]);

        $response = $this->getJson('/api/availabilities?start_date=2026-06-01&end_date=2026-06-05');

        $response->assertStatus(200);
        $response->assertJson([
            'unavailable_dates' => ['2026-06-01'],
            'booked_dates' => ['2026-06-02'],
        ]);
    }

    /**
     * Test guest can submit booking request on available date.
     */
    public function test_guest_can_submit_booking_request_on_available_date(): void
    {
        $package = ServicePackage::create([
            'name' => 'Wedding Pack',
            'price' => 3000000,
        ]);

        $response = $this->postJson('/api/bookings', [
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '08123456789',
            'event_name' => 'Wedding John & Jane',
            'event_location' => 'Jakarta',
            'event_date' => '2026-06-10',
            'service_package_id' => $package->id,
            'notes' => 'Some special instructions',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('bookings', [
            'customer_name' => 'John Doe',
            'event_date' => '2026-06-10',
            'status' => 'pending_approval',
            'payment_status' => 'unpaid',
            'total_price' => 3000000,
        ]);

        $booking = Booking::first();
        $this->assertNotNull($booking->booking_code);
        $this->assertStringStartsWith('MEMO-', $booking->booking_code);
    }

    /**
     * Test guest cannot submit booking on blocked/unavailable date.
     */
    public function test_guest_cannot_submit_booking_on_blocked_date(): void
    {
        $package = ServicePackage::create([
            'name' => 'Wedding Pack',
            'price' => 3000000,
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
            'event_date' => '2026-06-01',
            'service_package_id' => $package->id,
        ]);

        $response->assertStatus(422);
    }

    /**
     * Test admin can approve booking and other pending bookings on same date are auto-rejected.
     */
    public function test_admin_can_approve_booking_and_auto_reject_conflicting_pending_bookings(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $package = ServicePackage::create([
            'name' => 'Wedding Pack',
            'price' => 3000000,
        ]);

        $booking1 = Booking::create([
            'booking_code' => 'MEMO-20260602-AAAAA',
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            'customer_phone' => '08123456789',
            'event_name' => 'Wedding John & Jane',
            'event_location' => 'Jakarta',
            'event_date' => '2026-06-02',
            'service_package_id' => $package->id,
            'status' => 'pending_approval',
            'total_price' => $package->price,
        ]);

        $booking2 = Booking::create([
            'booking_code' => 'MEMO-20260602-BBBBB',
            'customer_name' => 'Alice',
            'customer_email' => 'alice@example.com',
            'customer_phone' => '08123456789',
            'event_name' => 'Alice Birthday',
            'event_location' => 'Jakarta',
            'event_date' => '2026-06-02',
            'service_package_id' => $package->id,
            'status' => 'pending_approval',
            'total_price' => $package->price,
        ]);

        // Access without authentication -> should redirect or fail
        $response = $this->postJson("/admin/api/bookings/{$booking1->id}/approve");
        $response->assertStatus(401);

        // Authenticate admin
        $response = $this->actingAs($admin)->postJson("/admin/api/bookings/{$booking1->id}/approve");
        $response->assertStatus(200);

        $this->assertEquals('approved', $booking1->fresh()->status);
        $this->assertEquals('pending', $booking1->fresh()->payment_status);
        $this->assertEquals($admin->id, $booking1->fresh()->approved_by);

        // Conflicting booking on same date should be auto-rejected
        $this->assertEquals('rejected', $booking2->fresh()->status);
    }
}
