<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\ServicePackage;
use App\Models\PackageVariant;
use App\Models\Addon;
use App\Models\PhotoTemplate;
use App\Models\UnavailableDate;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Store a newly created booking (Guest).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:30',
            'event_name' => 'required|string|max:255',
            'event_location' => 'required|string|max:255',
            'event_datetime' => 'required|date|after_or_equal:today',
            'service_package_id' => 'required|exists:service_packages,id',
            'package_variant_id' => 'required|exists:package_variants,id',
            'selected_template_id' => 'required|exists:photo_templates,id',
            'notes' => 'nullable|string',
            'addons' => 'nullable|array', // e.g. [['id' => 1, 'quantity' => 2]]
            'addons.*.id' => 'exists:addons,id',
            'addons.*.quantity' => 'integer|min:1',
        ]);

        $eventDatetime = Carbon::parse($validated['event_datetime']);
        $eventDate = $eventDatetime->toDateString();

        // 1. Check manual blocks
        if (UnavailableDate::where('date', $eventDate)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Tanggal ini tidak tersedia untuk pemesanan.',
                'data' => null,
                'errors' => null,
            ], 422);
        }

        // 2. Check if date has been reserved (confirmed/completed bookings)
        $isReserved = Booking::where('event_date', $eventDate)
            ->whereIn('status', ['confirmed', 'completed'])
            ->exists();
        if ($isReserved) {
            return response()->json([
                'success' => false,
                'message' => 'Tanggal ini sudah dipesan (reserved) oleh pelanggan lain.',
                'data' => null,
                'errors' => null,
            ], 422);
        }

        // 3. Compute price
        $variant = PackageVariant::findOrFail($validated['package_variant_id']);
        if ($variant->service_package_id != $validated['service_package_id']) {
            return response()->json([
                'success' => false,
                'message' => 'Varian paket tidak cocok dengan paket jasa yang dipilih.',
                'data' => null,
                'errors' => null,
            ], 422);
        }

        $totalPrice = $variant->price;
        $addonData = [];

        if (!empty($validated['addons'])) {
            foreach ($validated['addons'] as $item) {
                $addon = Addon::findOrFail($item['id']);
                $quantity = $item['quantity'] ?? 1;
                $price = $addon->price * $quantity;
                $totalPrice += $price;

                $addonData[$addon->id] = [
                    'quantity' => $quantity,
                    'price' => $addon->price,
                ];
            }
        }

        // Generate booking code
        $datePart = $eventDatetime->format('Ymd');
        $randomPart = strtoupper(Str::random(5));
        $bookingCode = "MEMO-{$datePart}-{$randomPart}";

        $booking = DB::transaction(function () use ($validated, $bookingCode, $eventDate, $eventDatetime, $variant, $totalPrice, $addonData) {
            $booking = Booking::create([
                'booking_code' => $bookingCode,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'event_name' => $validated['event_name'],
                'event_location' => $validated['event_location'],
                'event_date' => $eventDate,
                'event_datetime' => $eventDatetime,
                'service_package_id' => $validated['service_package_id'],
                'package_variant_id' => $validated['package_variant_id'],
                'selected_template_id' => $validated['selected_template_id'],
                'notes' => $validated['notes'] ?? null,
                'status' => 'pending_approval',
                'payment_status' => 'unpaid',
                'total_price' => $totalPrice,
            ]);

            if (!empty($addonData)) {
                $booking->addons()->sync($addonData);
            }

            return $booking;
        });

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan booking berhasil diajukan! Silakan tunggu approval admin.',
            'data' => $booking->load(['servicePackage', 'packageVariant', 'selectedTemplate', 'addons']),
            'errors' => null,
        ], 201);
    }

    /**
     * List all bookings for admin.
     */
    public function adminIndex(Request $request)
    {
        $query = Booking::with(['servicePackage', 'packageVariant', 'selectedTemplate', 'addons', 'payments']);

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $bookings = $query->latest()->get();

        return response()->json(['data' => $bookings]);
    }

    /**
     * Approve a booking (Waiting DP).
     *
     * Transaction-safe: uses lockForUpdate to prevent race conditions
     * when two admins approve bookings on the same date simultaneously.
     */
    public function approve(Request $request, $id)
    {
        try {
            $booking = DB::transaction(function () use ($id) {
                // Lock the booking row to prevent concurrent modifications
                $booking = Booking::lockForUpdate()->findOrFail($id);

                if ($booking->status !== 'pending_approval') {
                    throw new \Exception('Booking tidak berstatus pending approval.');
                }

                // Lock and check if date has been reserved/locked in the meantime
                $isReserved = Booking::where('event_date', $booking->event_date)
                    ->where('id', '!=', $booking->id)
                    ->whereIn('status', ['confirmed', 'completed'])
                    ->lockForUpdate()
                    ->exists();

                if ($isReserved) {
                    throw new \Exception('Tanggal ini sudah dipesan/confirmed oleh event lain.');
                }

                // Calculate DP expiration deadline
                $expirationHours = config('booking.dp_expiration_hours', 12);
                $dpExpiredAt = now()->addHours($expirationHours);

                $booking->update([
                    'status' => 'waiting_dp',
                    'approved_by' => Auth::id(),
                    'approved_at' => now(),
                    'dp_expired_at' => $dpExpiredAt,
                ]);

                return $booking->fresh();
            });

            return response()->json([
                'success' => true,
                'message' => 'Booking disetujui! Menunggu pembayaran DP dari pelanggan (batas waktu: ' . $booking->dp_expired_at->format('d M Y H:i') . ').',
                'data' => $booking,
                'errors' => null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
                'errors' => null,
            ], 422);
        }
    }

    /**
     * Reject a booking.
     */
    public function reject(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->status !== 'pending_approval') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya booking pending yang dapat ditolak.',
                'data' => null,
                'errors' => null,
            ], 422);
        }

        $booking->update([
            'status' => 'rejected',
            'notes' => $request->input('notes') ?? $booking->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil ditolak.',
            'data' => $booking,
            'errors' => null,
        ]);
    }

    /**
     * Guest uploads a payment proof (DP or Settlement).
     *
     * Guards against expired/cancelled/rejected bookings.
     */
    public function uploadProof(Request $request)
    {
        $validated = $request->validate([
            'booking_code' => 'required|exists:bookings,booking_code',
            'amount' => 'required|numeric|min:0',
            'payment_type' => 'required|in:dp,settlement,full_payment',
            'payment_method' => 'required|string|max:255',
            'proof_image' => 'required|string', // Base64 or URL/path
        ]);

        $booking = Booking::where('booking_code', $validated['booking_code'])->firstOrFail();

        // Guard: reject upload for expired/cancelled/rejected bookings
        if (in_array($booking->status, ['expired', 'cancelled', 'rejected', 'completed'])) {
            return response()->json([
                'success' => false,
                'message' => 'Booking ini sudah ' . $booking->status . ' dan tidak dapat menerima pembayaran.',
                'data' => null,
                'errors' => null,
            ], 422);
        }

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'amount' => $validated['amount'],
            'payment_type' => $validated['payment_type'],
            'payment_method' => $validated['payment_method'],
            'proof_image' => $validated['proof_image'],
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bukti pembayaran berhasil diunggah dan sedang ditinjau admin.',
            'data' => $payment,
            'errors' => null,
        ], 201);
    }

    /**
     * Verify a payment record (Admin).
     *
     * Transaction-safe with pessimistic locking:
     * - lockForUpdate on payment prevents double verification
     * - lockForUpdate on booking prevents concurrent state changes
     * - lockForUpdate on same-date bookings prevents double confirmation
     */
    public function verifyPayment(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,rejected',
        ]);

        // Handle rejection outside transaction (simpler, no race condition risk)
        if ($validated['status'] === 'rejected') {
            $payment = Payment::findOrFail($id);

            if ($payment->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Pembayaran ini sudah diverifikasi sebelumnya.',
                    'data' => null,
                    'errors' => null,
                ], 422);
            }

            $payment->update([
                'status' => 'rejected',
                'verified_by' => Auth::id(),
                'verified_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pembayaran berhasil ditolak.',
                'data' => $payment,
                'errors' => null,
            ]);
        }

        // Verification flow with pessimistic locking
        try {
            $result = DB::transaction(function () use ($id) {
                // 1. Lock the payment row — prevents double verification
                $payment = Payment::lockForUpdate()->findOrFail($id);

                if ($payment->status !== 'pending') {
                    throw new \Exception('Pembayaran ini sudah diverifikasi sebelumnya.');
                }

                // 2. Lock the booking row — prevents concurrent state changes
                $booking = Booking::lockForUpdate()->findOrFail($payment->booking_id);

                // Guard: reject verification for expired/cancelled bookings
                if (in_array($booking->status, ['expired', 'cancelled', 'rejected'])) {
                    throw new \Exception('Booking sudah ' . $booking->status . ' dan tidak dapat diverifikasi.');
                }

                // 3. Verify the payment
                $payment->update([
                    'status' => 'verified',
                    'verified_by' => Auth::id(),
                    'verified_at' => now(),
                    'paid_at' => now(),
                ]);

                // 4. Update booking status based on payment type
                if ($payment->payment_type === 'dp') {
                    // Guard: check for DP payment that booking is still waiting_dp
                    if ($booking->status !== 'waiting_dp') {
                        throw new \Exception('Booking tidak berstatus waiting_dp untuk verifikasi DP.');
                    }

                    // 5. Lock and check no other confirmed booking exists on same date
                    $conflictExists = Booking::where('event_date', $booking->event_date)
                        ->where('id', '!=', $booking->id)
                        ->whereIn('status', ['confirmed', 'completed'])
                        ->lockForUpdate()
                        ->exists();

                    if ($conflictExists) {
                        throw new \Exception('Tanggal ini sudah dikonfirmasi oleh booking lain. Tidak dapat melakukan double confirmation.');
                    }

                    $booking->update([
                        'status' => 'confirmed',
                        'confirmed_at' => now(),
                        'payment_status' => 'partially_paid',
                    ]);

                    // 6. Auto-cancel competing bookings on the same date (inside transaction)
                    Booking::where('event_date', $booking->event_date)
                        ->where('id', '!=', $booking->id)
                        ->whereIn('status', ['pending_approval', 'waiting_dp'])
                        ->update([
                            'status' => 'cancelled',
                            'cancelled_at' => now(),
                            'notes' => 'Otomatis dibatalkan karena pelanggan lain telah membayar DP terlebih dahulu pada tanggal ini.'
                        ]);

                } elseif ($payment->payment_type === 'settlement' || $payment->payment_type === 'full_payment') {
                    $booking->update([
                        'payment_status' => 'paid',
                    ]);
                    if ($booking->status !== 'confirmed') {
                        $booking->update([
                            'status' => 'confirmed',
                            'confirmed_at' => now(),
                        ]);
                    }
                }

                return $payment->fresh()->load('booking');
            });

            return response()->json([
                'success' => true,
                'message' => 'Pembayaran berhasil diverifikasi dan dikonfirmasi!',
                'data' => $result,
                'errors' => null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
                'errors' => null,
            ], 422);
        }
    }

    /**
     * Mark booking as completed (Admin).
     */
    public function complete($id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->status !== 'confirmed') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya booking terkonfirmasi (confirmed) yang dapat diselesaikan.',
                'data' => null,
                'errors' => null,
            ], 422);
        }

        $booking->update([
            'status' => 'completed',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Event berhasil diselesaikan!',
            'data' => $booking,
            'errors' => null,
        ]);
    }

    /**
     * Cancel a booking.
     */
    public function cancel($id)
    {
        $booking = Booking::findOrFail($id);

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibatalkan.',
            'data' => $booking,
            'errors' => null,
        ]);
    }
}
