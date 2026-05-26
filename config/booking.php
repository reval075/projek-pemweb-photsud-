<?php

return [

    /*
    |--------------------------------------------------------------------------
    | DP Expiration Time (Hours)
    |--------------------------------------------------------------------------
    |
    | The number of hours a customer has to pay the Down Payment after
    | their booking is approved (status = waiting_dp). After this time,
    | the booking will be automatically set to 'expired' by the scheduler.
    |
    | Override via .env: BOOKING_DP_EXPIRATION_HOURS=12
    |
    */
    'dp_expiration_hours' => env('BOOKING_DP_EXPIRATION_HOURS', 12),

    /*
    |--------------------------------------------------------------------------
    | Payment Proof Upload (KB)
    |--------------------------------------------------------------------------
    */
    'payment_proof_max_kb' => env('BOOKING_PAYMENT_PROOF_MAX_KB', 5120),

];
