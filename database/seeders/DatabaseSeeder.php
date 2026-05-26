<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;
use App\Models\Booth;
use App\Models\Package;
use App\Models\RentalEquipment;
use App\Models\Availability;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Default Admin User
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@memoforia.com'],
            [
                'name' => 'Admin Memoforia',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // 1. Branches
        $branch1 = Branch::create([
            'name' => 'Studio Pusat Jakarta',
            'address' => 'Jl. Sudirman No. 1, Jakarta Pusat',
            'phone' => '081234567890',
            'is_active' => true,
        ]);

        $branch2 = Branch::create([
            'name' => 'Cabang Bandung',
            'address' => 'Jl. Braga No. 10, Bandung',
            'phone' => '089876543210',
            'is_active' => true,
        ]);

        // 2. Booths
        $booth1 = Booth::create([
            'branch_id' => $branch1->id,
            'name' => 'Booth A - Vintage',
            'status' => 'active',
        ]);

        $booth2 = Booth::create([
            'branch_id' => $branch1->id,
            'name' => 'Booth B - Neon',
            'status' => 'active',
        ]);

        $booth3 = Booth::create([
            'branch_id' => $branch2->id,
            'name' => 'Booth C - Minimalist',
            'status' => 'active',
        ]);

        // 3. Packages
        Package::create([
            'name' => 'Paket Basic',
            'price' => 50000,
            'duration' => '15 Menit',
            'description' => '2 Lembar cetak + Softcopy via Email',
        ]);

        Package::create([
            'name' => 'Paket Premium',
            'price' => 80000,
            'duration' => '30 Menit',
            'description' => '4 Lembar cetak + Softcopy + GIF Animation',
        ]);

        // 3a. Service Packages & Varian
        $softfile = \App\Models\ServicePackage::create([
            'name' => 'Soft File Only',
            'category' => 'soft_file',
            'description' => 'Foto sepuasnya tanpa cetak fisik, semua file resolusi tinggi dikirim via digital link.',
            'is_active' => true,
        ]);

        \App\Models\PackageVariant::create([
            'service_package_id' => $softfile->id,
            'name' => '1 Jam Session',
            'duration_hours' => 1,
            'price' => 750000,
            'extra_hour_price' => 350000,
            'is_unlimited' => true,
        ]);

        \App\Models\PackageVariant::create([
            'service_package_id' => $softfile->id,
            'name' => '2 Jam Session',
            'duration_hours' => 2,
            'price' => 1200000,
            'extra_hour_price' => 300000,
            'is_unlimited' => true,
        ]);

        $basicUnlimited = \App\Models\ServicePackage::create([
            'name' => 'Basic Unlimited',
            'category' => 'unlimited_print',
            'description' => 'Cetak foto sepuasnya dengan layout strip klasik, perlengkapan standar studio.',
            'is_active' => true,
        ]);

        \App\Models\PackageVariant::create([
            'service_package_id' => $basicUnlimited->id,
            'name' => '2 Jam Unlimited',
            'duration_hours' => 2,
            'price' => 1800000,
            'extra_hour_price' => 500000,
            'is_unlimited' => true,
        ]);

        \App\Models\PackageVariant::create([
            'service_package_id' => $basicUnlimited->id,
            'name' => '3 Jam Unlimited',
            'duration_hours' => 3,
            'price' => 2400000,
            'extra_hour_price' => 450000,
            'is_unlimited' => true,
        ]);

        $premiumUnlimited = \App\Models\ServicePackage::create([
            'name' => 'Premium Unlimited',
            'category' => 'unlimited_print',
            'description' => 'Cetak sepuasnya, kualitas premium, kustomisasi layout frame, pencahayaan studio profesional, 2 crew.',
            'is_active' => true,
        ]);

        \App\Models\PackageVariant::create([
            'service_package_id' => $premiumUnlimited->id,
            'name' => '3 Jam Premium',
            'duration_hours' => 3,
            'price' => 3500000,
            'extra_hour_price' => 800000,
            'is_unlimited' => true,
        ]);

        $limitedPrints = \App\Models\ServicePackage::create([
            'name' => 'Limited Prints',
            'category' => 'limited_print',
            'description' => 'Cetak dengan batasan jumlah lembar, cocok untuk event skala kecil atau perorangan.',
            'is_active' => true,
        ]);

        \App\Models\PackageVariant::create([
            'service_package_id' => $limitedPrints->id,
            'name' => '100 Lembar Cetak',
            'print_limit' => 100,
            'price' => 1500000,
            'is_unlimited' => false,
        ]);

        \App\Models\PackageVariant::create([
            'service_package_id' => $limitedPrints->id,
            'name' => '200 Lembar Cetak',
            'print_limit' => 200,
            'price' => 2200000,
            'is_unlimited' => false,
        ]);

        // 3b. Addons
        \App\Models\Addon::create([
            'name' => 'Gantungan Kunci / Keychain',
            'description' => 'Gantungan kunci akrilik bening untuk menyisipkan cetakan foto (per pcs).',
            'price' => 10000,
            'is_active' => true,
        ]);

        \App\Models\Addon::create([
            'name' => 'Custom Background / Backdrop',
            'description' => 'Kustomisasi backdrop cetak digital sesuai tema acara.',
            'price' => 500000,
            'is_active' => true,
        ]);

        \App\Models\Addon::create([
            'name' => 'Extra 1 Hour',
            'description' => 'Penambahan durasi operational photobooth sebanyak 1 jam.',
            'price' => 400000,
            'is_active' => true,
        ]);

        // 3c. Photo Templates
        \App\Models\PhotoTemplate::create([
            'name' => 'Classic 2x6 Strip',
            'size' => '2x6',
            'preview_image' => 'classic_strip.png',
            'frame_type' => 'Classic',
            'layout_type' => '3-Grid Vertical',
            'is_active' => true,
        ]);

        \App\Models\PhotoTemplate::create([
            'name' => 'Modern 4R Square',
            'size' => '4R',
            'preview_image' => 'modern_4r.png',
            'frame_type' => 'Minimalist',
            'layout_type' => '4-Grid Grid',
            'is_active' => true,
        ]);

        \App\Models\PhotoTemplate::create([
            'name' => 'Elegant Single 4R',
            'size' => '4R',
            'preview_image' => 'elegant_single.png',
            'frame_type' => 'Vintage',
            'layout_type' => 'Single Portrait',
            'is_active' => true,
        ]);

        // 4. Rental Equipments
        RentalEquipment::create([
            'name' => 'Kamera Canon EOS R5',
            'category' => 'Kamera',
            'stock' => 2,
            'price_per_day' => 350000,
            'description' => 'Kamera mirrorless full-frame',
            'status' => 'available',
        ]);

        RentalEquipment::create([
            'name' => 'Lensa Sony FE 50mm f/1.8',
            'category' => 'Lensa',
            'stock' => 3,
            'price_per_day' => 100000,
            'description' => 'Lensa fix',
            'status' => 'available',
        ]);

        RentalEquipment::create([
            'name' => 'Lighting Godox SL60W',
            'category' => 'Lighting',
            'stock' => 5,
            'price_per_day' => 75000,
            'description' => 'Lampu continuous untuk video dan foto',
            'status' => 'available',
        ]);

        // 5. Availabilities (Sample slots for today and tomorrow)
        $today = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        $slots = [
            ['10:00:00', '11:00:00'],
            ['11:00:00', '12:00:00'],
            ['13:00:00', '14:00:00'],
            ['14:00:00', '15:00:00'],
            ['15:00:00', '16:00:00'],
            ['16:00:00', '17:00:00'],
        ];

        foreach ([$booth1, $booth2, $booth3] as $booth) {
            foreach ([$today, $tomorrow] as $date) {
                foreach ($slots as $slot) {
                    Availability::create([
                        'booth_id' => $booth->id,
                        'date' => $date->format('Y-m-d'),
                        'start_time' => $slot[0],
                        'end_time' => $slot[1],
                        'status' => 'available'
                    ]);
                }
            }
        }
    }
}
