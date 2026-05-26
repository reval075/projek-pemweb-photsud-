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
